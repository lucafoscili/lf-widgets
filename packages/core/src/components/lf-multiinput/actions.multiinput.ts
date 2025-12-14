import {
  LfDataNode,
  LfMultiInputAdapter,
  LfMultiInputAdapterControllerActions,
} from "@lf-widgets/foundations";
import { normalizeHistoryValues } from "./helpers.history";
import { normalizeTags, stringifyTags } from "./helpers.tags";

/**
 * Prepares action functions for the multiinput adapter.
 * Actions are multi-step operations that may have side effects.
 *
 * @param getAdapter - Factory to retrieve current adapter state
 * @returns Actions for multiinput operations
 */
export const prepMultiInputActions = (
  getAdapter: () => LfMultiInputAdapter,
): LfMultiInputAdapterControllerActions => {
  //#region Helper functions
  const createNodeId = (value: string, index: number): string => {
    const { controller } = getAdapter();
    const comp = controller.get.compInstance();
    const prefix = comp.rootElement?.id || "multiinput";
    const randomness = Math.random().toString(36).slice(2, 8);
    return `${prefix}-${index}-${randomness}-${value.length}`;
  };

  const createNodesFromValues = (values: string[]): LfDataNode[] => {
    const { controller } = getAdapter();
    const dataset = controller.get.lfDataset();
    const existing =
      dataset?.nodes?.reduce(
        (map, node) => map.set(String(node?.value ?? ""), node),
        new Map<string, LfDataNode>(),
      ) || new Map<string, LfDataNode>();

    return values.map((value, index) => {
      const candidate = existing.get(value);
      return {
        ...candidate,
        id: candidate?.id || createNodeId(value, index),
        value,
      };
    });
  };
  //#endregion

  return {
    //#region addItem
    /**
     * Adds an item to history with validation and duplicate prevention.
     * @param value - Value to add to history
     */
    addItem: async (value: string) => {
      const { controller } = getAdapter();
      const { computed } = controller;

      // Skip if disabled or empty value
      if (computed.isDisabled() || !value) {
        return;
      }

      const current = controller.get.historyValues();
      // Remove duplicate and prepend new value
      const nextValues = [value, ...current.filter((v) => v !== value)];
      const maxHistory = controller.get.maxHistory();
      const normalized = normalizeHistoryValues(nextValues, maxHistory);
      const nodes = createNodesFromValues(normalized);

      await controller.set.history(nodes);
    },
    //#endregion

    //#region removeItem
    /**
     * Removes an item from history by index.
     * @param index - Index of item to remove
     */
    removeItem: async (index: number) => {
      const { controller } = getAdapter();
      const { computed } = controller;

      // Skip if disabled
      if (computed.isDisabled()) {
        return;
      }

      const nodes = controller.get.historyNodes();
      if (index < 0 || index >= nodes.length) {
        return;
      }

      const updated = [...nodes.slice(0, index), ...nodes.slice(index + 1)];
      await controller.set.history(updated);
    },
    //#endregion

    //#region clearAll
    /**
     * Clears all history items and resets value in tags mode.
     */
    clearAll: async () => {
      const { controller } = getAdapter();
      const { computed } = controller;

      // Skip if disabled
      if (computed.isDisabled()) {
        return;
      }

      await controller.set.history([]);

      // In tags mode, also clear the value
      if (controller.get.isTagsMode()) {
        await controller.set.value("");
      }
    },
    //#endregion

    //#region commitValue
    /**
     * Commits the current value: validates, adds to history, and clears input.
     * @param value - Value to commit
     */
    commitValue: async (value: string) => {
      const { controller } = getAdapter();
      const { computed, actions } = controller;

      // Skip if disabled
      if (computed.isDisabled()) {
        return;
      }

      const normalized = (value ?? "").trim();
      if (!normalized) {
        return;
      }

      // Validate value
      if (!computed.isValueAllowed(normalized)) {
        return;
      }

      // Update value
      await controller.set.value(normalized);

      // Add to history (addItem handles duplicates)
      await actions.addItem(normalized);
    },
    //#endregion

    //#region toggleTag
    /**
     * Toggles a tag in the selection (tags mode only).
     * @param tag - Tag to toggle
     */
    toggleTag: async (tag: string) => {
      const { controller } = getAdapter();
      const { computed } = controller;

      // Skip if disabled or not tags mode
      if (computed.isDisabled() || !controller.get.isTagsMode()) {
        return;
      }

      const trimmedTag = (tag ?? "").trim();
      if (!trimmedTag) {
        return;
      }

      const current = computed.currentTags();

      let tags: string[];
      if (current.includes(trimmedTag)) {
        // Remove tag
        tags = current.filter((t) => t !== trimmedTag);
      } else {
        // Add tag
        tags = [...current, trimmedTag];
      }

      tags = normalizeTags(tags);

      // Filter if free input not allowed
      if (!controller.get.allowFreeInput()) {
        const allowedValues = new Set(controller.get.historyValues());
        tags = tags.filter((t) => allowedValues.has(t));
      }

      const stringValue = stringifyTags(tags);
      await controller.set.value(stringValue);

      // Ensure new tags are added to history
      if (controller.get.allowFreeInput() && tags.length) {
        const currentHistory = controller.get.historyValues();
        const currentSet = new Set(currentHistory);
        const newTags = tags.filter((t) => !currentSet.has(t));

        if (newTags.length) {
          const maxHistory = controller.get.maxHistory();
          const union = normalizeHistoryValues(
            [...newTags, ...currentHistory],
            maxHistory,
          );
          const nodes = createNodesFromValues(union);
          await controller.set.history(nodes);
        }
      }
    },
    //#endregion
  };
};
