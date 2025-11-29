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

/**
 * Lightweight helpers for building `lf-article` datasets.
 *
 * These builders are pure and framework-agnostic: they only assemble
 * `LfArticleDataset` / `LfArticleNode` structures without touching theme,
 * services, or DOM. Higher-level code (e.g. LLM tools) can compose them
 * to create rich articles without rewriting boilerplate.
 */

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
