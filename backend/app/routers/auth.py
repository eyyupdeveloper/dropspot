from fastapi import APIRouter, Depends, HTTPException
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

@router.post("/signup")
def kullanici_kayit(email: str, password: str, db: Session = Depends(get_db)):
    mevcut = db.query(User).filter(User.email == email).first()
    if mevcut:
        raise HTTPException(status_code=400, detail="Bu e-posta zaten kayıtlı.")
    user = User(email=email, password=password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": user.id, "email": user.email}

