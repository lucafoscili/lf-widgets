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

//#region Canvas Overflow Prevention
describe("Canvas Overflow Prevention", () => {
  const { shape } = CY_ATTRIBUTES;

  // The canvas shapeeditor example ID
  const canvasShapeeditorId = "#uncategorized-canvasSimple";

  beforeEach(() => {
    cy.navigate(shapeeditor);
    cy.waitForWebComponents([shapeeditorTag, "lf-image", "lf-canvas"]);
  });

  it("should contain canvas within preview bounds after selecting a shape", () => {
    // Find the canvas shapeeditor example by ID
    cy.get(canvasShapeeditorId).as("shapeeditor");

    // Click on a shape to load it into preview (use force for pointer-events:none)
    cy.get("@shapeeditor")
      .findCyElement(shape)
      .first()
      .scrollIntoView()
      .click({ force: true });

    // Wait for canvas to be rendered in the preview
    cy.get("@shapeeditor")
      .find(".details-grid__preview lf-canvas")
      .should("exist")
      .then(($canvas) => {
        // Get the preview container
        const previewContainer = $canvas.closest(".details-grid__preview");

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
    // Find the canvas shapeeditor example by ID
    cy.get(canvasShapeeditorId).as("shapeeditor");

    // Click on a shape to load it into preview
    cy.get("@shapeeditor")
      .findCyElement(shape)
      .first()
      .scrollIntoView()
      .click({ force: true });

    // Wait for canvas and check boxing attribute
    cy.get("@shapeeditor")
      .find(".details-grid__preview lf-canvas")
      .should("exist")
      .should("have.attr", "data-boxing")
      .and("match", /^(letterbox|pillarbox)$/);
  });

  it("should maintain canvas containment on window resize", () => {
    // Find the canvas shapeeditor example by ID
    cy.get(canvasShapeeditorId).as("shapeeditor");

    // Click on a shape to load it into preview
    cy.get("@shapeeditor")
      .findCyElement(shape)
      .first()
      .scrollIntoView()
      .click({ force: true });

    // Wait for canvas
    cy.get("@shapeeditor")
      .find(".details-grid__preview lf-canvas")
      .should("exist");

    // Resize viewport
    cy.viewport(800, 600);

    // Wait for resize to settle
    cy.wait(500);

    // Verify canvas is still contained
    cy.get("@shapeeditor")
      .find(".details-grid__preview lf-canvas")
      .then(($canvas) => {
        const previewContainer = $canvas.closest(".details-grid__preview");

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
    // Find the canvas shapeeditor example by ID
    cy.get(canvasShapeeditorId).as("shapeeditor");

    // Click on a shape to load it into preview
    cy.get("@shapeeditor")
      .findCyElement(shape)
      .first()
      .scrollIntoView()
      .click({ force: true });

    // Wait for canvas
    cy.get("@shapeeditor")
      .find(".details-grid__preview lf-canvas")
      .should("exist");

    // Record initial time
    const startTime = Date.now();

    // Wait a reasonable amount of time - if there's an infinite loop,
    // the browser would become unresponsive or slow
    cy.wait(1000);

    // Verify we can still interact with the page (no infinite loop blocking)
    cy.get("@shapeeditor")
      .find(".details-grid__preview lf-canvas")
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
//#endregion

//#region Behavioral Event Handling
describe("Behavioral Event Handling (Image Editor)", () => {
  /**
   * Tests for the three behavioral patterns:
   * - live: Preview on drag, commit on release
   * - configure: Settings are config, stroke triggers commit
   * - manual: No preview, explicit Apply button required
   */

  const playgroundId = "#playground";

  beforeEach(() => {
    cy.navigate(shapeeditor);
    cy.waitForWebComponents([
      shapeeditorTag,
      "lf-tree",
      "lf-canvas",
      "lf-slider",
      "lf-accordion",
    ]);
  });

  it("should show Apply button for manual behavior filters (resize, background_remover)", () => {
    // Find the playground shapeeditor
    cy.get(playgroundId).as("shapeeditor");

    // First select an image from the masonry to enable controls
    cy.get("@shapeeditor")
      .find("lf-masonry lf-image")
      .first()
      .click({ force: true });

    // Expand Basic Adjustments in the tree and click on "Resize (by edge)" which has manual behavior
    cy.get("@shapeeditor")
      .find("lf-tree")
      .contains("Basic Adjustments")
      .click({ force: true });

    cy.get("@shapeeditor")
      .find("lf-tree")
      .contains("Resize (by edge)")
      .click({ force: true });

    // Wait for controls to render and check Apply button is visible
    cy.get("@shapeeditor")
      .find(".controlActions__apply")
      .should("exist")
      .and("be.visible");
  });

  it("should hide Apply button for live behavior filters (brightness, contrast)", () => {
    cy.get(playgroundId).as("shapeeditor");

    // Select an image first
    cy.get("@shapeeditor")
      .find("lf-masonry lf-image")
      .first()
      .click({ force: true });

    // Expand Basic Adjustments and select Brightness (live behavior)
    cy.get("@shapeeditor")
      .find("lf-tree")
      .contains("Basic Adjustments")
      .click({ force: true });

    cy.get("@shapeeditor")
      .find("lf-tree")
      .contains("Brightness")
      .click({ force: true });

    // Apply button should not exist for live filters (showApplyButton defaults to false)
    cy.get("@shapeeditor").find(".controlActions__apply").should("not.exist");

    // Reset button should still be visible
    cy.get("@shapeeditor").find(".controlActions__reset").should("exist");
  });

  it("should emit change event and create snapshot for live filter on slider release", () => {
    cy.get(playgroundId).as("shapeeditor");

    // Select an image
    cy.get("@shapeeditor")
      .find("lf-masonry lf-image")
      .first()
      .click({ force: true });

    // Select Brightness filter
    cy.get("@shapeeditor")
      .find("lf-tree")
      .contains("Basic Adjustments")
      .click({ force: true });

    cy.get("@shapeeditor")
      .find("lf-tree")
      .contains("Brightness")
      .click({ force: true });

    // Wait for controls to render
    cy.get("@shapeeditor").find("lf-accordion").should("exist");

    // Get initial history count
    cy.get("@shapeeditor")
      .find("[data-cy='history-badge']")
      .invoke("text")
      .then((initialHistory) => {
        const initialCount = parseInt(initialHistory.split("/")[0]);

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
          .find("[data-cy='history-badge']")
          .invoke("text")
          .then((newHistory) => {
            const newCount = parseInt(newHistory.split("/")[0]);
            expect(newCount).to.be.greaterThan(initialCount);
          });
      });
  });

  it("should show Reset button and reset controls when clicked", () => {
    cy.get(playgroundId).as("shapeeditor");

    // Select an image and filter
    cy.get("@shapeeditor")
      .find("lf-masonry lf-image")
      .first()
      .click({ force: true });

    cy.get("@shapeeditor")
      .find("lf-tree")
      .contains("Basic Adjustments")
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
      .find(".controlActions__reset")
      .click({ force: true });

    // Should see snackbar with reset message
    cy.get("@shapeeditor").find("lf-snackbar").should("contain.text", "reset");
  });

  it("should show progressbar during Apply operation for manual filters", () => {
    cy.get(playgroundId).as("shapeeditor");

    // Select an image
    cy.get("@shapeeditor")
      .find("lf-masonry lf-image")
      .first()
      .click({ force: true });

    // Select a manual behavior filter (Resize by edge)
    cy.get("@shapeeditor")
      .find("lf-tree")
      .contains("Basic Adjustments")
      .click({ force: true });

    cy.get("@shapeeditor")
      .find("lf-tree")
      .contains("Resize (by edge)")
      .click({ force: true });

    // Wait for controls
    cy.get("@shapeeditor").find("lf-accordion").should("exist");

    // Click Apply button
    cy.get("@shapeeditor")
      .find(".controlActions__apply")
      .click({ force: true });

    // Progressbar should become visible
    cy.get("@shapeeditor").find("lf-progressbar").should("be.visible");

    // Wait for operation to complete and snackbar to show
    cy.get("@shapeeditor")
      .find("lf-snackbar")
      .should("contain.text", "Applied")
      .or("contain.text", "error");
  });
});
//#endregion
