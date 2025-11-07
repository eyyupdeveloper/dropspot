from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.drop import Drop
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(prefix="/drops", tags=["drops"])

ADMIN_USER_ID = 1 # Basitleştirilmiş Admin ID kontrolü için sabit

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Pydantic Schemas ---

class DropCreate(BaseModel):
    baslik: str
    stok: int
    aciklama: str | None = None
    kisa_aciklama: str | None = None
    image_url: str | None = None
    claim_baslangic: datetime | None = None

class DropUpdate(BaseModel):
    baslik: str | None = None
    stok: int | None = None
    aciklama: str | None = None
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

# --- Helper Fonksiyon ---

def get_drop_status(drop: Drop) -> str:
    now = datetime.utcnow()
    
    if drop.stok <= 0:
        return "Sona Erdi"
    
    if now < drop.claim_baslangic:
        return "Çok Yakında"
        
    return "Aktif"

# --- Public Router Fonksiyonları ---

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

# --- Admin CRUD Router Fonksiyonları ---

# POST /admin/drops 
@router.post("/admin", response_model=DropResponse, status_code=201, tags=["Admin CRUD"])
def yeni_admin_drop_ekle(drop_data: DropCreate, user_id: int = Query(..., description="Admin Kullanıcı ID'si"), db: Session = Depends(get_db)):
    if user_id != ADMIN_USER_ID:
        raise HTTPException(status_code=403, detail="Yalnızca Admin yetkili kullanıcılar drop ekleyebilir.")
        
    if drop_data.stok <= 0:
        raise HTTPException(status_code=400, detail="Stok 0 veya daha az olamaz")
    
    claim_baslangic = drop_data.claim_baslangic if drop_data.claim_baslangic else datetime.utcnow()
    
    drop = Drop(
        baslik=drop_data.baslik, 
        stok=drop_data.stok,
        aciklama=drop_data.aciklama,
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

# PUT /admin/drops/:id 
@router.put("/admin/{drop_id}", response_model=DropResponse, tags=["Admin CRUD"])
def drop_guncelle(drop_id: int, drop_data: DropUpdate, user_id: int = Query(..., description="Admin Kullanıcı ID'si"), db: Session = Depends(get_db)):
    if user_id != ADMIN_USER_ID:
        raise HTTPException(status_code=403, detail="Yalnızca Admin yetkili kullanıcılar drop güncelleyebilir.")
        
    drop = db.query(Drop).filter(Drop.id == drop_id).first()
    if not drop:
        raise HTTPException(status_code=404, detail="Drop bulunamadı")
    
    update_data = drop_data.model_dump(exclude_unset=True)
    
    if "stok" in update_data and update_data["stok"] < 0:
        raise HTTPException(status_code=400, detail="Stok negatif olamaz")

    for key, value in update_data.items():
        setattr(drop, key, value)
        
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

# DELETE /admin/drops/:id 
@router.delete("/admin/{drop_id}", status_code=204, tags=["Admin CRUD"])
def drop_sil(drop_id: int, user_id: int = Query(..., description="Admin Kullanıcı ID'si"), db: Session = Depends(get_db)):
    if user_id != ADMIN_USER_ID:
        raise HTTPException(status_code=403, detail="Yalnızca Admin yetkili kullanıcılar drop silebilir.")

    drop = db.query(Drop).filter(Drop.id == drop_id)
    if not drop.first():
        raise HTTPException(status_code=404, detail="Drop bulunamadı")
        
    drop.delete(synchronize_session=False)
    db.commit()
    
    return
