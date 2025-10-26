import {
  CY_ATTRIBUTES,
  LfCanvasEvent,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { getCanvasFixtures } from "../../../src/components/lf-showcase/assets/data/canvas";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const canvasName: LfComponentName = "LfCanvas";
const canvasTag: LfComponentTag<typeof canvasName> = "lf-canvas";
const canvas = canvasTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(canvas).waitForWebComponents([canvasTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${canvasTag}> exist.`, () => {
    const fixtures = getCanvasFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(canvasTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check } = CY_ATTRIBUTES;

  it(`stroke`, () => {
    cy.navigate(canvas);
    const eventType: LfCanvasEvent = "stroke";
    cy.checkEvent(canvas, eventType);
    cy.get(eventElement).click();
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(canvas);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(canvas);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(canvas);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(canvasTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(canvasTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(canvasTag, canvasName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  const { lfComponentShowcase } = CY_ALIASES;
  const { canvas: canvasAttr, image } = CY_ATTRIBUTES;

  beforeEach(() => {
    cy.navigate(canvas);
  });

  it("lfBrush: should reflect the configured brush shape.", () => {
    cy.get(lfComponentShowcase)
      .find('lf-canvas[id*="square"]')
      .first()
      .then(($comp) => {
        cy.wrap($comp).should(async ($c) => {
          const comp = $c[0] as HTMLLfCanvasElement;
          expect(comp.lfBrush).to.eq("square");
        });
      });
  });

  it("lfColor: should reflect the configured color.", () => {
    cy.get(lfComponentShowcase)
      .find('lf-canvas[id*="stroke"]')
      .first()
      .then(($comp) => {
        cy.wrap($comp).should(async ($c) => {
          const comp = $c[0] as HTMLLfCanvasElement;
          expect(comp.lfColor).to.eq("blue");
        });
      });
  });

  it("lfCursor: should reflect the configured cursor mode.", () => {
    cy.get(lfComponentShowcase)
      .find('lf-canvas[id*="defaultCursor"]')
      .first()
      .then(($comp) => {
        cy.wrap($comp).should(async ($c) => {
          const comp = $c[0] as HTMLLfCanvasElement;
          expect(comp.lfCursor).to.eq("default");
        });
      });
  });

  it("lfImageProps: should be present and render an image element.", () => {
    cy.get(lfComponentShowcase)
      .find('lf-canvas[id*="simple"]')
      .first()
      .then(($comp) => {
        cy.wrap($comp)
          .should(async ($c) => {
            const comp = $c[0] as HTMLLfCanvasElement;
            expect(comp.lfImageProps).to.be.a("object");
            expect(comp.lfImageProps?.lfValue).to.be.a("string").and.not.be
              .empty;
          })
          .within(() => {
            cy.getCyElement(image).should("exist");
          });
      });
  });

  it("lfOpacity: should reflect the configured opacity.", () => {
    cy.get(lfComponentShowcase)
      .find('lf-canvas[id*="opacity"]')
      .first()
      .then(($comp) => {
        cy.wrap($comp).should(async ($c) => {
          const comp = $c[0] as HTMLLfCanvasElement;
          expect(comp.lfOpacity).to.eq(0.5);
        });
      });
  });

  it("lfPreview: when disabled and cursor preview off, should hide the preview canvas.", () => {
    cy.get(lfComponentShowcase)
      .find('lf-canvas[id*="noPreview"]')
      .first()
      .then(($comp) => {
        // Turn off cursor preview as well, then wait for a re-render
        cy.wrap($comp).should(async ($c) => {
          const comp = $c[0] as HTMLLfCanvasElement;
          comp.lfCursor = "default";
          expect(comp.lfCursor).to.eq("default");
          expect(comp.lfPreview).to.eq(false);
          await comp.refresh();
        });

        cy.wrap($comp).within(() => {
          cy.getCyElement(canvasAttr).should("have.length", 1);
        });
      });
  });

  it("lfPreview: when disabled but cursor preview enabled, preview canvas remains.", () => {
    cy.get(lfComponentShowcase)
      .find('lf-canvas[id*="noPreview"]')
      .first()
      .within(() => {
        cy.getCyElement(canvasAttr).should("have.length", 2);
      });
  });

  it("lfSize: should reflect the configured brush size.", () => {
    cy.get(lfComponentShowcase)
      .find('lf-canvas[id*="size"]')
      .first()
      .then(($comp) => {
        cy.wrap($comp).should(async ($c) => {
          const comp = $c[0] as HTMLLfCanvasElement;
          expect(comp.lfSize).to.eq(128);
        });
      });
  });

  it("lfStrokeTolerance: can be set programmatically and read back.", () => {
    cy.get(lfComponentShowcase)
      .find(canvasTag)
      .first()
      .then(($comp) => {
        cy.wrap($comp).should(async ($c) => {
          const comp = $c[0] as HTMLLfCanvasElement;
          comp.lfStrokeTolerance = 10;
          expect(comp.lfStrokeTolerance).to.eq(10);
        });
      });
  });

  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion

//#region e2e
describe(CY_CATEGORIES.e2e, () => {
  const { lfComponentShowcase } = CY_ALIASES;
  const { canvas: canvasAttr, image } = CY_ATTRIBUTES;

  beforeEach(() => {
    cy.navigate(canvas);
  });

  it("Should render image and canvas layers inside the component.", () => {
    cy.get(lfComponentShowcase)
      .find(canvasTag)
      .first()
      .should("exist")
      .within(() => {
        cy.getCyElement(image).should("exist");
        cy.getCyElement(canvasAttr).then(($layers) => {
          expect($layers.length).to.be.greaterThan(0);
        });
      });
  });

  it("Should expose canvases via API after resize.", () => {
    cy.get(lfComponentShowcase)
      .find(canvasTag)
      .first()
      .then(($comp) => {
        cy.wrap($comp).should(async ($c) => {
          const comp = $c[0] as HTMLLfCanvasElement;
          await comp.resizeCanvas();

          const board = await comp.getCanvas("board");
          const preview = await comp.getCanvas("preview");

          expect(board.width).to.be.greaterThan(0);
          expect(board.height).to.be.greaterThan(0);
          expect(preview.width).to.be.greaterThan(0);
          expect(preview.height).to.be.greaterThan(0);
        });
      });
  });
});
//#endregion
