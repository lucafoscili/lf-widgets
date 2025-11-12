import {
  CY_ATTRIBUTES,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfRadioEvent,
} from "@lf-widgets/foundations";
import { getRadioFixtures } from "../../../src/components/lf-showcase/assets/data/radio";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const radioName: LfComponentName = "LfRadio";
const radioTag: LfComponentTag<typeof radioName> = "lf-radio";
const radio = radioTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(radio).waitForWebComponents([radioTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${radioTag}> exist.`, () => {
    const fixtures = getRadioFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(radioTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check, input } = CY_ATTRIBUTES;

  it(`blur`, () => {
    cy.navigate(radio);
    const eventType: LfRadioEvent = "blur";
    cy.checkEvent(radio, eventType);
    cy.get(eventElement).findCyElement(input).first().focus().blur();
    cy.getCyElement(check).should("exist");
  });

  it(`change`, () => {
    cy.navigate(radio);
    const eventType: LfRadioEvent = "change";
    cy.checkEvent(radio, eventType);
    cy.get(eventElement).findCyElement(input).eq(1).check();
    cy.getCyElement(check).should("exist");
  });

  it(`click`, () => {
    cy.navigate(radio);
    const eventType: LfRadioEvent = "click";
    cy.checkEvent(radio, eventType);
    cy.get(eventElement).findCyElement(input).first().click();
    cy.getCyElement(check).should("exist");
  });

  it(`focus`, () => {
    cy.navigate(radio);
    const eventType: LfRadioEvent = "focus";
    cy.checkEvent(radio, eventType);
    cy.get(eventElement).findCyElement(input).first().focus();
    cy.getCyElement(check).should("exist");
  });

  it(`pointerdown`, () => {
    cy.navigate(radio);
    const eventType: LfRadioEvent = "pointerdown";
    cy.checkEvent(radio, eventType);
    cy.get(eventElement).findCyElement(input).first().click();
    cy.getCyElement(check).should("exist");
  });

  it(`ready`, () => {
    cy.checkReadyEvent(radio);
  });

  it(`unmount`, () => {
    cy.checkUnmountEvent(radio);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  const { input } = CY_ATTRIBUTES;

  beforeEach(() => {
    cy.navigate(radio);
  });

  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(radioTag);
  });

  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(radioTag);
  });

  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(radioTag, radioName);
  });

  it(`selectItem: should select the specified item.`, () => {
    cy.navigate(radio);
    cy.getLfFramework().then((framework) => {
      const fixtures = getRadioFixtures(framework);
      const keys = getExamplesKeys(fixtures);
      const firstExample = keys[0];

      cy.get(`#${firstExample}`).then(async ($radio) => {
        const radioComponent = $radio[0] as HTMLLfRadioElement;
        await radioComponent.selectItem("option2");
        cy.wrap($radio).findCyElement(input).eq(1).should("be.checked");
      });
    });
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(radio);
  });

  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
