# eCalculator Drone Academy & Build Planner

Profesyonel drone tasarımı, ön seçim, eğitim ve temel mühendislik hesaplarını bir araya getiren açılabilir MVP prototipi.

Bu proje, kullanıcıyı doğrudan hesap ekranına bırakmak yerine önce **görev amacı**, **drone tipi**, **payload**, **uçuş süresi**, **menzil**, **çevre koşulu** ve **kullanıcı seviyesi** üzerinden yönlendirir. Her seçimde kullanıcıya “neden bu seçilmeli?” açıklaması verir ve sonunda önerilen mimari, bileşen öncelikleri, riskler ve temel hesaplar üretilir.

## İçerik

- Drone tipi seçimi: hobi, FPV, kamera, tarım, kargo, tethered, yangın, güvenlik/ISR, eğitim, ağır yük.
- Amaç bazlı yönlendirme: eğitim, görüntüleme, taşıma, ilaçlama, yangın/afet, güvenlik, Ar-Ge.
- Eğitim modülleri: frame, motor, ESC, batarya, pervane, flight controller, sensörler, yazılım, test.
- Hesaplama çekirdeği: thrust-to-weight, motor başına yük, hover güç tahmini, akım, batarya enerjisi, süre tahmini.
- Profesyonel çıktı: önerilen mimari, dikkat edilmesi gerekenler, bileşen seçimi ve doğrulama planı.

## Yerelde çalıştırma

Bu proje framework gerektirmez. Dosyaları klonlayıp doğrudan `index.html` dosyasını tarayıcıda açabilirsiniz.

```bash
git clone https://github.com/ustunahmet/GPT-Projeler.git
cd GPT-Projeler
```

Ardından `index.html` dosyasını açın.

İsteğe bağlı olarak basit bir yerel sunucu ile de çalıştırılabilir:

```bash
python -m http.server 8080
```

Tarayıcıdan:

```text
http://localhost:8080
```

## Dosya yapısı

```text
.
├── index.html
├── src/
│   ├── styles.css
│   └── app.js
├── docs/
│   └── PRODUCT_SCOPE.md
└── README.md
```

## MVP kapsamı

Bu sürüm, ticari ürün doğrulaması değil; kullanıcı eğitimi, ön mühendislik hesabı ve konsept seçim desteği sunar. Kritik uçuş, ticari operasyon veya savunma sınıfı sistem tasarımlarında profesyonel mühendislik doğrulaması, test ve regülasyon süreci ayrıca yürütülmelidir.

## Sonraki geliştirme adımları

1. React / Next.js tabanlı ürünleştirme.
2. Kullanıcı hesabı ve proje kaydı.
3. Detaylı batarya veritabanı.
4. Motor/ESC/pervane üretici datasheet entegrasyonu.
5. PDF rapor çıktısı.
6. Eğitim modüllerinin video/görsel içerikle genişletilmesi.
7. Türkiye ve uluslararası regülasyon kontrol modülü.
