import {
  LfMessengerAdapter,
  LfMessengerAdapterControllerActions,
  LfMessengerCharacterNode,
  LfMessengerImageTypes,
  LfMessengerOptionTypes,
  LfMessengerPanelsValue,
} from "@lf-widgets/foundations";
import { hasCharacters } from "./helpers.utils";

/**
 * Prepares the actions domain for the messenger adapter.
 * Multi-step operations that may batch changes or toggle state.
 * May have side effects.
 *
 * @param getAdapter - Factory to retrieve the current adapter instance
 * @returns Actions domain implementation
 */
export const prepMessengerActions = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterControllerActions => ({
  character: {
    next: (character?: LfMessengerCharacterNode) => {
      const adapter = getAdapter();
      if (!hasCharacters(adapter)) {
        return;
      }

      const { get, set } = adapter.controller;
      const nextChar = get.character.next(character);
      set.character.current(nextChar);
    },
    previous: (character?: LfMessengerCharacterNode) => {
      const adapter = getAdapter();
      if (!hasCharacters(adapter)) {
        return;
      }

      const { get, set } = adapter.controller;
      const prevChar = get.character.previous(character);
      set.character.current(prevChar);
    },
    select: (character: LfMessengerCharacterNode) => {
      const { set } = getAdapter().controller;
      set.character.current(character);
    },
  },
  ui: {
    togglePanel: (panel: LfMessengerPanelsValue) => {
      const { set } = getAdapter().controller;
      set.ui.panel(panel);
    },
    toggleCustomization: () => {
      const { get, set } = getAdapter().controller;
      const ui = get.ui();
      set.ui.customization(!ui.customizationView);
    },
    toggleFilter: (filter: LfMessengerImageTypes) => {
      const { get, set } = getAdapter().controller;
      const ui = get.ui();
      const newFilters = { ...ui.filters, [filter]: !ui.filters[filter] };
      set.ui.filters(newFilters);
    },
    toggleOption: (option: LfMessengerOptionTypes) => {
      const { get, set } = getAdapter().controller;
      const ui = get.ui();
      set.ui.options(!ui.options[option], option);
    },
  },
});
