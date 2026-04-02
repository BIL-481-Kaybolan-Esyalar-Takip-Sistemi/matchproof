# Kalite Güvence (QA) Planı

Bu belge, **MatchProof** uygulamasının güvenilirliğini, verimliliğini ve kullanılabilirliğini sağlamaya yönelik sistematik yaklaşımı özetlemektedir. Projenin yaşam döngüsüne entegre edilen test ve kalite güvence prosedürleri için kapsamlı bir rehber niteliğindedir.

---

## 1. Kalite Güvence Stratejisi (Quality Assurance Strategy)

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

## 2. Kalite Faktörleri ve Metrikleri (Quality Factors & Metrics)

MatchProof'un mükemmelliğini objektif olarak değerlendirebilmek için test edilen 4 ana kalite faktörü ve bunların ölçüm metrikleri şunlardır:

| Kalite Faktörü (Quality Factor) | Açıklama (Description) | Ölçüm Metriği (Measurement Metric) |
| :--- | :--- | :--- |
| **Performans (Performance)** | Sistemin, özellikle yapay zeka destekli metin ve resim inceleme işlemlerindeki yanıt süresi ve sürati. | API başına düşen **Ortalama yanıt süresi (Average response time - ms)**. |
| **Doğruluk/Güvenlik (Match Accuracy)** | Yapay zekanın çalıştırdığı metin, sınıflandırma ve resim eşleştirme doğruluk kapasitesi. | Sistemde kurulan eşleşmeler arasından alınan dönütlere göre **Yanlış Eşleşme (False Positive Rate - %)** oranı. |
| **Kullanılabilirlik (Usability)** | Kullanıcıların sistemi kolayca öğrenmesi, hızlıca giriş yapıp filtrelemeleri hatasız uygulayabilmesi. | Kullanıcılardan alınan geri dönüşlere göre oluşturulan **Kullanıcı Memnuniyet Puanı - CSAT (Survey Score 1-5 Skalası)**. |
| **Sürdürülebilirlik (Maintainability)** | Sisteme yeni özellik eklendiğinde hataları kolay saptama veya kod tabanında değişiklik yapmanın kolaylığı. | Kod test kapsamı **(Code Test Coverage - %)**. (Mevcut test dosyalarının proje kodlarını örtme yüzdesinin her zaman %80 üzerinde kalması). |

---

## 3. Test Planı (Test Plan)

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
