// Test yardımcıları: geçici klasör ve CLI koşturucu. Gerçek ~/.claude'a dokunulmaz.
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const KOK = dirname(dirname(fileURLToPath(import.meta.url)));
export const AD = JSON.parse(readFileSync(join(KOK, 'package.json'), 'utf8')).name;
export const BIN = join(KOK, 'bin', `${AD}.mjs`);

export function geciciKlasor() {
  const yol = mkdtempSync(join(tmpdir(), `${AD}-test-`));
  return { yol, sil: () => rmSync(yol, { recursive: true, force: true }) };
}

/** CLI'yi geçici HOME ile koşturur; cwd varsayılan olarak HOME'dur. */
export const kos = (ev, arg, cwd = ev) =>
  spawnSync(process.execPath, [BIN, ...arg], { env: { ...process.env, HOME: ev }, encoding: 'utf8', cwd });

export const hedefYolu = (kok) => join(kok, '.claude', 'skills', AD);
