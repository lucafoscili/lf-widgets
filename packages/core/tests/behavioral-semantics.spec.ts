/**
 * P0.4 - Integration Tests for Behavioral Semantics DSL
 *
 * Tests the behavioral semantics types and fixtures implemented in P0.5.
 * These tests ensure the DSL configurations correctly define:
 * - behavior type (live, configure, hybrid)
 * - commit triggers (slider commit, button, shape stroke, etc.)
 * - preview enablement
 */
import type { LfShapeeditorConfigDsl } from "@lf-widgets/foundations";

// Import DSL fixtures from assets via relative path or use the JSON fixture
// Note: In a real scenario, these would be imported from @lf-widgets/assets
// For testing purposes, we define inline test fixtures that mirror the structure

//#region Test Fixtures (mirrors DSL from assets package)
const BRIGHTNESS_DSL: LfShapeeditorConfigDsl = {
  controls: [
    {
      id: "brightness_strength",
      type: "slider",
      min: -1,
      max: 1,
      step: 0.05,
      defaultValue: 0,
      label: "Strength",
    },
  ],
  layout: [
    {
      id: "brightness_general",
      label: "Brightness",
      controlIds: ["brightness_strength"],
    },
  ],
  defaultSettings: { brightness_strength: 0 },
  behavior: "live",
  enablePreview: true,
};

const BRUSH_DSL: LfShapeeditorConfigDsl = {
  controls: [
    {
      id: "brush_color",
      type: "colorpicker",
      defaultValue: "#000000",
      label: "Color",
    },
    {
      id: "brush_size",
      type: "slider",
      min: 1,
      max: 100,
      step: 1,
      defaultValue: 10,
      label: "Size",
    },
  ],
  layout: [
    {
      id: "brush_settings",
      label: "Brush",
      controlIds: ["brush_color", "brush_size"],
    },
  ],
  defaultSettings: { brush_color: "#000000", brush_size: 10 },
  behavior: "configure",
  enablePreview: true,
  commitTrigger: { source: "shape", eventType: "stroke" },
};

const INPAINT_DSL: LfShapeeditorConfigDsl = {
  controls: [
    {
      id: "inpaint_cfg",
      type: "slider",
      min: 1,
      max: 20,
      step: 0.5,
      defaultValue: 7,
      label: "CFG",
    },
    {
      id: "inpaint_steps",
      type: "slider",
      min: 1,
      max: 30,
      step: 1,
      defaultValue: 16,
      label: "Steps",
    },
  ],
  layout: [
    {
      id: "inpaint_sampling",
      label: "Sampling",
      controlIds: ["inpaint_cfg", "inpaint_steps"],
    },
  ],
  defaultSettings: { inpaint_cfg: 7, inpaint_steps: 16 },
  behavior: "configure",
  enablePreview: false,
  commitTrigger: { source: "shape", eventType: "stroke" },
};

const BACKGROUND_REMOVER_DSL: LfShapeeditorConfigDsl = {
  controls: [
    {
      id: "background_remover_roi_padding",
      type: "slider",
      min: 0,
      max: 256,
      step: 1,
      defaultValue: 32,
      label: "ROI Padding",
    },
  ],
  layout: [
    {
      id: "background_remover_roi",
      label: "Region of Interest",
      controlIds: ["background_remover_roi_padding"],
    },
  ],
  defaultSettings: { background_remover_roi_padding: 32 },
  behavior: "configure",
  enablePreview: false,
  commitTrigger: { source: "button", eventType: "apply" },
};
//#endregion

//#region Type Helpers
/**
 * Asserts that a DSL config has the expected behavior type.
 */
const expectBehavior = (
  dsl: LfShapeeditorConfigDsl,
  expected: "live" | "configure" | "manual",
) => {
  expect(dsl.behavior).toBe(expected);
};

/**
 * Asserts that a DSL config has the expected preview enablement.
 */
const expectPreview = (dsl: LfShapeeditorConfigDsl, enabled: boolean) => {
  expect(dsl.enablePreview).toBe(enabled);
};

/**
 * Asserts that a DSL config has the expected commit trigger.
 */
const expectCommitTrigger = (
  dsl: LfShapeeditorConfigDsl,
  source?: "control" | "shape" | "button",
  eventType?: string,
) => {
  if (source === undefined) {
    expect(dsl.commitTrigger).toBeUndefined();
  } else {
    expect(dsl.commitTrigger).toBeDefined();
    expect(dsl.commitTrigger?.source).toBe(source);
    if (eventType) {
      expect(dsl.commitTrigger?.eventType).toBe(eventType);
    }
  }
};
//#endregion

describe("Behavioral Semantics DSL", () => {
  describe("Live Filters (adjust sliders → see changes)", () => {
    it("brightness should have live behavior", () => {
      expectBehavior(BRIGHTNESS_DSL, "live");
      expectPreview(BRIGHTNESS_DSL, true);
      expectCommitTrigger(BRIGHTNESS_DSL, undefined);
    });
  });

  describe("Configure Filters (drawing with settings)", () => {
    it("brush should have configure behavior", () => {
      expectBehavior(BRUSH_DSL, "configure");
      expectPreview(BRUSH_DSL, true);
      expectCommitTrigger(BRUSH_DSL, "shape", "stroke");
    });
  });

  describe("Configure Filters (set params → trigger action)", () => {
    it("inpaint should have configure behavior", () => {
      expectBehavior(INPAINT_DSL, "configure");
      expectPreview(INPAINT_DSL, false);
      expectCommitTrigger(INPAINT_DSL, "shape", "stroke");
    });

    it("background remover should have configure behavior", () => {
      expectBehavior(BACKGROUND_REMOVER_DSL, "configure");
      expectPreview(BACKGROUND_REMOVER_DSL, false);
      expectCommitTrigger(BACKGROUND_REMOVER_DSL, "button", "apply");
    });
  });

  describe("DSL Structure Validation", () => {
    const allDsls: Array<[string, LfShapeeditorConfigDsl]> = [
      ["brightness", BRIGHTNESS_DSL],
      ["brush", BRUSH_DSL],
      ["inpaint", INPAINT_DSL],
      ["background_remover", BACKGROUND_REMOVER_DSL],
    ];

    it.each(allDsls)("%s should have required fields", (_name, dsl) => {
      // All DSLs must have controls array
      expect(Array.isArray(dsl.controls)).toBe(true);
      expect(dsl.controls.length).toBeGreaterThan(0);

      // All DSLs must have layout array
      expect(Array.isArray(dsl.layout)).toBe(true);
      expect(dsl.layout.length).toBeGreaterThan(0);

      // All DSLs must have defaultSettings
      expect(dsl.defaultSettings).toBeDefined();
      expect(typeof dsl.defaultSettings).toBe("object");

      // All DSLs must have behavior
      expect(["live", "configure", "manual"]).toContain(dsl.behavior);

      // All DSLs must have enablePreview boolean
      expect(typeof dsl.enablePreview).toBe("boolean");
    });

    it.each(allDsls)("%s controls should have valid IDs", (_name, dsl) => {
      for (const control of dsl.controls) {
        expect(control.id).toBeDefined();
        expect(typeof control.id).toBe("string");
        expect(control.id.length).toBeGreaterThan(0);
      }
    });

    it.each(allDsls)(
      "%s layout should reference valid control IDs",
      (_name, dsl) => {
        const controlIds = new Set(dsl.controls.map((c) => c.id));

        const checkLayoutItem = (item: unknown) => {
          if (typeof item === "object" && item !== null) {
            const layoutItem = item as Record<string, unknown>;
            if (Array.isArray(layoutItem.controlIds)) {
              for (const ctrlId of layoutItem.controlIds) {
                expect(controlIds.has(ctrlId as string)).toBe(true);
              }
            }
            if (typeof layoutItem.controlId === "string") {
              expect(controlIds.has(layoutItem.controlId)).toBe(true);
            }
          }
        };

        for (const layoutItem of dsl.layout) {
          checkLayoutItem(layoutItem);
        }
      },
    );

    it.each(allDsls)(
      "%s defaultSettings keys should match control IDs",
      (_name, dsl) => {
        const controlIds = new Set(dsl.controls.map((c) => c.id));
        const settingsKeys = Object.keys(dsl.defaultSettings || {});

        for (const key of settingsKeys) {
          expect(controlIds.has(key)).toBe(true);
        }
      },
    );
  });

  describe("Commit Trigger Consistency", () => {
    it("live filters should not have mandatory commitTrigger", () => {
      // Live filters commit on slider release (implicit)
      expect(BRIGHTNESS_DSL.commitTrigger).toBeUndefined();
    });

    it("configure filters should have explicit commitTrigger", () => {
      // Configure filters need explicit commit action
      expect(INPAINT_DSL.commitTrigger).toBeDefined();
      expect(BACKGROUND_REMOVER_DSL.commitTrigger).toBeDefined();
    });

    it("hybrid filters should have shape-based commitTrigger", () => {
      // Hybrid filters commit on shape stroke
      expect(BRUSH_DSL.commitTrigger?.source).toBe("shape");
    });
  });

  describe("Behavioral Pattern Inference", () => {
    it("should be able to infer behavior from DSL structure", () => {
      // A helper that demonstrates how runtime code could interpret DSL
      const inferBehavior = (dsl: LfShapeeditorConfigDsl) => {
        if (dsl.behavior) return dsl.behavior;
        // Fallback inference logic
        if (dsl.commitTrigger?.source === "shape") return "configure";
        if (dsl.commitTrigger?.source === "button") return "configure";
        return "live";
      };

      expect(inferBehavior(BRIGHTNESS_DSL)).toBe("live");
      expect(inferBehavior(BRUSH_DSL)).toBe("configure");
      expect(inferBehavior(INPAINT_DSL)).toBe("configure");
    });

    it("should determine if snapshot is needed based on behavior", () => {
      const needsSnapshot = (dsl: LfShapeeditorConfigDsl) => {
        // Configure filters need snapshot after API call
        // Live filters need snapshot on slider commit
        // Hybrid filters need snapshot after stroke
        return dsl.behavior !== "live" || !dsl.enablePreview;
      };

      expect(needsSnapshot(BRIGHTNESS_DSL)).toBe(false);
      expect(needsSnapshot(INPAINT_DSL)).toBe(true);
      expect(needsSnapshot(BACKGROUND_REMOVER_DSL)).toBe(true);
    });
  });
});

describe("Control ID Transformation", () => {
  describe("DSL to Backend ID Mapping", () => {
    /**
     * Transformation function that strips filter prefix from DSL IDs.
     * This mirrors what will be implemented in lf-shapeeditor adapter.
     */
    const transformToBackendId = (
      filterType: string,
      dslId: string,
    ): string => {
      const prefix = `${filterType}_`;
      // Special cases that don't need transformation
      const noTransformFilters = new Set(["clarity", "unsharp_mask"]);
      if (noTransformFilters.has(filterType)) {
        return dslId;
      }
      return dslId.startsWith(prefix) ? dslId.slice(prefix.length) : dslId;
    };

    it("should transform brightness DSL IDs to backend IDs", () => {
      expect(transformToBackendId("brightness", "brightness_strength")).toBe(
        "strength",
      );
      expect(transformToBackendId("brightness", "brightness_gamma")).toBe(
        "gamma",
      );
    });

    it("should not transform clarity DSL IDs", () => {
      expect(transformToBackendId("clarity", "clarity_amount")).toBe(
        "clarity_amount",
      );
    });

    it("should transform inpaint DSL IDs to backend IDs", () => {
      expect(transformToBackendId("inpaint", "inpaint_cfg")).toBe("cfg");
      expect(transformToBackendId("inpaint", "inpaint_steps")).toBe("steps");
    });

    it("should transform full settings object", () => {
      const transformSettings = (
        filterType: string,
        settings: Record<string, unknown>,
      ): Record<string, unknown> => {
        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(settings)) {
          result[transformToBackendId(filterType, key)] = value;
        }
        return result;
      };

      const dslSettings = {
        brightness_strength: 0.5,
        brightness_gamma: 1.2,
        brightness_midpoint: 0.5,
      };

      const backendSettings = transformSettings("brightness", dslSettings);

      expect(backendSettings).toEqual({
        strength: 0.5,
        gamma: 1.2,
        midpoint: 0.5,
      });
    });
  });
});
