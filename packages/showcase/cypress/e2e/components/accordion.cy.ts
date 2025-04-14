import {
  CY_ATTRIBUTES,
  LfAccordionEvent,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { getAccordionFixtures } from "../../../src/components/lf-showcase/assets/data/accordion";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const accordionName: LfComponentName = "LfAccordion";
const accordionTag: LfComponentTag<typeof accordionName> = "lf-accordion";
const accordion = accordionTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(accordion).waitForWebComponents([accordionTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });
  it(`Should check that all <${accordionTag}> exist.`, () => {
    const fixtures = getAccordionFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(accordionTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { button, check } = CY_ATTRIBUTES;

  it(`click`, () => {
    cy.navigate(accordion);
    const eventType: LfAccordionEvent = "click";
    cy.checkEvent(accordion, eventType);
    cy.get(eventElement).findCyElement(button).first().click();
    cy.getCyElement(check).should("exist");
  });
  it(`pointerdown`, () => {
    cy.navigate(accordion);
    const eventType: LfAccordionEvent = "pointerdown";
    cy.checkEvent(accordion, eventType);
    cy.get(eventElement).findCyElement(button).first().click();
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(accordion);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(accordion);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  const { lfComponentShowcase } = CY_ALIASES;
  const { button } = CY_ATTRIBUTES;

  beforeEach(() => {
    cy.navigate(accordion);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(accordionTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(accordionTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(accordionTag, accordionName);
  });
  it(`getSelectedNodes: asserts that the payload of the promise includes the selected node.`, () => {
    cy.get(lfComponentShowcase)
      .find(accordionTag)
      .first()
      .within(($comp) => {
        cy.getCyElement(button).first().click();

        cy.wrap($comp).should(async ($c) => {
          const c = $c[0] as HTMLLfAccordionElement;
          c.getSelectedNodes().then((selectedNodes) => {
            expect(selectedNodes.size).to.equal(1);
          });
        });
      });
  });
  it(`toggleNode: asserts that the method correctly selects the node.`, () => {
    cy.get(lfComponentShowcase)
      .find(accordionTag)
      .first()
      .then(($comp) => {
        cy.wrap($comp).should(async ($c) => {
          const c = $c[0] as HTMLLfAccordionElement;
          c.getSelectedNodes().then((selectedNodes) => {
            expect(selectedNodes.size).to.equal(0);
          });
          c.toggleNode("3");
          c.getSelectedNodes().then((selectedNodes) => {
            expect(selectedNodes.size).to.equal(1);
          });
        });
      });
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  const { lfComponentShowcase } = CY_ALIASES;
  const { node } = CY_ATTRIBUTES;

  beforeEach(() => {
    cy.navigate(accordion);
  });
  it("lfDataset: should check that for each node a corresponding element exists.", () => {
    cy.get(lfComponentShowcase)
      .find(accordionTag)
      .first()
      .should("exist")
      .then(($comp) => {
        cy.wrap($comp).should(async ($c) => {
          const { lfDataset } = $c[0] as HTMLLfAccordionElement;
          const nodeCount = lfDataset.nodes.length;
          const elements = $c[0].shadowRoot.querySelectorAll(
            `[data-cy="${node}"]`,
          );
          expect(nodeCount).to.equal(elements.length);
        });
      });
  });
  it("lfRipple: should check for the presence of a ripple element.", () => {
    cy.checkRipple(accordionTag);
  });
  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion

//#region e2e
describe(CY_CATEGORIES.e2e, () => {
  let framework: LfFrameworkInterface;
  const { lfComponentShowcase } = CY_ALIASES;
  const { node } = CY_ATTRIBUTES;

  beforeEach(() => {
    cy.navigate(accordion);

    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });
  it("Should check that when an expandable item is clicked, the content is displayed.", () => {
    cy.get(lfComponentShowcase)
      .find(accordionTag)
      .first()
      .should("exist")
      .within(() => {
        cy.getCyElement(node).first().should("exist").click();

        cy.get(`.${framework.theme.bemClass("node", "content")}`)
          .should("exist")
          .and("not.be.empty");
      });
  });
  it("Should check that when a previously expanded item is clicked the node is collapsed.", () => {
    cy.get(lfComponentShowcase)
      .find(accordionTag)
      .first()
      .should("exist")
      .then(async ($comp) => {
        cy.wrap($comp).should(async ($c) => {
          const c = $c[0] as HTMLLfAccordionElement;

          const { id } = c.lfDataset.nodes[0];
          await c.toggleNode(id);
        });
      })
      .within(() => {
        cy.get(`.${framework.theme.bemClass("node", "content")}`)
          .should("exist")
          .and("not.be.empty");

        cy.get(`.${framework.theme.bemClass("node", "header")}`)
          .first()
          .click({ force: true });

        cy.get(`.${framework.theme.bemClass("node", "content")}`).should(
          "not.exist",
        );
      });
  });
});
//#endregion
