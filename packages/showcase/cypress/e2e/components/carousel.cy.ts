import {
  CY_ATTRIBUTES,
  LfCarouselEvent,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { getCarouselFixtures } from "../../../src/components/lf-showcase/assets/data/carousel";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const carouselName: LfComponentName = "LfCarousel";
const carouselTag: LfComponentTag<typeof carouselName> = "lf-carousel";
const carousel = carouselTag.replace("lf-", "");

describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(carousel).waitForWebComponents([carouselTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${carouselTag}> exist.`, () => {
    const fixtures = getCarouselFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(carouselTag, new Set(keys));
  });
});

describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const { check, shape } = CY_ATTRIBUTES;

  it(`lf-event`, () => {
    cy.navigate(carousel);
    const eventType: LfCarouselEvent = "lf-event";
    cy.checkEvent(carousel, eventType);
    cy.get(eventElement)
      .findCyElement(shape)
      .first()
      .scrollIntoView()
      .trigger("click", { force: true, x: 100, y: 100 });
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(carousel);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(carousel);
  });
});

describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(carousel);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(carouselTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(carouselTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(carouselTag, carouselName);
  });
});

describe(CY_CATEGORIES.props, () => {
  let framework: LfFrameworkInterface;
  const { lfComponentShowcase } = CY_ALIASES;

  beforeEach(() => {
    cy.navigate(carousel);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it("lfAutoPlay: should advance slides automatically using the fixture.", () => {
    const slideBar = framework.theme.bemClass("slide-bar");
    const segment = framework.theme.bemClass("slide-bar", "segment");
    const segmentActive = segment + "--active";

    let initialIndex: string;

    cy.get(lfComponentShowcase)
      .find(`${carouselTag}#uncategorized-autoplay`)
      .should("exist")
      .shadow()
      .find(`.${slideBar}`)
      .should("exist")
      .find(`.${segmentActive}`)
      .should("exist")
      .invoke("attr", "data-index")
      .then((idx) => {
        initialIndex = String(idx);
      })
      .then(() => {
        cy.wait(3500); // default interval is 3000ms
      })
      .then(() => {
        cy.get(lfComponentShowcase)
          .find(`${carouselTag}#uncategorized-autoplay`)
          .shadow()
          .find(`.${segmentActive}`)
          .invoke("attr", "data-index")
          .should((idx) => {
            expect(String(idx)).to.not.eq(initialIndex);
          });
      });
  });

  it("lfDataset: should expose shapes via API.", () => {
    cy.get(lfComponentShowcase)
      .find(`${carouselTag}#uncategorized-code`)
      .should("exist")
      .then(($comp) => {
        cy.wrap($comp).should(async ($c) => {
          const comp = $c[0] as HTMLLfCarouselElement;
          const shapes = await comp.getProps();
          expect(shapes.lfDataset).to.be.a("object");
        });
      });
  });

  it("lfInterval: should be honored when set on a programmatically added element.", () => {
    const slideBar = framework.theme.bemClass("slide-bar");
    const segment = framework.theme.bemClass("slide-bar", "segment");
    const segmentActive = segment + "--active";

    cy.get(lfComponentShowcase).then(($showcase) => {
      const el = document.createElement(carouselTag);
      el.id = "cy-interval";

      const fixtures = getCarouselFixtures(framework);
      const ds = fixtures.examples.uncategorized.lightbox.props.lfDataset!;

      el.lfAutoPlay = true;
      el.lfDataset = ds;
      el.lfInterval = 200;

      ($showcase[0] as HTMLElement).appendChild(el);
    });

    let startIdx: string;
    cy.get(`#cy-interval`)
      .shadow()
      .find(`.${slideBar}`)
      .find(`.${segmentActive}`)
      .invoke("attr", "data-index")
      .then((idx) => {
        startIdx = String(idx);
      })
      .then(() => cy.wait(300))
      .then(() => {
        cy.get(`#cy-interval`)
          .shadow()
          .find(`.${segmentActive}`)
          .invoke("attr", "data-index")
          .should((idx) => {
            expect(String(idx)).to.not.eq(startIdx);
          });
      });
  });

  it("lfLightbox: should reflect as host attribute when enabled.", () => {
    cy.get(lfComponentShowcase)
      .find(`${carouselTag}#uncategorized-lightbox`)
      .should("exist")
      .should("have.attr", "lf-lightbox");
  });

  it("lfNavigation: when enabled, shows side buttons.", () => {
    cy.get(lfComponentShowcase)
      .find(`${carouselTag}#uncategorized-code`)
      .first()
      .then(($comp) => {
        cy.wrap($comp)
          .should(async ($c) => {
            const comp = $c[0] as HTMLLfCarouselElement;
            comp.lfNavigation = true;
            await comp.refresh();
          })
          .shadow()
          .find(`#back-button`)
          .should("exist");
      })
      .then(() => {
        cy.get(lfComponentShowcase)
          .find(`${carouselTag}#uncategorized-code`)
          .first()
          .shadow()
          .find(`#forward-button`)
          .should("exist");
      });
  });

  it("lfShape: should reflect on host attribute.", () => {
    cy.get(lfComponentShowcase)
      .find(`${carouselTag}#uncategorized-code`)
      .should("exist")
      .should("have.attr", "lf-shape", "code");
  });

  it("lfStyle: should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
});

describe(CY_CATEGORIES.e2e, () => {
  let framework: LfFrameworkInterface;
  const { lfComponentShowcase } = CY_ALIASES;

  beforeEach(() => {
    cy.navigate(carousel);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it("Clicking an indicator segment changes the slide.", () => {
    const slideBar = framework.theme.bemClass("slide-bar");
    const segment = framework.theme.bemClass("slide-bar", "segment");
    const segmentActive = segment + "--active";

    let beforeIdx: string;
    cy.get(lfComponentShowcase)
      .find(`${carouselTag}#uncategorized-code`)
      .should("exist")
      .shadow()
      .find(`.${slideBar}`)
      .find(`.${segmentActive}`)
      .invoke("attr", "data-index")
      .then((idx) => (beforeIdx = String(idx)))
      .then(() => {
        cy.get(lfComponentShowcase)
          .find(`${carouselTag}#uncategorized-code`)
          .shadow()
          .find(`.${slideBar}`)
          .find(`.${segment}`)
          .eq(1)
          .click();
      })
      .then(() => {
        cy.get(lfComponentShowcase)
          .find(`${carouselTag}#uncategorized-code`)
          .shadow()
          .find(`.${segmentActive}`)
          .invoke("attr", "data-index")
          .should((idx) => {
            expect(String(idx)).to.not.eq(beforeIdx);
          });
      });
  });

  it("Side buttons navigate forward and back when enabled.", () => {
    const track = framework.theme.bemClass("carousel", "track");

    cy.get(lfComponentShowcase)
      .find(`${carouselTag}#uncategorized-button`)
      .should("exist")
      .then(($comp) => {
        cy.wrap($comp).should(async ($c) => {
          const comp = $c[0] as HTMLLfCarouselElement;
          comp.lfNavigation = true;
          await comp.refresh();
        });
      })
      .shadow()
      .find(`#forward-button`)
      .click()
      .then(() => {
        cy.get(lfComponentShowcase)
          .find(`${carouselTag}#uncategorized-button`)
          .shadow()
          .find(`.${track}`)
          .find(`[data-index="1"]`)
          .should("exist");
      })
      .then(() => {
        cy.get(lfComponentShowcase)
          .find(`${carouselTag}#uncategorized-button`)
          .shadow()
          .find(`#back-button`)
          .click()
          .then(() => {
            cy.get(lfComponentShowcase)
              .find(`${carouselTag}#uncategorized-button`)
              .shadow()
              .find(`.${track}`)
              .find(`[data-index="0"]`)
              .should("exist");
          });
      });
  });
});
