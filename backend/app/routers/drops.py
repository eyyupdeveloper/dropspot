from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.drop import Drop

router = APIRouter(prefix="/drops", tags=["drops"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def drop_listesi(db: Session = Depends(get_db)):
    return db.query(Drop).all()

@router.post("/")
def yeni_drop_ekle(baslik: str, stok: int, db: Session = Depends(get_db)):
    if stok <= 0:
        raise HTTPException(status_code=400, detail="stok 0 olamaz :)")
    drop = Drop(baslik=baslik, stok=stok)
    db.add(drop)
    db.commit()
    db.refresh(drop)
    return {"id": drop.id, "baslik": drop.baslik, "stok": drop.stok}

