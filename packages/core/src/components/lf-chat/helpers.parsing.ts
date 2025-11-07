import { LfChatAdapter, LfLLMRole } from "@lf-widgets/foundations";
import { VNode } from "@stencil/core";

//#region Parse message content
/**
 * Parses markdown content from a chat message and converts it to VNode elements.
 *
 * Supports the following markdown features:
 * - **Bold** and __bold__ text
 * - *Italic* and _italic_ text
 * - `Inline code`
 * - Fenced code blocks (```lang ... ```)
 * - Headings (# through ######)
 * - Blockquotes (>)
 * - Unordered lists (-, *, +)
 * - Ordered lists (1., 2., 3.)
 * - Links ([text](url))
 * - Horizontal rules (---, ___, ***)
 * - Line breaks
 *
 * @param adapter - The chat adapter instance containing formatting elements
 * @param content - The markdown content string to parse
 * @param role - The role of the message sender (affects text rendering via messageBlock)
 * @returns An array of VNodes representing the parsed content
 *
 * @example
 * ```typescript
 * const vnodes = parseMessageContent(adapter, "**Hello** world!", "user");
 * ```
 */
export const parseMessageContent = (
  adapter: LfChatAdapter,
  content: any,
  role: LfLLMRole,
): VNode[] => {
  const { elements, controller } = adapter;
  const { manager } = controller.get;
  const { syntax } = manager;
  const { messageBlock } = elements.jsx.chat;
  const contentElements = elements.jsx.content;

  if (Array.isArray(content)) {
    const nodes: VNode[] = [];
    for (const part of content) {
      if (part?.type === "text") {
        nodes.push(...parseMessageContent(adapter, part.text, role));
      } else if (part?.type === "image_url") {
        if (contentElements.image) {
          nodes.push(
            contentElements.image(part.image_url.url, part.image_url.detail),
          );
        }
      }
    }
    return nodes;
  }

  const tokens = syntax.parseMarkdown(content || "");

  const vnodes: VNode[] = [];

  const renderInlineTokens = (
    inlineTokens: ReturnType<typeof syntax.parseMarkdown>,
  ): (VNode | string)[] => {
    const out: (VNode | string)[] = [];

    for (let i = 0; i < inlineTokens.length; i++) {
      const t = inlineTokens[i];

      if (t.type === "text") {
        out.push(t.content);
        continue;
      }

      if (t.type === "code_inline") {
        out.push(contentElements.inlineCode(t.content));
        continue;
      }

      if (t.type === "strong_open") {
        const inner: typeof inlineTokens = [];
        i++;
        while (
          i < inlineTokens.length &&
          inlineTokens[i].type !== "strong_close"
        ) {
          inner.push(inlineTokens[i]);
          i++;
        }
        out.push(contentElements.bold(renderInlineTokens(inner)));
        continue;
      }

      if (t.type === "em_open") {
        const inner: typeof inlineTokens = [];
        i++;
        while (i < inlineTokens.length && inlineTokens[i].type !== "em_close") {
          inner.push(inlineTokens[i]);
          i++;
        }
        out.push(contentElements.italic(renderInlineTokens(inner)));
        continue;
      }

      if (t.type === "link_open") {
        const href = t.attrGet("href") || "#";
        const inner: typeof inlineTokens = [];
        i++;
        while (
          i < inlineTokens.length &&
          inlineTokens[i].type !== "link_close"
        ) {
          inner.push(inlineTokens[i]);
          i++;
        }
        out.push(contentElements.link(href, renderInlineTokens(inner)));
        continue;
      }

      if (t.type === "softbreak" || t.type === "hardbreak") {
        out.push(contentElements.lineBreak());
        continue;
      }

      if (t.content) {
        out.push(messageBlock(t.content, role));
      }
    }

    return out.flat();
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === "fence") {
      const language = (token.info || "").trim() || "text";
      const codePart = token.content.trim();
      vnodes.push(contentElements.codeFence(language, codePart));
      continue;
    }

    if (token.type === "heading_open") {
      const level = parseInt(token.tag?.replace("h", "") || "1", 10);
      i++;
      if (i < tokens.length && tokens[i].type === "inline") {
        const headingContent = renderInlineTokens(tokens[i].children || []);
        vnodes.push(contentElements.heading(level, headingContent));
      }
      i++;
      continue;
    }

    if (token.type === "blockquote_open") {
      const blockContent: (VNode | string)[] = [];
      i++;
      while (i < tokens.length && tokens[i].type !== "blockquote_close") {
        if (tokens[i].type === "inline") {
          blockContent.push(...renderInlineTokens(tokens[i].children || []));
        }
        i++;
      }
      vnodes.push(contentElements.blockquote(blockContent));
      continue;
    }

    if (token.type === "bullet_list_open") {
      const listItems: VNode[] = [];
      i++;
      while (i < tokens.length && tokens[i].type !== "bullet_list_close") {
        if (tokens[i].type === "list_item_open") {
          const itemContent: (VNode | string)[] = [];
          i++;
          while (i < tokens.length && tokens[i].type !== "list_item_close") {
            if (tokens[i].type === "inline") {
              itemContent.push(...renderInlineTokens(tokens[i].children || []));
            }
            i++;
          }
          listItems.push(contentElements.listItem(itemContent));
        }
        i++;
      }
      vnodes.push(contentElements.bulletList(listItems));
      continue;
    }

    if (token.type === "ordered_list_open") {
      const listItems: VNode[] = [];
      i++;
      while (i < tokens.length && tokens[i].type !== "ordered_list_close") {
        if (tokens[i].type === "list_item_open") {
          const itemContent: (VNode | string)[] = [];
          i++;
          while (i < tokens.length && tokens[i].type !== "list_item_close") {
            if (tokens[i].type === "inline") {
              itemContent.push(...renderInlineTokens(tokens[i].children || []));
            }
            i++;
          }
          listItems.push(contentElements.listItem(itemContent));
        }
        i++;
      }
      vnodes.push(contentElements.orderedList(listItems));
      continue;
    }

    if (token.type === "hr") {
      vnodes.push(contentElements.horizontalRule());
      continue;
    }

    if (token.type === "paragraph_open") {
      i++;
      if (i < tokens.length && tokens[i].type === "inline") {
        const paragraphContent = renderInlineTokens(tokens[i].children || []);
        vnodes.push(contentElements.paragraph(paragraphContent));
      }
      i++;
      continue;
    }

    if (token.type === "inline") {
      const inlineContent = renderInlineTokens(token.children || []);
      vnodes.push(contentElements.inlineContainer(inlineContent));
      continue;
    }

    if (token.children) {
      vnodes.push(
        contentElements.inlineContainer(renderInlineTokens(token.children)),
      );
    } else if (token.content) {
      vnodes.push(messageBlock(token.content, role));
    }
  }

  return vnodes;
};
//#endregion
