import {
  LfMessengerAdapter,
  LfMessengerAdapterControllerGetters,
  LfMessengerAdapterControllerSetters,
  LfMessengerCharacterNode,
} from "@lf-widgets/foundations";
import { defaultToCurrentCharacter } from "./helpers.utils";
import { LfMessenger } from "./lf-messenger";

//#region Getters
export const prepCharacterGetters = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterControllerGetters["character"] => {
  return {
    biography: (character?) => getBiography(getAdapter, character),
    byId: (id) => {
      const compInstance = getAdapter().controller.get.compInstance();
      const { lfDataset } = compInstance as LfMessenger;
      return lfDataset.nodes.find((n) => n.id === id);
    },
    chat: (character?) => getChat(getAdapter, character),
    current: () => {
      const compInstance = getAdapter().controller.get.compInstance();
      return (compInstance as LfMessenger).currentCharacter;
    },
    history: (character?) => getHistory(getAdapter, character),
    list: () => {
      const compInstance = getAdapter().controller.get.compInstance();
      const { lfDataset } = compInstance as LfMessenger;
      return lfDataset.nodes || [];
    },
    name: (character?) => getName(getAdapter, character),
    next: (character?) => fetch(getAdapter, character, true),
    previous: (character?) => fetch(getAdapter, character),
  };
};
//#endregion

//#region Setters
export const prepCharacterSetters = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterControllerSetters["character"] => {
  return {
    chat: (chat, character?) => {
      const adapter = getAdapter();
      const compInstance = adapter.controller.get.compInstance();
      const { id } = defaultToCurrentCharacter(getAdapter(), character);

      const c = compInstance as LfMessenger;

      c.chat[id] = chat;
    },
    current: (character) => {
      const adapter = getAdapter();
      const compInstance = adapter.controller.get.compInstance();

      const c = compInstance as LfMessenger;

      c.currentCharacter = character;
    },
    history: (history, character?) => {
      const adapter = getAdapter();
      const compInstance = adapter.controller.get.compInstance();
      const { id } = defaultToCurrentCharacter(getAdapter(), character);

      const c = compInstance as LfMessenger;

      if (c.history[id] !== history) {
        c.history[id] = history;

        if (c.lfAutosave) {
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
  character: LfMessengerCharacterNode,
) => {
  const adapter = getAdapter();
  const framework = adapter.controller.get.framework();
  const { stringify } = framework.data.cell;

  const c = defaultToCurrentCharacter(getAdapter(), character);

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
  character: LfMessengerCharacterNode,
) => {
  const adapter = getAdapter();
  const compInstance = adapter.controller.get.compInstance();
  const { chat } = compInstance as LfMessenger;
  const { id } = defaultToCurrentCharacter(adapter, character);

  return chat[id];
};
const getHistory = (
  getAdapter: () => LfMessengerAdapter,
  character: LfMessengerCharacterNode,
) => {
  const adapter = getAdapter();
  const compInstance = adapter.controller.get.compInstance();
  const { history } = compInstance as LfMessenger;
  const { id } = defaultToCurrentCharacter(getAdapter(), character);

  return history[id];
};
const getName = (
  getAdapter: () => LfMessengerAdapter,
  character: LfMessengerCharacterNode,
) => {
  const { description, id, value } = defaultToCurrentCharacter(
    getAdapter(),
    character,
  );

  return value || id || description || "?";
};
const fetch = (
  getAdapter: () => LfMessengerAdapter,
  character: LfMessengerCharacterNode,
  next?: boolean,
) => {
  const adapter = getAdapter();
  const compInstance = adapter.controller.get.compInstance();
  const { lfDataset } = compInstance;
  const { id } = defaultToCurrentCharacter(getAdapter(), character);

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
