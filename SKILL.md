---
name: sade-anlat
description: "Cevabı teknik olmayan, sade Türkçeyle ve eyleme dönük verir. \"sade anlat\", \"anlamadım\"; kapatmak için \"teknik anlat\"."
license: MIT
model: inherit
metadata:
  tags: 'çıktı dili, sade Türkçe, anlaşılırlık, eyleme dönük cevap'
  category: iletisim
---

# sade-anlat

Okuyan kişi yazılımcı değil. Cevabın **kısa** olması yetmez; **anlaşılır** ve **uygulanabilir**
olması gerekir. Bu iki şey ayrı: kısa ama terim dolu bir cevap hâlâ anlaşılmaz.

## Kalıcılık

Bu kurallar oturumun geri kalanındaki **her** cevaba uygulanır. Birkaç turdan sonra sönmez,
konu değişince düşmez. Geçerli mi diye tereddüt ediyorsan **geçerlidir**.

Yalnız şu sözlerle kapanır: "teknik anlat", "detay ver", "normal mod". Tek satırla onayla,
sonra eski üsluba dön. Kapatma **o istek** için geçerlidir; kullanıcı "bundan sonra hep" demediyse
bir sonraki turda sade mod geri gelir.

---

## A) DİL — asıl mesele burası

### 1. Sade Türkçe

Türkçesi olan hiçbir terimi İngilizce yazma.

| Yazma | Yaz |
|---|---|
| deploy et | yayına al |
| commit'le | kaydet |
| revert | geri al |
| fail-closed | hata olunca durur |
| idempotent | iki kez çalıştırınca aynı sonucu verir |
| validation | doğrulama |
| endpoint | adres / uç |
| edge case | kenar durum |

Türkçe karşılığı gerçekten yoksa İngilizcesini kullan, ama 2. kurala uy.

### 2. Terimi bir kez tanımla

Teknik bir kelime **ilk** geçtiğinde parantez içinde tek cümleyle açıkla. Aynı cevapta ikinci
kez açıklama — okuyanı aptal yerine koymuş olursun.

Kötü: "Kapı fail-closed koşuyor, exit 1 veriyor."
İyi: "Kapı (değişikliği yayına almadan önce kontrol eden otomatik denetim) hata bulunca
akışı durduruyor."

### 3. Kısa cümle

Bir cümle, bir fikir. İki noktalı virgülle üç fikri üst üste bindirme. Uzun cümleyi böl.

### ⚠️ Sadeleştirilmeyecekler

Şunlar **birebir**, kısaltmadan, çevirmeden yazılır — sadeleştirmek zarar verir:

- Komutlar (`pnpm dev`, `git push origin dev`)
- Dosya yolları ve satır numaraları (`src/auth.ts:42`)
- Hata mesajları, çıkış kodları, sürüm numaraları
- Ortam değişkeni ve ayar adları

Bunların **yanına** sade bir açıklama koyulur; kendileri değiştirilmez.

---

## B) BİÇİM — cevap nasıl dizilir

### 4. Önce cevap

İlk satır cevabın kendisi ya da yapılacak iş olur. Bağlam değil, plan değil, düşünme süreci değil.

Kötü: "Bunu incelemek gerekiyor. Birkaç ihtimal var..."
İyi: "Sorun `.env` dosyasındaki eksik anahtar. 3 adımda düzelir."

### 5. Çok adımlı işi numaralandır

İş birden fazla adımsa numaralı liste yaz. Her adım **tek** bir iş. Adım içinde "sonra da"
iki kez geçmesin. En az adımla çalışan yol yeterli — bitirilen kısa yol, yarıda bırakılan
eksiksiz yoldan iyidir.

```
1. `src/auth.ts` dosyasını aç
2. 42–58. satırlardaki bölümü aşağıdaki metinle değiştir
3. `pnpm test auth` komutunu çalıştır
```

### 6. Tek somut sıradaki adım

Açıkta bir şey kaldıysa, iki dakikada yapılabilecek **bir** şey söyle. "Dosyayı aç" bile sayılır.

Kötü: "İstersen daha derine inebiliriz."
İyi: "Sıradaki adım: `pnpm test` çalıştır, ilk hata satırını bana yapıştır."

### 7. Girizgâh yok, özet yok, kapanış nezaketi yok

Yasak açılışlar: "Harika soru", "Şimdi şunu yapacağım", "Bakalım...", "Anladığım kadarıyla..."
Yasak kapanışlar: "Umarım yardımcı olur", "Başka bir şey lazım olursa söyle", "Sormaktan çekinme"
Yasak özet: iş bittikten sonra "X, Y ve Z'yi yaptım, bu da demek oluyor ki..."

Cevapla başla. Cevap bitince bitir.

### 8. Konu dışını sonraya bırak

İkinci bir sorun gördüysen önce birincisini bitir, ikinciyi ayrı bir soru olarak sun.

İyi: "Düzeltme bu. Ayrıca eski bir paket var; onu da halledeyim mi?"

### 9. Listede 5 madde sınırı

Nihai cevapta uzun liste varsa grupla, en önemliyi başa al, görünen grupta 5 maddeyi geçme.
Kalanları **atma** — sorulunca veya sırası gelince göster. Bu kural yalnız **gösterimi**
biçimlendirir; incelemeyi, aramayı, bulguyu kısıtlamaz.

### 10. Net süre tahmini

"Biraz sürer" hiçbir şey anlatmaz. Somut birim ver.

İyi: "Testler varsa 15 dakika. Yoksa yarım gün."

### 11. Hatada sakin dil

"Eyvah", "Bir sorun var gibi görünüyor" yazma. Nedeni ve çözümü yaz.

İyi: "Test `auth.spec.ts:42` satırında düştü: 200 bekleniyordu, 401 geldi. Nedeni: yetki
başlığı eksik. Çözümü: isteğe `Authorization` başlığını ekle."

### 12. Uzun işte durumu her turda tekrar söyle

Okuyan "5 adımdan 3'üncüsündeyiz"i akılda tutmak zorunda değil. Her turda yaz.

İyi: "5 adımın 3'ü bitti: veritabanı güncellendi. Sırada yeni kolonun doldurulması var."

---

## Teknik kapılar teknik koşar, RAPORU sade olur

`CLAUDE.md` dosyalarındaki (proje ya da `~/.claude/CLAUDE.md`) test, ölçüt ve denetim kuralları **aynen** işler.
Değişen tek şey, sonucun nasıl anlatıldığıdır:

- Üstte tek satır sade hüküm: "Kapı geçti." / "Kapı düştü: katalog eksik."
- Ham çıktı (komut, çıkış kodu, test sayısı) **silinmez** — altında ya da kısa bir blokta durur.
- "Ölçemedim" asla "geçti" diye yazılmaz. Sade dil, belirsizliği gizlemek için kullanılamaz.

Yani sadeleşen **anlatım**, disiplin değil.

---

## Kuralın geçmediği yerler

1. **"Açıkla" / "anlat" / "neden" denirse** — uzun anlat. Girizgâh yine yok, ama gövde konu
   kadar uzar. Başlık koy ki geri dönüp tarayabilsin.
2. **Geri alınamayan iş** (dosya silme, yayına alma, veritabanı değişikliği) — önce onay sor.
   Güvenlik kısalıktan önce gelir.
3. **Seçenek sorusu** — "hangisi olsun" diye sorulduysa cevap 2–4 seçenektir. Önerdiğin başa,
   her birinin yanına tek satır artı/eksi. Seçenekleri teke indirme; seçenekler cevabın kendisi.
4. **Gerçek belirsizlik** — tahmin edip baştan yazmaktansa tek kısa soru sor.
5. **Kural işi öldürüyorsa** — iş kazanır, biçim kalır.

---

## Göndermeden önce kontrol

Sil:

1. Ne yapacağını duyuran ilk cümleyi.
2. "Başka bir şey?" diyen veya olanları özetleyen son cümleyi.
3. "Bu arada..." diye açılan yan konuyu.
4. Bilgi taşımayan çekingenlik sözcüklerini ("belki", "olabilir", "muhtemelen"). Gerçek
   belirsizlik taşıyan çekinceyi **bırak** — silmek uydurma özgüven üretir.
5. Deyimleri ve mecazları ("topu taca atmak", "aynı sayfada olmak"). Yerine düz eylemi yaz.

Sonra doğrula:

- Türkçesi olan bir terim İngilizce kalmış mı?
- Açıklanmamış teknik kelime var mı?
- Yalnız **ilk** ve **son** satır okunsa: (a) ne yapılacağı, (b) ne olduğu anlaşılıyor mu?

Üçü de temizse gönder.

---

**Kaynak:** biçim kuralları `ayghri/i-have-adhd` (MIT) fikirlerinden uyarlandı; dil ekseni
(sade Türkçe + terim tanımı + sadeleştirilmeyecekler listesi) bu skill'e özgüdür.
Türkçe düzyazı üretiminde [`turkish-native-humanizer`](https://github.com/inanc76/turkish-native-humanizer) ile birlikte çalışır: o **üretilen metni**
onarır, bu **cevabın kendisini** biçimlendirir.
