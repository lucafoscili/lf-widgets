import { FunctionalComponent, h } from "@stencil/core";
import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import {
  LfFrameworkInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";

/**
 * FC Test Utilities
 *
 * Shared test helpers for Functional Component (FC) testing.
 * All FCs in the LF Widgets library follow the same patterns:
 *
 * 1. `framework` prop (required) - LfFrameworkInterface for BEM classes
 * 2. `uiState` prop → `data-lf` attribute for semantic coloring
 * 3. `uiSize` prop → `--lf-fc-ui-size` CSS variable for sizing
 * 4. Callback props instead of CustomEvents for direct communication
 * 5. Ref forwarding via callback refs for accessing DOM elements
 *
 * These utilities ensure consistent testing across all FCs:
 * - LfSliderFC
 * - LfToggleFC
 * - LfTextfieldFC
 * - LfButtonFC
 * - LfBadgeFC
 * - LfImageFC
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */

//#region Types
/**
 * Context object returned by createFCTestPage.
 * Contains everything needed to perform assertions on the rendered FC.
 */
export interface FCTestContext {
  /** The framework instance used for rendering */
  framework: LfFrameworkInterface;
  /** The Stencil spec page object */
  page: SpecPage;
  /** The root wrapper element containing the FC */
  root: Element;
}

/**
 * Base props interface for FCs.
 * All FCs extend this with their specific props.
 */
export interface FCBaseProps {
  framework: LfFrameworkInterface;
  uiState?: LfThemeUIState;
  uiSize?: LfThemeUISize;
  className?: string;
  style?: Record<string, string>;
  id?: string;
}

/**
 * Configuration for callback assertion.
 */
export interface CallbackAssertionConfig {
  /** The spy function to check */
  spy: jest.Mock;
  /** Expected number of calls (default: 1) */
  callCount?: number;
  /** Expected arguments for the call (partial match) */
  expectedArgs?: unknown[];
  /** Index of the call to check (default: 0, the first call) */
  callIndex?: number;
}

/**
 * Configuration for ref forwarding assertion.
 */
export interface RefAssertionConfig {
  /** The ref callback spy */
  refSpy: jest.Mock;
  /** Expected element type (e.g., HTMLInputElement) */
  elementType?: new (...args: unknown[]) => HTMLElement;
  /** Expected class on the element */
  expectedClass?: string;
}
//#endregion

//#region Core Helpers
/**
 * Creates a test page with an FC rendered inside a wrapper div.
 * Initializes framework automatically if not provided.
 *
 * The FC is wrapped in a div to simulate being used inside a parent
 * component's shadow DOM, which is the typical usage pattern.
 *
 * @param FC - The Functional Component to render
 * @param props - Props to pass to the FC (framework is optional)
 * @returns FCTestContext with framework, page, and root element
 *
 * @example
 * ```tsx
 * const ctx = await createFCTestPage(LfSliderFC, {
 *   value: { display: 50, real: 50 },
 *   uiState: "success"
 * });
 * expect(ctx.root.querySelector(".slider")).toBeTruthy();
 * ```
 */
export async function createFCTestPage<P extends FCBaseProps>(
  FC: FunctionalComponent<P>,
  props: Partial<Omit<P, "framework">> & { framework?: LfFrameworkInterface },
): Promise<FCTestContext> {
  const framework = props.framework || getLfFramework();

  const fcProps = {
    ...props,
    framework,
  } as P;

  const page = await newSpecPage({
    components: [],
    template: () => (
      <div>
        <FC {...fcProps} />
      </div>
    ),
  });

  return {
    framework,
    page,
    root: page.root,
  };
}

/**
 * Gets the framework instance for use in beforeAll hooks.
 * Ensures consistent framework initialization across tests.
 *
 * @returns LfFrameworkInterface instance
 *
 * @example
 * ```tsx
 * let framework: LfFrameworkInterface;
 *
 * beforeAll(() => {
 *   framework = getTestFramework();
 * });
 * ```
 */
export function getTestFramework(): LfFrameworkInterface {
  return getLfFramework();
}
//#endregion

//#region UI State Assertions
/**
 * Asserts that the `data-lf` attribute is set correctly on an element.
 * All FCs use this attribute for semantic state coloring (primary, success, danger, etc.).
 *
 * @param element - The element to check (typically the root form-field or main container)
 * @param expectedState - The expected uiState value
 * @param selector - Optional CSS selector to find the element within root
 *
 * @example
 * ```tsx
 * // Direct element check
 * const formField = ctx.root.querySelector(".form-field");
 * assertUiState(formField, "success");
 *
 * // With selector
 * assertUiState(ctx.root, "danger", ".form-field");
 * ```
 */
export function assertUiState(
  element: Element,
  expectedState: LfThemeUIState,
  selector?: string,
): void {
  const target = selector ? element.querySelector(selector) : element;

  if (!target) {
    throw new Error(
      `assertUiState: Element not found${selector ? ` with selector "${selector}"` : ""}`,
    );
  }

  const actualState = target.getAttribute("data-lf");
  expect(actualState).toBe(expectedState);
}

/**
 * Asserts that the default uiState (primary) is applied when no uiState prop is passed.
 *
 * @param element - The element to check
 * @param selector - Optional CSS selector to find the element within root
 *
 * @example
 * ```tsx
 * const ctx = await createFCTestPage(LfSliderFC, { value: defaultValue });
 * assertDefaultUiState(ctx.root, ".form-field");
 * ```
 */
export function assertDefaultUiState(element: Element, selector?: string): void {
  assertUiState(element, "primary", selector);
}

/**
 * Asserts all standard uiState values work correctly.
 * Use this in a describe block to verify complete uiState coverage.
 *
 * @returns Array of test cases for use with it.each
 *
 * @example
 * ```tsx
 * describe("UI States", () => {
 *   it.each(getUiStateTestCases())("applies %s uiState", async (state) => {
 *     const ctx = await createFCTestPage(FC, { ...props, uiState: state });
 *     assertUiState(ctx.root, state, ".form-field");
 *   });
 * });
 * ```
 */
export function getUiStateTestCases(): LfThemeUIState[] {
  return ["primary", "secondary", "success", "warning", "danger", "info"];
}
//#endregion

//#region UI Size Assertions
/**
 * Asserts that the `--lf-fc-ui-size` CSS variable is set correctly.
 * This variable is only set when uiSize is NOT "medium" (the default).
 *
 * @param element - The element to check (typically has the style applied)
 * @param expectedSize - The expected uiSize value
 * @param selector - Optional CSS selector to find the element within root
 *
 * @example
 * ```tsx
 * const ctx = await createFCTestPage(LfSliderFC, {
 *   value: defaultValue,
 *   uiSize: "small"
 * });
 * assertUiSize(ctx.root, "small", ".form-field");
 * ```
 */
export function assertUiSize(
  element: Element,
  expectedSize: LfThemeUISize,
  selector?: string,
): void {
  const target = selector
    ? (element.querySelector(selector) as HTMLElement)
    : (element as HTMLElement);

  if (!target) {
    throw new Error(
      `assertUiSize: Element not found${selector ? ` with selector "${selector}"` : ""}`,
    );
  }

  const cssVar = target.style.getPropertyValue("--lf-fc-ui-size");

  if (expectedSize === "medium") {
    // Medium is default, no CSS variable should be set
    expect(cssVar).toBe("");
  } else {
    expect(cssVar).toBe(`var(--lf-ui-size-${expectedSize})`);
  }
}

/**
 * Asserts that no CSS variable is set for medium size (the default).
 * Medium doesn't need a CSS variable since it's the baseline.
 *
 * @param element - The element to check
 * @param selector - Optional CSS selector to find the element within root
 *
 * @example
 * ```tsx
 * const ctx = await createFCTestPage(LfSliderFC, {
 *   value: defaultValue,
 *   uiSize: "medium"
 * });
 * assertMediumSizeNoVariable(ctx.root, ".form-field");
 * ```
 */
export function assertMediumSizeNoVariable(
  element: Element,
  selector?: string,
): void {
  assertUiSize(element, "medium", selector);
}

/**
 * Returns array of all uiSize values for parameterized testing.
 *
 * @returns Array of uiSize test cases
 *
 * @example
 * ```tsx
 * describe("UI Sizes", () => {
 *   it.each(getUiSizeTestCases())("applies %s uiSize", async (size) => {
 *     const ctx = await createFCTestPage(FC, { ...props, uiSize: size });
 *     assertUiSize(ctx.root, size, ".form-field");
 *   });
 * });
 * ```
 */
export function getUiSizeTestCases(): LfThemeUISize[] {
  return ["xsmall", "small", "medium", "large", "xlarge"];
}
//#endregion

//#region Callback Assertions
/**
 * Asserts that a callback was called with expected arguments.
 * FCs use callbacks instead of CustomEvents for direct parent communication.
 *
 * @param config - Configuration object with spy, expected call count, and args
 *
 * @example
 * ```tsx
 * const onChangeSpy = jest.fn();
 * const ctx = await createFCTestPage(LfSliderFC, {
 *   value: defaultValue,
 *   onChange: onChangeSpy
 * });
 *
 * const input = ctx.root.querySelector("input[type='range']") as HTMLInputElement;
 * input.value = "75";
 * input.dispatchEvent(new Event("change"));
 *
 * assertCallback({
 *   spy: onChangeSpy,
 *   callCount: 1,
 *   expectedArgs: [75, expect.any(Event)]
 * });
 * ```
 */
export function assertCallback(config: CallbackAssertionConfig): void {
  const { spy, callCount = 1, expectedArgs, callIndex = 0 } = config;

  expect(spy).toHaveBeenCalledTimes(callCount);

  if (expectedArgs !== undefined) {
    expect(spy).toHaveBeenNthCalledWith(callIndex + 1, ...expectedArgs);
  }
}

/**
 * Asserts that a callback was NOT called.
 * Useful for testing that callbacks are optional and don't throw when undefined.
 *
 * @param spy - The jest mock spy to check
 *
 * @example
 * ```tsx
 * const onChangeSpy = jest.fn();
 * // ... don't trigger the event ...
 * assertCallbackNotCalled(onChangeSpy);
 * ```
 */
export function assertCallbackNotCalled(spy: jest.Mock): void {
  expect(spy).not.toHaveBeenCalled();
}

/**
 * Creates a spy function that can be passed as a callback prop.
 * Convenience wrapper around jest.fn().
 *
 * @returns A jest mock function
 *
 * @example
 * ```tsx
 * const onChangeSpy = createCallbackSpy();
 * const ctx = await createFCTestPage(FC, { onChange: onChangeSpy });
 * ```
 */
export function createCallbackSpy(): jest.Mock {
  return jest.fn();
}
//#endregion

//#region Ref Forwarding Assertions
/**
 * Asserts that a ref callback was called with the correct DOM element.
 * FCs use callback refs to expose internal elements to parent components.
 *
 * @param config - Configuration with ref spy, expected element type, and class
 *
 * @example
 * ```tsx
 * let inputEl: HTMLInputElement | null = null;
 * const inputRefSpy = jest.fn((el: HTMLInputElement | null) => {
 *   inputEl = el;
 * });
 *
 * await createFCTestPage(LfSliderFC, {
 *   value: defaultValue,
 *   inputRef: inputRefSpy
 * });
 *
 * assertRefForwarding({
 *   refSpy: inputRefSpy,
 *   elementType: HTMLInputElement,
 *   expectedClass: "slider__native-control"
 * });
 * ```
 */
export function assertRefForwarding(config: RefAssertionConfig): void {
  const { refSpy, elementType, expectedClass } = config;

  expect(refSpy).toHaveBeenCalled();

  // Get the element that was passed to the ref
  const element = refSpy.mock.calls[0][0] as HTMLElement;

  if (elementType) {
    expect(element).toBeInstanceOf(elementType);
  }

  if (expectedClass) {
    expect(element?.classList.contains(expectedClass)).toBe(true);
  }
}

/**
 * Creates a ref callback spy that also captures the element.
 * Returns both the spy and a getter for the captured element.
 *
 * @returns Object with spy function and element getter
 *
 * @example
 * ```tsx
 * const { spy: inputRefSpy, getElement } = createRefSpy<HTMLInputElement>();
 *
 * await createFCTestPage(LfSliderFC, {
 *   value: defaultValue,
 *   inputRef: inputRefSpy
 * });
 *
 * const input = getElement();
 * expect(input?.type).toBe("range");
 * ```
 */
export function createRefSpy<T extends HTMLElement>(): {
  spy: jest.Mock;
  getElement: () => T | null;
} {
  let captured: T | null = null;

  const spy = jest.fn((el: T | null) => {
    captured = el;
  });

  return {
    spy,
    getElement: () => captured,
  };
}
//#endregion

//#region BEM Class Assertions
/**
 * Asserts that an element has the correct BEM class.
 * Uses the framework's bemClass method for consistent class generation.
 *
 * @param element - The element to check
 * @param expectedClass - The expected BEM class name
 *
 * @example
 * ```tsx
 * const slider = ctx.root.querySelector(".slider");
 * assertBemClass(slider, "slider");
 * assertBemClass(slider, "slider--disabled");
 * ```
 */
export function assertBemClass(element: Element, expectedClass: string): void {
  if (!element) {
    throw new Error(`assertBemClass: Element is null or undefined`);
  }

  expect(element.classList.contains(expectedClass)).toBe(true);
}

/**
 * Asserts that an element does NOT have a specific BEM class.
 * Useful for testing modifier class removal.
 *
 * @param element - The element to check
 * @param unexpectedClass - The class that should NOT be present
 *
 * @example
 * ```tsx
 * const slider = ctx.root.querySelector(".slider");
 * assertNoBemClass(slider, "slider--disabled"); // should not be disabled
 * ```
 */
export function assertNoBemClass(
  element: Element,
  unexpectedClass: string,
): void {
  if (!element) {
    throw new Error(`assertNoBemClass: Element is null or undefined`);
  }

  expect(element.classList.contains(unexpectedClass)).toBe(false);
}

/**
 * Asserts that an element has a BEM modifier class.
 * Convenience wrapper for assertBemClass with modifier pattern.
 *
 * @param element - The element to check
 * @param block - The BEM block name (e.g., "slider")
 * @param modifier - The modifier name (e.g., "disabled")
 *
 * @example
 * ```tsx
 * const slider = ctx.root.querySelector(".slider");
 * assertBemModifier(slider, "slider", "disabled");
 * // Checks for "slider--disabled" class
 * ```
 */
export function assertBemModifier(
  element: Element,
  block: string,
  modifier: string,
): void {
  assertBemClass(element, `${block}--${modifier}`);
}

/**
 * Asserts that an element has a BEM element class.
 * Convenience wrapper for assertBemClass with element pattern.
 *
 * @param element - The element to check
 * @param block - The BEM block name (e.g., "slider")
 * @param elementName - The element name (e.g., "thumb")
 *
 * @example
 * ```tsx
 * const thumb = ctx.root.querySelector(".slider__thumb");
 * assertBemElement(thumb, "slider", "thumb");
 * ```
 */
export function assertBemElement(
  element: Element,
  block: string,
  elementName: string,
): void {
  assertBemClass(element, `${block}__${elementName}`);
}
//#endregion

//#region Part Attribute Assertions
/**
 * Asserts that an element has the correct `part` attribute.
 * Parts allow external styling of shadow DOM elements.
 *
 * @param element - The element to check
 * @param expectedPart - The expected part attribute value
 *
 * @example
 * ```tsx
 * const slider = ctx.root.querySelector(".slider");
 * assertPartAttribute(slider, "slider");
 * ```
 */
export function assertPartAttribute(
  element: Element,
  expectedPart: string,
): void {
  if (!element) {
    throw new Error(`assertPartAttribute: Element is null or undefined`);
  }

  expect(element.getAttribute("part")).toBe(expectedPart);
}

/**
 * Asserts that an element has the correct `data-cy` attribute.
 * Used for Cypress testing selectors.
 *
 * @param element - The element to check
 * @param expectedValue - The expected data-cy value
 *
 * @example
 * ```tsx
 * const input = ctx.root.querySelector("input");
 * assertDataCyAttribute(input, "input");
 * ```
 */
export function assertDataCyAttribute(
  element: Element,
  expectedValue: string,
): void {
  if (!element) {
    throw new Error(`assertDataCyAttribute: Element is null or undefined`);
  }

  expect(element.getAttribute("data-cy")).toBe(expectedValue);
}
//#endregion

//#region Custom Styling Assertions
/**
 * Asserts that custom className is applied to an element.
 *
 * @param element - The element to check
 * @param expectedClassName - The custom class that should be present
 *
 * @example
 * ```tsx
 * const ctx = await createFCTestPage(LfSliderFC, {
 *   value: defaultValue,
 *   className: "my-custom-slider"
 * });
 * assertCustomClassName(ctx.root.querySelector(".form-field"), "my-custom-slider");
 * ```
 */
export function assertCustomClassName(
  element: Element,
  expectedClassName: string,
): void {
  if (!element) {
    throw new Error(`assertCustomClassName: Element is null or undefined`);
  }

  expect(element.classList.contains(expectedClassName)).toBe(true);
}

/**
 * Asserts that custom style properties are applied to an element.
 *
 * @param element - The element to check (must be HTMLElement)
 * @param expectedStyles - Object of style property/value pairs
 *
 * @example
 * ```tsx
 * const ctx = await createFCTestPage(LfSliderFC, {
 *   value: defaultValue,
 *   style: { color: "red", padding: "10px" }
 * });
 * const formField = ctx.root.querySelector(".form-field") as HTMLElement;
 * assertCustomStyles(formField, { color: "red", padding: "10px" });
 * ```
 */
export function assertCustomStyles(
  element: HTMLElement,
  expectedStyles: Record<string, string>,
): void {
  if (!element) {
    throw new Error(`assertCustomStyles: Element is null or undefined`);
  }

  for (const [property, value] of Object.entries(expectedStyles)) {
    // Handle both camelCase and kebab-case property names
    const styleValue =
      element.style[property as keyof CSSStyleDeclaration] ||
      element.style.getPropertyValue(property);
    expect(styleValue).toBe(value);
  }
}

/**
 * Asserts that custom id is applied to an element.
 *
 * @param element - The element to check
 * @param expectedId - The expected id value
 *
 * @example
 * ```tsx
 * const ctx = await createFCTestPage(LfSliderFC, {
 *   value: defaultValue,
 *   id: "my-slider-id"
 * });
 * assertCustomId(ctx.root.querySelector(".form-field"), "my-slider-id");
 * ```
 */
export function assertCustomId(element: Element, expectedId: string): void {
  if (!element) {
    throw new Error(`assertCustomId: Element is null or undefined`);
  }

  expect(element.id).toBe(expectedId);
}
//#endregion

//#region Disabled State Assertions
/**
 * Asserts that a native input element has the disabled attribute.
 *
 * @param element - The input element to check
 *
 * @example
 * ```tsx
 * const input = ctx.root.querySelector("input") as HTMLInputElement;
 * assertInputDisabled(input);
 * ```
 */
export function assertInputDisabled(
  element: HTMLInputElement | HTMLButtonElement,
): void {
  if (!element) {
    throw new Error(`assertInputDisabled: Element is null or undefined`);
  }

  expect(element.disabled).toBe(true);
}

/**
 * Asserts that a native input element is NOT disabled.
 *
 * @param element - The input element to check
 *
 * @example
 * ```tsx
 * const input = ctx.root.querySelector("input") as HTMLInputElement;
 * assertInputEnabled(input);
 * ```
 */
export function assertInputEnabled(
  element: HTMLInputElement | HTMLButtonElement,
): void {
  if (!element) {
    throw new Error(`assertInputEnabled: Element is null or undefined`);
  }

  expect(element.disabled).toBe(false);
}
//#endregion

//#region Event Simulation Helpers
/**
 * Simulates a change event on an input element.
 *
 * @param input - The input element
 * @param value - The new value to set
 *
 * @example
 * ```tsx
 * const input = ctx.root.querySelector("input") as HTMLInputElement;
 * simulateChange(input, "75");
 * ```
 */
export function simulateChange(
  input: HTMLInputElement,
  value: string | number,
): void {
  input.value = String(value);
  input.dispatchEvent(new Event("change"));
}

/**
 * Simulates an input event on an input element.
 *
 * @param input - The input element
 * @param value - The new value to set
 *
 * @example
 * ```tsx
 * const input = ctx.root.querySelector("input") as HTMLInputElement;
 * simulateInput(input, "60");
 * ```
 */
export function simulateInput(
  input: HTMLInputElement,
  value: string | number,
): void {
  input.value = String(value);
  input.dispatchEvent(new Event("input"));
}

/**
 * Simulates focus event on an element.
 *
 * @param element - The element to focus
 *
 * @example
 * ```tsx
 * const input = ctx.root.querySelector("input") as HTMLInputElement;
 * simulateFocus(input);
 * ```
 */
export function simulateFocus(element: HTMLElement): void {
  element.dispatchEvent(new FocusEvent("focus"));
}

/**
 * Simulates blur event on an element.
 *
 * @param element - The element to blur
 *
 * @example
 * ```tsx
 * const input = ctx.root.querySelector("input") as HTMLInputElement;
 * simulateBlur(input);
 * ```
 */
export function simulateBlur(element: HTMLElement): void {
  element.dispatchEvent(new FocusEvent("blur"));
}

/**
 * Simulates a click event on an element.
 *
 * @param element - The element to click
 *
 * @example
 * ```tsx
 * const button = ctx.root.querySelector("button");
 * simulateClick(button);
 * ```
 */
export function simulateClick(element: HTMLElement): void {
  element.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true }),
  );
}

/**
 * Simulates a pointerdown event on an element.
 * Uses MouseEvent since PointerEvent is not available in JSDOM.
 *
 * @param element - The element
 *
 * @example
 * ```tsx
 * const input = ctx.root.querySelector("input");
 * simulatePointerDown(input);
 * ```
 */
export function simulatePointerDown(element: HTMLElement): void {
  element.dispatchEvent(
    new MouseEvent("pointerdown", { bubbles: true, cancelable: true }),
  );
}
//#endregion
