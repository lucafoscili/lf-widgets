import {
  CY_ATTRIBUTES,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfUploadEvent,
} from "@lf-widgets/foundations";
import { getUploadFixtures } from "../../../src/components/lf-showcase/assets/data/upload";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const uploadName: LfComponentName = "LfUpload";
const uploadTag: LfComponentTag<typeof uploadName> = "lf-upload";
const upload = uploadTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(upload).waitForWebComponents([uploadTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${uploadTag}> exist.`, () => {
    const fixtures = getUploadFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(uploadTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check } = CY_ATTRIBUTES;

  it(`pointerdown`, () => {
    cy.navigate(upload);
    const eventType: LfUploadEvent = "pointerdown";
    cy.checkEvent(upload, eventType);
    cy.get(eventElement).click();
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(upload);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(upload);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(upload);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(uploadTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(uploadTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(uploadTag, uploadName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(upload);
  });
  it("Should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
