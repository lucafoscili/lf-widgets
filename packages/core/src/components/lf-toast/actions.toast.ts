import {
  LfToastAdapter,
  LfToastAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-toast.
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
export const prepToastActions = (
  getAdapter: () => LfToastAdapter,
): LfToastAdapterControllerActions => ({
  /**
   * Closes the toast.
   * Invokes the close callback if provided, otherwise unmounts the component.
   */
  close: (e?: PointerEvent) => {
    const adapter = getAdapter();
    const { compInstance } = adapter.controller.get;
    const { dispatcher } = adapter;

    const comp = compInstance();
    const { lfCloseCallback } = comp;

    // Emit close event
    dispatcher.emit("close", { originalEvent: e });

    // Invoke callback or default unmount
    if (lfCloseCallback) {
      lfCloseCallback(comp, e);
    } else {
      comp.unmount();
    }
  },
});
