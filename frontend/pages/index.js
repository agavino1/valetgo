const CITIES = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Málaga', 'Bilbao', 'Zaragoza']

export default function Home() {
  return (
    <main style={{ fontFamily: 'Inter,system-ui', maxWidth: 1024, margin: '40px auto', padding: '0 16px', lineHeight: 1.5 }}>
      <h1>ValetGo Madrid</h1>
      <p style={{ fontSize: 18 }}>
        Convierte los tiempos muertos en ingresos y evita vueltas infinitas para aparcar.
        <strong> Empezamos en Madrid</strong> y abrimos lista de espera para escalar por toda España.
      </p>

      <section style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, margin: '20px 0' }}>
        <h2 style={{ marginTop: 0 }}>Propuesta de valor real</h2>
        <ul>
          <li><strong>Para clientes:</strong> recogida/entrega del coche donde te venga bien, sin perder 30-45 min buscando plaza.</li>
          <li><strong>Para conductores/riders:</strong> monetiza franjas sin pedidos (mediodía y media tarde) con rutas cortas en tu zona.</li>
          <li><strong>Para ciudades:</strong> menos vueltas de búsqueda, menos congestión y experiencia premium de movilidad.</li>
        </ul>
      </section>

      <section>
        <h2>Ciudades en apertura</h2>
        <p>Madrid activo (prioridad). Pre-registro multi-ciudad:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {CITIES.map((c) => (
            <span key={c} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 999 }}>{c}</span>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <a href="/waitlist" style={{ display: 'inline-block', padding: '10px 14px', background: '#111827', color: 'white', borderRadius: 8, textDecoration: 'none' }}>
          Quiero entrar en la waitlist (clientes y conductores)
        </a>
      </section>
    </main>
  )
}
