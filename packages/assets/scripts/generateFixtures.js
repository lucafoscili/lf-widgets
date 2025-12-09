#!/usr/bin/env node
/*
 * Generates JSON fixtures for lf-shapeeditor based on the
 * TypeScript source definitions in src/fixtures/shapeeditor.
 *
 * Output (all under assets/fixtures/shapeeditor):
 * - effects.json
 * - image-editor.json
 *
 * Also validates fixtures at build time to catch errors early.
 */

const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const SRC_FIXTURES_DIR = path.join(ROOT, "src", "fixtures", "shapeeditor");
const OUT_DIR = path.join(ROOT, "assets", "fixtures", "shapeeditor");

// Cache for loaded modules
const moduleCache = new Map();

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * Loads and transpiles a TypeScript module, with caching and relative import support.
 */
function loadTsModule(filePath, baseDir = SRC_FIXTURES_DIR) {
  const fullPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(baseDir, filePath);

  if (moduleCache.has(fullPath)) {
    return moduleCache.get(fullPath);
  }

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Fixture source not found: ${fullPath}`);
  }

  const tsCode = fs.readFileSync(fullPath, "utf8");

  const compiled = ts.transpileModule(tsCode, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      esModuleInterop: true,
      strict: true,
    },
    fileName: fullPath,
  });

  const module = { exports: {} };

  // Custom require to handle relative imports
  const customRequire = (modulePath) => {
    // Handle relative imports (e.g., "../controls")
    if (modulePath.startsWith(".")) {
      const resolvedPath = path.resolve(path.dirname(fullPath), modulePath);
      const tsPath = resolvedPath.endsWith(".ts")
        ? resolvedPath
        : `${resolvedPath}.ts`;
      return loadTsModule(tsPath, path.dirname(tsPath));
    }
    // Handle @lf-widgets/foundations (just return empty - types only)
    if (modulePath === "@lf-widgets/foundations") {
      return {};
    }
    // Fall back to native require for other modules
    return require(modulePath);
  };

  const sandbox = {
    module,
    exports: module.exports,
    require: customRequire,
    __dirname: path.dirname(fullPath),
    __filename: fullPath,
    console,
  };

  vm.runInNewContext(compiled.outputText, sandbox, { filename: fullPath });

  moduleCache.set(fullPath, module.exports);
  return module.exports;
}

function buildFixture(sourceFile, relativeOutFile, transform) {
  const mod = loadTsModule(sourceFile);
  const json = transform(mod);

  const outPath = path.join(OUT_DIR, relativeOutFile);
  ensureDir(path.dirname(outPath));
  fs.writeFileSync(outPath, JSON.stringify(json, null, 2), "utf8");
  console.log(`✓ Generated fixtures at ${outPath}`);
}

//#region Validation
const VALID_CONTROL_TYPES = [
  "checkbox",
  "colorpicker",
  "multiinput",
  "number",
  "select",
  "slider",
  "textfield",
  "toggle",
];

/**
 * Validates a single control configuration.
 * @returns {string[]} Array of error messages (empty if valid)
 */
function validateControl(control, contextPath) {
  const errors = [];
  const prefix = `${contextPath} → control "${control.id || "(no id)"}"`;

  // Required fields
  if (!control.id || typeof control.id !== "string") {
    errors.push(`${prefix}: missing or invalid 'id'`);
  }
  if (!control.type || !VALID_CONTROL_TYPES.includes(control.type)) {
    errors.push(
      `${prefix}: invalid 'type' "${control.type}" (expected: ${VALID_CONTROL_TYPES.join(", ")})`,
    );
  }
  if (!control.label || typeof control.label !== "string") {
    errors.push(`${prefix}: missing or invalid 'label'`);
  }
  if (control.defaultValue === undefined) {
    errors.push(`${prefix}: missing 'defaultValue'`);
  }

  // Type-specific validation
  if (control.type === "slider") {
    if (typeof control.min !== "number") {
      errors.push(`${prefix}: slider requires 'min' (number)`);
    }
    if (typeof control.max !== "number") {
      errors.push(`${prefix}: slider requires 'max' (number)`);
    }
    if (typeof control.step !== "number") {
      errors.push(`${prefix}: slider requires 'step' (number)`);
    }
    if (typeof control.defaultValue !== "number") {
      errors.push(`${prefix}: slider requires numeric 'defaultValue'`);
    }
  }

  if (control.type === "select") {
    if (!Array.isArray(control.options) || control.options.length === 0) {
      errors.push(`${prefix}: select requires non-empty 'options' array`);
    } else {
      control.options.forEach((opt, i) => {
        if (!opt.value || !opt.label) {
          errors.push(
            `${prefix}: select option[${i}] requires 'value' and 'label'`,
          );
        }
      });
    }
  }

  if (control.type === "toggle" || control.type === "checkbox") {
    if (typeof control.defaultValue !== "boolean") {
      errors.push(`${prefix}: ${control.type} requires boolean 'defaultValue'`);
    }
  }

  if (control.type === "textfield" || control.type === "multiinput") {
    if (typeof control.defaultValue !== "string") {
      errors.push(`${prefix}: ${control.type} requires string 'defaultValue'`);
    }
  }

  if (control.type === "colorpicker") {
    if (typeof control.defaultValue !== "string") {
      errors.push(`${prefix}: colorpicker requires string 'defaultValue'`);
    }
    if (control.swatches && !Array.isArray(control.swatches)) {
      errors.push(`${prefix}: colorpicker 'swatches' must be an array`);
    }
  }

  if (control.type === "number") {
    if (typeof control.defaultValue !== "number") {
      errors.push(`${prefix}: number requires numeric 'defaultValue'`);
    }
  }

  return errors;
}

/**
 * Type guard: checks if layout item is a group (has controlIds array).
 */
function isLayoutGroup(item) {
  return item && "controlIds" in item;
}

/**
 * Type guard: checks if layout item is a standalone control (has controlId string).
 */
function isLayoutControl(item) {
  return item && "controlId" in item && !("controlIds" in item);
}

/**
 * Validates that layout items reference existing controls.
 * Supports both groups (accordion sections) and standalone controls.
 * @returns {string[]} Array of error messages (empty if valid)
 */
function validateLayout(layout, controls, contextPath) {
  const errors = [];
  if (!layout) return errors;

  const controlIds = new Set(controls.map((c) => c.id));

  layout.forEach((item, index) => {
    if (isLayoutGroup(item)) {
      // Validate group
      const groupPath = `${contextPath} → layout group "${item.id || "(no id)"}"`;

      if (!item.id) {
        errors.push(`${groupPath}: missing 'id'`);
      }
      if (!item.label) {
        errors.push(`${groupPath}: missing 'label'`);
      }
      if (!Array.isArray(item.controlIds)) {
        errors.push(`${groupPath}: missing or invalid 'controlIds' array`);
      } else {
        item.controlIds.forEach((ctrlId) => {
          if (!controlIds.has(ctrlId)) {
            errors.push(
              `${groupPath}: references unknown control "${ctrlId}" (available: ${[...controlIds].join(", ")})`,
            );
          }
        });
      }
    } else if (isLayoutControl(item)) {
      // Validate standalone control
      const controlPath = `${contextPath} → layout[${index}] standalone control`;

      if (!item.controlId) {
        errors.push(`${controlPath}: missing 'controlId'`);
      } else if (!controlIds.has(item.controlId)) {
        errors.push(
          `${controlPath}: references unknown control "${item.controlId}" (available: ${[...controlIds].join(", ")})`,
        );
      }
    } else {
      // Unknown layout item type
      errors.push(
        `${contextPath} → layout[${index}]: invalid item (expected group with 'controlIds' or standalone with 'controlId')`,
      );
    }
  });

  return errors;
}

/**
 * Validates that defaultSettings keys match control ids.
 * @returns {string[]} Array of error messages (empty if valid)
 */
function validateDefaultSettings(defaultSettings, controls, contextPath) {
  const errors = [];
  if (!defaultSettings) return errors;

  const controlIds = new Set(controls.map((c) => c.id));
  const settingsKeys = Object.keys(defaultSettings);

  settingsKeys.forEach((key) => {
    if (!controlIds.has(key)) {
      // Allow extra keys (runtime-only settings), but warn
      console.log(
        `  ⚠ ${contextPath}: defaultSettings key "${key}" has no matching control (may be intentional)`,
      );
    }
  });

  // Check that all controls have a default in settings
  controls.forEach((ctrl) => {
    if (!(ctrl.id in defaultSettings)) {
      // This is ok if defaultValue is on the control itself
      // Just verify consistency
    }
  });

  return errors;
}

/**
 * Validates a complete DSL configuration.
 * @returns {string[]} Array of error messages (empty if valid)
 */
function validateDsl(dsl, contextPath) {
  const errors = [];

  if (!dsl) {
    errors.push(`${contextPath}: DSL is null or undefined`);
    return errors;
  }

  if (!Array.isArray(dsl.controls)) {
    errors.push(`${contextPath}: missing or invalid 'controls' array`);
    return errors;
  }

  // Validate each control
  dsl.controls.forEach((ctrl) => {
    errors.push(...validateControl(ctrl, contextPath));
  });

  // Validate layout references
  if (dsl.layout) {
    errors.push(...validateLayout(dsl.layout, dsl.controls, contextPath));
  }

  // Validate defaultSettings
  if (dsl.defaultSettings) {
    errors.push(
      ...validateDefaultSettings(
        dsl.defaultSettings,
        dsl.controls,
        contextPath,
      ),
    );
  }

  return errors;
}

/**
 * Runs validation and throws if errors found.
 */
function runValidation(items, getName, getDsl) {
  let totalErrors = 0;

  items.forEach((item) => {
    const name = getName(item);
    const dsl = getDsl(item);
    const errors = validateDsl(dsl, name);

    if (errors.length > 0) {
      console.error(`\n❌ Validation errors in ${name}:`);
      errors.forEach((err) => console.error(`   ${err}`));
      totalErrors += errors.length;
    } else {
      console.log(`  ✓ ${name} valid`);
    }
  });

  if (totalErrors > 0) {
    throw new Error(
      `Fixture validation failed with ${totalErrors} error(s). Fix the issues above.`,
    );
  }
}
//#endregion

function main() {
  console.log("\n📦 Generating shapeeditor fixtures...\n");

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

    // Validate effects
    console.log("\n🔍 Validating effects fixtures...");
    runValidation(
      effects,
      (e) => `Effect "${e.name}"`,
      (e) => e.configDsl || { controls: e.controls },
    );

    return { effects };
  });

  // Image editor family (new modular structure)
  buildFixture("imageEditor/index.ts", "image-editor.json", (mod) => {
    // Import all DSLs from settings
    const {
      // Drawing
      IMAGE_EDITOR_BRUSH_DSL,
      IMAGE_EDITOR_LINE_DSL,
      // Basic Adjustments
      IMAGE_EDITOR_BRIGHTNESS_DSL,
      IMAGE_EDITOR_CLARITY_DSL,
      IMAGE_EDITOR_CONTRAST_DSL,
      IMAGE_EDITOR_DESATURATE_DSL,
      IMAGE_EDITOR_SATURATION_DSL,
      IMAGE_EDITOR_UNSHARP_MASK_DSL,
      IMAGE_EDITOR_RESIZE_EDGE_DSL,
      IMAGE_EDITOR_RESIZE_FREE_DSL,
      // Background
      IMAGE_EDITOR_BACKGROUND_REMOVER_DSL,
      // Creative Effects
      IMAGE_EDITOR_BLEND_DSL,
      IMAGE_EDITOR_BLOOM_DSL,
      IMAGE_EDITOR_FILM_GRAIN_DSL,
      IMAGE_EDITOR_GAUSSIAN_BLUR_DSL,
      IMAGE_EDITOR_SEPIA_DSL,
      IMAGE_EDITOR_SPLIT_TONE_DSL,
      IMAGE_EDITOR_TILT_SHIFT_DSL,
      IMAGE_EDITOR_VIBRANCE_DSL,
      IMAGE_EDITOR_VIGNETTE_DSL,
      // Diffusion
      IMAGE_EDITOR_INPAINT_DSL,
      IMAGE_EDITOR_OUTPAINT_DSL,
      // Datasets
      IMAGE_EDITOR_CANVAS_DATASET,
      IMAGE_EDITOR_SETTINGS_DATASET,
      IMAGE_EDITOR_FILTER_METADATA,
    } = mod;

    // Build comprehensive DSL map
    const dsl = {
      // Drawing
      brush: IMAGE_EDITOR_BRUSH_DSL,
      line: IMAGE_EDITOR_LINE_DSL,
      // Basic Adjustments
      brightness: IMAGE_EDITOR_BRIGHTNESS_DSL,
      clarity: IMAGE_EDITOR_CLARITY_DSL,
      contrast: IMAGE_EDITOR_CONTRAST_DSL,
      desaturate: IMAGE_EDITOR_DESATURATE_DSL,
      saturation: IMAGE_EDITOR_SATURATION_DSL,
      unsharp_mask: IMAGE_EDITOR_UNSHARP_MASK_DSL,
      resize_edge: IMAGE_EDITOR_RESIZE_EDGE_DSL,
      resize_free: IMAGE_EDITOR_RESIZE_FREE_DSL,
      // Background
      background_remover: IMAGE_EDITOR_BACKGROUND_REMOVER_DSL,
      // Creative Effects
      blend: IMAGE_EDITOR_BLEND_DSL,
      bloom: IMAGE_EDITOR_BLOOM_DSL,
      film_grain: IMAGE_EDITOR_FILM_GRAIN_DSL,
      gaussian_blur: IMAGE_EDITOR_GAUSSIAN_BLUR_DSL,
      sepia: IMAGE_EDITOR_SEPIA_DSL,
      split_tone: IMAGE_EDITOR_SPLIT_TONE_DSL,
      tilt_shift: IMAGE_EDITOR_TILT_SHIFT_DSL,
      vibrance: IMAGE_EDITOR_VIBRANCE_DSL,
      vignette: IMAGE_EDITOR_VIGNETTE_DSL,
      // Diffusion
      inpaint: IMAGE_EDITOR_INPAINT_DSL,
      outpaint: IMAGE_EDITOR_OUTPAINT_DSL,
    };

    // Validate all image editor DSLs
    console.log("\n🔍 Validating image editor fixtures...");
    runValidation(
      Object.entries(dsl),
      ([name]) => `ImageEditor "${name}"`,
      ([, config]) => config,
    );

    const canvasDataset =
      typeof IMAGE_EDITOR_CANVAS_DATASET === "function"
        ? IMAGE_EDITOR_CANVAS_DATASET((assetPath) => ({ path: assetPath }))
        : undefined;

    const settingsDataset = IMAGE_EDITOR_SETTINGS_DATASET;
    const filterMetadata = IMAGE_EDITOR_FILTER_METADATA;

    return {
      dsl,
      canvasDataset,
      settingsDataset,
      filterMetadata,
    };
  });

  console.log("\n✅ All fixtures generated and validated successfully!\n");
}

main();
