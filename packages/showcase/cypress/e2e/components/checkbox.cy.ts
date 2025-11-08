import {
  CY_ATTRIBUTES,
  LfCheckboxEvent,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { getCheckboxFixtures } from "../../../src/components/lf-showcase/assets/data/checkbox";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const checkboxName: LfComponentName = "LfCheckbox";
const checkboxTag: LfComponentTag<typeof checkboxName> = "lf-checkbox";
const checkbox = checkboxTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(checkbox).waitForWebComponents([checkboxTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${checkboxTag}> exist.`, () => {
    const fixtures = getCheckboxFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(checkboxTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check, input } = CY_ATTRIBUTES;

  it(`blur`, () => {
    cy.navigate(checkbox);
    const eventType: LfCheckboxEvent = "blur";
    cy.checkEvent(checkbox, eventType);
    cy.get(eventElement).findCyElement(input).first().focus().blur();
    cy.getCyElement(check).should("exist");
  });
  it(`change`, () => {
    cy.navigate(checkbox);
    const eventType: LfCheckboxEvent = "change";
    cy.checkEvent(checkbox, eventType);
    cy.get(eventElement).findCyElement(input).first().click();
    cy.getCyElement(check).should("exist");
  });
  it(`focus`, () => {
    cy.navigate(checkbox);
    const eventType: LfCheckboxEvent = "focus";
    cy.checkEvent(checkbox, eventType);
    cy.get(eventElement).findCyElement(input).first().focus();
    cy.getCyElement(check).should("exist");
  });
  it(`pointerdown`, () => {
    cy.navigate(checkbox);
    const eventType: LfCheckboxEvent = "pointerdown";
    cy.checkEvent(checkbox, eventType);
    cy.get(eventElement).findCyElement(input).first().click({ force: true });
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(checkbox);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(checkbox);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(checkbox);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(checkboxTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(checkboxTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(checkboxTag, checkboxName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(checkbox);
  });
  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
