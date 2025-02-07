import {
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { getProgressbarFixtures } from "../../../src/components/lf-showcase/assets/data/progressbar";
import { CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const progressbarName: LfComponentName = "LfProgressbar";
const progressbarTag: LfComponentTag<typeof progressbarName> = "lf-progressbar";
const progressbar = progressbarTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(progressbar).waitForWebComponents([progressbarTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${progressbarTag}> exist.`, () => {
    const fixtures = getProgressbarFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(progressbarTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  it(`ready`, () => {
    cy.checkReadyEvent(progressbar);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(progressbar);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(progressbar);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(progressbarTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(progressbarTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(progressbarTag, progressbarName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(progressbar);
  });

  it("Should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
