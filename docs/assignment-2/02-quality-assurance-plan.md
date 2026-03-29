# Kalite Güvence (QA) Planı

Bu belge, **MatchProof** uygulamasının güvenilirliğini, verimliliğini ve kullanılabilirliğini sağlamaya yönelik sistematik yaklaşımı özetlemektedir. Projenin yaşam döngüsüne entegre edilen test ve kalite güvence prosedürleri için kapsamlı bir rehber niteliğindedir.

---

## 1. Kalite Güvence Stratejisi (Quality Assurance Strategy)

### Genel Bakış (Overview)
MatchProof QA stratejisinin temel amacı; kampüs içi kayıp ve buluntu eşyalar için güvenli, yüksek doğruluğa sahip ve kullanıcı dostu bir platform sunmaktır. Karmaşık yapay zeka (AI) tabanlı eşleştirme algoritmalarının ve dinamik arayüz etkileşimlerinin varlığı göz önünde bulundurulduğunda, yaklaşımımız temel mantığın (Yapay Zeka süreçleri) izole bir şekilde doğrulanmasını ve React uygulaması aracılığıyla son kullanıcı deneyiminin sürekli test edilmesini zorunlu kılar.

### Test Metodolojileri (Testing Methodologies)
MatchProof, temel olarak **Jest** ile **Supertest** ve **React Testing Library** entegrasyonuna dayanan birkaç test metodolojisine güvenir:
- **Birim Testleri (Unit Testing):** İzole edilmiş mantık parçalarının kontrolünde, özellikle veritabanı işlemlerini (`item.model.test.js`) ve yapay zekanın içindeki matematiksel işlemleri (`matchingService.test.js`) doğrulamakta sıkça kullanılır. Testlerin son derece hızlı ve tekrar edilebilir olması için `sharp` ve `@xenova/transformers` gibi dış bağımlılıklar mocklanarak sahte değerlerle test edilir.
- **Entegrasyon Testleri (Integration Testing):** Uygulama katmanlarının (Kontrolcüler, Servisler, Veritabanı Sorguları, Ara katmanlar) API uç noktaları (endpoints) aracılığıyla birbirleriyle sorunsuz etkileşime girdiğini doğrular.
- **Kullanılabilirlik Testleri (Usability Testing):** Arayüz (React) bileşenlerinin (`AuthPage`, `SearchPage` gibi) davranışsal testidir. Bir JSDOM test ortamında çalıştırılarak tıklama ve metin girişi gibi özellikler gerçek bir tarayıcıda yaşanıyormuş gibi test edilir.

### Otomatik vs. Manuel Testler (Automated vs. Manual Testing)
- **Otomatik Testler (Automated Testing):** Regresyon ve fonksiyonel doğrulamanın çoğunluğu otomatiktir. Birim ve entegrasyon test paketleri, mantık hatalarını anında yakalamak için hem frontend (React) hem de backend (Node.js) üzerinde otomatik test motorları tarafından çalıştırılır. Sistemin otomatik olarak teste sokulması hedeflenir.
- **Manuel Testler (Manual Testing):** İnsan muhakemesi gerektiren yönler — örneğin, farklı tarayıcılardaki (Chrome, Safari vs.) arayüz render/tasarım düzeni kontrolleri, yüklenen fotoğrafların "blur"lanıp görülmesinin kullanılabilirliği ve genel görsel erişilebilirlik — büyük sürümler veya asıl platform dağıtımları öncesinde QA ekibi tarafından manuel olarak test edilir.

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

**TC-01: Kullanıcı Doğrulama Akışı (Login Flow)**
- **Kapsam:** Kullanıcı kimlik doğrulamasının yapılarak güvenli erişimi onaylaması.
- **İşlem Adımları:** Test kütüphanesi ile `<AuthPage />` yüklenir, forma geçerli `email` ve `password` değerleri girilir, sonrasında giriş (login) butonuna tıklanır.
- **Beklenen Sonuç (Expected Result):** Sistem `login()` metodunu tetikler, başarılı olduğuna dair ekrana bir *Toast (Bildirim)* sunar ve kullanıcıyı `navigate('/')` fonksiyonuyla anasayfaya yönlendirir.

**TC-02: Yapay Zeka Eşleştirme Dayanıklılığı (Eksik Görsel/ENOENT Handling)**
- **Kapsam:** Yapay zekanın, kullanıcı tarafında yüklenmemiş (hata veren) fotoğraflı eşyaları kıyaslarken çökmemesi.
- **İşlem Adımları:** Arka plandaki sisteme (backend) `missing-image.jpg` referansı verilir ve okuma sistemine `ENOENT` (Dosya mevcut değil) fırlatması manuel olarak simüle edilir.
- **Beklenen Sonuç:** Uygulama veya AI eşleşme algoritması çökmez. Sistem, görsel inceleme evresini sadece "null" olarak geçer (`imageSimilarity: null`) ve kıyaslamayı diğer kurallar (lokasyon, metin analiz puanı vb.) üzerinden başarıyla tamamlayıp eşyayı listeler.

**TC-03: Arama Filtreleme Özelliğinin Test Edilmesi (Search UI Filtering)**
- **Kapsam:** Sistemdeki dinamik verilerin filtrelenme kapasitesinin UI (Arayüz) tarafında doğrulanması.
- **İşlem Adımları:** Ekrana `<SearchPage />` sayfası getirilir. Kategori açılır menüsünden (dropdown) "Electronics" nesnesi seçilir ve Ara (Submit) butonuna tıklanır.
- **Beklenen Sonuç:** React mock kütüphanesi olan `Items.search()` simülasyonu çalıştırıldığında sistem bu çağrıyı başarıyla ele alır ve yapılan API gönderimi içerisine filtre parametresi olarak `category: 'Electronics'` değerini ekler.

**TC-04: Gizli İlanların Bulanıklaştırılması (Private Listing - Security)**
- **Kapsam:** Gizli yayın özelliğinin, eşya bilgilerini yetkisiz erişimlerden gizleyerek güvenlik standartlarına uyması.
- **İşlem Adımları:** Geliştirici konsolundan `GET /api/items` ucu test edilir. Sorgu içerisinde veritabanında `isPrivate = true` olarak kayıtlı bir ilan geri çağrılır.
- **Beklenen Sonuç:** Backend sunucusu, DTO (Data Transfer Object) eşitlemesi esnasında özel bilgisi olan nesnenin gizlilik işaretini (`isPrivate`) "true" olarak sabitler. Herkese açık veriler maskelenerek frontend'in (Arayüz) bu objeyi bulanık gösterebilmesi güvence altına alınır. 

**TC-05: İzinsiz Erişim Engeli (Unauthorized Access Blocking)**
- **Kapsam:** Uygulanmış bir sistem uç noktasının (route) koruma kalkanlarının geçerli sayılması.
- **İşlem Adımları:** Sistem Supertest botu üzerinden token kullanılmadan doğrudan eşya ilan açma isteğinde (`POST /api/items/`) bulunur.
- **Beklenen Sonuç:** Arka planda güvenliği sağlayan `requireAuth` mimarisi (Middleware), bu illegal request'i yakalar. Sunucu anında isteği keserek bot tarafına hata (`HTTP 401 Unauthorized`) cevabını döner.

### Hata Takip Süreci (Bug Tracking)
Gerek oluşturulan otomatik bot testlerinden (Jest) alınan dökümler, gerekse manuel test aşamasında tespit edilen sistemsel aksaklıklar, şu düzenli planlamaya göre kontrol edilir:
1. **Raporlama Bölümü (Reporting):** Tüm hatalar ve buglar, projenin merkezi hata veri kayıt sistemine (**GitHub Issues** veya proje yönetimine bağlı olarak Trello/Jira kartlarına) kaydedilir. Hata raporunda; nasıl tekrar edebileceği, beklenen test sonucu ve çıkan hatalı sonuç yer alır.
2. **Kategorizasyon ve Önceliklendirme:** Başmühendis, tespit edilen hatanın zorluk ve riski (Kritik, Yüksek, Orta, Düşük) tabanında öncelik tanır. İlgili alandan yetkili bir ekibe/etikeye (`AI-backend`, `UI-frontend`, `auth`) görevlendirilir.
3. **Çözüm Yönetimi (Resolution Workflow):** Issue işleme alınır. Süreç boyunca bilet durumu güncellenir: `Açık -> Üzerinde Çalışılıyor -> Kod İncelemesinde -> QA Kontrolü (Orijinal testlerin Passed vermesi) -> Kapalı`. Hata giderildikten sonra ancak ve ancak QA tarafından tekrar doğrulandığında kaynak koduna başarıyla geçirilir ve dosya kapatılır.
