import {
  CY_ATTRIBUTES,
  LfCarouselEvent,
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
} from "@lf-widgets/foundations";
import { getCarouselFixtures } from "../../../src/components/lf-showcase/assets/data/carousel";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const carouselName: LfComponentName = "LfCarousel";
const carouselTag: LfComponentTag<typeof carouselName> = "lf-carousel";
const carousel = carouselTag.replace("lf-", "");

describe(CY_CATEGORIES.basic, () => {
  let core: LfCoreInterface;

  beforeEach(() => {
    cy.navigate(carousel).waitForWebComponents([carouselTag]);
    cy.getLfCore().then((lfCore) => {
      core = lfCore;
    });
  });

  it(`Should check that all <${carouselTag}> exist.`, () => {
    const fixtures = getCarouselFixtures(core);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(carouselTag, new Set(keys));
  });
});

describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check, shape } = CY_ATTRIBUTES;

  it(`lf-event`, () => {
    cy.navigate(carousel);
    const eventType: LfCarouselEvent = "lf-event";
    cy.checkEvent(carousel, eventType);
    cy.get(eventElement)
      .findCyElement(shape)
      .first()
      .scrollIntoView()
      .trigger("click", { force: true, x: 100, y: 100 });
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(carousel);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(carousel);
  });
});

describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(carousel);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(carouselTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(carouselTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(carouselTag, carouselName);
  });
});

describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(carousel);
  });
  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
