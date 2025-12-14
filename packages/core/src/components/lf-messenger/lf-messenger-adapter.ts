import {
  LfMessengerAdapter,
  LfMessengerAdapterControllerActions,
  LfMessengerAdapterControllerComputed,
  LfMessengerAdapterControllerGetters,
  LfMessengerAdapterControllerSetters,
  LfMessengerAdapterHandlers,
  LfMessengerAdapterJsx,
  LfMessengerAdapterRefs,
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

/**
 * Creates the canonical adapter for lf-messenger.
 *
 * v4.0.0 Architecture:
 * - controller.get: Pure state reads (ALL must be functions `() => T`)
 * - controller.set: Simple single-value assignments
 * - controller.computed: Derived values, predicates (pure functions)
 * - controller.actions: Multi-step operations (toggles, batch changes)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks grouped by panel
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfMessengerAdapterControllerGetters,
  setters: LfMessengerAdapterControllerSetters,
  computed: LfMessengerAdapterControllerComputed,
  actions: LfMessengerAdapterControllerActions,
  getAdapter: () => LfMessengerAdapter,
): Omit<LfMessengerAdapter, "dispatcher"> => {
  return {
    controller: {
      get: createGetters(getters, getAdapter),
      set: createSetters(setters, getAdapter),
      computed,
      actions,
    },
    elements: {
      jsx: createJsx(getAdapter),
      refs: createRefs(),
    },
    handlers: createHandlers(getAdapter),
  };
};

//#endregion

//#region Controller
export const createGetters = (
  getters: LfMessengerAdapterControllerGetters,
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterControllerGetters => {
  return {
    ...getters,
    character: prepCharacterGetters(getAdapter),
    image: prepImageGetters(getAdapter),
    config: () => {
      const compInstance = getAdapter().controller.get.compInstance();
      const { currentCharacter, ui } = compInstance as LfMessenger;

      return {
        currentCharacter: currentCharacter?.id,
        ui,
      };
    },
    data: () => {
      const compInstance = getAdapter().controller.get.compInstance();
      return compInstance.lfDataset;
    },
    history: () => {
      const compInstance = getAdapter().controller.get.compInstance();
      return (compInstance as LfMessenger).history;
    },
    status: {
      connection: () => {
        const compInstance = getAdapter().controller.get.compInstance();
        return (compInstance as LfMessenger).connectionStatus;
      },
      formStatus: () => {
        const compInstance = getAdapter().controller.get.compInstance();
        return (compInstance as LfMessenger).formStatusMap;
      },
      hoveredCustomizationOption: () => {
        const compInstance = getAdapter().controller.get.compInstance();
        return (compInstance as LfMessenger).hoveredCustomizationOption;
      },
      save: {
        inProgress: () => {
          const compInstance = getAdapter().controller.get.compInstance();
          return (compInstance as LfMessenger).saveInProgress;
        },
      },
    },
    ui: prepUiGetters(getAdapter),
  };
};
export const createSetters = (
  setters: LfMessengerAdapterControllerSetters,
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterControllerSetters => {
  return {
    ...setters,
    character: prepCharacterSetters(getAdapter),
    image: prepImageSetters(getAdapter),
    data: () => updateDataset(getAdapter()),
    status: {
      connection: (status) => {
        const compInstance = getAdapter().controller.get.compInstance();
        (compInstance as LfMessenger).connectionStatus = status;
      },
      editing: (type, id) => {
        const compInstance = getAdapter().controller.get.compInstance();
        (compInstance as LfMessenger).formStatusMap[type] = id;
      },
      hoveredCustomizationOption: (node) => {
        const compInstance = getAdapter().controller.get.compInstance();
        (compInstance as LfMessenger).hoveredCustomizationOption = node;
      },
      save: {
        inProgress: (value) => {
          const compInstance = getAdapter().controller.get.compInstance();
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
