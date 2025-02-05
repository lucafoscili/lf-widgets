import {
  LfArticleNode,
  LfComponent,
  LfComponentName,
  LfComponentTag,
  LfEventName,
  LfEventPayloadName,
  LfEventType,
} from "@lf-widgets/foundations";
import { DOC_IDS, DOC_STYLES } from "./constants";
import { PARAGRAPH_FACTORY } from "./doc.paragraph";

/**
 * Factory object for creating documentation sections for components.
 * @namespace SECTION_FACTORY
 * @property {Function} events - Creates an Events section documenting component events
 * @property {Function} methods - Creates a Methods section documenting component methods
 * @property {Function} overview - Creates an Overview section with component description
 * @property {Function} props - Creates a Properties section documenting component props
 * @property {Function} styling - Creates a Styling section documenting component styles
 * @property {Function} usage - Creates a Usage section with examples
 *
 * @example
 * const eventsSection = SECTION_FACTORY.events('myComponent', 'MyPayload', eventsList, 'onChange');
 * const methodsSection = SECTION_FACTORY.methods(componentTag);
 * const overviewSection = SECTION_FACTORY.overview('myComponent', 'is a reusable UI element');
 * const propsSection = SECTION_FACTORY.props(componentTag);
 * const stylingSection = SECTION_FACTORY.styling(componentTag);
 * const usageSection = SECTION_FACTORY.usage('myComponent', { tag: 'my-component', data: '{"prop": "value"}' });
 */
export const SECTION_FACTORY = {
  events: <C extends LfComponentName, T extends LfComponent<C>>(
    _componentName: C,
    payloadType: LfEventPayloadName<C>,
    eventList: { type: LfEventType<T>; description: string }[],
    eventName: LfEventName<C>,
  ): LfArticleNode => {
    const nodes: LfArticleNode[] = [];
    eventList.forEach((ev) => {
      nodes.push({
        children: [
          {
            id: DOC_IDS.contentListItem,
            tagName: "strong",
            value: ev.type,
          },
          {
            id: DOC_IDS.contentListItem,
            value: `: ${ev.description}.`,
          },
        ],
        id: DOC_IDS.contentList,
        tagName: "li",
        value: "",
      });
    });
    return {
      children: [
        {
          children: [
            {
              id: DOC_IDS.content,
              value:
                "This event is emitted during various lifecycle stages of the component. It carries a payload of type ",
            },
            {
              id: DOC_IDS.content,
              value: payloadType,
            },
            {
              id: DOC_IDS.content,
              value:
                ", which includes information about the component, its state and the event type.",
            },
            {
              children: [
                {
                  children: nodes,
                  id: DOC_IDS.content,
                  value: "",
                },
              ],
              id: DOC_IDS.contentWrapper,
              value: "",
            },
          ],
          cssStyle: DOC_STYLES.monoPrimaryH3,
          id: DOC_IDS.paragraph,
          tagName: "strong",
          value: eventName,
        },
      ],
      id: DOC_IDS.section,
      value: "Events",
    };
  },
  methods: (tag: LfComponentTag<LfComponentName>): LfArticleNode => {
    const nodes = PARAGRAPH_FACTORY.methods(tag);

    return {
      children: nodes,
      id: DOC_IDS.section,
      value: "Methods",
    };
  },
  overview: <C extends LfComponentName>(
    componentName: C,
    description: string,
  ): LfArticleNode => {
    return {
      children: [
        {
          children: [
            {
              children: [
                {
                  id: DOC_IDS.content,
                  value: "The ",
                },
                {
                  id: DOC_IDS.content,
                  tagName: "strong",
                  value: componentName,
                },
                {
                  id: DOC_IDS.content,
                  value: ` component ${description}.`,
                },
              ],
              id: DOC_IDS.contentWrapper,
            },
          ],
          id: DOC_IDS.paragraph,
        },
      ],
      id: DOC_IDS.section,
      value: "Overview",
    };
  },
  props: (tag: LfComponentTag<LfComponentName>): LfArticleNode => {
    const nodes = PARAGRAPH_FACTORY.props(tag);

    return {
      children: nodes,
      id: DOC_IDS.section,
      value: "Properties",
    };
  },
  styling: (tag: LfComponentTag<LfComponentName>): LfArticleNode => {
    const nodes = PARAGRAPH_FACTORY.styles(tag);

    return {
      children: nodes,
      id: DOC_IDS.section,
      value: "Styling",
    };
  },
  usage: <C extends LfComponentName>(
    componentName: C,
    code: { data?: string; tag?: LfComponentTag<C> },
  ): LfArticleNode => {
    const codeShape = (type: "json" | "markup"): LfArticleNode => {
      return {
        cells: {
          lfCode: {
            shape: "code",
            lfLanguage: type,
            value:
              type === "markup" ? `<${code.tag}></${code.tag}>` : code.data,
          },
        },
        id: DOC_IDS.content,
        value: "",
      };
    };

    const codeNodes: LfArticleNode[] = [];
    if (code?.tag) {
      codeNodes.push(codeShape("markup"));
    }
    if (code?.data) {
      codeNodes.push(codeShape("json"));
    }

    return {
      children: [
        {
          children: [
            {
              children: [
                {
                  id: DOC_IDS.content,
                  value: "To use the ",
                },
                {
                  id: DOC_IDS.content,
                  tagName: "strong",
                  value: componentName,
                },
                {
                  id: DOC_IDS.content,
                  value:
                    " component, include it in your HTML and provide the required props either as attributes (for primitive-typed props) or via JavaScript (for object-typed props).",
                },
              ],
              id: DOC_IDS.contentWrapper,
              value: "",
            },
            code && {
              children: codeNodes,
              id: DOC_IDS.contentWrapper,
              value: "",
            },
          ],
          id: DOC_IDS.paragraph,
          value: "Basic Usage",
        },
      ],
      id: DOC_IDS.section,
      value: "Usage",
    };
  },
};
