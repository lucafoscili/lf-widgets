import {
  CY_ATTRIBUTES,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfSliderEvent,
} from "@lf-widgets/foundations";
import { getSliderFixtures } from "../../../src/components/lf-showcase/assets/data/slider";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const sliderName: LfComponentName = "LfSlider";
const sliderTag: LfComponentTag<typeof sliderName> = "lf-slider";
const slider = sliderTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(slider).waitForWebComponents([sliderTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${sliderTag}> exist.`, () => {
    const fixtures = getSliderFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(sliderTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check, input } = CY_ATTRIBUTES;

  it(`blur`, () => {
    cy.navigate(slider);
    const eventType: LfSliderEvent = "blur";
    cy.checkEvent(slider, eventType);
    cy.get(eventElement).findCyElement(input).first().focus().blur();
    cy.getCyElement(check).should("exist");
  });
  it(`focus`, () => {
    cy.navigate(slider);
    const eventType: LfSliderEvent = "focus";
    cy.checkEvent(slider, eventType);
    cy.get(eventElement).findCyElement(input).first().focus();
    cy.getCyElement(check).should("exist");
  });
  it(`input`, () => {
    cy.navigate(slider);
    const eventType: LfSliderEvent = "input";
    cy.checkEvent(slider, eventType);
    cy.get(eventElement)
      .findCyElement(input)
      .first()
      .invoke("val", "1")
      .trigger("input");
    cy.getCyElement(check).should("exist");
  });
  it(`pointerdown`, () => {
    cy.navigate(slider);
    const eventType: LfSliderEvent = "pointerdown";
    cy.checkEvent(slider, eventType);
    cy.get(eventElement).findCyElement(input).first().click({ force: true });
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(slider);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(slider);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(slider);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(sliderTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(sliderTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(sliderTag, sliderName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(slider);
  });
  it("lfStyle: hould check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
