# Lumière Nail Atelier — PRD

## Original Problem Statement
"i want to build website for my client is the nail an art salon ok this is for fetues are apponiment booing srvices prices and dicsount privoous work payment getways"

## User Choices
- Payment gateway: **Stripe** (Flow B / BYOK using `sk_test_emergent` — India is not supported for claimable sandbox)
- Booking flow: **Service + Stylist + Date + Time**
- Content: **Sample luxury salon data** (name: Lumière, Lisbon address, sample services & artists)
- Admin dashboard: **No** (customer-facing only)
- Design vibe: **Elegant/luxury + Minimal modern** (Dark Luxury Minimalist theme with Cormorant Garamond + Manrope)

## Architecture
- Backend: FastAPI (`/app/backend/server.py`) + MongoDB
- Frontend: React 19 + React Router 7 + Tailwind + Shadcn UI + Framer Motion + Lenis smooth scroll
- Payments: `emergentintegrations.payments.stripe.checkout` (Flow B)

## Data Models (MongoDB)
- `bookings`: id, service_id, service_name, stylist_id, stylist_name, date, time, amount, customer_*, notes, payment_status, session_id, created_at
- `payment_transactions`: session_id, booking_id, amount, currency, status, payment_status, timestamps

## API Endpoints
- `GET /api/services`, `GET /api/stylists`, `GET /api/availability`
- `POST /api/bookings`, `GET /api/bookings/{id}`
- `POST /api/payments/checkout`, `GET /api/payments/status/{session_id}`
- `POST /api/webhook/stripe`

## Implemented (Feb 2026)
- Landing page: Hero with parallax, Manifesto, Services list (6 services with discounts), Portfolio "Tetris" grid (6 tiles), Stylists (3), Testimonials with background image, Contact footer
- 5-step booking flow: Service → Stylist → Date (Shadcn Calendar) → Time → Details → Stripe checkout redirect
- Payment success page with polling + confirmation card
- Payment cancel page
- Real-time slot availability (409 on double-book)
- Discounted price display in services list & booking flow

## Sample Content
- Services: Classic Manicure ($45), Signature Gel ($68→$58), Editorial Nail Art ($120→$99), Gel Extensions ($145), Luxe Pedicure ($85), Chrome Couture ($95→$79)
- Stylists: Amelia Vance (Creative Director), Inés Moreau (Senior), Kai Tanaka (Master)
- Address: Rua do Chiado 42, 1200-108 Lisboa, Portugal · +351 21 555 0142

## Backlog / P1
- Email confirmation via Resend integration
- SMS reminder via Twilio
- Loyalty membership tier (member-only discounted prices)
- Instagram feed embed for live portfolio
- Multi-language (PT / EN)
- Admin dashboard (deferred — user opted out)

## Test Credentials
See `/app/memory/test_credentials.md`. Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC.
