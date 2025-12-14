import {
  LF_EFFECTS_FOCUSABLES,
  LfDrawerAdapter,
  LfDrawerAdapterControllerActions,
  LfDrawerDisplay,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-drawer.
 *
 * Actions are complex multi-step operations that may:
 * - Have side effects
 * - Trigger re-renders
 * - Batch multiple state changes
 * - Manage focus and backdrop
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @param setPreviouslyFocused - Setter for storing previously focused element
 * @param getPreviouslyFocused - Getter for retrieving previously focused element
 * @returns Actions object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepDrawerActions = (
  getAdapter: () => LfDrawerAdapter,
  setPreviouslyFocused: (el: HTMLElement | null) => void,
  getPreviouslyFocused: () => HTMLElement | null,
): LfDrawerAdapterControllerActions => ({
  /**
   * Opens the drawer with focus management.
   * - Stores the currently focused element
   * - Sets lfValue to true
   * - Shows backdrop for slide mode
   * - Focuses first focusable element
   */
  open: () => {
    const { controller, dispatcher } = getAdapter();
    const { compInstance, framework } = controller.get;
    const { isOpen, isSlide } = controller.computed;
    const { focusFirstElement } = controller.actions;

    if (isOpen()) {
      return;
    }

    const comp = compInstance();
    const fw = framework();

    // Store the currently focused element for restoration
    setPreviouslyFocused(document.activeElement as HTMLElement);

    requestAnimationFrame(() => {
      comp.lfValue = true;
      dispatcher.emit("open", { originalEvent: new CustomEvent("open") });

      if (isSlide()) {
        fw.effects.backdrop.show(() => {
          controller.actions.close();
        });
      }

      // Focus first element after drawer is rendered
      requestAnimationFrame(() => {
        focusFirstElement();
      });
    });
  },

  /**
   * Closes the drawer with focus restoration.
   * - Sets lfValue to false
   * - Hides backdrop
   * - Restores focus to previously focused element
   */
  close: () => {
    const { controller, dispatcher } = getAdapter();
    const { compInstance, framework } = controller.get;
    const { isOpen } = controller.computed;

    if (!isOpen()) {
      return;
    }

    const comp = compInstance();
    const fw = framework();

    requestAnimationFrame(() => {
      comp.lfValue = false;
      dispatcher.emit("close", { originalEvent: new CustomEvent("close") });
      fw.effects.backdrop.hide();

      // Restore focus to previously focused element
      const previousEl = getPreviouslyFocused();
      if (previousEl) {
        previousEl.focus();
        setPreviouslyFocused(null);
      }
    });
  },

  /**
   * Toggles the drawer open/closed state.
   */
  toggle: () => {
    const { controller } = getAdapter();
    const { isOpen } = controller.computed;
    const { open, close } = controller.actions;

    if (isOpen()) {
      close();
    } else {
      open();
    }
  },

  /**
   * Handles focus trapping within the drawer.
   * Keeps focus cycling between first and last focusable elements.
   */
  trapFocus: (e: KeyboardEvent) => {
    const { controller, elements } = getAdapter();
    const { isOpen } = controller.computed;
    const { refs } = elements;

    if (!isOpen() || !refs.drawer) {
      return;
    }

    const focusableElements = Array.from(
      refs.drawer.querySelectorAll<HTMLElement>(
        LF_EFFECTS_FOCUSABLES.join(","),
      ),
    ).filter(
      (el) =>
        el.offsetWidth > 0 ||
        el.offsetHeight > 0 ||
        el === document.activeElement,
    );

    if (focusableElements.length === 0) {
      e.preventDefault();
      return;
    }

    const firstElem = focusableElements[0];
    const lastElem = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElem) {
      e.preventDefault();
      lastElem.focus();
    } else if (!e.shiftKey && document.activeElement === lastElem) {
      e.preventDefault();
      firstElem.focus();
    }
  },

  /**
   * Focuses the first focusable element in the drawer.
   * Falls back to focusing the drawer container if no focusable elements found.
   */
  focusFirstElement: () => {
    const { controller, elements } = getAdapter();
    const { isOpen } = controller.computed;
    const { refs } = elements;

    if (!isOpen() || !refs.drawer) {
      return;
    }

    const focusable = refs.drawer.querySelector<HTMLElement>(
      LF_EFFECTS_FOCUSABLES.join(","),
    );

    if (focusable) {
      focusable.focus();
    } else {
      refs.drawer.focus();
    }
  },

  /**
   * Applies responsive mode based on viewport width.
   * Switches between dock and slide modes based on breakpoint.
   */
  applyResponsiveMode: () => {
    const { controller } = getAdapter();
    const { compInstance } = controller.get;
    const { isResponsive } = controller.computed;
    const { handleBackdropChange } = controller.actions;

    if (!isResponsive()) {
      return;
    }

    const comp = compInstance();
    const oldVal = comp.lfDisplay;
    const newVal: LfDrawerDisplay =
      window.innerWidth >= comp.lfResponsive ? "dock" : "slide";

    if (newVal !== oldVal) {
      comp.lfDisplay = newVal;
      handleBackdropChange(oldVal, newVal);
    }
  },

  /**
   * Handles backdrop visibility changes between display modes.
   * Shows/hides backdrop when switching between dock and slide modes.
   */
  handleBackdropChange: (oldVal: LfDrawerDisplay, newVal: LfDrawerDisplay) => {
    const { controller } = getAdapter();
    const { framework } = controller.get;
    const { isOpen } = controller.computed;

    if (!isOpen()) {
      return;
    }

    const fw = framework();

    if (oldVal === "slide" && newVal === "dock") {
      fw.effects.backdrop.hide();
    } else if (oldVal === "dock" && newVal === "slide") {
      fw.effects.backdrop.show(() => {
        controller.actions.close();
      });
    }
  },

  /**
   * Stores the previously focused element.
   * Used internally for focus restoration on close.
   */
  setPreviouslyFocusedElement: (el: HTMLElement | null) => {
    setPreviouslyFocused(el);
  },
});
