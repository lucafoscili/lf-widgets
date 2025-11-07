# LFW Testing Guide (Unit + E2E)

This guide covers both our unit/integration tests (Jest + Stencil) and our end‑to‑end tests (Cypress) with a clear separation of concerns so we avoid duplication and drift.

## 0. Testing Strategy Overview

- Unit/Integration (Jest + Stencil):
  - Location: packages/core
  - Scope: framework services and component units (adapters, events, props, rendering surface). Fast feedback, no network.
  - Mapping: tests run against real code with a clean module mapping to avoid ESM/CJS pitfalls:
    - @lf-widgets/foundations → ../foundations/src/index.ts (source)
    - @lf-widgets/framework → ../framework/dist/index.cjs.js (CJS build)
  - Mocks: keep them type‑safe and minimal; prefer the public framework API over deep helper imports. Use the shared mock factory when you truly need it.

- End‑to‑End (Cypress):
  - Location: packages/showcase/cypress
  - Scope: user flows through the showcase, public APIs, and documented selectors.
  - No Jest in showcase. Showcase tests are exclusively E2E with Cypress.

Callout: Do not duplicate unit tests inside the showcase. Unit/integration stays in core; E2E stays in showcase.

## 0.1 Where to put tests

- Framework/service utilities: packages/core/tests
- Component unit/spec tests: packages/core/src/components/{component}/{component}.spec.ts (Stencil + Jest)
- E2E scenarios and examples coverage: packages/showcase/cypress/e2e/**

## 0.2 Running tests

- From packages/core (Jest + Stencil):
  - yarn test (or npm test)
  - You can filter by file with: `yarn test -- --testPathPattern=lf-button.spec.ts`

- From packages/showcase (Cypress):
  - Start showcase dev server (root or showcase script), then run Cypress via the provided scripts (headless or open).
  - Keep tests deterministic by using public selectors and the helper commands described below.

## 0.3 Mocking and module mappings

- Prefer using the public framework API (`getLfFramework()`, `awaitFramework`) in tests over deep imports.
- When mocking is necessary, use a single, shared, typed mock factory (createMockFramework) in core tests. Avoid per‑suite ad‑hoc duplications.
- The moduleNameMapper for Jest lives in core’s Stencil configuration and maps foundations to source and framework to CJS build, ensuring consistent runtime behavior in Jest.

---

## 1. Mission Statement

- Preserve consistent, repeatable showcase coverage for every web component in `lf-widgets/packages/showcase/cypress/e2e/components`.
- Drive tests exclusively through public APIs and documented selectors so future refactors stay low-risk.
- Produce specs that AI assistants can extend autonomously by following deterministic steps.

## 2. Directory & Naming Rules

- Each component gets a single `.cy.ts` file under `packages/showcase/cypress/e2e/components` named after the component slug (e.g., `button.cy.ts`).
- Keep `const componentName`, `componentTag`, and `componentSlug` (tag without `lf-`) at the top of every file for reuse in helpers.
- Regions appear in the fixed order `Basic`, `Events`, `Methods`, `Props`, `e2e`. Never skip a header even if a block is temporarily empty.

## 3. Required Imports

1. `CY_ATTRIBUTES`, `LF_ATTRIBUTES`, component event/prop enums, and framework types from `@lf-widgets/foundations`.
2. Component fixtures via `get<Component>Fixtures` from `packages/showcase/src/components/lf-showcase/assets/data/<component>`.
3. `CY_ALIASES` and `CY_CATEGORIES` from `cypress/support/constants`.
4. `getExamplesKeys` from `cypress/support/utils`.
5. Additional helpers only when the component under test requires them.

## 4. Suite Bootstrap Template

```ts
const componentName: LfComponentName = "LfComponent";
const componentTag: LfComponentTag<typeof componentName> = "lf-component";
const componentSlug = componentTag.replace("lf-", "");

describe(CY_CATEGORIES.basic, () => {
  let framework: LfFrameworkInterface;

  beforeEach(() => {
    cy.navigate(componentSlug).waitForWebComponents([componentTag]);
    cy.getLfFramework().then((lfFramework) => {
      framework = lfFramework;
    });
  });

  it(`Should check that all <${componentTag}> exist.`, () => {
    const fixtures = getComponentFixtures(framework);
    const keys = getExamplesKeys(fixtures);
    cy.checkComponentExamples(componentTag, new Set(keys));
  });
});
```

## 5. Navigation & Aliases

- Always enter the showcase with `cy.navigate(componentSlug)`; it handles visiting `http://localhost:3333`, splash teardown, and alias hydration (`@lfComponentShowcase`).
- When immediate custom element availability matters, chain `.waitForWebComponents([componentTag])` right after navigation.
- Retrieve the LFW framework once per suite using `cy.getLfFramework()`; store the result in a `let framework` binding for downstream BEM checks.

## 6. Selector Discipline

- Query DOM nodes via `cy.getCyElement(attribute)` or `subject.findCyElement(attribute)`. These helpers expand `CY_ATTRIBUTES`/`LF_ATTRIBUTES` enums into `[data-cy="..."]` selectors.
- Use raw tag lookups (`cy.get(componentTag)`) only after ensuring the showcase container exists and the element is scoped within it.
- Access shadow DOM sparingly. Prefer component APIs or public data-cy handles. When you must assert shadow content, call `framework.theme.bemClass` to build class selectors.

## 7. Styling & BEM Assertions

- Never hard-code class strings. Generate them with `framework.theme.bemClass(block, element?, modifiers?)`.
- Validate modifier classes by creating selectors such as ```.${framework.theme.bemClass("button", null, { raised: true })}```.
- When checking element order (e.g., ripple → label → icon), collect children via `.children()` and validate each child against expected BEM classes and `data-cy` attributes.

## 8. Custom Command Playbook

| Command | Primary Use | Typical Call |
| --- | --- | --- |
| `cy.checkComponentExamples(tag, new Set(keys))` | Confirm fixture completeness | Basic suite |
| `cy.checkComponentExamplesNumber(ids)` | Assert example IDs exist | Basic suite extension |
| `cy.checkEvent(slug, eventType)` | Attach listener + alias first example | Events suite |
| `cy.checkReadyEvent(slug)` / `cy.checkUnmountEvent(slug)` | Lifecycle validation | Events suite |
| `cy.checkDebugInfo(tag)` | Debug payload schema | Methods suite |
| `cy.checkRenderCountIncrease(tag)` | Re-render proof | Methods suite |
| `cy.checkProps(tag, name[, global])` | Props reflection coverage | Methods/Props suite |
| `cy.checkRipple(tagOrSelector)` | Ripple instantiation | Props suite |
| `cy.checkLfStyle()` | Shared stylesheet injection | Props suite |
| `cy.getCyElement(attr)` / `.findCyElement(attr)` | Selector expansion | Any suite |
| `cy.waitForWebComponents(tags)` | Ensure custom elements defined | Setups |

## 9. Event Testing Pattern

1. Call `cy.checkEvent(componentSlug, eventType)` at the start of the test. This wires the DOM listener and aliases the showcase example as `@eventElement`.
2. Trigger the event through user-visible affordances (buttons, ripple surfaces, dropdown menus) rather than programmatic dispatch.
3. Finish with `cy.getCyElement(CY_ATTRIBUTES.check).should("exist")` to assert the listener fired.
4. For ready/unmount, use the dedicated helpers instead of reproducing the navigation logic.

## 10. Async Component APIs

- Wrap host elements with `cy.wrap($el).should(async ($component) => { ... })` whenever invoking async methods like `getValue`, `setValue`, `toggleNode`, or `getSelectedNodes`.
- After mutating component state, chain a second `cy.wrap(...).should(async ...)` to confirm the new state, mirroring the togglable button pattern.
- When measuring render counts, store the initial value, call `refresh()`, and read the new count inside a `requestAnimationFrame` callback to avoid race conditions.

## 11. Props & Dataset Coverage

- Use component fixtures to derive expectations. Compare dataset lengths to rendered node counts when applicable.
- Validate boolean props by asserting both the component property and any DOM manifestation (e.g., ripple surfaces, spinner presence).
- For reflected attributes, assert on the host (`cy.get(lfComponentShowcase).find(`${componentTag}#id`).should("have.attr", "attribute", value)`).
- Never assume hard-coded IDs. Derive example IDs via `getExamplesKeys(fixtures)` or inspect the fixture data structure.

## 12. End-to-End Flow Guidance

- Reserve `describe(CY_CATEGORIES.e2e, ...)` for flows that combine user interaction with UI verification (expand/collapse, dropdown selection, etc.).
- Set up necessary preconditions via component APIs before entering `within` blocks. Example: pre-expand an accordion node with `toggleNode` before asserting collapse behaviour.
- Assert outcomes using BEM selectors or `data-cy` attributes rather than textual content to stay localization-safe.
- Keep e2e cases atomic—one user journey per `it` block.

## 13. AI-Focused Authoring Checklist (E2E)

1. **Gather inputs**: component name, tag, fixtures path, relevant enums.
2. **Scaffold file**: copy Section 4 template, update identifiers, import statements, and region headers.
3. **Populate suites**:
   - Basic: derive `keys` from fixtures, call `cy.checkComponentExamples`.
   - Events: enumerate supported events, follow Section 9 pattern.
   - Methods: cover `getDebugInfo`, `checkRenderCountIncrease`, `checkProps`, plus component-specific APIs.
   - Props: assert dataset rendering, boolean reflections, ripple/LF style, and any visual props.
   - e2e: script at least one end-user flow.
4. **Validate selectors**: ensure every DOM lookup uses `cy.getCyElement`/`findCyElement` or BEM helpers.
5. **Review async usage**: confirm every component method call sits inside an async `should` block.
6. **Run locally**: execute your Cypress test script (e.g., `yarn e2e` or `npm run e2e`) to smoke the suite.
7. **Self-audit**: verify imports are sorted, no unused helpers remain, and all regions are present.

## 14. Troubleshooting Playbook

- **Component not found**: confirm showcase card ID matches the slug (capitalized first letter) and that fixtures export the expected examples.
- **Event assertion fails**: ensure `cy.checkEvent` is called before interaction and that the correct `data-cy` handle is clicked.
- **BEM selector mismatch**: log `framework.theme.bemClass` output in a `cy.then` block to inspect the generated class.
- **Async assertion timeout**: wrap awaited calls in `cy.wrap(...).should(async ...)`; avoid `await` outside of Cypress commands.

By following these deterministic steps, any assistant—human or AI—can author new showcase specs that align with existing LFW conventions while remaining resilient to implementation changes.

---

## 15. Unit/Integration Testing (Jest + Stencil) Quick Reference

Use this when adding or updating component/framework unit tests in packages/core.

- Location & naming:
  - Component specs live next to components (e.g., `packages/core/src/components/lf-button/lf-button.spec.ts`).
  - Cross‑cutting framework tests live under `packages/core/tests/`.

- Runtime mapping:
  - foundations → source: `@lf-widgets/foundations` → `../foundations/src/index.ts`
  - framework → CJS: `@lf-widgets/framework` → `../framework/dist/index.cjs.js`

- Preferred patterns:
  - Initialize framework readiness in tests that mount components.
  - Use kebab‑case attributes for Stencil props in HTML templates.
  - Avoid Jest fake timers with Stencil unless strictly necessary; favor real timers + minimal sleeps.
  - Funnel interactions through public events; avoid deep invoking internal handlers.

- Don’ts:
  - Don’t create Jest tests in showcase.
  - Don’t check in duplicate foundations/framework mirrors under core (these are ignored by .gitignore).
  - Don’t deep‑import framework internals; prefer the public API.

With this split (core = Jest unit/integration, showcase = Cypress E2E), the suite stays fast, clear, and non‑duplicative.
