import {
  CY_ATTRIBUTES,
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
  LfTreeEvent,
} from "@lf-widgets/foundations";
import { getTreeFixtures } from "../../../src/components/lf-showcase/assets/data/tree";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const treeName: LfComponentName = "LfTree";
const treeTag: LfComponentTag<typeof treeName> = "lf-tree";
const tree = treeTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let core: LfCoreInterface;

  beforeEach(() => {
    cy.navigate(tree).waitForWebComponents([treeTag]);
    cy.getLfCore().then((lfCore) => {
      core = lfCore;
    });
  });

  it(`Should check that all <${treeTag}> exist.`, () => {
    const fixtures = getTreeFixtures(core);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(treeTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check, input, node } = CY_ATTRIBUTES;

  it(`click`, () => {
    cy.navigate(tree);
    const eventType: LfTreeEvent = "click";
    cy.checkEvent(tree, eventType);

    cy.get(`${treeTag}#uncategorized-selectable`)
      .findCyElement(node)
      .first()
      .click();
    cy.getCyElement(check).should("exist");
  });
  it(`lf-event`, () => {
    cy.navigate(tree);
    const eventType: LfTreeEvent = "lf-event";
    cy.checkEvent(tree, eventType);
    cy.get(eventElement).findCyElement(input).first().focus();
    cy.getCyElement(check).should("exist");
  });
  it(`pointerdown`, () => {
    cy.navigate(tree);
    const eventType: LfTreeEvent = "pointerdown";
    cy.checkEvent(tree, eventType);

    cy.get(`${treeTag}#uncategorized-selectable`)
      .findCyElement(node)
      .first()
      .click();
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(tree);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(tree);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(tree);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(treeTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(treeTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(treeTag, treeName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(tree);
  });
  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
