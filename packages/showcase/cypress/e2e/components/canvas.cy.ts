import {
  CY_ATTRIBUTES,
  LfCanvasEvent,
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
} from "@lf-widgets/foundations";
import { getCanvasFixtures } from "../../../src/components/lf-showcase/assets/data/canvas";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const canvasName: LfComponentName = "LfCanvas";
const canvasTag: LfComponentTag<typeof canvasName> = "lf-canvas";
const canvas = canvasTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let core: LfCoreInterface;

  beforeEach(() => {
    cy.navigate(canvas).waitForWebComponents([canvasTag]);
    cy.getLfCore().then((lfCore) => {
      core = lfCore;
    });
  });

  it(`Should check that all <${canvasTag}> exist.`, () => {
    const fixtures = getCanvasFixtures(core);
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
  beforeEach(() => {
    cy.navigate(canvas);
  });
  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
