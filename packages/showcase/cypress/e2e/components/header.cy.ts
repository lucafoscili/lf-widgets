import { LfComponentName, LfComponentTag } from "@lf-widgets/foundations";
import { CY_CATEGORIES } from "../../support/constants";

const headerName: LfComponentName = "LfHeader";
const headerTag: LfComponentTag<typeof headerName> = "lf-header";
const header = headerTag.replace("lf-", "");

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(header);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.get(headerTag).then(($comp) => {
      cy.wrap($comp).should(async ($c) => {
        const c = $c[0] as HTMLLfHeaderElement;
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

    cy.get(headerTag).then(($comp) => {
      cy.wrap($comp).should(async ($c) => {
        const c = $c[0] as HTMLLfHeaderElement;
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
    cy.get(headerTag).should("exist").checkProps(headerTag, headerName, true);
  });
});
//#endregion
