from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
import bcrypt
from pydantic import BaseModel
from app.routers.drops import ADMIN_USER_ID

router = APIRouter(prefix="/auth", tags=["auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class UserCreate(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Bu e-posta zaten kayıtlı")

    password_bytes = user.password.encode("utf-8")[:72]
    hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode("utf-8")

    new_user = User(email=user.email, password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"id": new_user.id, "email": new_user.email, "message": "Kayıt başarılı"}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="E-posta veya şifre hatalı")


    password_bytes = user.password.encode("utf-8")[:72]
    if not bcrypt.checkpw(password_bytes, db_user.password.encode("utf-8")):
        raise HTTPException(status_code=401, detail="E-posta veya şifre hatalı")
    
    is_admin = db_user.id == ADMIN_USER_ID
    return {"message": "Giriş başarılı", "user_id": db_user.id, "is_admin": is_admin}

