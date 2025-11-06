from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base

class Drop(Base):
    __tablename__ = "drops"

    id = Column(Integer, primary_key=True, index=True)
    baslik = Column(String, nullable=False)
    aciklama = Column(String, nullable=True)
    stok = Column(Integer, default=0)
    claim_baslangic = Column(DateTime, default=datetime.utcnow)
