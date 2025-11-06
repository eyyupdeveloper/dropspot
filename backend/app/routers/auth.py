import bcrypt
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str) -> str:
    # 72 byte sınırına dikkat et
    truncated = password.encode('utf-8')[:72]
    hashed = bcrypt.hashpw(truncated, bcrypt.gensalt())
    return hashed.decode('utf-8')  # DB’ye string olarak kaydet

def verify_password(password: str, hashed: str) -> bool:
    truncated = password.encode('utf-8')[:72]
    return bcrypt.checkpw(truncated, hashed.encode('utf-8'))

@router.post("/signup")
def signup(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if user:
        raise HTTPException(status_code=400, detail="Bu e-posta zaten kayıtlı")

    hashed = hash_password(password)
    new_user = User(email=email, password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"id": new_user.id, "email": new_user.email, "message": "Kayıt başarılı"}

@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="E-posta veya şifre hatalı")

    return {"message": "Giriş başarılı", "user_id": user.id}

