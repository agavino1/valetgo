# ValetGo — Arquitectura V1 (MVP)

- Frontend app: Next.js + PWA
- Backend API: Node/Express en Cloud Run
- Auth + DB: Supabase
- Pagos: Stripe
- Geolocalización/rutas: Google Maps
- Notificaciones: Telegram/Email (fase 1), push (fase 2)

## Entidades mínimas
- users
- drivers
- bookings
- booking_events
- payouts

## Flujos críticos
1. Crear reserva -> asignar conductor -> recoger -> aparcar -> devolver -> cerrar pago
2. Driver onboarding -> validación -> activación
