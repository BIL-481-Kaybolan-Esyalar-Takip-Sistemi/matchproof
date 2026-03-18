# matchproof

## Kısa açıklama

MatchProof, kampüs içindeki kayıp ve bulunan eşyalar için geliştirilen dijital bir ilan panosudur. Kullanıcılar kayıp veya bulunan eşya ilanı oluşturabilir, ilanları arayabilir ve benzer eşleşmeleri inceleyebilir.

## Kök dizindeki önemli dosyalar

- `IMPLEMENTATION_GUIDE.md` — proje mimarisi, ortak nesneler ve geliştirme sınırları
- `BACKEND_TEAM_GUIDE.md` — backend tarafında şu ana kadar ne yapıldığı, endpoint’ler ve ekip devri notları
- `README.md` — repo genel görünümü

## Dokümantasyon

### `docs/assignment-1/`

- `docs/assignment-1/01-project-definition.md` — proje tanımı, kapsam, hedef kitle, özellikler
- `docs/assignment-1/02-project-plan.md` — proje planı, zaman çizelgesi, kaynaklar, iletişim
- `docs/assignment-1/03-requirements.md` — FR/NFR gereksinimleri
- `docs/assignment-1/04-task-effort-estimation.md` — görev dağılımı ve efor tahminleri
- `docs/assignment-1/05-product-backlog.md` — başlangıç backlog’u
- `docs/assignment-1/README.md` — Assignment 1 klasör özeti

### `docs/assignment-2/`

- `docs/assignment-2/01-design-document.md` — sistem tasarımı, use case desteği, teknoloji kararları

## Kaynak kod yapısı

### `src/client/`

Frontend iskeleti:

- `src/client/pages/` — sayfa bazlı bileşenler
- `src/client/components/` — tekrar kullanılabilir UI parçaları
- `src/client/services/` — API çağrıları

### `src/server/`

Backend uygulaması:

- `src/server/index.js` — server başlangıç noktası
- `src/server/app.js` — Express uygulaması ve middleware’ler
- `src/server/routes/` — endpoint tanımları
- `src/server/services/` — iş kuralları, auth, search, moderation, upload
- `src/server/models/` — PostgreSQL query katmanı
- `src/server/models/migrations/` — veritabanı migration dosyaları

## Şu an backend’de olanlar

Tamamlanan backend kapsamı:

- auth (`register`, `login`, `logout`, `me`)
- item CRUD
- local image upload
- item search + filtering + pagination
- item status update flow
- admin moderation remove flow

Henüz yapılmayan ana backend işleri:

- AI matching endpoint’leri
- otomatik testler

Detaylı backend sözleşmesi ve örnek endpoint kullanımı için:

- `BACKEND_TEAM_GUIDE.md`
