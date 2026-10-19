// K-KUR — geçici HOME'da kurulur; gerçek ~/.claude'a dokunulmaz.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, writeFileSync, readFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { AD, KOK, geciciKlasor, kos, hedefYolu } from './yardimci.mjs';

const MANIFESTO = `.${AD}-kurulum.json`;

test('K-KUR: kur skill dosyalarını ~/.claude/skills/<ad>/ altına manifestoyla yazar', () => {
  const k = geciciKlasor();
  try {
    const r = kos(k.yol, ['kur']);
    assert.equal(r.status, 0, r.stderr + r.stdout);
    const hedef = hedefYolu(k.yol);
    assert.ok(existsSync(join(hedef, 'SKILL.md')), 'SKILL.md yok');
    assert.equal(readFileSync(join(hedef, 'SKILL.md'), 'utf8'), readFileSync(join(KOK, 'SKILL.md'), 'utf8'));
    const m = JSON.parse(readFileSync(join(hedef, MANIFESTO), 'utf8'));
    assert.ok(m.dosyalar.some((d) => d.yol === 'SKILL.md'));
    // depo geliştirme dosyaları kurulmaz
    for (const f of ['tests', 'bin', 'ayna', 'kutuk', 'README.md', '.github']) assert.ok(!existsSync(join(hedef, f)), `kurulmamalı: ${f}`);
  } finally {
    k.sil();
  }
});

test('K-KUR: --proje bulunulan klasörün .claude/skills/ altına kurar, HOME\'a yazmaz', () => {
  const k = geciciKlasor();
  try {
    const proje = join(k.yol, 'proje');
    mkdirSync(proje);
    const r = kos(k.yol, ['kur', '--proje'], proje);
    assert.equal(r.status, 0, r.stderr + r.stdout);
    assert.ok(existsSync(join(hedefYolu(proje), 'SKILL.md')));
    assert.ok(!existsSync(hedefYolu(k.yol)), 'HOME altına yazılmamalı');
  } finally {
    k.sil();
  }
});

test('K-KUR: kaldir yalnız kendi dosyalarını siler; yabancı dosya ve kurulum dışı yol korunur', () => {
  const k = geciciKlasor();
  try {
    assert.equal(kos(k.yol, ['kur']).status, 0);
    const hedef = hedefYolu(k.yol);
    writeFileSync(join(hedef, 'yabanci.txt'), 'kullanıcının dosyası');
    const kurban = join(k.yol, 'kurban.txt');
    writeFileSync(kurban, 'silinmemeli');
    const mYol = join(hedef, MANIFESTO);
    const m = JSON.parse(readFileSync(mYol, 'utf8'));
    m.dosyalar.push({ yol: '../../../kurban.txt', ozet: 'x' });
    writeFileSync(mYol, JSON.stringify(m));

    const r = kos(k.yol, ['kaldir']);
    assert.equal(r.status, 0, r.stderr + r.stdout);
    assert.ok(existsSync(kurban), 'kurulum dışındaki dosya silinmemeli');
    assert.deepEqual(readdirSync(hedef).sort(), ['yabanci.txt']);
  } finally {
    k.sil();
  }
});

test('K-KUR: manifestosuz dolu hedef klasöre yazmaz (çıkış 2)', () => {
  const k = geciciKlasor();
  try {
    const hedef = hedefYolu(k.yol);
    mkdirSync(hedef, { recursive: true });
    writeFileSync(join(hedef, 'SKILL.md'), "başkasının skill'i");
    const r = kos(k.yol, ['kur']);
    assert.equal(r.status, 2, r.stdout);
    assert.equal(readFileSync(join(hedef, 'SKILL.md'), 'utf8'), "başkasının skill'i");
  } finally {
    k.sil();
  }
});

test('K-KUR: yeniden kurulumda kullanıcının değiştirdiği dosya yedeklenir', () => {
  const k = geciciKlasor();
  try {
    assert.equal(kos(k.yol, ['kur']).status, 0);
    const hedef = hedefYolu(k.yol);
    writeFileSync(join(hedef, 'SKILL.md'), 'elle değiştirildi');
    assert.equal(kos(k.yol, ['kur']).status, 0);
    const yedek = readdirSync(hedef).find((f) => /^SKILL\.md\.yedek-\d{8}-\d{4}$/.test(f));
    assert.ok(yedek, `yedek yok: ${readdirSync(hedef)}`);
    assert.equal(readFileSync(join(hedef, yedek), 'utf8'), 'elle değiştirildi');
    assert.equal(readFileSync(join(hedef, 'SKILL.md'), 'utf8'), readFileSync(join(KOK, 'SKILL.md'), 'utf8'));
  } finally {
    k.sil();
  }
});

test('K-KUR: argümansız çağrı yardım basar, çıkış 0', () => {
  const k = geciciKlasor();
  try {
    const r = kos(k.yol, []);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /kur/);
    assert.ok(!existsSync(hedefYolu(k.yol)), 'yardım bir şey kurmamalı');
  } finally {
    k.sil();
  }
});
