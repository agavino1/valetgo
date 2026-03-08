const GITHUB_API = 'https://api.github.com'

async function readGithubFile({ owner, repo, path, token }) {
  const r = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json'
    }
  })

  if (r.status === 404) return { exists: false, sha: null, content: '' }
  if (!r.ok) throw new Error(`github_read_failed_${r.status}`)

  const data = await r.json()
  const decoded = Buffer.from(data.content || '', 'base64').toString('utf8')
  return { exists: true, sha: data.sha, content: decoded }
}

async function writeGithubFile({ owner, repo, path, token, content, sha, message }) {
  const body = {
    message,
    content: Buffer.from(content, 'utf8').toString('base64'),
    sha: sha || undefined
  }

  const r = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!r.ok) {
    const t = await r.text()
    throw new Error(`github_write_failed_${r.status}_${t.slice(0, 120)}`)
  }
}

export default async function handler(req, res) {
  const owner = process.env.GH_REPO_OWNER
  const repo = process.env.GH_REPO_NAME
  const token = process.env.GH_TOKEN
  const storePath = process.env.WAITLIST_FILE_PATH || 'data/waitlist.json'

  if (!owner || !repo || !token) {
    return res.status(500).json({ ok: false, error: 'missing_backend_config' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const { name, email, city, type, phone, vehicleType } = req.body || {}

  if (!name || !email || !city || !type) {
    return res.status(400).json({ ok: false, error: 'missing_required_fields' })
  }

  if (!['cliente', 'conductor'].includes(type)) {
    return res.status(400).json({ ok: false, error: 'invalid_type' })
  }

  const row = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    city: String(city).trim(),
    type,
    phone: phone ? String(phone).trim() : null,
    vehicleType: vehicleType ? String(vehicleType).trim() : null,
    source: 'landing_v1',
    ts: new Date().toISOString()
  }

  try {
    const current = await readGithubFile({ owner, repo, path: storePath, token })
    const base = current.exists ? JSON.parse(current.content || '{"entries":[]}') : { entries: [] }
    base.entries = Array.isArray(base.entries) ? base.entries : []
    base.entries.push(row)

    await writeGithubFile({
      owner,
      repo,
      path: storePath,
      token,
      sha: current.sha,
      content: JSON.stringify(base, null, 2),
      message: `waitlist: +1 ${row.type} ${row.city}`
    })

    return res.status(201).json({ ok: true, item: row })
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'storage_error', detail: String(e.message || e) })
  }
}
