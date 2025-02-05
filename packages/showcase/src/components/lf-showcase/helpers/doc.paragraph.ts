import {
  LfArticleNode,
  LfComponentName,
  LfComponentTag,
} from "@lf-widgets/foundations";
import { LF_DOC } from "../assets/doc";
import {
  LfShowcaseDocMethod,
  LfShowcaseDocProp,
  LfShowcaseDocStyle,
} from "../lf-showcase-declarations";
import { DOC_IDS, DOC_NODES, DOC_STYLES } from "./constants";

/**
 * Factory object for creating different types of paragraph nodes in documentation.
 * @namespace PARAGRAPH_FACTORY
 *
 * @property {Function} asBulletListEntry - Creates a bullet-point list entry with title and nested children.
 * @property {Function} asListEntry - Creates a list entry with title, description and optional method arguments.
 * @property {Function} asSimpleListEntry - Creates a basic list entry with just title and description.
 * @property {Function} methods - Generates documentation nodes for component methods.
 * @property {Function} props - Generates documentation nodes for component properties.
 * @property {Function} styles - Generates documentation nodes for component styles and CSS variables.
 *
 * Each method returns an {@link LfArticleNode} or array of nodes that follow a consistent structure for
 * building documentation sections with proper styling and hierarchy.
 *
 * The factory helps maintain consistent formatting across documentation while providing
 * flexible options for different types of content (lists, method signatures, property details, etc).
 */
export const PARAGRAPH_FACTORY = {
  api: (key: string, description: string, code: string): LfArticleNode => ({
    children: [
      {
        id: DOC_IDS.content,
        value: description,
      },
      {
        cells: {
          lfCode: {
            lfLanguage: "typescript",
            shape: "code",
            value: code,
          },
        },
        cssStyle: DOC_STYLES.monoPrimaryH3,
        id: DOC_IDS.contentListItem,
        value: "",
      },
      {
        cssStyle: DOC_STYLES.separator,
        id: DOC_IDS.content,
        value: "",
      },
    ],
    id: DOC_IDS.paragraph,
    cssStyle: DOC_STYLES.monoPrimaryH3Large,
    value: key,
  }),
  asBulletListEntry: (
    title: string,
    children: { title: string; description: string }[],
  ): LfArticleNode => {
    const nodes: LfArticleNode[] = [];
    children.forEach((child) => {
      nodes.push({
        id: DOC_IDS.content,
        value: "- ",
      });
      nodes.push({
        cssStyle: DOC_STYLES.monoPrimaryContent,
        id: DOC_IDS.content,
        tagName: "strong",
        value: child.title,
      });
      nodes.push({
        id: DOC_IDS.content,
        value: child.description,
      });
    });
    return {
      children: nodes,
      cssStyle: DOC_STYLES.monoPrimaryH3Large,
      id: DOC_IDS.paragraph,
      value: title,
    };
  },
  asListEntry: (
    title: string,
    description: string,
    args?: { name: string; type: string; description: string }[],
  ): LfArticleNode => {
    const signature = (): LfArticleNode => {
      let value = "(";
      args?.forEach((a, index) => {
        value += `${a.name}:${a.type}${index < args.length - 1 ? "," : ""}`;
      });
      value += ")";
      return {
        id: DOC_IDS.content,
        tagName: "strong",
        value,
      };
    };
    const params = () => {
      const content: LfArticleNode[] = [];
      args?.forEach((a) => {
        content.push(DOC_NODES.lineBreak);
        content.push({
          id: DOC_IDS.content,
          value: `- `,
        });
        content.push({
          id: DOC_IDS.content,
          cssStyle: DOC_STYLES.monoPrimaryContent,
          tagName: "strong",
          value: `${a.name} (${a.type})`,
        });
        content.push({
          id: DOC_IDS.content,
          value: `: ${a.description}`,
        });
      });
      return content;
    };
    const hasArgs = !!args?.length;
    return {
      children: [
        {
          id: DOC_IDS.content,
          value: description,
        },
        DOC_NODES.lineBreak,
        ...((hasArgs && params()) || []),
      ],
      id: DOC_IDS.paragraph,
      cssStyle: DOC_STYLES.monoPrimaryH3Large,
      value: `${title} ${hasArgs ? signature().value : "()"}`,
    };
  },
  asSimpleListEntry: (title: string, description: string): LfArticleNode => ({
    children: [
      {
        id: DOC_IDS.content,
        cssStyle: DOC_STYLES.monoPrimaryContent,
        tagName: "strong",
        value: title.toString(),
      },
      {
        id: DOC_IDS.content,
        value: description.toString(),
      },
    ],
    id: DOC_IDS.paragraph,
    value: "",
  }),
  methods: (tag: LfComponentTag<LfComponentName>) => {
    const nodes: LfArticleNode[] = [];

    const docMethods = LF_DOC[tag].methods as LfShowcaseDocMethod[];
    docMethods.forEach((method) => {
      const node: LfArticleNode = {
        children: [],
        cssStyle: DOC_STYLES.monoPrimaryH3,
        id: DOC_IDS.paragraph,
        value: `${method.name} ${method.signature}`,
      };
      const propDescription: LfArticleNode = {
        children: [
          {
            id: DOC_IDS.content,
            value: method.docs,
          },
        ],
        id: DOC_IDS.contentWrapper,
        value: "",
      };
      node.children.push(propDescription);
      nodes.push(node);
    });

    return nodes;
  },
  props: (tag: LfComponentTag<LfComponentName>) => {
    const nodes: LfArticleNode[] = [];

    const docProps = LF_DOC[tag].props as LfShowcaseDocProp[];
    docProps.forEach((prop) => {
      const node: LfArticleNode = {
        children: [],
        cssStyle: DOC_STYLES.monoPrimaryH3,
        id: DOC_IDS.paragraph,
        value: prop.name,
      };
      const propTitle: LfArticleNode = {
        children: [
          {
            id: DOC_IDS.content,
            value: "Type:",
          },
          {
            id: DOC_IDS.content,
            tagName: "strong",
            value: prop.type,
          },
        ],
        id: DOC_IDS.contentWrapper,
        value: "",
      };
      const propDescription: LfArticleNode = {
        children: [
          {
            id: DOC_IDS.content,
            value: prop.docs,
          },
        ],
        id: DOC_IDS.contentWrapper,
        value: "",
      };
      node.children.push(propTitle);
      node.children.push(propDescription);
      nodes.push(node);
    });

    return nodes;
  },
  styles: (tag: LfComponentTag<LfComponentName>) => {
    const nodes: LfArticleNode[] = [];

    const docStyles = LF_DOC[tag].styles as LfShowcaseDocStyle[];
    const lfStyle: LfArticleNode = {
      children: [
        {
          id: DOC_IDS.contentWrapper,
          value:
            "The component uses Shadow DOM for encapsulation, ensuring that its styles do not leak into the global scope. However, custom styles can be applied using the ",
        },
        {
          id: DOC_IDS.contentWrapper,
          tagName: "strong",
          value: "lfStyle",
        },
        {
          id: DOC_IDS.contentWrapper,
          value: " property.",
        },
        {
          cells: {
            lfCode: {
              shape: "code",
              lfLanguage: "markup",
              value: `<${tag} lf-style="#lf-component { max-height: 20vh; }"></${tag}>`,
            },
          },
          id: DOC_IDS.contentWrapper,
          value: "",
        },
      ],
      id: DOC_IDS.paragraph,
      tagName: "strong",
      value: "lfStyle",
    };
    const listNode: LfArticleNode = {
      children: [],
      id: DOC_IDS.contentWrapper,
      value:
        "Additionally, the following CSS variables can be used to customize the appearance of the component:",
    };
    const wrapperNode: LfArticleNode = {
      children: [],
      id: DOC_IDS.paragraph,
      value: "CSS Variables",
    };
    docStyles?.forEach((style) => {
      const styleNode: LfArticleNode = {
        children: [
          {
            cssStyle: DOC_STYLES.monoPrimaryContent,
            id: DOC_IDS.contentListItem,
            tagName: "strong",
            value: style.name,
          },
          {
            id: DOC_IDS.contentListItem,
            value: `: ${style.docs}`,
          },
        ],
        id: DOC_IDS.contentList,
        tagName: "li",
        value: "",
      };
      listNode.children.push(styleNode);
    });
    nodes.push(lfStyle);
    if (listNode.children.length > 0) {
      nodes.push(wrapperNode);
      wrapperNode.children.push(listNode);
    }

    return nodes;
  },
};
