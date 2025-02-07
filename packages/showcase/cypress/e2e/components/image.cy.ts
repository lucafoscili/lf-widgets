import {
  CY_ATTRIBUTES,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfImageEvent,
} from "@lf-widgets/foundations";
import { getImageFixtures } from "../../../src/components/lf-showcase/assets/data/image";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const imageName: LfComponentName = "LfImage";
const imageTag: LfComponentTag<typeof imageName> = "lf-image";
const image = imageTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(image).waitForWebComponents([imageTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${imageTag}> exist.`, () => {
    const fixtures = getImageFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(imageTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check } = CY_ATTRIBUTES;

  it(`click`, () => {
    cy.navigate(image);
    const eventType: LfImageEvent = "click";
    cy.checkEvent(image, eventType);
    cy.get(eventElement).click();
    cy.getCyElement(check).should("exist");
  });
  it(`load`, () => {
    const eventType: LfImageEvent = "load";
    cy.checkReadyEvent(image, eventType);
  });
  it(`ready`, () => {
    cy.checkReadyEvent(image);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(image);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(image);
  });

  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(imageTag);
  });

  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(imageTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(imageTag, imageName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(image);
  });
  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
