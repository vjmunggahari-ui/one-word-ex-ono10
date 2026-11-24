import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The word: the one word my ex would use to describe me.
// "Typo" — I was a mistake she could correct with one keystroke.
const WORD = "Typo";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

mkdirSync(outDir, { recursive: true });
const entryPath = join(outDir, "entry.txt");
writeFileSync(entryPath, WORD, "utf8");

// Read-back self-check: the file must contain exactly the word, nothing else.
const written = readFileSync(entryPath, "utf8");
if (written !== WORD) {
  throw new Error(
    `entry.txt mismatch: expected ${JSON.stringify(WORD)}, got ${JSON.stringify(written)}`,
  );
}

// Gate validation, re-read from disk: 1–24 chars, exactly one word, no
// whitespace at all (no trailing newline, no spaces). A word that fails the
// gate is never judged, so fail loudly here instead of shipping it.
const gateRead = readFileSync(entryPath, "utf8");
if (gateRead.length < 1 || gateRead.length > 24) {
  throw new Error(`entry.txt gate failed: length ${gateRead.length}, need 1-24 chars`);
}
if (/\s/.test(gateRead) || gateRead.trim() !== gateRead) {
  throw new Error(`entry.txt gate failed: not exactly one word: ${JSON.stringify(gateRead)}`);
}
if (gateRead !== WORD) {
  throw new Error(`entry.txt gate failed: content drifted to ${JSON.stringify(gateRead)}`);
}

console.log(`Wrote entry.txt: ${WORD} (${WORD.length} chars)`);
