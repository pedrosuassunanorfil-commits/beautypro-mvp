from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime, timedelta, date, time, timezone
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, EmailStr
import os
import logging
import jwt
import uuid
import asyncio
from pathlib import Path

# Load environment variables
load_dotenv()

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'beautypro_database')
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Security
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Create the main app without a prefix
app = FastAPI(title="Sistema SaaS Estética", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Pydantic Models
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: str
    business_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    business_name: str
    subscription_status: str = "inactive"
    created_at: datetime

class ServiceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    duration_minutes: int = 0  # 0 for products
    category: str = Field(..., pattern="^(service|product)$")
    stock_quantity: Optional[int] = None  # Only for products

class Service(BaseModel):
    id: str
    user_id: str
    name: str
    description: Optional[str]
    price: float
    duration_minutes: int
    category: str
    stock_quantity: Optional[int]
    created_at: datetime

class FinancialEntryCreate(BaseModel):
    type: str = Field(..., pattern="^(income|expense)$")
    description: str
    amount: float
    category: str
    service_ids: Optional[List[str]] = []
    date: str

class FinancialEntry(BaseModel):
    id: str
    user_id: str
    type: str
    description: str
    amount: float
    category: str
    service_ids: Optional[List[str]] = []
    date: str
    created_at: datetime

class AppointmentCreate(BaseModel):
    client_name: str
    client_phone: str
    service_id: str
    date: str
    time: str
    notes: Optional[str] = None

class Appointment(BaseModel):
    id: str
    user_id: str
    client_name: str
    client_phone: str
    service_id: str
    service_name: str
    date: str
    time: str
    status: str = "pending"
    notes: Optional[str]
    created_at: datetime

class AppointmentUpdate(BaseModel):
    status: str = Field(..., pattern="^(confirmed|rejected|rescheduled)$")
    new_date: Optional[str] = None
    new_time: Optional[str] = None
    reschedule_proposal: Optional[Dict[str, str]] = None  # For proposing new times

# Helper Functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    user = await db.users.find_one({"_id": user_id})
    if user is None:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")
    return user

def prepare_for_mongo(data):
    """Prepare data for MongoDB storage"""
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, date):
                data[key] = value.isoformat()
            elif isinstance(value, time):
                data[key] = value.strftime('%H:%M:%S')
            elif isinstance(value, datetime):
                data[key] = value.isoformat()
    return data

def parse_from_mongo(item):
    """Parse data from MongoDB"""
    if item and '_id' in item:
        item['id'] = item.pop('_id')
    return item

# Authentication Routes
@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    # Create user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user_data.password)
    
    user_doc = {
        "_id": user_id,
        "name": user_data.name,
        "email": user_data.email,
        "password": hashed_password,
        "phone": user_data.phone,
        "business_name": user_data.business_name,
        "subscription_status": "inactive",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": User(**parse_from_mongo(user_doc))
    }

@api_router.post("/auth/login")
async def login(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    access_token = create_access_token(data={"sub": user["_id"]})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": User(**parse_from_mongo(user))
    }

# User Routes
@api_router.get("/user/profile", response_model=User)
async def get_profile(current_user = Depends(get_current_user)):
    return User(**parse_from_mongo(current_user))

# Services Routes
@api_router.post("/services", response_model=Service)
async def create_service(service_data: ServiceCreate, current_user = Depends(get_current_user)):
    service_id = str(uuid.uuid4())
    
    service_doc = {
        "_id": service_id,
        "user_id": current_user["_id"],
        "name": service_data.name,
        "description": service_data.description,
        "price": service_data.price,
        "duration_minutes": service_data.duration_minutes,
        "category": service_data.category,
        "stock_quantity": service_data.stock_quantity,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.services.insert_one(service_doc)
    return Service(**parse_from_mongo(service_doc))

@api_router.get("/services", response_model=List[Service])
async def get_services(current_user = Depends(get_current_user)):
    services = await db.services.find({"user_id": current_user["_id"]}).to_list(length=None)
    
    # Parse services manually to handle missing stock_quantity field
    service_list = []
    for service in services:
        service_data = parse_from_mongo(service)
        if 'stock_quantity' not in service_data:
            service_data['stock_quantity'] = None
        service_list.append(Service(**service_data))
    
    return service_list

@api_router.put("/services/{service_id}", response_model=Service)
async def update_service(service_id: str, service_data: ServiceCreate, current_user = Depends(get_current_user)):
    result = await db.services.update_one(
        {"_id": service_id, "user_id": current_user["_id"]},
        {"$set": service_data.dict()}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    
    updated_service = await db.services.find_one({"_id": service_id})
    return Service(**parse_from_mongo(updated_service))

@api_router.delete("/services/{service_id}")
async def delete_service(service_id: str, current_user = Depends(get_current_user)):
    result = await db.services.delete_one({"_id": service_id, "user_id": current_user["_id"]})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    
    return {"message": "Serviço excluído com sucesso"}

# Financial Routes
@api_router.post("/financial", response_model=FinancialEntry)
async def create_financial_entry(entry_data: FinancialEntryCreate, current_user = Depends(get_current_user)):
    entry_id = str(uuid.uuid4())
    
    entry_doc = {
        "_id": entry_id,
        "user_id": current_user["_id"],
        "type": entry_data.type,
        "description": entry_data.description,
        "amount": entry_data.amount,
        "category": entry_data.category,
        "service_ids": entry_data.service_ids or [],
        "date": entry_data.date,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.financial_entries.insert_one(entry_doc)
    return FinancialEntry(**parse_from_mongo(entry_doc))

@api_router.get("/financial", response_model=List[FinancialEntry])
async def get_financial_entries(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    entry_type: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    query = {"user_id": current_user["_id"]}
    
    if start_date:
        query["date"] = {"$gte": start_date}
    if end_date:
        if "date" in query:
            query["date"]["$lte"] = end_date
        else:
            query["date"] = {"$lte": end_date}
    if entry_type:
        query["type"] = entry_type
    
    entries = await db.financial_entries.find(query).sort("date", -1).to_list(length=None)
    
    # Handle backward compatibility for service_id -> service_ids migration
    processed_entries = []
    for entry in entries:
        entry_data = parse_from_mongo(entry)
        
        # Convert old service_id to service_ids for compatibility
        if 'service_id' in entry_data and 'service_ids' not in entry_data:
            entry_data['service_ids'] = [entry_data['service_id']] if entry_data['service_id'] else []
        elif 'service_ids' not in entry_data:
            entry_data['service_ids'] = []
            
        processed_entries.append(FinancialEntry(**entry_data))
    
    return processed_entries

@api_router.get("/financial/balance")
async def get_financial_balance(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    query = {"user_id": current_user["_id"]}
    
    if start_date:
        query["date"] = {"$gte": start_date}
    if end_date:
        if "date" in query:
            query["date"]["$lte"] = end_date
        else:
            query["date"] = {"$lte": end_date}
    
    entries = await db.financial_entries.find(query).to_list(length=None)
    
    income = sum(entry["amount"] for entry in entries if entry["type"] == "income")
    expenses = sum(entry["amount"] for entry in entries if entry["type"] == "expense")
    balance = income - expenses
    
    return {
        "income": income,
        "expenses": expenses,
        "balance": balance,
        "period": {"start_date": start_date, "end_date": end_date}
    }

# Appointment Routes
@api_router.post("/appointments/public/{user_id}")
async def create_public_appointment(user_id: str, appointment_data: AppointmentCreate):
    # Verify user exists
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Profissional não encontrado")
    
    # Verify service exists
    service = await db.services.find_one({"_id": appointment_data.service_id, "user_id": user_id})
    if not service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    
    appointment_id = str(uuid.uuid4())
    
    appointment_doc = {
        "_id": appointment_id,
        "user_id": user_id,
        "client_name": appointment_data.client_name,
        "client_phone": appointment_data.client_phone,
        "service_id": appointment_data.service_id,
        "service_name": service["name"],
        "date": appointment_data.date,
        "time": appointment_data.time,
        "status": "pending",
        "notes": appointment_data.notes,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.appointments.insert_one(appointment_doc)
    return {
        "message": "Agendamento solicitado com sucesso! Aguarde a confirmação do profissional.",
        "appointment": Appointment(**parse_from_mongo(appointment_doc))
    }

@api_router.get("/appointments", response_model=List[Appointment])
async def get_appointments(
    date: Optional[str] = None,
    status: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    query = {"user_id": current_user["_id"]}
    
    if date:
        query["date"] = date
    if status:
        query["status"] = status
    
    appointments = await db.appointments.find(query).sort("date", 1).sort("time", 1).to_list(length=None)
    return [Appointment(**parse_from_mongo(appointment)) for appointment in appointments]

@api_router.put("/appointments/{appointment_id}")
async def update_appointment_status(
    appointment_id: str,
    update_data: AppointmentUpdate,
    current_user = Depends(get_current_user)
):
    update_doc = {"status": update_data.status}
    
    if update_data.status == "rescheduled" and update_data.new_date and update_data.new_time:
        update_doc["date"] = update_data.new_date
        update_doc["time"] = update_data.new_time
    
    result = await db.appointments.update_one(
        {"_id": appointment_id, "user_id": current_user["_id"]},
        {"$set": update_doc}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    
    return {"message": f"Agendamento {update_data.status} com sucesso"}

# Public Routes for Booking System
@api_router.get("/public/professional/{user_id}")
async def get_professional_info(user_id: str):
    user = await db.users.find_one({"_id": user_id}, {"password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="Profissional não encontrado")
    
    services = await db.services.find({"user_id": user_id, "category": "service"}).to_list(length=None)
    
    # Parse services manually to handle missing stock_quantity field
    service_list = []
    for service in services:
        service_data = parse_from_mongo(service)
        if 'stock_quantity' not in service_data:
            service_data['stock_quantity'] = None
        service_list.append(Service(**service_data))
    
    return {
        "professional": {
            "name": user["name"],
            "business_name": user["business_name"],
            "phone": user["phone"]
        },
        "services": service_list
    }

@api_router.get("/public/available-times/{user_id}")
async def get_available_times(user_id: str, date: str):
    """Get available appointment times for a specific date"""
    # Generate time slots from 7:00 to 20:00 in 30-minute intervals
    time_slots = []
    for hour in range(7, 20):
        for minute in [0, 30]:
            time_slots.append(f"{hour:02d}:{minute:02d}")
    
    # Get existing appointments for the date
    existing_appointments = await db.appointments.find({
        "user_id": user_id,
        "date": date,
        "status": {"$in": ["pending", "confirmed"]}
    }).to_list(length=None)
    
    booked_times = [apt["time"] for apt in existing_appointments]
    available_times = [time for time in time_slots if time not in booked_times]
    
    return {"available_times": available_times}

@api_router.post("/appointments/{appointment_id}/propose-reschedule")
async def propose_reschedule(
    appointment_id: str,
    proposal: Dict[str, str],
    current_user = Depends(get_current_user)
):
    """Professional proposes new times for rescheduling"""
    appointment = await db.appointments.find_one({
        "_id": appointment_id,
        "user_id": current_user["_id"]
    })
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    
    # Update appointment with reschedule proposal
    await db.appointments.update_one(
        {"_id": appointment_id},
        {
            "$set": {
                "status": "reschedule_proposed",
                "reschedule_proposal": {
                    "date1": proposal.get("date1"),
                    "time1": proposal.get("time1"),
                    "date2": proposal.get("date2"),
                    "time2": proposal.get("time2"),
                    "date3": proposal.get("date3"),
                    "time3": proposal.get("time3"),
                    "message": proposal.get("message", "")
                }
            }
        }
    )
    
    return {
        "message": "Proposta de reagendamento enviada",
        "whatsapp_message": f"Olá {appointment['client_name']}! Preciso reagendar seu atendimento. Estas são as opções disponíveis:\n\n" +
                           f"Opção 1: {proposal.get('date1')} às {proposal.get('time1')}\n" +
                           f"Opção 2: {proposal.get('date2')} às {proposal.get('time2')}\n" +
                           f"Opção 3: {proposal.get('date3')} às {proposal.get('time3')}\n\n" +
                           f"Mensagem: {proposal.get('message', '')}\n\n" +
                           f"Por favor, responda qual opção prefere ou se nenhuma funciona."
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
async def health_check():
    return {"status": "healthy", "message": "BeautyPro API is running"}

@app.get("/api/")
async def api_health_check():
    return {"status": "healthy", "message": "BeautyPro API is running", "version": "1.0.0"}

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()