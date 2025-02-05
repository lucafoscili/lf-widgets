import {
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
} from "@lf-widgets/foundations";
import { getMessengerFixtures } from "../../../src/components/lf-showcase/assets/data/messenger";
import { CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const messengerName: LfComponentName = "LfMessenger";
const messengerTag: LfComponentTag<typeof messengerName> = "lf-messenger";
const messenger = messengerTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let core: LfCoreInterface;

  beforeEach(() => {
    cy.navigate(messenger).waitForWebComponents([messengerTag]);
    cy.getLfCore().then((lfCore) => {
      core = lfCore;
    });
  });

  it(`Should check that all <${messengerTag}> exist.`, () => {
    const fixtures = getMessengerFixtures(core);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(messengerTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  it(`ready`, () => {
    cy.checkReadyEvent(messenger);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(messenger);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(messenger);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(messengerTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(messengerTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(messengerTag, messengerName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(messenger);
  });

  it("Should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
