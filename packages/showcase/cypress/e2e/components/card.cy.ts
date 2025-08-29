import {
  CY_ATTRIBUTES,
  LfCardEvent,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { getCardFixtures } from "../../../src/components/lf-showcase/assets/data/card";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const cardName: LfComponentName = "LfCard";
const cardTag: LfComponentTag<typeof cardName> = "lf-card";
const card = cardTag.replace("lf-", "");

//#region Basic
describe("Basic", () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(card).waitForWebComponents([cardTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${cardTag}> exist.`, () => {
    const fixtures = getCardFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(cardTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check, rippleSurface, shape } = CY_ATTRIBUTES;

  it(`click`, () => {
    cy.navigate(card);
    const eventType: LfCardEvent = "click";
    cy.checkEvent(card, eventType);
    cy.get(eventElement).click();
    cy.getCyElement(check).should("exist");
  });
  it(`contextmenu`, () => {
    cy.navigate(card);
    const eventType: LfCardEvent = "contextmenu";
    cy.checkEvent(card, eventType);
    cy.get(eventElement).rightclick();
    cy.getCyElement(check).should("exist");
  });
  it(`lf-event`, () => {
    cy.navigate(card);
    const eventType: LfCardEvent = "lf-event";
    cy.checkEvent(card, eventType);
    cy.get(eventElement).findCyElement(shape).first().click();
    cy.getCyElement(check).should("exist");
  });
  it(`pointerdown`, () => {
    cy.navigate(card);
    const eventType: LfCardEvent = "pointerdown";
    cy.checkEvent(card, eventType);
    cy.get(`${cardTag}#material-material-0`)
      .findCyElement(rippleSurface)
      .parent() // the actual listener is on the parent in this case
      .click({ multiple: true });
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(card);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(card);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(card);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(cardTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(cardTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(cardTag, cardName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(card);
  });
  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
