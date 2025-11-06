from fastapi import FastAPI

app = FastAPI(title="DropSpot API")

@app.get("/")
def ana_sayfa():
    return {"mesaj": "DropSpot backend aktif"}

