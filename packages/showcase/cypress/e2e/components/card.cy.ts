import {
  CY_ATTRIBUTES,
  LfCardEvent,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { getCardFixtures } from "../../../src/components/lf-showcase/assets/data/card";
import {
  CY_ALIASES,
  CY_CATEGORIES,
  CY_EFFECT_LAYERS,
} from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const cardName: LfComponentName = "LfCard";
const cardTag: LfComponentTag<typeof cardName> = "lf-card";
const card = cardTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(card).waitForWebComponents([cardTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${cardTag}> exist.`, () => {
    const fixtures = getCardFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(cardTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check, shape } = CY_ATTRIBUTES;

  it(`click`, () => {
    cy.navigate(card);
    const eventType: LfCardEvent = "click";
    cy.checkEvent(card, eventType);
    cy.get(eventElement).click();
    cy.getCyElement(check).should("exist");
  });
  it(`contextmenu`, () => {
    cy.navigate(card);
    const eventType: LfCardEvent = "contextmenu";
    cy.checkEvent(card, eventType);
    cy.get(eventElement).rightclick();
    cy.getCyElement(check).should("exist");
  });
  it(`lf-event`, () => {
    cy.navigate(card);
    const eventType: LfCardEvent = "lf-event";
    cy.checkEvent(card, eventType);
    cy.get(eventElement).findCyElement(shape).first().click();
    cy.getCyElement(check).should("exist");
  });
  it(`pointerdown`, () => {
    cy.navigate(card);
    const eventType: LfCardEvent = "pointerdown";
    cy.checkEvent(card, eventType);
    cy.get(`${cardTag}#material-material-0`)
      .findEffectLayer(CY_EFFECT_LAYERS.ripple)
      .parent() // the actual listener is on the parent in this case
      .click({ multiple: true });
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(card);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(card);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(card);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(cardTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(cardTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(cardTag, cardName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  let framework: LfFrameworkInterface;
  const { lfComponentShowcase } = CY_ALIASES;
  const { shape } = CY_ATTRIBUTES;

  beforeEach(() => {
    cy.navigate(card);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it("lfDataset: should expose shapes via API and render shape elements.", () => {
    cy.get(lfComponentShowcase)
      .find(`${cardTag}#material-material-0`)
      .should("exist")
      .then(($comp) => {
        cy.wrap($comp)
          .should(async ($c) => {
            const comp = $c[0] as HTMLLfCardElement;
            const shapes = await comp.getShapes();
            expect(Object.keys(shapes || {}).length).to.be.greaterThan(0);
          })
          .shadow()
          .find(`[data-cy="${shape}"]`)
          .should("exist");
      });
  });

  it("lfLayout: should render the correct layout wrapper for each layout.", () => {
    const layoutRoots = [
      { id: "#debug-debug-0", root: framework.theme.bemClass("debug-layout") },
      {
        id: "#keywords-keywords-0",
        root: framework.theme.bemClass("keywords-layout"),
      },
      {
        id: "#material-material-0",
        root: framework.theme.bemClass("material-layout"),
      },
      {
        id: "#upload-upload-0",
        root: framework.theme.bemClass("upload-layout"),
      },
    ];

    for (const { id, root } of layoutRoots) {
      cy.get(lfComponentShowcase)
        .find(`${cardTag}${id}`)
        .should("exist")
        .shadow()
        .find(`.${root}`)
        .should("exist");
    }
  });

  it("lfSizeX/lfSizeY: should reflect as CSS custom properties on host.", () => {
    cy.get(lfComponentShowcase)
      .find(`${cardTag}#material-material-0`)
      .should("exist")
      .then(($comp) => {
        cy.wrap($comp).should(($c) => {
          const host = $c[0] as HTMLLfCardElement;
          const styles = getComputedStyle(host);
          expect(styles.getPropertyValue("--lf_card_width").trim()).to.eq(
            "320px",
          );
          expect(styles.getPropertyValue("--lf_card_height").trim()).to.eq(
            "320px",
          );
        });
      });
  });

  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });

  it("lfUiSize: reflected as host attribute.", () => {
    cy.get(lfComponentShowcase)
      .find(`${cardTag}#sizes-small`)
      .should("exist")
      .should("have.attr", "lf-ui-size", "small");
  });

  it("lfUiState: reflected on material layout via data-lf.", () => {
    const rootClass = framework.theme.bemClass("material-layout");
    cy.get(lfComponentShowcase)
      .find(`${cardTag}#states-success`)
      .should("exist")
      .shadow()
      .find(`.${rootClass}`)
      .should("have.attr", "data-lf", "success");
  });
});
//#endregion

//#region e2e
describe(CY_CATEGORIES.e2e, () => {
  let framework: LfFrameworkInterface;
  const { lfComponentShowcase } = CY_ALIASES;

  beforeEach(() => {
    cy.navigate(card);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it("Material layout renders text sections and actions.", () => {
    const materialRoot = framework.theme.bemClass("material-layout");
    const title = framework.theme.bemClass("text-content", "title");
    const subtitle = framework.theme.bemClass("text-content", "subtitle");
    const description = framework.theme.bemClass("text-content", "description");

    cy.get(lfComponentShowcase)
      .find(`${cardTag}#material-material-0`)
      .should("exist")
      .shadow()
      .within(() => {
        cy.get(`.${materialRoot}`).should("exist");
        cy.get(`.${title}`).should("exist");
        cy.get(`.${subtitle}`).should("exist");
        cy.get(`.${description}`).should("exist");
        cy.getEffectLayer(CY_EFFECT_LAYERS.ripple).should("exist");
      });
  });

  it("Upload layout shows upload and button sections.", () => {
    const uploadRoot = framework.theme.bemClass("upload-layout");
    const section1 = framework.theme.bemClass("upload-layout", "section-1");
    const section2 = framework.theme.bemClass("upload-layout", "section-2");

    cy.get(lfComponentShowcase)
      .find(`${cardTag}#upload-upload-0`)
      .should("exist")
      .shadow()
      .within(() => {
        cy.get(`.${uploadRoot}`).should("exist");
        cy.get(`.${section1}`).should("exist");
        cy.get(`.${section2}`).should("exist");
      });
  });
});
//#endregion
