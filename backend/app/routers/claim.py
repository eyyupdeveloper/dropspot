from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import SessionLocal
from app.models.waitlist import Waitlist
from app.models.drop import Drop
import secrets

router = APIRouter(prefix="/claim", tags=["claim"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def hak_talep_et(user_id: int, drop_id: int, db: Session = Depends(get_db)):
    drop = db.query(Drop).filter(Drop.id == drop_id).first()
    if not drop:
        raise HTTPException(status_code=404, detail="Drop bulunamadı :(")

    # claim zamanı geldi mi kontrol et
    if datetime.utcnow() < drop.claim_baslangic:
        raise HTTPException(status_code=403, detail="Henüz claim zamanı gelmedi.")

    kayit = db.query(Waitlist).filter_by(user_id=user_id, drop_id=drop_id).first()
    if not kayit:
        raise HTTPException(status_code=404, detail="Bekleme listesinde değilsin.")
    
    # Idempotent kontrol
    if kayit.claimed:
        return {"mesaj": "Zaten hakkını kullandın", "claim_kodu": kayit.claim_kodu}
    
    # stok kaldı mı
    if drop.stok <= 0:
        raise HTTPException(status_code=400, detail="Stok kalmamış maalesef :(")

    # -----claim işlemi
    kod = secrets.token_hex(4).upper()
    kayit.claimed = True
    kayit.claim_kodu = kod
    drop.stok -= 1
    db.commit()
    db.refresh(kayit)
    return {"mesaj": "tebrikler! claim kodun hazır ", "claim_kodu": kod}

