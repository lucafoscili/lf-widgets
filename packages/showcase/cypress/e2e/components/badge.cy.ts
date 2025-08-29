import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LfBadgeEvent,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfImagePropsInterface,
} from "@lf-widgets/foundations";
import { getBadgeFixtures } from "../../../src/components/lf-showcase/assets/data/badge";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const badgeName: LfComponentName = "LfBadge";
const badgeTag: LfComponentTag<typeof badgeName> = "lf-badge";
const badge = badgeTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(badge).waitForWebComponents([badgeTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });
  it(`Should check that all <${badgeTag}> exist.`, () => {
    const fixtures = getBadgeFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(badgeTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check } = CY_ATTRIBUTES;

  it(`click`, () => {
    cy.navigate(badge);
    const eventType: LfBadgeEvent = "click";
    cy.checkEvent(badge, eventType);
    cy.get(eventElement).click();
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(badge);
    cy.getCyElement(check).should("exist");
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(badge);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(badge);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(badgeTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(badgeTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(badgeTag, badgeName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  const { lfComponentShowcase } = CY_ALIASES;
  const { success } = LF_ATTRIBUTES;

  beforeEach(() => {
    cy.navigate(badge);
  });
  it(`lfImageProps: should check for the presence of the correct <lf-image>, as an icon, inside <${badgeTag}>.`, () => {
    cy.get(lfComponentShowcase)
      .find(`${badgeTag}#uncategorized-icon`)
      .invoke("prop", "lfImageProps")
      .then((lfImageProps: LfImagePropsInterface) => {
        cy.get(lfComponentShowcase)
          .get(`${badgeTag}#uncategorized-icon`)
          .shadow()
          .find("lf-image")
          .should("have.prop", "lfValue", lfImageProps.lfValue)
          .shadow()
          .find(".image__icon")
          .should("exist");
      });
  });
  it(`lfImageProps: should check for the presence of the correct <lf-image, as an image, inside <${badgeTag}>.`, () => {
    cy.get(lfComponentShowcase)
      .find(`${badgeTag}#uncategorized-image`)
      .invoke("prop", "lfImageProps")
      .then((lfImageProps: LfImagePropsInterface) => {
        cy.get(lfComponentShowcase)
          .find(`${badgeTag}#uncategorized-image`)
          .shadow()
          .find("lf-image")
          .should("have.prop", "lfValue", lfImageProps.lfValue)
          .shadow()
          .find("img")
          .should("exist");
      });
  });
  it(`lfLabel: Should check that .${badge} inside the empty <${badgeTag}> is actually empty.`, () => {
    cy.get(lfComponentShowcase)
      .find(`${badgeTag}#uncategorized-empty`)
      .shadow()
      .find(`.${badge}`)
      .should("be.empty");
  });
  it(`lfLabel: should check that .${badge} inside the <${badgeTag}> is not empty.`, () => {
    cy.get(lfComponentShowcase)
      .find(`${badgeTag}#uncategorized-label`)
      .shadow()
      .find(`.${badge}`)
      .should("not.be.empty");
  });
  it("lfPosition: reflected as host attribute", () => {
    cy.get(lfComponentShowcase)
      .find(`${badgeTag}#positions-top-right`)
      .should("exist")
      .should("have.attr", "lf-position", "top-right");
  });
  it("lfStyle: Should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
  it("lfUiSize: reflected as host attribute", () => {
    cy.get(lfComponentShowcase)
      .find(`${badgeTag}#sizes-small`)
      .should("exist")
      .should("have.attr", "lf-ui-size", "small");
  });
  it("lfUiState: reflected on badge via data-lf", () => {
    cy.get(lfComponentShowcase)
      .find(`${badgeTag}#states-${success}`)
      .should("exist")
      .shadow()
      .find(`.${badge}`)
      .should("have.attr", "data-lf", success);
  });
});
//#endregion
