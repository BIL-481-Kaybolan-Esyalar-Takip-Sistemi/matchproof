# Quality Assurance (QA) Plan

**Project Name:** MatchProof  
**Course:** BIL 481  
**Version:** 1.0  
**Date:** 2026-04-02

## List of Contributors

### Team Members
- Mehmet Gür
- Zehra Atalay
- Elif Beyza Turan
- Yiğit Yıldız
- Alp Eren Köksal

### Contributors to this document
- Alp Eren Köksal
- Mehmet Gür

## Table of Contents

1. Document-Specific Task Matrix
2. Kalite Güvence Stratejisi (Quality Assurance Strategy)
3. Kalite Faktörleri ve Metrikleri (Quality Factors & Metrics)
4. Test Planı (Test Plan)

Bu belge, **MatchProof** uygulamasının güvenilirliğini, verimliliğini ve kullanılabilirliğini sağlamaya yönelik sistematik yaklaşımı özetlemektedir. Projenin yaşam döngüsüne entegre edilen test ve kalite güvence prosedürleri için kapsamlı bir rehber niteliğindedir.

---

## 1. Document-Specific Task Matrix

| Task | Responsible | Support | Status |
|---|---|---|---|
| QA strategy writing | Alp Eren Köksal | - | Completed |
| Quality factors table - performance row | Mehmet Gür | - | Completed |
| Test methodologies writing | Mehmet Gür | - | Completed |
| Test scenarios writing | Mehmet Gür | - | Completed |
| Bug tracking workflow writing | Alp Eren Köksal | - | Completed |
| Formatting and table of contents | Alp Eren Köksal | - | Completed |

---

## 2. Kalite Güvence Stratejisi (Quality Assurance Strategy)

### Genel Bakış (Overview)
MatchProof QA stratejisinin temel amacı; kampüs içi kayıp ve buluntu eşyalar için güvenli, yüksek doğruluğa sahip ve kullanıcı dostu bir platform sunmaktır. Karmaşık yapay zeka (AI) tabanlı eşleştirme algoritmalarının ve dinamik arayüz etkileşimlerinin varlığı göz önünde bulundurulduğunda, yaklaşımımız temel mantığın (Yapay Zeka süreçleri) izole bir şekilde doğrulanmasını ve React uygulaması aracılığıyla son kullanıcı deneyiminin sürekli test edilmesini zorunlu kılar.

### Test Metodolojileri (Testing Methodologies)
MatchProof, üç katmanlı bir otomatik test yaklaşımı kullanır:
- **Backend Jest Testleri:** Servis, model, middleware ve route-contract katmanları Jest ile doğrulanır. Bu katman; auth kuralları, item iş kuralları, moderation akışı, matching servisi ve hata sözleşmeleri gibi backend mantığını hızlı şekilde test eder.
- **Frontend Component Testleri:** React sayfaları ve temel kullanıcı etkileşimleri `React Testing Library` ile doğrulanır. Bu katmanda API çağrıları mocklanır, ancak eksik modülleri gizleyen sanal bağımlılık yaklaşımı kullanılmaz.
- **Uçtan Uca (E2E) Testler:** Gerçek kullanıcı akışları `Playwright` ile doğrulanır. Tarayıcı seviyesinde register/login, ilan oluşturma, arama, detail görüntüleme, AI possible matches, status geçişi ve admin moderation akışları test edilir.

### Otomatik vs. Manuel Testler (Automated vs. Manual Testing)
- **Otomatik Testler (Automated Testing):** Ana doğrulama hattı otomatik çalışır. Jest katmanı hızlı regresyon kontrolü sağlar; Playwright katmanı ise gerçek kullanıcı akışlarını doğrular.
- **Manuel Testler (Manual Testing):** Görsel düzen, responsive davranış, farklı tarayıcılardaki görünüm, yazı taşmaları ve kullanılabilirlik hissi gibi konular sürüm öncesinde manuel kontrol edilir.

---

## 3. Kalite Faktörleri ve Metrikleri (Quality Factors & Metrics)

MatchProof için kalite değerlendirmesi yalnızca genel metriklerle değil; aynı zamanda hedef değer, ilgili test ve ilgili gereksinimlerle birlikte izlenmektedir. Aşağıdaki tablo, kalite faktörleri ile bunların ölçüm ve doğrulama ilişkisini göstermektedir:

| Kalite Faktörü (Quality Factor) | Kalite Kriteri (Quality Criteria) | Ölçüm Metriği (Metric) | Hedef Değer (Target Value) | İlgili Test(ler) (Related Test) | İlgili Gereksinim(ler) (Related Requirements) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Performans (Performance)** | Temel kullanıcı işlemleri etkileşimli kullanım için yeterince hızlı yanıt vermelidir. | Çekirdek API işlemleri için ortalama yanıt süresi (ms) | Normal koşullarda `<= 2000 ms` | TC-01, TC-02, TC-03, TC-05, TC-06 | NFR1, FR1, FR2, FR5, FR7, FR9 |
| **Kullanılabilirlik (Usability)** | Kullanıcı, kayıt olma, ilan oluşturma ve arama akışlarını ek rehber gerektirmeden tamamlayabilmelidir. | Görev tamamlama başarısı + CSAT puanı | Kritik akışlarda başarılı tamamlama, CSAT `>= 4/5` | TC-01, TC-02, TC-03 + manuel UI kullanılabilirlik kontrolü | NFR2, FR1, FR2, FR5 |
| **Tarayıcı Uyumluluğu (Browser Compatibility)** | Uygulama modern masaüstü tarayıcılarda tutarlı biçimde çalışmalıdır. | Tarayıcı smoke test geçiş oranı | Chrome, Firefox ve Edge üzerinde `%100` kritik akış geçişi | TC-01–TC-06 senaryolarının tarayıcı smoke kontrolü | NFR3 |
| **Gizlilik ve Yetkilendirme (Privacy & Access Control)** | Yetkisiz kullanıcılar kısıtlı verilere ve korunan işlemlere erişememelidir. | Yetkisiz isteklerin doğru biçimde reddedilme oranı | İlgili authorization testlerinde `%100` doğru red | TC-01, TC-05, TC-06 | NFR4, FR1, FR8, FR9, FR10 |
| **Eşleştirme Kalitesi (Matching Quality)** | Benzer kayıp ve buluntu ilanları tutarlı şekilde sıralanmalı ve kısa açıklama ile sunulmalıdır. | Küratörlü örnek set üzerinde yanlış eşleşme oranı + deterministic match contract geçişi | Yanlış eşleşme oranı `<= %20`, stub match senaryolarında `%100` geçiş | TC-04 + örnek eşleşme seti üzerinde manuel doğrulama | FR11, FR12, FR13, FR14 |
| **Bakım Kolaylığı (Maintainability)** | Kod tabanı yeni özellik ve hata düzeltmelerine kontrollü şekilde açılabilmelidir. | Otomatik test kapsamı + tüm test hattının geçiş durumu | Çekirdek modüllerde kapsam `>= %80`, `test:all` `%100` geçiş | Jest backend/component testleri + Playwright E2E | NFR5 |
| **Erişilebilirlik / Süreklilik (Availability)** | Sistem planlanan test ve demo süresince temel işlevleri kesintisiz sunabilmelidir. | Çalışma süresi yüzdesi (uptime) | Planlanan test/demo sürecinde `>= %95` erişilebilirlik | Deployment smoke testleri + operasyonel izleme kayıtları | NFR6 |

Not: Tarayıcı uyumluluğu, kullanılabilirlik ve erişilebilirlik gibi kalite faktörlerinin bir kısmı otomatik testlerle, bir kısmı ise manuel doğrulama ve dağıtım sonrası izleme ile takip edilir. Bu nedenle tablo, yalnızca kod seviyesi testleri değil, proje genelindeki kalite güvence yaklaşımını temsil eder.

---

## 4. Test Planı (Test Plan)

### Test Senaryoları (Test Cases - En az 5 detaylı senaryo)

**TC-01: Register + Login Akışı**
- **Kapsam:** Yeni kullanıcı oluşturma ve güvenli oturum başlatma.
- **İşlem Adımları:** Kullanıcı register formunu doldurur, başarılı kayıt sonrası çıkış yapar ve aynı bilgilerle tekrar login olur.
- **Beklenen Sonuç (Expected Result):** Kullanıcı başarıyla ana sayfaya yönlendirilir; session bazlı oturum açılmış olur.

**TC-02: Yeni İlan Oluşturma ve Detail Sayfasına Geçiş**
- **Kapsam:** Authenticated kullanıcının yeni bir kayıp/buluntu ilanı oluşturabilmesi.
- **İşlem Adımları:** Kullanıcı yeni ilan formunda `itemType`, `title`, `category`, `location` ve `description` alanlarını doldurup ilanı kaydeder.
- **Beklenen Sonuç:** Backend yeni ilanı oluşturur ve kullanıcı ilgili detail sayfasına yönlendirilir.

**TC-03: Arama ve Filtreleme Akışı**
- **Kapsam:** Kullanıcının ilanları arayıp filtreleyebilmesi.
- **İşlem Adımları:** Kullanıcı arama kutusuna bir anahtar kelime girer veya kategori / status filtresi uygular ve aramayı tetikler.
- **Beklenen Sonuç:** İlgili `GET /api/items/search` çağrısı doğru parametrelerle yapılır ve beklenen ilanlar listelenir.

**TC-04: AI Possible Matches Görüntüleme**
- **Kapsam:** Detail sayfasında eşleşme sonuçlarının tutarlı biçimde gösterilmesi.
- **İşlem Adımları:** Kullanıcı bir item detail sayfasını açar; test ortamında `MATCHING_MODE=stub` aktif olduğu için backend deterministik match sonucu döner.
- **Beklenen Sonuç:** `AI Possible Matches` bölümü görünür, eşleşme kartları render edilir ve ilgili item detail sayfasına gidilebilir.

**TC-05: Status Geçişi**
- **Kapsam:** İlan sahibinin yalnızca izinli status geçişlerini yapabilmesi.
- **İşlem Adımları:** İlan sahibi önce `open -> claimed`, ardından `claimed -> resolved` aksiyonlarını tetikler.
- **Beklenen Sonuç:** Her iki geçiş de başarılı olur; geçersiz geçişler backend tarafından reddedilir.

**TC-06: Admin Moderation Remove**
- **Kapsam:** Admin kullanıcının uygunsuz veya gereksiz ilanı kaldırabilmesi.
- **İşlem Adımları:** Admin moderation panelinden bir ilanı remove eder ve sebep alanını doldurur.
- **Beklenen Sonuç:** İlan `removed` durumuna geçer, moderation kaydı oluşturulur ve ilan normal arama sonuçlarından kaybolur.

### Hata Takip Süreci (Bug Tracking)
Gerek oluşturulan otomatik bot testlerinden (Jest) alınan dökümler, gerekse manuel test aşamasında tespit edilen sistemsel aksaklıklar, şu düzenli planlamaya göre kontrol edilir:
1. **Raporlama Bölümü (Reporting):** Tüm hatalar ve buglar, projenin merkezi hata veri kayıt sistemine (**GitHub Issues** veya proje yönetimine bağlı olarak Trello/Jira kartlarına) kaydedilir. Hata raporunda; nasıl tekrar edebileceği, beklenen test sonucu ve çıkan hatalı sonuç yer alır.
2. **Kategorizasyon ve Önceliklendirme:** Başmühendis, tespit edilen hatanın zorluk ve riski (Kritik, Yüksek, Orta, Düşük) tabanında öncelik tanır. İlgili alandan yetkili bir ekibe/etikeye (`AI-backend`, `UI-frontend`, `auth`) görevlendirilir.
3. **Çözüm Yönetimi (Resolution Workflow):** Issue işleme alınır. Süreç boyunca bilet durumu güncellenir: `Açık -> Üzerinde Çalışılıyor -> Kod İncelemesinde -> QA Kontrolü (Orijinal testlerin Passed vermesi) -> Kapalı`. Hata giderildikten sonra ancak ve ancak QA tarafından tekrar doğrulandığında kaynak koduna başarıyla geçirilir ve dosya kapatılır.

---

## 5. Configuration and Change Management (6.3)

### 5.1 Version Control Strategy

MatchProof uses **Git** with a GitHub-hosted repository as the single source of truth for all source code and documentation.

**Branching Model:**

| Branch | Purpose |
|---|---|
| `main` | Stable, demo-ready code. Direct commits are forbidden. |
| `develop` | Integration branch. All feature branches are merged here first. |
| `feature/<name>` | Short-lived branches for individual features or fixes. |
| `hotfix/<name>` | Emergency fixes applied directly on top of `main`. |

**Commit Convention:**  
All commits follow the Conventional Commits format: `<type>(<scope>): <description>`  
Examples: `feat(auth): add session expiry`, `fix(search): correct pagination offset`, `docs(qa): add 6.3 section`

### 5.2 Configuration Item (CI) List

The following items are tracked as configuration items:

| CI ID | Item | Location |
|---|---|---|
| CI-01 | Application source code | `src/` |
| CI-02 | Test suite | `tests/` |
| CI-03 | Assignment documentation | `docs/` |
| CI-04 | Database schema and migration scripts | `src/server/db/` |
| CI-05 | Dependency manifests | `package.json`, `package-lock.json` |
| CI-06 | Environment configuration template | `.env.example` |

### 5.3 Change Request Process

1. **Propose:** Any team member opens a GitHub Issue describing the change, affected components, and justification.
2. **Review:** At least one other team member reviews and approves the issue before work begins.
3. **Implement:** The developer creates a `feature/` branch from `develop`, implements the change, and writes/updates tests.
4. **Pull Request:** A Pull Request (PR) is opened against `develop`. The PR must pass all automated tests (`npm run test:all`) and receive at least one approving review.
5. **Merge:** After approval and green CI, the PR is squash-merged into `develop`.
6. **Release:** When a milestone is complete, `develop` is merged into `main` via a PR with updated version tag.

### 5.4 Versioning

Document and software versions follow **Semantic Versioning** (`MAJOR.MINOR.PATCH`):
- `MAJOR`: Breaking changes to API contracts or database schema
- `MINOR`: New features added in a backward-compatible manner
- `PATCH`: Bug fixes and documentation corrections

Current version: `1.0.0` (Assignment 2 submission baseline)

---

## 6. Product Evaluation and Acceptance (6.5)

### 6.1 Acceptance Criteria Overview

A product increment is considered **accepted** when all of the following conditions are met. Criteria are directly traceable to functional and non-functional requirements.

### 6.2 Functional Acceptance Criteria

| AC ID | Acceptance Criterion | Linked FR | Verification Method |
|---|---|---|---|
| AC-01 | A new user can register with name, email, and password; the account persists and can be used to login | FR1 | Automated (Jest + Playwright TC-01) |
| AC-02 | An authenticated user can create a lost or found post with all required fields; the post appears in search results | FR2, FR3, FR4 | Automated (Jest + Playwright TC-02) |
| AC-03 | Keyword search returns relevant results; category and status filters correctly narrow the result set | FR5, FR6 | Automated (Jest + Playwright TC-03) |
| AC-04 | An item detail page displays the owner's contact information to authenticated viewers | FR8 | Automated (Jest) |
| AC-05 | The item owner can transition status: `open → claimed → resolved`; invalid transitions are rejected | FR7 | Automated (Jest + Playwright TC-05) |
| AC-06 | An admin user can remove a post with a reason; the post disappears from search and a moderation record is created | FR9 | Automated (Jest + Playwright TC-06) |
| AC-07 | An authenticated user can edit or delete their own post; editing another user's post is forbidden | FR10 | Automated (Jest) |
| AC-08 | The AI matching module returns a ranked list of candidate items with similarity scores for a given item | FR11, FR12, FR13 | Automated TC-04 (stub mode) + Manual |
| AC-09 | Each AI match includes a short natural-language explanation (e.g., "similar category, matching color description") | FR14 | Automated TC-04 + Manual review |

### 6.3 Non-Functional Acceptance Criteria

| AC ID | Acceptance Criterion | Linked NFR | Threshold | Verification Method |
|---|---|---|---|---|
| AC-10 | Core API operations (auth, create, search) respond within 2000 ms under normal load | NFR1 | ≤ 2000 ms | Automated timing assertions |
| AC-11 | Critical user flows complete successfully on Chrome, Firefox, and Edge | NFR3 | 100% pass rate | Browser smoke tests |
| AC-12 | Unauthenticated requests to protected endpoints receive HTTP 401; unauthorized role actions receive HTTP 403 | NFR4 | 100% correct rejection | Jest authorization tests |
| AC-13 | Core module test coverage is at or above 80% | NFR5 | ≥ 80% | `npm run test:coverage` report |
| AC-14 | The system is accessible and responsive during all scheduled demo and test windows | NFR6 | ≥ 95% uptime | Manual verification during demo |

### 6.4 Demo Acceptance Checklist

Before the final demo, the following checklist must be completed:

- [ ] All Jest backend tests pass (`npm run test:server`)
- [ ] All Jest frontend component tests pass (`npm run test:client`)
- [ ] Playwright E2E tests pass on the local or staging environment
- [ ] Test coverage report shows ≥ 80% on core modules
- [ ] UC1 (Register/Login) demonstrated end-to-end
- [ ] UC2 (Create Post with Photo) demonstrated end-to-end
- [ ] UC3 (Search + AI Matches) demonstrated end-to-end
- [ ] UC4 (Claim/Resolve + Admin Moderation) demonstrated end-to-end
- [ ] No known Critical or High severity open bugs

### 6.5 Acceptance Sign-Off

The product increment is formally accepted when the demo checklist is fully completed and the project supervisor or designated evaluator confirms that the demonstrated behavior matches the requirements documented in this plan.
