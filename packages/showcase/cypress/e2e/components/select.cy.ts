import {
  CY_ATTRIBUTES,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfSelectEvent,
} from "@lf-widgets/foundations";
import { getSelectFixtures } from "../../../src/components/lf-showcase/assets/data/select";
import { LfShowcaseComponentFixture } from "../../../src/components/lf-showcase/lf-showcase-declarations";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const selectName: LfComponentName = "LfSelect";
const selectTag: LfComponentTag<typeof selectName> = "lf-select";
const select = selectTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(select).waitForWebComponents([selectTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${selectTag}> exist.`, () => {
    const fixtures = getSelectFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(selectTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check, input, node } = CY_ATTRIBUTES;
  let framework: LfFrameworkInterface;
  let fixtures: LfShowcaseComponentFixture<"lf-select">;

  beforeEach(() => {
    cy.navigate(select);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
      fixtures = getSelectFixtures(framework);
    });
  });

  it(`change`, () => {
    const eventType: LfSelectEvent = "change";
    cy.checkEvent(select, eventType);

    cy.get(eventElement).findCyElement(input).click();
    cy.getCyElement(node).first().click();
    cy.getCyElement(check).should("exist");
  });
  it(`lf-event`, () => {
    const eventType: LfSelectEvent = "lf-event";
    cy.checkEvent(select, eventType);

    cy.get(eventElement).findCyElement(input).click();
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(select);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(select);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  let framework: LfFrameworkInterface;
  let fixtures: LfShowcaseComponentFixture<"lf-select">;
  let keys: string[];

  beforeEach(() => {
    cy.navigate(select);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
      fixtures = getSelectFixtures(framework);
      keys = getExamplesKeys(fixtures);
    });
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(selectTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(selectTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(selectTag, selectName);
  });
  it(`getSelectedIndex: should return the selected index.`, () => {
    const withValueKey = keys.find((k) => k === "uncategorized-withValue");
    cy.get(`${selectTag}#${withValueKey}`)
      .first()
      .then(($select) => {
        cy.wrap($select).should(async ($comp) => {
          const comp = $comp[0] as HTMLLfSelectElement;
          const index = await comp.getSelectedIndex();
          expect(index).to.be.a("number");
          expect(index).to.be.at.least(0);
        });
      });
  });
  it(`getValue: should return the selected node.`, () => {
    const withValueKey = keys.find((k) => k === "uncategorized-withValue");
    cy.get(`${selectTag}#${withValueKey}`)
      .first()
      .then(($select) => {
        cy.wrap($select).should(async ($comp) => {
          const comp = $comp[0] as HTMLLfSelectElement;
          const value = await comp.getValue();
          expect(value).to.be.an("object");
          expect(value).to.have.property("id");
          expect(value).to.have.property("value");
        });
      });
  });
  it(`setValue: should set the selected value by id.`, () => {
    const simpleKey = keys.find((k) => k === "uncategorized-simple");
    cy.get(`${selectTag}#${simpleKey}`)
      .first()
      .then(($select) => {
        cy.wrap($select).should(async ($comp) => {
          const comp = $comp[0] as HTMLLfSelectElement;
          const { lfDataset } = comp;
          if (lfDataset?.nodes && lfDataset.nodes.length > 0) {
            const firstId = lfDataset.nodes[0].id;
            await comp.setValue(firstId);
            const value = await comp.getValue();
            expect(value.id).to.equal(firstId);
          }
        });
      });
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  let framework: LfFrameworkInterface;
  let fixtures: LfShowcaseComponentFixture<"lf-select">;
  let keys: string[];
  const { lfComponentShowcase } = CY_ALIASES;

  beforeEach(() => {
    cy.navigate(select);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
      fixtures = getSelectFixtures(framework);
      keys = getExamplesKeys(fixtures);
    });
  });
  it("lfDataset: should have dataset with nodes.", () => {
    cy.get(lfComponentShowcase)
      .find(`${selectTag}`)
      .first()
      .then(($select) => {
        cy.wrap($select).should(async ($comp) => {
          const { lfDataset } = $comp[0] as HTMLLfSelectElement;
          expect(lfDataset).to.be.an("object");
          expect(lfDataset.nodes).to.be.an("array");
          expect(lfDataset.nodes.length).to.be.greaterThan(0);
        });
      });
  });
  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
  it("lfTextfieldProps: should pass props to textfield.", () => {
    cy.get(lfComponentShowcase)
      .find(`${selectTag}`)
      .first()
      .then(($select) => {
        cy.wrap($select).should(async ($comp) => {
          const { lfTextfieldProps } = $comp[0] as HTMLLfSelectElement;
          expect(lfTextfieldProps).to.be.an("object");
        });
      });
  });
  it("lfValue: should reflect pre-selected value.", () => {
    const withValueKey = keys.find((k) => k === "uncategorized-withValue");
    cy.get(lfComponentShowcase)
      .find(`${selectTag}#${withValueKey}`)
      .first()
      .then(($select) => {
        cy.wrap($select).should(async ($comp) => {
          const { lfValue } = $comp[0] as HTMLLfSelectElement;
          expect(lfValue).to.be.a("string");
          expect(lfValue).to.not.be.empty;
        });
      });
  });
});
//#endregion

//#region e2e
describe(CY_CATEGORIES.e2e, () => {
  let framework: LfFrameworkInterface;
  let fixtures: LfShowcaseComponentFixture<"lf-select">;
  let keys: string[];
  const { input, node, portal, dropdownMenu, fIcon } = CY_ATTRIBUTES;
  const { lfComponentShowcase } = CY_ALIASES;

  beforeEach(() => {
    cy.navigate(select);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
      fixtures = getSelectFixtures(framework);
      keys = getExamplesKeys(fixtures);
    });
  });

  it("should open dropdown on input click", () => {
    const simpleKey = keys.find((k) => k === "uncategorized-simple");
    cy.get(`${selectTag}#${simpleKey}`)
      .first()
      .within(() => {
        cy.getCyElement(input).click();
      });

    cy.getCyElement(portal)
      .findCyElement(dropdownMenu)
      .should("exist")
      .findCyElement(node)
      .should("have.length.greaterThan", 0);
  });
  it("should select an option and close dropdown", () => {
    const simpleKey = keys.find((k) => k === "uncategorized-simple");
    cy.get(`${selectTag}#${simpleKey}`)
      .first()
      .within(() => {
        cy.getCyElement(input).click();
      });

    cy.getCyElement(portal)
      .findCyElement(dropdownMenu)
      .should("exist")
      .findCyElement(node)
      .first()
      .click();

    cy.getCyElement(portal).findCyElement(dropdownMenu).should("not.exist");

    cy.get(`${selectTag}#${simpleKey}`)
      .first()
      .then(($select) => {
        cy.wrap($select).should(async ($comp) => {
          const comp = $comp[0] as HTMLLfSelectElement;
          const value = await comp.getValue();
          expect(value).to.have.property("id");
        });
      });
  });
  it("should display icons when nodes have icon property", () => {
    const simpleKey = keys.find((k) => k === "uncategorized-simple");
    cy.get(lfComponentShowcase)
      .find(`${selectTag}#${simpleKey}`)
      .first()
      .then(($select) => {
        const { lfDataset } = $select[0] as HTMLLfSelectElement;
        const hasIcons = lfDataset?.nodes?.some((node) => node.icon);

        if (hasIcons) {
          cy.wrap($select).within(() => {
            cy.getCyElement(input).click();
          });

          cy.getCyElement(portal)
            .findCyElement(dropdownMenu)
            .findCyElement(fIcon)
            .should("exist");
        }
      });
  });
});
//#endregion
