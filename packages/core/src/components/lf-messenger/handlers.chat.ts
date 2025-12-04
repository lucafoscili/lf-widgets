import {
  LF_MESSENGER_IDS,
  LfMessengerAdapter,
  LfMessengerAdapterHandlers,
  LfTabbarEventPayload,
} from "@lf-widgets/foundations";

export const prepChatHandlers = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterHandlers["chat"] => {
  return {
    //#region Button
    button: async (e) => {
      const { comp, eventType, id } = e.detail;

      const { get, set } = getAdapter().controller;
      const { "--lf-icon-previous": left, "--lf-icon-next": right } =
        get.manager.theme.get.current().variables;

      switch (eventType) {
        case "click":
          switch (id) {
            case LF_MESSENGER_IDS.chat.leftExpander:
              const newLeft = set.ui.panel("left");
              comp.lfIcon = newLeft ? right : left;
              break;
            case LF_MESSENGER_IDS.chat.rightExpander:
              const newRight = set.ui.panel("right");
              comp.lfIcon = newRight ? left : right;
              break;
          }
      }
    },
    //#endregion

    //#region Chat
    chat: async (e) => {
      const { comp, eventType, history, status } = e.detail;
      const { lfConfig } = comp;

      const { set } = getAdapter().controller;

      switch (eventType) {
        case "config":
          // Save the updated lfConfig to the character's chat cell
          set.character.chat({ lfConfig });
          break;
        case "polling":
          set.status.connection(status);
          break;
        case "update":
          set.character.history(history);
          break;
      }
    },
    //#endregion

    //#region Tabbar
    tabbar: async (e: CustomEvent<LfTabbarEventPayload>) => {
      const { eventType, node } = e.detail;

      const { current, next, previous } = getAdapter().controller.set.character;

      switch (eventType) {
        case "click":
          switch (node.id) {
            case "next":
              next();
              break;
            case "previous":
              previous();
              break;
            default:
              current(null);
              break;
          }
      }
    },
  };
  //#endregion
};
