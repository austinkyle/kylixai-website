#!/usr/bin/env node
// Injects build/src/_partials/{nav,footer}.html into every page in build/src/
// between marker comments. Run manually after editing a partial:
//   node build/sync-partials.mjs
// Produces plain static HTML — no build step, no runtime dependency.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, "src");
const PARTIALS_DIR = path.join(SRC_DIR, "_partials");

const PARTS = {
  nav: {
    file: path.join(PARTIALS_DIR, "nav.html"),
    startMarker: "<!-- @partial:nav -->",
    endMarker: "<!-- @partial:nav:end -->",
    // First-run fallback: locate the raw <nav class="nav" ...>...</nav> block.
    fallback: /<nav class="nav"[\s\S]*?<\/nav>/,
  },
  footer: {
    file: path.join(PARTIALS_DIR, "footer.html"),
    startMarker: "<!-- @partial:footer -->",
    endMarker: "<!-- @partial:footer:end -->",
    // First-run fallback: locate <footer class="footer" ...>...</footer> through
    // the sticky mobile CTA div that immediately follows it.
    fallback: /<footer class="footer"[\s\S]*?<\/footer>\s*(?:<!--[^>]*-->\s*)?<div class="mobile-cta">[\s\S]*?<\/div>/,
  },
};

function wrapped(part, content) {
  return `${part.startMarker}\n${content.trim()}\n${part.endMarker}`;
}

function syncFile(filePath) {
  let html = readFileSync(filePath, "utf8");
  let changed = false;

  for (const key of Object.keys(PARTS)) {
    const part = PARTS[key];
    const content = readFileSync(part.file, "utf8");
    const replacement = wrapped(part, content);

    const markerRe = new RegExp(
      `${escapeRe(part.startMarker)}[\\s\\S]*?${escapeRe(part.endMarker)}`
    );

    if (markerRe.test(html)) {
      const next = html.replace(markerRe, replacement);
      if (next !== html) changed = true;
      html = next;
    } else if (part.fallback.test(html)) {
      html = html.replace(part.fallback, replacement);
      changed = true;
    } else {
      console.warn(`  ! ${path.basename(filePath)}: no ${key} marker or fallback match found — skipped`);
    }
  }

  if (changed) {
    writeFileSync(filePath, html, "utf8");
    console.log(`  synced ${path.basename(filePath)}`);
  } else {
    console.log(`  up to date: ${path.basename(filePath)}`);
  }
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const pages = readdirSync(SRC_DIR).filter(
  (f) => f.endsWith(".html") && f !== "_partials"
);

console.log(`Syncing nav/footer partials into ${pages.length} page(s)...`);
for (const page of pages) {
  syncFile(path.join(SRC_DIR, page));
}
console.log("Done.");
