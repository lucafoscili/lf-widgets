import {
  LfCardAdapter,
  LfCardAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-card.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepCardComputed = (
  getAdapter: () => LfCardAdapter,
): LfCardAdapterControllerComputed => {
  /**
   * Whether the card has a valid dataset.
   * Used to determine if layout should render.
   */
  const hasDataset = () => {
    const { compInstance } = getAdapter().controller.get;
    return Boolean(compInstance().lfDataset?.nodes?.length);
  };

  /**
   * Whether the card has slot children.
   * Used as fallback when no dataset is provided.
   */
  const hasSlotChildren = () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().rootElement.children.length > 0;
  };

  /**
   * Whether the card should render (has content).
   * Combined check for dataset or slot children.
   */
  const shouldRender = () => {
    return hasDataset() || hasSlotChildren();
  };

  return {
    hasDataset,
    hasSlotChildren,
    shouldRender,
  };
};
