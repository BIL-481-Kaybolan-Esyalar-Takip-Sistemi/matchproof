# MatchProof Frontend Ekip Rehberi

## Amaç

Bu doküman, frontend tarafında şu anda neyin hazır olduğunu, nelerin eksik olduğunu ve backend ile nasıl entegre olunacağını açık şekilde özetler.

Bu dosyanın hedefi:

- frontend geliştiren ekip üyesinin eksikleri hızlı görmesi
- hangi sayfanın hangi endpoint'i kullanacağını netleştirmek
- backend hazır olduğu halde henüz frontend'e bağlanmamış kısımları ayırmak

---

## Kısa Durum Özeti

Şu anda frontend tarafında:

- temel sayfalar var
- route yapısı var
- bazı UI bileşenleri var

Ama şu kritik parçalar eksik:

- gerçek `api` katmanı
- gerçek `AuthContext`
- gerçek `ToastContext`
- frontend build/dev çalışma altyapısı

Yani sorun sayfaların tamamen olmaması değil; asıl sorun bu sayfaların çalışması için gereken ortak altyapının eksik olması.

---

## Şu Anda Frontend'de Olan Dosyalar

Mevcut ana dosyalar:

- `src/client/App.jsx`
- `src/client/main.jsx`
- `src/client/components/Header.jsx`
- `src/client/components/ui.jsx`
- `src/client/pages/AuthPage.jsx`
- `src/client/pages/SearchPage.jsx`
- `src/client/pages/PostFormPage.jsx`
- `src/client/pages/DetailPage.jsx`
- `src/client/pages/AdminPage.jsx`

Bu sayfalar iskelet olarak mevcut. Yani sıfırdan sayfa yazmak gerekmiyor.

---

## Kesin Eksik Olan Ortak Katmanlar

### 1. API katmanı

Sayfalar `../api` import ediyor ama gerçek dosya görünmüyor.

Gerekli minimum yapı:

- `src/client/api/index.js`
- istenirse `src/client/api/http.js`

Burada en az şu fonksiyonlar olmalı:

- `Auth.register`
- `Auth.login`
- `Auth.logout`
- `Auth.me`
- `Items.search`
- `Items.get`
- `Items.create`
- `Items.update`
- `Items.delete`
- `Items.updateStatus`
- `Items.getMatches`
- `Moderation.removePost`

### 2. AuthContext

Uygulama bunu kullanıyor ama gerçek dosya görünmüyor.

Gerekli minimum yapı:

- `src/client/context/AuthContext.jsx`

Bu context en az şunları sağlamalı:

- `user`
- `login(payload)`
- `register(payload)`
- `logout()`
- uygulama açılırken `GET /api/auth/me` ile session kontrolü

### 3. ToastContext

Sayfalar hata ve başarı mesajı göstermek için bunu kullanıyor.

Gerekli minimum yapı:

- `src/client/context/ToastContext.jsx`

Bu context en az şunu sağlamalı:

- `showToast(message, type?)`

### 4. Frontend çalışma altyapısı

Şu an repoda frontend'i doğrudan ayağa kaldıracak net bir yapı görünmüyor.

Eksik görünen şeyler:

- frontend için `dev/build` scriptleri
- gerekiyorsa `vite.config`
- gerekiyorsa `index.html`

Bu kısım hangi araç kullanılacaksa ona göre netleştirilmeli.

---

## Sayfa Bazında Durum

## 1. AuthPage

Dosya:

- `src/client/pages/AuthPage.jsx`

Amaç:

- kayıt olma
- giriş yapma

Gerekli backend endpoint'leri:

- `POST /api/auth/register`
- `POST /api/auth/login`

Ek olarak gerekli:

- `GET /api/auth/me`
- `POST /api/auth/logout`

Durum:

- UI var
- form akışı var
- `useAuth()` yoksa sayfa gerçek çalışmaz

Eksik iş:

- `AuthContext` yazılmalı
- auth API çağrıları yazılmalı

---

## 2. SearchPage

Dosya:

- `src/client/pages/SearchPage.jsx`

Amaç:

- ilanları listelemek
- filtrelemek
- aramak
- detay sayfasına gitmek

Kullandığı backend endpoint:

- `GET /api/items/search`

Desteklenen filtreler:

- `query`
- `category`
- `itemType`
- `status`
- `dateFrom`
- `dateTo`
- `page`
- `pageSize`

Durum:

- UI var
- filtre alanları var
- pagination mantığı var

Eksik iş:

- `Items.search()` gerçek API çağrısı yazılmalı
- sonuç formatı backend cevabına bağlanmalı

Not:

- `dateFrom/dateTo` şu an eşyanın kaybolduğu gün değil, ilanın sisteme eklenme tarihini filtreler

---

## 3. PostFormPage

Dosya:

- `src/client/pages/PostFormPage.jsx`

Amaç:

- yeni ilan oluşturma
- mevcut ilanı düzenleme

Kullandığı backend endpoint'leri:

- `POST /api/items`
- `GET /api/items/:itemId`
- `PATCH /api/items/:itemId`

Durum:

- create/edit tek sayfada çözülmüş
- form alanları hazır
- fotoğraf seçme ve preview var

Eksik iş:

- multipart/form-data ile upload yapan `Items.create()` yazılmalı
- multipart/form-data ile update yapan `Items.update()` yazılmalı
- edit modunda item detayı gerçek API'den çekilmeli

Not:

- backend tarafı `image` alan adını bekliyor
- frontend form data bunu doğru göndermeli

---

## 4. DetailPage

Dosya:

- `src/client/pages/DetailPage.jsx`

Amaç:

- ilanın detayını göstermek
- owner ise status güncellemek
- owner ise düzenlemek / silmek
- admin ise remove etmek

Kullandığı backend endpoint'leri:

- `GET /api/items/:itemId`
- `PATCH /api/items/:itemId/status`
- `DELETE /api/items/:itemId`
- `POST /api/moderation/items/:itemId/remove`

Backend'de mevcut ama sayfada henüz kullanılmayan endpoint:

- `GET /api/items/:itemId/matches`

Durum:

- temel detay ekranı var
- status butonları var
- delete ve admin remove modal'ı var

Eksik iş:

- `Items.get()`
- `Items.updateStatus()`
- `Items.delete()`
- `Moderation.removePost()`
- isteğe bağlı ama proje için önemli: `Items.getMatches()` ile olası eşleşmeleri göstermek

Bu sayfada özellikle eksik olan proje özelliği:

- AI benzer eşya sonuçlarını gösteren bölüm henüz yok

Öneri:

- detail sayfasına `Possible Matches` bölümü eklenmeli
- bu bölüm `GET /api/items/:itemId/matches` kullanmalı

---

## 5. AdminPage

Dosya:

- `src/client/pages/AdminPage.jsx`

Amaç:

- admin kullanıcının ilanları görmesi
- uygunsuz / tekrar eden ilanları kaldırması

Kullandığı backend endpoint'leri:

- `GET /api/items/search`
- `POST /api/moderation/items/:itemId/remove`

Durum:

- temel admin panel UI'ı var
- remove akışı tasarlanmış

Eksik iş:

- gerçek admin API entegrasyonu
- auth state üzerinden admin kontrolü

Not:

- backend tarafında moderation endpoint sadece `admin` role için açık

---

## 6. Header ve Genel App Akışı

Dosyalar:

- `src/client/App.jsx`
- `src/client/components/Header.jsx`

Amaç:

- route koruması
- login olmayan kullanıcıyı `/login` sayfasına yönlendirme
- logout
- admin linkini sadece admin kullanıcıya gösterme

Gerekli backend endpoint'leri:

- `GET /api/auth/me`
- `POST /api/auth/logout`

Durum:

- route mantığı hazır
- header akışı hazır

Eksik iş:

- `AuthContext` olmadan bu yapı çalışmaz
- uygulama açılır açılmaz session kontrolü yapılmalı

---

## Frontend İçin Gerekli Backend Endpoint Listesi

Şu endpoint'ler frontend için hazır durumda:

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Items

- `GET /api/items/search`
- `POST /api/items`
- `GET /api/items/:itemId`
- `GET /api/items/:itemId/matches`
- `PATCH /api/items/:itemId`
- `PATCH /api/items/:itemId/status`
- `DELETE /api/items/:itemId`

### Moderation

- `POST /api/moderation/items/:itemId/remove`

Yani frontend'in şu an beklemesi gereken kritik bir backend endpoint eksiği yok.

---

## Backend'de Şu Anda Olmayan veya Sonraya Kalabilecek Şeyler

Frontend tarafı bunları varsaymamalı:

- moderation history listeleme endpoint'i
- remove edilen post'u geri alma endpoint'i
- ayrı admin dashboard istatistik endpoint'i

Bu yüzden frontend şimdilik mevcut endpoint'lere göre yazılmalı.

---

## Öncelikli Yapılacaklar

Frontend geliştiren kişi için en doğru sıra:

1. `api` katmanını yaz
2. `AuthContext` yaz
3. `ToastContext` yaz
4. `AuthPage` ile giriş/kayıt akışını çalıştır
5. `SearchPage` ile listeleme/arama akışını çalıştır
6. `PostFormPage` ile create/edit akışını çalıştır
7. `DetailPage` ile detail/status/delete akışını çalıştır
8. `AdminPage` ile moderation akışını çalıştır
9. `DetailPage` içine `Possible Matches` bölümünü ekle

---

## En Kritik Not

Şu an frontend tarafında en büyük eksik sayfalar değil, ortak uygulama altyapısıdır.

Özellikle bu üç şey tamamlanmadan uygulama gerçek anlamda ayağa kalkmaz:

- `api`
- `AuthContext`
- `ToastContext`

Backend tarafı temel entegrasyon için yeterince hazırdır. Frontend tarafının ana işi artık bu hazır endpoint'leri düzgün şekilde kullanmaktır.
