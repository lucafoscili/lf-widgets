import {
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { getCodeFixtures } from "../../../src/components/lf-showcase/assets/data/code";
import { getExamplesKeys } from "../../support/utils";

const codeName: LfComponentName = "LfCode";
const codeTag: LfComponentTag<typeof codeName> = "lf-code";
const code = codeTag.replace("lf-", "");

//#region Basic
describe("Basic", () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(code).waitForWebComponents([codeTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${codeTag}> exist.`, () => {
    const fixtures = getCodeFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(codeTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe("Events", () => {
  it(`ready`, () => {
    cy.checkReadyEvent(code);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(code);
  });
});
//#endregion

//#region Methods
describe("Methods", () => {
  beforeEach(() => {
    cy.navigate(code);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(codeTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(codeTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(codeTag, codeName);
  });
});
//#endregion

//#region Props
describe("Props", () => {
  beforeEach(() => {
    cy.navigate(code);
  });
  it("Should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
