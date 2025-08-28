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
const CONFIG_FILE = path.join(SVG_DIR, "sprite.config.json");

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
  // Load optional config for sprite generation behavior
  let fillIds = [];
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
      if (Array.isArray(cfg.fillIds)) fillIds = cfg.fillIds;
    } else {
      // Sensible defaults for project-specific assets
      fillIds = ["lf-signature", "lf-website"];
    }
  } catch (e) {
    console.warn("Failed to read sprite.config.json. Using defaults.");
    fillIds = ["lf-signature", "lf-website"];
  }
  const files = fs
    .readdirSync(SVG_DIR)
    .filter((f) => f.endsWith(".svg") && f !== "sprite.svg");
  const symbols = files.map((file) => {
    const raw = fs.readFileSync(path.join(SVG_DIR, file), "utf8");
    const sanitized = sanitize(raw);
    const viewBox = extractAttr(sanitized, "viewBox") || "0 0 24 24";
    const stroke = extractAttr(sanitized, "stroke") || "currentColor";
    // Normalize stroke width so very large viewBoxes remain visible when scaled down
    const vbParts = viewBox.split(/\s+/).map((v) => parseFloat(v));
    const vbW = isFinite(vbParts[2]) ? vbParts[2] : 24;
    const vbH = isFinite(vbParts[3]) ? vbParts[3] : 24;
    const scale = Math.max(vbW, vbH) / 24;
    const extractedStrokeWidth = extractAttr(sanitized, "stroke-width");
    const strokeWidth = extractedStrokeWidth || String(scale || 1);
    const strokeLinecap = extractAttr(sanitized, "stroke-linecap") || "round";
    const strokeLinejoin = extractAttr(sanitized, "stroke-linejoin") || "round";
    const id = path.basename(file, ".svg");
    let body = extractBody(sanitized);
    // Whitelist of icons that should render filled (currentColor)
    const isFilled = fillIds.includes(id);
    if (isFilled) {
      body = body
        .replace(/fill="none"/gi, 'fill="currentColor"')
        // Some tools emit fill='transparent'; normalize to currentColor
        .replace(/fill="transparent"/gi, 'fill="currentColor"');
    }
    const symbolFill = isFilled ? "currentColor" : "none";
    return `<symbol id="${id}" viewBox="${viewBox}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="${strokeLinecap}" stroke-linejoin="${strokeLinejoin}" fill="${symbolFill}">${body}</symbol>`;
  });
  const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${symbols.join("")}</svg>`;
  fs.writeFileSync(OUT_FILE, sprite, "utf8");
  console.log(`Generated sprite with ${symbols.length} symbols at ${OUT_FILE}`);
}

build();
