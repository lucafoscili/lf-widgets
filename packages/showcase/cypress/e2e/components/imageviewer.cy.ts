import {
  CY_ATTRIBUTES,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfImageviewerEvent,
} from "@lf-widgets/foundations";
import { getImageviewerFixtures } from "../../../src/components/lf-showcase/assets/data/imageviewer";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const imageviewerName: LfComponentName = "LfImageviewer";
const imageviewerTag: LfComponentTag<typeof imageviewerName> = "lf-imageviewer";
const imageviewer = imageviewerTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(imageviewer).waitForWebComponents([imageviewerTag, "lf-image"]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${imageviewerTag}> exist.`, () => {
    const fixtures = getImageviewerFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(imageviewerTag, new Set(keys));
  });
});
//#endregion

//#region
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { button, check, shape } = CY_ATTRIBUTES;

  it(`lf-event`, () => {
    cy.navigate(imageviewer);
    const eventType: LfImageviewerEvent = "lf-event";
    cy.checkEvent(imageviewer, eventType);
    cy.get(eventElement)
      .findCyElement(button)
      .find("#navigation-load")
      .first()
      .click();
    cy.get(eventElement).findCyElement(shape).first().scrollIntoView().click();
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(imageviewer);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(imageviewer);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(imageviewer);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(imageviewerTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(imageviewerTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(imageviewerTag, imageviewerName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(imageviewer);
  });
  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
