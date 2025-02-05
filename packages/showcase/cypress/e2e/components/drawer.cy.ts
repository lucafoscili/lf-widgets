import { LfComponentName, LfComponentTag } from "@lf-widgets/foundations";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";

const drawerName: LfComponentName = "LfDrawer";
const drawerTag: LfComponentTag<typeof drawerName> = "lf-drawer";
const drawer = drawerTag.replace("lf-", "");

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  const { lfComponentShowcase } = CY_ALIASES;

  beforeEach(() => {
    cy.navigate(drawer);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.get(lfComponentShowcase).get("#action-toggle").click();

    cy.get(drawerTag).then(($comp) => {
      cy.wrap($comp).should(async ($c) => {
        const c = $c[0] as HTMLLfDrawerElement;
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

    cy.get(lfComponentShowcase).get("#action-toggle").click();

    cy.get(drawerTag).then(($comp) => {
      cy.wrap($comp).should(async ($c) => {
        const c = $c[0] as HTMLLfDrawerElement;
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
    cy.get(lfComponentShowcase).get("#action-toggle").click();

    cy.get(drawerTag).should("exist").checkProps(drawerTag, drawerName, true);
  });
});
//#endregion
