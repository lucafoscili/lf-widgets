#!/usr/bin/env node
/*
 * Generates an SVG sprite (symbol based) from all svg files in assets/svg.
 * Output: assets/svg/sprite.svg (overwrites existing).
 * Simple, dependency-free to keep foundations clean.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SVG_DIR = path.join(ROOT, "assets", "svg");
const OUT_FILE = path.join(SVG_DIR, "sprite.svg");

function sanitize(content) {
  // Remove xml declarations & comments & duplicate whitespace
  return content
    .replace(/<\?xml[^>]*>/g, "")
    .replace(/<!--([\s\S]*?)-->/g, "")
    .replace(/\r?\n+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function extractAttr(svg, name) {
  const m = svg.match(new RegExp(name + '="([^"]+)"'));
  return m ? m[1] : null;
}

function extractBody(svg) {
  // Remove outer <svg ...> ... </svg>
  return svg
    .replace(/^[\s\S]*?<svg[^>]*>/i, "")
    .replace(/<\/svg>[\s\S]*$/i, "")
    .trim();
}

function build() {
  if (!fs.existsSync(SVG_DIR)) {
    console.error("SVG directory not found:", SVG_DIR);
    process.exit(1);
  }
  const files = fs
    .readdirSync(SVG_DIR)
    .filter((f) => f.endsWith(".svg") && f !== "sprite.svg");
  const symbols = files.map((file) => {
    const raw = fs.readFileSync(path.join(SVG_DIR, file), "utf8");
    const sanitized = sanitize(raw);
    const viewBox = extractAttr(sanitized, "viewBox") || "0 0 24 24";
    const stroke = extractAttr(sanitized, "stroke") || "currentColor";
    const strokeWidth = extractAttr(sanitized, "stroke-width") || "1";
    const strokeLinecap = extractAttr(sanitized, "stroke-linecap") || "round";
    const strokeLinejoin = extractAttr(sanitized, "stroke-linejoin") || "round";
    const body = extractBody(sanitized);
    const id = path.basename(file, ".svg");
    return `<symbol id="${id}" viewBox="${viewBox}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="${strokeLinecap}" stroke-linejoin="${strokeLinejoin}" fill="none">${body}</symbol>`;
  });
  const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${symbols.join("")}</svg>`;
  fs.writeFileSync(OUT_FILE, sprite, "utf8");
  console.log(`Generated sprite with ${symbols.length} symbols at ${OUT_FILE}`);
}

build();
