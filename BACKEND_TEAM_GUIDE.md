# MatchProof Backend Ekip Rehberi

## Amaç

Bu doküman, şu ana kadar backend tarafında tamamlanan işleri ve diğer ekip üyelerinin bu yapı üstünde nasıl ilerlemesi gerektiğini açık şekilde özetler.

Hedef kitle:
- frontend geliştiren ekip üyeleri
- AI/matching kısmını geliştiren ekip üyeleri
- test/QA kısmını geliştiren ekip üyeleri

Bu doküman mevcut implementasyonu referans alır. Yeni geliştirmeler bu sözleşmeyi bozacaksa önce ekip içinde netleştirilmelidir.

---

## Şu Anda Backend'de Tamamlanan Kısımlar

Tamamlanan temel backend kapsamı:

- Express tabanlı server foundation
- PostgreSQL bağlantısı ve migration yapısı
- Session tabanlı authentication
- User registration / login / logout / current user
- Item create / detail / update / delete
- Local image upload
- Item search + filtering + pagination
- Item status update flow

Henüz tamamlanmayan backend kapsamı:

- moderation endpoint'leri
- AI matching endpoint'leri
- otomatik testler
- deploy / production hardening

---

## Kullanılan Mimari

Backend yapısı:

```text
src/server/
  routes/
  services/
  models/
```

Katman sorumlulukları:

- `routes`: HTTP endpoint tanımları
- `services`: iş kuralları, validation, authorization
- `models`: PostgreSQL query katmanı

Kullanılan temel stack:

- Node.js
- Express.js
- PostgreSQL
- express-session
- connect-pg-simple
- multer

Authentication yaklaşımı:

- JWT kullanılmıyor
- cookie-based session kullanılıyor
- session bilgisi PostgreSQL üzerinde tutuluyor

---

## Önemli İş Kuralları

### 1. Item türleri

Sistemde iki ilan tipi var:

- `lost`
- `found`

Bu ayrım `itemType` alanı ile yapılıyor.

### 2. Item status değerleri

Desteklenen status değerleri:

- `open`
- `claimed`
- `resolved`
- `removed`

### 3. İzinli status geçişleri

Şu an backend tarafında yalnızca şu geçişler kabul ediliyor:

- `open -> claimed`
- `claimed -> resolved`

Şunlar kabul edilmiyor:

- `open -> resolved`
- `resolved -> claimed`
- `removed` durumundan geri dönüş

### 4. Owner kuralları

Şu işlemleri yalnızca ilan sahibi yapabilir:

- ilan güncelleme
- ilan silme
- status güncelleme

### 5. Contact bilgisi

Şu an item içinde `contactInfo` alanı saklanmıyor.

Backend detail response içinde `ownerContact` üretiyor:

```json
{
  "ownerContact": {
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

Not: Bunun gizlilik açısından final karar olup olmadığı ekip içinde ayrıca netleştirilmeli.

### 6. Search davranışı

- normal arama sonuçlarında `removed` ilanlar dönmez
- `dateFrom` / `dateTo` şu an **ilanın sisteme eklenme tarihini** filtreler

---

## Environment ve Çalıştırma

Gerekli env değişkenleri:

- `DATABASE_URL`
- `SESSION_SECRET`

Opsiyonel env değişkenleri:

- `PORT`
- `NODE_ENV`
- `UPLOAD_DIR`
- `CLIENT_ORIGIN`

Mevcut scriptler:

```bash
npm run db:migrate
npm run dev
npm start
```

---

## Mevcut Endpoint'ler

Tüm `/api/items/*` endpoint'leri authentication gerektirir.

### Auth

#### `POST /api/auth/register`

Body:

```json
{
  "name": "Mehmet Gür",
  "email": "mehmet@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "user": {
    "id": 1,
    "name": "Mehmet Gür",
    "email": "mehmet@example.com",
    "role": "user",
    "createdAt": "2026-03-18T10:00:00.000Z",
    "updatedAt": "2026-03-18T10:00:00.000Z"
  }
}
```

#### `POST /api/auth/login`

Body:

```json
{
  "email": "mehmet@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "user": {
    "id": 1,
    "name": "Mehmet Gür",
    "email": "mehmet@example.com",
    "role": "user",
    "createdAt": "2026-03-18T10:00:00.000Z",
    "updatedAt": "2026-03-18T10:00:00.000Z"
  }
}
```

#### `POST /api/auth/logout`

Body gerektirmez.  
Response: `204 No Content`

#### `GET /api/auth/me`

Response:

```json
{
  "user": {
    "id": 1,
    "name": "Mehmet Gür",
    "email": "mehmet@example.com",
    "role": "user",
    "createdAt": "2026-03-18T10:00:00.000Z",
    "updatedAt": "2026-03-18T10:00:00.000Z"
  }
}
```

---

### Items

#### `POST /api/items`

Format: `multipart/form-data`

Alanlar:

- `itemType`
- `title`
- `description`
- `category`
- `location`
- `image` (opsiyonel dosya)

Örnek response:

```json
{
  "item": {
    "id": 10,
    "ownerId": 1,
    "itemType": "lost",
    "title": "Black Wallet",
    "description": "Small black leather wallet",
    "category": "Wallet",
    "location": "Library",
    "status": "open",
    "imageUrl": "/uploads/example.jpg",
    "ownerContact": {
      "name": "Mehmet Gür",
      "email": "mehmet@example.com"
    },
    "createdAt": "2026-03-18T10:00:00.000Z",
    "updatedAt": "2026-03-18T10:00:00.000Z"
  }
}
```

#### `GET /api/items/:itemId`

Tek bir ilanın detayını döner.  
`ownerContact` burada bulunur.

#### `PATCH /api/items/:itemId`

Format: `multipart/form-data`

Gönderilebilecek alanlar:

- `itemType`
- `title`
- `description`
- `category`
- `location`
- `image` (opsiyonel yeni dosya)

En az bir alan veya yeni image gönderilmelidir.

#### `DELETE /api/items/:itemId`

Response: `204 No Content`

#### `PATCH /api/items/:itemId/status`

Body:

```json
{
  "status": "claimed"
}
```

veya

```json
{
  "status": "resolved"
}
```

Bu endpoint:

- owner kontrolü yapar
- yalnızca izinli status geçişlerini kabul eder
- güncel item nesnesini döner

#### `GET /api/items/search`

Desteklenen query parametreleri:

- `query`
- `category`
- `itemType`
- `status`
- `dateFrom`
- `dateTo`
- `page`
- `pageSize`

Örnek istek:

```text
GET /api/items/search?query=wallet&itemType=lost&status=open&page=1&pageSize=10
```

Örnek response:

```json
{
  "items": [
    {
      "id": 10,
      "ownerId": 1,
      "itemType": "lost",
      "title": "Black Wallet",
      "description": "Small black leather wallet",
      "category": "Wallet",
      "location": "Library",
      "status": "open",
      "imageUrl": "/uploads/example.jpg",
      "createdAt": "2026-03-18T10:00:00.000Z",
      "updatedAt": "2026-03-18T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 1,
    "totalPages": 1
  },
  "filters": {
    "query": "wallet",
    "category": null,
    "itemType": "lost",
    "status": "open",
    "dateFrom": null,
    "dateTo": null
  }
}
```

---

## Frontend Ekibi İçin Notlar

Frontend tarafı şu an şu backend akışlarına güvenebilir:

- register / login / logout / me
- create item
- item detail
- edit item
- delete item
- search
- status update

Frontend'in dikkat etmesi gerekenler:

- item create ve update istekleri `multipart/form-data` olmalı
- `GET /api/items/search` sonucu `items + pagination + filters` döner
- `GET /api/items/:itemId` detail response'u ile search response'u aynı shape değil
- `ownerContact` sadece detail response'ta var
- status butonları mevcut status'a göre gösterilmeli
  - `open` ise `Mark as Claimed`
  - `claimed` ise `Mark as Resolved`
  - `resolved` ise buton göstermemek daha doğru

---

## AI Ekibi İçin Notlar

AI tarafı henüz backend'e bağlanmış değil. Ama mevcut temel yapı AI ekibinin üstüne koyması için hazır:

- item verileri PostgreSQL'de tutuluyor
- detail endpoint mevcut
- search akışı mevcut
- `lost` ve `found` ayrımı net

AI ekibinin muhtemel sonraki işi:

- `GET /api/items/:itemId/matches`
- text similarity
- image similarity
- ranked candidate list
- kısa explanation üretimi

AI ekibi için önemli mevcut alanlar:

- `itemType`
- `title`
- `description`
- `category`
- `imageUrl`
- `status`

Önemli kural:

- matching mantığı frontend içinde yazılmamalı
- ranking ve explanation backend tarafında üretilmeli

---

## Test / QA Ekibi İçin Notlar

Şu an test ekibinin odaklanması gereken kapsam:

### Auth testleri

- register success
- duplicate email reject
- login success
- invalid credentials reject
- logout success
- `/api/auth/me` authenticated / unauthenticated davranışı

### Item CRUD testleri

- create item success
- create item without required fields reject
- update own item success
- update someone else's item reject
- delete own item success
- delete someone else's item reject

### Upload testleri

- valid image accept
- invalid mime type reject
- file too large reject

### Search testleri

- keyword search works
- category filter works
- itemType filter works
- status filter works
- date range filter works
- pagination works
- removed items excluded

### Status flow testleri

- `open -> claimed` success
- `claimed -> resolved` success
- `open -> resolved` reject
- non-owner status update reject

---

## Henüz Yapılmamış Backend İşleri

Kalan backend geliştirmeler:

- moderation route ve service
- AI matching route ve service
- privacy/contact modelinin netleştirilmesi
- test altyapısı ve otomatik testler
- production/deploy iyileştirmeleri

---

## Ekip İçinde Netleştirilmesi Gereken Açık Kararlar

1. `ownerContact` olarak gerçek email göstermek final karar mı?
2. İletişim için ayrıca paylaşılabilir `contactMethod/contactValue` alanı eklenecek mi?
3. `dateFrom` / `dateTo` ilan oluşturulma tarihini mi, yoksa eşyanın kaybolduğu/bulunduğu tarihi mi temsil etmeli?
4. Moderation sadece `remove` mu olacak, yoksa ileride `restore` da eklenecek mi?

Bu kararlar netleşmeden frontend ve AI ekipleri varsayım yapmamalı.
