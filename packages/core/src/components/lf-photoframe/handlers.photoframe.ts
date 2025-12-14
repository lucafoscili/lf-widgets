import {
  LfPhotoframeAdapter,
  LfPhotoframeAdapterHandlers,
} from "@lf-widgets/foundations";

/**
 * Prepares event handlers for the photoframe component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.computed` for derived predicates
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepPhotoframeHandlers = (
  getAdapter: () => LfPhotoframeAdapter,
): LfPhotoframeAdapterHandlers => {
  return {
    overlay: {
      /**
       * Handles click events on the overlay.
       * Clears the overlay if hideOnClick is enabled.
       */
      click: (e) => {
        const adapter = getAdapter();
        const { controller, dispatcher } = adapter;
        const { compInstance } = controller.get;

        const comp = compInstance();
        const { lfOverlay } = comp;

        if (lfOverlay?.hideOnClick) {
          comp.lfOverlay = null;
          dispatcher.emit("overlay", { originalEvent: e });
        }
      },
    },
    load: {
      /**
       * Handles the placeholder image load event.
       * Determines image orientation based on natural dimensions.
       */
      placeholder: (e) => {
        const adapter = getAdapter();
        const { controller, dispatcher, elements } = adapter;
        const { compInstance } = controller.get;
        const { placeholder } = elements.refs;

        const comp = compInstance();

        if (placeholder) {
          const isLandscape =
            placeholder.naturalWidth > placeholder.naturalHeight;
          comp.imageOrientation = isLandscape ? "horizontal" : "vertical";
        }

        dispatcher.emit("load", {
          originalEvent: e,
          isPlaceholder: true,
        });
      },
      /**
       * Handles the value image load event.
       * Sets the component to ready state.
       */
      image: (e) => {
        const adapter = getAdapter();
        const { controller, dispatcher } = adapter;
        const { compInstance } = controller.get;

        const comp = compInstance();
        comp.isReady = true;

        dispatcher.emit("load", {
          originalEvent: e,
          isPlaceholder: false,
        });
      },
    },
  };
};
