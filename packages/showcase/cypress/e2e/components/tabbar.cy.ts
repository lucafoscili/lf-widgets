import {
  CY_ATTRIBUTES,
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
  LfTabbarEvent,
} from "@lf-widgets/foundations";
import { getTabbarFixtures } from "../../../src/components/lf-showcase/assets/data/tabbar";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const tabbarName: LfComponentName = "LfTabbar";
const tabbarTag: LfComponentTag<typeof tabbarName> = "lf-tabbar";
const tabbar = tabbarTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let core: LfCoreInterface;

  beforeEach(() => {
    cy.navigate(tabbar).waitForWebComponents([tabbarTag]);
    cy.getLfCore().then((lfCore) => {
      core = lfCore;
    });
  });

  it(`Should check that all <${tabbarTag}> exist.`, () => {
    const fixtures = getTabbarFixtures(core);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(tabbarTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { button, check } = CY_ATTRIBUTES;

  it(`click`, () => {
    cy.navigate(tabbar);
    const eventType: LfTabbarEvent = "click";
    cy.checkEvent(tabbar, eventType);
    cy.get(eventElement).findCyElement(button).first().click();
    cy.getCyElement(check).should("exist");
  });
  it(`pointerdown`, () => {
    cy.navigate(tabbar);
    const eventType: LfTabbarEvent = "pointerdown";
    cy.checkEvent(tabbar, eventType);
    cy.get(eventElement).findCyElement(button).first().click();
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(tabbar);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(tabbar);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(tabbar);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(tabbarTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(tabbarTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(tabbarTag, tabbarName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(tabbar);
  });
  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
