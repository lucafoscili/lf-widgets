import {
  CY_ATTRIBUTES,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfShapeeditorEvent,
} from "@lf-widgets/foundations";
import { getShapeeditorFixtures } from "../../../src/components/lf-showcase/assets/data/shapeeditor";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const shapeeditorName: LfComponentName = "LfShapeeditor";
const shapeeditorTag: LfComponentTag<typeof shapeeditorName> = "lf-shapeeditor";
const shapeeditor = shapeeditorTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(shapeeditor).waitForWebComponents([shapeeditorTag, "lf-image"]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${shapeeditorTag}> exist.`, () => {
    const fixtures = getShapeeditorFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(shapeeditorTag, new Set(keys));
  });
});
//#endregion

//#region
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check, shape } = CY_ATTRIBUTES;

  it(`lf-event`, () => {
    cy.navigate(shapeeditor);
    const eventType: LfShapeeditorEvent = "lf-event";
    cy.checkEvent(shapeeditor, eventType);
    // Click on a shape item in the masonry to trigger lf-event
    // Use force:true because canvas elements may have pointer-events:none
    cy.get(eventElement)
      .findCyElement(shape)
      .first()
      .scrollIntoView()
      .click({ force: true });
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(shapeeditor);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(shapeeditor);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(shapeeditor);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(shapeeditorTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(shapeeditorTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(shapeeditorTag, shapeeditorName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(shapeeditor);
  });
  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion

//#region e2e
describe(CY_CATEGORIES.e2e, () => {
  const { shape, toggle } = CY_ATTRIBUTES;

  const playgroundId = `#${shapeeditorTag}-playground`;

  beforeEach(() => {
    cy.navigate(shapeeditor);
    cy.waitForWebComponents([
      shapeeditorTag,
      "lf-image",
      "lf-tree",
      "lf-canvas",
      "lf-slider",
      "lf-accordion",
    ]);
    cy.get(playgroundId).as("shapeeditor");
  });

  describe("Canvas Overflow Prevention", () => {
    it("should contain canvas within preview bounds after selecting a shape", () => {
      // Click on a shape to load it into preview (use force for pointer-events:none)
      cy.get("@shapeeditor")
        .findCyElement(shape)
        .first()
        .scrollIntoView()
        .click({ force: true });

      // Wait for canvas to be rendered in the preview
      cy.get("@shapeeditor")
        .find(".preview lf-canvas")
        .should("exist")
        .then(($canvas) => {
          // Get the preview container
          const previewContainer = $canvas.closest(".preview");

          if (previewContainer.length) {
            const previewRect = previewContainer[0].getBoundingClientRect();
            const canvasRect = $canvas[0].getBoundingClientRect();

            // Canvas should not exceed preview container bounds
            expect(canvasRect.right).to.be.at.most(
              previewRect.right + 1,
              "Canvas should not overflow horizontally",
            );
            expect(canvasRect.bottom).to.be.at.most(
              previewRect.bottom + 1,
              "Canvas should not overflow vertically",
            );
          }
        });
    });

    it("should properly apply boxing (letterbox/pillarbox) without overflow", () => {
      // Click on a shape to load it into preview
      cy.get("@shapeeditor")
        .findCyElement(shape)
        .first()
        .scrollIntoView()
        .click({ force: true });

      // Wait for canvas and check boxing attribute
      cy.get("@shapeeditor")
        .find(".preview lf-canvas")
        .should("exist")
        .should("have.attr", "data-boxing")
        .and("match", /^(letterbox|pillarbox)$/);
    });

    it("should maintain canvas containment on window resize", () => {
      // Click on a shape to load it into preview
      cy.get("@shapeeditor")
        .findCyElement(shape)
        .first()
        .scrollIntoView()
        .click({ force: true });

      // Wait for canvas
      cy.get("@shapeeditor").find(".preview lf-canvas").should("exist");

      // Resize viewport
      cy.viewport(800, 600);

      // Wait for resize to settle
      cy.wait(500);

      // Verify canvas is still contained
      cy.get("@shapeeditor")
        .find(".preview lf-canvas")
        .then(($canvas) => {
          const previewContainer = $canvas.closest(".preview");

          if (previewContainer.length) {
            const previewRect = previewContainer[0].getBoundingClientRect();
            const canvasRect = $canvas[0].getBoundingClientRect();

            expect(canvasRect.right).to.be.at.most(
              previewRect.right + 1,
              "Canvas should remain contained after resize",
            );
            expect(canvasRect.bottom).to.be.at.most(
              previewRect.bottom + 1,
              "Canvas should remain contained after resize",
            );
          }
        });

      // Reset viewport
      cy.viewport(1280, 720);
    });

    it("should not cause infinite resize loop (no performance degradation)", () => {
      // Click on a shape to load it into preview
      cy.get("@shapeeditor")
        .findCyElement(shape)
        .first()
        .scrollIntoView()
        .click({ force: true });

      // Wait for canvas
      cy.get("@shapeeditor").find(".preview lf-canvas").should("exist");

      // Record initial time
      const startTime = Date.now();

      // Wait a reasonable amount of time - if there's an infinite loop,
      // the browser would become unresponsive or slow
      cy.wait(1000);

      // Verify we can still interact with the page (no infinite loop blocking)
      cy.get("@shapeeditor")
        .find(".preview lf-canvas")
        .should("be.visible")
        .then(() => {
          const elapsed = Date.now() - startTime;
          // If it takes much longer than expected, there might be a loop
          expect(elapsed).to.be.lessThan(
            3000,
            "Page should remain responsive (no resize loop)",
          );
        });
    });
  });

  describe("Behavioral Event Handling (Image Editor)", () => {
    /**
     * Tests for the three behavioral patterns:
     * - live: Preview on drag, commit on release
     * - configure: Settings are config, stroke triggers commit
     * - manual: No preview, explicit Apply button required
     */

    it("should show Apply button for manual behavior filters (resize, background_remover)", () => {
      // First select an image from the masonry to enable controls
      cy.get("@shapeeditor")
        .findCyElement(shape)
        .first()
        .scrollIntoView()
        .click({ force: true });

      cy.get("@shapeeditor")
        .find("lf-tree")
        .contains("Resize (by edge)")
        .click({ force: true });

      // Wait for controls to render and check Apply button is visible
      cy.get("@shapeeditor")
        .find("#control-actions-apply")
        .should("exist")
        .and("be.visible");
    });

    it("should hide Apply button for live behavior filters (brightness, contrast)", () => {
      // Select an image first
      cy.get("@shapeeditor")
        .findCyElement(shape)
        .first()
        .scrollIntoView()
        .click({ force: true });

      cy.get("@shapeeditor")
        .find("lf-tree")
        .contains("Brightness")
        .click({ force: true });

      // Apply button should not exist for live filters (showApplyButton defaults to false)
      cy.get("@shapeeditor").find("#control-actions-apply").should("not.exist");

      // Reset button should still be visible
      cy.get("@shapeeditor").find("#control-actions-reset").should("exist");
    });

    it("should emit change event and create snapshot for live filter on slider release", () => {
      // Select an image
      cy.get("@shapeeditor")
        .findCyElement(shape)
        .first()
        .scrollIntoView()
        .click({ force: true });

      cy.get("@shapeeditor")
        .find("lf-tree")
        .contains("Brightness")
        .click({ force: true });

      // Wait for controls to render
      cy.get("@shapeeditor").find("lf-accordion").should("exist");

      // Get initial history count
      cy.get("@shapeeditor")
        .findCyElement(shape)
        .findCyElement(toggle)
        .invoke("text")
        .then((initialHistory) => {
          const initialCount = parseInt(initialHistory.split("/")[0], 10);

          // Find and interact with the brightness slider
          cy.get("@shapeeditor")
            .find("lf-slider")
            .first()
            .find("input[type='range']")
            .then(($slider) => {
              // Trigger input (drag) and change (release) events
              $slider.val(0.5);
              $slider[0].dispatchEvent(new Event("input", { bubbles: true }));
              $slider[0].dispatchEvent(new Event("change", { bubbles: true }));
            });

          // Wait for snapshot to be created
          cy.wait(1500);

          // Verify history count increased
          cy.get("@shapeeditor")
            .findCyElement(toggle)
            .invoke("text")
            .then((newHistory) => {
              const newCount = parseInt(newHistory.split("/")[0], 10);
              expect(newCount).to.be.greaterThan(initialCount);
            });
        });
    });

    it("should show Reset button and reset controls when clicked", () => {
      // Select a canvas and filter
      cy.get("@shapeeditor")
        .findCyElement(shape)
        .first()
        .scrollIntoView()
        .click({ force: true });

      cy.get("@shapeeditor")
        .find("lf-tree")
        .contains("Contrast")
        .click({ force: true });

      // Wait for controls
      cy.get("@shapeeditor").find("lf-accordion").should("exist");

      // Change slider value
      cy.get("@shapeeditor")
        .find("lf-slider")
        .first()
        .find("input[type='range']")
        .then(($slider) => {
          $slider.val(0.8);
          $slider[0].dispatchEvent(new Event("input", { bubbles: true }));
        });

      // Click Reset button
      cy.get("@shapeeditor")
        .find("#control-actions-reset")
        .click({ force: true });

      // Should see snackbar with reset message
      cy.get("@shapeeditor")
        .find("lf-snackbar")
        .should("contain.text", "reset");
    });

    it("should show progressbar during Apply operation for manual filters", () => {
      // Select a canvas
      cy.get("@shapeeditor")
        .findCyElement(shape)
        .first()
        .scrollIntoView()
        .click({ force: true });

      cy.get("@shapeeditor")
        .find("lf-tree")
        .contains("Resize (by edge)")
        .click({ force: true });

      // Wait for controls
      cy.get("@shapeeditor").find("lf-accordion").should("exist");

      // Click Apply button
      cy.get("@shapeeditor")
        .find("#control-actions-apply")
        .click({ force: true });

      // Progressbar should become visible
      cy.get("@shapeeditor").find("lf-progressbar").should("be.visible");

      // Wait for operation to complete and snackbar to show
      cy.get("@shapeeditor")
        .find("lf-snackbar")
        .should("contain.text", "Applied");
    });
  });
});
//#endregion
