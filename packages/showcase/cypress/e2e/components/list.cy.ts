import {
  CY_ATTRIBUTES,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfDataDataset,
  LfListEvent,
} from "@lf-widgets/foundations";
import { getListFixtures } from "../../../src/components/lf-showcase/assets/data/list";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const listName: LfComponentName = "LfList";
const listTag: LfComponentTag<typeof listName> = "lf-list";
const list = listTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(list).waitForWebComponents([listTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${listTag}> exist.`, () => {
    const fixtures = getListFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(listTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { button, check, node } = CY_ATTRIBUTES;

  it(`blur`, () => {
    cy.navigate(list);
    const eventType: LfListEvent = "blur";
    cy.checkEvent(list, eventType);

    cy.get(`${listTag}#uncategorized-enableDeletion`)
      .findCyElement(node)
      .first()
      .focus()
      .blur();
    cy.getCyElement(check).should("exist");
  });
  it(`click`, () => {
    cy.navigate(list);
    const eventType: LfListEvent = "click";
    cy.checkEvent(list, eventType);

    cy.get(`${listTag}#uncategorized-enableDeletion`)
      .findCyElement(node)
      .first()
      .click();
    cy.getCyElement(check).should("exist");
  });
  it("delete", () => {
    cy.navigate(list);
    const eventType: LfListEvent = "delete";
    cy.checkEvent(list, eventType);

    cy.get(`${listTag}#uncategorized-enableDeletion`)
      .findCyElement(node)
      .first()
      .trigger("mouseover");

    cy.get(`${listTag}#uncategorized-enableDeletion`)
      .findCyElement(button)
      .first()
      .click({ force: true });

    cy.getCyElement(check).should("exist");
  });
  it(`focus`, () => {
    cy.navigate(list);
    const eventType: LfListEvent = "focus";
    cy.checkEvent(list, eventType);

    cy.get(`${listTag}#uncategorized-enableDeletion`)
      .findCyElement(node)
      .first()
      .focus();
    cy.getCyElement(CY_ATTRIBUTES.check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(list);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(list);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(list);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(listTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(listTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(listTag, listName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  const { lfComponentShowcase } = CY_ALIASES;
  const { button } = CY_ATTRIBUTES;

  beforeEach(() => {
    cy.navigate(list);
  });
  it(`lfEnableDeletion: should check for the presence of deletion buttons and that their click actually removes the item from the dataset.`, () => {
    cy.get(lfComponentShowcase)
      .find(`${listTag}#uncategorized-enableDeletion`)
      .invoke("prop", "lfDataset")
      .then((initialLfData: LfDataDataset) => {
        const initialCopy = JSON.parse(JSON.stringify(initialLfData));

        console.log("Initial dataset length:", initialLfData.nodes.length);

        cy.get(lfComponentShowcase)
          .find(`${listTag}#uncategorized-enableDeletion`)
          .shadow()
          .find(".list__item")
          .first()
          .trigger("mouseover");

        cy.get(lfComponentShowcase)
          .find(`${listTag}#uncategorized-enableDeletion`)
          .findCyElement(button)
          .first()
          .click({ force: true });

        cy.get(lfComponentShowcase)
          .find(`${listTag}#uncategorized-enableDeletion`)
          .invoke("prop", "lfDataset")
          .then((finalLfData: LfDataDataset) => {
            const delta = initialCopy.nodes.length - finalLfData.nodes.length;
            console.log("Delta:", delta);

            assert(
              delta === 1,
              `One item was not removed from the dataset. Expected difference: 1, Actual difference: ${delta}`,
            );
          });
      });
  });
  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});
//#endregion
