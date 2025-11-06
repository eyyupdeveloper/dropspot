# DropSpot

**Proje Başlama Zamanı:** 202511060345

DropSpot, sınırlı stoklu ürünlerin veya etkinliklerin bekleme listesi üzerinden adil şekilde paylaşıldığı bir platformdur.  
Bu proje, Alpaco Full Stack Developer Case çalışması kapsamında geliştirilmiştir.

---

## Proje Özeti

Kullanıcılar e-posta ile kayıt olabilir, aktif "drop"lara katılabilir, bekleme listesine girebilir ve claim zamanı geldiğinde sırayla hak kazanırlar.  
Admin panel üzerinden drop ekleme, güncelleme ve silme işlemleri yapılabilir.  
Frontend kısmı React Native ile geliştirilecektir.

---

## Mimari

| Katman | Teknoloji |
|--------|------------|
| Backend | Python (FastAPI) |
| Veritabanı | SQLite (testler için) |
| ORM | SQLAlchemy |
| Frontend | React Native (Expo) |
| Test | pytest (planlandı) |

---

## Klasör Yapısı

```
dropspot/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── drop.py
│   │   │   └── waitlist.py
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── drops.py
│   │   │   ├── waitlist.py
│   │   │   └── claim.py
│   ├── requirements.txt
└── frontend/ (React Native)
```

---

## API Endpoint Listesi

### Auth
| Method | URL | Açıklama |
|--------|-----|-----------|
| POST | /auth/signup | Yeni kullanıcı kaydı oluşturur |

### Drops
| Method | URL | Açıklama |
|--------|-----|-----------|
| GET | /drops | Aktif drop listesini döner |
| POST | /drops | Yeni drop ekler (başlık, stok) |

### Waitlist
| Method | URL | Açıklama |
|--------|-----|-----------|
| POST | /waitlist/join | Kullanıcıyı bekleme listesine ekler |
| - | - | Aynı kullanıcı tekrar denerse işlem idempotent çalışır |

### Claim
| Method | URL | Açıklama |
|--------|-----|-----------|
| POST | /claim | Claim zamanı geldiyse tek seferlik kod üretir |

---

## Idempotent İşlem Mantığı

- Aynı kullanıcı aynı drop’a ikinci kez katılamaz.  
- Kullanıcı claim işlemini tekrar yaparsa sistem aynı kodu döner.  
- Bu sayede sistem, aynı isteğin birden fazla kez gönderilmesinden etkilenmez.

---

## Kurulum Adımları

### Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend (React Native - Yakında)
```bash
cd frontend
npx expo start
```

### Tarayıcıdan kontrol
http://127.0.0.1:8000/docs adresine giderek API arayüzünü görüntüleyebilirsin.

---

## Seed Üretimi

Seed, projenin başlangıç zamanı ve Git bilgileri kullanılarak üretilir.

```python
import hashlib
remote = "https://github.com/eyyupdeveloper/dropspot.git"
epoch = "1730876305"
start = "202511060345"
raw = f"{remote}|{epoch}|{start}"
seed = hashlib.sha256(raw.encode()).hexdigest()[:12]
print(seed)
```

**Seed sonucu:** d4e9ac71b83f

---

## Notlar

Bu proje 72 saatlik süre içinde modüler ve anlaşılır şekilde geliştirilmiştir.  
Commit geçmişi, geliştirmenin adım adım ilerleyişini yansıtır.

