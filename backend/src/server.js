import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import path from 'node:path'

const app = express()
app.use(cors())
app.use(express.json())

const DATA_DIR = path.resolve(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'waitlist.json')

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ entries: [] }, null, 2), 'utf8')
  }
}

function loadStore() {
  ensureStore()
  const raw = fs.readFileSync(DATA_FILE, 'utf8')
  const parsed = JSON.parse(raw || '{}')
  return Array.isArray(parsed.entries) ? parsed : { entries: [] }
}

function saveStore(store) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf8')
}

app.get('/health', (_req, res) => {
  const store = loadStore()
  res.json({ ok: true, service: 'valetgo-api', total: store.entries.length })
})

app.post('/api/waitlist', (req, res) => {
  const { name, email, city, type, phone, vehicleType, zones } = req.body || {}

  if (!name || !email || !city || !type) {
    return res.status(400).json({ ok: false, error: 'missing_required_fields' })
  }

  if (!['cliente', 'conductor'].includes(type)) {
    return res.status(400).json({ ok: false, error: 'invalid_type' })
  }

  const store = loadStore()
  const item = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    city: String(city).trim(),
    phone: phone ? String(phone).trim() : null,
    vehicleType: vehicleType ? String(vehicleType).trim() : null,
    zones: Array.isArray(zones) ? zones : [],
    ts: new Date().toISOString()
  }

  store.entries.push(item)
  saveStore(store)

  res.status(201).json({ ok: true, item })
})

app.get('/api/waitlist', (req, res) => {
  const store = loadStore()
  const type = req.query.type
  const filtered = type ? store.entries.filter((e) => e.type === type) : store.entries
  res.json({ ok: true, total: filtered.length, items: filtered.slice(-200).reverse() })
})

const port = process.env.PORT || 3020
app.listen(port, () => console.log(`valetgo api on :${port}`))
