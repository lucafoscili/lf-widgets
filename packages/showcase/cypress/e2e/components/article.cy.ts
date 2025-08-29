import {
  CY_ATTRIBUTES,
  LF_ARTICLE_PARTS,
  LfArticleEvent,
  LfArticleNode,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { getArticleFixtures } from "../../../src/components/lf-showcase/assets/data/article";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const articleName: LfComponentName = "LfArticle";
const articleTag: LfComponentTag<typeof articleName> = "lf-article";
const article = articleTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(article).waitForWebComponents([articleTag, "lf-code"]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });
  it(`Should check that all <${articleTag}> exist.`, () => {
    const fixtures = getArticleFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(articleTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check, shape } = CY_ATTRIBUTES;

  it(`lf-event`, () => {
    cy.navigate(article);
    const eventType: LfArticleEvent = "lf-event";
    cy.checkEvent(article, eventType);
    cy.get(eventElement).findCyElement(shape).first().scrollIntoView().click();
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(article);
    cy.getCyElement(check).should("exist");
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(article);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(article);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(articleTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(articleTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(articleTag, articleName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  const { lfComponentShowcase } = CY_ALIASES;
  const { emptyData } = LF_ARTICLE_PARTS;

  beforeEach(() => {
    cy.navigate(article);
  });
  it("lfDataset: Should check for the presence of shapes in the dataset.", () => {
    let firstNodeChildren: LfArticleNode[];

    cy.get(lfComponentShowcase)
      .find(articleTag)
      .first()
      .should("exist")
      .then(($comp) => {
        cy.wrap($comp)
          .should(async ($c) => {
            const { lfDataset } = $c[0] as HTMLLfArticleElement;
            firstNodeChildren = lfDataset.nodes[0]?.children || [];
          })
          .within(() => {
            cy.get("section")
              .should("have.length", firstNodeChildren.length)
              .each(($section, index) => {
                const child = firstNodeChildren[index];
                const shapeType = child.cells?.[1]?.shape;

                if (shapeType === "image") {
                  cy.wrap($section).find("img").should("exist");
                } else if (shapeType === "code") {
                  cy.wrap($section).find("lf-code").should("exist");
                } else {
                  cy.log(`No shape to check for index ${index}`);
                }
              });
          });
      });
  });
  it("lfEmpty: renders custom empty text when dataset empty", () => {
    const emptyText = "Nothing to see here";
    cy.get(lfComponentShowcase)
      .find(articleTag)
      .first()
      .should("exist")
      .then(($comp) => {
        cy.wrap($comp).should(async ($c) => {
          const c = $c[0] as HTMLLfArticleElement;
          c.lfEmpty = emptyText;
          c.lfDataset = { nodes: [] };
          if (c.refresh) await c.refresh();
        });
        cy.wrap($comp)
          .shadow()
          .find(`[part="${emptyData}"]`)
          .should("exist")
          .contains(emptyText);
      });
  });
  it("lfStyle: Should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
  it("lfUiSize: reflected as host attribute", () => {
    cy.get(lfComponentShowcase)
      .find(`${articleTag}#sizes-small`)
      .should("exist")
      .should("have.attr", "lf-ui-size", "small");
  });
});
//#endregion

//#region e2e
describe(CY_CATEGORIES.e2e, () => {
  const { lfComponentShowcase } = CY_ALIASES;

  beforeEach(() => {
    cy.navigate(article);
  });
  it(`Should check whether all <${articleTag}> elements have the correct number of <section> elements and matching content.`, () => {
    cy.get(lfComponentShowcase);

    cy.get(articleTag).each(($c) => {
      const { lfDataset } = $c[0] as HTMLLfArticleElement;
      const expectedSections = lfDataset.nodes[0].children;

      return cy
        .wrap($c)
        .shadow()
        .find("section")
        .should("have.length", expectedSections.length)
        .each(($section, index) => {
          const expectedValue = expectedSections[index].value;
          if (expectedValue) {
            cy.wrap($section).find("h2").should("have.text", expectedValue);
          }
        });
    });
  });
  it(`Should check whether all <${articleTag}> elements in the page have a number of <section> elements equal to the number of children of the first node of the lfDataset property and their content matches.`, () => {
    cy.get(lfComponentShowcase)
      .find(articleTag)
      .each(($c) => {
        const { lfDataset } = $c[0] as HTMLLfArticleElement;
        const expectedSectionCount = lfDataset.nodes[0].children.length;

        return cy
          .wrap($c)
          .shadow()
          .find("section")
          .should("have.length", expectedSectionCount)
          .each(($section, index) => {
            const expectedValue = lfDataset.nodes[0].children[index].value;
            return cy
              .wrap($section)
              .find("h2")
              .invoke("text")
              .then((h2Text) => {
                expect(h2Text).to.equal(expectedValue);
              });
          });
      });
  });
});
//#endregion
