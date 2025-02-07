import {
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { getSpinnerFixtures } from "../../../src/components/lf-showcase/assets/data/spinner";
import { CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const spinnerName: LfComponentName = "LfSpinner";
const spinnerTag: LfComponentTag<typeof spinnerName> = "lf-spinner";
const spinner = spinnerTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(spinner).waitForWebComponents([spinnerTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${spinnerTag}> exist.`, () => {
    const fixtures = getSpinnerFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(spinnerTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  it(`ready`, () => {
    cy.checkReadyEvent(spinner);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(spinner);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(spinner);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(spinnerTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(spinnerTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(spinnerTag, spinnerName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(spinner);
  });
  it("Should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
