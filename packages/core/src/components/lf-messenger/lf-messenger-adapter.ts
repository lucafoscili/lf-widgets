import {
  CY_ATTRIBUTES,
  IMAGE_TYPE_IDS,
  LF_ATTRIBUTES,
  LF_MESSENGER_BLOCKS,
  LF_MESSENGER_CLEAN_UI,
  LF_MESSENGER_IDS,
  LF_MESSENGER_PARTS,
  LfChatStatus,
  LfFrameworkInterface,
  LfMessengerAdapter,
  LfMessengerAdapterControllerGetters,
  LfMessengerAdapterControllerSetters,
  LfMessengerAdapterHandlers,
  LfMessengerAdapterJsx,
  LfMessengerAdapterRefs,
  LfMessengerBaseChildNode,
  LfMessengerCharacterNode,
  LfMessengerChat,
  LfMessengerChildIds,
  LfMessengerCovers,
  LfMessengerEditingStatus,
  LfMessengerHistory,
  LfMessengerImageTypes,
  LfMessengerInterface,
  LfMessengerUI,
  LfMessengerUnionChildIds,
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

//#region State Interface
/**
 * State container interface for the messenger adapter.
 * All state lives in the adapter closure.
 */
export interface LfMessengerAdapterState {
  chat: LfMessengerChat;
  connectionStatus: LfChatStatus;
  covers: LfMessengerCovers;
  currentCharacter: LfMessengerCharacterNode;
  hoveredCustomizationOption: LfMessengerBaseChildNode<
    LfMessengerChildIds<LfMessengerUnionChildIds>
  >;
  history: LfMessengerHistory;
  formStatusMap: LfMessengerEditingStatus<LfMessengerImageTypes>;
  saveInProgress: boolean;
  ui: LfMessengerUI;
}
//#endregion

/**
 * Creates the canonical adapter for lf-messenger.
 *
 * v4.0.0 "Adapter as Core" Architecture:
 * - ALL state lives in adapter closure (except debugInfo)
 * - WC becomes thin shell with _renderTick trigger
 * - controller.get: Pure state reads from closure
 * - controller.set: Simple single-value assignments with onStateChange()
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
  getComp: () => LfMessengerInterface,
  getFramework: () => LfFrameworkInterface,
  onStateChange: () => void,
): LfMessengerAdapter => {
  //#region Closure State
  const state: LfMessengerAdapterState = {
    chat: {},
    connectionStatus: "offline",
    covers: {},
    currentCharacter: undefined,
    hoveredCustomizationOption: null,
    history: {},
    formStatusMap: IMAGE_TYPE_IDS.reduce((acc, type) => {
      acc[type] = null;
      return acc;
    }, {} as LfMessengerEditingStatus<LfMessengerImageTypes>),
    saveInProgress: false,
    ui: LF_MESSENGER_CLEAN_UI(),
  };
  //#endregion

  //#region Adapter Reference
  let adapter: LfMessengerAdapter;
  const getAdapter = () => adapter;
  //#endregion

  //#region Base Getters
  const baseGetters: LfMessengerAdapterControllerGetters = {
    blocks: () => LF_MESSENGER_BLOCKS.messenger,
    compInstance: getComp,
    cyAttributes: () => CY_ATTRIBUTES,
    framework: getFramework,
    ids: () => LF_MESSENGER_IDS.messenger,
    lfAttributes: () => LF_ATTRIBUTES,
    parts: () => LF_MESSENGER_PARTS.messenger,
    // These are populated in createGetters
    character: null,
    config: null,
    data: null,
    history: null,
    image: null,
    status: null,
    ui: null,
  };
  //#endregion

  //#region Base Setters
  const baseSetters: LfMessengerAdapterControllerSetters = {
    character: null,
    data: null,
    image: null,
    status: null,
    ui: null,
  };
  //#endregion

  //#region Build Adapter
  adapter = {
    controller: {
      get: createGetters(baseGetters, getAdapter, state),
      set: createSetters(baseSetters, getAdapter, state, onStateChange),
      computed: null, // Set by component after adapter creation
      actions: null, // Set by component after adapter creation
    },
    dispatcher: {
      emit: () => {}, // Placeholder - will be set by component
    },
    elements: {
      jsx: createJsx(getAdapter),
      refs: createRefs(),
    },
    handlers: createHandlers(getAdapter),
  };
  //#endregion

  return adapter;
};

//#endregion

//#region Controller
export const createGetters = (
  getters: LfMessengerAdapterControllerGetters,
  getAdapter: () => LfMessengerAdapter,
  state: LfMessengerAdapterState,
): LfMessengerAdapterControllerGetters => {
  const result = {
    ...getters,
    character: prepCharacterGetters(getAdapter, state),
    image: prepImageGetters(getAdapter, state),
    config: () => {
      return {
        currentCharacter: state.currentCharacter?.id,
        ui: state.ui,
      };
    },
    data: () => {
      const compInstance = getAdapter().controller.get.compInstance();
      return compInstance.lfDataset;
    },
    history: () => state.history,
    status: {
      connection: () => state.connectionStatus,
      formStatus: () => state.formStatusMap,
      hoveredCustomizationOption: () => state.hoveredCustomizationOption,
      save: {
        inProgress: () => state.saveInProgress,
      },
    },
    ui: prepUiGetters(getAdapter, state),
  };
  // Expose state for direct access in component
  (result as any).__state = state;
  return result;
};
export const createSetters = (
  setters: LfMessengerAdapterControllerSetters,
  getAdapter: () => LfMessengerAdapter,
  state: LfMessengerAdapterState,
  onStateChange: () => void,
): LfMessengerAdapterControllerSetters => {
  return {
    ...setters,
    character: prepCharacterSetters(getAdapter, state, onStateChange),
    image: prepImageSetters(getAdapter, state, onStateChange),
    data: () => updateDataset(getAdapter()),
    status: {
      connection: (status) => {
        state.connectionStatus = status;
        onStateChange();
      },
      editing: (type, id) => {
        state.formStatusMap = { ...state.formStatusMap, [type]: id };
        onStateChange();
      },
      hoveredCustomizationOption: (node) => {
        state.hoveredCustomizationOption = node;
        onStateChange();
      },
      save: {
        inProgress: (value) => {
          state.saveInProgress = value;
          onStateChange();
        },
      },
    },
    ui: prepUiSetters(getAdapter, state, onStateChange),
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
