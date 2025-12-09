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
