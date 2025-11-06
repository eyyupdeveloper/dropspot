from sqlalchemy import Column, Integer, ForeignKey, DateTime, Boolean, String
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Waitlist(Base):
    __tablename__ = "waitlist"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    drop_id = Column(Integer, ForeignKey("drops.id"))
    katilim_zamani = Column(DateTime, default=datetime.utcnow)
    claimed = Column(Boolean, default=False)
    claim_kodu = Column(String, nullable=True)

