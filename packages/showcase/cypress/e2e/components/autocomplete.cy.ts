import {
  CY_ATTRIBUTES,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfAutocompleteEvent,
} from "@lf-widgets/foundations";
import { getAutocompleteFixtures } from "../../../src/components/lf-showcase/assets/data/autocomplete";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const autocompleteName: LfComponentName = "LfAutocomplete";
const autocompleteTag: LfComponentTag<typeof autocompleteName> =
  "lf-autocomplete";
const autocomplete = autocompleteTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(autocomplete).waitForWebComponents([autocompleteTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${autocompleteTag}> exist.`, () => {
    const fixtures = getAutocompleteFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(autocompleteTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { input } = CY_ATTRIBUTES;

  it(`input`, () => {
    cy.navigate(autocomplete);
    const eventType: LfAutocompleteEvent = "input";
    cy.checkEvent(autocomplete, eventType);
    cy.get(eventElement).findCyElement(input).first().type("test");
    cy.getCyElement("check").should("exist");
  });

  it(`change`, () => {
    cy.navigate(autocomplete);
    const eventType: LfAutocompleteEvent = "change";
    cy.checkEvent(autocomplete, eventType);
    cy.get(eventElement).findCyElement(input).first().type("United");
    cy.get(eventElement).find("lf-list").should("be.visible");
    cy.get(eventElement).find("lf-list").find("li").first().click();
    cy.getCyElement("check").should("exist");
  });
});
//#endregion
