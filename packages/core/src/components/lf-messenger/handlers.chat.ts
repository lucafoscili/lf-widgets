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
    button: async (e: MouseEvent, id: string) => {
      const { controller, elements } = getAdapter();
      const { get, set } = controller;
      const { refs } = elements;
      const { "--lf-icon-previous": left, "--lf-icon-next": right } = get
        .framework()
        .theme.get.current().variables;

      switch (id) {
        case LF_MESSENGER_IDS.messenger.chat.leftExpander:
          const newLeft = set.ui.panel("left");
          const leftBtn = refs.chat.leftExpander;
          if (leftBtn) {
            leftBtn.dataset.icon = newLeft ? right : left;
          }
          break;
        case LF_MESSENGER_IDS.messenger.chat.rightExpander:
          const newRight = set.ui.panel("right");
          const rightBtn = refs.chat.rightExpander;
          if (rightBtn) {
            rightBtn.dataset.icon = newRight ? left : right;
          }
          break;
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

      const { actions, set } = getAdapter().controller;

      switch (eventType) {
        case "click":
          switch (node.id) {
            case "next":
              actions.character.next();
              break;
            case "previous":
              actions.character.previous();
              break;
            default:
              set.character.current(null);
              break;
          }
      }
    },
  };
  //#endregion
};
