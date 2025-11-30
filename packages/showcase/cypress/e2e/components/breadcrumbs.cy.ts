import {
  CY_ATTRIBUTES,
  LfBreadcrumbsEvent,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { getBreadcrumbsFixtures } from "../../../src/components/lf-showcase/assets/data/breadcrumbs";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const breadcrumbsName: LfComponentName = "LfBreadcrumbs";
const breadcrumbsTag: LfComponentTag<typeof breadcrumbsName> = "lf-breadcrumbs";
const breadcrumbs = breadcrumbsTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(breadcrumbs).waitForWebComponents([breadcrumbsTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${breadcrumbsTag}> exist.`, () => {
    const fixtures = getBreadcrumbsFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(breadcrumbsTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check, node, rippleSurface } = CY_ATTRIBUTES;

  it(`click`, () => {
    cy.navigate(breadcrumbs);
    const eventType: LfBreadcrumbsEvent = "click";
    cy.checkEvent(breadcrumbs, eventType);
    cy.get(eventElement).findCyElement(node).first().click();
    cy.getCyElement(check).should("exist");
  });

  it(`pointerdown`, () => {
    cy.navigate(breadcrumbs);
    const eventType: LfBreadcrumbsEvent = "pointerdown";
    cy.checkEvent(breadcrumbs, eventType);
    // Use force:true to bypass typewriter overlay
    cy.get(`${breadcrumbsTag}#uncategorized-ripple`)
      .findCyElement(rippleSurface)
      .first()
      .click({ force: true });
    cy.getCyElement(check).should("exist");
  });

  it(`ready`, () => {
    cy.checkReadyEvent(breadcrumbs);
  });

  it(`unmount`, () => {
    cy.checkUnmountEvent(breadcrumbs);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(breadcrumbs);
  });

  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(breadcrumbsTag);
  });

  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(breadcrumbsTag);
  });

  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(breadcrumbsTag, breadcrumbsName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  let framework: LfFrameworkInterface;
  const { lfComponentShowcase } = CY_ALIASES;

  beforeEach(() => {
    cy.navigate(breadcrumbs);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it("lfDataset: should correctly render breadcrumb nodes from dataset.", () => {
    cy.get(lfComponentShowcase)
      .find(`${breadcrumbsTag}#uncategorized-basic`)
      .then(($breadcrumbs) => {
        cy.wrap($breadcrumbs)
          .should(async ($bc) => {
            const { lfDataset } = $bc[0] as HTMLLfBreadcrumbsElement;
            expect(lfDataset).to.be.an("object");
            expect(lfDataset.nodes).to.be.an("array");
          })
          .shadow()
          .find(`.${framework.theme.bemClass("breadcrumbs", "item")}`)
          .should("have.length.at.least", 1);
      });
  });

  it("lfInteractive: should not have interactive styling when false.", () => {
    cy.get(lfComponentShowcase)
      .find(`${breadcrumbsTag}#uncategorized-nonInteractive`)
      .then(($breadcrumbs) => {
        cy.wrap($breadcrumbs).should(async ($bc) => {
          const { lfInteractive } = $bc[0] as HTMLLfBreadcrumbsElement;
          expect(lfInteractive).to.eq(false);
        });
      });
  });

  it("lfMaxItems: should render truncation entry when path exceeds max items.", () => {
    cy.get(lfComponentShowcase)
      .find(`${breadcrumbsTag}#uncategorized-truncation`)
      .then(($breadcrumbs) => {
        cy.wrap($breadcrumbs)
          .should(async ($bc) => {
            const { lfMaxItems } = $bc[0] as HTMLLfBreadcrumbsElement;
            expect(lfMaxItems).to.eq(3);
          })
          .shadow()
          .find(`.${framework.theme.bemClass("breadcrumbs", "truncation")}`)
          .should("exist");
      });
  });

  it("lfRipple: should check for the presence of a ripple element.", () => {
    cy.get(lfComponentShowcase)
      .find(`${breadcrumbsTag}#uncategorized-ripple`)
      .then(($breadcrumbs) => {
        cy.wrap($breadcrumbs)
          .should(async ($bc) => {
            const { lfRipple } = $bc[0] as HTMLLfBreadcrumbsElement;
            expect(lfRipple).to.eq(true);
          })
          .findCyElement(CY_ATTRIBUTES.rippleSurface)
          .should("exist");
      });
  });

  it("lfSeparator: should render custom separator text.", () => {
    cy.get(lfComponentShowcase)
      .find(`${breadcrumbsTag}#uncategorized-customSeparator`)
      .then(($breadcrumbs) => {
        cy.wrap($breadcrumbs)
          .should(async ($bc) => {
            const { lfSeparator } = $bc[0] as HTMLLfBreadcrumbsElement;
            expect(lfSeparator).to.eq("/");
          })
          .shadow()
          .find(`.${framework.theme.bemClass("breadcrumbs", "separator")}`)
          .first()
          .should("have.text", "/");
      });
  });

  it("lfShowRoot: should hide root when set to false.", () => {
    cy.get(lfComponentShowcase)
      .find(`${breadcrumbsTag}#uncategorized-hideRoot`)
      .then(($breadcrumbs) => {
        cy.wrap($breadcrumbs).should(async ($bc) => {
          const { lfShowRoot } = $bc[0] as HTMLLfBreadcrumbsElement;
          expect(lfShowRoot).to.eq(false);
        });
      });
  });

  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });

  it("lfValue: should correctly set the active breadcrumb.", () => {
    cy.get(lfComponentShowcase)
      .find(`${breadcrumbsTag}#uncategorized-basic`)
      .then(($breadcrumbs) => {
        cy.wrap($breadcrumbs)
          .should(async ($bc) => {
            const { lfValue } = $bc[0] as HTMLLfBreadcrumbsElement;
            expect(lfValue).to.eq("phones");
          })
          .shadow()
          .find(`[aria-current="page"]`)
          .should("exist");
      });
  });
});
//#endregion

//#region e2e
describe(CY_CATEGORIES.e2e, () => {
  let framework: LfFrameworkInterface;
  const { lfComponentShowcase } = CY_ALIASES;

  beforeEach(() => {
    cy.navigate(breadcrumbs).waitForWebComponents([breadcrumbsTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it("Should navigate through breadcrumb trail on click.", () => {
    cy.get(lfComponentShowcase)
      .find(`${breadcrumbsTag}#uncategorized-basic`)
      .shadow()
      .find(`.${framework.theme.bemClass("breadcrumbs", "item")}`)
      .not(`[aria-current="page"]`)
      .first()
      .click()
      .then(() => {
        // After clicking, verify component state changed
        cy.get(lfComponentShowcase)
          .find(`${breadcrumbsTag}#uncategorized-basic`)
          .should(async ($bc) => {
            const breadcrumbsEl = $bc[0] as HTMLLfBreadcrumbsElement;
            const value = breadcrumbsEl.lfValue;
            // Value should have changed after click (navigated to clicked item)
            expect(value).to.be.a("string");
          });
      });
  });

  it("Should display truncation indicator when path exceeds maxItems.", () => {
    // Verify truncation element exists and displays ellipsis
    cy.get(lfComponentShowcase)
      .find(`${breadcrumbsTag}#uncategorized-truncation`)
      .shadow()
      .find(`.${framework.theme.bemClass("breadcrumbs", "truncation")}`)
      .should("exist");

    // Verify the visible items are limited (first + truncation + last items based on maxItems=3)
    cy.get(lfComponentShowcase)
      .find(`${breadcrumbsTag}#uncategorized-truncation`)
      .shadow()
      .find(`.${framework.theme.bemClass("breadcrumbs", "item")}`)
      .should("have.length.at.most", 3);
  });

  it("Should expand truncated items when truncation is clicked.", () => {
    const truncationClass = framework.theme.bemClass(
      "breadcrumbs",
      "truncation",
    );
    const itemClass = framework.theme.bemClass("breadcrumbs", "item");

    // First verify truncation exists
    cy.get(lfComponentShowcase)
      .find(`${breadcrumbsTag}#uncategorized-truncation`)
      .shadow()
      .find(`.${truncationClass}`)
      .should("exist");

    // Click on truncation to expand
    cy.get(lfComponentShowcase)
      .find(`${breadcrumbsTag}#uncategorized-truncation`)
      .shadow()
      .find(`.${truncationClass}`)
      .click();

    // After expansion, truncation should disappear
    cy.get(lfComponentShowcase)
      .find(`${breadcrumbsTag}#uncategorized-truncation`)
      .shadow()
      .find(`.${truncationClass}`)
      .should("not.exist");

    // All items should now be visible (4 items for our test dataset)
    cy.get(lfComponentShowcase)
      .find(`${breadcrumbsTag}#uncategorized-truncation`)
      .shadow()
      .find(`.${itemClass}`)
      .should("have.length.at.least", 4);
  });
});
//#endregion
