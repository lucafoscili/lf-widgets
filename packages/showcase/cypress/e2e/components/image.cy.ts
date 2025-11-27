import {
  CY_ATTRIBUTES,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfImageEvent,
} from "@lf-widgets/foundations";
import { getImageFixtures } from "../../../src/components/lf-showcase/assets/data/image";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const imageName: LfComponentName = "LfImage";
const imageTag: LfComponentTag<typeof imageName> = "lf-image";
const image = imageTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(image).waitForWebComponents([imageTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${imageTag}> exist.`, () => {
    const fixtures = getImageFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(imageTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check } = CY_ATTRIBUTES;

  it(`click`, () => {
    cy.navigate(image);
    const eventType: LfImageEvent = "click";
    cy.checkEvent(image, eventType);
    cy.get(eventElement).click();
    cy.getCyElement(check).should("exist");
  });
  it(`load`, () => {
    const eventType: LfImageEvent = "load";
    cy.checkReadyEvent(image, eventType);
  });
  it(`ready`, () => {
    cy.checkReadyEvent(image);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(image);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(image);
  });

  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(imageTag);
  });

  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(imageTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(imageTag, imageName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(image);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it("lfHtmlAttributes: passes attributes to rendered element", () => {
    const iconClass = framework.theme.bemClass("image", "icon");
    cy.get(CY_ALIASES.lfComponentShowcase)
      .find(`${imageTag}#states-primary`)
      .should("exist")
      .shadow()
      .find(`.${iconClass}`)
      .should("have.attr", "title", "Icon in primary state");
  });

  it("lfValue (icon): renders SVG sprite icon", () => {
    const iconClass = framework.theme.bemClass("image", "icon");
    cy.get(CY_ALIASES.lfComponentShowcase)
      .find(`${imageTag}#icon-icon`)
      .should("exist")
      .shadow()
      .find(`.${iconClass}`)
      .should(($el) => {
        expect($el.get(0).tagName.toLowerCase()).to.eq("div");
      })
      .find("svg use")
      .should("have.attr", "href");
  });

  it("lfSizeX/lfSizeY: inject width/height CSS variables", () => {
    cy.get(CY_ALIASES.lfComponentShowcase)
      .find(`${imageTag}#icon-icon`)
      .should("exist")
      .shadow()
      .find("#lf-style")
      .should(($style) => {
        const text = $style.text();
        expect(text).to.include("--lf_image_width: 128px");
        expect(text).to.include("--lf_image_height: 128px");
      });
  });

  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });

  it("lfUiState: reflected on icon via data-lf", () => {
    const iconClass = framework.theme.bemClass("image", "icon");
    cy.get(CY_ALIASES.lfComponentShowcase)
      .find(`${imageTag}#states-success`)
      .should("exist")
      .shadow()
      .find(`.${iconClass}`)
      .should("have.attr", "data-lf", "success");
  });

  it("lfValue: URL renders <img> with matching src", () => {
    cy.get(CY_ALIASES.lfComponentShowcase)
      .find(`${imageTag}#image-image`)
      .should("exist")
      .then(($img) => {
        const comp = $img[0] as HTMLLfImageElement;
        expect(comp.lfValue).to.be.a("string").and.not.be.empty;
      })
      .shadow()
      .find("img")
      .should("exist")
      .then(($el) => {
        cy.wrap($el)
          .parents("lf-image")
          .then(($host) => {
            const comp = $host[0] as HTMLLfImageElement;
            expect($el.attr("src")).to.eq(comp.lfValue);
          });
      });
  });
});
//#endregion
