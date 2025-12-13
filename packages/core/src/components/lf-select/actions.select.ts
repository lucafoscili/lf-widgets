import {
  LfSelectAdapter,
  LfSelectAdapterControllerActions,
} from "@lf-widgets/foundations";
import { hasNodeWithId } from "./utils.select";

/**
 * Factory to create action functions for lf-select.
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
export const prepSelectActions = (
  getAdapter: () => LfSelectAdapter,
): LfSelectAdapterControllerActions => ({
  /**
   * Sets the selected value by id.
   * Updates both internal state and child components (list, textfield).
   * Emits a 'change' event on value change.
   */
  setValue: async (id: string) => {
    const adapter = getAdapter();
    const { controller, dispatcher, elements } = adapter;
    const { compInstance, selectedNode } = controller.get;
    const { refs } = elements;

    const comp = compInstance();
    const textfield = refs.textfield || null;
    const list = refs.list || null;

    const maybeSetValue = async (val: string | null) => {
      comp.value = val;
      const selected = selectedNode();
      if (list) {
        await list.selectNodeById(selected?.id || null);
      }
      if (textfield) {
        await textfield.setValue(String(selected?.value || ""));
      }

      dispatcher.emit("change", {
        node: selected,
        value: val,
      });
    };

    if (id && comp.lfDataset && !hasNodeWithId(comp.lfDataset, id)) {
      await maybeSetValue(null);
      return;
    }
    await maybeSetValue(id);
  },

  /**
   * Navigates to the next or previous option.
   * Used for keyboard navigation with arrow keys.
   */
  navigate: async (direction: "next" | "prev") => {
    const adapter = getAdapter();
    const { controller, dispatcher } = adapter;
    const { compInstance } = controller.get;
    const comp = compInstance();

    if (!comp.lfNavigation) {
      return;
    }

    const dataset = comp.lfDataset;
    if (!dataset?.nodes?.length) {
      return;
    }

    const currentIndex = await comp.getSelectedIndex();
    let newIndex = currentIndex;

    if (direction === "next") {
      if (currentIndex === -1) {
        newIndex = 0;
      } else {
        newIndex = (currentIndex + 1) % dataset.nodes.length;
      }
    } else {
      if (currentIndex === -1) {
        newIndex = dataset.nodes.length - 1;
      } else {
        newIndex =
          currentIndex === 0 ? dataset.nodes.length - 1 : currentIndex - 1;
      }
    }

    if (newIndex !== currentIndex) {
      const newNode = dataset.nodes[newIndex];
      await controller.actions.setValue(newNode.id);
      dispatcher.emit("lf-event", {
        node: newNode,
      });
    }
  },
});
