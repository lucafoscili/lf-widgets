import {
  CY_ATTRIBUTES,
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
  LfToggleEvent,
} from "@lf-widgets/foundations";
import { getToggleFixtures } from "../../../src/components/lf-showcase/assets/data/toggle";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const toggleName: LfComponentName = "LfToggle";
const toggleTag: LfComponentTag<typeof toggleName> = "lf-toggle";
const toggle = toggleTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let core: LfCoreInterface;

  beforeEach(() => {
    cy.navigate(toggle).waitForWebComponents([toggleTag]);
    cy.getLfCore().then((lfCore) => {
      core = lfCore;
    });
  });

  it(`Should check that all <${toggleTag}> exist.`, () => {
    const fixtures = getToggleFixtures(core);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(toggleTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check, input } = CY_ATTRIBUTES;

  it(`blur`, () => {
    cy.navigate(toggle);
    const eventType: LfToggleEvent = "blur";
    cy.checkEvent(toggle, eventType);
    cy.get(eventElement).findCyElement(input).first().focus().blur();
    cy.getCyElement(check).should("exist");
  });
  it(`change`, () => {
    cy.navigate(toggle);
    const eventType: LfToggleEvent = "change";
    cy.checkEvent(toggle, eventType);
    cy.get(eventElement).findCyElement(input).first().click();
    cy.getCyElement(check).should("exist");
  });
  it(`focus`, () => {
    cy.navigate(toggle);
    const eventType: LfToggleEvent = "focus";
    cy.checkEvent(toggle, eventType);
    cy.get(eventElement).findCyElement(input).first().focus();
    cy.getCyElement(check).should("exist");
  });
  it(`pointerdown`, () => {
    cy.navigate(toggle);
    const eventType: LfToggleEvent = "pointerdown";
    cy.checkEvent(toggle, eventType);
    cy.get(eventElement).findCyElement(input).first().click({ force: true });
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(toggle);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(toggle);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(toggle);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(toggleTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(toggleTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(toggleTag, toggleName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(toggle);
  });
  it("lfStyle: hould check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
