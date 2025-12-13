import {
  LfDataNode,
  LfTabbarAdapter,
  LfTabbarAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-tabbar.
 *
 * Actions are complex multi-step operations that may:
 * - Have side effects
 * - Trigger re-renders
 * - Batch multiple state changes
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Actions object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepTabbarActions = (
  getAdapter: () => LfTabbarAdapter,
): LfTabbarAdapterControllerActions => ({
  /**
   * Selects a tab by index and node reference.
   * Updates the component value state.
   *
   * @param index - The index of the tab to select
   * @param node - The data node associated with the tab
   */
  select: (index: number, _node: LfDataNode) => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();

    // Use lfValue to trigger the watcher which updates internal state
    comp.lfValue = index;
  },

  /**
   * Triggers a scroll in the tab container.
   *
   * @param direction - Direction to scroll ("left" or "right")
   */
  scroll: (direction: "left" | "right") => {
    const { scrollContainer } = getAdapter().elements.refs;

    const scrollAmount = 200;
    if (scrollContainer) {
      const currentScroll = scrollContainer.scrollLeft;
      const newScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;
      scrollContainer.scrollTo({ left: newScroll, behavior: "smooth" });
    }
  },
});
