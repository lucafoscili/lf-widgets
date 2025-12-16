import { LfChatAdapter, LfLLMChoiceMessage } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

//#region Props
export interface ChatToolbarFCProps {
  adapter: LfChatAdapter;
  message: LfLLMChoiceMessage;
  isEditing?: boolean;
}
//#endregion

/**
 * FC for a single message toolbar.
 * Per Section 5.9 "Mirroring Rule" - mirrors elements.toolbar rendering.
 */
export const ChatToolbarFC: FunctionalComponent<ChatToolbarFCProps> = ({
  adapter,
  message,
  isEditing = false,
}) => {
  const { controller, elements } = adapter;
  const { get } = controller;

  const blocks = get.blocks();
  const parts = get.parts();
  const { theme } = get.framework();
  const { bemClass } = theme;

  const {
    copyContent,
    deleteMessage,
    editMessage,
    messageAttachments,
    regenerate,
    toolExecution,
  } = elements.jsx.toolbar;

  const { toolbar } = blocks;

  return (
    <div class={bemClass(toolbar._)} part={parts.toolbar}>
      {messageAttachments(message, isEditing)}
      <div class={bemClass(toolbar._, toolbar.buttons)}>
        {deleteMessage(message)}
        {copyContent(message)}
        {editMessage(message)}
        {message.role === "user" && regenerate(message)}
      </div>
      {toolExecution(message)}
    </div>
  );
};
