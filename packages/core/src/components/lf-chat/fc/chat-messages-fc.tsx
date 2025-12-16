import { LfChatAdapter, LfLLMChoiceMessage } from "@lf-widgets/foundations";
import { FunctionalComponent, h, VNode } from "@stencil/core";
import { parseMessageContent } from "../helpers.parsing";

//#region Props
export interface ChatMessagesFCProps {
  adapter: LfChatAdapter;
  /** Ref callback for the messages container */
  messagesContainerRef?: (el: HTMLDivElement | null) => void;
  /** Ref callback for the last message element */
  lastMessageRef?: (el: HTMLDivElement | null, index: number) => void;
}
//#endregion

/**
 * Helper to render message content (article + parsed text).
 */
const renderContent = (
  adapter: LfChatAdapter,
  message: LfLLMChoiceMessage,
): VNode[] => {
  const nodes: VNode[] = [];

  if (message.articleContent) {
    nodes.push(<lf-article lfDataset={message.articleContent}></lf-article>);
  }

  const hasText = Boolean(message.content && message.content.trim().length);
  const shouldRenderText = message.role !== "tool" || !message.articleContent;

  if (hasText && shouldRenderText) {
    nodes.push(...parseMessageContent(adapter, message.content, message.role));
  }

  return nodes;
};

/**
 * FC for the chat messages list area.
 * Per Section 5.9 "Mirroring Rule" - mirrors the messages rendering logic.
 */
export const ChatMessagesFC: FunctionalComponent<ChatMessagesFCProps> = ({
  adapter,
  messagesContainerRef,
  lastMessageRef,
}) => {
  const { controller, elements } = adapter;
  const { get } = controller;

  const blocks = get.blocks();
  const parts = get.parts();
  const { theme } = get.framework();
  const { bemClass } = theme;

  const { editableMessage } = elements.jsx.chat;
  const {
    copyContent,
    deleteMessage,
    messageAttachments,
    regenerate,
    editMessage,
    toolExecution,
  } = elements.jsx.toolbar;

  const history = get.history();
  const currentEditingId = get.currentEditingId();
  const emptyMessage =
    get.compInstance().lfConfig?.ui?.emptyMessage ||
    "Your chat history is empty!";

  const { messages, toolbar } = blocks;

  return (
    <div class={bemClass(messages._)} ref={messagesContainerRef}>
      {history?.length ? (
        history
          .filter((m) => m.role !== "tool")
          .map((m, index) => {
            const isEditing =
              Boolean(currentEditingId) && m.id === currentEditingId;
            return (
              <div
                class={bemClass(messages._, messages.container, {
                  [m.role]: true,
                  textarea: isEditing,
                })}
                key={m.id || index}
                ref={(el) => {
                  if (el && lastMessageRef && index === history.length - 1) {
                    lastMessageRef(el, index);
                  }
                }}
              >
                <div
                  class={bemClass(messages._, messages.content, {
                    [m.role]: true,
                  })}
                >
                  {isEditing ? editableMessage(m) : renderContent(adapter, m)}
                </div>
                {/* Toolbar */}
                <div class={bemClass(toolbar._)} part={parts.toolbar}>
                  {messageAttachments(m, isEditing)}
                  <div class={bemClass(toolbar._, toolbar.buttons)}>
                    {deleteMessage(m)}
                    {copyContent(m)}
                    {editMessage(m)}
                    {m.role === "user" && regenerate(m)}
                  </div>
                  {toolExecution(m)}
                </div>
              </div>
            );
          })
      ) : (
        <div class={bemClass(messages._, messages.empty)}>{emptyMessage}</div>
      )}
    </div>
  );
};
