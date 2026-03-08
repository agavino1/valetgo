# ValetGo (MVP)

App multi-ciudad para valet parking on-demand (arranque en Madrid).

## Estructura
- `frontend/` App cliente/conductor (Next.js)
- `backend/` API operaciones (Express)
- `docs/` Brief + arquitectura

## Arranque rápido
```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

### Variables útiles
- `VALETGO_API_URL` (frontend server-side): URL base del backend (default `http://127.0.0.1:3020`)

## MVP D1
- Landing + waitlist
- Flujo solicitud servicio
- Flujo aceptación conductor
- API health + solicitudes (stub)
