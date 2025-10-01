import { LfChatAdapter, LfChatAdapterJsx } from "@lf-widgets/foundations";
import { h, JSX, VNode } from "@stencil/core";

export const prepContentElements = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterJsx["content"] => {
  return {
    //#region Blockquote
    blockquote: (children) => {
      const { controller } = getAdapter();
      const { blocks, manager } = controller.get;
      const { theme } = manager;
      const { bemClass } = theme;
      const { messages } = blocks;

      return (
        <blockquote class={bemClass(messages._, messages.blockquote)}>
          {children}
        </blockquote>
      );
    },
    //#endregion

    //#region Bold
    bold: (children) => {
      const { controller } = getAdapter();
      const { blocks, manager } = controller.get;
      const { theme } = manager;
      const { bemClass } = theme;
      const { messages } = blocks;

      return (
        <strong class={bemClass(messages._, messages.bold)}>{children}</strong>
      );
    },
    //#endregion

    //#region Bullet List
    bulletList: (children) => {
      const { controller } = getAdapter();
      const { blocks, manager } = controller.get;
      const { theme } = manager;
      const { bemClass } = theme;
      const { messages } = blocks;

      return <ul class={bemClass(messages._, messages.list)}>{children}</ul>;
    },
    //#endregion

    //#region Code Fence
    codeFence: (language, code) => {
      const { controller } = getAdapter();
      const { blocks, manager } = controller.get;
      const { theme } = manager;
      const { bemClass } = theme;
      const { messages } = blocks;

      return (
        <lf-code
          class={bemClass(messages._, messages.code)}
          lfFadeIn={false}
          lfLanguage={language}
          lfValue={code}
        ></lf-code>
      );
    },
    //#endregion

    //#region Heading
    heading: (level, children) => {
      const { controller } = getAdapter();
      const { blocks, manager } = controller.get;
      const { theme } = manager;
      const { bemClass } = theme;
      const { messages } = blocks;

      const className = bemClass(messages._, messages.heading);
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

      return <HeadingTag class={className}>{children}</HeadingTag>;
    },
    //#endregion

    //#region Horizontal Rule
    horizontalRule: (): VNode => {
      const { controller } = getAdapter();
      const { blocks, manager } = controller.get;
      const { theme } = manager;
      const { bemClass } = theme;
      const { messages } = blocks;

      return <hr class={bemClass(messages._, messages.hr)} />;
    },
    //#endregion

    //#region Inline Code
    inlineCode: (content) => {
      const { controller } = getAdapter();
      const { blocks, manager } = controller.get;
      const { theme } = manager;
      const { bemClass } = theme;
      const { messages } = blocks;

      return (
        <code class={bemClass(messages._, messages.inlineCode)}>{content}</code>
      );
    },
    //#endregion

    //#region Italic
    italic: (children) => {
      const { controller } = getAdapter();
      const { blocks, manager } = controller.get;
      const { theme } = manager;
      const { bemClass } = theme;
      const { messages } = blocks;

      return <em class={bemClass(messages._, messages.italic)}>{children}</em>;
    },
    //#endregion

    //#region Line Break
    lineBreak: () => {
      const { controller } = getAdapter();
      const { blocks, manager } = controller.get;
      const { theme } = manager;
      const { bemClass } = theme;
      const { messages } = blocks;

      return <br class={bemClass(messages._, messages.lineBreak)} />;
    },
    //#endregion

    //#region Link
    link: (href, children) => {
      const { controller } = getAdapter();
      const { blocks, manager } = controller.get;
      const { theme } = manager;
      const { bemClass } = theme;
      const { messages } = blocks;

      return (
        <a
          class={bemClass(messages._, messages.link)}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },
    //#endregion

    //#region List Item
    listItem: (children) => {
      const { controller } = getAdapter();
      const { blocks, manager } = controller.get;
      const { theme } = manager;
      const { bemClass } = theme;
      const { messages } = blocks;

      return (
        <li class={bemClass(messages._, messages.listItem)}>{children}</li>
      );
    },
    //#endregion

    //#region Ordered List
    orderedList: (children) => {
      const { controller } = getAdapter();
      const { blocks, manager } = controller.get;
      const { theme } = manager;
      const { bemClass } = theme;
      const { messages } = blocks;

      return <ol class={bemClass(messages._, messages.list)}>{children}</ol>;
    },
    //#endregion
  };
};
