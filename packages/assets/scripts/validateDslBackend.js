/**
 * P0.3 - DSL Control ID vs Backend API Contract Validation
 *
 * This script validates that DSL control IDs can be correctly mapped
 * to backend API expectations. It identifies:
 * 1. Control ID naming convention differences
 * 2. Missing controls in DSL vs legacy
 * 3. Required transformations for API calls
 *
 * Run with: node packages/assets/scripts/validateDslBackend.js
 */

const fs = require("fs");
const path = require("path");

//#region Configuration
/**
 * Backend expects these exact control IDs in API request payloads.
 * Source: docs/web/src/types/widgets/imageEditor.ts (Settings interfaces)
 */
const BACKEND_EXPECTED_IDS = {
  brightness: ["strength", "gamma", "localized", "midpoint"],
  contrast: ["strength", "localized", "midpoint"],
  saturation: ["intensity"],
  desaturate: ["strength", "r_channel", "g_channel", "b_channel"],
  clarity: ["clarity_amount"],
  unsharp_mask: [
    "unsharp_amount",
    "unsharp_radius",
    "unsharp_threshold",
    "unsharp_protect_skin",
  ],
  resize_edge: ["size_px", "resize_method", "longest_edge"],
  resize_free: ["width", "height", "resize_mode", "pad_color"],
  background_remover: [
    "roi_auto",
    "roi_padding",
    "roi_min_size",
    "roi_align",
    "roi_align_auto",
  ],
  blend: ["amount", "color", "opacity"],
  bloom: ["threshold", "radius", "intensity", "tint"],
  film_grain: ["intensity", "size", "tint", "soft_blend"],
  gaussian_blur: ["blur_kernel_size", "blur_sigma"],
  sepia: ["strength"],
  split_tone: ["shadows", "highlights", "balance"],
  tilt_shift: [
    "blur_kernel_size",
    "blur_sigma",
    "focus_position",
    "focus_size",
    "vertical",
    "softness",
  ],
  vibrance: ["strength", "protect_skin"],
  vignette: ["strength", "radius", "softness"],
  brush: ["b64_canvas", "color", "opacity", "size"],
  line: ["b64_canvas", "color", "opacity", "size"],
  inpaint: [
    "apply_unsharp_mask",
    "b64_canvas",
    "cfg",
    "conditioning_mix",
    "denoise_percentage",
    "dilate",
    "feather",
    "negative_prompt",
    "positive_prompt",
    "roi_align",
    "roi_align_auto",
    "roi_min_size",
    "roi_padding",
    "sampler",
    "scheduler",
    "seed",
    "steps",
    "upsample_target",
    "wd14_tagging",
  ],
  outpaint: [
    "apply_unsharp_mask",
    "b64_canvas",
    "cfg",
    "conditioning_mix",
    "denoise_percentage",
    "dilate",
    "feather",
    "negative_prompt",
    "outpaint_amount",
    "positive_prompt",
    "roi_align",
    "roi_align_auto",
    "roi_min_size",
    "roi_padding",
    "sampler",
    "scheduler",
    "seed",
    "steps",
    "upsample_target",
    "wd14_tagging",
  ],
};

/**
 * DSL control ID patterns (prefixed with filter name).
 * Source: packages/assets/src/fixtures/shapeeditor/imageEditor/settings/
 *
 * Note: Some controls use backend IDs directly without prefix (e.g., clarity_amount)
 * because the backend expects those exact IDs.
 */
const DSL_PREFIXED_PATTERNS = {
  brightness: [
    "brightness_strength",
    "brightness_gamma",
    "brightness_localized",
    "brightness_midpoint",
  ],
  contrast: ["contrast_strength", "contrast_localized", "contrast_midpoint"],
  saturation: ["saturation_intensity"],
  desaturate: [
    "desaturate_strength",
    "desaturate_r_channel",
    "desaturate_g_channel",
    "desaturate_b_channel",
  ],
  // clarity_amount is the exact backend ID (no transformation needed)
  clarity: ["clarity_amount"],
  unsharp_mask: [
    "unsharp_amount",
    "unsharp_radius",
    "unsharp_threshold",
    "unsharp_protect_skin",
  ],
  resize_edge: [
    "resize_edge_size_px",
    "resize_edge_method",
    "resize_edge_longest_edge",
  ],
  resize_free: [
    "resize_free_width",
    "resize_free_height",
    "resize_free_mode",
    "resize_free_pad_color",
  ],
  background_remover: [
    "background_remover_roi_auto",
    "background_remover_roi_padding",
    "background_remover_roi_min_size",
    "background_remover_roi_align",
    "background_remover_roi_align_auto",
  ],
  blend: ["blend_amount", "blend_color", "blend_opacity"],
  bloom: ["bloom_threshold", "bloom_radius", "bloom_intensity", "bloom_tint"],
  film_grain: [
    "film_grain_intensity",
    "film_grain_size",
    "film_grain_tint",
    "film_grain_soft_blend",
  ],
  gaussian_blur: ["gaussian_blur_kernel_size", "gaussian_blur_sigma"],
  sepia: ["sepia_strength"],
  split_tone: [
    "split_tone_shadows",
    "split_tone_highlights",
    "split_tone_balance",
  ],
  tilt_shift: [
    "tilt_shift_blur_kernel_size",
    "tilt_shift_blur_sigma",
    "tilt_shift_focus_position",
    "tilt_shift_focus_size",
    "tilt_shift_vertical",
    "tilt_shift_softness",
  ],
  vibrance: ["vibrance_strength", "vibrance_protect_skin"],
  vignette: ["vignette_strength", "vignette_radius", "vignette_softness"],
  brush: ["brush_color", "brush_opacity", "brush_size"],
  line: ["line_color", "line_opacity", "line_size"],
  // Inpaint DSL controls use camelCase format; normalize during mapping
  inpaint: [
    "inpaint_cfg",
    "inpaint_steps",
    "inpaint_denoisePercentage",
    "inpaint_seed",
    "inpaint_positivePrompt",
    "inpaint_negativePrompt",
    "inpaint_sampler",
    "inpaint_scheduler",
    "inpaint_dilate",
    "inpaint_feather",
    "inpaint_roiPadding",
    "inpaint_roiMinSize",
    "inpaint_roiAlign",
    "inpaint_roiAlignAuto",
    "inpaint_conditioningMix",
    "inpaint_applyUnsharpMask",
    "inpaint_upsampleTarget",
    "inpaint_wd14Tagging",
  ],
  // Outpaint DSL controls
  outpaint: [
    "outpaint_cfg",
    "outpaint_steps",
    "outpaint_denoisePercentage",
    "outpaint_seed",
    "outpaint_positivePrompt",
    "outpaint_negativePrompt",
    "outpaint_sampler",
    "outpaint_scheduler",
    "outpaint_outpaintAmount",
    "outpaint_dilate",
    "outpaint_feather",
    "outpaint_roiPadding",
    "outpaint_roiMinSize",
    "outpaint_roiAlign",
    "outpaint_roiAlignAuto",
    "outpaint_conditioningMix",
    "outpaint_applyUnsharpMask",
    "outpaint_upsampleTarget",
    "outpaint_wd14Tagging",
  ],
};
//#endregion

//#region Transformation Functions
/**
 * Creates a mapping from DSL prefixed IDs to backend expected IDs.
 * Strategy: Strip the filter prefix to get backend key.
 *
 * @example
 * "brightness_strength" -> "strength"
 * "brightness_gamma" -> "gamma"
 * Special case: "clarity_amount" -> "clarity_amount" (no prefix strip)
 */
function createDslToBackendMapping(filterType) {
  const mapping = {};
  const dslIds = DSL_PREFIXED_PATTERNS[filterType] || [];
  const backendIds = BACKEND_EXPECTED_IDS[filterType] || [];
  const prefix = `${filterType}_`;

  // Special filters where DSL IDs match backend exactly (no prefix stripping)
  const noTransformFilters = new Set(["clarity", "unsharp_mask"]);

  for (const dslId of dslIds) {
    if (noTransformFilters.has(filterType)) {
      // DSL ID is the backend key directly
      mapping[dslId] = dslId;
    } else {
      // Remove prefix to get backend key
      const backendKey = dslId.startsWith(prefix)
        ? dslId.slice(prefix.length)
        : dslId;

      // Handle special cases where DSL and backend naming differ
      mapping[dslId] = normalizeBackendKey(filterType, backendKey);
    }
  }

  return mapping;
}

/**
 * Converts camelCase to snake_case.
 * @example "denoisePercentage" -> "denoise_percentage"
 */
function camelToSnake(str) {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

/**
 * Normalizes DSL control names to backend expected names.
 * Handles edge cases where naming conventions differ.
 */
function normalizeBackendKey(filterType, key) {
  // First, convert camelCase to snake_case for inpaint/outpaint
  if (filterType === "inpaint" || filterType === "outpaint") {
    const snakeKey = camelToSnake(key);
    // Handle specific mappings
    const inpaintMappings = {
      wd14_tagging: "wd14_tagging",
      roi_auto: "roi_auto", // Not in inpaint DSL but keeping for reference
    };
    return inpaintMappings[snakeKey] || snakeKey;
  }

  const normalizations = {
    // clarity_amount is already the backend key (no transformation)
    clarity: {
      clarity_amount: "clarity_amount",
    },
    resize_edge: {
      method: "resize_method",
    },
    resize_free: {
      mode: "resize_mode",
    },
    gaussian_blur: {
      kernel_size: "blur_kernel_size",
      sigma: "blur_sigma",
    },
    tilt_shift: {
      kernel_size: "blur_kernel_size",
      sigma: "blur_sigma",
    },
  };

  return normalizations[filterType]?.[key] || key;
}

/**
 * Transforms DSL settings object to backend API payload.
 */
function transformSettingsForBackend(filterType, dslSettings) {
  const mapping = createDslToBackendMapping(filterType);
  const backendPayload = {};

  for (const [dslKey, value] of Object.entries(dslSettings)) {
    const backendKey = mapping[dslKey] || dslKey;
    backendPayload[backendKey] = value;
  }

  return backendPayload;
}
//#endregion

//#region Validation
/**
 * Validates DSL control IDs against backend expectations.
 */
function validateFilter(filterType) {
  const results = {
    filterType,
    status: "pass",
    issues: [],
    mappings: {},
    missingInDsl: [],
    missingInBackend: [],
    transformationRequired: false,
  };

  const backendIds = new Set(BACKEND_EXPECTED_IDS[filterType] || []);
  const dslIds = DSL_PREFIXED_PATTERNS[filterType] || [];
  const mapping = createDslToBackendMapping(filterType);

  // Check each DSL ID maps to a backend ID
  const mappedBackendIds = new Set();
  for (const dslId of dslIds) {
    const backendKey = mapping[dslId];
    results.mappings[dslId] = backendKey;

    if (backendIds.has(backendKey)) {
      mappedBackendIds.add(backendKey);
    } else {
      // Check if it's a canvas control (special case)
      if (!dslId.includes("b64_canvas")) {
        results.issues.push(
          `DSL '${dslId}' maps to '${backendKey}' which is not in backend expected IDs`,
        );
      }
    }

    // Check if transformation is required (prefixed vs unprefixed)
    if (dslId !== backendKey) {
      results.transformationRequired = true;
    }
  }

  // Find backend IDs not covered by DSL
  for (const backendId of backendIds) {
    if (!mappedBackendIds.has(backendId)) {
      // Skip canvas controls as they're handled separately
      if (backendId !== "b64_canvas") {
        results.missingInDsl.push(backendId);
      }
    }
  }

  // Update status
  if (results.issues.length > 0 || results.missingInDsl.length > 0) {
    results.status = "warning";
  }

  return results;
}

/**
 * Runs full validation suite.
 */
function runValidation() {
  console.log(
    "═══════════════════════════════════════════════════════════════",
  );
  console.log(" P0.3 - DSL Control ID vs Backend API Contract Validation");
  console.log(
    "═══════════════════════════════════════════════════════════════\n",
  );

  const allFilters = Object.keys(BACKEND_EXPECTED_IDS);
  const results = [];
  let passCount = 0;
  let warnCount = 0;

  for (const filterType of allFilters) {
    const result = validateFilter(filterType);
    results.push(result);

    if (result.status === "pass") passCount++;
    else warnCount++;
  }

  // Summary
  console.log("SUMMARY");
  console.log(
    "───────────────────────────────────────────────────────────────",
  );
  console.log(`Total filters: ${allFilters.length}`);
  console.log(`  ✓ Pass: ${passCount}`);
  console.log(`  ⚠ Warnings: ${warnCount}`);
  console.log("");

  // Transformation requirement
  const needsTransform = results.filter((r) => r.transformationRequired);
  console.log("\nTRANSFORMATION REQUIRED");
  console.log(
    "───────────────────────────────────────────────────────────────",
  );
  console.log(
    `${needsTransform.length}/${allFilters.length} filters require ID transformation`,
  );
  console.log("\nReason: DSL uses prefixed IDs (e.g., 'brightness_strength')");
  console.log("        Backend expects unprefixed IDs (e.g., 'strength')");
  console.log("");

  // Detailed results
  console.log("\nDETAILED RESULTS");
  console.log(
    "───────────────────────────────────────────────────────────────",
  );
  for (const result of results) {
    const icon = result.status === "pass" ? "✓" : "⚠";
    const transform = result.transformationRequired ? " [TRANSFORM]" : "";
    console.log(`\n${icon} ${result.filterType}${transform}`);

    if (result.missingInDsl.length > 0) {
      console.log(`  Missing in DSL: ${result.missingInDsl.join(", ")}`);
    }

    if (result.issues.length > 0) {
      for (const issue of result.issues) {
        console.log(`  Issue: ${issue}`);
      }
    }

    // Show sample mapping
    const mappingEntries = Object.entries(result.mappings).slice(0, 3);
    if (mappingEntries.length > 0) {
      console.log(`  Sample mappings:`);
      for (const [dsl, backend] of mappingEntries) {
        console.log(`    ${dsl} → ${backend}`);
      }
    }
  }

  // Recommendations
  console.log("\n\nRECOMMENDATIONS");
  console.log(
    "═══════════════════════════════════════════════════════════════",
  );
  console.log(`
1. TRANSFORMATION LAYER REQUIRED
   The lf-shapeeditor component must transform settings before API calls:

   // In lf-shapeeditor or adapter
   const backendSettings = transformSettingsForBackend(filterType, dslSettings);

2. OPTION A: Keep DSL prefixed IDs (RECOMMENDED)
   - Pros: Unique IDs prevent collisions, clear context
   - Cons: Requires transformation layer
   - Implementation: Add transformSettingsForBackend() to adapter

3. OPTION B: Change DSL to use backend IDs directly
   - Pros: No transformation needed
   - Cons: ID collision risk, loses filter context in settings
   - Would require significant DSL fixture changes

4. IMPLEMENTATION EXAMPLE:
   \`\`\`typescript
   // In lf-shapeeditor-adapter.ts or similar
   export const transformSettingsForBackend = (
     filterType: string,
     settings: Record<string, unknown>
   ): Record<string, unknown> => {
     const prefix = \`\${filterType}_\`;
     const result: Record<string, unknown> = {};
     
     for (const [key, value] of Object.entries(settings)) {
       const backendKey = key.startsWith(prefix)
         ? key.slice(prefix.length)
         : key;
       result[backendKey] = value;
     }
     
     return result;
   };
   \`\`\`
`);

  return results;
}
//#endregion

// Run validation
runValidation();
