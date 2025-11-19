import {
  CY_ATTRIBUTES,
  LfAutocompleteEvent,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { getAutocompleteFixtures } from "../../../src/components/lf-showcase/assets/data/autocomplete";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const autocompleteName: LfComponentName = "LfAutocomplete";
const autocompleteTag: LfComponentTag<typeof autocompleteName> =
  "lf-autocomplete";
const autocomplete = autocompleteTag.replace("lf-", "");

const simpleExampleId = "uncategorized-simple";
const withMinCharsExampleId = "uncategorized-withMinChars";

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(autocomplete).waitForWebComponents([autocompleteTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${autocompleteTag}> exist.`, () => {
    const fixtures = getAutocompleteFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(autocompleteTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check, input, node, portal, dropdownMenu } = CY_ATTRIBUTES;

  it(`change`, () => {
    cy.navigate(autocomplete);
    const eventType: LfAutocompleteEvent = "change";
    cy.checkEvent(autocomplete, eventType);

    cy.get(eventElement).findCyElement(input).type("uni");
    cy.wait(400);
    cy.getCyElement(portal)
      .findCyElement(dropdownMenu)
      .should("exist")
      .findCyElement(node)
      .first()
      .click();
    cy.getCyElement(check).should("exist");
  });
  it(`input`, () => {
    cy.navigate(autocomplete);
    const eventType: LfAutocompleteEvent = "input";
    cy.checkEvent(autocomplete, eventType);

    cy.get(eventElement).findCyElement(input).type("can");
    cy.getCyElement(check).should("exist");
  });
  it(`lf-event`, () => {
    cy.navigate(autocomplete);
    const eventType: LfAutocompleteEvent = "lf-event";
    cy.checkEvent(autocomplete, eventType);

    cy.get(eventElement).findCyElement(input).type("ger");
    cy.getCyElement(check).should("exist");
  });
  it(`request`, () => {
    cy.navigate(autocomplete);
    const eventType: LfAutocompleteEvent = "request";
    cy.checkEvent(autocomplete, eventType);

    cy.get(eventElement).findCyElement(input).type("aus");
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(autocomplete);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(autocomplete);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(autocomplete);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(autocompleteTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(autocompleteTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(autocompleteTag, autocompleteName);
  });
  it(`clearCache: should clear internal cache.`, () => {
    cy.get(`${autocompleteTag}#${simpleExampleId}`)
      .first()
      .then(($autocomplete) => {
        cy.wrap($autocomplete).should(async ($comp) => {
          const comp = $comp[0] as HTMLLfAutocompleteElement;
          await comp.clearCache();
          expect(comp).to.exist;
        });
      });
  });
  it(`clearInput: should clear the input value.`, () => {
    cy.get(`${autocompleteTag}#${simpleExampleId}`)
      .first()
      .then(($autocomplete) => {
        cy.wrap($autocomplete).should(async ($comp) => {
          const comp = $comp[0] as HTMLLfAutocompleteElement;
          await comp.setValue("test");
          await comp.clearInput();
          const value = await comp.getValue();
          expect(value).to.equal("");
        });
      });
  });
  it(`getValue/setValue: should get and set the input value.`, () => {
    cy.get(`${autocompleteTag}#${simpleExampleId}`)
      .first()
      .then(($autocomplete) => {
        cy.wrap($autocomplete).should(async ($comp) => {
          const comp = $comp[0] as HTMLLfAutocompleteElement;
          const testValue = "Canada";
          await comp.setValue(testValue);
          const value = await comp.getValue();
          expect(value).to.equal(testValue);
        });
      });
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  const { lfComponentShowcase } = CY_ALIASES;

  beforeEach(() => {
    cy.navigate(autocomplete);
  });
  it("lfDebounceMs: should have configurable debounce delay.", () => {
    cy.get(lfComponentShowcase)
      .find(`${autocompleteTag}[id*="withDebounce"]`)
      .first()
      .then(($autocomplete) => {
        cy.wrap($autocomplete).should(async ($comp) => {
          const { lfDebounceMs } = $comp[0] as HTMLLfAutocompleteElement;
          expect(lfDebounceMs).to.be.a("number");
          expect(lfDebounceMs).to.be.greaterThan(0);
        });
      });
  });
  it("lfMinChars: should have minimum character threshold.", () => {
    cy.get(lfComponentShowcase)
      .find(`${autocompleteTag}[id*="withMinChars"]`)
      .first()
      .then(($autocomplete) => {
        cy.wrap($autocomplete).should(async ($comp) => {
          const { lfMinChars } = $comp[0] as HTMLLfAutocompleteElement;
          expect(lfMinChars).to.be.a("number");
          expect(lfMinChars).to.be.greaterThan(1);
        });
      });
  });
  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
  it("lfTextfieldProps: should pass props to textfield.", () => {
    cy.get(lfComponentShowcase)
      .find(`${autocompleteTag}`)
      .first()
      .then(($autocomplete) => {
        cy.wrap($autocomplete).should(async ($comp) => {
          const { lfTextfieldProps } = $comp[0] as HTMLLfAutocompleteElement;
          expect(lfTextfieldProps).to.be.an("object");
        });
      });
  });
});
//#endregion

//#region e2e
describe(CY_CATEGORIES.e2e, () => {
  const { input, node, portal, dropdownMenu } = CY_ATTRIBUTES;

  it("should filter results based on user input", () => {
    cy.navigate(autocomplete);
    cy.get(`${autocompleteTag}#${simpleExampleId}`)
      .first()
      .within(() => {
        cy.getCyElement(input).type("uni");
      });

    cy.wait(400);
    cy.getCyElement(portal)
      .findCyElement(dropdownMenu)
      .should("exist")
      .findCyElement(node)
      .should("have.length.greaterThan", 0);
  });
  it("should select an option and close dropdown", () => {
    cy.navigate(autocomplete);
    cy.get(`${autocompleteTag}#${simpleExampleId}`)
      .first()
      .within(() => {
        cy.getCyElement(input).type("can");
      });

    cy.wait(400);
    cy.getCyElement(portal)
      .findCyElement(dropdownMenu)
      .should("exist")
      .findCyElement(node)
      .first()
      .click();

    cy.getCyElement(portal).findCyElement(dropdownMenu).should("not.exist");
  });
  it("should respect minimum character threshold", () => {
    cy.navigate(autocomplete);
    cy.get(`${autocompleteTag}#${withMinCharsExampleId}`)
      .first()
      .within(() => {
        cy.getCyElement(input).type("ab");
      });

    cy.wait(400);
    cy.getCyElement(portal).findCyElement(dropdownMenu).should("not.exist");

    cy.get(`${autocompleteTag}#${withMinCharsExampleId}`)
      .first()
      .within(() => {
        cy.getCyElement(input).clear().type("abc");
      });

    cy.wait(400);
    cy.getCyElement(portal).findCyElement(dropdownMenu).should("exist");
  });
});
//#endregion
