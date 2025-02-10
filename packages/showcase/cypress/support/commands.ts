/// <reference types="cypress" />
/// <reference types="@lf-widgets/core" />

import {
  CY_ATTRIBUTES,
  getComponentProps,
  LF_FRAMEWORK_EVENT_NAME,
  LfComponentName,
  LfComponentRootElement,
  LfComponentTag,
  LfFrameworkEvent,
  LfFrameworkInterface,
  LfEvent,
  LfEventType,
} from "@lf-widgets/foundations";
import { CY_ALIASES } from "./constants";
import { DataCyAttributeTransformed } from "./declarations";

let lfFramework: LfFrameworkInterface;

/**
 * Global type declarations for Cypress custom commands
 */
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Checks component examples
       * @param component - The component name to check
       * @param componentExamples - Set of component examples to verify
       */
      checkComponentExamples(
        component: string,
        componentExamples: Set<string>,
      ): Chainable;

      /**
       * Checks component examples by category
       * @param category - Set of categories to check
       */
      checkComponentExamplesByCategory(category: Set<string>): Chainable;

      /**
       * Checks number of component examples by category
       * @param component - The component name to check
       */
      checkComponentExamplesByCategoryNumber(component: string): Chainable;

      /**
       * Checks number of component examples
       * @param componentExamples - Array of component examples to verify
       */
      checkComponentExamplesNumber(componentExamples: Array<string>): Chainable;

      /**
       * Checks debug information for a component
       * @param component - The component name to check debug info for
       */
      checkDebugInfo(component: string): Chainable;

      /**
       * Checks event handling for a component
       * @param component - The component name to check events for
       * @param eventType - Type of event to verify
       */
      checkEvent(component: string, eventType: LfEventType): Chainable;

      /**
       * Checks LF style application
       */
      checkLfStyle(): Chainable;

      /**
       * Checks component properties
       * @param componentTag - The component tag to check properties for
       * @param component - The component name to check properties for
       * @param global - Optional flag for global property check
       */
      checkProps(
        componentTag: LfComponentTag,
        component: LfComponentName,
        global?: boolean,
      ): Chainable;

      /**
       * Checks ready event for a component
       * @param component - The component name to check ready event for
       * @param event - Optional event type ('load' or 'ready')
       */
      checkReadyEvent(component: string, event?: "load" | "ready"): Chainable;

      /**
       * Checks unmount event for a component
       * @param component - The component name to check unmount event for
       */
      checkUnmountEvent(component: string): Chainable;

      /**
       * Checks if render count increases for a component
       * @param component - The component name to check render count for
       * @param attempts - Optional number of attempts to check
       */
      checkRenderCountIncrease(component: string, attempts?: number): Chainable;

      /**
       * Checks ripple effect for a component
       * @param component - The component name to check ripple effect for
       */
      checkRipple(component: string): Chainable;

      /**
       * Finds element by data-cy attribute
       * @param dataCy - The data-cy attribute value to search for
       */
      findCyElement(dataCy: string): Chainable;

      /**
       * Gets element by data-cy attribute
       * @param dataCy - The data-cy attribute value to get
       */
      getCyElement(dataCy: string): Chainable;

      /**
       * Gets LF manager instance
       * @returns Chainable<LfFramework>
       */
      getLfFramework(): Chainable<LfFrameworkInterface>;

      /**
       * Navigates to a component
       * @param component - The component name to navigate to
       */
      navigate(component: string): Chainable;

      /**
       * Waits for web components to be registered
       * @param tags - Array of web component tags to wait for
       */
      waitForWebComponents(tags: string[]): Chainable;
    }
  }
}

//#region checkComponentExamples
Cypress.Commands.add(
  "checkComponentExamples",
  (_component, componentExamples) => {
    cy.log("Checking component examples...");
    componentExamples.forEach((example) => cy.log(example));
    cy.get(CY_ALIASES.lfComponentShowcase)
      .findCyElement(CY_ATTRIBUTES.showcaseExample)
      .should("have.length", componentExamples.size);
  },
);
//#endregion

//#region checkComponentExamplesNumber
Cypress.Commands.add("checkComponentExamplesNumber", (componentExamples) => {
  cy.get(CY_ALIASES.lfComponentShowcase)
    .wrap(componentExamples)
    .each((id) => {
      cy.get(`#${id}`).should("exist");
    });
});
//#endregion

//#region checkComponentExamplesByCategory
Cypress.Commands.add("checkComponentExamplesByCategory", (categories) => {
  categories.forEach((categoryKey) => {
    const composedId = `#${categoryKey}-style`;
    cy.get(CY_ALIASES.lfComponentShowcase).find(composedId).should("exist");
  });
});
//#endregion

//#region checkComponentExamplesByCategoryNumber
Cypress.Commands.add("checkComponentExamplesByCategoryNumber", (component) => {
  cy.get(CY_ALIASES.lfComponentShowcase)
    .find(".grid-container")
    .each((category) => {
      cy.wrap(category).find(component).its("length").should("be.gte", 1);
    });
});
//#endregion

//#region checkDebugInfo
Cypress.Commands.add("checkDebugInfo", (component) => {
  cy.get(CY_ALIASES.lfComponentShowcase)
    .find(component)
    .first()
    .then(($comp) => {
      cy.wrap($comp).should(async ($cmp) => {
        const cmp = $cmp[0] as LfComponentRootElement;
        cmp.getDebugInfo().then((debugInfo) => {
          expect(debugInfo).to.have.property("endTime").that.is.a("number");
          expect(debugInfo).to.have.property("renderCount").that.is.a("number");
          expect(debugInfo).to.have.property("renderEnd").that.is.a("number");
          expect(debugInfo).to.have.property("renderStart").that.is.a("number");
          expect(debugInfo).to.have.property("startTime").that.is.a("number");
        });
      });
    });
});
//#endregion

//#region checkEvent
Cypress.Commands.add(
  "checkEvent",
  <N extends LfComponentName>(component: N, eventType: LfEventType) => {
    const { eventElement, lfComponentShowcase } = CY_ALIASES;

    setupEventChecker(component, eventType);
    cy.get(lfComponentShowcase)
      .findCyElement(CY_ATTRIBUTES.showcaseExample)
      .should("exist")
      .first()
      .scrollIntoView()
      .as(eventElement.replace("@", ""));
  },
);
//#endregion

//#region checkLfStyle
Cypress.Commands.add("checkLfStyle", () => {
  const { lfComponentShowcase } = CY_ALIASES;

  function checkStyles() {
    cy.get(lfComponentShowcase)
      .find("style#lf-style")
      .then(($style) => {
        cy.wrap($style).should(async ($sty) => {
          const sty = $sty[0] as HTMLStyleElement;
          expect(sty.textContent).to.not.be.empty;
        });
      });
  }
  checkStyles();
});
//#endregion

//#region checkProps
Cypress.Commands.add("checkProps", (tag, name, global = false) => {
  const { lfComponentShowcase } = CY_ALIASES;

  const componentProps = getComponentProps()[name];

  cy.get(global ? "body" : lfComponentShowcase)
    .find(tag)
    .first()
    .then(($comp) => {
      cy.wrap($comp).should(async ($c) => {
        const c = $c[0] as LfComponentRootElement;

        c.getProps().then((props) => {
          expect(props).to.have.all.keys(componentProps);
        });
      });
    });
});
//#endregion

//#region checkReadyEvent
Cypress.Commands.add("checkReadyEvent", (component, eventType = "ready") => {
  const { lfComponentShowcase } = CY_ALIASES;
  const { check } = CY_ATTRIBUTES;

  visitManager().visit();
  setupEventChecker(component, eventType);
  visitManager().splashUnmount();
  cy.document().then(() => {
    visitManager().cardClick(component);
    cy.get(lfComponentShowcase)
      .find(`lf-${component}`)
      .first()
      .scrollIntoView();
    cy.getCyElement(check).should("exist");
  });
});
//#endregion

//#region checkUnmountEvent
Cypress.Commands.add("checkUnmountEvent", (component) => {
  const { lfComponentShowcase } = CY_ALIASES;
  const { check } = CY_ATTRIBUTES;

  visitManager().visit();
  setupEventChecker(component, "unmount");
  visitManager().splashUnmount();
  visitManager().cardClick(component);
  cy.get(lfComponentShowcase)
    .find(`lf-${component}`)
    .first()
    .scrollIntoView()
    .then(($component) => {
      cy.wrap($component).should(async ($cmp) => {
        const cmp = $cmp[0] as LfComponentRootElement;
        cmp.unmount();
      });
    });
  cy.getCyElement(check).should("exist");
});
//#endregion

//#region checkRipple
Cypress.Commands.add("checkRipple", (component) => {
  let initialChildCount = 0;

  cy.get(component)
    .findCyElement(CY_ATTRIBUTES.rippleSurface)
    .should("exist")
    .then(($ripple) => {
      cy.wrap($ripple)
        .first()
        .should(async ($rpl) => {
          const rpl = $rpl[0] as HTMLDivElement;
          initialChildCount = rpl.children.length;
        });

      cy.wrap($ripple)
        .first()
        .click({ force: true })
        .children()
        .should("have.length", Number(initialChildCount + 1));
    });
});
//#endregion

//#region checkRenderCountIncrease
Cypress.Commands.add("checkRenderCountIncrease", (component) => {
  cy.get(component)
    .first()
    .then(($comp) => {
      cy.wrap($comp).should(async ($c) => {
        const c = $c[0] as LfComponentRootElement;

        const { renderCount } = await c.getDebugInfo();
        await c.refresh();
        requestAnimationFrame(async () => {
          const { renderCount: newRenderCount } = await c.getDebugInfo();
          expect(newRenderCount).to.be.greaterThan(renderCount);
        });
      });
    });
});
//#endregion

//#region findCyElement
Cypress.Commands.add(
  "findCyElement",
  { prevSubject: "element" },
  (subject, dataCy: string) => {
    cy.wrap(subject).find(transformEnumValue(dataCy) as unknown as string);
  },
);
//#endregion

//#region getCyElement
Cypress.Commands.add("getCyElement", (dataCy: string) =>
  cy.get(transformEnumValue(dataCy) as unknown as string),
);
//#endregion

//#region getLfFramework
Cypress.Commands.add("getLfFramework", () => {
  cy.window().then(() => {
    return lfFramework;
  });
});
//#endregion

//#region navigate
Cypress.Commands.add("navigate", (component) => {
  if (!component || typeof component !== "string") {
    throw new Error(`Invalid component name: ${component}`);
  }

  visitManager().visit();

  cy.log("Waiting for splash to unmount");
  visitManager().splashUnmount();

  cy.log("Navigating to component: " + component);
  visitManager().cardClick(component);

  cy.get(CY_ALIASES.lfComponentShowcase)
    .should("exist")
    .then(() => cy.log("Navigation complete, alias ready"));
});

Cypress.Commands.add("waitForWebComponents", (components: string[]) => {
  cy.window().then(async (win) => {
    const promises = components.map((component) => {
      cy.log(`Waiting for component: ${component}`);
      return win.customElements.whenDefined(component);
    });
    await Cypress.Promise.all(promises);
    cy.log("All specified web components are defined.");
  });
});

function transformEnumValue(key: string): DataCyAttributeTransformed {
  return `[data-cy="${key}"]` as unknown as DataCyAttributeTransformed;
}

function visitManager() {
  return {
    cardClick: (component: string) => {
      cy.waitForWebComponents(["lf-showcase"]);
      cy.get("lf-showcase").should("exist").as("lfShowcase");
      cy.get("@lfShowcase").should("exist");
      cy.get(`#${component.charAt(0).toUpperCase() + component.slice(1)}`)
        .should("exist")
        .click();
      cy.getCyElement(CY_ATTRIBUTES.showcaseGridWrapper)
        .as("lfComponentShowcase")
        .then(() => cy.log("Alias @lfComponentShowcase created"));
    },
    splashUnmount: () => {
      cy.waitForWebComponents(["lf-card", "lf-splash"]);
      cy.get("lf-splash")
        .should("exist")
        .then(($component) => {
          return new Cypress.Promise<void>((resolve) => {
            const splash: HTMLLfSplashElement = $component[0];

            const checkEvent = (event: LfEvent) => {
              if (
                event.type === "lf-splash-event" &&
                event.detail.eventType === "unmount"
              ) {
                splash.removeEventListener("lf-splash-event", checkEvent);
                resolve();
              }
            };

            splash.addEventListener("lf-splash-event", checkEvent);
            splash.style.pointerEvents = "none";
          });
        });
    },
    visit: () => {
      cy.visit("http://localhost:3333", {
        onBeforeLoad: (win) => {
          win.document.addEventListener(
            LF_FRAMEWORK_EVENT_NAME,
            (e: LfFrameworkEvent) => {
              lfFramework = e.detail.lfFramework;
            },
          );
        },
      });
    },
  };
}
//#endregion

const setupEventChecker = (component: string, eventType: LfEventType) => {
  const { check } = CY_ATTRIBUTES;

  const name = `lf-${component}-event`;

  cy.document().then((document) => {
    const checkEvent = (event: LfEvent) => {
      if (event.type === name && event.detail.eventType === eventType) {
        const eventCheck = document.createElement("div");
        eventCheck.dataset.cy = check;
        document.body.appendChild(eventCheck);
      }
    };
    document.addEventListener(name, checkEvent);
  });
};
