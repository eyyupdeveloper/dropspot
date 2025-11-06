from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.waitlist import Waitlist
from app.models.drop import Drop

router = APIRouter(prefix="/waitlist", tags=["waitlist"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/join")
def waitlist_katil(user_id: int, drop_id: int, db: Session = Depends(get_db)):
    # drop var mı kontrol et
    drop = db.query(Drop).filter(Drop.id == drop_id).first()
    if not drop:
        raise HTTPException(status_code=404, detail="Drop bulunamadı :(")

    # daha önce katıldı mı kontrol et
    once = db.query(Waitlist).filter_by(user_id=user_id, drop_id=drop_id).first()
    if once:
        return {"mesaj": "Zaten bekleme listesinde (idempotent işlem çalıştı)"}

    kayit = Waitlist(user_id=user_id, drop_id=drop_id)
    db.add(kayit)
    db.commit()
    db.refresh(kayit)
    return {"mesaj": "Bekleme listesine katıldın!", "waitlist_id": kayit.id}

@router.post("/leave")
def waitlist_ayril(user_id: int, drop_id: int, db: Session = Depends(get_db)):
    # Kullanıcının bekleme listesinde olup olmadığını kontrol et
    kayit = db.query(Waitlist).filter_by(user_id=user_id, drop_id=drop_id).first()
    
    if not kayit:
        return {"mesaj": "Zaten bekleme listesinde değilsin (idempotent işlem çalıştı)"}

    # Eğer claim etmişse, ayrılmasına izin verme
    if kayit.claimed:
        raise HTTPException(status_code=400, detail="Hak talebi yapıldıktan sonra listeden ayrılamazsın.")
    
    # Kaydı sil
    db.delete(kayit)
    db.commit()
    
    return {"mesaj": "Bekleme listesinden ayrıldın."}
