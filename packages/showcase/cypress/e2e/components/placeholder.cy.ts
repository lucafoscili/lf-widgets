import {
  CY_ATTRIBUTES,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfPlaceholderEvent,
} from "@lf-widgets/foundations";
import { getPlaceholderFixtures } from "../../../src/components/lf-showcase/assets/data/placeholder";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const placeholderName: LfComponentName = "LfPlaceholder";
const placeholderTag: LfComponentTag<typeof placeholderName> = "lf-placeholder";
const placeholder = placeholderTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(placeholder).waitForWebComponents([placeholderTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${placeholderTag}> exist.`, () => {
    const fixtures = getPlaceholderFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(placeholderTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { lfComponentShowcase } = CY_ALIASES;
  const { check } = CY_ATTRIBUTES;

  it(`lf-event`, () => {
    cy.navigate(placeholder);
    const eventType: LfPlaceholderEvent = "lf-event";
    cy.checkEvent(placeholder, eventType);
    cy.get(lfComponentShowcase)
      .should("exist")
      .within(() => {
        cy.get("lf-placeholder")
          .last()
          .should("exist")
          .scrollIntoView()
          .click();
      });
    cy.getCyElement(check).should("exist");
  });
  it(`load`, () => {
    const eventType: LfPlaceholderEvent = "load";
    cy.checkReadyEvent(placeholder, eventType);
  });
  it(`ready`, () => {
    cy.checkReadyEvent(placeholder);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(placeholder);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(placeholder);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(placeholderTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(placeholderTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(placeholderTag, placeholderName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(placeholder);
  });
  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
