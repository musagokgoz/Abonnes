# Abonnes

Abonnes, abonelikleri tek yerde takip etmek için geliştirilmiş bir web uygulamasıdır.

## Neler Yapılabilir?

- E-posta veya Google hesabı ile giriş yapma
- Abonelik ekleme, düzenleme ve silme
- Aylık, haftalık ve yıllık ödeme döngüleri
- Deneme süresi ve yaklaşan ödeme uyarıları
- Abonelikleri kategoriye ve aramaya göre filtreleme
- Aylık ve yıllık tahmini harcamayı görme
- Web ve telefondan aynı hesaba erişme

## Canlı Site

https://musagokgoz.github.io/Abonnes/

## Teknolojiler

- React
- Vite
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- GitHub Pages

## Yerel Çalıştırma

Gereksinim: Node.js 20 veya üzeri.

```bash
git clone https://github.com/musagokgoz/Abonnes.git
cd Abonnes
npm install
npm run dev
```

Tarayıcıda Vite'ın gösterdiği adresi açın. Genellikle:

```text
http://localhost:5173
```

## Supabase Kurulumu

1. Supabase projesi oluşturun.
2. **SQL Editor** bölümünü açın.
3. `supabase/schema.sql` dosyasındaki SQL kodunu çalıştırın.
4. Supabase Authentication bölümünde e-posta girişini etkinleştirin.
5. Google ile giriş kullanılacaksa Google provider ayarlarını tamamlayın.

Yerel geliştirme için proje kökünde `.env.local` dosyası oluşturun:

```env
VITE_SUPABASE_URL=https://proje-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=publishable-key
```

`.env.local` dosyası GitHub'a gönderilmez. Supabase `secret` anahtarını frontend koduna veya GitHub'a kesinlikle eklemeyin.

## Komutlar

```bash
npm run dev     # Geliştirme sunucusu
npm run lint    # Kod kontrolü
npm run build   # Production build
npm run preview # Production build önizlemesi
```

## Yayınlama

`main` branch'ine gönderilen değişiklikler GitHub Pages workflow'u tarafından build edilir ve `docs` klasörüne aktarılır.

GitHub Pages ayarı:

```text
Settings > Pages > Deploy from a branch
Branch: main
Folder: /docs
```

## Güvenlik

- Kullanıcı verileri Supabase'te kullanıcı hesabına bağlı tutulur.
- Row Level Security sayesinde kullanıcı yalnızca kendi aboneliklerini görebilir.
- Supabase secret key, Google Client Secret ve diğer özel anahtarlar paylaşılmamalıdır.
