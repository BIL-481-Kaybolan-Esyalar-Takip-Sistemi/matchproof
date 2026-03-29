# MatchProof

## Kısa Açıklama

MatchProof, kampüs içindeki kayıp ve bulunan eşyalar için geliştirilen dijital bir ilan panosudur. Kullanıcılar kayıp veya bulunan eşya ilanı oluşturabilir, ilanları arayabilir, durum güncelleyebilir ve AI destekli benzer eşleşmeleri inceleyebilir.

## Kök Dizindeki Önemli Dosyalar

- `IMPLEMENTATION_GUIDE.md` — genel mimari, ortak veri yapıları ve ekip kuralları
- `BACKEND_TEAM_GUIDE.md` — backend tarafında tamamlanan işler, endpoint sözleşmeleri ve entegrasyon notları
- `FRONTEND_TEAM_GUIDE.md` — frontend tarafında eksik olan katmanlar, sayfa bazlı ihtiyaçlar ve backend bağlantıları
- `package.json` — bağımlılıklar ve scriptler
- `jest.config.cjs` — backend ve frontend test yapılandırması
- `.env.example` — gerekli environment değişkenleri

## Dokümantasyon

### `docs/assignment-1/`

- `docs/assignment-1/01-project-definition.md` — proje tanımı, kapsam, hedef kitle, ana özellikler
- `docs/assignment-1/02-project-plan.md` — proje planı, zaman çizelgesi, kaynaklar ve iletişim planı
- `docs/assignment-1/03-requirements.md` — fonksiyonel ve non-functional gereksinimler
- `docs/assignment-1/04-task-effort-estimation.md` — görev dağılımı ve efor tahminleri
- `docs/assignment-1/05-product-backlog.md` — Assignment 1 product backlog
- `docs/assignment-1/README.md` — Assignment 1 klasör özeti
- `docs/assignment-1/gantt_chart.png` — basit zaman çizelgesi görseli

### `docs/assignment-2/`

- `docs/assignment-2/01-design-document.md` — sistem tasarımı, use case desteği, teknoloji kararları
- `docs/assignment-2/02-quality-assurance-plan.md` — kalite güvencesi, test yaklaşımı ve doğrulama planı
- `docs/assignment-2/design-document-design-patterns.docx` — tasarım kalıpları ile ilgili ek çalışma dosyası

## Kaynak Kod Yapısı

### `src/client/`

Frontend tarafında mevcut olanlar:

- `src/client/App.jsx` — route yapısı ve protected route akışı
- `src/client/main.jsx` — React giriş noktası
- `src/client/pages/` — `AuthPage`, `SearchPage`, `PostFormPage`, `DetailPage`, `AdminPage`
- `src/client/components/` — `Header` ve ortak UI bileşenleri
- `src/client/services/` — frontend servis katmanı için ayrılmış klasör

Not:

- sayfalar büyük ölçüde mevcut
- `api`, `AuthContext` ve `ToastContext` gibi ortak frontend katmanları ayrı rehbere göre tamamlanmalıdır

### `src/server/`

Backend tarafında mevcut olanlar:

- `src/server/index.js` — server başlangıç noktası
- `src/server/app.js` — Express app, CORS, session, error handling
- `src/server/routes/` — auth, health, items, moderation endpoint’leri
- `src/server/services/` — auth, item iş kuralları, upload, matching, moderation, session yönetimi
- `src/server/models/` — PostgreSQL query katmanı
- `src/server/models/migrations/` — migration dosyaları

## Backend’de Tamamlanan Kapsam

- session tabanlı authentication
- `register`, `login`, `logout`, `me`
- item create / detail / update / delete
- local image upload
- item search + filtering + pagination
- item status update flow
- admin moderation remove flow
- AI matching endpoint altyapısı
- Jest tabanlı backend test yapısı

## Frontend’de Mevcut Durum

- temel sayfalar ve route yapısı var
- detay, arama, post oluşturma ve admin ekranlarının UI iskeleti var
- gerçek API katmanı ve context katmanları henüz tamamlanmamış

Detay için:

- `FRONTEND_TEAM_GUIDE.md`

## Test Durumu

- backend ve frontend için test dosyaları mevcut
- test kontratlarında yapılan son düzeltmeler repo içinde yer alıyor
- frontend testleri artık eksik bağımlılıkları gizlemeyecek şekilde sıkılaştırıldı

Not:

- testleri gerçekten çalıştırıp doğrulamak için yerel ortamda `node` ve bağımlılıkların hazır olması gerekir

## Mevcut Scriptler

```bash
npm run dev
npm start
npm run db:migrate
npm test
npm run test:coverage
npm run test:watch
```

## Hızlı Referans

- backend entegrasyonu için: `BACKEND_TEAM_GUIDE.md`
- frontend eksikleri ve yapılacaklar için: `FRONTEND_TEAM_GUIDE.md`
- genel mimari ve ortak kararlar için: `IMPLEMENTATION_GUIDE.md`
