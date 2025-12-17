import {
  LfMessengerAdapter,
  LfMessengerAdapterControllerGetters,
  LfMessengerAdapterControllerSetters,
  LfMessengerBaseChildNode,
  LfMessengerImageTypes,
  LfMessengerPanelsValue,
  LfMessengerUnionChildIds,
} from "@lf-widgets/foundations";
import { LfMessengerAdapterState } from "./lf-messenger-adapter";

//#region Getters
export const prepUiGetters = (
  _getAdapter: () => LfMessengerAdapter,
  state: LfMessengerAdapterState,
): LfMessengerAdapterControllerGetters["ui"] => {
  return () => state.ui;
};
//#endregion

//#region Setters
export const prepUiSetters = (
  getAdapter: () => LfMessengerAdapter,
  state: LfMessengerAdapterState,
  onStateChange: () => void,
): LfMessengerAdapterControllerSetters["ui"] => {
  return {
    customization: (value) => {
      state.ui = { ...state.ui, customizationView: value };
      onStateChange();
    },
    filters: (filters) => {
      state.ui = { ...state.ui, filters };
      onStateChange();
    },
    options: (value, type) => {
      state.ui = {
        ...state.ui,
        options: { ...state.ui.options, [type]: value },
      };
      onStateChange();
    },
    panel: (panel, value?) => setPanel(state, onStateChange, panel, value),
    setFormState: async (value, type, node = null) =>
      setFormState(getAdapter, state, onStateChange, value, type, node),
  };
};
//#endregion

//#region Helpers
const setFormState = async <T extends LfMessengerUnionChildIds>(
  getAdapter: () => LfMessengerAdapter,
  state: LfMessengerAdapterState,
  onStateChange: () => void,
  value: boolean,
  type: LfMessengerImageTypes,
  node?: LfMessengerBaseChildNode<T>,
) => {
  const adapter = getAdapter();
  const { image } = adapter.controller.get;

  const newForm = { ...state.ui.form, [type]: value };
  state.ui = { ...state.ui, form: newForm };

  if (!value) {
    state.formStatusMap = { ...state.formStatusMap, [type]: null };
  } else {
    state.formStatusMap = {
      ...state.formStatusMap,
      [type]: node?.id ?? image.newId(type),
    };
  }

  onStateChange();
};
const setPanel = (
  state: LfMessengerAdapterState,
  onStateChange: () => void,
  panel: LfMessengerPanelsValue,
  value?: boolean,
) => {
  const newPanels = { ...state.ui.panels };

  switch (panel) {
    case "left":
      newPanels.isLeftCollapsed = value ?? !newPanels.isLeftCollapsed;
      break;
    case "right":
      newPanels.isRightCollapsed = value ?? !newPanels.isRightCollapsed;
      break;
  }

  state.ui = { ...state.ui, panels: newPanels };
  onStateChange();

  return panel === "left"
    ? newPanels.isLeftCollapsed
    : newPanels.isRightCollapsed;
};
//#endregion
