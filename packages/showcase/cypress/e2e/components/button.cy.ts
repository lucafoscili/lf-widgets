import {
  CY_ATTRIBUTES,
  LfButtonEvent,
  LfButtonState,
  LfButtonStyling,
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
} from "@lf-widgets/foundations";
import { getButtonFixtures } from "../../../src/components/lf-showcase/assets/data/button";
import { CY_ALIASES, CY_CATEGORIES } from "../../support/constants";
import { getExamplesKeys } from "../../support/utils";

const buttonName: LfComponentName = "LfButton";
const buttonTag: LfComponentTag<typeof buttonName> = "lf-button";
const button = buttonTag.replace("lf-", "");

//#region Basic
describe(CY_CATEGORIES.basic, () => {
  let core: LfCoreInterface;

  beforeEach(() => {
    cy.navigate(button).waitForWebComponents([buttonTag]);
    cy.getLfCore().then((lfCore) => {
      core = lfCore;
    });
  });
  it(`Should check that all <${buttonTag}> exist.`, () => {
    const fixtures = getButtonFixtures(core);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(buttonTag, new Set(keys));
  });
});
//#endregion

//#region Events
describe(CY_CATEGORIES.events, () => {
  const { eventElement } = CY_ALIASES;
  const {
    button,
    check,
    dropdownButton,
    dropdownMenu,
    node,
    portal,
    rippleSurface,
  } = CY_ATTRIBUTES;

  it(`blur`, () => {
    cy.navigate(button);
    const eventType: LfButtonEvent = "blur";
    cy.checkEvent(button, eventType);
    cy.get(eventElement).findCyElement(button).focus().blur();
    cy.getCyElement(check).should("exist");
  });
  it(`click`, () => {
    cy.navigate(button);
    const eventType: LfButtonEvent = "click";
    cy.checkEvent(button, eventType);
    cy.get(eventElement).findCyElement(button).click();
    cy.getCyElement(check).should("exist");
  });
  it(`lf-event`, () => {
    cy.navigate(button);
    const eventType: LfButtonEvent = "lf-event";
    cy.checkEvent(button, eventType);
    cy.get("#flat-dropdown").findCyElement(dropdownButton).click();
    cy.getCyElement(portal)
      .findCyElement(dropdownMenu)
      .should("exist")
      .findCyElement(node)
      .first()
      .click();
    cy.getCyElement(check).should("exist");
  });
  it(`pointerdown`, () => {
    cy.navigate(button);
    const eventType: LfButtonEvent = "pointerdown";
    cy.checkEvent(button, eventType);
    cy.get(eventElement).findCyElement(rippleSurface).first().click();
    cy.getCyElement(check).should("exist");
  });
  it(`ready`, () => {
    cy.checkReadyEvent(button);
  });
  it(`unmount`, () => {
    cy.checkUnmountEvent(button);
  });
});
//#endregion

//#region Methods
describe(CY_CATEGORIES.methods, () => {
  beforeEach(() => {
    cy.navigate(button);
  });
  it("getDebugInfo: check the structure of the returned object.", () => {
    cy.checkDebugInfo(buttonTag);
  });
  it("getDebugInfo, refresh: check that renderCount has increased after refreshing.", () => {
    cy.checkRenderCountIncrease(buttonTag);
  });
  it(`getProps: check keys against props array.`, () => {
    cy.checkProps(buttonTag, buttonName);
  });
});
//#endregion

//#region Props
describe(CY_CATEGORIES.props, () => {
  let core: LfCoreInterface;
  const { lfComponentShowcase } = CY_ALIASES;
  const { dropdownButton, maskedSvg, rippleSurface } = CY_ATTRIBUTES;

  beforeEach(() => {
    cy.navigate(button);
    cy.getLfCore().then((lfCore) => {
      core = lfCore;
    });
  });
  it("lfDataset: should check that a button with lfDataset correctly renders a dropdown button.", () => {
    cy.get(lfComponentShowcase)
      .find('lf-button[id*="dropdown"]')
      .first()
      .then(($button) => {
        cy.wrap($button)
          .should(async ($btn) => {
            const { lfDataset } = $btn[0] as HTMLLfButtonElement;
            expect(lfDataset).to.be.a("object");
          })
          .within(() => {
            cy.getCyElement(dropdownButton).should("exist");
          });
      });
  });
  it("lfIcon: should check for the presence of an icon.", () => {
    cy.get(lfComponentShowcase)
      .find('lf-button[id*="icon"]')
      .first()
      .then(($button) => {
        cy.wrap($button)
          .should(async ($btn) => {
            const { lfIcon } = $btn[0] as HTMLLfButtonElement;
            expect(lfIcon).to.not.be.empty;
          })
          .within(() => {
            cy.getCyElement(maskedSvg).should("exist");
          });
      });
  });
  it("lfIconOff: should ensure that clicking a toggable icon changes the displayed icon.", () => {
    let lfIcon: string;
    let lfIconOff: string;

    cy.get(lfComponentShowcase)
      .find('lf-button[id*="toggable"]')
      .first()
      .then(($button) => {
        cy.wrap($button)
          .should(async ($btn) => {
            const { lfIcon: icon, lfIconOff: iconOff } =
              $btn[0] as HTMLLfButtonElement;
            lfIcon = icon;
            lfIconOff = iconOff || `off-${icon}`;
            expect(lfIcon).to.not.be.eq(lfIconOff);
            expect(lfIcon).to.not.be.empty;
            expect(lfIconOff).to.not.be.empty;
          })
          .within(() => {
            cy.getCyElement(maskedSvg).then(($svg) => {
              cy.wrap($svg).should(async ($s) => {
                const svg = $s[0] as HTMLDivElement;
                expect(svg.getAttribute("style")).to.include(lfIcon);
              });
            });
          })
          .click()
          .within(() => {
            cy.getCyElement(maskedSvg).then(($svg) => {
              cy.wrap($svg).should(async ($s) => {
                const svg = $s[0] as HTMLDivElement;
                expect(svg.getAttribute("style")).to.include(lfIconOff);
              });
            });
          });
      });
  });
  it("lfLabel: should ensure that the button has a label.", () => {
    cy.get(lfComponentShowcase)
      .find('lf-button[id*="label"]')
      .first()
      .then(($button) => {
        cy.wrap($button).should(async ($btn) => {
          const { lfLabel } = $btn[0] as HTMLLfButtonElement;
          expect(lfLabel).to.not.be.empty;
        });
      })
      .within(() => {
        cy.get(`.${core.theme.bemClass("button", "label")}`).should("exist");
      });
  });
  it("lfRipple: should check for the presence of a ripple element.", () => {
    cy.checkRipple(`${buttonTag}`);
  });
  it("lfShowSpinner: should ensure that the button has a spinner.", () => {
    cy.get(lfComponentShowcase)
      .find('lf-button[id*="spinner"]')
      .first()
      .then(($button) => {
        cy.wrap($button).should(async ($btn) => {
          const { lfShowSpinner } = $btn[0] as HTMLLfButtonElement;
          expect(lfShowSpinner).to.eq(true);
        });
      })
      .within(() => {
        cy.get(`.${core.theme.bemClass("button", "spinner")}`).should("exist");
      });
  });
  it("lfStyle: Should check for the presence of a <style> element with id lf-style.", () => {
    cy.checkLfStyle();
  });
  it("lfStyling: should check for the existence of a button for each styling.", () => {
    const STYLINGS: LfButtonStyling[] = [
      "flat",
      "floating",
      "icon",
      "outlined",
      "raised",
    ];

    for (let index = 0; index < STYLINGS.length; index++) {
      const STYLING = STYLINGS[index];

      cy.get(lfComponentShowcase)
        .find(`lf-button[id*="${STYLING}-"]`)
        .first()
        .then(() => {
          const selector = `.${core.theme.bemClass("button", null, { [STYLING]: true })}`;

          expect(selector).to.exist;
        });
    }
  });
  it("lfToggable: should toggle the value setting it to true.", () => {
    let initialValue: LfButtonState;
    let newValue: LfButtonState;

    cy.get(lfComponentShowcase)
      .find('lf-button[id*="toggable"]')
      .first()
      .then(($button) => {
        cy.wrap($button).should(async ($btn) => {
          const lfButtonElement = $btn[0] as HTMLLfButtonElement;
          initialValue = await lfButtonElement.getValue();
          newValue = initialValue === "on" ? "off" : "on";
        });
      });

    cy.get(lfComponentShowcase)
      .find('lf-button[id*="toggable"]')
      .first()
      .then(($button) => {
        cy.wrap($button)
          .should(async ($btn) => {
            const lfButtonElement = $btn[0] as HTMLLfButtonElement;
            await lfButtonElement.setValue(newValue);
          })
          .then(($button) => {
            cy.wrap($button).should(async ($btn) => {
              const lfButtonElement = $btn[0] as HTMLLfButtonElement;
              expect(await lfButtonElement.getValue()).to.equal(newValue);
            });
          });
      });
  });
  it("lfTrailingIcon: should ensure the button displays a trailing icon.", () => {
    cy.get(lfComponentShowcase)
      .find('lf-button[id*="trailingIcon"]')
      .first()
      .within(($button) => {
        cy.wrap($button).should(async ($btn) => {
          const button = $btn[0] as HTMLLfButtonElement;
          expect(button.lfIcon).to.not.be.empty;
          expect(button.lfLabel).to.not.be.empty;
          expect(button.lfTrailingIcon).to.be.true;
        });

        cy.getCyElement(button)
          .should("exist")
          .and("not.have.class", "no-label")
          .children()
          .then((children) => {
            const [rpl, label, icon] = children.toArray();
            expect(rpl).to.have.attr("data-cy", rippleSurface);
            expect(label).to.have.class(core.theme.bemClass("button", "label"));
            expect(icon).to.have.class(core.theme.bemClass("button", "icon"));
          });
      });

    cy.get(lfComponentShowcase)
      .find('lf-button[id*="labelIcon"]')
      .first()
      .within(($button) => {
        cy.wrap($button).should(async ($btn) => {
          const { lfIcon, lfLabel, lfTrailingIcon } =
            $btn[0] as HTMLLfButtonElement;
          expect(lfIcon).to.not.be.empty;
          expect(lfLabel).to.not.be.empty;
          expect(lfTrailingIcon).to.be.false;
        });

        cy.getCyElement(button)
          .should("exist")
          .and("not.have.class", "no-label")
          .children()
          .then((children) => {
            const [rpl, icon, label] = children.toArray();
            expect(rpl).to.have.attr("data-cy", rippleSurface);
            expect(icon).to.have.class(core.theme.bemClass("button", "icon"));
            expect(label).to.have.class(core.theme.bemClass("button", "label"));
          });
      });
  });
  it("lfType: should check for the correct type on the button element.", () => {
    cy.get(lfComponentShowcase)
      .find(buttonTag)
      .first()
      .within(($button) => {
        cy.wrap($button).should(($btn) => {
          const { lfType } = $btn[0] as HTMLLfButtonElement;
          expect(lfType).to.eq("button");
        });
        cy.getCyElement(button).should("have.attr", "type", "button");
      })
      .then(($button) => {
        cy.wrap($button).should(async ($btn) => {
          const btn = $btn[0] as HTMLLfButtonElement;
          btn.lfType = "reset";
          expect(btn.lfType).to.eq("reset");
        });
      })
      .findCyElement(button)
      .should("have.attr", "type", "reset");
  });
  it("lfValue: should check for the correct value.", () => {
    const newButton = document.createElement(buttonTag);
    newButton.id = "cy-value-it";

    cy.get(CY_ALIASES.lfComponentShowcase)
      .find('lf-button[id*="toggable"]')
      .first()
      .within(async ($button) => {
        cy.wrap($button).should(async ($btn) => {
          const button = $btn[0] as HTMLLfButtonElement;
          const value = await button.getValue();
          expect(value).to.eq("on");
        });
      });

    cy.get(CY_ALIASES.lfComponentShowcase).within(($showcase) => {
      const showcase = $showcase[0] as HTMLDivElement;
      showcase.appendChild(newButton);

      cy.get("#cy-value-it").within(async ($button) => {
        cy.wrap($button).should(async ($btn) => {
          const btn = $btn[0] as HTMLLfButtonElement;
          const value = await btn.getValue();
          expect(value).to.eq("off");
        });
      });
    });
  });
});
//#endregion
