import {
  LfMessengerAdapter,
  LfMessengerAdapterControllerComputed,
  LfMessengerImageTypes,
  LfMessengerOptionTypes,
  LfMessengerPanelsValue,
} from "@lf-widgets/foundations";

/**
 * Prepares the computed domain for the messenger adapter.
 * Derived values and predicates computed from state.
 * Pure functions with no side effects.
 *
 * @param getAdapter - Factory to retrieve the current adapter instance
 * @returns Computed domain implementation
 */
export const prepMessengerComputed = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterControllerComputed => ({
  character: {
    hasCharacter: () => {
      const { current } = getAdapter().controller.get.character;
      return current() !== null;
    },
    isCurrentCharacter: (id: string) => {
      const { current } = getAdapter().controller.get.character;
      const currentChar = current();
      return currentChar?.id === id;
    },
  },
  image: {
    hasImages: (type: LfMessengerImageTypes) => {
      const { byType } = getAdapter().controller.get.image;
      return byType(type).length > 0;
    },
  },
  ui: {
    isPanelCollapsed: (panel: LfMessengerPanelsValue) => {
      const ui = getAdapter().controller.get.ui();
      return panel === "left"
        ? ui.panels.isLeftCollapsed
        : ui.panels.isRightCollapsed;
    },
    isCustomizing: () => {
      const ui = getAdapter().controller.get.ui();
      return ui.customizationView;
    },
    isFilterActive: (filter: LfMessengerImageTypes) => {
      const ui = getAdapter().controller.get.ui();
      return ui.filters[filter];
    },
    isOptionEnabled: (option: LfMessengerOptionTypes) => {
      const ui = getAdapter().controller.get.ui();
      return ui.options[option];
    },
  },
});
