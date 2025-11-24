import {
  CY_ATTRIBUTES,
  LfBreadcrumbsEvent,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { getBreadcrumbsFixtures } from "../../../src/components/lf-showcase/assets/data/breadcrumbs";
import { CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const componentName: LfComponentName = "LfBreadcrumbs";
const componentTag: LfComponentTag<typeof componentName> = "lf-breadcrumbs";
const component = componentTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(component).waitForWebComponents([componentTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${componentTag}> exist.`, () => {
    const fixtures = getBreadcrumbsFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(componentTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { node } = CY_ATTRIBUTES;

  it("click", () => {
    cy.navigate(component);
    const eventType: LfBreadcrumbsEvent = "click";
    cy.checkEvent(component, eventType);

    cy.get(`${componentTag}#uncategorized-basic`)
      .findCyElement(node)
      .first()
      .click();
    cy.getCyElement(CY_ATTRIBUTES.check).should("exist");
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(component);
  });

  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(componentTag);
  });

  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(componentTag);
  });

  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(componentTag, componentName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  beforeEach(() => {
    cy.navigate(component);
  });

  it("lfSeparator: should render custom separator text", () => {
    cy.get(`${componentTag}#uncategorized-customSeparator`)
      .shadow()
      .find(".breadcrumbs__separator")
      .first()
      .should("have.text", "/");
  });

  it("lfMaxItems: should render truncation entry", () => {
    cy.get(`${componentTag}#uncategorized-truncation`)
      .shadow()
      .find(".breadcrumbs__truncation")
      .should("exist");
  });

  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
