import { LfChatAdapter, LfLLMChoiceMessage } from "@lf-widgets/foundations";
import { FunctionalComponent, h, VNode } from "@stencil/core";
import { parseMessageContent } from "../helpers.parsing";

//#region Props
export interface ChatMessageContentFCProps {
  adapter: LfChatAdapter;
  message: LfLLMChoiceMessage;
}
//#endregion

/**
 * FC for rendering message content (article + parsed text).
 * Per Section 5.9 "Mirroring Rule" - mirrors content rendering logic.
 */
export const ChatMessageContentFC: FunctionalComponent<
  ChatMessageContentFCProps
> = ({ adapter, message }) => {
  const nodes: VNode[] = [];

  // Render article content if present
  if (message.articleContent) {
    nodes.push(<lf-article lfDataset={message.articleContent}></lf-article>);
  }

  // Render text content
  const hasText = Boolean(message.content && message.content.trim().length);
  const shouldRenderText = message.role !== "tool" || !message.articleContent;

  if (hasText && shouldRenderText) {
    nodes.push(...parseMessageContent(adapter, message.content, message.role));
  }

  return nodes;
};
