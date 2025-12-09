import { LfArticleNode, LfDataInterface } from "@lf-widgets/foundations";

//#region accordion
export const accordion: LfDataInterface["article"]["shapes"]["accordion"] = (
  id,
  props,
) => {
  return {
    id,
    value: "",
    cells: {
      lfAccordion: {
        shape: "accordion",
        value: "",
        ...props,
      },
    },
  };
};
//#endregion

//#region accordionCodeBlock
export const accordionCodeBlock: LfDataInterface["article"]["shapes"]["accordionCodeBlock"] =
  (id, node, props) => {
    return {
      id,
      value: "",
      cells: {
        lfAccordion: {
          shape: "accordion",
          value: "",
          lfDataset: {
            nodes: [node],
          },
          ...props,
        },
      },
    };
  };
//#endregion

//#region createArticle
export const createArticle: LfDataInterface["article"]["core"]["create"] = (
  nodes = [],
  partial?,
) => ({
  ...partial,
  nodes,
});
//#endregion

//#region Section
export const section: LfDataInterface["article"]["core"]["section"] = (
  options,
) => {
  const { id, title, children = [], cssStyle } = options;

  const resolvedChildren: LfArticleNode[] = title
    ? [
        {
          id: `${id}-title`,
          tagName: "h3",
          value: title,
        },
        ...children,
      ]
    : children;

  return {
    id,
    value: "",
    cssStyle,
    children: resolvedChildren,
  };
};
//#endregion

//#region Paragraph
export const paragraph: LfDataInterface["article"]["core"]["paragraph"] = (
  options,
) => {
  const { id, text, children = [], cssStyle } = options;

  return {
    id,
    tagName: "p",
    value: text ?? "",
    cssStyle,
    children,
  };
};
//#endregion

//#region Separator
export const separator: LfDataInterface["article"]["core"]["separator"] = (
  options,
) => ({
  id: options.id,
  tagName: "hr",
  value: "",
  cssStyle: options.cssStyle,
});
//#endregion

//#region Progress row
export const progressRow: LfDataInterface["article"]["shapes"]["progressRow"] =
  (id, props) => {
    return {
      id,
      value: "",
      cells: {
        lfProgressbar: {
          shape: "progressbar",
          value: props.lfValue ?? 0,
          ...props,
        },
      },
    };
  };
//#endregion

//#region Button row
export const buttonRow: LfDataInterface["article"]["shapes"]["buttonRow"] = (
  id,
  props,
) => {
  return {
    id,
    value: "",
    cells: {
      lfButton: {
        shape: "button",
        value: "",
        ...props,
      },
    },
  };
};
//#endregion

//#region Code block
export const codeBlock: LfDataInterface["article"]["shapes"]["codeBlock"] = (
  id,
  props,
) => {
  return {
    id,
    value: "",
    cells: {
      lfCode: {
        shape: "code",
        value: props.lfValue ?? "",
        ...props,
      },
    },
  };
};
//#endregion

//#region Textfield row
export const textfieldRow: LfDataInterface["article"]["shapes"]["textfieldRow"] =
  (id, props) => {
    return {
      id,
      value: "",
      cells: {
        lfTextfield: {
          ...props,
          shape: "textfield",
          value: props.lfValue ?? "",
        },
      },
    };
  };
//#endregion

//#region Card
export const card: LfDataInterface["article"]["shapes"]["card"] = (
  id,
  props,
) => {
  return {
    id,
    value: "",
    cells: {
      lfCard: {
        shape: "card",
        value: "",
        ...props,
      },
    },
  };
};
//#endregion

//#region Chart
export const chart: LfDataInterface["article"]["shapes"]["chart"] = (
  id,
  props,
) => {
  return {
    id,
    value: "",
    cells: {
      lfChart: {
        shape: "chart",
        value: "",
        ...props,
      },
    },
  };
};
//#endregion
