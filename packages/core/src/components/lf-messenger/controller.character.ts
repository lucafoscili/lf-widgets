import {
  LfMessengerAdapter,
  LfMessengerAdapterGetters,
  LfMessengerAdapterSetters,
  LfMessengerCharacterNode,
} from "@lf-widgets/foundations";
import { defaultToCurrentCharacter, hasCharacters } from "./helpers.utils";
import { LfMessenger } from "./lf-messenger";

//#region Getters
export const prepCharacterGetters = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterGetters["character"] => {
  return {
    biography: (character?) => getBiography(getAdapter, character),
    byId: (id) => {
      const { lfDataset } = getAdapter().controller.get
        .compInstance as LfMessenger;
      return lfDataset.nodes.find((n) => n.id === id);
    },
    chat: (character?) => getChat(getAdapter, character),
    current: () => {
      const { currentCharacter } = getAdapter().controller.get
        .compInstance as LfMessenger;
      return currentCharacter;
    },
    history: (character?) => getHistory(getAdapter, character),
    list: () => {
      const { lfDataset } = getAdapter().controller.get
        .compInstance as LfMessenger;
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
): LfMessengerAdapterSetters["character"] => {
  return {
    chat: (chat, character?) => {
      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;
      const { id } = defaultToCurrentCharacter(getAdapter(), character);

      const c = compInstance as LfMessenger;

      c.chat[id] = chat;
    },
    current: (character) => {
      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;

      const c = compInstance as LfMessenger;

      c.currentCharacter = character;
    },
    history: (history, character?) => {
      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;
      const { id } = defaultToCurrentCharacter(getAdapter(), character);

      const c = compInstance as LfMessenger;

      if (c.history[id] !== history) {
        c.history[id] = history;

        if (c.lfAutosave) {
          adapter.controller.set.data();
        }
      }
    },
    next: (character?) => {
      const adapter = getAdapter();
      if (!hasCharacters(adapter)) {
        return;
      }

      const { set } = adapter.controller;

      const c = defaultToCurrentCharacter(getAdapter(), character);
      const { next } = adapter.controller.get.character;

      set.character.current(next(c));
    },
    previous: (character?) => {
      const adapter = getAdapter();
      if (!hasCharacters(adapter)) {
        return;
      }

      const { set } = adapter.controller;

      const c = defaultToCurrentCharacter(getAdapter(), character);
      const { previous } = adapter.controller.get.character;

      set.character.current(previous(c));
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
  const { stringify } = adapter.controller.get.manager.data.cell;

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
  const { chat } = adapter.controller.get.compInstance as LfMessenger;
  const { id } = defaultToCurrentCharacter(adapter, character);

  return chat[id];
};
const getHistory = (
  getAdapter: () => LfMessengerAdapter,
  character: LfMessengerCharacterNode,
) => {
  const adapter = getAdapter();
  const { history } = adapter.controller.get.compInstance as LfMessenger;
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
  const { lfDataset } = adapter.controller.get.compInstance;
  const { id } = defaultToCurrentCharacter(getAdapter(), character);

  if (!hasCharacters(adapter)) {
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
