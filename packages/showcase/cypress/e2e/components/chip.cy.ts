import {
  CY_ATTRIBUTES,
  LfChipEvent,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { getChipFixtures } from "../../../src/components/lf-showcase/assets/data/chip";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const chipName: LfComponentName = "LfChip";
const chipTag: LfComponentTag<typeof chipName> = "lf-chip";
const chip = chipTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(chip).waitForWebComponents([chipTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${chipTag}> exist.`, () => {
    const fixtures = getChipFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(chipTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check, input } = CY_ATTRIBUTES;

  it(`blur`, () => {
    cy.navigate(chip);
    const eventType: LfChipEvent = "blur";
    cy.checkEvent(chip, eventType);
    cy.get(eventElement).findCyElement(input).first().focus().blur();
    cy.getCyElement(check).should("exist");
  });
  it(`click`, () => {
    cy.navigate(chip);
    const eventType: LfChipEvent = "click";
    cy.checkEvent(chip, eventType);
    cy.get(eventElement).findCyElement(input).first().click();
    cy.getCyElement(check).should("exist");
  });
  it(`delete`, () => {
    cy.navigate(chip);
    const eventType: LfChipEvent = "delete";
    cy.checkEvent(chip, eventType);
    cy.get(`${chipTag}#input-simple`)
      .find(".item__icon--trailing")
      .first()
      .click();
    cy.getCyElement(check).should("exist");
  });
  it(`focus`, () => {
    cy.navigate(chip);
    const eventType: LfChipEvent = "focus";
    cy.checkEvent(chip, eventType);
    cy.get(eventElement).findCyElement(input).first().focus();
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(chip);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(chip);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(chip);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(chipTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(chipTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(chipTag, chipName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(chip);
  });
  it("Should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
