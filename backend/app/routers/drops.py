from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.drop import Drop
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(prefix="/drops", tags=["drops"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class DropCreate(BaseModel):
    baslik: str
    stok: int
    kisa_aciklama: str | None = None
    image_url: str | None = None
    claim_baslangic: datetime | None = None

class DropResponse(BaseModel):
    id: int
    baslik: str
    aciklama: str | None = None
    stok: int
    kisa_aciklama: str | None = None
    image_url: str | None = None
    claim_baslangic: datetime
    durum: str

    class Config:
        orm_mode = True



def get_drop_status(drop: Drop) -> str:
    """Drop'un stok ve claim başlangıç zamanına göre durumunu hesaplar."""
    now = datetime.utcnow()
    
    if drop.stok <= 0:
        return "Sona Erdi"
    
    if now < drop.claim_baslangic:

        return "Çok Yakında"
        
    return "Aktif"

@router.get("/", response_model=list[DropResponse])
def drop_listesi(db: Session = Depends(get_db)):
    drops = db.query(Drop).all()
    
    drop_list = []
    for drop in drops:
        status = get_drop_status(drop)
        drop_data = {
            "id": drop.id,
            "baslik": drop.baslik,
            "aciklama": drop.aciklama,
            "stok": drop.stok,
            "kisa_aciklama": drop.kisa_aciklama,
            "image_url": drop.image_url,
            "claim_baslangic": drop.claim_baslangic,
            "durum": status,
        }
        drop_list.append(drop_data)
        
    return drop_list

@router.post("/", response_model=DropResponse)
def yeni_drop_ekle(drop_data: DropCreate, db: Session = Depends(get_db)):
    if drop_data.stok <= 0:
        raise HTTPException(status_code=400, detail="Stok 0 veya daha az olamaz :)")
        
    claim_baslangic = drop_data.claim_baslangic if drop_data.claim_baslangic else datetime.utcnow()
    
    drop = Drop(
        baslik=drop_data.baslik, 
        stok=drop_data.stok,
        kisa_aciklama=drop_data.kisa_aciklama,
        image_url=drop_data.image_url,
        claim_baslangic=claim_baslangic,
    )
    db.add(drop)
    db.commit()
    db.refresh(drop)

    status = get_drop_status(drop)
    return {
        "id": drop.id,
        "baslik": drop.baslik,
        "aciklama": drop.aciklama,
        "stok": drop.stok,
        "kisa_aciklama": drop.kisa_aciklama,
        "image_url": drop.image_url,
        "claim_baslangic": drop.claim_baslangic,
        "durum": status,
    }
