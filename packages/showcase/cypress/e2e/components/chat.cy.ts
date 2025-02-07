import {
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { getChatFixtures } from "../../../src/components/lf-showcase/assets/data/chat";
import { CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const chatName: LfComponentName = "LfChat";
const chatTag: LfComponentTag<typeof chatName> = "lf-chat";
const chat = chatTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(chat).waitForWebComponents([chatTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${chatTag}> exist.`, () => {
    const fixtures = getChatFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(chatTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  it(`ready`, () => {
    cy.checkReadyEvent(chat);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(chat);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(chat);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(chatTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(chatTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(chatTag, chatName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(chat);
  });
  it("Should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
