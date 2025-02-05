import {
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
} from "@lf-widgets/foundations";
import { getChartFixtures } from "../../../src/components/lf-showcase/assets/data/chart";
import { CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const chartName: LfComponentName = "LfChart";
const chartTag: LfComponentTag<typeof chartName> = "lf-chart";
const chart = chartTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let core: LfCoreInterface;

  beforeEach(() => {
    cy.navigate(chart).waitForWebComponents([chartTag]);
    cy.getLfCore().then((lfCore) => {
      core = lfCore;
    });
  });

  it(`Should check that all <${chartTag}> exist.`, () => {
    const fixtures = getChartFixtures(core);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(chartTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  it(`ready`, () => {
    cy.checkReadyEvent(chart);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(chart);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(chart);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(chartTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(chartTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(chartTag, chartName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(chart);
  });
  it("Should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
