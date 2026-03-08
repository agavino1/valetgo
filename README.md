# ValetGo D1 — Landing pública (Madrid + multi-ciudad España)

## URL pública operativa
- **Producción:** https://valetgo.vercel.app

## Qué está entregado en D1
1. **Landing pública funcional** orientada a captación de clientes y conductores/riders.
2. **Formulario de waitlist dual** (`cliente` y `conductor`) en `/waitlist`.
3. **Persistencia backend real**: la API (`/api/waitlist`) guarda registros en `data/waitlist.json` del repo vía GitHub API.
4. **Copy no genérico** centrado en propuesta de valor para riders en tiempos muertos + foco Madrid y expansión nacional.

## Arquitectura D1 (simple y desplegable hoy)
- **Frontend + API**: Next.js (Vercel)
- **Endpoint backend**: `frontend/pages/api/waitlist.js`
- **Persistencia**: GitHub Contents API sobre `data/waitlist.json`

> Nota: existe también `backend/` (Express) para desarrollo local/alternativa, pero en producción D1 la captación usa la API de Next desplegada en Vercel.

## Variables de entorno (Vercel)
Necesarias para persistencia:
- `GH_TOKEN` (token con permisos de escritura al repo)
- `GH_REPO_OWNER` (ej. `agavino1`)
- `GH_REPO_NAME` (ej. `valetgo`)
- `WAITLIST_FILE_PATH` (ej. `data/waitlist.json`)

## Deploy (paso a paso)
### 1) Repo
```bash
git init
git add .
git commit -m "feat: valetgo d1"
gh repo create agavino1/valetgo --public --source=. --remote=origin --push
```

### 2) Link de Vercel en `frontend/`
```bash
cd frontend
vercel link --yes --project valetgo --token "$VERCEL_TOKEN"
```

### 3) Cargar env vars en Vercel
```bash
printf "%s" "$GH_TOKEN" | vercel env add GH_TOKEN production --token "$VERCEL_TOKEN"
printf "agavino1" | vercel env add GH_REPO_OWNER production --token "$VERCEL_TOKEN"
printf "valetgo" | vercel env add GH_REPO_NAME production --token "$VERCEL_TOKEN"
printf "data/waitlist.json" | vercel env add WAITLIST_FILE_PATH production --token "$VERCEL_TOKEN"
```

### 4) Deploy
```bash
vercel --prod --yes --token "$VERCEL_TOKEN"
```

## Estado actual
- ✅ Producción publicada en `https://valetgo.vercel.app`
- ✅ POST `/api/waitlist` probado en producción (inserta registro)
- ✅ Persistencia verificada en `data/waitlist.json` del repo
- ⚠️ Siguiente recomendado D2: mover persistencia a DB (Neon/Supabase) + dashboard interno + anti-spam (rate-limit + honeypot)
