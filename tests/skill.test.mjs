// K-SKILL — SKILL.md Claude Code'un ve `npx skills`in okuyacağı biçimde mi; depo kendi içinde tutarlı mı.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { AD, KOK } from './yardimci.mjs';

const skill = readFileSync(join(KOK, 'SKILL.md'), 'utf8');
const on = skill.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? '';

test('K-SKILL: ön bilgi var, name paket adıyla aynı, description 1024 karakteri aşmıyor', () => {
  assert.ok(on, 'SKILL.md --- ile açılan ön bilgi taşımalı');
  assert.equal(on.match(/^name:\s*(.+)$/m)?.[1].trim(), AD);
  const aciklama = on.match(/^description:\s*(.+)$/m)?.[1] ?? '';
  assert.ok(aciklama.length > 20 && aciklama.length <= 1024, `description uzunluğu ${aciklama.length}`);
});

test('K-SKILL: SKILL.md\'nin andığı references/ ve scripts/ dosyaları depoda var', () => {
  const anilan = [...skill.matchAll(/`((?:references|scripts)\/[\w./-]+\.(?:md|mjs))`/g)].map((m) => m[1]);
  for (const yol of new Set(anilan)) assert.ok(existsSync(join(KOK, yol)), `eksik: ${yol}`);
});

test('K-SKILL: genel kopyada yerel makineye özgü iz yok', () => {
  for (const f of ['SKILL.md', 'README.md']) {
    const m = readFileSync(join(KOK, f), 'utf8');
    assert.doesNotMatch(m, /\/Users\/|~\/CODEBASE|mediaclick-skills\/skills/, `${f} yerel yol taşıyor`);
  }
});
