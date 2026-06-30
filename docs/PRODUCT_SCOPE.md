# eCalculator Drone Academy & Build Planner - Ürün Kapsamı

## 1. Ürün amacı

Bu ürünün amacı, drone yapmak isteyen kullanıcıyı doğrudan karmaşık hesap tablolarına sokmak yerine, doğru mühendislik sırasıyla yönlendirmektir:

1. Görev amacı belirlenir.
2. Drone tipi seçilir.
3. Kullanıcıya bu seçimin neden mantıklı veya riskli olduğu açıklanır.
4. Payload, MTOW, motor sayısı, batarya voltajı ve süre hedefi üzerinden temel hesap yapılır.
5. Kullanıcıya bileşen seçimi ve test doğrulama adımları gösterilir.

## 2. Hedef kullanıcılar

- Drone yapmaya yeni başlayan öğrenciler.
- FPV veya hobi drone kullanıcıları.
- Kamera, haritalama veya endüstriyel görüntüleme yapmak isteyen kullanıcılar.
- Tarım, yangın, afet, güvenlik veya kargo amaçlı drone konsepti değerlendiren ekipler.
- Ar-Ge seviyesinde ön fizibilite yapmak isteyen mühendislik ekipleri.

## 3. MVP fonksiyonları

### 3.1 Drone tipi seçimi

MVP içinde aşağıdaki drone sınıfları yer alır:

- Hobi quadcopter
- Eğitim drone’u
- FPV / racing drone
- Kamera / gimbal drone’u
- Genel amaç multirotor
- Tarım drone’u
- Ağır yük multirotor
- Sabit kanat VTOL
- Yerden beslemeli / tethered drone

### 3.2 Görev amacı seçimi

Kullanıcı aşağıdaki görevlerden birini seçebilir:

- Eğitim / öğrenme
- Fotoğraf / video / haritalama
- FPV / hızlı manevra
- Tarım / ilaçlama
- Kargo / taşıma
- Yangın / afet
- Güvenlik / ISR
- Ar-Ge / özel mühendislik projesi

### 3.3 Eğitim yaklaşımı

Sistemin sadece sonuç üretmesi yeterli değildir. Kullanıcı her adımda şunları görmelidir:

- Bu bileşen neden seçilir?
- Yanlış seçim yapılırsa ne olur?
- Hangi güvenlik payı kullanılmalıdır?
- Hangi testle doğrulanmalıdır?

### 3.4 Hesaplama çekirdeği

İlk MVP aşağıdaki temel hesapları içerir:

- Motor başına hover yükü
- Önerilen minimum toplam thrust
- Tahmini hover gücü
- Tahmini hover akımı
- Gerekli batarya enerjisi
- Görev uygunluk skoru

## 4. Hesaplama varsayımları

Bu MVP’deki hesaplar ön tasarım seviyesindedir. Kullanılan katsayılar basitleştirilmiş mühendislik yaklaşımıdır.

- Hobi / kamera / genel multirotor için yaklaşık thrust-to-weight hedefi: 2:1
- Ağır yük / tarım / tethered için yaklaşık thrust-to-weight hedefi: 2.4:1
- FPV için yaklaşık thrust-to-weight hedefi: 4:1
- Kullanılabilir batarya enerjisi: yaklaşık %82
- Hover güç tahmini drone sınıfına göre kg başına varsayımsal W/kg katsayılarıyla yapılır.

Gerçek ürün tasarımında üretici datasheet’leri, itki testleri, hava yoğunluğu, pervane verimi, ESC kayıpları, kablo kesiti, batarya C değeri, sıcaklık etkisi ve uçuş loglarıyla doğrulama yapılmalıdır.

## 5. Kullanıcı deneyimi prensipleri

- Kullanıcı seçim yapmadan önce kısa ama öğretici açıklama görmelidir.
- Sonuç ekranı sadece sayı vermemeli; neden-sonuç ilişkisi kurmalıdır.
- Riskli seçimlerde uyarı net yazılmalıdır.
- Profesyonel kullanıcılar için teknik çıktı, başlangıç kullanıcıları için sade açıklama aynı sistemde sunulmalıdır.
- Eğitim içeriği ve hesaplama birbirinden kopuk olmamalıdır.

## 6. Sonraki sürüm hedefleri

### v0.2

- React veya Next.js tabanlı modüler yapı
- Drone tipi karşılaştırma tablosu
- PDF rapor çıktısı
- Kullanıcı proje kaydı

### v0.3

- Motor, ESC, batarya ve pervane veritabanı
- Datasheet bazlı thrust ve akım hesapları
- Komponent uyumluluk kontrolü

### v1.0

- Profesyonel proje dosyası üretimi
- Regülasyon kontrol modülü
- Test checklistleri
- Eğitim içerik yönetim paneli
- Ticari sürüm için kullanıcı hesabı, kayıt ve raporlama

## 7. Kritik uyarı

Bu yazılım, nihai uçuş güvenliği onayı vermez. Drone tasarımı; mekanik, elektrik, yazılım, operasyon ve regülasyon açısından doğrulanmalıdır. Özellikle ağır yük, yangın, afet, endüstriyel ve güvenlik görevlerinde profesyonel test sahası, risk analizi ve sorumlu mühendislik süreci zorunludur.
