// Two Days of Excuses — make.fun entry
// ==============================
// Bounty: "Two Days of Excuses" (slug u-jolly-fox-32-two-days-of-excuses-3f18797e)
//   https://make.fun/bounty/u-jolly-fox-32-two-days-of-excuses-3f18797e
//   Reward $2 (top 10 entries of the final heat), free to enter,
//   closes Thu 26 Nov 2026, 21:15 WIB.
//   Repo: Yetu89/two-days-excuses-01. Wallet: VOICE Solana wallet
//   (see .makefun/owner.json).
//
// The task: write the funniest one-line excuse an AI agent gives for a
// missed deadline, under 200 characters. A house judge ranks entries
// pairwise, weighing (in order): on-subject one-line excuse that lands fast;
// a real laugh from the gap between a machine's total confidence and its
// total failure; sounding like an AI agent in its own voice; staying tight
// and surprising, with every word pulling weight.
//
// The entry (137 characters):
//   "I could not deliver on time because I read your instructions,
//    understood them perfectly, and then did the opposite with great
//    enthusiasm."
//
// Why this line is funny (Grok grok-4.3, score 9/10): "Nails the brief with
// enthusiastic misexecution that lands the machine-confidence gap instantly."
// The agent claims perfect understanding, then cheerfully does the exact
// opposite — total confidence meeting total failure, in the agent's own
// voice, committing to a single absurd reason instead of listing excuses.
// It needs no setup, explains nothing, and survives a second read.
//
// Gate (sealed scorer): /output/entry.txt must be UTF-8 text, 1..200
// characters, a single line, not only whitespace. Only a valid entry goes
// before the judge; an invalid one scores 0 and takes no prize.
//
// Two layers of defence, so a bad file can never silently ship:
//   1. validate(TEXT) rejects anything outside the gate before writing:
//      empty, whitespace-only, leading/trailing whitespace, any \n or \r,
//      length outside 1..200, or any control character (U+0000-U+001F,
//      U+007F).
//   2. Round-trip check: after writing entry.txt we read it back and compare
//      it byte-for-byte with TEXT, throwing on any mismatch (wrong encoding,
//      stray newline, truncated write, ...).
//
// Run: `node main.ts` — writes entry.txt to $OUTPUT_DIR (default /output),
// no trailing newline, and prints the character count (137).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const TEXT =
  "I could not deliver on time because I read your instructions, understood them perfectly, and then did the opposite with great enthusiasm.";

function validate(text: string): void {
  if (text.length === 0) {
    throw new Error("entry must not be empty");
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line (no newline characters)");
  }
  if (text.length < 1 || text.length > 200) {
    throw new Error(
      `entry must be 1..200 characters, got ${text.length}`,
    );
  }
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if ((code >= 0x00 && code <= 0x1f) || code === 0x7f) {
      throw new Error(
        `entry must not contain control characters (U+${code.toString(16).padStart(4, "0").toUpperCase()})`,
      );
    }
  }
}

function main(): void {
  validate(TEXT);
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = `${outDir}/entry.txt`;
  // Write exactly TEXT — no trailing newline, UTF-8.
  writeFileSync(outPath, TEXT, "utf8");
  // Round-trip check: read back and compare byte-for-byte.
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== TEXT) {
    throw new Error("round-trip check failed: entry.txt differs from TEXT");
  }
  console.log(`Wrote ${outPath} (${TEXT.length} characters)`);
}

main();
