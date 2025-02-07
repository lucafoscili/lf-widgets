import {
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfPhotoframeEvent,
} from "@lf-widgets/foundations";
import { getPhotoframeFixtures } from "../../../src/components/lf-showcase/assets/data/photoframe";
import { CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const photoframeName: LfComponentName = "LfPhotoframe";
const photoframeTag: LfComponentTag<typeof photoframeName> = "lf-photoframe";
const photoframe = photoframeTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(photoframe).waitForWebComponents([photoframeTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${photoframeTag}> exist.`, () => {
    const fixtures = getPhotoframeFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(photoframeTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  it(`load`, () => {
    const eventType: LfPhotoframeEvent = "load";
    cy.checkReadyEvent(photoframe, eventType);
  });
  it(`ready`, () => {
    cy.checkReadyEvent(photoframe);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(photoframe);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(photoframe);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(photoframeTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(photoframeTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(photoframeTag, photoframeName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(photoframe);
  });
  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
