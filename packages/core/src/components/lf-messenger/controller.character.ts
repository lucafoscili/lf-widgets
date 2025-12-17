import {
  LfMessengerAdapter,
  LfMessengerAdapterControllerGetters,
  LfMessengerAdapterControllerSetters,
  LfMessengerCharacterNode,
} from "@lf-widgets/foundations";
import { defaultToCurrentCharacter } from "./helpers.utils";
import { LfMessengerAdapterState } from "./lf-messenger-adapter";

//#region Getters
export const prepCharacterGetters = (
  getAdapter: () => LfMessengerAdapter,
  state: LfMessengerAdapterState,
): LfMessengerAdapterControllerGetters["character"] => {
  return {
    biography: (character?) => getBiography(getAdapter, state, character),
    byId: (id) => {
      const compInstance = getAdapter().controller.get.compInstance();
      const { lfDataset } = compInstance;
      return lfDataset.nodes.find((n) => n.id === id);
    },
    chat: (character?) => getChat(getAdapter, state, character),
    current: () => state.currentCharacter,
    history: (character?) => getHistory(getAdapter, state, character),
    list: () => {
      const compInstance = getAdapter().controller.get.compInstance();
      const { lfDataset } = compInstance;
      return lfDataset.nodes || [];
    },
    name: (character?) => getName(getAdapter, state, character),
    next: (character?) => fetch(getAdapter, state, character, true),
    previous: (character?) => fetch(getAdapter, state, character),
  };
};
//#endregion

//#region Setters
export const prepCharacterSetters = (
  getAdapter: () => LfMessengerAdapter,
  state: LfMessengerAdapterState,
  onStateChange: () => void,
): LfMessengerAdapterControllerSetters["character"] => {
  return {
    chat: (chat, character?) => {
      const adapter = getAdapter();
      const { id } = defaultToCurrentCharacter(adapter, state, character);

      state.chat = { ...state.chat, [id]: chat };
      onStateChange();
    },
    current: (character) => {
      state.currentCharacter = character;
      onStateChange();
    },
    history: (history, character?) => {
      const adapter = getAdapter();
      const compInstance = adapter.controller.get.compInstance();
      const { id } = defaultToCurrentCharacter(adapter, state, character);

      if (state.history[id] !== history) {
        state.history = { ...state.history, [id]: history };
        onStateChange();

        if (compInstance.lfAutosave) {
          adapter.controller.set.data();
        }
      }
    },
  };
};
//#endregion

//#region Helpers
const getBiography = (
  getAdapter: () => LfMessengerAdapter,
  state: LfMessengerAdapterState,
  character: LfMessengerCharacterNode,
) => {
  const adapter = getAdapter();
  const framework = adapter.controller.get.framework();
  const { stringify } = framework.data.cell;

  const c = defaultToCurrentCharacter(adapter, state, character);

  try {
    const bio = c.children.find((n) => n.id === "biography").value;
    return bio
      ? stringify(bio)
      : "You have no informations about this character...";
  } catch (error) {
    return "You have no informations about this character...";
  }
};
const getChat = (
  getAdapter: () => LfMessengerAdapter,
  state: LfMessengerAdapterState,
  character: LfMessengerCharacterNode,
) => {
  const adapter = getAdapter();
  const { id } = defaultToCurrentCharacter(adapter, state, character);

  return state.chat[id];
};
const getHistory = (
  getAdapter: () => LfMessengerAdapter,
  state: LfMessengerAdapterState,
  character: LfMessengerCharacterNode,
) => {
  const adapter = getAdapter();
  const { id } = defaultToCurrentCharacter(adapter, state, character);

  return state.history[id];
};
const getName = (
  getAdapter: () => LfMessengerAdapter,
  state: LfMessengerAdapterState,
  character: LfMessengerCharacterNode,
) => {
  const { description, id, value } = defaultToCurrentCharacter(
    getAdapter(),
    state,
    character,
  );

  return value || id || description || "?";
};
const fetch = (
  getAdapter: () => LfMessengerAdapter,
  state: LfMessengerAdapterState,
  character: LfMessengerCharacterNode,
  next?: boolean,
) => {
  const adapter = getAdapter();
  const compInstance = adapter.controller.get.compInstance();
  const { lfDataset } = compInstance;
  const { id } = defaultToCurrentCharacter(adapter, state, character);

  if (!lfDataset?.nodes?.length) {
    return null;
  }

  const characters = lfDataset.nodes;
  const currentIdx = characters.findIndex((c) => c.id === id);

  switch (next) {
    case true:
      const nIdx = (currentIdx + 1) % characters.length;
      return characters[nIdx];
    default:
      const pIdx = (currentIdx + characters.length - 1) % characters.length;
      return characters[pIdx];
  }
};
//#endregion
