import {
  LF_MESSENGER_IDS,
  LF_MESSENGER_NAV,
  LfMessengerAdapter,
  LfMessengerAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { systemMessage } from "./helpers.utils";

export const prepChat = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterJsx["chat"] => {
  return {
    //#region Chat
    chat: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { character, manager } = controller.get;
      const { refs } = elements;
      const { chat, current, history } = character;
      const { assignRef, sanitizeProps } = manager;

      const system = systemMessage(adapter);

      return (
        <lf-chat
          key={current().id}
          lfLayout="bottom"
          lfSystem={system}
          lfValue={JSON.parse(history())}
          {...sanitizeProps(chat(), "LfChat")}
          onLf-chat-event={handlers.chat.chat}
          ref={assignRef(refs.chat, "chat")}
        ></lf-chat>
      );
    },
    //#endregion

    //#region Left expander
    leftExpander: () => {
      const { controller, elements, handlers } = getAdapter();
      const { cyAttributes, config, manager } = controller.get;
      const { refs } = elements;
      const { button } = handlers.chat;
      const { assignRef, theme } = manager;
      const { "--lf-icon-next": right, "--lf-icon-previous": left } =
        theme.get.current().variables;

      const { isLeftCollapsed } = config().ui.panels;
      const icon = isLeftCollapsed ? right : left;

      return (
        <lf-button
          data-cy={cyAttributes.button}
          id={LF_MESSENGER_IDS.chat.leftExpander}
          lfIcon={icon}
          lfStretchY={true}
          onLf-button-event={button}
          ref={assignRef(refs.chat, "leftExpander")}
          title="Expand/collapse this section"
        ></lf-button>
      );
    },
    //#endregion

    //#region Right expander
    rightExpander: () => {
      const { controller, elements, handlers } = getAdapter();
      const { config, cyAttributes, manager } = controller.get;
      const { refs } = elements;
      const { button } = handlers.chat;
      const { assignRef, theme } = manager;
      const { "--lf-icon-next": right, "--lf-icon-previous": left } =
        theme.get.current().variables;

      const { isRightCollapsed } = config().ui.panels;
      const icon = isRightCollapsed ? left : right;

      return (
        <lf-button
          data-cy={cyAttributes.button}
          id={LF_MESSENGER_IDS.chat.rightExpander}
          lfIcon={icon}
          lfStretchY={true}
          onLf-button-event={button}
          ref={assignRef(refs.chat, "rightExpander")}
          title="Expand/collapse this section"
        ></lf-button>
      );
    },
    //#endregion

    //#region Tabbar
    tabbar: () => {
      const { controller, elements, handlers } = getAdapter();
      const { manager } = controller.get;
      const { refs } = elements;
      const { tabbar } = handlers.chat;
      const { assignRef, theme } = manager;

      return (
        <lf-tabbar
          lfDataset={LF_MESSENGER_NAV(theme)}
          lfValue={null}
          onLf-tabbar-event={tabbar}
          ref={assignRef(refs.chat, "tabbar")}
        ></lf-tabbar>
      );
    },
    //#endregion
  };
};
