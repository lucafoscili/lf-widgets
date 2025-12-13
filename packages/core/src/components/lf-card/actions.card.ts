import {
  LfCardAdapter,
  LfCardAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-card.
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
export const prepCardActions = (
  getAdapter: () => LfCardAdapter,
): LfCardAdapterControllerActions => ({
  /**
   * Updates shapes from the current dataset.
   * Parses dataset and extracts shape cells for rendering.
   */
  updateShapes: () => {
    const { controller } = getAdapter();
    const { compInstance, framework } = controller.get;

    const comp = compInstance();
    const { data, debug } = framework();

    try {
      comp.shapes = data.cell.shapes.getAll(comp.lfDataset);
    } catch (error) {
      debug.logs.new(comp, "Error updating shapes: " + error, "error");
    }
  },

  /**
   * Registers ripple effect on material layout element.
   */
  registerRipple: () => {
    const adapter = getAdapter();
    const { controller, elements } = adapter;
    const { framework } = controller.get;

    const materialLayout = elements.refs.layouts.material;
    if (materialLayout) {
      framework().effects.register.ripple(materialLayout);
    }
  },

  /**
   * Unregisters ripple effect from material layout element.
   */
  unregisterRipple: () => {
    const adapter = getAdapter();
    const { controller, elements } = adapter;
    const { framework } = controller.get;

    const materialLayout = elements.refs.layouts.material;
    if (materialLayout) {
      framework().effects.unregister.ripple(materialLayout);
    }
  },
});
