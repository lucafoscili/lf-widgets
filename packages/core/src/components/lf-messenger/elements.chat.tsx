import {
  LF_MESSENGER_IDS,
  LF_MESSENGER_NAV,
  LfMessengerAdapter,
  LfMessengerAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { ButtonFC } from "../lf-button/fc/button-fc";
import { systemMessage } from "./helpers.utils";

export const prepChat = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterJsx["chat"] => {
  return {
    //#region Chat
    chat: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { character, framework } = controller.get;
      const { refs } = elements;
      const { chat, current, history } = character;
      const fw = framework();
      const { assignRef, sanitizeProps } = fw;

      const system = systemMessage(adapter);

      return (
        <lf-chat
          key={current().id}
          lfConfig={{
            ...(chat() || {}),
            llm: {
              ...(chat()?.lfConfig?.llm || {}),
              systemPrompt: system,
            },
            ui: {
              ...(chat()?.lfConfig?.ui || {}),
              layout: "bottom",
            },
          }}
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
      const { cyAttributes, config, framework } = controller.get;
      const { refs } = elements;
      const { button } = handlers.chat;
      const fw = framework();
      const { assignRef, theme } = fw;
      const { "--lf-icon-next": right, "--lf-icon-previous": left } =
        theme.get.current().variables;

      const { isLeftCollapsed } = config().ui.panels;
      const icon = isLeftCollapsed ? right : left;

      return (
        <ButtonFC
          framework={fw}
          id={LF_MESSENGER_IDS.messenger.chat.leftExpander}
          icon={icon}
          onClick={(e) =>
            button(e, LF_MESSENGER_IDS.messenger.chat.leftExpander)
          }
          buttonRef={assignRef(refs.chat, "leftExpander")}
          style={{ height: "100%" }}
        />
      );
    },
    //#endregion

    //#region Right expander
    rightExpander: () => {
      const { controller, elements, handlers } = getAdapter();
      const { config, cyAttributes, framework } = controller.get;
      const { refs } = elements;
      const { button } = handlers.chat;
      const fw = framework();
      const { assignRef, theme } = fw;
      const { "--lf-icon-next": right, "--lf-icon-previous": left } =
        theme.get.current().variables;

      const { isRightCollapsed } = config().ui.panels;
      const icon = isRightCollapsed ? left : right;

      return (
        <ButtonFC
          framework={fw}
          id={LF_MESSENGER_IDS.messenger.chat.rightExpander}
          icon={icon}
          onClick={(e) =>
            button(e, LF_MESSENGER_IDS.messenger.chat.rightExpander)
          }
          buttonRef={assignRef(refs.chat, "rightExpander")}
          style={{ height: "100%" }}
        />
      );
    },
    //#endregion

    //#region Tabbar
    tabbar: () => {
      const { controller, elements, handlers } = getAdapter();
      const { framework } = controller.get;
      const { refs } = elements;
      const { tabbar } = handlers.chat;
      const fw = framework();
      const { assignRef, theme } = fw;

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
