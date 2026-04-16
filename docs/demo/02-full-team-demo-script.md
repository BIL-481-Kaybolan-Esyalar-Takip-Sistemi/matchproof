# MatchProof — 15 Dakikalık Final Demo Konuşma Akışı

Bu dosya, sunumu **doküman doküman değil**, hocanın istediği akışa göre anlatmak için hazırlanmıştır.  
Amaç, yazılım geliştirme yaşam döngüsünü baştan sona göstermek, seçilen senaryoyu çalıştırmak, izlenebilirliği kanıtlamak ve ekip görev dağılımını task matrix + commit geçmişi ile desteklemektir.

Bu metin **ortak ana konuşma akışı**dır.  
Ekip üyeleri bunu kendi aralarında bölüşebilir.

---

## Ana İlke

Sunum şu mantıkla ilerlemelidir:

1. **Projeyi tanıt**
2. **Planlama ve gereksinimleri göster**
3. **Tasarımı ve UML’i göster**
4. **Geliştirilen sistemi ve endpointleri göster**
5. **Senaryoyu canlı çalıştır**
6. **Test, kalite metrikleri ve bugfix kayıtlarını göster**
7. **Review sonrası yapılan iyileştirmeleri Delta Report ile kapat**
8. **Görev dağılımını task matrix ve commit geçmişi ile kanıtla**

Yani odak:
- sadece belge göstermek değil,
- belge + kod + çalışan senaryo + test + izlenebilirlik zincirini birlikte göstermek.

---

## Önerilen Süre Dağılımı

| Bölüm | Süre |
|---|---:|
| 1. Proje özeti ve amaç | 1 dk |
| 2. Planlama + gereksinimler + görev dağılımı | 2 dk |
| 3. Tasarım + UML + mimari kararlar | 3 dk |
| 4. Geliştirme ve çalışan sistem | 2 dk |
| 5. Demo senaryosu | 3 dk |
| 6. QA, test stratejisi, test report, bugfixler | 2.5 dk |
| 7. Delta report ve kapanış | 1.5 dk |
| **Toplam** | **15 dk** |

---

## Ekranda Açılacak Ana Dosyalar

Sunum sırasında şu sıra kullanılabilir:

1. `README.md`
2. `docs/assignment-1/01-project-definition.md`
3. `docs/assignment-1/03-requirements.md`
4. `docs/assignment-1/04-task-effort-estimation.md`
5. `docs/assignment-1/05-product-backlog.md`
6. `docs/assignment-2/01-design-document.md`
7. `docs/assignment-2/04-uml-representation.md`
8. `src/server/routes/` ve `src/server/services/`
9. çalışan uygulama ekranı
10. `docs/assignment-2/02-quality-assurance-plan.md`
11. `docs/test/02-test-strategy.md`
12. `docs/test/01-test-report.md`
13. `docs/assignment-3/01-delta-design-implementation-report.md`
14. GitHub commit geçmişi / PR listesi

---

# 1. Giriş ve Proje Özeti

“Merhaba, biz MatchProof ekibiyiz.

MatchProof, kampüs içinde kaybolan veya bulunan eşyaların dijital olarak ilan edildiği bir lost and found platformudur.
Kullanıcılar sisteme kayıp veya bulunan eşya ilanı ekleyebilir, arama yapabilir, ilan detayını görüntüleyebilir, durum güncellemesi yapabilir ve uygun durumlarda eşya sahibine ulaşabilir.

Projemizi özgün yapan taraf, klasik ilan mantığını AI destekli eşleşme yaklaşımıyla güçlendirmemizdir.
Bu kapsamda sistem, ilan detayında olası benzer eşya ilanlarını sıralayabiliyor ve neden benzer olduğunu kısa açıklamalarla gösterebiliyor.

Bugün sunumda planlama, gereksinim, tasarım, geliştirme, deployment/test ve review sonrası iyileştirme zincirini tek bir akışta göstereceğiz.
Ayrıca seçtiğimiz bir senaryoyu canlı çalıştıracağız.”

---

# 2. Planlama, Gereksinimler ve İzlenebilirlik

## 2.1 Proje Amacı ve Kapsam

**Ekranda aç:** `docs/assignment-1/01-project-definition.md`

“İlk aşamada proje tanımı ve kapsamı netleştirildi.
Burada sistemin amacı, hedef kitlesi, ana özellikleri, kapsam dışı kalan noktalar, riskler ve başarı kriterleri tanımlandı.

Önemli nokta şu:
biz projeyi bilinçli olarak sınırlı tuttuk.
Yani mobil uygulama, chat, notification veya ödeme gibi kapsam büyüten özellikleri dışarıda bıraktık.
Bu sayede çekirdek akışlara odaklandık:
post oluşturma, arama, detail, status yönetimi, moderation ve AI destekli eşleşme.”

## 2.2 Functional ve Non-Functional Requirements

**Ekranda aç:** `docs/assignment-1/03-requirements.md`

“İkinci adımda gereksinimleri tanımladık.
Functional requirements tarafında kullanıcı kayıt/giriş, ilan oluşturma, fotoğraf yükleme, arama, filtreleme, status yönetimi, moderation ve AI matching gereksinimleri yazıldı.

Non-functional requirements tarafında ise özellikle:
- performans,
- kullanılabilirlik,
- tarayıcı uyumluluğu,
- gizlilik ve yetkilendirme,
- genişletilebilirlik,
- ve erişilebilirlik/süreklilik hedefleri tanımlandı.”

## 2.3 Task Matrix ve Görev Dağılımı

**Ekranda aç:** `docs/assignment-1/04-task-effort-estimation.md`

“Hocanın istediği gibi ekip görev dağılımı task matrix üzerinden gösteriliyor.
Burada takımın rolleri, faz sahiplikleri, task distribution ve effort estimation açık şekilde yer alıyor.

Bu tablo iki şey için kritik:

Birincisi, ekip içinde kimin hangi alanı üstlendiğini netleştiriyor.
İkincisi, daha sonra backlog, tasarım, test ve geliştirme tarafındaki işlerin bu dağılımla uyumlu ilerlediğini kanıtlıyor.”

## 2.4 Product Backlog ve Requirement Traceability

**Ekranda aç:** `docs/assignment-1/05-product-backlog.md`

“Burada requirements’tan product backlog’a geçişi görüyoruz.
Yani functional ve non-functional requirement’lar backlog maddelerine dönüştürüldü.

Özellikle AI ile ilgili backlog maddeleri burada ayrı şekilde tanımlandı:
- görsel özellik çıkarımı,
- similarity score üretimi,
- ranked match listesi,
- explainable matching.

Bu belge, hocanın özellikle istediği izlenebilirlik açısından önemli:
gereksinimden backlog’a geçiş açık şekilde takip edilebiliyor.”

---

# 3. Tasarım, Mimari ve UML

## 3.1 Top Level Architecture

**Ekranda aç:** `docs/assignment-2/01-design-document.md` ve ardından `docs/assignment-2/04-uml-representation.md`

“Tasarım aşamasında sistemi layered monolith mimarisiyle kurduk.
Bu yapıda:

- frontend katmanı kullanıcı arayüzünü yönetiyor,
- API katmanı request/response işlemlerini yönetiyor,
- service katmanı iş kurallarını uyguluyor,
- model/data katmanı ise veri erişimini sağlıyor.

Bu mimariyi özellikle course project ölçeği için seçtik.
Çünkü hem daha hızlı geliştirilebilir hem de test edilmesi ve gösterilmesi daha kolay.”

## 3.2 UML Diyagramları

**Ekranda aç:** `docs/assignment-2/04-uml-representation.md`

“Hocanın özellikle istediği UML tarafında şu noktaları göstereceğiz:

- top level component diagram,
- class diagram,
- sequence diagram,
- ve deployment diagram.

Component diagram, ana modüllerin birbirleriyle ilişkisini gösteriyor.
Class diagram, temel nesneleri ve servisleri gösteriyor.
Sequence diagram ise özellikle kullanıcı araması ve ilgili veri akışını açıklıyor.
Deployment diagram da browser, frontend, backend ve database yerleşimini gösteriyor.”

## 3.3 Design Decisions

**Ekranda aç:** `docs/assignment-2/01-design-document.md`

“Burada önemli tasarım kararlarımızdan biri, AI matching’i sistemin çekirdek kullanımını bloke etmeyen bir enhancement olarak ele almak oldu.
Yani AI modülü geçici olarak kullanılamasa bile temel sistem çalışmaya devam ediyor.

Bir diğer önemli karar da explainable matching yaklaşımı.
Sistem sadece eşleşme skoru üretmiyor; mümkün olduğunda neden benzer bulunduğunu da kısa açıklamalarla gösteriyor.”

## 3.4 Design Pattern / Sequence / Class kısmı

“Sunumda burada kısa bir şekilde şunu vurgulamak yeterli:
tasarım tarafında sınıflar, akışlar ve katmanlar rastgele değil, ayrık sorumluluklara göre organize edildi.
Yani route, service ve model ayrımı hem geliştirmeyi hem de test etmeyi kolaylaştırdı.”

---

# 4. Geliştirme ve Uygulanan Sistem

## 4.1 Backend ve Frontend Genel Yapısı

**Ekranda aç:** `src/server/routes/`, `src/server/services/`, `src/client/pages/`

“Geliştirme aşamasında frontend ve backend ayrımı net tutuldu.
Backend tarafında auth, item, search, status ve moderation akışları kuruldu.
Frontend tarafında ise login/register, arama, detail, yeni ilan oluşturma ve admin moderation ekranları geliştirildi.”

## 4.2 Endpointler

**Ekranda aç:** `docs/assignment-2/01-design-document.md` içindeki API overview veya doğrudan kod

“Temel endpoint setimiz şunlardan oluşuyor:

- auth endpointleri,
- item CRUD endpointleri,
- search endpointi,
- item status endpointi,
- moderation remove endpointi,
- ve item detail üzerinden AI matches endpointi.

Burada önemli nokta şu:
iş kurallarını frontend’e bırakmadık.
Örneğin status geçişleri, owner kontrolü, admin authorization ve moderation kuralları backend’de uygulanıyor.”

## 4.3 Seçilen Demo Senaryosu

**Ekranda aç:** `docs/assignment-3/01-delta-design-implementation-report.md`

“Demo için seçtiğimiz senaryo şu:
bir kullanıcı hassas bir eşya, örneğin ID card veya cüzdan gibi bir eşya kaybediyor;
başka bir kullanıcı buna karşılık gelen found ilanını sisteme giriyor;
ilk kullanıcı arama yapıyor, detail sayfasına geçiyor, AI possible matches bölümünü görüyor, contact bilgisine ulaşıyor ve ardından status akışı üzerinden süreci tamamlıyor.”

---

# 5. Canlı Demo Senaryosu

Bu bölümde belge değil, **çalışan sistem** gösterilmelidir.

## 5.1 Adım Adım Akış

1. Kullanıcı register/login olur  
2. Yeni bir `lost` veya `found` ilan oluşturur  
3. Arama ekranında ilgili ilan aranır  
4. Detail sayfasına girilir  
5. Detail altında `AI Possible Matches` gösterilir  
6. Contact bilgisi görüntülenir  
7. Status `open -> claimed -> resolved` akışı gösterilir  
8. Gerekirse admin paneli üzerinden remove akışı gösterilir

## 5.2 Sunumda Söylenecek Metin

“Şimdi seçtiğimiz senaryoyu canlı olarak çalıştırıyoruz.
Burada önce kullanıcı sisteme giriş yapıyor.
Sonra yeni bir ilan oluşturuyoruz.
Ardından arama ekranında bu ilanı buluyoruz.
Detail sayfasına geçtiğimizde item bilgileri, contact kartı ve AI possible matches bölümü görünüyor.
Eğer sistem uygun eşleşme bulursa burada ranked match kartları çıkıyor.
Son olarak da status akışını gösteriyoruz: open’dan claimed’e, ardından resolved’a.”

---

# 6. Test, Kalite Metrikleri ve Deployment

## 6.1 Quality Factors Table

**Ekranda aç:** `docs/assignment-2/02-quality-assurance-plan.md`

“Hocanın istediği quality factor kısmı burada tablo olarak yer alıyor.
Bu tabloda her kalite faktörü için:

- quality criteria,
- metric,
- target value,
- related test,
- ve related requirement

birlikte gösteriliyor.

Örneğin performans için hedef 2 saniye altı,
matching quality için deterministic contract doğrulaması,
authorization için ise yetkisiz erişimlerin doğru şekilde reddedilmesi.”

## 6.2 Test Strategy

**Ekranda aç:** `docs/test/02-test-strategy.md`

“Test strategy dosyasında test yapısını üç katmanlı olarak topladık:

- backend Jest,
- frontend component testleri,
- Playwright E2E.

Ayrıca test ortamı deterministik olacak şekilde düzenlendi.
Yani seeded data, stub AI mode ve kontrol edilebilir test ortamı kullanılıyor.”

## 6.3 Test Report

**Ekranda aç:** `docs/test/01-test-report.md`

“Test report belgesinde ise hocanın istediği şu alanların hepsi yer alıyor:

- test responsibles,
- test date,
- test configuration,
- test inputs,
- test results,
- ve deployment diagram.

Burada ayrıca test çıktılarının kayıt altına alındığını ve full verification run’ın rapora işlendiğini gösteriyoruz.”

## 6.4 Recording of Test Results

“Hocanın istediği recording of the test results kısmı için bu bölümde test ekran görüntüleri, terminal çıktıları veya kayıt altına alınmış sonuçlar gösterilebilir.
Yani burada sadece ‘testler geçti’ demek değil, gerçekten test çıktılarının kayıtlarını göstermek gerekir.”

## 6.5 Fixed Bugs Table

**Ekranda aç:** `docs/test/01-test-report.md` bölüm 5

“Burada fixed bugs tablosunu göstereceğiz.
Bu tablo hangi hatanın nerede bulunduğunu, nasıl düzeltildiğini ve durumunu tek tek kayıt altına alıyor.
Hocanın özellikle istediği ‘bug kayıtlarının tabloda gösterilmesi’ maddesi bu şekilde karşılanıyor.”

---

# 7. Review Sonrası İyileştirmeler — Delta Report

## 7.1 Neden Delta Report Hazırlandı

**Ekranda aç:** `docs/assignment-3/01-delta-design-implementation-report.md`

“Review sonrasında bütün geri bildirimleri aynı anda uygulamak yerine,
demo senaryosuna gerçekten katkı sağlayacak ve kalan sürede uygulanabilir olanları seçtik.

Bu seçimleri, effort estimation ile birlikte gerekçelendirdik.”

## 7.2 Seçilen İyileştirmeler

“Seçilen iyileştirmeler şunlardı:

- contact visibility konusunun sadeleştirilmesi,
- hassas eşyalar için privacy güçlendirmesi,
- AI fallback davranışının netleştirilmesi,
- CI eklenmesi,
- availability hedefinin gerçekçi hale getirilmesi.”

## 7.3 Mimariye ve Testlere Etkisi

“Delta report’ta ayrıca şu sorulara cevap verdik:

- mimaride ne güncellendi,
- hangi design decision alındı,
- kalite faktörleri ve metrikler nasıl etkilendi,
- testlere nasıl yansıdı,
- ve hangi bugfix kayıtları test report’a işlendi.”

---

# 8. Görev Dağılımı ve Commit İzlenebilirliği

## 8.1 Task Matrix

**Ekranda aç:** ilgili dokümanların task matrix bölümleri

“Hocanın istediği gibi ekip görev dağılımını task matrix’ler üzerinden gösteriyoruz.
Burada her dokümanın içinde ilgili sorumlular açık şekilde yazıyor.”

## 8.2 Git Commit / Contribution Kanıtı

**Ekranda aç:** GitHub commit history / contributors / PR listesi

“Sadece belge üzerinde isim yazmakla kalmadık;
Git commit geçmişi üzerinden de her ekip üyesinin katkısını görünür hale getirdik.
Yani task matrix ile commit geçmişi birbirini doğruluyor.”

---

# 9. Kapanış

“Özetle MatchProof projesinde:

- planlama yaptık,
- gereksinimleri tanımladık,
- bunları backlog’a dönüştürdük,
- sistemi tasarladık,
- çalışan bir ürün geliştirdik,
- deployment ve test akışını kurduk,
- kalite metriklerini takip ettik,
- review sonrası seçilmiş iyileştirmeleri uyguladık,
- ve bütün bunları task matrix, test report, UML ve delta report ile izlenebilir hale getirdik.

Şimdi istersek soru-cevap kısmına geçebiliriz.”

---

# 10. Pratik Sunum Notları

- Her belgeyi baştan sona okumayın; sadece ilgili tabloyu veya bölümü gösterin.
- Demo sırasında belge ile çalışan sistemi birlikte bağlayın.
- Task matrix ve commit geçmişini sona bırakın; bu bölüm ispat bölümü gibi çalışsın.
- Delta report ve test report mutlaka gösterilsin.
- UML kısmında en az:
  - top level architecture,
  - class diagram,
  - sequence diagram,
  - deployment diagram
  mutlaka gösterilsin.
- Quality factors table ve fixed bugs table ekranda mutlaka açılmalı.

