# Kırmızı taban

Ölçütler koddan ÖNCE yazıldı; aşağıdaki ham çıktılar düzeltme öncesi durumdur.

## K-KUR · K-SKILL · K-AYNA-BIRIM — 2026-10-19, bin/ ayna/ SKILL.md yokken

```
$ npm test
not ok 1 - tests/ayna.test.mjs
not ok 2 - K-KUR: kur skill dosyalarını ~/.claude/skills/<ad>/ altına manifestoyla yazar
not ok 3 - K-KUR: --proje bulunulan klasörün .claude/skills/ altına kurar, HOME'a yazmaz
not ok 4 - K-KUR: kaldir yalnız kendi dosyalarını siler; yabancı dosya ve kurulum dışı yol korunur
not ok 5 - K-KUR: manifestosuz dolu hedef klasöre yazmaz (çıkış 2)
not ok 6 - K-KUR: yeniden kurulumda kullanıcının değiştirdiği dosya yedeklenir
not ok 7 - K-KUR: argümansız çağrı yardım basar, çıkış 0
not ok 3 - tests/skill.test.mjs
# tests 8
# pass 0
# fail 8
```
