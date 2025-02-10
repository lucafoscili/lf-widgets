import {
  CY_ATTRIBUTES,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfMasonryEvent,
} from "@lf-widgets/foundations";
import { getMasonryFixtures } from "../../../src/components/lf-showcase/assets/data/masonry";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const masonryName: LfComponentName = "LfMasonry";
const masonryTag: LfComponentTag<typeof masonryName> = "lf-masonry";
const masonry = masonryTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(masonry).waitForWebComponents([masonryTag, "lf-image"]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${masonryTag}> exist.`, () => {
    const fixtures = getMasonryFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(masonryTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check, shape } = CY_ATTRIBUTES;

  it(`lf-event`, () => {
    cy.navigate(masonry);
    const eventType: LfMasonryEvent = "lf-event";
    cy.checkEvent(masonry, eventType);
    cy.get(eventElement).findCyElement(shape).first().scrollIntoView().click();
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(masonry);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(masonry);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(masonry);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(masonryTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(masonryTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(masonryTag, masonryName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(masonry);
  });
  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
