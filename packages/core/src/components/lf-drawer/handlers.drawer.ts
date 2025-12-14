import {
  LfDrawerAdapter,
  LfDrawerAdapterHandlers,
} from "@lf-widgets/foundations";

/**
 * Factory to create event handlers for lf-drawer.
 *
 * Handlers are callbacks that respond to DOM events.
 * They coordinate state changes via the adapter's controller.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Handlers object
 *
 * @see Section 5.8 of 4_0_0_REFACTORING.md
 */
export const prepDrawerHandlers = (
  getAdapter: () => LfDrawerAdapter,
): LfDrawerAdapterHandlers => {
  return {
    //#region Keyboard
    /**
     * Handles keyboard events for focus trap and close functionality.
     * - Escape: Closes the drawer
     * - Tab: Traps focus within the drawer
     */
    keyboard: (e: KeyboardEvent) => {
      const { controller } = getAdapter();
      const { isOpen } = controller.computed;
      const { close, trapFocus } = controller.actions;

      if (!isOpen()) {
        return;
      }

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          close();
          break;
        case "Tab":
          trapFocus(e);
          break;
      }
    },
    //#endregion

    //#region Backdrop Click
    /**
     * Handles backdrop click to close the drawer.
     * Only closes when drawer is open.
     */
    backdropClick: () => {
      const { controller } = getAdapter();
      const { isOpen } = controller.computed;
      const { close } = controller.actions;

      if (isOpen()) {
        close();
      }
    },
    //#endregion
  };
};
