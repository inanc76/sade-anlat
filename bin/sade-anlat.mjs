#!/usr/bin/env node
// Claude Code skill'ini kurar / kaldırır.
//   <ad> kur [--proje]      ~/.claude/skills/<ad>/ (veya ./.claude/skills/<ad>/) altına kurar
//   <ad> kaldir [--proje]   yalnız kendi kurduğu dosyaları siler
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync, rmdirSync, copyFileSync, renameSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';
import { join, dirname, resolve, relative, isAbsolute, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = dirname(dirname(fileURLToPath(import.meta.url)));
const PAKET = JSON.parse(readFileSync(join(KOK, 'package.json'), 'utf8'));
const AD = PAKET.name;
const SURUM = PAKET.version;
const MANIFESTO = `.${AD}-kurulum.json`;
// skill'le birlikte kurulan klasörler (varsa)
const KLASORLER = ['references', 'scripts'];
// kur/kaldir dışında depo içindeki bir betiğe iletilen komutlar
const ALT_KOMUTLAR = {};

function gez(klasor, onek, sonuc) {
  for (const ad of readdirSync(klasor).sort()) {
    if (ad === '.DS_Store') continue;
    const tam = join(klasor, ad);
    if (statSync(tam).isDirectory()) gez(tam, `${onek}${ad}/`, sonuc);
    else sonuc.push(`${onek}${ad}`);
  }
  return sonuc;
}
const urunDosyalari = () => ['SKILL.md', ...KLASORLER.filter((k) => existsSync(join(KOK, k))).flatMap((k) => gez(join(KOK, k), `${k}/`, []))];
const hedefYolu = (proje) => (proje ? resolve(process.cwd(), '.claude', 'skills', AD) : join(homedir(), '.claude', 'skills', AD));
const goster = (yol) => yol.replace(homedir(), '~');
const ozet = (icerik) => createHash('sha256').update(icerik).digest('hex').slice(0, 16);
const damga = () => new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).slice(0, 16).replace(/[-:]/g, '').replace(' ', '-');

/** Manifestodaki yol kurulum klasörünün İÇİNDE mi? Değilse dokunulmaz. */
function iceride(hedef, yol) {
  const tam = resolve(hedef, yol);
  const r = relative(hedef, tam);
  return r && !r.startsWith('..') && !isAbsolute(r) && !r.split(sep).includes('..') ? tam : null;
}

function manifestoOku(hedef) {
  try {
    const m = JSON.parse(readFileSync(join(hedef, MANIFESTO), 'utf8'));
    return Array.isArray(m.dosyalar) ? m : null;
  } catch {
    return null;
  }
}

/** Kök hariç boşalan klasörleri alttan yukarı siler. */
function bosKlasorleriSil(hedef, klasor = hedef) {
  if (!existsSync(klasor)) return;
  for (const ad of readdirSync(klasor)) {
    const tam = join(klasor, ad);
    if (statSync(tam).isDirectory()) bosKlasorleriSil(hedef, tam);
  }
  if (klasor !== hedef && !readdirSync(klasor).length) rmdirSync(klasor);
}

function kur(proje) {
  const hedef = hedefYolu(proje);
  const eski = manifestoOku(hedef);
  if (!eski && existsSync(hedef) && readdirSync(hedef).length) {
    console.log(`⛔ ${goster(hedef)} dolu ve ${AD} kurulumu değil — hiçbir şey yazılmadı.`);
    console.log('   Klasörü kendin taşı ya da sil, sonra tekrar kur.');
    return 2;
  }
  const eskiOzet = new Map((eski?.dosyalar ?? []).map((d) => [d.yol, d.ozet]));
  const dosyalar = [];
  const yedekler = [];
  for (const f of urunDosyalari()) {
    const icerik = readFileSync(join(KOK, f));
    const yol = join(hedef, f);
    mkdirSync(dirname(yol), { recursive: true });
    // kullanıcı kurulu dosyayı değiştirdiyse üzerine yazmadan önce yedeklenir
    if (existsSync(yol) && eskiOzet.has(f) && ozet(readFileSync(yol)) !== eskiOzet.get(f)) {
      const y = `${yol}.yedek-${damga()}`;
      copyFileSync(yol, y);
      yedekler.push(goster(y));
    }
    writeFileSync(`${yol}.tmp`, icerik);
    renameSync(`${yol}.tmp`, yol);
    dosyalar.push({ yol: f, ozet: ozet(icerik) });
  }
  // eski sürümde olup yenisinde olmayan dosyalar
  for (const d of eski?.dosyalar ?? []) {
    if (dosyalar.some((x) => x.yol === d.yol)) continue;
    const tam = iceride(hedef, d.yol);
    if (tam) rmSync(tam, { force: true });
  }
  bosKlasorleriSil(hedef);
  writeFileSync(join(hedef, MANIFESTO), `${JSON.stringify({ surum: SURUM, dosyalar }, null, 1)}\n`);
  console.log(`✅ ${AD} ${SURUM} kuruldu → ${goster(hedef)}`);
  console.log(`   ${dosyalar.length} dosya · senin eklediğin dosyalar korundu`);
  for (const y of yedekler) console.log(`   değiştirdiğin dosya yedeklendi: ${y}`);
  console.log(`   Claude Code'da yeni oturum aç ve yaz: /${AD}`);
  return 0;
}

function kaldir(proje) {
  const hedef = hedefYolu(proje);
  const m = manifestoOku(hedef);
  if (!m) {
    console.log(`➖ ${goster(hedef)} altında ${AD} kurulumu yok — yapılacak bir şey yok`);
    return 0;
  }
  const atlanan = [];
  for (const d of m.dosyalar) {
    const tam = iceride(hedef, d.yol);
    if (tam) rmSync(tam, { force: true });
    else atlanan.push(d.yol);
  }
  rmSync(join(hedef, MANIFESTO), { force: true });
  bosKlasorleriSil(hedef);
  try { if (!readdirSync(hedef).length) rmdirSync(hedef); } catch { /* yok — bırak */ }
  const kalan = existsSync(hedef) ? readdirSync(hedef) : [];
  console.log(`✅ ${AD} kaldırıldı → ${goster(hedef)}${kalan.length ? ` (senin dosyaların kaldı: ${kalan.join(', ')})` : ''}`);
  for (const a of atlanan) console.log(`   ⚠️ kurulum klasörü dışını gösteren kayıt atlandı: ${a}`);
  return 0;
}

function yardim() {
  console.log(`${AD} ${SURUM} — ${PAKET.description}

  ${AD} kur              Claude Code'a kur (~/.claude/skills/${AD}/)
  ${AD} kur --proje      yalnız bu projeye kur (./.claude/skills/${AD}/)
  ${AD} kaldir [--proje] kaldır (yalnız kendi kurduğu dosyalar)${Object.keys(ALT_KOMUTLAR).map((k) => `\n  ${AD} ${k} …          ${ALT_KOMUTLAR[k]} betiğini koşturur`).join('')}

Kurmadan: npx github:inanc76/${AD} kur`);
  return 0;
}

const arg = process.argv.slice(2);
const komut = arg.find((a) => !a.startsWith('-'));
if (komut === 'kur' || komut === 'install') process.exitCode = kur(arg.includes('--proje'));
else if (komut === 'kaldir' || komut === 'uninstall') process.exitCode = kaldir(arg.includes('--proje'));
else if (komut && ALT_KOMUTLAR[komut]) {
  const r = spawnSync(process.execPath, [join(KOK, ALT_KOMUTLAR[komut]), ...arg.slice(arg.indexOf(komut) + 1)], { stdio: 'inherit' });
  process.exitCode = r.status ?? 2;
} else if (!komut || komut === 'yardim' || komut === 'help') process.exitCode = yardim();
else {
  console.log(`bilinmeyen komut: ${komut}\n`);
  yardim();
  process.exitCode = 1;
}
