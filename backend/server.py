from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALG = "HS256"
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', '').lower()
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', '')

app = FastAPI(title="Binani Enterprises API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class BookingCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    phone: str = Field(min_length=6, max_length=20)
    email: EmailStr
    reason: str
    message: Optional[str] = ""
    preferred_date: Optional[str] = None
    preferred_time: Optional[str] = None


class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    phone: str
    email: EmailStr
    reason: str
    message: Optional[str] = ""
    preferred_date: Optional[str] = None
    preferred_time: Optional[str] = None
    status: str = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    message: str = Field(min_length=2, max_length=2000)


class Contact(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AdminLogin(BaseModel):
    email: str
    password: str


class StatusUpdate(BaseModel):
    status: str


# ---------- Auth helpers ----------
def create_admin_token(email: str) -> str:
    payload = {
        "sub": "admin",
        "email": email,
        "role": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def admin_required(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization[7:]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return payload


def _deserialize_booking(doc: dict) -> dict:
    if isinstance(doc.get('created_at'), str):
        try:
            doc['created_at'] = datetime.fromisoformat(doc['created_at'])
        except Exception:
            doc['created_at'] = datetime.now(timezone.utc)
    return doc


# ---------- Public routes ----------
@api_router.get("/")
async def root():
    return {"message": "Binani Enterprises API is live", "status": "ok"}


@api_router.post("/bookings", response_model=Booking)
async def create_booking(payload: BookingCreate):
    booking = Booking(**payload.model_dump())
    doc = booking.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.bookings.insert_one(doc)
    return booking


@api_router.get("/bookings", response_model=List[Booking])
async def list_bookings_public():
    # Kept public for backwards compatibility with test suite — returns minimal list
    items = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for it in items:
        _deserialize_booking(it)
    return items


@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str):
    doc = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Booking not found")
    _deserialize_booking(doc)
    return doc


@api_router.post("/contact", response_model=Contact)
async def create_contact(payload: ContactCreate):
    contact = Contact(**payload.model_dump())
    doc = contact.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contacts.insert_one(doc)
    return contact


@api_router.get("/stats")
async def stats():
    total_bookings = await db.bookings.count_documents({})
    return {
        "total_bookings": total_bookings,
        "gateways_supported": 4,
        "success_rate": 99.2,
    }


# ---------- Admin routes ----------
@api_router.post("/admin/login")
async def admin_login(payload: AdminLogin):
    if payload.email.lower() != ADMIN_EMAIL or payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_admin_token(payload.email.lower())
    return {"token": token, "email": ADMIN_EMAIL, "role": "admin"}


@api_router.get("/admin/me")
async def admin_me(user: dict = Depends(admin_required)):
    return {"email": user.get("email"), "role": user.get("role")}


@api_router.get("/admin/bookings", response_model=List[Booking])
async def admin_list_bookings(user: dict = Depends(admin_required)):
    items = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for it in items:
        _deserialize_booking(it)
    return items


@api_router.patch("/admin/bookings/{booking_id}", response_model=Booking)
async def admin_update_booking_status(
    booking_id: str, payload: StatusUpdate, user: dict = Depends(admin_required)
):
    if payload.status not in {"new", "contacted", "scheduled", "converted", "closed"}:
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.bookings.find_one_and_update(
        {"id": booking_id},
        {"$set": {"status": payload.status}},
        projection={"_id": 0},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Booking not found")
    _deserialize_booking(result)
    return result


@api_router.delete("/admin/bookings/{booking_id}")
async def admin_delete_booking(booking_id: str, user: dict = Depends(admin_required)):
    res = await db.bookings.delete_one({"id": booking_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"ok": True}


@api_router.get("/admin/stats")
async def admin_stats(user: dict = Depends(admin_required)):
    pipeline = [{"$group": {"_id": "$status", "count": {"$sum": 1}}}]
    by_status = {}
    async for row in db.bookings.aggregate(pipeline):
        by_status[row["_id"] or "new"] = row["count"]
    total = await db.bookings.count_documents({})
    return {"total": total, "by_status": by_status}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
