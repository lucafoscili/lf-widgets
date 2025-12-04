import {
  LfArticleDataset,
  LfArticleNode,
  LfButtonStyling,
  LfCardLayout,
  LfChartLegendPlacement,
  LfChartType,
  LfDataDataset,
  LfIconType,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";

//#region Accordion helpers
/**
 * Creates an accordion article node that wraps content in a collapsible container.
 * Ideal for large content like READMEs that would otherwise overwhelm the UI.
 *
 * @param options - Configuration for the accordion
 * @param options.id - Unique identifier for the node
 * @param options.dataset - The dataset containing nodes to display in the accordion
 * @param options.uiSize - Optional size of the accordion
 * @param options.uiState - Optional color state of the accordion
 * @param options.style - Optional custom CSS styles
 * @returns An LfArticleNode configured with an accordion shape
 */
export const accordion = (options: {
  id: string;
  dataset: LfDataDataset;
  uiSize?: LfThemeUISize;
  uiState?: LfThemeUIState;
  style?: string;
}): LfArticleNode => ({
  id: options.id,
  value: "",
  cells: {
    lfAccordion: {
      shape: "accordion",
      value: "",
      lfDataset: options.dataset,
      lfUiSize: options.uiSize,
      lfUiState: options.uiState,
      lfStyle: options.style,
    },
  },
});
/**
 * Creates an accordion wrapping a code block - perfect for collapsible documentation.
 * The accordion contains a single expandable section with the code content.
 *
 * @param options - Configuration for the accordion with code
 * @param options.id - Unique identifier for the node
 * @param options.title - Title shown on the accordion header (collapsed state)
 * @param options.code - The code/text content to display
 * @param options.icon - Optional icon shown in the accordion header
 * @param options.language - Optional language for syntax highlighting
 * @param options.uiSize - Optional size of the accordion
 * @param options.uiState - Optional color state of the accordion
 * @param options.style - Optional custom CSS styles
 * @returns An LfArticleNode configured with an accordion containing a code block
 */
export const accordionCodeBlock = (options: {
  id: string;
  title: string;
  code: string;
  icon?: LfIconType;
  language?: string;
  uiSize?: LfThemeUISize;
  uiState?: LfThemeUIState;
  style?: string;
}): LfArticleNode => ({
  id: options.id,
  value: "",
  cells: {
    lfAccordion: {
      shape: "accordion",
      value: "",
      lfDataset: {
        nodes: [
          {
            id: `${options.id}-section`,
            value: options.title,
            icon: options.icon,
            cells: {
              lfCode: {
                shape: "code",
                value: options.code,
                lfLanguage: options.language,
              },
            },
          },
        ],
      },
      lfUiSize: options.uiSize,
      lfUiState: options.uiState,
      lfStyle: options.style,
    },
  },
});
//#endregion

//#region Core builders
export const createArticle = (
  nodes: LfArticleNode[] = [],
  partial?: Partial<LfArticleDataset>,
): LfArticleDataset => ({
  ...partial,
  nodes,
});

export const section = (options: {
  id: string;
  title?: string;
  children?: LfArticleNode[];
  cssStyle?: LfArticleNode["cssStyle"];
}): LfArticleNode => {
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

export const paragraph = (options: {
  id: string;
  text?: string;
  children?: LfArticleNode[];
  cssStyle?: LfArticleNode["cssStyle"];
}): LfArticleNode => {
  const { id, text, children = [], cssStyle } = options;

  return {
    id,
    tagName: "p",
    value: text ?? "",
    cssStyle,
    children,
  };
};

export const separator = (options: {
  id: string;
  cssStyle?: LfArticleNode["cssStyle"];
}): LfArticleNode => ({
  id: options.id,
  tagName: "hr",
  value: "",
  cssStyle: options.cssStyle,
});
//#endregion

//#region Shape helpers
export const progressRow = (options: {
  id: string;
  label: string;
  value: number;
  icon?: LfIconType;
  uiState?: LfThemeUIState;
}): LfArticleNode => ({
  id: options.id,
  value: "",
  cells: {
    lfProgressbar: {
      lfIcon: options.icon,
      lfLabel: options.label,
      lfUiState: options.uiState,
      shape: "progressbar",
      value: options.value,
    },
  },
});

export const buttonRow = (options: {
  id: string;
  label: string;
  icon?: LfIconType;
  styling?: LfButtonStyling;
  uiState?: LfThemeUIState;
  style?: string;
}): LfArticleNode => ({
  id: options.id,
  value: "",
  cells: {
    lfButton: {
      lfIcon: options.icon,
      lfLabel: options.label,
      lfStyling: options.styling,
      lfUiState: options.uiState,
      lfStyle: options.style,
      shape: "button",
      value: "",
    },
  },
});
//#endregion

//#region Additional shapes
export const codeBlock = (options: {
  id: string;
  code: string;
  language?: string;
  cssStyle?: LfArticleNode["cssStyle"];
}): LfArticleNode => ({
  id: options.id,
  value: "",
  cssStyle: options.cssStyle,
  cells: {
    lfCode: {
      shape: "code",
      value: options.code,
      lfLanguage: options.language,
    },
  },
});

export const textfieldRow = (options: {
  id: string;
  label: string;
  value?: string;
  type?: string;
  style?: string;
  helperText?: string;
}): LfArticleNode => ({
  id: options.id,
  value: "",
  cells: {
    lfTextfield: {
      shape: "textfield",
      value: "",
      lfLabel: options.label,
      lfValue: options.value ?? "",
      lfStyle: options.style,
      lfHtmlAttributes: options.type ? { type: options.type } : undefined,
      lfHelper: options.helperText
        ? { value: options.helperText, showWhenFocused: false }
        : undefined,
    },
  },
});
//#endregion

//#region Card / Chart helpers
export const card = (options: {
  id: string;
  dataset: LfDataDataset;
  layout?: LfCardLayout;
  uiSize?: LfThemeUISize;
  uiState?: LfThemeUIState;
  style?: string;
}): LfArticleNode => ({
  id: options.id,
  value: "",
  cells: {
    lfCard: {
      shape: "card",
      value: "",
      lfDataset: options.dataset,
      lfLayout: options.layout,
      lfUiSize: options.uiSize,
      lfUiState: options.uiState,
      lfStyle: options.style,
    },
  },
});

export const chart = (options: {
  id: string;
  dataset: LfDataDataset;
  types?: LfChartType[];
  axis?: string | string[];
  legend?: LfChartLegendPlacement;
  sizeX?: string;
  sizeY?: string;
  style?: string;
}): LfArticleNode => ({
  id: options.id,
  value: "",
  cells: {
    lfChart: {
      shape: "chart",
      value: "",
      lfDataset: options.dataset,
      lfTypes: options.types,
      lfAxis: options.axis,
      lfLegend: options.legend,
      lfSizeX: options.sizeX,
      lfSizeY: options.sizeY,
      lfStyle: options.style,
    },
  },
});
//#endregion
