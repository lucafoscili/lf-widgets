import {
  CY_ATTRIBUTES,
  LfCompareEvent,
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
} from "@lf-widgets/foundations";
import { getCompareFixtures } from "../../../src/components/lf-showcase/assets/data/compare";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const compareName: LfComponentName = "LfCompare";
const compareTag: LfComponentTag<typeof compareName> = "lf-compare";
const compare = compareTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let core: LfCoreInterface;

  beforeEach(() => {
    cy.navigate(compare).waitForWebComponents([compareTag]);
    cy.getLfCore().then((lfCore) => {
      core = lfCore;
    });
  });

  it(`Should check that all <${compareTag}> exist.`, () => {
    const fixtures = getCompareFixtures(core);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(compareTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check, shape } = CY_ATTRIBUTES;

  it(`lf-event`, () => {
    cy.navigate(compare);
    const eventType: LfCompareEvent = "lf-event";
    cy.checkEvent(compare, eventType);
    cy.get(eventElement)
      .findCyElement(shape)
      .first()
      .scrollIntoView()
      .trigger("click", { force: true, x: 100, y: 100 });
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(compare);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(compare);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(compare);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(compareTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(compareTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(compareTag, compareName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(compare);
  });
  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
