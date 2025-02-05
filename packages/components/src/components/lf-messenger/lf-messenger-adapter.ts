import {
  LfMessengerAdapter,
  LfMessengerAdapterGetters,
  LfMessengerAdapterHandlers,
  LfMessengerAdapterInitializerGetters,
  LfMessengerAdapterJsx,
  LfMessengerAdapterRefs,
  LfMessengerAdapterSetters,
} from "@lf-widgets/foundations";
import {
  prepCharacterGetters,
  prepCharacterSetters,
} from "./controller.character";
import { prepImageGetters, prepImageSetters } from "./controller.image";
import { prepUiGetters, prepUiSetters } from "./controller.ui";
import { prepCharacter } from "./elements.character";
import { prepChat } from "./elements.chat";
import { prepCustomization } from "./elements.customization";
import { prepOptions } from "./elements.options";
import { prepCharacterHandlers } from "./handlers.character";
import { prepChatHandlers } from "./handlers.chat";
import { prepCustomizationHandlers } from "./handlers.customization";
import { prepOptionsHandlers } from "./handlers.options";
import { updateDataset } from "./helpers.utils";
import { LfMessenger } from "./lf-messenger";

export const createAdapter = (
  getters: LfMessengerAdapterInitializerGetters,
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapter => {
  return {
    controller: {
      get: createGetters(getters, getAdapter),
      set: createSetters(getAdapter),
    },
    elements: {
      jsx: createJsx(getAdapter),
      refs: createRefs(),
    },
    handlers: createHandlers(getAdapter),
  };
};

//#region Controller
export const createGetters = (
  getters: LfMessengerAdapterInitializerGetters,
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterGetters => {
  return {
    ...getters,
    character: prepCharacterGetters(getAdapter),
    image: prepImageGetters(getAdapter),
    config: () => {
      const { compInstance } = getAdapter().controller.get;
      const { currentCharacter, ui } = compInstance as LfMessenger;

      return {
        currentCharacter: currentCharacter.id,
        ui,
      };
    },
    data: () => {
      const { lfDataset } = getAdapter().controller.get.compInstance;
      return lfDataset;
    },
    history: () => {
      const { history } = getAdapter().controller.get
        .compInstance as LfMessenger;
      return history;
    },
    status: {
      connection: () => {
        const { connectionStatus } = getAdapter().controller.get
          .compInstance as LfMessenger;
        return connectionStatus;
      },
      formStatus: () => {
        const { formStatusMap } = getAdapter().controller.get
          .compInstance as LfMessenger;
        return formStatusMap;
      },
      hoveredCustomizationOption: () => {
        const { hoveredCustomizationOption } = getAdapter().controller.get
          .compInstance as LfMessenger;
        return hoveredCustomizationOption;
      },
      save: {
        inProgress: () => {
          const { saveInProgress } = getAdapter().controller.get
            .compInstance as LfMessenger;
          return saveInProgress;
        },
      },
    },
    ui: prepUiGetters(getAdapter),
  };
};
export const createSetters = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterSetters => {
  return {
    character: prepCharacterSetters(getAdapter),
    image: prepImageSetters(getAdapter),
    data: () => updateDataset(getAdapter()),
    status: {
      connection: (status) => {
        const { compInstance } = getAdapter().controller.get;
        (compInstance as LfMessenger).connectionStatus = status;
      },
      editing: (type, id) => {
        const { compInstance } = getAdapter().controller.get;
        (compInstance as LfMessenger).formStatusMap[type] = id;
      },
      hoveredCustomizationOption: (node) => {
        const { compInstance } = getAdapter().controller.get;
        (compInstance as LfMessenger).hoveredCustomizationOption = node;
      },
      save: {
        inProgress: (value) => {
          const { compInstance } = getAdapter().controller.get;
          (compInstance as LfMessenger).saveInProgress = value;
        },
      },
    },
    ui: prepUiSetters(getAdapter),
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterJsx => {
  return {
    character: prepCharacter(getAdapter),
    chat: prepChat(getAdapter),
    customization: prepCustomization(getAdapter),
    options: prepOptions(getAdapter),
  };
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterHandlers => {
  return {
    character: prepCharacterHandlers(getAdapter),
    customization: prepCustomizationHandlers(getAdapter),
    chat: prepChatHandlers(getAdapter),
    options: prepOptionsHandlers(getAdapter),
  };
};
//#endregion

//#region Refs
export const createRefs = (): LfMessengerAdapterRefs => {
  return {
    character: { avatar: null, biography: null, save: null, statusIcon: null },
    chat: {
      chat: null,
      leftExpander: null,
      rightExpander: null,
      tabbar: null,
    },
    customization: {
      filters: null,
      form: {
        avatars: {
          add: null,
          cancel: null,
          confirm: null,
          description: null,
          id: null,
          imageUrl: null,
          title: null,
        },
        locations: {
          add: null,
          cancel: null,
          confirm: null,
          description: null,
          id: null,
          imageUrl: null,
          title: null,
        },
        outfits: {
          add: null,
          cancel: null,
          confirm: null,
          description: null,
          id: null,
          imageUrl: null,
          title: null,
        },
        styles: {
          add: null,
          cancel: null,
          confirm: null,
          description: null,
          id: null,
          imageUrl: null,
          title: null,
        },
        timeframes: {
          add: null,
          cancel: null,
          confirm: null,
          description: null,
          id: null,
          imageUrl: null,
          title: null,
        },
      },
      list: { edit: null, remove: null },
    },
    options: { back: null, customize: null },
  };
};
//#endregion
