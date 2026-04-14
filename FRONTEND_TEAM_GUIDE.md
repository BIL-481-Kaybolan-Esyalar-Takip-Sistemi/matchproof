# MatchProof Frontend Team Guide

## Amaç

Bu doküman, frontend tarafında şu an hangi parçaların tamamlandığını, backend ile hangi bağlantıların kurulduğunu ve hangi işlerin hâlâ kaldığını net şekilde özetler.

---

## Genel Durum

Frontend tarafında kritik eksik olan ortak katmanlar artık eklenmiş durumda:

- `src/client/api/index.js`
- `src/client/context/AuthContext.jsx`
- `src/client/context/ToastContext.jsx`
- `vite.config.js`
- `index.html`

Bu yüzden frontend artık sadece sayfa iskeletlerinden ibaret değil; backend’e bağlı çalışan gerçek bir akış kurulmuş durumda.

---

## Şu Anda Hazır Olanlar

### Ortak frontend katmanları

- gerçek API katmanı var
- auth state yönetimi var
- toast sistemi var
- Vite tabanlı frontend çalışma altyapısı var

### Sayfalar

- `AuthPage`
- `SearchPage`
- `PostFormPage`
- `DetailPage`
- `AdminPage`

### Genel uygulama akışı

- route yapısı var
- login olmayan kullanıcı için protected route var
- header üzerinden login / logout / admin görünürlüğü var

---

## Dosya Bazında Durum

## 1. API Katmanı

Dosya:

- `src/client/api/index.js`

Şu fonksiyonlar mevcut:

### Auth

- `Auth.register`
- `Auth.login`
- `Auth.logout`
- `Auth.me`

### Items

- `Items.search`
- `Items.get`
- `Items.create`
- `Items.update`
- `Items.delete`
- `Items.updateStatus`
- `Items.getMatches`

### Moderation

- `Moderation.removePost`

Durum:

- backend endpoint’leri ile temel bağlantı kurulmuş
- `credentials: 'include'` kullanıldığı için session/cookie akışı düşünülmüş
- `FormData` ile image upload desteği var

Not:

- ayrı bir `http.js` dosyası yok; şu an ihtiyaç zorunlu olmadığı için tek dosyada tutulmuş

---

## 2. AuthContext

Dosya:

- `src/client/context/AuthContext.jsx`

Şu akışlar mevcut:

- uygulama açılırken `Auth.me()` ile session kontrolü
- `login`
- `register`
- `logout`
- `user` state’i

Durum:

- rehberde beklenen minimum auth davranışı sağlanmış

---

## 3. ToastContext

Dosya:

- `src/client/context/ToastContext.jsx`

Durum:

- `showToast(message, type?)` desteği var
- success/error mesajları ekranda gösteriliyor

---

## 4. Frontend Çalıştırma Altyapısı

Mevcut dosyalar:

- `vite.config.js`
- `index.html`

Mevcut scriptler:

- `npm run dev:client`
- `npm run build`
- `npm run preview`

Not:

- full-stack geliştirme için `npm run dev:full` scripti eklenmiştir

---

## Sayfa Bazında Durum

## 1. AuthPage

Dosya:

- `src/client/pages/AuthPage.jsx`

Bağlandığı backend endpoint’leri:

- `POST /api/auth/register`
- `POST /api/auth/login`
- dolaylı olarak `GET /api/auth/me`
- dolaylı olarak `POST /api/auth/logout`

Durum:

- form akışı çalışacak seviyede
- auth context ile entegre
- toast ve redirect akışı bağlı

Kalan olası işler:

- UX/polish
- form validation iyileştirmeleri

---

## 2. SearchPage

Dosya:

- `src/client/pages/SearchPage.jsx`

Bağlandığı endpoint:

- `GET /api/items/search`

Şu filtreleri kullanıyor:

- `query`
- `category`
- `itemType`
- `status`
- `dateFrom`
- `dateTo`
- `page`
- `pageSize`

Durum:

- gerçek arama çağrısı bağlı
- pagination bağlı
- item detail sayfasına geçiş bağlı

Kalan olası işler:

- filtre UX iyileştirmesi
- boş durum / loading polish

---

## 3. PostFormPage

Dosya:

- `src/client/pages/PostFormPage.jsx`

Bağlandığı endpoint’ler:

- `POST /api/items`
- `GET /api/items/:itemId`
- `PATCH /api/items/:itemId`

Durum:

- create akışı bağlı
- edit akışı bağlı
- image upload bağlı
- preview desteği var
- `ID Card` kategorisi seçildiğinde ilan otomatik olarak private olur

Not:

- backend `image` alanını bekliyor; frontend bunu doğru şekilde `FormData` ile gönderiyor
- hassas kategoriler için privacy checkbox otomatik kilitlenir ve kullanıcıya açıklama gösterilir

Kalan olası işler:

- daha gelişmiş client-side validation
- upload error mesajlarını daha açıklayıcı yapma

---

## 4. DetailPage

Dosya:

- `src/client/pages/DetailPage.jsx`

Bağlandığı endpoint’ler:

- `GET /api/items/:itemId`
- `GET /api/items/:itemId/matches`
- `PATCH /api/items/:itemId/status`
- `DELETE /api/items/:itemId`
- `POST /api/moderation/items/:itemId/remove`

Durum:

- detail verisi geliyor
- owner status güncelleme akışı bağlı
- delete akışı bağlı
- admin remove akışı bağlı
- AI Possible Matches bölümü eklenmiş ve backend’e bağlı
- AI servisi hata verirse kullanıcıya manuel aramaya dönmesini söyleyen fallback mesajı gösteriliyor

Bu önemli:

- daha önce eksik olan AI matches gösterimi artık var

Kalan olası işler:

- matches kartlarının görsel iyileştirmesi
- AI hata durumunda kullanıcıyı filtrelenmiş aramaya yönlendiren daha gelişmiş akış

---

## 5. AdminPage

Dosya:

- `src/client/pages/AdminPage.jsx`

Bağlandığı endpoint’ler:

- `GET /api/items/search`
- `POST /api/moderation/items/:itemId/remove`

Durum:

- admin panel akışı bağlı
- remove modal akışı bağlı
- role kontrolü sayfa içinde yapılıyor

Not:

- route seviyesi admin guard yok; şu an erişim kontrolü sayfa içinde yapılıyor
- bu bir bug olmak zorunda değil ama daha sıkı koruma istenirse ayrı `AdminRoute` eklenebilir

---

## 6. Header ve App Akışı

Dosyalar:

- `src/client/App.jsx`
- `src/client/components/Header.jsx`

Durum:

- `AuthProvider` ve `ToastProvider` bağlı
- login olmayan kullanıcı protected route ile `/login` sayfasına yönleniyor
- logout akışı bağlı
- admin linki role’a göre gösteriliyor

---

## Backend ile Bağlı Olan Endpoint Listesi

Frontend tarafının şu anda kullanabildiği backend endpoint’ler:

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

Bu listede frontend’in temel akışını engelleyen kritik bir backend endpoint eksiği görünmüyor.

---

## Şu An Kalan Eksikler

Şu anda kalan işler daha çok tamamlayıcı nitelikte:

- frontend testlerinin gerçekten çalıştırılıp doğrulanması
- gerekirse Babel/Jest frontend test ayarlarının netleştirilmesi
- UI/UX polish
- stricter admin route guard istenirse eklenmesi
- istenirse `src/client/services` klasörünün ya kullanılacak hale getirilmesi ya da sadeleştirilmesi

---

## Net Sonuç

Frontend tarafında daha önce rehberde kritik eksik olarak yazılan ana parçalar artık eklenmiş durumda.

Yani şu an:

- backend’e bağlanan gerçek frontend katmanı var
- auth/session akışı var
- toast sistemi var
- Vite tabanlı çalışma altyapısı var
- AI matches dahil temel ürün akışları bağlı

Bu noktadan sonra frontend tarafındaki iş daha çok:

- doğrulama
- iyileştirme
- polish
- test düzeltmesi

seviyesine geçmiş durumda.
