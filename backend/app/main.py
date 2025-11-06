from fastapi import FastAPI
from app.routers import auth
from app.database import Base, engine

app = FastAPI(title="DropSpot API")

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)

@app.get("/")
def ana_sayfa():
    return {"mesaj": "DropSpot backend çalışıyor"}

