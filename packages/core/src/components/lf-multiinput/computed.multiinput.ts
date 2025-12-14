import {
  LfMultiInputAdapter,
  LfMultiInputAdapterControllerComputed,
} from "@lf-widgets/foundations";
import { normalizeTags, parseTags } from "./helpers.tags";

/**
 * Prepares computed predicates and derived values for the multiinput adapter.
 * All functions are pure with no side effects.
 *
 * @param getAdapter - Factory to retrieve current adapter state
 * @returns Computed functions for multiinput
 */
export const prepMultiInputComputed = (
  getAdapter: () => LfMultiInputAdapter,
): LfMultiInputAdapterControllerComputed => {
  return {
    //#region hasItems
    /**
     * Returns true if history contains any items.
     */
    hasItems: () => {
      const { controller } = getAdapter();
      return controller.get.historyNodes().length > 0;
    },
    //#endregion

    //#region isDisabled
    /**
     * Returns true if the component is in disabled state.
     */
    isDisabled: () => {
      const { controller } = getAdapter();
      const comp = controller.get.compInstance();
      return comp.lfUiState === "disabled";
    },
    //#endregion

    //#region isAtLimit
    /**
     * Returns true if history has reached its maximum limit.
     */
    isAtLimit: () => {
      const { controller } = getAdapter();
      const nodes = controller.get.historyNodes();
      const maxHistory = controller.get.maxHistory();
      return nodes.length >= maxHistory;
    },
    //#endregion

    //#region isDuplicate
    /**
     * Returns true if value already exists in history.
     * @param value - Value to check for duplicates
     */
    isDuplicate: (value: string) => {
      const { controller } = getAdapter();
      const values = controller.get.historyValues();
      return values.includes(value);
    },
    //#endregion

    //#region isValueAllowed
    /**
     * Returns true if the value is allowed based on mode and configuration.
     * @param value - Value to validate
     */
    isValueAllowed: (value: string) => {
      const { controller } = getAdapter();
      const isTagsMode = controller.get.isTagsMode();
      const allowFreeInput = controller.get.allowFreeInput();

      // Tags mode always allows any value
      if (isTagsMode) {
        return true;
      }
      // Free input allows any value
      if (allowFreeInput) {
        return true;
      }
      // Empty value is always allowed
      if (!value) {
        return true;
      }
      // Value must exist in history
      const values = controller.get.historyValues();
      return values.includes(value);
    },
    //#endregion

    //#region currentTags
    /**
     * Returns current tags from the value (tags mode).
     * Returns normalized, deduplicated tag array.
     */
    currentTags: () => {
      const { controller } = getAdapter();
      const value = controller.get.value();
      return normalizeTags(parseTags(value));
    },
    //#endregion
  };
};
