# Discord Register Bot

Discord sunucuları için kayıt, VIP, tag ve yetkili istatistiklerini yöneten
Node.js botu.

## Özellikler

- `/erkek`, `/kadin` ve `/isim` ile üye kaydı
- Kayıtsız, VIP ve ekip rolü yönetimi
- Taglı üye kontrolü
- Kayıt, isim, VIP ve kayıtsız geçmişi
- Günlük, haftalık, aylık ve tüm zamanlar istatistikleri
- MongoDB üzerinde kayıt geçmişi
- Slash komutları ve geriye dönük prefix komutları
- Windows için kurulum ve başlatma dosyaları

## Gereksinimler

- Node.js 18.20 veya daha yeni bir sürüm
- MongoDB veritabanı
- Discord bot uygulaması
- Bot davetinde `bot` ve `applications.commands` kapsamları
- Sunucuda gerekli rol, kanal ve üye izinleri

## Kurulum

1. Projeyi indirin ve proje klasörüne girin.
2. Windows kullanıyorsanız `kurulum.bat` dosyasını çalıştırın. Diğer
   sistemlerde `npm ci` komutunu çalıştırın.
3. `.env.example` dosyasını `.env` adıyla kopyalayın.
4. `.env` dosyasındaki `DISCORD_TOKEN`, `MONGO_URL` ve
   `DISCORD_GUILD_ID` değerlerini doldurun.
5. `src/configs/settings.js` dosyasındaki sunucu, rol ve kanal ID’lerini
   doldurun.
6. Windows kullanıyorsanız `başlat.bat`, diğer sistemlerde `npm start`
   komutunu çalıştırın.

`.env` dosyası Git tarafından izlenmez ve gizli bilgileri kaynak kodundan ayrı
tutar. Token veya MongoDB bağlantı adresini kaynak koduna, README dosyasına ya
da `.bat` dosyalarına yazmayın. Üretim ortamında `.env` yerine ortam
değişkenleri veya secret yönetimi de kullanabilirsiniz.

## Slash komutları

Bot açıldığında komutlar `guildID` ayarı doluysa ilgili sunucuya kaydedilir.
Komutların görünmesi için botun sunucuda `applications.commands` kapsamıyla
davet edilmiş olması gerekir.

Slash komutlarını kapatmak için `src/configs/settings.js` içindeki
`SlashCommandsEnabled` değerini `false` yapabilirsiniz.

`DISCORD_GUILD_ID`, botun kullanılacağı Discord sunucusunun kimliğidir.
Discord geliştirici modu açıkken sunucu adına sağ tıklayıp sunucu kimliğini
kopyalayabilirsiniz. Bu değer doldurulursa slash komutları doğrudan sunucuya
kaydedilir ve güncellemeler daha hızlı görünür.

## Ayarlar

Ana ayarlar `src/configs/settings.js` dosyasındadır:

- Bot ayarları: prefix, durum ve sahip kullanıcılar
- Sunucu ayarları: sunucu ID’si, taglar, roller ve kanallar
- Kayıt ayarları: kayıt rolleri, yaş sınırları ve limitler
- VIP, karantina ve kayıtsız ayarları

Üretim ortamında token ve MongoDB adresini yalnızca ortam değişkenleri veya
secret yönetimi üzerinden tanımlayın.

## Komut örnekleri

```text
/erkek uye:@Kullanıcı
/kadin uye:@Kullanıcı
/isim uye:@Kullanıcı isim:Ahmet yas:24
/kayitsiz uye:@Kullanıcı sebep:Kurallara aykırı davranış
/stats donem:haftalık
/top donem:aylık sayi:20
```

## Geliştirici komutu

`/eval` yalnızca `Owners` listesinde bulunan kullanıcılar için çalışır.
Güvenilmeyen kişilere bu yetkiyi vermeyin.

## Lisans

Bu proje MIT lisansı ile dağıtılır. Lisans koşulları için `LICENSE.md` dosyasına
bakın.