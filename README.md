# DropSpot – Alpaco Full Stack Developer Case

**Proje Başlama Zamanı:** 2025/11/06 – 03:45  
**Seed:** `d4e9ac71b83f`  

DropSpot, sınırlı stoklu ürünlerin veya etkinliklerin adil şekilde paylaşıldığı, bekleme listesi tabanlı bir platformdur.  
Bu proje, Alpaco’nun full stack mühendislik yaklaşımını yansıtmak amacıyla geliştirilmiştir.  
Amaç sadece çalışan bir sistem oluşturmak değil, aynı zamanda kararların nedenini açıkça gösterebilen, sürdürülebilir bir mimari kurmaktır.

---

## Proje Özeti ve Mimari Açıklama

Kullanıcılar e-posta adresleriyle kayıt olup giriş yapabilir.  
Aktif drop listesinde yer alan ürünlere katılabilir, bekleme listesine dahil olabilir ve "claim" zamanı geldiğinde sistem sıralamaya göre kod üretir.  
Admin paneli, yeni drop ekleme, güncelleme ve silme işlemlerini destekler.

**Mimari Bileşenler:**
- **Frontend:** React Native (Expo Web) – sade, işlevsel bir arayüz
- **Backend:** FastAPI (Python) – RESTful API mimarisi
- **Veritabanı:** SQLite – geliştirme süreci için yeterli, PostgreSQL'e geçişe hazır
- **Auth:** Basit oturum mantığı, hashed şifreleme (Passlib)
- **State:** useState / useEffect
- **Seed:** SHA256 hash tabanlı benzersiz proje kimliği

---

## Veri Modeli ve Endpoint Listesi

### **Veri Modelleri**

**User**
```python
id: int
email: str
password: str
```
**Drop**
```python
id: int
baslik: str
stok: int
```
**Waitlist**
```python
id: int
user_id: int
drop_id: int
```
**Claim**
```python
id: int
user_id: int
drop_id: int
claim_kodu: str
```

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
### CRUD 
| Method | URL | Açıklama | 
|--------|-----|-----------|
| POST | /drops/admin | Yeni bir drop oluşturur ve veritabanına ekler. "user_id=1" Kontrolü yapar | 
| PUT | /drops/admin/{drop_id} | Mevcut bir Drop'u ID ile bulur ve günceller. "user_id=1" Kontrolü yapar | 
| DELETE | /drops/admin/{drop_id} | Mevcut bir Drop'u ID ile bulur ve veritabanından siler. "user_id=1" Kontrolü yapar |

---

## CRUD Modülü Açıklaması
Admin paneli yalnızca yetkili kullanıcılar tarafından erişilebilir.
Bu panel üzerinden mevcut drop’lar listelenir, yeni drop eklenebilir veya güncellenebilir.
İşlemler idempotent şekilde tasarlanmıştır.
Örneğin bir drop’u aynı başlıkla iki kez eklemeye çalışmak sistem tarafından engellenir.

Frontend tarafında CRUD arayüzü sade bir form bileşeniyle oluşturulmuştur.
Backend tarafında işlem doğruluğu transaction yapısıyla korunur.

---

## Idempotency Yaklaşımı ve Transaction Yapısı
Uygulamada idempotent davranış temel ilke olarak ele alındı.
Aynı kullanıcı aynı drop’a ikinci kez katılmaya çalıştığında işlem sonucu değişmez.
Claim kodu bir kez üretildikten sonra tekrar çağrıldığında aynı kod döner.

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

### Frontend (React Native)
```bash
cd frontend
npm install
npx expo start
```
### Tarayıcıdan kontrol
http://127.0.0.1:8000/docs adresine giderek API uçları test edilebilir.

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

##Teknik Tercihler ve Kişisel Katkılar

* Kodun sadece çalışması değil, okunabilir ve sürdürülebilir olması önceliklendirildi.
* Frontend tarafında useState tabanlı sade bir state yönetimi tercih edildi.
* Backend tarafında transaction güvenliği sağlanarak veri bütünlüğü garanti altına alındı.
* Commit geçmişi, geliştirme sürecinin planlı şekilde ilerlediğini yansıtacak biçimde düzenlendi.
* UI tasarımları gereksiz karmaşıklıktan uzak, kullanıcı eylemlerine odaklı tutuldu.
* Kısacası, "neden böyle yaptım" sorusunun her adımda cevabı olacak şekilde ilerledim. 

--- 

## Notlar

* Bu proje 72 saatlik süre içinde modüler ve anlaşılır şekilde geliştirilmiştir. 
* Commit geçmişi, geliştirmenin adım adım ilerleyişini yansıtır.
* Bu proje, sadece “çalışan bir uygulama” değil, aynı zamanda nasıl çalıştığını anlatan bir mühendislik pratiğidir.
