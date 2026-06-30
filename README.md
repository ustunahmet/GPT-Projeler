# eCalculator MVP

Sivil/hobi drone öğrenimi için hesaplama sitesi, eğitim akışı, kullanıcı proje paneli ve temel admin paneli MVP iskeleti.

## Kapsam
- Türkçe, responsive Next.js arayüzü: ana sayfa, hesaplayıcılar, eğitim, giriş/kayıt, panel, projeler, admin.
- Beş saf hesaplayıcı servis fonksiyonu: itki, batarya, akım, disk yüklemesi, payload marjı.
- JSON API örnekleri: auth, projects, education modules, calculator run.
- Prisma veri modeli taslağı ve seed planı.
- Vitest formül testleri.

## Kurulum
```bash
npm install
cp .env.example .env
npm run dev
```

## Test
```bash
npm test
npm run build
```

## Güvenlik sınırı
Platform eğitim amaçlı ön boyutlandırma yapar. Silah, mühimmat, saldırı, mevzuata aykırı operasyon veya uçuş güvenliği garantisi kapsam dışıdır.

## Demo admin
- E-posta: `admin@ecalculator.local`
- Parola: deployment sırasında güvenli şekilde değiştirilecek geçici parola.

## Parça verisi
MVP artık hesaplamalarda referans alınabilecek temsili bir eğitim veri seti içerir:
- `lib/parts.ts`: motor, batarya ve pervane kayıtları; Wh, C-rating akım limiti ve toplam motor itki yardımcı fonksiyonları.
- `/parcalar`: kullanıcıya açık katalog sayfası.
- `/api/parts`: katalog verisini JSON olarak dönen endpoint.

Bu veri seti gerçek marka/model tavsiyesi değildir; kullanıcı arayüzünde üretici datasheet doğrulaması gerektiği özellikle belirtilir.

## Calculation Core
Calculation Core, UI ve API katmanından bağımsız saf TypeScript fonksiyonları olarak `src/calculation-core` altında yer alır.

Öne çıkan kurallar:
- İç hesaplar SI birimleriyle yapılır.
- Her tam hesap sonucu `core_version`, `assumption_set_version`, `status`, `results`, `warnings`, `errors`, `assumptions`, `formula_trace` ve `validation_summary` alanlarını döndürür.
- Motor test tablosu varsa güç/akım lineer interpolasyonla hesaplanır; test tablosu yoksa momentum teorisi kullanılır ve `W_THEORETICAL_POWER_MODEL` uyarısı döner.
- Test tablosu dışına extrapolasyon yapılmaz; `ERR_THRUST_DATA_RANGE` hatası üretilir.
- Sivil/eğitim dışı payload tanımları `ERR_UNSUPPORTED_PAYLOAD_TYPE` ile reddedilir.

Endpointler:
- `POST /api/calc/full`: tam hesap zinciri.
- `POST /api/calc/validate`: girdi doğrulama.

Örnek girdi: `src/calculation-core/examples/full-input.example.json`.
