import {
  LfComponentName,
  LfComponentTag,
  LfThemeInterface,
} from "@lf-widgets/foundations";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";

const splashName: LfComponentName = "LfSplash";
const splashTag: LfComponentTag<typeof splashName> = "lf-splash";
const splash = splashTag.replace("lf-", "");

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  const { lfComponentShowcase } = CY_ALIASES;

  beforeEach(() => {
    cy.navigate(splash);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.get(lfComponentShowcase).get("#action-customLabel").click();
    cy.get(splashTag).then(($comp) => {
      cy.wrap($comp).should(async ($c) => {
        const c = $c[0] as HTMLLfSplashElement;
        c.getDebugInfo().then((debugInfo) => {
          expect(debugInfo).to.have.property("endTime").that.is.a("number");
          expect(debugInfo).to.have.property("renderCount").that.is.a("number");
          expect(debugInfo).to.have.property("renderEnd").that.is.a("number");
          expect(debugInfo).to.have.property("renderStart").that.is.a("number");
          expect(debugInfo).to.have.property("startTime").that.is.a("number");
        });
      });
    });
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    let initialRenderCount: number;

    cy.get(lfComponentShowcase).get("#action-customLabel").click();
    cy.get(splashTag).then(($comp) => {
      cy.wrap($comp).should(async ($c) => {
        const c = $c[0] as HTMLLfSplashElement;
        const debugInfo = await c.getDebugInfo();
        initialRenderCount = debugInfo.renderCount;
        await c.refresh();
        requestAnimationFrame(async () => {
          const { renderCount } = await c.getDebugInfo();
          expect(renderCount).to.be.greaterThan(initialRenderCount);
        });
      });
    });
  });
  it(`getProps: check keys against props array.`, () => {
    cy.get(lfComponentShowcase).get("#action-customStyle").click();
    cy.get(splashTag).should("exist").checkProps(splashTag, splashName, true);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  const { lfComponentShowcase } = CY_ALIASES;

  beforeEach(() => {
    cy.navigate(splash);
  });
  it("Should check for the presence of a <style> element with id lf-style.", () => {
    cy.get(lfComponentShowcase).get("#action-customStyle").click();
    cy.get(splashTag).shadow().find("style").eq(1).should("not.be.empty");
  });
  it("lfLabel: should check that the label is different from the default (Loading...)", () => {
    let bemClass: LfThemeInterface["bemClass"];

    cy.get(lfComponentShowcase).get("#action-customLabel").click();
    cy.get(splashTag)
      .shadow()
      .within(($splash) => {
        cy.getLfFramework()
          .then((lfFramework) => {
            bemClass = lfFramework.theme.bemClass;
          })
          .then(() => {
            const splash = $splash[0] as HTMLLfSplashElement;
            const selector = `.${bemClass("splash", "label")}`;

            expect(splash).to.exist;
            cy.wrap(splash)
              .find(selector)
              .should("not.have.text", "Loading...");
          });
      });
  });
});
//#endregion
