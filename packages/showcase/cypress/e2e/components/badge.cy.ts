import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_BADGE_CSS_VARS,
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
  let framework: LfFrameworkInterface;
  const { lfComponentShowcase } = CY_ALIASES;
  const { success } = LF_ATTRIBUTES;

  beforeEach(() => {
    cy.navigate(badge);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });
  it(`lfImageProps: should check for the presence of the correct <lf-image>, as an icon, inside <${badgeTag}>.`, () => {
    const imageIconClass = framework.theme.bemClass("image", "icon");

    cy.get(lfComponentShowcase)
      .find(`${badgeTag}#uncategorized-icon`)
      .as("badgeWithIcon");

    cy.get("@badgeWithIcon")
      .invoke("prop", "lfImageProps")
      .then((lfImageProps: LfImagePropsInterface) => {
        cy.get("@badgeWithIcon")
          .shadow()
          .find("lf-image")
          .should("have.prop", "lfValue", lfImageProps.lfValue)
          .shadow()
          .find(`.${imageIconClass}`)
          .should("exist");
      });
  });
  it(`lfImageProps: should check for the presence of the correct <lf-image>, as an image, inside <${badgeTag}>.`, () => {
    const imageImgClass = framework.theme.bemClass("image", "img");

    cy.get(lfComponentShowcase)
      .find(`${badgeTag}#uncategorized-image`)
      .as("badgeWithImage");

    cy.get("@badgeWithImage")
      .invoke("prop", "lfImageProps")
      .then((lfImageProps: LfImagePropsInterface) => {
        cy.get("@badgeWithImage")
          .shadow()
          .find("lf-image")
          .should("have.prop", "lfValue", lfImageProps.lfValue)
          .shadow()
          .find(`.${imageImgClass}`)
          .should("exist");
      });
  });
  it(`lfLabel: Should check that the badge block inside the empty <${badgeTag}> is actually empty.`, () => {
    const badgeBlock = framework.theme.bemClass("badge");

    cy.get(lfComponentShowcase)
      .find(`${badgeTag}#uncategorized-empty`)
      .shadow()
      .find(`.${badgeBlock}`)
      .should("be.empty");
  });
  it(`lfLabel: should check that the badge block inside the <${badgeTag}> is not empty.`, () => {
    const badgeBlock = framework.theme.bemClass("badge");

    cy.get(lfComponentShowcase)
      .find(`${badgeTag}#uncategorized-label`)
      .shadow()
      .find(`.${badgeBlock}`)
      .should("not.be.empty");
  });
  it("lfPosition: reflected as host attribute", () => {
    cy.get(lfComponentShowcase)
      .find(`${badgeTag}#positions-top-right`)
      .should("exist")
      .should("have.attr", "lf-position", "top-right");
  });
  it("lfPosition: inline positions disable transforms", () => {
    const transformVar = LF_BADGE_CSS_VARS.transform;

    cy.get(lfComponentShowcase)
      .find(`${badgeTag}#positions-inline`)
      .should("exist")
      .as("inlineBadge");

    cy.get("@inlineBadge")
      .should("have.attr", "lf-position", "inline")
      .shadow()
      .find("style#lf-style")
      .invoke("text")
      .then((styleContent) => {
        expect(styleContent).to.include(`${transformVar}: none`);
      });
  });
  it("lfPosition: anchored positions set offsets", () => {
    const transformVar = LF_BADGE_CSS_VARS.transform;

    cy.get(lfComponentShowcase)
      .find(`${badgeTag}#positions-top-right`)
      .should("exist")
      .as("anchoredBadge");

    cy.get("@anchoredBadge")
      .shadow()
      .find("style#lf-style")
      .invoke("text")
      .then((styleContent) => {
        expect(styleContent).to.include("top: 0");
        expect(styleContent).to.include("right: 0");
        expect(styleContent).to.include(`${transformVar}: translate(50%, -50%)`);
      });
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
  it("lfUiState: reflected on badge via data-lf and renders themed icon", () => {
    const badgeBlock = framework.theme.bemClass("badge");
    const imageIconClass = framework.theme.bemClass("image", "icon");

    cy.get(lfComponentShowcase)
      .find(`${badgeTag}#states-${success}`)
      .should("exist")
      .as("stateBadge");

    cy.get("@stateBadge")
      .shadow()
      .find(`.${badgeBlock}`)
      .should("have.attr", "data-lf", success);

    cy.get("@stateBadge")
      .invoke("prop", "lfImageProps")
      .then((lfImageProps: LfImagePropsInterface) => {
        expect(lfImageProps?.lfValue).to.be.a("string").and.not.be.empty;

        cy.get("@stateBadge")
          .shadow()
          .find("lf-image")
          .should("have.prop", "lfValue", lfImageProps.lfValue)
          .shadow()
          .find(`.${imageIconClass}`)
          .should("exist");
      });
  });
});
//#endregion

//#region e2e
describe(CY_CATEGORIES.e2e, () => {
  const { lfComponentShowcase } = CY_ALIASES;
  const transformVar = LF_BADGE_CSS_VARS.transform;

  beforeEach(() => {
    cy.navigate(badge).waitForWebComponents([badgeTag]);
  });
  it(`lfPosition: updates placement when changed at runtime.`, () => {
    cy.get(lfComponentShowcase)
      .find(`${badgeTag}#positions-top-left`)
      .should("exist")
      .as("runtimeBadge");

    cy.get("@runtimeBadge")
      .then(($badge) => {
        cy.wrap($badge).should(async ($b) => {
          const badgeElement = $b[0] as HTMLLfBadgeElement;
          badgeElement.lfPosition = "inline";
          await badgeElement.refresh();
        });
      });

    cy.get("@runtimeBadge")
      .should("have.attr", "lf-position", "inline")
      .shadow()
      .find("style#lf-style")
      .invoke("text")
      .then((styleContent) => {
        expect(styleContent).to.include(`${transformVar}: none`);
      });
  });
});
//#endregion
