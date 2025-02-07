import {
  LfMessengerAdapter,
  LfMessengerAdapterGetters,
  LfMessengerAdapterSetters,
  LfMessengerBaseChildNode,
  LfMessengerImageTypes,
  LfMessengerPanelsValue,
  LfMessengerUnionChildIds,
} from "@lf-widgets/foundations";
import { LfMessenger } from "./lf-messenger";

//#region Getters
export const prepUiGetters = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterGetters["ui"] => {
  return () => {
    const { ui } = getAdapter().controller.get.compInstance as LfMessenger;
    return ui;
  };
};
//#endregion

//#region Setters
export const prepUiSetters = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterSetters["ui"] => {
  return {
    customization: (value) => {
      const { compInstance } = getAdapter().controller.get;

      const c = compInstance as LfMessenger;

      c.ui.customizationView = value;
      c.refresh();
    },
    filters: (filters) => {
      const { compInstance } = getAdapter().controller.get;

      const c = compInstance as LfMessenger;

      c.ui.filters = filters;
      c.refresh();
    },
    options: (value, type) => {
      const { compInstance } = getAdapter().controller.get;

      const c = compInstance as LfMessenger;

      c.ui.options[type] = value;
      c.refresh();
    },
    panel: (panel, value?) => setPanel(getAdapter, panel, value),
    setFormState: async (value, type, node = null) =>
      setFormState(getAdapter, value, type, node),
  };
};
//#endregion

//#region Helpers
const setFormState = async <T extends LfMessengerUnionChildIds>(
  getAdapter: () => LfMessengerAdapter,
  value: boolean,
  type: LfMessengerImageTypes,
  node?: LfMessengerBaseChildNode<T>,
) => {
  const adapter = getAdapter();
  const { controller } = adapter;
  const { compInstance, image } = controller.get;
  const { formStatusMap, ui } = compInstance as LfMessenger;

  ui.form[type] = value;

  if (!value) {
    formStatusMap[type] = null;
  } else {
    formStatusMap[type] = node?.id ?? image.newId(type);
  }

  await compInstance.refresh();
};
const setPanel = (
  getAdapter: () => LfMessengerAdapter,
  panel: LfMessengerPanelsValue,
  value?: boolean,
) => {
  const adapter = getAdapter();
  const { compInstance } = adapter.controller.get;
  const { panels } = (compInstance as LfMessenger).ui;

  switch (panel) {
    case "left":
      panels.isLeftCollapsed = value ?? !panels.isLeftCollapsed;
      break;
    case "right":
      panels.isRightCollapsed = value ?? !panels.isRightCollapsed;
      break;
  }

  compInstance.refresh();
  return value;
};
//#endregion
