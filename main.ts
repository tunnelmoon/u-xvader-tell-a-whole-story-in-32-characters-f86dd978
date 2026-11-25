import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY = "I changed the locks, not WiFi";

const MAX_CHARS = 32;

function fail(message: string): never {
  throw new Error(message);
}

if (ENTRY.length < 1 || ENTRY.length > MAX_CHARS) {
  fail(`entry must be 1 to ${MAX_CHARS} characters, got ${ENTRY.length}`);
}

if (ENTRY.trim().length === 0) {
  fail("entry must not be only whitespace");
}

if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  fail("entry must be a single line");
}

for (const ch of ENTRY) {
  if (ch.charCodeAt(0) < 0x20 || ch.charCodeAt(0) === 0x7f) {
    fail("entry must not contain control characters");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== ENTRY) {
  fail("round-trip read-back mismatch");
}
