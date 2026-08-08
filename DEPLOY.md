# Kule Solution — web sitesi

Statik site (HTML/CSS/JS). Veritabanı yok, PHP yok, WordPress yok.
Klasörü olduğu gibi sunucuya kopyalarsan çalışır.

---

## 1. Klasör yapısı

```
Website/
├── index.html                    Ana sayfa
├── about.html                    Hakkımızda
├── smart-solutions.html          Akıllı Ev & Bina
├── industrial-automation.html    Endüstriyel Otomasyon
├── projects.html                 Projeler
├── contact.html                  İletişim
├── 404.html                      Hata sayfası
├── robots.txt                    Arama motoru izinleri
├── sitemap.xml                   Site haritası
├── .htaccess                     Apache ayarları (HTTPS, sıkıştırma, cache)
└── assets/
    ├── css/style.css             Tüm tasarım
    ├── js/i18n.js                >>> TÜM METİNLER BURADA (sq/en/tr)
    ├── js/main.js                Dil değiştirici, menü, form
    ├── fonts/                    Raleway (6 ağırlık)
    └── img/                      Logo, favicon, proje ve partner görselleri
```

---

## 2A. GitHub Pages (şu an kullanılan yöntem)

Site `github.com/leventzuban/kulesolution` reposundan yayınlanıyor ve
`kulesolution.com` domainine bağlı. DNS doğru kurulmuş:

| Kayıt | Değer |
|---|---|
| A (`@`) | 185.199.108.153 / .109.153 / .110.153 / .111.153 |
| CNAME (`www`) | `leventzuban.github.io` |
| `CNAME` dosyası (repo içinde) | `kulesolution.com` |

**Güncelleme yapmak:** değişen dosyaları repoya yükle (GitHub web arayüzünden
sürükle-bırak ya da `git push`). GitHub 1–2 dakika içinde otomatik yayınlar.

**HTTPS:** GitHub sertifikayı kendisi üretir; özel domain bağlandıktan sonra
bu **birkaç dakika ile 24 saat** arasında sürer. Sertifika hazır olunca
Settings → Pages → **Enforce HTTPS** kutusunu işaretle. O kutu tıklanabilir
hale gelmediyse sertifika henüz çıkmamıştır — beklemek dışında yapılacak bir
şey yok.

**Not:** GitHub Pages Apache değil, dolayısıyla `.htaccess` dosyası burada
**hiçbir işe yaramaz**. Sildirmene gerek yok; ileride cPanel'e taşınırsa
gerekli olacak. https ve www yönlendirmesini GitHub kendisi yapar.

`.nojekyll` dosyası, GitHub'ın siteyi Jekyll ile işlemeye çalışmasını
engeller — statik site için doğru olan budur.

---

## 2B. GoDaddy cPanel'e yükleme (alternatif)

1. GoDaddy hesabına gir → **My Products** → hosting paketinin yanındaki **Manage**.
2. **cPanel Admin** → **File Manager**.
3. Sol taraftan **`public_html`** klasörünü aç.
4. İçinde GoDaddy'nin varsayılan dosyaları varsa (`default.html`, `coming-soon.html` gibi) sil.
5. Bilgisayarında `Website` klasörünün **içindekileri** seç (klasörün kendisini değil!) ve
   bir ZIP yap: `kule-site.zip`.
6. File Manager'da **Upload** → `kule-site.zip` dosyasını yükle.
7. Yükleme bitince dosyaya sağ tıkla → **Extract** → `public_html` içine çıkar.
8. ZIP dosyasını sil.
9. Tarayıcıda `https://www.kulesolution.com` adresini aç.

> **Önemli:** Dosyalar `public_html/index.html` şeklinde olmalı,
> `public_html/Website/index.html` şeklinde **değil**.

### `.htaccess` görünmüyorsa
File Manager'da sağ üstteki **Settings** → **Show Hidden Files (dotfiles)** kutusunu işaretle.

### FTP ile yüklemek istersen
FileZilla → cPanel'den aldığın FTP bilgileriyle bağlan →
`Website` içindeki her şeyi `public_html` içine sürükle.

---

## 3. SSL (https) — kurulum sırası önemli

1. Önce cPanel → **SSL/TLS Status** → **Run AutoSSL** ile sertifikayı çalıştır.
2. Sertifika **aktif olduktan sonra** siteyi `https://` ile açıp kontrol et.
3. `.htaccess` içindeki https yönlendirmesi zaten hazır ve otomatik devreye girer.

> Sertifika daha çıkmamışken https yönlendirmesi açık olursa site
> sonsuz yönlendirme döngüsüne girebilir. Sıralamaya uy.

---

## 4. Domain yönlendirmesi (sadece domain GoDaddy'de, hosting başka yerdeyse)

GoDaddy → **Domains** → `kulesolution.com` → **DNS**:

| Tip | Ad | Değer |
|-----|----|-------|
| A | `@` | hosting sağlayıcının IP adresi |
| CNAME | `www` | `kulesolution.com` |

Değişiklik 15 dakika – 24 saat içinde yayılır.

---

## 5. Diller

Site üç dilde: **Arnavutça (varsayılan)**, **İngilizce**, **Türkçe**.

- Ziyaretçi ilk girişte tarayıcı dili neyse onu görür; yoksa Arnavutça açılır.
- Sağ üstteki dil düğmesinden değiştirilir, tercih tarayıcıda saklanır.
- Paylaşılabilir bağlantılar: `?lang=en` veya `?lang=tr`
  (örn. `https://www.kulesolution.com/contact.html?lang=tr`)

### Metin değiştirmek
Tüm yazılar tek dosyada: **`assets/js/i18n.js`**

Dosya üç bölümden oluşuyor: `sq:`, `en:`, `tr:`. Aynı anahtar üç bölümde de var.
Değiştirmek istediğin cümleyi bul, üç dilde de güncelle, kaydet, dosyayı sunucuya yükle.

> **Dikkat:** Arnavutça metinler ayrıca `.html` dosyalarının içine de yazılı
> (JavaScript kapalıysa ve Google için). Bir Arnavutça cümleyi değiştirirsen,
> ilgili `.html` dosyasında da aynı cümleyi bul ve değiştir.
> Anahtar adını (`data-i18n="home.hero.title"` gibi) aratman yeterli.

---

## 6. İletişim formu — mail kutusuna düşmesi için (5 dakika)

Şu an form, ziyaretçinin **kendi e-posta programını** açıp mesajı hazır dolduruyor.
Bu her yerde çalışır ama bazı ziyaretçilerde e-posta programı kurulu olmayabilir.

Mesajların doğrudan `sales@kulesolution.com` kutusuna düşmesi için:

1. https://web3forms.com adresine git.
2. `sales@kulesolution.com` adresini yaz → **Create Access Key**.
3. E-postana gelen **Access Key**'i kopyala.
4. `assets/js/main.js` dosyasını aç, en üstteki satırı bul:

   ```js
   var WEB3FORMS_KEY = "";
   ```

   ve anahtarı tırnak içine yapıştır:

   ```js
   var WEB3FORMS_KEY = "buraya-gelen-anahtar";
   ```

5. Dosyayı kaydet, sunucuya yükle. Formu bir kez test et.

Ücretsiz plan aylık 250 mesaj — bu site için fazlasıyla yeterli.

---

## 7. Google'a bildirme

1. https://search.google.com/search-console → **Add property** → `kulesolution.com`.
2. Doğrulama için **DNS TXT kaydı** yöntemini seç (GoDaddy DNS panelinden eklenir).
3. Doğrulandıktan sonra **Sitemaps** → `sitemap.xml` yaz → **Submit**.
4. Ayrıca **Google Business Profile** kaydı aç — yerel aramada en çok bunu getirir.

---

## 8. Güncelleme yaparken

| Ne değişecek | Hangi dosya |
|---|---|
| Yazılar, başlıklar, açıklamalar | `assets/js/i18n.js` (+ Arnavutça için ilgili `.html`) |
| Renk, yazı tipi, boşluklar | `assets/css/style.css` |
| Telefon / e-posta / adres | Altı `.html` dosyasında ara-değiştir + `i18n.js` |
| Yeni proje eklemek | `projects.html` içinde bir `<article class="project">` bloğunu kopyala |
| Yeni fotoğraf | `assets/img/projects/` içine koy, genişliği en fazla 1600px olsun |
| WhatsApp numarası | `assets/js/main.js` → `WA_NUMBER` **ve** 7 HTML dosyasındaki `wa.me/...` bağlantısı |
| WhatsApp hazır mesajı | `assets/js/i18n.js` → `wa.msg` (üç dilde) |

Değişiklikten sonra dosyayı File Manager'dan yükle ve tarayıcıda **Ctrl+F5** yap.

---

## 9. Teknik notlar

- **Harici bağımlılık yok.** Fontlar sitenin içinde; CDN, jQuery, Bootstrap yok.
  Tek dış kaynak, iletişim sayfasındaki Google Haritalar penceresi.
- **Haritalar yerelde boş görünür** — `file://` ile açıldığında Google engeller.
  Gerçek domainde sorunsuz çalışır.
- **JavaScript kapalıysa** site yine tamamen okunur ve animasyonlar da çalışır
  (animasyonlar saf CSS). Sadece dil değiştirme düğmesi devre dışı kalır ve site
  Arnavutça görünür. İçeriğin görünürlüğü hiçbir koşulda JavaScript'e bağlı değil.
- **Kaydırma animasyonları** modern Chrome/Edge'de çalışır; Safari ve Firefox'ta
  içerik animasyonsuz ama eksiksiz görünür. Bu bilinçli bir tercih — animasyon
  uğruna içeriğin gizlenme riski alınmadı.
- **Toplam boyut** ~2 MB (fontlar ~1 MB). Sayfa başına ilk yükleme ~400–600 KB.
- Tarayıcı desteği: Chrome, Edge, Firefox, Safari — güncel sürümler ve son 3 yıl.

---

## 10. Yayına almadan önce kontrol listesi

- [ ] Altı sayfa da açılıyor, menü bağlantıları çalışıyor
- [ ] SQ / EN / TR arasında geçiş yapılıyor
- [ ] Telefon numarasına mobilden tıklayınca arama açılıyor
- [ ] İletişim formu test edildi (mail geldi mi?)
- [ ] SSL aktif, adres çubuğunda kilit görünüyor
- [ ] `kulesolution.com` → `www.kulesolution.com` yönleniyor
- [ ] Mobilde menü açılıp kapanıyor
- [ ] Google Search Console'a sitemap gönderildi
