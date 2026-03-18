# MatchProof Uygulama Rehberi

## Amaç

Bu doküman, kodlama aşaması için çalışma referansıdır. Frontend ve backend tarafında çalışan kişilerin gereksiz çakışma yaşamadan paralel ilerleyebilmesi için ortak mimariyi, paylaşılan veri nesnelerini, klasör sorumluluklarını ve geliştirme sınırlarını tanımlar.

## Proje Sınırları

Sadece MVP'yi ve proje dokümanlarında zaten tanımlanmış AI destekli özellikleri geliştirin.

Kapsam dahilinde:
- kullanıcı kayıt ve giriş işlemleri
- kayıp/bulunan eşya ilanı oluşturma
- fotoğraf yükleme
- arama ve filtreleme
- ilan detay sayfası
- sahiplenme ve çözülme akışı
- moderasyon akışı
- AI destekli eşleşme ve kısa açıklamalar

Kapsam dışında:
- doğrudan mesajlaşma/chat
- bildirimler
- mobil uygulama
- gelişmiş analitik
- çok kampüslü yapı

## Mimari Özeti

MatchProof basit bir katmanlı monolith yapı kullanır.

```text
Frontend UI -> API routes -> Services -> Models -> Database/Storage
                           -> Matching service -> Ranked match results
```

Ana klasörler:

```text
src/
  client/
    pages/
    components/
    services/
  server/
    routes/
    services/
    models/
```

## Ortak Temel Nesneler

Bu nesneler frontend ve backend tarafında tutarlı kalmalıdır.

### 1. User

Kullanım alanları:
- kimlik doğrulama
- ilan sahipliği
- moderasyon kontrolü

Alanlar:

```text
id
name
email
passwordHash
role            // user | admin
createdAt
updatedAt
```

### 2. Item

Bu sistemin ana ortak nesnesidir.

Kullanım alanları:
- ilan oluşturma/düzenleme formu
- arama sonuçları
- ilan detay sayfası
- sahiplenme/çözülme akışı
- moderasyon akışı
- AI eşleşme girdisi

Alanlar:

```text
id
itemType        // lost | found
title
description
category
location
status          // open | claimed | resolved | removed
imageUrl
ownerId
createdAt
updatedAt
```

### 3. SearchFilters

Kullanım alanları:
- arama sayfası
- backend arama servisi

Alanlar:

```text
query
category
itemType
status
page
pageSize
```

### 4. MatchCandidate

Kullanım alanları:
- AI eşleşme endpoint'i
- arama/detay ekranındaki eşleşme paneli

Alanlar:

```text
itemId
score
reasons         // ornek: ["same category", "similar color"]
matchedFields   // opsiyonel yapisal aciklama objesi
```

### 5. ModerationAction

Kullanım alanları:
- admin moderasyon route'u
- moderasyon arayüzü

Alanlar:

```text
id
itemId
adminUserId
reason
actionType      // remove
createdAt
```

## Frontend Sorumlulukları

Frontend tarafında çalışan kişiler ağırlıklı olarak `src/client` içinde çalışmalıdır.

### `src/client/pages`

Route seviyesindeki ekranları burada tutun:
- login/register sayfası
- ilan oluşturma/düzenleme sayfası
- arama/sonuçlar sayfası
- ilan detay sayfası
- admin moderasyon sayfası

### `src/client/components`

Yeniden kullanılabilir UI parçalarını burada tutun:
- form alanları
- item card
- search filter bar
- match result list
- moderation controls

### `src/client/services`

API çağrılarını burada tutun:
- auth istekleri
- item CRUD istekleri
- arama istekleri
- eşleşme istekleri
- moderasyon istekleri

İş kuralları backend'e aitse frontend içinde uygulanmamalıdır. Frontend yalnızca kullanıcı girdisini düzenler, API çağırır ve dönen sonucu gösterir.

## Backend Sorumlulukları

Backend tarafında çalışan kişiler ağırlıklı olarak `src/server` içinde çalışmalıdır.

### `src/server/routes`

HTTP endpoint'lerini burada tutun:
- auth route'ları
- item route'ları
- search route'ları
- match route'ları
- moderation route'ları

Route'lar ince kalmalıdır. Girdi doğrulayıp servisi çağırmalı ve response dönmelidir.

### `src/server/services`

Uygulama iş mantığını burada tutun:
- auth mantığı
- item create/update/delete mantığı
- search/filter mantığı
- status transition mantığı
- AI ranking mantığı
- explanation generation mantığı
- moderasyon mantığı

### `src/server/models`

Kalıcı veri tanımlarını burada tutun:
- user modeli
- item modeli
- moderation action modeli

Modeller UI'a özel mantık içermemelidir.

## API Sahipliği ve Sınırları

Önerilen endpoint seti:

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

POST   /api/items
PATCH  /api/items/:itemId
DELETE /api/items/:itemId
PATCH  /api/items/:itemId/status

GET    /api/items/search
GET    /api/items/:itemId
GET    /api/items/:itemId/matches

POST   /api/moderation/items/:itemId/remove
```

Kurallar:
- create/edit/delete/status/moderation mantığı backend'e aittir
- filtering, ranking ve explanation için tek doğru kaynak backend'dir
- frontend yalnızca dönen veriyi kullanır
- gelişmiş ranking hazır olmasa bile uygulama çalışmaya devam etmeli, AI matching için fallback olmalıdır
- owner iletişim bilgisi item içinde saklanmaz; detail response'ta `ownerContact` olarak user bilgisinden üretilir

## Ekip Çalışma Kuralları

Çakışmayı azaltmak için:

1. Her özelliğin uçtan uca tek bir sahibi olsun.
2. Ortak dosyaların tek bir net sahibi olsun.
3. Geliştirme sırasında scope genişletmeyin.
4. Yanlışlıkla chat veya bildirim geliştirmeyin.
5. AI mantığını frontend page dosyalarının içine koymayın.
6. UI formatlama mantığını backend service dosyalarına koymayın.

Ortak dosya sahipliği:
- frontend route/app shell: tek bir frontend sahibi
- backend main server/bootstrap: tek bir backend sahibi
- ortak item alan isimleri: ekip birlikte değiştirmedikçe bu dokümana göre sabit kabul edilir

## Önerilen Özellik Bölünmesi

En hızlı ve düşük çakışmalı dağılım, feature bazlı dağılımdır:

- Auth
- Item creation/editing
- Search/results/detail
- AI matching
- Claim/resolve/moderation

Her feature sahibi gerektiğinde şu alanlara dokunmalıdır:
- ilgili frontend page/component
- ilgili client API service metodları
- gerekiyorsa ilgili backend route/service/model

Bu yaklaşım, işi sadece frontend/backend diye ayırmaktan daha verimlidir; çünkü beklemeyi azaltır ve aynı dosyalara fazla kişinin girmesini engeller.

## Önerilen Geliştirme Sırası

1. Ortak nesne alanlarını ve endpoint isimlerini sabitleyin.
2. Auth ve temel ilan oluşturma akışını bitirin.
3. Arama ve ilan detay akışını bitirin.
4. Claim/resolve ve moderasyon akışını bitirin.
5. Çalışan arama sonuçlarının üstüne AI ranking ve explanation ekleyin.
6. Entegrasyon, bug fixing ve demo hazırlığını tamamlayın.

## Son Kural

Yeni bir özellik mevcut requirement veya use case'lerden birine açıkça bağlanmıyorsa, MVP tamamlanmadan o özelliği geliştirmeyin.
