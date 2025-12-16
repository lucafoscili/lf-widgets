import { LfChatAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { ChatMessageItemFC } from "./chat-message-item-fc";

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
 * FC for the chat messages list area.
 * Per Section 5.9 "Mirroring Rule" - mirrors the messages rendering logic.
 * Composes ChatMessageItemFC for each message.
 */
export const ChatMessagesFC: FunctionalComponent<ChatMessagesFCProps> = ({
  adapter,
  messagesContainerRef,
  lastMessageRef,
}) => {
  const { controller } = adapter;
  const { get } = controller;

  const blocks = get.blocks();
  const { theme } = get.framework();
  const { bemClass } = theme;

  const history = get.history();
  const currentEditingId = get.currentEditingId();
  const emptyMessage =
    get.compInstance().lfConfig?.ui?.emptyMessage ||
    "Your chat history is empty!";

  const { messages } = blocks;

  // Filter out tool messages for display
  const displayMessages = history?.filter((m) => m.role !== "tool") || [];

  return (
    <div class={bemClass(messages._)} ref={messagesContainerRef}>
      {displayMessages.length ? (
        displayMessages.map((m, index) => {
          const isEditing =
            Boolean(currentEditingId) && m.id === currentEditingId;
          const isLast = index === displayMessages.length - 1;

          return (
            <ChatMessageItemFC
              adapter={adapter}
              message={m}
              index={index}
              isEditing={isEditing}
              isLast={isLast}
              lastMessageRef={lastMessageRef}
            />
          );
        })
      ) : (
        <div class={bemClass(messages._, messages.empty)}>{emptyMessage}</div>
      )}
    </div>
  );
};
