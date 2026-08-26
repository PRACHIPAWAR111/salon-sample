from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, date, time, timedelta

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout, CheckoutSessionRequest, CheckoutSessionResponse,
    CheckoutStatusResponse,
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

STRIPE_API_KEY = os.environ.get("STRIPE_API_KEY", "sk_test_emergent")

# ---------------- Sample Data ----------------
SERVICES = [
    {
        "id": "classic-mani",
        "name": "Classic Manicure",
        "category": "Manicure",
        "description": "Timeless nail shaping, cuticle refinement, and a rich single-tone polish finish.",
        "price": 1200.0,
        "duration_min": 45,
        "discount_price": None,
    },
    {
        "id": "signature-gel",
        "name": "Signature Gel Manicure",
        "category": "Manicure",
        "description": "Long-wear gel finish with a hydrating hand ritual and buffed nail architecture.",
        "price": 1800.0,
        "duration_min": 60,
        "discount_price": 1500.0,
    },
    {
        "id": "editorial-art",
        "name": "Editorial Nail Art",
        "category": "Nail Art",
        "description": "Bespoke hand-painted art. Marble, chrome, tortoise, or your own creative reference.",
        "price": 3200.0,
        "duration_min": 90,
        "discount_price": 2700.0,
    },
    {
        "id": "gel-extensions",
        "name": "Gel Extensions",
        "category": "Extensions",
        "description": "Featherweight sculpted extensions in your preferred shape and length.",
        "price": 3900.0,
        "duration_min": 105,
        "discount_price": None,
    },
    {
        "id": "luxe-pedi",
        "name": "Luxe Pedicure",
        "category": "Pedicure",
        "description": "Warm soak, exfoliation, extended massage, and a mirror-finish polish.",
        "price": 2200.0,
        "duration_min": 75,
        "discount_price": None,
    },
    {
        "id": "chrome-couture",
        "name": "Chrome Couture",
        "category": "Nail Art",
        "description": "Reflective liquid chrome pigment sealed under a diamond-grade top coat.",
        "price": 2500.0,
        "duration_min": 75,
        "discount_price": 2100.0,
    },
]

STYLISTS = [
    {"id": "s-aanya", "name": "Aanya Kapoor", "title": "Creative Director", "bio": "Featured in Vogue India and Grazia. Fifteen years of couture nail technique across Mumbai and Milan.", "image": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80"},
    {"id": "s-meher", "name": "Meher Sethi", "title": "Senior Nail Artist", "bio": "Specialist in hand-painted micro-detail, bridal sets, and 3D sculptural work.", "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80"},
    {"id": "s-rhea", "name": "Rhea Nair", "title": "Master Technician", "bio": "Precision structured manicures and Japanese gel technique. Trained in Tokyo.", "image": "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&q=80"},
]

TIME_SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"]

# ---------------- Models ----------------
class Service(BaseModel):
    id: str
    name: str
    category: str
    description: str
    price: float
    duration_min: int
    discount_price: Optional[float] = None

class Stylist(BaseModel):
    id: str
    name: str
    title: str
    bio: str
    image: str

class BookingCreate(BaseModel):
    service_id: str
    stylist_id: str
    date: str  # YYYY-MM-DD
    time: str  # HH:MM
    customer_name: str
    customer_email: str
    customer_phone: str
    notes: Optional[str] = ""

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    service_id: str
    service_name: str
    stylist_id: str
    stylist_name: str
    date: str
    time: str
    amount: float
    customer_name: str
    customer_email: str
    customer_phone: str
    notes: Optional[str] = ""
    payment_status: str = "pending"
    session_id: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class CheckoutRequest(BaseModel):
    booking_id: str
    origin_url: str

# ---------------- Routes ----------------
@api_router.get("/")
async def root():
    return {"message": "Lumière Nail Atelier API"}

@api_router.get("/services", response_model=List[Service])
async def get_services():
    return SERVICES

@api_router.get("/stylists", response_model=List[Stylist])
async def get_stylists():
    return STYLISTS

@api_router.get("/availability")
async def get_availability(stylist_id: str, date: str):
    # Return all slots, mark taken ones
    taken = await db.bookings.find(
        {"stylist_id": stylist_id, "date": date, "payment_status": {"$in": ["pending", "paid"]}},
        {"_id": 0, "time": 1}
    ).to_list(100)
    taken_times = {b["time"] for b in taken}
    return {
        "date": date,
        "stylist_id": stylist_id,
        "slots": [{"time": t, "available": t not in taken_times} for t in TIME_SLOTS]
    }

@api_router.post("/bookings", response_model=Booking)
async def create_booking(payload: BookingCreate):
    service = next((s for s in SERVICES if s["id"] == payload.service_id), None)
    stylist = next((s for s in STYLISTS if s["id"] == payload.stylist_id), None)
    if not service:
        raise HTTPException(400, "Invalid service")
    if not stylist:
        raise HTTPException(400, "Invalid stylist")
    if payload.time not in TIME_SLOTS:
        raise HTTPException(400, "Invalid time slot")

    # Ensure slot not taken
    existing = await db.bookings.find_one({
        "stylist_id": payload.stylist_id,
        "date": payload.date,
        "time": payload.time,
        "payment_status": {"$in": ["pending", "paid"]}
    })
    if existing:
        raise HTTPException(409, "Time slot no longer available")

    amount = service["discount_price"] if service.get("discount_price") else service["price"]
    booking = Booking(
        service_id=service["id"],
        service_name=service["name"],
        stylist_id=stylist["id"],
        stylist_name=stylist["name"],
        date=payload.date,
        time=payload.time,
        amount=float(amount),
        customer_name=payload.customer_name,
        customer_email=payload.customer_email,
        customer_phone=payload.customer_phone,
        notes=payload.notes or "",
    )
    await db.bookings.insert_one(booking.model_dump())
    return booking

@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str):
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(404, "Booking not found")
    return booking

# ---------------- Payments ----------------
@api_router.post("/payments/checkout")
async def create_checkout(payload: CheckoutRequest, request: Request):
    booking = await db.bookings.find_one({"id": payload.booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(404, "Booking not found")

    host_url = str(request.base_url)
    webhook_url = f"{host_url.rstrip('/')}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    success_url = f"{payload.origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{payload.origin_url}/payment/cancel?booking_id={booking['id']}"

    req = CheckoutSessionRequest(
        amount=float(booking["amount"]),
        currency="inr",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "booking_id": booking["id"],
            "service_name": booking["service_name"],
            "customer_email": booking["customer_email"],
        },
    )
    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(req)

    await db.payment_transactions.insert_one({
        "session_id": session.session_id,
        "booking_id": booking["id"],
        "amount": float(booking["amount"]),
        "currency": "inr",
        "status": "initiated",
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.bookings.update_one(
        {"id": booking["id"]},
        {"$set": {"session_id": session.session_id}}
    )
    return {"checkout_url": session.url, "session_id": session.session_id}

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str):
    record = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not record:
        raise HTTPException(404, "Transaction not found")

    if record.get("payment_status") != "paid":
        try:
            host_url = "https://api.stripe.local"  # placeholder; not used by lib
            stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=f"{host_url}/api/webhook/stripe")
            status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
            if status.payment_status == "paid" or status.status == "complete":
                await db.payment_transactions.update_one(
                    {"session_id": session_id, "payment_status": {"$ne": "paid"}},
                    {"$set": {"status": "completed", "payment_status": "paid",
                              "updated_at": datetime.now(timezone.utc).isoformat()}}
                )
                await db.bookings.update_one(
                    {"session_id": session_id},
                    {"$set": {"payment_status": "paid"}}
                )
                record = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
        except Exception as e:
            logging.warning(f"Stripe status check failed: {e}")

    booking = await db.bookings.find_one({"session_id": session_id}, {"_id": 0}) if record.get("booking_id") else None
    return {
        "session_id": record["session_id"],
        "status": record["status"],
        "payment_status": record["payment_status"],
        "booking": booking,
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    sig = request.headers.get("Stripe-Signature", "")
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
    try:
        wh = await stripe_checkout.handle_webhook(body, sig)
    except Exception as e:
        raise HTTPException(400, f"Invalid webhook: {e}")

    if wh.payment_status == "paid":
        await db.payment_transactions.update_one(
            {"session_id": wh.session_id, "payment_status": {"$ne": "paid"}},
            {"$set": {"status": "completed", "payment_status": "paid",
                      "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        await db.bookings.update_one(
            {"session_id": wh.session_id},
            {"$set": {"payment_status": "paid"}}
        )
    return {"status": "ok"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
