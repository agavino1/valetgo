import { useState } from 'react'

const CITIES = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Málaga', 'Bilbao', 'Zaragoza']

export default function Waitlist() {
  const [ok, setOk] = useState('')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    setOk('')

    const fd = new FormData(e.target)
    const payload = Object.fromEntries(fd.entries())

    try {
      const r = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await r.json()
      if (!r.ok || !data?.ok) throw new Error(data?.error || 'No se pudo enviar el formulario')
      setOk(payload.type)
      e.target.reset()
    } catch (err) {
      setError(err.message || 'Error enviando formulario')
    }
  }

  return (
    <main style={{ fontFamily: 'Inter,system-ui', maxWidth: 960, margin: '40px auto', padding: '0 16px' }}>
      <h1>Waitlist ValetGo</h1>
      <p>Dos accesos: clientes y conductores/riders. Madrid primero, multi-ciudad España.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginTop: 20 }}>
        <section style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>Soy cliente</h2>
          <p>Quiero ahorrar tiempo de aparcamiento y delegar recogida/entrega.</p>
          <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
            <input type='hidden' name='type' value='cliente' />
            <input name='name' placeholder='Nombre y apellidos' required />
            <input name='email' type='email' placeholder='Email' required />
            <input name='phone' placeholder='Teléfono (opcional)' />
            <select name='city' defaultValue='Madrid' required>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type='submit'>Entrar como cliente</button>
          </form>
        </section>

        <section style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>Soy conductor / rider</h2>
          <p>Quiero aprovechar horas valle con servicios cortos y pagos trazables.</p>
          <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
            <input type='hidden' name='type' value='conductor' />
            <input name='name' placeholder='Nombre y apellidos' required />
            <input name='email' type='email' placeholder='Email' required />
            <input name='phone' placeholder='Teléfono' required />
            <select name='city' defaultValue='Madrid' required>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input name='vehicleType' placeholder='Vehículo (moto, coche, bici...)' />
            <button type='submit'>Entrar como conductor</button>
          </form>
        </section>
      </div>

      {ok && <p style={{ color: '#166534', marginTop: 16 }}>✅ Alta enviada ({ok}). Te contactaremos con el piloto de tu ciudad.</p>}
      {error && <p style={{ color: '#b91c1c', marginTop: 16 }}>❌ {error}</p>}
    </main>
  )
}
