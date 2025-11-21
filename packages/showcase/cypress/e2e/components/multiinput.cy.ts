import {
  CY_ATTRIBUTES,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfMultiInputEvent,
} from "@lf-widgets/foundations";
import { getMultiInputFixtures } from "../../../src/components/lf-showcase/assets/data/multiinput";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const componentName: LfComponentName = "LfMultiInput";
const componentTag: LfComponentTag<typeof componentName> = "lf-multiinput";
const componentSlug = componentTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(componentSlug).waitForWebComponents([componentTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${componentTag}> exist.`, () => {
    const fixtures = getMultiInputFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(componentTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check, input } = CY_ATTRIBUTES;

  it(`input`, () => {
    cy.navigate(componentSlug);
    const eventType: LfMultiInputEvent = "input";
    cy.checkEvent(componentSlug, eventType);
    cy.get(eventElement).findCyElement(input).first().type("hello");
    cy.getCyElement(check).should("exist");
  });

  it(`change`, () => {
    cy.navigate(componentSlug);
    const eventType: LfMultiInputEvent = "change";
    cy.checkEvent(componentSlug, eventType);
    cy.get(eventElement)
      .findCyElement(input)
      .first()
      .focus()
      .type("committed{enter}")
      .blur();
    cy.getCyElement(check).should("exist");
  });

  it(`select-history`, () => {
    cy.navigate(componentSlug);
    const eventType: LfMultiInputEvent = "select-history";
    cy.checkEvent(componentSlug, eventType);

    cy.contains(".example__description", "History mode with preset dataset")
      .parents(".example")
      .within(() => {
        cy.get('[data-cy="showcase-example"]')
          .findCyElement(CY_ATTRIBUTES.node)
          .first()
          .click();
      });

    cy.getCyElement(check).should("exist");
  });

  it(`clear-history`, () => {
    cy.navigate(componentSlug);
    const eventType: LfMultiInputEvent = "clear-history";
    cy.checkEvent(componentSlug, eventType);

    cy.contains(".example__description", "History mode with preset dataset")
      .parents(".example")
      .within(() => {
        cy.get('[data-cy="showcase-example"]')
          .findCyElement(CY_ATTRIBUTES.maskedSvg)
          .click();
      });

    cy.getCyElement(check).should("exist");
  });

  it(`ready`, () => {
    cy.checkReadyEvent(componentSlug);
  });

  it(`unmount`, () => {
    cy.checkUnmountEvent(componentSlug);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(componentSlug);
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
    cy.navigate(componentSlug);
  });

  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });

  it("history: free input should populate chips on change", () => {
    const { input, node } = CY_ATTRIBUTES;

    cy.contains(".example__description", "History mode with free input")
      .parents(".example")
      .within(() => {
        cy.get('[data-cy="showcase-example"]')
          .findCyElement(input)
          .first()
          .focus()
          .type("my prompt{enter}")
          .blur();
        cy.get('[data-cy="showcase-example"]')
          .findCyElement(node)
          .contains("my prompt")
          .should("exist");
      });
  });

  it("tags: free input should create new tags when allowed", () => {
    const { input, node } = CY_ATTRIBUTES;

    cy.contains(".example__description", "Tags mode with free input allowed")
      .parents(".example")
      .within(() => {
        cy.get('[data-cy="showcase-example"]')
          .findCyElement(input)
          .first()
          .focus()
          .type("new-tag-1, new-tag-2{enter}")
          .blur();
        cy.get('[data-cy="showcase-example"]')
          .findCyElement(node)
          .contains("new-tag-1")
          .should("exist");
        cy.get('[data-cy="showcase-example"]')
          .findCyElement(node)
          .contains("new-tag-2")
          .should("exist");
      });
  });
});
//#endregion
