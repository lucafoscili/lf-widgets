import {
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { getTypewriterFixtures } from "../../../src/components/lf-showcase/assets/data/typewriter";
import { CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const typewriterName: LfComponentName = "LfTypewriter";
const typewriterTag: LfComponentTag<typeof typewriterName> = "lf-typewriter";
const typewriter = typewriterTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(typewriter).waitForWebComponents([typewriterTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${typewriterTag}> exist.`, () => {
    const fixtures = getTypewriterFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(typewriterTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  it(`ready`, () => {
    cy.checkReadyEvent(typewriter);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(typewriter);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(typewriter);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(typewriterTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(typewriterTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(typewriterTag, typewriterName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(typewriter);
  });
  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
