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
- İnternet yokken son senkronize abonelikleri görüntüleme

## Canlı Site

https://musagokgoz.github.io/Abonnes/

Siteyi kullanmak için yukarıdaki adrese girip hesap oluşturabilir veya Google ile giriş yapabilirsiniz. Telefon, tablet ve bilgisayardan aynı adrese girerek aynı hesabınızdaki aboneliklere erişebilirsiniz.

## Nasıl Kullanılır?

1. Canlı siteyi açın ve giriş yapın.
2. **Ekle** düğmesine basarak bir servis seçin veya özel abonelik oluşturun.
3. Ücret, para birimi, ödeme döngüsü ve bir sonraki ödeme tarihini girin.
4. Ücretsiz deneme varsa deneme bitiş tarihini ekleyin.
5. Ana ekrandan yaklaşan ödemeleri, denemeleri ve tahmini harcamayı takip edin.
6. Abonelik kartından düzenleme, silme veya iptal sayfasına gitme işlemlerini kullanın.

Uygulamayı denemek için canlı siteye girip örnek bir hesap oluşturmanız yeterlidir. Verileriniz giriş yaptığınız Supabase hesabına özel tutulur.

## İnternetsiz Kullanım

Uygulama daha önce giriş yapılmış cihazda son abonelik listesini yerel olarak saklar. İnternet bağlantısı kesildiğinde uygulama açılabilir ve son senkronize veriler görüntülenebilir. Yeni ekleme, düzenleme ve silme işlemleri için bağlantı yeniden gelmelidir.

## Teknolojiler

- React
- Vite
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- GitHub Pages

## Güvenlik

- Kullanıcı verileri Supabase'te kullanıcı hesabına bağlı tutulur.
- Row Level Security sayesinde kullanıcı yalnızca kendi aboneliklerini görebilir.
- Supabase secret key, Google Client Secret ve diğer özel anahtarlar paylaşılmamalıdır.

## Gelecek Planı

Abonnes şu anda web uygulaması olarak kullanılabilir. İlerleyen sürümlerde aynı hesap ve veritabanı altyapısıyla:

- Android uygulaması
- iOS uygulaması
- Mobil bildirimler
- Daha gelişmiş ödeme ve harcama raporları

eklenmesi planlanmaktadır.
