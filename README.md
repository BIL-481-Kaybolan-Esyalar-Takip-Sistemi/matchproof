# MatchProof

## Kısa Açıklama

MatchProof, kampüs içindeki kayıp ve bulunan eşyalar için geliştirilen dijital bir ilan panosudur. Kullanıcılar kayıp veya bulunan eşya ilanı oluşturabilir, ilanları arayabilir, durum güncelleyebilir ve AI destekli benzer eşleşmeleri inceleyebilir.

## Kök Dizindeki Önemli Dosyalar

- `IMPLEMENTATION_GUIDE.md` — genel mimari, ortak veri yapıları ve ekip kuralları
- `BACKEND_TEAM_GUIDE.md` — backend tarafında tamamlanan işler, endpoint sözleşmeleri ve entegrasyon notları
- `FRONTEND_TEAM_GUIDE.md` — frontend tarafında tamamlanan bağlantılar, kalan işler ve sayfa bazlı durum
- `.github/workflows/ci.yml` — GitHub Actions ile unit/component test doğrulaması
- `package.json` — bağımlılıklar ve scriptler
- `jest.config.cjs` — backend ve frontend test yapılandırması
- `playwright.config.cjs` — Playwright E2E test yapılandırması
- `scripts/dev-fullstack.js` — backend ve frontend geliştirme sunucularını tek komutla başlatan script
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
- `docs/assignment-2/03-architecture-selection.md` — mimari alternatifler ve seçimin gerekçesi
- `docs/assignment-2/04-uml-representation.md` — top-level architecture, class, sequence ve deployment UML çıktıları
- `docs/assignment-2/05-design-document-initial-phase.md` — tasarım dokümanının ilk faz sürümü
- `docs/assignment-2/06-requirements-to-product-backlog-transition.md` — requirement-backlog geçişinin izlenebilir özeti
- `docs/assignment-2/design-document-design-patterns.docx` — tasarım kalıpları ile ilgili ek çalışma dosyası

### `docs/test/`

- `docs/test/01-test-report.md` — düzeltilen test sorunları ve son test özeti
- `docs/test/02-test-strategy.md` — unit/component/E2E test yaklaşımı ve komutlar

### `docs/assignment-3/`

- `docs/assignment-3/01-delta-design-implementation-report.md` — review sonrası seçilen iyileştirmeler, efor tahmini ve delta tasarım raporu
- `docs/assignment-3/02-quality-factors.md` — kalite faktörleri, metrikler ve hedef değerler
- `docs/assignment-3/03-supplementary-requirements.md` — ek gereksinimler ve son durumları
- `docs/assignment-3/04-risk-management.md` — güncellenmiş risk analizi ve aksiyonlar
- `docs/assignment-3/05-user-stories.md` — demo odaklı user story seti
- `docs/assignment-3/06-product-acceptance-and-config-management.md` — kabul kriterleri ve konfigürasyon yönetimi özeti

### `docs/demo/`

- `docs/demo/02-full-team-demo-script.md` — 15 dakikalık final demo akışı ve konuşma planı

### `docs/sprints/`

- `docs/sprints/sprint-1.md` — ilk sprint özeti
- `docs/sprints/sprint-2.md` — ikinci sprint özeti
- `docs/sprints/sprint-3.md` — üçüncü sprint özeti

### `docs/reviews/`

- `docs/reviews/MatchProof.odt` — proje review notları
- `docs/reviews/dizi_kutusu.odt` — örnek review dokümanı
- `docs/reviews/osman.odt` — ek review dokümanı

## Kaynak Kod Yapısı

### `src/client/`

Frontend tarafında mevcut olanlar:

- `src/client/App.jsx` — route yapısı ve protected route akışı
- `src/client/main.jsx` — React giriş noktası
- `src/client/api/` — backend endpoint’lerine giden frontend API katmanı
- `src/client/context/` — auth ve toast state yönetimi
- `src/client/pages/` — `AuthPage`, `SearchPage`, `PostFormPage`, `DetailPage`, `AdminPage`
- `src/client/components/` — `Header` ve ortak UI bileşenleri
- `src/client/services/` — isteğe bağlı ek frontend servisleri için ayrılmış klasör

Not:

- sayfalar ve ortak frontend katmanları mevcut
- AI matches dahil temel ürün akışları backend’e bağlanmış durumda
- detaylı durum için `FRONTEND_TEAM_GUIDE.md` kullanılmalı

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
- gerçek API katmanı var
- `AuthContext` ve `ToastContext` var
- `DetailPage` içinde AI possible matches akışı bağlı
- Vite tabanlı frontend çalışma altyapısı var

Detay için:

- `FRONTEND_TEAM_GUIDE.md`

## Test Durumu

- backend ve frontend için Jest test katmanı mevcut
- gerçek kullanıcı akışları için Playwright E2E katmanı eklendi
- AI matching E2E ortamında `MATCHING_MODE=stub` ile deterministik doğrulanır
- E2E başlangıcında test verisi resetlenip seed edilir
- GitHub Actions CI hattı `npm run test:unit` ile temel doğrulamayı otomatik çalıştırır

Not:

- Playwright testleri için tarayıcı binary’lerinin kurulu olması gerekir
- varsayılan E2E test veritabanı `pg-mem://matchproof_e2e` olarak gelir

## Mevcut Scriptler

```bash
npm run dev
npm run dev:client
npm run dev:full
npm start
npm run build
npm run preview
npm run db:migrate
npm test
npm run test:unit
npm run test:e2e
npm run test:all
npm run test:coverage
npm run test:watch
```

## Geliştirme Akışı

Sadece backend başlatmak için:

```bash
npm run dev
```

Sadece frontend başlatmak için:

```bash
npm run dev:client
```

Backend + frontend’i birlikte başlatmak için:

```bash
npm run dev:full
```

## Hızlı Referans

- backend entegrasyonu için: `BACKEND_TEAM_GUIDE.md`
- frontend eksikleri ve yapılacaklar için: `FRONTEND_TEAM_GUIDE.md`
- genel mimari ve ortak kararlar için: `IMPLEMENTATION_GUIDE.md`
