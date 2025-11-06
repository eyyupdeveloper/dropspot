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

