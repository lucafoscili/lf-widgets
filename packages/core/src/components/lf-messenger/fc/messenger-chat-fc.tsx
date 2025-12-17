import { LfMessengerAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

//#region Props
export interface MessengerChatFCProps {
  adapter: LfMessengerAdapter;
}
//#endregion

/**
 * FC for the messenger chat panel.
 * Displays the chat interface with navigation tabbar and left/right expanders.
 */
export const MessengerChatFC: FunctionalComponent<MessengerChatFCProps> = ({
  adapter,
}) => {
  const { controller, elements } = adapter;
  const { get } = controller;

  const blocks = get.blocks();
  const framework = get.framework();
  const { bemClass } = framework.theme;

  const { chat: chatBlock } = blocks;
  const { chat, leftExpander, rightExpander, tabbar } = elements.jsx.chat;

  return (
    <div class={bemClass(chatBlock._)}>
      <div
        class={bemClass(chatBlock._, chatBlock.expander, {
          left: true,
        })}
      >
        {leftExpander()}
      </div>
      <div class={bemClass(chatBlock._, chatBlock.navigation)}>{tabbar()}</div>
      <div class={bemClass(chatBlock._, chatBlock.chat)}>{chat()}</div>
      <div
        class={bemClass(chatBlock._, chatBlock.expander, {
          right: true,
        })}
      >
        {rightExpander()}
      </div>
    </div>
  );
};
