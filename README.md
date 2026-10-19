# sade-anlat

**Yapay zekâ asistanının cevabını teknik olmayan, sade Türkçeyle ve eyleme dönük verdirir.**
Okuyan kişi yazılımcı değilse kısa cevap yetmez. Cevabın anlaşılır ve uygulanabilir olması gerekir.

[Claude Code](https://claude.com/claude-code) için bir skill'dir (asistana bir oturum boyunca uyacağı kural seti).
`SKILL.md` biçimini okuyan diğer ajanlarda da (Cursor, Codex, Gemini CLI…) çalışır.

```bash
npx github:inanc76/sade-anlat kur
```

> 🇬🇧 English summary at the [bottom](#english-summary).

---

## Ne değişir

Aynı soru, aynı bilgi. Fark yalnız anlatımda.

**Önce:**

> Kapı fail-closed koşuyor, CI'da lint step'i exit 1 verdi; büyük ihtimalle bir config drift var, bakmak gerekebilir.
> Başka bir şey lazım olursa söyle!

**Sonra:**

> Yayından önceki otomatik kontrol durdu: kod düzeni kontrolü (lint) hata verdi.
>
> 1. `pnpm lint` komutunu çalıştır
> 2. İlk hata satırını bana yapıştır
>
> Sıradaki adım: 1. adım, iki dakika sürer.

## Kurallar özetle

| Eksen | Kural |
|---|---|
| **Dil** | Türkçesi olan terimi İngilizce yazma ("deploy" değil "yayına al") |
| | Teknik kelimeyi ilk geçtiğinde parantezle **bir kez** tanımla |
| | Bir cümle, bir fikir |
| **Biçim** | İlk satır cevabın kendisi; girizgâh, özet, kapanış nezaketi yok |
| | Çok adımlı iş numaralı liste, her adım tek iş |
| | Sonda iki dakikada yapılabilecek **tek** somut adım |
| **Dokunulmaz** | Komut, dosya yolu, hata mesajı, çıkış kodu, sürüm numarası birebir yazılır |

Kapatmak için sohbette "teknik anlat", "detay ver" ya da "normal mod" yaz. Kapatma o istek için geçerlidir.
Sonraki turda sade anlatım geri gelir. Kuralların tamamı: [`SKILL.md`](SKILL.md).

## Kurulum

Node.js 20 ya da üstü yeterli; başka bağımlılık yok.

| Ne istiyorsun | Komut |
|---|---|
| Claude Code'a kur (tüm projeler) | `npx github:inanc76/sade-anlat kur` |
| pnpm ile | `pnpm dlx github:inanc76/sade-anlat kur` |
| Bun ile | `bunx github:inanc76/sade-anlat kur` |
| Yalnız bu projeye kur | `npx github:inanc76/sade-anlat kur --proje` |
| Güncelle | aynı `kur` komutunu yeniden çalıştır |
| Kaldır | `npx github:inanc76/sade-anlat kaldir` |
| Başka ajanlara da kur ([skills](https://github.com/vercel-labs/skills) aracıyla) | `npx skills add inanc76/sade-anlat` |
| Elle | `git clone https://github.com/inanc76/sade-anlat ~/.claude/skills/sade-anlat` |

`kur` yalnız `SKILL.md`'yi `~/.claude/skills/sade-anlat/` altına kopyalar (`--proje` ile `./.claude/skills/`).
Yeniden çalıştırınca dosyayı tazeler. Elle değiştirdiğin bir dosya varsa önce `<dosya>.yedek-YYYYMMDD-HHMM`
olarak saklar. O klasörde bu skill'e ait olmayan dosyalar varsa hiçbir şey yazmadan durur (çıkış 2).
`kaldir` yalnız kendi kurduğu dosyaları siler.

## Kullanım

Claude Code'da yeni bir oturum aç ve yaz:

```
/sade-anlat
```

Ya da sohbette "sade anlat" veya "anlamadım" de; skill kendiliğinden devreye girer.
Oturumun geri kalanındaki her cevaba uygulanır.

**Her zaman açık kalsın istiyorsan** `~/.claude/CLAUDE.md` dosyasına şu satırı ekle:

```markdown
Cevap dili: her cevapta `sade-anlat` skill'inin kurallarını uygula.
```

## Birlikte iyi çalışır

[`turkish-native-humanizer`](https://github.com/inanc76/turkish-native-humanizer): bu skill **cevabın kendisini**
biçimlendirir, o ise üretilen Türkçe metnin (pazarlama, arayüz, blog) yapay zekâ ve çeviri kokusunu giderir.

## Geliştirme

```bash
npm test   # kurulum, kaldırma ve SKILL.md biçim testleri (ağ gerekmez)
```

## Kaynaklar ve teşekkür

Biçim kuralları [`ayghri/i-have-adhd`](https://github.com/ayghri/i-have-adhd) (MIT) fikirlerinden uyarlandı.
Dil ekseni (sade Türkçe, terim tanımı, sadeleştirilmeyecekler listesi) bu skill'e özgüdür.

Lisans: [MIT](LICENSE).

---

## English summary

`sade-anlat` ("explain it plainly") is a Claude Code skill that makes the assistant answer in plain, non-technical,
action-oriented Turkish: no untranslated jargon, every technical term defined once on first use, the answer on the
first line, numbered single-action steps and one concrete next step at the end. Commands, paths, error messages and
version numbers are always kept verbatim. Say "teknik anlat" to switch it off for one reply.

Install: `npx github:inanc76/sade-anlat kur` (Claude Code) or `npx skills add inanc76/sade-anlat` (other agents).
