/**
 * Test helper utilities for LF Widgets
 */

export {
  collectExpectedClasses,
  collectDOMClasses,
  verifyBlocksAlignment,
  verifyBlocksNesting,
  verifyComponentBlocks,
} from "./blocks-dom-alignment";

export {
  // Core helpers
  createFCTestPage,
  getTestFramework,
  // Types
  type FCTestContext,
  type FCBaseProps,
  type CallbackAssertionConfig,
  type RefAssertionConfig,
  // UI State assertions
  assertUiState,
  assertDefaultUiState,
  getUiStateTestCases,
  // UI Size assertions
  assertUiSize,
  assertMediumSizeNoVariable,
  getUiSizeTestCases,
  // Callback assertions
  assertCallback,
  assertCallbackNotCalled,
  createCallbackSpy,
  // Ref forwarding assertions
  assertRefForwarding,
  createRefSpy,
  // BEM class assertions
  assertBemClass,
  assertNoBemClass,
  assertBemModifier,
  assertBemElement,
  // Part/data attribute assertions
  assertPartAttribute,
  assertDataCyAttribute,
  // Custom styling assertions
  assertCustomClassName,
  assertCustomStyles,
  assertCustomId,
  // Disabled state assertions
  assertInputDisabled,
  assertInputEnabled,
  // Event simulation helpers
  simulateChange,
  simulateInput,
  simulateFocus,
  simulateBlur,
  simulateClick,
  simulatePointerDown,
} from "./fc-test-utils";
