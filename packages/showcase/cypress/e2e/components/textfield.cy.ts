import {
  CY_ATTRIBUTES,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfTextfieldEvent,
} from "@lf-widgets/foundations";
import { getTextfieldFixtures } from "../../../src/components/lf-showcase/assets/data/textfield";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const textfieldName: LfComponentName = "LfTextfield";
const textfieldTag: LfComponentTag<typeof textfieldName> = "lf-textfield";
const textfield = textfieldTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(textfield).waitForWebComponents([textfieldTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${textfieldTag}> exist.`, () => {
    const fixtures = getTextfieldFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(textfieldTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check, input } = CY_ATTRIBUTES;

  it(`blur`, () => {
    cy.navigate(textfield);
    const eventType: LfTextfieldEvent = "blur";
    cy.checkEvent(textfield, eventType);
    cy.get(eventElement).findCyElement(input).first().focus().blur();
    cy.getCyElement(check).should("exist");
  });
  it(`change`, () => {
    cy.navigate(textfield);
    const eventType: LfTextfieldEvent = "change";
    cy.checkEvent(textfield, eventType);
    cy.get(eventElement)
      .findCyElement(input)
      .first()
      .focus()
      .type("Test{enter}")
      .blur();
    cy.getCyElement(check).should("exist");
  });
  it(`click`, () => {
    cy.navigate(textfield);
    const eventType: LfTextfieldEvent = "click";
    cy.checkEvent(textfield, eventType);
    cy.get(eventElement).findCyElement(input).first().click();
    cy.getCyElement(check).should("exist");
  });
  it(`focus`, () => {
    cy.navigate(textfield);
    const eventType: LfTextfieldEvent = "focus";
    cy.checkEvent(textfield, eventType);
    cy.get(eventElement).findCyElement(input).first().focus();
    cy.getCyElement(check).should("exist");
  });
  it(`input`, () => {
    cy.navigate(textfield);
    const eventType: LfTextfieldEvent = "input";
    cy.checkEvent(textfield, eventType);
    cy.get(eventElement).findCyElement(input).first().type("Test");
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(textfield);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(textfield);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(textfield);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(textfieldTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(textfieldTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(textfieldTag, textfieldName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(textfield);
  });
  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
