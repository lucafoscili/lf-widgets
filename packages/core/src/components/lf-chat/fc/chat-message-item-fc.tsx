import { LfChatAdapter, LfLLMChoiceMessage } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { ChatMessageContentFC } from "./chat-message-content-fc";
import { ChatToolbarFC } from "./chat-toolbar-fc";

//#region Props
export interface ChatMessageItemFCProps {
  adapter: LfChatAdapter;
  message: LfLLMChoiceMessage;
  index: number;
  isEditing: boolean;
  isLast: boolean;
  /** Ref callback for last message element */
  lastMessageRef?: (el: HTMLDivElement | null, index: number) => void;
}
//#endregion

/**
 * FC for a single message item (content + toolbar).
 * Per Section 5.9 "Mirroring Rule" - composes ChatMessageContentFC + ChatToolbarFC.
 */
export const ChatMessageItemFC: FunctionalComponent<ChatMessageItemFCProps> = ({
  adapter,
  message,
  index,
  isEditing,
  isLast,
  lastMessageRef,
}) => {
  const { controller, elements } = adapter;
  const { get } = controller;

  const blocks = get.blocks();
  const { theme } = get.framework();
  const { bemClass } = theme;

  const { editableMessage } = elements.jsx.chat;
  const { messages } = blocks;

  return (
    <div
      class={bemClass(messages._, messages.container, {
        [message.role]: true,
        textarea: isEditing,
      })}
      key={message.id || index}
      ref={(el) => {
        if (el && isLast && lastMessageRef) {
          lastMessageRef(el, index);
        }
      }}
    >
      <div
        class={bemClass(messages._, messages.content, {
          [message.role]: true,
        })}
      >
        {isEditing ? (
          editableMessage(message)
        ) : (
          <ChatMessageContentFC adapter={adapter} message={message} />
        )}
      </div>
      <ChatToolbarFC
        adapter={adapter}
        message={message}
        isEditing={isEditing}
      />
    </div>
  );
};
