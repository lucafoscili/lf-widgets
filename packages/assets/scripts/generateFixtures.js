#!/usr/bin/env node
/*
 * Generates JSON fixtures for lf-shapeeditor based on the
 * TypeScript source definitions in src/fixtures/shapeeditor.
 *
 * Output (all under assets/fixtures/shapeeditor):
 * - effects.json
 * - image-editor.json
 */

const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const SRC_FIXTURES_DIR = path.join(ROOT, "src", "fixtures", "shapeeditor");
const OUT_DIR = path.join(ROOT, "assets", "fixtures", "shapeeditor");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function loadTsModule(relativePath) {
  const filePath = path.join(SRC_FIXTURES_DIR, relativePath);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Fixture source not found: ${filePath}`);
  }

  const tsCode = fs.readFileSync(filePath, "utf8");

  const compiled = ts.transpileModule(tsCode, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      esModuleInterop: true,
      strict: true,
    },
    fileName: filePath,
  });

  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    require,
    __dirname: path.dirname(filePath),
    __filename: filePath,
    console,
  };

  vm.runInNewContext(compiled.outputText, sandbox, { filename: filePath });

  return module.exports;
}

function buildFixture(sourceFile, relativeOutFile, transform) {
  const mod = loadTsModule(sourceFile);
  const json = transform(mod);

  const outPath = path.join(OUT_DIR, relativeOutFile);
  ensureDir(path.dirname(outPath));
  fs.writeFileSync(outPath, JSON.stringify(json, null, 2), "utf8");
  console.log(`Generated fixtures at ${outPath}`);
}

function main() {
  // Effects family
  buildFixture("effects.ts", "effects.json", (mod) => {
    const { EFFECTS_DEFINITIONS, createEffectDsl } = mod || {};

    if (!Array.isArray(EFFECTS_DEFINITIONS)) {
      throw new Error("EFFECTS_DEFINITIONS export not found or invalid.");
    }

    const effects = EFFECTS_DEFINITIONS.map((effect) => ({
      id: effect.id,
      name: effect.name,
      description: effect.description,
      icon: effect.icon,
      defaultSettings: effect.defaultSettings,
      presets: effect.presets,
      controls: effect.controls,
      configDsl:
        typeof createEffectDsl === "function"
          ? createEffectDsl(effect)
          : undefined,
    }));

    return { effects };
  });

  // Image editor family
  buildFixture("imageEditor.ts", "image-editor.json", (mod) => {
    const {
      IMAGE_EDITOR_BRUSH_DSL,
      IMAGE_EDITOR_BRIGHTNESS_DSL,
      IMAGE_EDITOR_RESIZE_EDGE_DSL,
      IMAGE_EDITOR_CANVAS_DATASET,
      IMAGE_EDITOR_SETTINGS_DATASET,
    } = mod;

    const dsl = {
      brush: IMAGE_EDITOR_BRUSH_DSL,
      brightness: IMAGE_EDITOR_BRIGHTNESS_DSL,
      resizeEdge: IMAGE_EDITOR_RESIZE_EDGE_DSL,
    };

    const canvasDataset =
      typeof IMAGE_EDITOR_CANVAS_DATASET === "function"
        ? IMAGE_EDITOR_CANVAS_DATASET((assetPath) => ({ path: assetPath }))
        : undefined;

    const settingsDataset = IMAGE_EDITOR_SETTINGS_DATASET;

    return {
      dsl,
      canvasDataset,
      settingsDataset,
    };
  });
}

main();
