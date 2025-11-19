import { LfShowcaseDoc } from "../lf-showcase-declarations";
export const LF_DOC: LfShowcaseDoc = {
  "lf-accordion": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfAccordionPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfAccordionPropsInterface>",
      },
      {
        name: "getSelectedNodes",
        docs: "Returns the selected nodes.",
        returns: {
          type: "Promise<Set<LfDataNode>>",
          docs: "Selected nodes.",
        },
        signature: "() => Promise<Set<LfDataNode>>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "toggleNode",
        docs: "Toggles a node in the accordion, expanding or collapsing it based on its current state.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(id: string, e?: Event) => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfDataset",
        docs: "The data set for the LF Accordion component.\r\nThis property is mutable, meaning it can be changed after the component is initialized.",
        type: "LfDataDataset",
      },
      {
        name: "lfRipple",
        docs: "Indicates whether the ripple effect is enabled for the accordion component.",
        type: "boolean",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUiState",
        docs: "The color theme state for the component.",
        type: '"danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"',
      },
    ],
    styles: [
      {
        name: "--lf-accordion-border-color",
        docs: "Sets the border color for the accordion component. Defaults to => var(--lf-color-border)",
      },
      {
        name: "--lf-accordion-border-radius",
        docs: "Sets the border radius for the accordion component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-accordion-color-bg",
        docs: "Sets the color-bg color for the accordion component. Defaults to => var(--lf-color-bg)",
      },
      {
        name: "--lf-accordion-color-on-bg",
        docs: "Sets the color-on-bg color for the accordion component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-accordion-color-on-primary",
        docs: "Sets the color-on-primary color for the accordion component. Defaults to => var(--lf-color-on-primary)",
      },
      {
        name: "--lf-accordion-color-primary",
        docs: "Sets the color-primary color for the accordion component. Defaults to => var(--lf-color-primary)",
      },
      {
        name: "--lf-accordion-cursor",
        docs: "Sets the cursor for the accordion header. Defaults to => pointer",
      },
      {
        name: "--lf-accordion-expand-margin",
        docs: "Sets the margin of the accordion expand icon. Defaults to => 0 0 0 auto",
      },
      {
        name: "--lf-accordion-flex-direction",
        docs: "Sets the flex direction for the accordion component. Defaults to => column",
      },
      {
        name: "--lf-accordion-flex-wrap",
        docs: "Sets the flex wrap for the accordion component. Defaults to => nowrap",
      },
      {
        name: "--lf-accordion-font-family",
        docs: "Sets the primary font family for the accordion component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-accordion-font-size",
        docs: "Sets the font size for the accordion component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-accordion-icon-margin",
        docs: "Sets the margin of the accordion icon. Defaults to => 0 0.5em 0 0",
      },
      {
        name: "--lf-accordion-line-height",
        docs: "Sets the line height of the accordion header. Defaults to => 1.75em",
      },
      {
        name: "--lf-accordion-padding",
        docs: "Sets the padding of the accordion header. Defaults to => 1em",
      },
      {
        name: "--lf-accordion-text-align",
        docs: "Sets the text alignment of the accordion header. Defaults to => left",
      },
      {
        name: "--lf-accordion-text-margin",
        docs: "Sets the margin of the accordion text. Defaults to => 0 0.5em 0 0",
      },
    ],
  },
  "lf-article": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Retrieves the debug information reflecting the current state of the component.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves to a LfDebugLifecycleInfo object containing debug information.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfArticlePropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfArticlePropsInterface>",
      },
      {
        name: "refresh",
        docs: "Triggers a re-render of the component to reflect any state changes.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfDataset",
        docs: "The data set for the LF Article component.\r\nThis property is mutable, meaning it can be changed after the component is initialized.",
        type: "LfArticleDataset",
      },
      {
        name: "lfEmpty",
        docs: "Empty text displayed when there is no data.",
        type: "string",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
    ],
    styles: [
      {
        name: "--lf-article-border-radius",
        docs: "Sets the border radius for the article component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-article-color-bg",
        docs: "Sets the color-bg color for the article component. Defaults to => var(--lf-color-bg)",
      },
      {
        name: "--lf-article-color-h1",
        docs: "Sets the h1 color for the article component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-article-color-h2",
        docs: "Sets the h2 color for the article component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-article-color-h3",
        docs: "Sets the h3 color for the article component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-article-color-h4",
        docs: "Sets the h4 color for the article component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-article-color-h5",
        docs: "Sets the h5 color for the article component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-article-color-h6",
        docs: "Sets the h6 color for the article component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-article-color-on-bg",
        docs: "Sets the color-on-bg color for the article component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-article-font-family",
        docs: "Sets the primary font family for the article component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-article-font-family-body",
        docs: "Sets the body font family for the article component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-article-font-family-h1",
        docs: "Sets the h1 font family for the article component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-article-font-family-h2",
        docs: "Sets the h2 font family for the article component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-article-font-family-h3",
        docs: "Sets the h3 font family for the article component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-article-font-family-h4",
        docs: "Sets the h4 font family for the article component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-article-font-family-h5",
        docs: "Sets the h5 font family for the article component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-article-font-family-h6",
        docs: "Sets the h6 font family for the article component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-article-font-size",
        docs: "Sets the font size for the article component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-article-font-size-body",
        docs: "Sets the body font size for the article component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-article-font-size-h1",
        docs: "Sets the h1 font size for the article component. Defaults to => 2em",
      },
      {
        name: "--lf-article-font-size-h2",
        docs: "Sets the h2 font size for the article component. Defaults to => 1.75em",
      },
      {
        name: "--lf-article-font-size-h3",
        docs: "Sets the h3 font size for the article component. Defaults to => 1.5em",
      },
      {
        name: "--lf-article-font-size-h4",
        docs: "Sets the h4 font size for the article component. Defaults to => 1.25em",
      },
      {
        name: "--lf-article-font-size-h5",
        docs: "Sets the h5 font size for the article component. Defaults to => 1.125em",
      },
      {
        name: "--lf-article-font-size-h6",
        docs: "Sets the h6 font size for the article component. Defaults to => 1em",
      },
      {
        name: "--lf-article-margin",
        docs: "Sets the margin for the article component. Defaults to => auto",
      },
      {
        name: "--lf-article-max-width",
        docs: "Sets the max width for the article component. Defaults to => 1200px",
      },
      {
        name: "--lf-article-padding",
        docs: "Sets the padding for the article component. Defaults to => 2.5em",
      },
      {
        name: "--lf-article-padding-ul",
        docs: "Sets the padding for the ul component. Defaults to => 1.25em",
      },
    ],
  },
  "lf-autocomplete": {
    methods: [
      {
        name: "clearCache",
        docs: "Clears the cache of the autocomplete component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "clearInput",
        docs: "Clears the input field.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "getDebugInfo",
        docs: "Retrieves the debug information for this component instance.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "Lifecycle and performance metrics",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Retrieves all public props of this component as an object.",
        returns: {
          type: "Promise<any>",
          docs: "All component props",
        },
        signature: "() => Promise<any>",
      },
      {
        name: "getValue",
        docs: "Returns the current input value.",
        returns: {
          type: "Promise<string>",
          docs: "The current input text",
        },
        signature: "() => Promise<string>",
      },
      {
        name: "refresh",
        docs: "Forces the component to re-render.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "setValue",
        docs: "Sets the input value.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(value: string) => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Performs cleanup for the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfAllowFreeInput",
        docs: "Allows input of values that are not present in the dataset.\r\nWhen true, users can type and submit any value. When false, only values from the dataset can be selected.",
        type: "boolean",
      },
      {
        name: "lfCache",
        docs: "Enables caching of autocomplete results.\r\nWhen enabled, previously fetched results are stored and reused for identical queries.",
        type: "boolean",
      },
      {
        name: "lfCacheTTL",
        docs: "Sets the time-to-live for cached entries in milliseconds.\r\nCached entries older than this will be considered expired.",
        type: "number",
      },
      {
        name: "lfDataset",
        docs: "Sets the dataset containing the autocomplete suggestions.\r\nThis is typically updated dynamically in response to request events.",
        type: "LfDataDataset",
      },
      {
        name: "lfDebounceMs",
        docs: "Sets the debounce delay in milliseconds before triggering a request event.",
        type: "number",
      },
      {
        name: "lfListProps",
        docs: "Sets the props for the internal lf-list component.",
        type: '{ applyFilter?: (value: string) => Promise<void>; focusNext?: () => Promise<void>; focusPrevious?: () => Promise<void>; getSelected?: () => Promise<LfDataNode>; selectNode?: (idx: number) => Promise<void>; selectNodeById?: (id: string) => Promise<void>; setFilter?: (value: string) => Promise<void>; rootElement?: LfListElement; debugInfo?: LfDebugLifecycleInfo; getDebugInfo?: () => Promise<LfDebugLifecycleInfo>; getProps?: (descriptions?: boolean) => Promise<LfComponentPropsFor<LfComponentName>>; lfStyle?: string; refresh?: () => Promise<void>; unmount?: (ms?: number) => Promise<void>; lfDataset?: LfDataDataset; lfEmpty?: string; lfEnableDeletions?: boolean; lfFilter?: boolean; lfNavigation?: boolean; lfRipple?: boolean; lfSelectable?: boolean; lfUiSize?: "large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"; lfUiState?: "danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"; lfValue?: number; }',
      },
      {
        name: "lfMaxCacheSize",
        docs: "Sets the maximum number of entries in the cache.\r\nWhen exceeded, oldest entries are evicted (FIFO).",
        type: "number",
      },
      {
        name: "lfMinChars",
        docs: "Sets the minimum number of characters required before triggering a request.",
        type: "number",
      },
      {
        name: "lfNavigation",
        docs: "Enables keyboard navigation with arrow keys.",
        type: "boolean",
      },
      {
        name: "lfSpinnerProps",
        docs: "Sets the props for the internal lf-spinner component.",
        type: "{ getProgress?: () => Promise<number>; rootElement?: LfSpinnerElement; debugInfo?: LfDebugLifecycleInfo; getDebugInfo?: () => Promise<LfDebugLifecycleInfo>; getProps?: (descriptions?: boolean) => Promise<LfComponentPropsFor<LfComponentName>>; lfStyle?: string; refresh?: () => Promise<void>; unmount?: (ms?: number) => Promise<void>; lfActive?: boolean; lfBarVariant?: boolean; lfDimensions?: string; lfFader?: boolean; lfFaderTimeout?: number; lfFullScreen?: boolean; lfLayout?: number; lfTimeout?: number; }",
      },
      {
        name: "lfStyle",
        docs: "Custom CSS styles to apply to the component.",
        type: "string",
      },
      {
        name: "lfTextfieldProps",
        docs: "Sets the props for the internal lf-textfield component.",
        type: '{ formatJSON?: () => Promise<void>; getElement?: () => Promise<HTMLInputElement | HTMLTextAreaElement>; getValue?: () => Promise<string>; setBlur?: () => Promise<void>; setFocus?: () => Promise<void>; setValue?: (value: string) => Promise<void>; rootElement?: LfTextfieldElement; debugInfo?: LfDebugLifecycleInfo; getDebugInfo?: () => Promise<LfDebugLifecycleInfo>; getProps?: (descriptions?: boolean) => Promise<LfComponentPropsFor<LfComponentName>>; lfStyle?: string; refresh?: () => Promise<void>; unmount?: (ms?: number) => Promise<void>; lfFormatJSON?: LfTextfieldFormatJSON; lfHelper?: LfTextfieldHelper; lfHtmlAttributes?: Partial<LfFrameworkAllowedKeysMap>; lfIcon?: string; lfLabel?: string; lfStretchY?: boolean; lfStyling?: "flat" | "outlined" | "raised" | "textarea"; lfTrailingIcon?: boolean; lfTrailingIconAction?: LfTextfieldTrailingIconAction; lfUiSize?: "large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"; lfUiState?: "danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"; lfValue?: string; }',
      },
      {
        name: "lfUiSize",
        docs: "Sets the UI size of the autocomplete field.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUiState",
        docs: "Sets the UI state (primary, secondary, disabled, etc.).",
        type: '"danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"',
      },
      {
        name: "lfValue",
        docs: "Sets the initial value of the input field.",
        type: "string",
      },
    ],
    styles: [
      {
        name: "--lf-autocomplete-font-family",
        docs: "Sets the primary font family for the autocomplete component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-autocomplete-font-size",
        docs: "Sets the font size for the autocomplete component. Defaults to => var(--lf-font-size)",
      },
    ],
  },
  "lf-badge": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfBadgePropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfBadgePropsInterface>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfImageProps",
        docs: "The props of the image displayed inside the badge.",
        type: "LfImagePropsInterface",
      },
      {
        name: "lfLabel",
        docs: "The label displayed inside the badge.",
        type: "string",
      },
      {
        name: "lfPosition",
        docs: "The position of the badge in relation of its container.",
        type: '"bottom-left" | "bottom-right" | "inline" | "top-left" | "top-right"',
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUiState",
        docs: "Reflects the specified state color defined by the theme.",
        type: '"danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"',
      },
    ],
    styles: [
      {
        name: "--lf-badge-border-radius",
        docs: "Sets the border radius for the badge component. Defaults to => 50%",
      },
      {
        name: "--lf-badge-color-on-primary",
        docs: "Sets the color-on-primary color for the badge component. Defaults to => var(--lf-color-on-primary)",
      },
      {
        name: "--lf-badge-color-primary",
        docs: "Sets the color-primary color for the badge component. Defaults to => var(--lf-color-primary)",
      },
      {
        name: "--lf-badge-font-family",
        docs: "Sets the primary font family for the badge component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-badge-font-size",
        docs: "Sets the font size for the badge component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-badge-height",
        docs: "Sets the height for the badge component. Defaults to => 1.5em",
      },
      {
        name: "--lf-badge-padding",
        docs: "Sets the padding for the badge component. Defaults to => 0.25em",
      },
      {
        name: "--lf-badge-place-content",
        docs: "Sets the place content for the badge component. Defaults to => center",
      },
      {
        name: "--lf-badge-width",
        docs: "Sets the width for the badge component. Defaults to => 1.5em",
      },
    ],
  },
  "lf-button": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfButtonPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfButtonPropsInterface>",
      },
      {
        name: "getValue",
        docs: "Used to retrieve the component's current state.",
        returns: {
          type: 'Promise<"off" | "on">',
          docs: "Promise resolved with the current state of the component.",
        },
        signature: "() => Promise<LfButtonState>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "setMessage",
        docs: "Temporarily sets a different label/icon combination, falling back to their previous value after a timeout.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature:
          "(label?: string, icon?: string, timeout?: number) => Promise<void>",
      },
      {
        name: "setValue",
        docs: "Sets the component's state.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(value: LfButtonState | boolean) => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfAriaLabel",
        docs: "Explicit accessible label for the button. When provided it takes precedence over\nany derived label (lfLabel / lfIcon / id fallback) and is applied to the internal button element(s).",
        type: "string",
      },
      {
        name: "lfDataset",
        docs: "The dataset for the button, containing the nodes to be displayed.\nThe first node will be used to set the icon and label if not provided.",
        type: "LfDataDataset",
      },
      {
        name: "lfIcon",
        docs: "When set, the button will show this icon.",
        type: "string",
      },
      {
        name: "lfIconOff",
        docs: "When set, the icon button off state will show this icon. Otherwise, an outlined version of the icon prop will be displayed.",
        type: "string",
      },
      {
        name: "lfLabel",
        docs: "When set, the button will show this text.",
        type: "string",
      },
      {
        name: "lfRipple",
        docs: "When set to true, the pointerdown event will trigger a ripple effect.",
        type: "boolean",
      },
      {
        name: "lfShowSpinner",
        docs: "When set to true, the button will display a spinner and won't be clickable.",
        type: "boolean",
      },
      {
        name: "lfStretchX",
        docs: "When set to true, the button will stretch to fill the available horizontal space.",
        type: "boolean",
      },
      {
        name: "lfStretchY",
        docs: "When set to true, the button will stretch to fill the available vertical space.",
        type: "boolean",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfStyling",
        docs: "Defines the style of the button. This property controls the visual appearance of the button.",
        type: '"flat" | "floating" | "icon" | "outlined" | "raised"',
      },
      {
        name: "lfToggable",
        docs: "When set to true, the icon button will be toggable on/off.",
        type: "boolean",
      },
      {
        name: "lfTrailingIcon",
        docs: "When set, the icon will be shown after the text.",
        type: "boolean",
      },
      {
        name: "lfType",
        docs: "Sets the type of the button.",
        type: '"button" | "reset" | "submit"',
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUiState",
        docs: "Reflects the specified state color defined by the theme.",
        type: '"danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"',
      },
      {
        name: "lfValue",
        docs: "Sets the initial state of the button.\nRelevant only when lfToggable is set to true.",
        type: "boolean",
      },
    ],
    styles: [
      {
        name: "--lf-button-align-items",
        docs: "Sets the align items for the button component. Defaults to => center",
      },
      {
        name: "--lf-button-border-radius",
        docs: "Sets the border radius for the button component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-button-color-border",
        docs: "Sets the color-border color for the button component. Defaults to => var(--lf-color-border)",
      },
      {
        name: "--lf-button-color-on-primary",
        docs: "Sets the color-on-primary color for the button component. Defaults to => var(--lf-color-on-primary)",
      },
      {
        name: "--lf-button-color-primary",
        docs: "Sets the color-primary color for the button component. Defaults to => var(--lf-color-primary)",
      },
      {
        name: "--lf-button-cursor",
        docs: "Sets the cursor for the button component. Defaults to => pointer",
      },
      {
        name: "--lf-button-font-family",
        docs: "Sets the primary font family for the button component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-button-font-size",
        docs: "Sets the font size for the button component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-button-font-weight",
        docs: "Sets the font weight for the button component. Defaults to => var(--lf-font-weight-primary)",
      },
      {
        name: "--lf-button-height",
        docs: "Sets the height for the button component. Defaults to => 3em",
      },
      {
        name: "--lf-button-justify-content",
        docs: "Sets the justify content for the button component. Defaults to => center",
      },
      {
        name: "--lf-button-min-width",
        docs: "Sets the min width for the button component. Defaults to => 4em",
      },
      {
        name: "--lf-button-padding",
        docs: "Sets the padding for the button component. Defaults to => 0 1.25em",
      },
      {
        name: "--lf-button-text-decoration",
        docs: "Sets the text decoration for the button component. Defaults to => none",
      },
      {
        name: "--lf-button-text-transform",
        docs: "Sets the text transform for the button component. Defaults to => uppercase",
      },
    ],
  },
  "lf-canvas": {
    methods: [
      {
        name: "clearCanvas",
        docs: "Clears the specified canvas type of all drawn content.",
        returns: {
          type: "Promise<void>",
          docs: "A promise that resolves when the canvas has been cleared.",
        },
        signature: "(type?: LfCanvasType) => Promise<void>",
      },
      {
        name: "getCanvas",
        docs: "Retrieves the canvas element based on the specified type.",
        returns: {
          type: "Promise<HTMLCanvasElement>",
          docs: "Promise that resolves to the requested HTMLCanvasElement.",
        },
        signature: "(type?: LfCanvasType) => Promise<HTMLCanvasElement>",
      },
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getImage",
        docs: "Retrieves the HTMLLfImageElement from the canvas.",
        returns: {
          type: "Promise<LfImageElement>",
          docs: "A promise that resolves with the HTMLLfImageElement instance\r\nrepresenting the image element in the canvas.",
        },
        signature: "() => Promise<LfImageElement>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfCanvasPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfCanvasPropsInterface>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "resizeCanvas",
        docs: "Resizes the canvas elements to match the container's dimensions.\r\n\r\nThis method performs the following operations:\r\n1. Calculates available space from the parent element (to avoid circular dependency with boxing CSS)\r\n2. Extracts image dimensions using `getImageDimensions()` helper\r\n3. Determines image orientation and updates state\r\n4. Calculates boxing type (letterbox/pillarbox) based on aspect ratio mismatch\r\n5. Waits for next frame to ensure boxing CSS is applied\r\n6. Sets canvas dimensions to match the final rendered container size\r\n\r\nThe boxing calculation helps correctly map pointer coordinates to image coordinates\r\nwhen the image aspect ratio differs from the available space.",
        returns: {
          type: "Promise<void>",
          docs: "A Promise that resolves when the resize operation is complete",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "setCanvasHeight",
        docs: "Sets the canvas height for both the board and preview elements.\r\nIf a value is provided, it will set that specific height.\r\nIf no value is provided, it will set the height based on the container's bounding client rect.",
        returns: {
          type: "Promise<void>",
          docs: "Promise that resolves when the height has been set",
        },
        signature: "(value?: number) => Promise<void>",
      },
      {
        name: "setCanvasWidth",
        docs: "Sets the width of the canvas element(s).\r\nIf a value is provided, sets the width to that specific value.\r\nIf no value is provided, sets the width to match the container's width.\r\nWhen cursor preview is enabled, also updates the preview canvas width.",
        returns: {
          type: "Promise<void>",
          docs: "Promise that resolves when width is set",
        },
        signature: "(value?: number) => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfBrush",
        docs: "The shape of the brush.",
        type: '"round" | "square"',
      },
      {
        name: "lfColor",
        docs: "The color of the brush.",
        type: "string",
      },
      {
        name: "lfCursor",
        docs: "Sets the style of the cursor.",
        type: '"default" | "preview"',
      },
      {
        name: "lfImageProps",
        docs: "The props of the image displayed inside the canvas.",
        type: "LfImagePropsInterface",
      },
      {
        name: "lfOpacity",
        docs: "The opacity of the brush.",
        type: "number",
      },
      {
        name: "lfPreview",
        docs: "Displays the brush track of the current stroke.",
        type: "boolean",
      },
      {
        name: "lfSize",
        docs: "The size of the brush.",
        type: "number",
      },
      {
        name: "lfStrokeTolerance",
        docs: "Simplifies the coordinates array by applying the Ramer-Douglas-Peucker algorithm.\r\nThis prop sets the tolerance of the algorithm (null to disable).",
        type: "number",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
    ],
    styles: [
      {
        name: "--lf-canvas-font-family",
        docs: "Sets the primary font family for the canvas component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-canvas-font-size",
        docs: "Sets the font size for the canvas component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-canvas-margin",
        docs: "Sets the margin for the canvas component. Defaults to => auto",
      },
      {
        name: "--lf-canvas-max-height",
        docs: "Sets the max height for the canvas component. Defaults to => max-content",
      },
      {
        name: "--lf-canvas-max-width",
        docs: "Sets the max width for the canvas component. Defaults to => max-content",
      },
      {
        name: "--lf-canvas-object-fit",
        docs: "Sets the object fit for the lf-image subcomponent. Defaults to => contain",
      },
      {
        name: "--lf-canvas-position",
        docs: "Sets the position for the canvas component. Defaults to => relative",
      },
    ],
  },
  "lf-card": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfCardPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfCardPropsInterface>",
      },
      {
        name: "getShapes",
        docs: "Used to retrieve component's shapes.",
        returns: {
          type: "Promise<LfDataShapesMap>",
          docs: "Map of shapes.",
        },
        signature: "() => Promise<LfDataShapesMap>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfDataset",
        docs: "The data set for the LF Card component.\r\nThis property is mutable, meaning it can be changed after the component is initialized.",
        type: "LfDataDataset",
      },
      {
        name: "lfLayout",
        docs: 'The layout style for the card component.\r\nCan be set to different predefined styles like "material" design.',
        type: '"debug" | "keywords" | "material" | "upload" | "weather"',
      },
      {
        name: "lfSizeX",
        docs: "The width of the card, defaults to 100%. Accepts any valid CSS format (px, %, vw, etc.).",
        type: "string",
      },
      {
        name: "lfSizeY",
        docs: "The height of the card, defaults to 100%. Accepts any valid CSS format (px, %, vh, etc.).",
        type: "string",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUiState",
        docs: "Reflects the specified state color defined by the theme.",
        type: '"danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"',
      },
    ],
    styles: [
      {
        name: "--lf-card-border-radius",
        docs: "Sets the border radius for the card component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-card-color-bg",
        docs: "Sets the color-bg color for the card component. Defaults to => var(--lf-color-bg)",
      },
      {
        name: "--lf-card-color-on-bg",
        docs: "Sets the color-on-bg color for the card component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-card-color-primary",
        docs: "Sets the color-primary color for the card component. Defaults to => var(--lf-color-primary)",
      },
      {
        name: "--lf-card-font-family",
        docs: "Sets the primary font family for the card component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-card-font-size",
        docs: "Sets the font size for the card component. Defaults to => var(--lf-font-size)",
      },
    ],
  },
  "lf-carousel": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfCarouselPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfCarouselPropsInterface>",
      },
      {
        name: "goToSlide",
        docs: "Navigates to a specific slide in the carousel by its index.",
        returns: {
          type: "Promise<void>",
          docs: "A promise that resolves when the slide transition is complete.",
        },
        signature: "(index: number) => Promise<void>",
      },
      {
        name: "nextSlide",
        docs: "Moves the carousel to the next slide.\r\nTriggers the next slide transition using the carousel controller's next function.",
        returns: {
          type: "Promise<void>",
          docs: "A promise that resolves when the slide transition is complete.",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "prevSlide",
        docs: "Moves the carousel to the previous slide by invoking the `previous` method\r\nfrom the carousel controller's index set.",
        returns: {
          type: "Promise<void>",
          docs: "A promise that resolves when the slide transition is complete",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfAutoPlay",
        docs: "Enable or disable autoplay for the carousel.",
        type: "boolean",
      },
      {
        name: "lfDataset",
        docs: "The data set for the LF Carousel component.\r\nThis property is mutable, meaning it can be changed after the component is initialized.",
        type: "LfDataDataset",
      },
      {
        name: "lfInterval",
        docs: "Interval in milliseconds for autoplay.",
        type: "number",
      },
      {
        name: "lfLightbox",
        docs: "Determines whether the carousel should display a lightbox when an item is clicked.",
        type: "boolean",
      },
      {
        name: "lfNavigation",
        docs: "Determines whether the carousel should display navigation controls (prev/next buttons).",
        type: "boolean",
      },
      {
        name: "lfShape",
        docs: "Sets the type of shapes to compare.",
        type: '"badge" | "button" | "canvas" | "card" | "chart" | "chat" | "chip" | "code" | "image" | "number" | "photoframe" | "progressbar" | "slot" | "text" | "textfield" | "toggle" | "typewriter" | "upload"',
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
    ],
    styles: [
      {
        name: "--lf-carousel-border-radius",
        docs: "Sets the border radius for the carousel component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-carousel-color-on-surface",
        docs: "Sets the color-on-surface color for the carousel component. Defaults to => var(--lf-color-on-surface)",
      },
      {
        name: "--lf-carousel-color-surface",
        docs: "Sets the color-surface color for the carousel component. Defaults to => var(--lf-color-surface)",
      },
      {
        name: "--lf-carousel-font-family",
        docs: "Sets the primary font family for the carousel component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-carousel-font-size",
        docs: "Sets the font size for the carousel component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-carousel-slide-bar-height",
        docs: "Sets the height for the slide bar of the carousel component. Defaults to => 0.75em",
      },
      {
        name: "--lf-carousel-slide-bar-opacity",
        docs: "Sets the opacity for the slide bar of the carousel component. Defaults to => 0.75",
      },
      {
        name: "--lf-carousel-slide-bar-opacity-hover",
        docs: "Sets the opacity for the slide bar of the carousel component when hovered. Defaults to => 1",
      },
    ],
  },
  "lf-chart": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfChartPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfChartPropsInterface>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "resize",
        docs: "Resizes the chart to fit the container.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfAxis",
        docs: "Sets the axis of the chart.",
        type: "string | string[]",
      },
      {
        name: "lfColors",
        docs: "Overrides theme's colors.",
        type: "string[]",
      },
      {
        name: "lfDataset",
        docs: "The data set for the LF Chart component.\r\nThis property is mutable, meaning it can be changed after the component is initialized.",
        type: "LfDataDataset",
      },
      {
        name: "lfLegend",
        docs: "Sets the position of the legend.\r\nSupported values: bottom, left, right, top, hidden.\r\nKeep in mind that legend types are tied to chart types, some combinations might not work.",
        type: '"bottom" | "hidden" | "left" | "right" | "top"',
      },
      {
        name: "lfSeries",
        docs: "The data series to be displayed. They must be of the same type.",
        type: "string[]",
      },
      {
        name: "lfSizeX",
        docs: "The width of the chart, defaults to 100%. Accepts any valid CSS format (px, %, vw, etc.).",
        type: "string",
      },
      {
        name: "lfSizeY",
        docs: "The height of the chart, defaults to 100%. Accepts any valid CSS format (px, %, vh, etc.).",
        type: "string",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfTypes",
        docs: "The type(s) of the chart.",
        type: '("area" | "bar" | "bubble" | "calendar" | "candlestick" | "funnel" | "gaussian" | "hbar" | "heatmap" | "line" | "pie" | "radar" | "sankey" | "sbar" | "scatter")[]',
      },
      {
        name: "lfXAxis",
        docs: "Customization options for the x Axis.",
        type: 'AxisBaseOptionCommon & { gridIndex?: number; gridId?: string; position?: CartesianAxisPosition; offset?: number; categorySortInfo?: OrdinalSortInfo; } & { mainType?: "xAxis"; } | CategoryAxisBaseOption & { gridIndex?: number; gridId?: string; position?: CartesianAxisPosition; offset?: number; categorySortInfo?: OrdinalSortInfo; } & { mainType?: "xAxis"; } | LogAxisBaseOption & { gridIndex?: number; gridId?: string; position?: CartesianAxisPosition; offset?: number; categorySortInfo?: OrdinalSortInfo; } & { mainType?: "xAxis"; } | TimeAxisBaseOption & { gridIndex?: number; gridId?: string; position?: CartesianAxisPosition; offset?: number; categorySortInfo?: OrdinalSortInfo; } & { mainType?: "xAxis"; } | ValueAxisBaseOption & { gridIndex?: number; gridId?: string; position?: CartesianAxisPosition; offset?: number; categorySortInfo?: OrdinalSortInfo; } & { mainType?: "xAxis"; }',
      },
      {
        name: "lfYAxis",
        docs: "Customization options for the y Axis.",
        type: 'AxisBaseOptionCommon & { gridIndex?: number; gridId?: string; position?: CartesianAxisPosition; offset?: number; categorySortInfo?: OrdinalSortInfo; } & { mainType?: "yAxis"; } | CategoryAxisBaseOption & { gridIndex?: number; gridId?: string; position?: CartesianAxisPosition; offset?: number; categorySortInfo?: OrdinalSortInfo; } & { mainType?: "yAxis"; } | LogAxisBaseOption & { gridIndex?: number; gridId?: string; position?: CartesianAxisPosition; offset?: number; categorySortInfo?: OrdinalSortInfo; } & { mainType?: "yAxis"; } | TimeAxisBaseOption & { gridIndex?: number; gridId?: string; position?: CartesianAxisPosition; offset?: number; categorySortInfo?: OrdinalSortInfo; } & { mainType?: "yAxis"; } | ValueAxisBaseOption & { gridIndex?: number; gridId?: string; position?: CartesianAxisPosition; offset?: number; categorySortInfo?: OrdinalSortInfo; } & { mainType?: "yAxis"; }',
      },
    ],
    styles: [
      {
        name: "--lf-chart-color-bg",
        docs: "Sets the color-bg color for the chart component. Defaults to => var(--lf-color-bg)",
      },
      {
        name: "--lf-chart-color-on-bg",
        docs: "Sets the color-on-bg color for the chart component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-chart-font-family",
        docs: "Sets the primary font family for the chart component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-chart-font-size",
        docs: "Sets the font size for the chart component. Defaults to => var(--lf-font-size)",
      },
    ],
  },
  "lf-chat": {
    methods: [
      {
        name: "abortStreaming",
        docs: "Aborts the current streaming response from the LLM.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "exportHistory",
        docs: "Exports current history as JSON file",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "getDebugInfo",
        docs: "Retrieves the debug information reflecting the current state of the component.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves to a LfDebugLifecycleInfo object containing debug information.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getHistory",
        docs: "Returns the full history as a string.",
        returns: {
          type: "Promise<string>",
          docs: "Full history of the chat.",
        },
        signature: "() => Promise<string>",
      },
      {
        name: "getLastMessage",
        docs: "Returns the last message as a string.",
        returns: {
          type: "Promise<string>",
          docs: "The last message of the history.",
        },
        signature: "() => Promise<string>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfChatPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfChatPropsInterface>",
      },
      {
        name: "handleFileAttachment",
        docs: "Opens file picker for file attachment",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "handleImageAttachment",
        docs: "Opens file picker for image attachment",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "refresh",
        docs: "Triggers a re-render of the component to reflect any state changes.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "removeAttachment",
        docs: "Removes an attachment from the current message",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(id: string) => Promise<void>",
      },
      {
        name: "scrollToBottom",
        docs: 'Scrolls the chat message list to the bottom.\n\nThe method first checks the component controller status via this.#adapter.controller.get;\nif the controller is not in the "ready" state the method returns early without performing any scrolling.\n\nBehavior:\n- If blockOrScroll === true, performs a passive scroll of the messages container by calling\n  this.#messagesContainer.scrollTo({ top: this.#messagesContainer.scrollHeight, behavior: "smooth" }).\n  This path is intended for initial loads where a container-level scroll is sufficient.\n- Otherwise, uses this.#lastMessage?.scrollIntoView({ behavior: "smooth", block: blockOrScroll })\n  to bring the last message element into view for active user interactions. The block argument is\n  treated as a ScrollLogicalPosition (for example "start" | "center" | "end" | "nearest").\n\nNotes:\n- The method is async and returns a Promise<void>, but it does not wait for the visual scrolling\n  animation to complete; the promise resolves after issuing the scroll command.\n- If the messages container or last message element is not present, the corresponding scroll call\n  is a no-op.\n- The signature accepts a boolean union for convenience (true = container scroll). Callers who intend\n  to use scrollIntoView should pass a valid ScrollLogicalPosition value.',
        returns: {
          type: "Promise<void>",
          docs: "Promise<void> that resolves after issuing the scroll command.",
        },
        signature:
          "(blockOrScroll?: ScrollLogicalPosition | boolean) => Promise<void>",
      },
      {
        name: "setHistory",
        docs: "Sets the history of the component through a string.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(history: string, fromFile?: boolean) => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfAttachmentUploadTimeout",
        docs: "",
        type: "number",
      },
      {
        name: "lfConfig",
        docs: "Configuration object for LLM, tools, UI, and attachments.\nRecommended for new implementations; legacy individual props remain supported.",
        type: "LfChatConfig",
      },
      {
        name: "lfContextWindow",
        docs: "How many tokens the context window can handle, used to calculate the occupied space.",
        type: "number",
      },
      {
        name: "lfEmpty",
        docs: "Empty text displayed when there is no data.",
        type: "string",
      },
      {
        name: "lfEndpointUrl",
        docs: "The URL endpoint for the chat service.",
        type: "string",
      },
      {
        name: "lfFrequencyPenalty",
        docs: "The frequency penalty for the LLM's answer.\nThis parameter is used to reduce the likelihood of the model repeating the same tokens.",
        type: "number",
      },
      {
        name: "lfLayout",
        docs: "Sets the layout of the chat.",
        type: '"bottom" | "top"',
      },
      {
        name: "lfMaxTokens",
        docs: "The maximum amount of tokens allowed in the LLM's answer.\nThis parameter is used to control the length of the generated output.",
        type: "number",
      },
      {
        name: "lfPollingInterval",
        docs: "How often the component checks whether the LLM endpoint is online or not.",
        type: "number",
      },
      {
        name: "lfPresencePenalty",
        docs: "The presence penalty for the LLM's answer.\nThis parameter is used to reduce the likelihood of the model repeating the same information.",
        type: "number",
      },
      {
        name: "lfSeed",
        docs: "The seed of the LLM's answer.\nThis parameter is used to control the randomness of the output.",
        type: "number",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfSystem",
        docs: "System message for the LLM.",
        type: "string",
      },
      {
        name: "lfTemperature",
        docs: "Sets the creative boundaries of the LLM.",
        type: "number",
      },
      {
        name: "lfTools",
        docs: "The tools available for the LLM to use during the conversation.\nThese enable the model to perform actions like web searches or data fetching.",
        type: "LfLLMTool[]",
      },
      {
        name: "lfTopP",
        docs: "The top-p sampling value for the LLM's answer.\nThis parameter controls the diversity of the generated output by limiting the\nmodel's consideration to the top-p most probable tokens.",
        type: "number",
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUploadCallback",
        docs: "If set, the component will call this\nfunction with the selected File[] and await the returned attachments. If not\nprovided the component falls back to embedding base64 data in the `data` field.",
        type: "(files: File[]) => Promise<LfLLMAttachment[]>",
      },
      {
        name: "lfValue",
        docs: "Sets the initial history of the chat.",
        type: "LfLLMChoiceMessage[]",
      },
    ],
    styles: [
      {
        name: "--lf-chat-attachments-padding",
        docs: "Sets the attachments padding for the chat component. Defaults to => 0 1em",
      },
      {
        name: "--lf-chat-blockquote-border-opacity",
        docs: "Sets the border opacity for blockquotes. Defaults to => 0.3",
      },
      {
        name: "--lf-chat-blockquote-border-width",
        docs: "Sets the border width for blockquotes. Defaults to => 3px",
      },
      {
        name: "--lf-chat-blockquote-margin",
        docs: "Sets the margin for blockquotes. Defaults to => 1em 0",
      },
      {
        name: "--lf-chat-blockquote-padding",
        docs: "Sets the padding for blockquotes. Defaults to => 0.5em 1em",
      },
      {
        name: "--lf-chat-border-color",
        docs: "Sets the border color for the chat component. Defaults to => var(--lf-color-border)",
      },
      {
        name: "--lf-chat-border-radius",
        docs: "Sets the border radius for the chat component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-chat-buttons-padding",
        docs: "Sets the padding for the buttons of the chat component. Defaults to => 1em 0",
      },
      {
        name: "--lf-chat-color-bg",
        docs: "Sets the color-bg color for the chat component. Defaults to => var(--lf-color-bg)",
      },
      {
        name: "--lf-chat-color-on-bg",
        docs: "Sets the color-on-bg color for the chat component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-chat-color-on-surface",
        docs: "Sets the color-on-surface color for the chat component. Defaults to => var(--lf-color-on-surface)",
      },
      {
        name: "--lf-chat-color-surface",
        docs: "Sets the color-surface color for the chat component. Defaults to => var(--lf-color-surface)",
      },
      {
        name: "--lf-chat-font-family",
        docs: "Sets the primary font family for the chat component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-chat-font-size",
        docs: "Sets the font size for the chat component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-chat-grid-gap",
        docs: "Sets the grid gap for the messages area. Defaults to => 0.75em",
      },
      {
        name: "--lf-chat-heading-margin-bottom",
        docs: "Sets the bottom margin for headings. Defaults to => 0.5em",
      },
      {
        name: "--lf-chat-heading-margin-top",
        docs: "Sets the top margin for headings. Defaults to => 1em",
      },
      {
        name: "--lf-chat-hr-border-width",
        docs: "Sets the border width for horizontal rules. Defaults to => 1px",
      },
      {
        name: "--lf-chat-hr-margin",
        docs: "Sets the margin for horizontal rules. Defaults to => 1em 0",
      },
      {
        name: "--lf-chat-hr-opacity",
        docs: "Sets the opacity for horizontal rules. Defaults to => 0.2",
      },
      {
        name: "--lf-chat-inline-code-border-radius",
        docs: "Sets the border radius for inline code. Defaults to => var(--lf-border-radius, 0.25em)",
      },
      {
        name: "--lf-chat-inline-code-padding",
        docs: "Sets the padding for inline code. Defaults to => 0.2em 0.4em",
      },
      {
        name: "--lf-chat-inner-padding",
        docs: "Sets the inner padding for the messages area. Defaults to => 1em",
      },
      {
        name: "--lf-chat-list-item-margin",
        docs: "Sets the margin for list items. Defaults to => 0.25em 0",
      },
      {
        name: "--lf-chat-list-margin",
        docs: "Sets the margin for lists. Defaults to => 0.5em 0",
      },
      {
        name: "--lf-chat-list-padding-left",
        docs: "Sets the left padding for lists. Defaults to => 2em",
      },
      {
        name: "--lf-chat-margin-bottom",
        docs: "Sets the margin bottom for the messages area. Defaults to => 1em",
      },
      {
        name: "--lf-chat-margin-top",
        docs: "Sets the margin top for the messages area. Defaults to => 1em",
      },
      {
        name: "--lf-chat-message-max-width",
        docs: "Sets the max width for each message in the messages area. Defaults to => 75%",
      },
      {
        name: "--lf-chat-outer-grid-gap",
        docs: "Sets the outer grid gap for the chat component. Defaults to => 0.75em",
      },
      {
        name: "--lf-chat-padding",
        docs: "Sets the padding for the chat component. Defaults to => 1em",
      },
    ],
  },
  "lf-checkbox": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfCheckboxPropsInterface>",
          docs: "",
        },
        signature: "() => Promise<LfCheckboxPropsInterface>",
      },
      {
        name: "getValue",
        docs: "Retrieves the current value of the checkbox.",
        returns: {
          type: 'Promise<"indeterminate" | "off" | "on">',
          docs: "",
        },
        signature: "() => Promise<LfCheckboxState>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "setValue",
        docs: "Sets the value of the checkbox.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(value: LfCheckboxState | boolean) => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, removing the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfAriaLabel",
        docs: "Explicit accessible label for the checkbox control. Fallback chain when empty:\nlfLabel -> root element id -> 'checkbox'. Applied to the native input element.",
        type: "string",
      },
      {
        name: "lfLabel",
        docs: "Defines text to display along with the checkbox.",
        type: "string",
      },
      {
        name: "lfLeadingLabel",
        docs: "When set to true, the label will be displayed before the checkbox.",
        type: "boolean",
      },
      {
        name: "lfRipple",
        docs: "When set to true, the pointerdown event will trigger a ripple effect.",
        type: "boolean",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUiState",
        docs: "Reflects the specified state color defined by the theme.",
        type: '"danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"',
      },
      {
        name: "lfValue",
        docs: "Sets the initial boolean state of the checkbox.\nSet to null for indeterminate state.",
        type: "boolean",
      },
    ],
    styles: [
      {
        name: "--lf-checkbox-animation-duration",
        docs: "Sets the animation duration for state changes. Defaults to => 90ms",
      },
      {
        name: "--lf-checkbox-border-radius",
        docs: "Sets the border radius for the checkbox background. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-checkbox-checkmark-stroke-width",
        docs: "Sets the stroke width for the checkmark. Defaults to => 3.12px",
      },
      {
        name: "--lf-checkbox-color-on-bg",
        docs: "Sets the color-on-bg color for the checkbox component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-checkbox-color-on-primary",
        docs: "Sets the color-on-primary color for the checkbox component. Defaults to => var(--lf-color-on-primary)",
      },
      {
        name: "--lf-checkbox-color-on-surface",
        docs: "Sets the color-on-surface color for the checkbox component. Defaults to => var(--lf-color-on-surface)",
      },
      {
        name: "--lf-checkbox-color-primary",
        docs: "Sets the color-primary color for the checkbox component. Defaults to => var(--lf-color-primary)",
      },
      {
        name: "--lf-checkbox-font-family",
        docs: "Sets the primary font family for the checkbox component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-checkbox-font-size",
        docs: "Sets the font size for the checkbox component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-checkbox-form-padding",
        docs: "Sets the padding for the checkbox form field. Defaults to => 0.5em",
      },
      {
        name: "--lf-checkbox-label-min-width",
        docs: "Sets the min-width for the checkbox label. Defaults to => max-content",
      },
      {
        name: "--lf-checkbox-label-padding-left",
        docs: "Sets the left padding for the checkbox label. Defaults to => 1em",
      },
      {
        name: "--lf-checkbox-label-padding-right",
        docs: "Sets the right padding for the checkbox label. Defaults to => 1em",
      },
      {
        name: "--lf-checkbox-mixedmark-width",
        docs: "Sets the width for the checkbox mixed mark. Defaults to => 70%",
      },
      {
        name: "--lf-checkbox-size",
        docs: "Sets the size for the checkbox component. Defaults to => 1.5em",
      },
      {
        name: "--lf-checkbox-surface-border-radius",
        docs: "Sets the border radius for the checkbox surface. Defaults to => 50%",
      },
      {
        name: "--lf-checkbox-surface-size",
        docs: "Sets the size for the checkbox surface. Defaults to => 3.5em",
      },
    ],
  },
  "lf-chip": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfChipPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfChipPropsInterface>",
      },
      {
        name: "getSelectedNodes",
        docs: "Returns the selected nodes.",
        returns: {
          type: "Promise<Set<LfDataNode>>",
          docs: "Selected nodes.",
        },
        signature: "() => Promise<Set<LfDataNode>>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "setSelectedNodes",
        docs: "Selects one or more nodes in the chip component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature:
          "(nodes: (LfDataNode[] | string[]) & Array<any>) => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfAriaLabel",
        docs: "Explicit accessible label applied to each chip item when it would otherwise lack a text label.\nFallback chain per item: node.value -> lfAriaLabel -> node.icon -> component id -> 'chip item'.",
        type: "string",
      },
      {
        name: "lfDataset",
        docs: "The data set for the LF Chip component.\nThis property is mutable, meaning it can be changed after the component is initialized.",
        type: "LfDataDataset",
      },
      {
        name: "lfFlat",
        docs: "When set to true, renders the chip without distinctive badge styling for use in dense contexts like toolbars.",
        type: "boolean",
      },
      {
        name: "lfRipple",
        docs: "When set to true, the pointerdown event will trigger a ripple effect.",
        type: "boolean",
      },
      {
        name: "lfShowSpinner",
        docs: "When set to true, displays a spinner animation in place of the icon/image for loading states.",
        type: "boolean",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfStyling",
        docs: 'Styling of the chip component, includes: "choice", "input", "filter" and "standard".',
        type: '"choice" | "filter" | "input" | "standard"',
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUiState",
        docs: "Reflects the specified state color defined by the theme.",
        type: '"danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"',
      },
      {
        name: "lfValue",
        docs: "Sets the initial state of the chip.\nRelevant only when the chip can be selected.",
        type: "string[]",
      },
    ],
    styles: [
      {
        name: "--lf-chip-align-items",
        docs: "Sets the alignment for the wrapper. Defaults to => center",
      },
      {
        name: "--lf-chip-border-radius",
        docs: "Sets the border radius for the chip component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-chip-color-on-bg",
        docs: "Sets the color for the filter layout checkmark. Defaults to => var(--lf-color-on-surface)",
      },
      {
        name: "--lf-chip-color-on-primary",
        docs: "Sets the color-on-primary color for the chip component. Defaults to => var(--lf-color-on-primary)",
      },
      {
        name: "--lf-chip-color-on-surface",
        docs: "Sets the color-on-surface color for the chip component. Defaults to => var(--lf-color-on-surface)",
      },
      {
        name: "--lf-chip-color-primary",
        docs: "Sets the color-primary color for the chip component. Defaults to => var(--lf-color-primary)",
      },
      {
        name: "--lf-chip-color-surface",
        docs: "Sets the color-surface color for the chip component. Defaults to => var(--lf-color-surface)",
      },
      {
        name: "--lf-chip-font-family",
        docs: "Sets the primary font family for the chip component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-chip-font-size",
        docs: "Sets the font size for the chip component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-chip-item-height",
        docs: "Sets the height for the items. Defaults to => 2em",
      },
      {
        name: "--lf-chip-item-margin",
        docs: "Sets the margin for the items. Defaults to => 0.25em",
      },
      {
        name: "--lf-chip-item-max-width",
        docs: "Sets the max-width for the items. Defaults to => max-content",
      },
      {
        name: "--lf-chip-item-outline",
        docs: "Sets the outline for the items. Defaults to => none",
      },
      {
        name: "--lf-chip-item-padding",
        docs: "Sets the padding for the items. Defaults to => 0 0.75em",
      },
      {
        name: "--lf-chip-item-text-decoration",
        docs: "Sets the text-decoration for the items. Defaults to => inherit",
      },
      {
        name: "--lf-chip-item-text-transform",
        docs: "Sets the text-transform for the items. Defaults to => inherit",
      },
      {
        name: "--lf-chip-margin",
        docs: "Sets the margin for the wrapper. Defaults to => 0.25em",
      },
    ],
  },
  "lf-code": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Retrieves the debug information reflecting the current state of the component.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves to a LfDebugLifecycleInfo object containing debug information.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfCodePropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfCodePropsInterface>",
      },
      {
        name: "refresh",
        docs: "Triggers a re-render of the component to reflect any state changes.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfFadeIn",
        docs: "Whether to fade in the component on mount.",
        type: "boolean",
      },
      {
        name: "lfFormat",
        docs: "",
        type: "boolean",
      },
      {
        name: "lfLanguage",
        docs: "Sets the language of the snippet.",
        type: "string",
      },
      {
        name: "lfPreserveSpaces",
        docs: "Whether to preserve spaces or not. When missing it is set automatically.",
        type: "boolean",
      },
      {
        name: "lfShowCopy",
        docs: "Whether to show the copy button or not.",
        type: "boolean",
      },
      {
        name: "lfShowHeader",
        docs: "Whether to show the header or not.",
        type: "boolean",
      },
      {
        name: "lfStickyHeader",
        docs: "Determines whether the header is sticky or not.",
        type: "boolean",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUiState",
        docs: "Reflects the specified state color defined by the theme.",
        type: '"danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"',
      },
      {
        name: "lfValue",
        docs: "String containing the snippet of code to display.",
        type: "string",
      },
    ],
    styles: [
      {
        name: "--lf-code-border-color",
        docs: "Sets the border color for the code component. Defaults to => var(--lf-color-border)",
      },
      {
        name: "--lf-code-border-radius",
        docs: "Sets the border radius for the code component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-code-border-right",
        docs: "Sets the border right for the code component. Defaults to => 1px solid var(--lf-color-border)",
      },
      {
        name: "--lf-code-border-top",
        docs: "Sets the border top for the code component. Defaults to => 1px solid var(--lf-color-border)",
      },
      {
        name: "--lf-code-color-on-bg",
        docs: "Sets the color-on-bg color for the code component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-code-color-on-primary",
        docs: "Sets the color-on-primary color for the code component. Defaults to => var(--lf-color-on-primary)",
      },
      {
        name: "--lf-code-color-on-surface",
        docs: "Sets the color-on-surface color for the code component. Defaults to => var(--lf-color-on-surface)",
      },
      {
        name: "--lf-code-color-primary",
        docs: "Sets the color-primary color for the code component. Defaults to => var(--lf-color-primary)",
      },
      {
        name: "--lf-code-color-surface",
        docs: "Sets the color-surface color for the code component. Defaults to => var(--lf-color-surface)",
      },
      {
        name: "--lf-code-font-family",
        docs: "Sets the primary font family for the code component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-code-font-size",
        docs: "Sets the font size for the code component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-code-header-position",
        docs: "Sets the position for the header. Defaults to => sticky",
      },
      {
        name: "--lf-code-height",
        docs: "Sets the height for the code component. Defaults to => 100%",
      },
    ],
  },
  "lf-compare": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfComparePropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfComparePropsInterface>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfDataset",
        docs: "The data set for the LF Chart component.\r\nThis property is mutable, meaning it can be changed after the component is initialized.",
        type: "LfDataDataset",
      },
      {
        name: "lfShape",
        docs: "Sets the type of shapes to compare.",
        type: '"badge" | "button" | "canvas" | "card" | "chart" | "chat" | "chip" | "code" | "image" | "number" | "photoframe" | "progressbar" | "slot" | "text" | "textfield" | "toggle" | "typewriter" | "upload"',
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfView",
        docs: "Sets the type of view, either styled as a before-after or a side-by-side comparison.",
        type: '"main" | "split"',
      },
    ],
    styles: [
      {
        name: "--lf-compare-border-color",
        docs: "Sets the border color for the compare component. Defaults to => var(--lf-color-border)",
      },
      {
        name: "--lf-compare-border-radius",
        docs: "Sets the border radius for the compare component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-compare-color-on-surface",
        docs: "Sets the color-on-surface color for the compare component. Defaults to => var(--lf-color-on-surface)",
      },
      {
        name: "--lf-compare-color-surface",
        docs: "Sets the color-surface color for the compare component. Defaults to => var(--lf-color-surface)",
      },
      {
        name: "--lf-compare-font-family",
        docs: "Sets the primary font family for the compare component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-compare-font-size",
        docs: "Sets the font size for the compare component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-compare-grid-template",
        docs: "Sets the grid template for the compare component. Defaults to => 0.75em",
      },
      {
        name: "--lf-compare-panel-height",
        docs: "Sets the height for the panel of the compare component. Defaults to => max-content",
      },
      {
        name: "--lf-compare-panel-max-height",
        docs: "Sets the max height for the panel of the compare component. Defaults to => 50%",
      },
      {
        name: "--lf-compare-panel-width",
        docs: "Sets the width for the panel of the compare component. Defaults to => 50%",
      },
      {
        name: "--lf-compare-panel-z-index",
        docs: "Sets the z index for the panel of the compare component. Defaults to => var(--lf-ui-zindex-portal)",
      },
      {
        name: "--lf-compare-slider-thickness",
        docs: "Sets the thickness for the slider of the compare component. Defaults to => 3px",
      },
      {
        name: "--lf-compare-toolbar-justify",
        docs: "Sets the justify for the toolbar of the compare component. Defaults to => space-between",
      },
    ],
  },
  "lf-drawer": {
    methods: [
      {
        name: "close",
        docs: "Closes the drawer component.\r\nUses requestAnimationFrame to ensure smooth animation and state update.\r\nDispatches a 'close' custom event when the drawer is closed.",
        returns: {
          type: "Promise<void>",
          docs: "Promise that resolves when the drawer closing animation is scheduled",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfDrawerPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfDrawerPropsInterface>",
      },
      {
        name: "isOpened",
        docs: "Returns the current open state of the drawer.",
        returns: {
          type: "Promise<boolean>",
          docs: "A promise that resolves to a boolean indicating if the drawer is open (true) or closed (false)",
        },
        signature: "() => Promise<boolean>",
      },
      {
        name: "open",
        docs: "Opens the drawer.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "toggle",
        docs: "Toggles the drawer state between opened and closed.\r\nIf the drawer is currently opened, it will be closed.\r\nIf the drawer is currently closed, it will be opened.",
        returns: {
          type: "Promise<void>",
          docs: "A promise that resolves when the toggle operation is complete",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfDisplay",
        docs: "The display mode of the drawer.",
        type: '"dock" | "slide"',
      },
      {
        name: "lfPosition",
        docs: "The position of the drawer on the screen.",
        type: '"left" | "right"',
      },
      {
        name: "lfResponsive",
        docs: 'A number representing a screen-width breakpoint for responsiveness.\r\nIf set to 0 (or negative), no responsiveness is applied, and `lfDisplay` remains what you set.\r\nIf > 0, the drawer will switch to `"dock"` if `window.innerWidth >= lfResponsive`,\r\notherwise `"slide"`.',
        type: "number",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfValue",
        docs: "Indicates if the drawer is open.",
        type: "boolean",
      },
    ],
    styles: [
      {
        name: "--lf-drawer-border",
        docs: "Sets the border for the drawer component. Defaults to => 1px solid 1px solid rgba(var(--lf-color-border), 0.75)",
      },
      {
        name: "--lf-drawer-border-radius",
        docs: "Sets the border radius for the drawer component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-drawer-color-drawer",
        docs: "Sets the color-drawer color for the drawer component. Defaults to => var(--lf-color-drawer)",
      },
      {
        name: "--lf-drawer-color-on-drawer",
        docs: "Sets the color-on-drawer color for the drawer component. Defaults to => var(--lf-color-on-drawer)",
      },
      {
        name: "--lf-drawer-font-family",
        docs: "Sets the primary font family for the drawer component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-drawer-font-size",
        docs: "Sets the font size for the drawer component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-drawer-left-box-shadow",
        docs: "Sets the box-shadow for the left side of the drawer component. Defaults to => 4px 0 10px -2px rgba(var(--lf-color-on-drawer), 0.2), 8px 0 16px 2px rgba(var(--lf-color-on-drawer), 0.14), 2px 0 20px 5px rgba(var(--lf-color-on-drawer), 0.14)",
      },
      {
        name: "--lf-drawer-right-box-shadow",
        docs: "Sets the box-shadow for the right side of the drawer component. Defaults to => -4px 0 10px -2px rgba(var(--lf-color-on-drawer), 0.2), -8px 0 16px 2px rgba(var(--lf-color-on-drawer), 0.14), -2px 0 20px 5px rgba(var(--lf-color-on-drawer), 0.14)",
      },
    ],
  },
  "lf-header": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfHeaderPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfHeaderPropsInterface>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
    ],
    styles: [
      {
        name: "--lf-header-border-radius",
        docs: "Sets the border radius for the header component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-header-color-header",
        docs: "Sets the color-header color for the header component. Defaults to => var(--lf-color-header)",
      },
      {
        name: "--lf-header-color-on-header",
        docs: "Sets the color-on-header color for the header component. Defaults to => var(--lf-color-on-header)",
      },
      {
        name: "--lf-header-font-family",
        docs: "Sets the primary font family for the header component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-header-font-size",
        docs: "Sets the font size for the header component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-header-justify",
        docs: "Sets the justify for the header component. Defaults to => space-between",
      },
      {
        name: "--lf-header-padding",
        docs: "Sets the padding for the header component. Defaults to => 0.5em 0.75em",
      },
    ],
  },
  "lf-image": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getImage",
        docs: "Retrieves the underlying HTMLImageElement used to display the image.",
        returns: {
          type: "Promise<SVGElement | HTMLImageElement>",
          docs: "A promise that resolves with the image element, or null if not available.",
        },
        signature: "() => Promise<HTMLImageElement | SVGElement | null>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfImagePropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfImagePropsInterface>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfHtmlAttributes",
        docs: "Allows customization of the image element.\r\nThis can include attributes like 'alt', 'aria-', etc., to further customize the behavior or appearance of the input.",
        type: '{ lfImageProps?: any; lfLabel?: any; lfPosition?: any; lfStyle?: any; lfUiSize?: any; lfUiState?: any; lfAriaLabel?: any; lfDataset?: any; lfIcon?: any; lfIconOff?: any; lfRipple?: any; lfShowSpinner?: any; lfStretchX?: any; lfStretchY?: any; lfStyling?: any; lfToggable?: any; lfTrailingIcon?: any; lfType?: any; lfValue?: any; lfBrush?: any; lfColor?: any; lfCursor?: any; lfOpacity?: any; lfPreview?: any; lfSize?: any; lfStrokeTolerance?: any; lfLayout?: any; lfSizeX?: any; lfSizeY?: any; lfAxis?: any; lfColors?: any; lfLegend?: any; lfSeries?: any; lfTypes?: any; lfXAxis?: any; lfYAxis?: any; lfConfig?: any; lfAttachmentUploadTimeout?: any; lfContextWindow?: any; lfEmpty?: any; lfEndpointUrl?: any; lfFrequencyPenalty?: any; lfMaxTokens?: any; lfPollingInterval?: any; lfPresencePenalty?: any; lfSeed?: any; lfSystem?: any; lfTemperature?: any; lfTools?: any; lfTopP?: any; lfUploadCallback?: any; lfFlat?: any; lfFadeIn?: any; lfFormat?: any; lfLanguage?: any; lfPreserveSpaces?: any; lfShowCopy?: any; lfShowHeader?: any; lfStickyHeader?: any; lfHtmlAttributes?: any; lfMode?: any; lfOverlay?: any; lfPlaceholder?: any; lfThreshold?: any; lfAnimated?: any; lfCenteredLabel?: any; lfIsRadial?: any; lfFormatJSON?: any; lfHelper?: any; lfTrailingIconAction?: any; lfLeadingLabel?: any; lfDeleteSpeed?: any; lfLoop?: any; lfPause?: any; lfSpeed?: any; lfTag?: any; lfUpdatable?: any; disabled?: any; lfAllowFreeInput?: any; lfCache?: any; lfCacheTTL?: any; lfDebounceMs?: any; lfListProps?: any; lfMaxCacheSize?: any; lfMinChars?: any; lfNavigation?: any; lfSpinnerProps?: any; lfTextfieldProps?: any; lfAutoPlay?: any; lfInterval?: any; lfLightbox?: any; lfShape?: any; lfView?: any; lfDisplay?: any; lfResponsive?: any; lfLoadCallback?: any; lfEnableDeletions?: any; lfFilter?: any; lfSelectable?: any; lfActions?: any; lfCollapseColumns?: any; lfColumns?: any; lfAutosave?: any; lfProps?: any; lfTrigger?: any; lfOrientation?: any; lfMax?: any; lfMin?: any; lfStep?: any; lfActive?: any; lfBarVariant?: any; lfDimensions?: any; lfFader?: any; lfFaderTimeout?: any; lfFullScreen?: any; lfTimeout?: any; lfCloseCallback?: any; lfCloseIcon?: any; lfMessage?: any; lfTimer?: any; lfAccordionLayout?: any; lfExpandedNodeIds?: any; lfInitialExpansionDepth?: any; lfGrid?: any; lfSelectedNodeIds?: any; value?: any; htmlProps?: any; accept?: any; "accept-charset"?: any; alt?: any; autocomplete?: any; autofocus?: any; checked?: any; class?: any; dataset?: any; href?: any; id?: any; max?: any; maxLength?: any; min?: any; minLength?: any; multiple?: any; name?: any; placeholder?: any; readonly?: any; role?: any; src?: any; srcset?: any; step?: any; title?: any; type?: any; "aria-"?: any; "data-"?: any; }',
      },
      {
        name: "lfMode",
        docs: "Rendering mode for non-URL values: sprite (default) or mask (legacy).",
        type: '"mask" | "sprite"',
      },
      {
        name: "lfShowSpinner",
        docs: "Controls the display of a loading indicator.\r\nWhen enabled, a spinner is shown until the image finishes loading.\r\nThis property is not compatible with SVG images.",
        type: "boolean",
      },
      {
        name: "lfSizeX",
        docs: "Sets the width of the icon.\r\nThis property accepts any valid CSS measurement value (e.g., px, %, vh, etc.) and defaults to 100%.",
        type: "string",
      },
      {
        name: "lfSizeY",
        docs: "Sets the height of the icon.\r\nThis property accepts any valid CSS measurement value (e.g., px, %, vh, etc.) and defaults to 100%.",
        type: "string",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfUiState",
        docs: "Reflects the specified state color defined by the theme.",
        type: '"danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"',
      },
      {
        name: "lfValue",
        docs: "Defines the source URL of the image.\r\nThis property is used to set the image resource that the component should display.",
        type: "string",
      },
    ],
    styles: [
      {
        name: "--lf-image-aspect-ratio",
        docs: "Sets the aspect ratio for the icons. Defaults to => 1",
      },
      {
        name: "--lf-image-color-primary",
        docs: "Sets the color-primary color for the image component. Defaults to => var(--lf-color-primary)",
      },
      {
        name: "--lf-image-font-family",
        docs: "Sets the primary font family for the image component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-image-font-size",
        docs: "Sets the font size for the image component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-image-margin",
        docs: "Sets the margin for the image component. Defaults to => auto",
      },
      {
        name: "--lf-image-object-fit",
        docs: "Sets the object fit for the image element. Defaults to => cover",
      },
    ],
  },
  "lf-imageviewer": {
    methods: [
      {
        name: "addSnapshot",
        docs: "Appends a new snapshot to the current shape's history by duplicating it with an updated value.\r\nIt has no effect when the current shape is not set.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(value: string) => Promise<void>",
      },
      {
        name: "clearHistory",
        docs: "Clears the history related to the shape identified by the index.\r\nWhen index is not provided, it clear the full history.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(index?: number) => Promise<void>",
      },
      {
        name: "clearSelection",
        docs: "Clears the currently selected shape.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "getComponents",
        docs: "This method is used to retrieve the references to the subcomponents.",
        returns: {
          type: "Promise<LfImageviewerAdapterRefs>",
          docs: "",
        },
        signature: "() => Promise<LfImageviewerAdapterRefs>",
      },
      {
        name: "getCurrentSnapshot",
        docs: "Fetches the current snapshot.",
        returns: {
          type: "Promise<{ shape: LfMasonrySelectedShape; value: string; }>",
          docs: "A promise that resolves with the current snapshot's object.",
        },
        signature:
          "() => Promise<{ shape: LfMasonrySelectedShape; value: string; }>",
      },
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfImageviewerPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfImageviewerPropsInterface>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "reset",
        docs: "Clears the full history and clears the current selection.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "setSpinnerStatus",
        docs: "Displays/hides the spinner over the preview.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(status: boolean) => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfDataset",
        docs: "The data set for the LF Imageviewer component.\r\nThis property is mutable, meaning it can be changed after the component is initialized.",
        type: "LfDataDataset",
      },
      {
        name: "lfLoadCallback",
        docs: "Callback invoked when the load button is clicked.",
        type: "(imageviewer: LfImageviewerInterface, dir: string) => Promise<void>",
      },
      {
        name: "lfNavigation",
        docs: "Configuration options for the navigation panel.",
        type: "LfImageviewerNavigation",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfValue",
        docs: "Configuration parameters of the detail view.",
        type: "LfDataDataset",
      },
    ],
    styles: [
      {
        name: "--lf-imageviewer-border-color",
        docs: "Sets the border color for the imageviewer component. Defaults to => var(--lf-color-border)",
      },
      {
        name: "--lf-imageviewer-border-radius",
        docs: "Sets the border radius for the imageviewer component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-imageviewer-color-bg",
        docs: "Sets the color-bg color for the imageviewer component. Defaults to => var(--lf-color-bg)",
      },
      {
        name: "--lf-imageviewer-color-on-bg",
        docs: "Sets the color-on-bg color for the imageviewer component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-imageviewer-font-family",
        docs: "Sets the primary font family for the imageviewer component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-imageviewer-font-size",
        docs: "Sets the font size for the imageviewer component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-imageviewer-nav-width",
        docs: "Sets the width for the navigation panel. Defaults to => auto",
      },
    ],
  },
  "lf-list": {
    methods: [
      {
        name: "applyFilter",
        docs: "Applies a filter value immediately (for testing compatibility).",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(value: string) => Promise<void>",
      },
      {
        name: "focusNext",
        docs: "Moves focus to the next item in the list.\r\nIf no item is currently focused, focuses the selected item.\r\nIf the last item is focused, wraps around to the first item.",
        returns: {
          type: "Promise<void>",
          docs: "A promise that resolves when the focus operation is complete",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "focusPrevious",
        docs: "Focuses the previous item in the list.\r\nIf no item is currently focused, it focuses the selected item.\r\nIf focused item is the first one, it wraps around to the last item.",
        returns: {
          type: "Promise<void>",
          docs: "Promise that resolves when the focus operation is complete",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfListPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfListPropsInterface>",
      },
      {
        name: "getSelected",
        docs: "Retrieves the currently selected node from the list.",
        returns: {
          type: "Promise<LfDataNode>",
          docs: "A Promise that resolves to the selected LfDataNode object.",
        },
        signature: "() => Promise<LfDataNode>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "selectNode",
        docs: "Selects a node in the list at the specified index.\r\nIf no index is provided, selects the currently focused node.",
        returns: {
          type: "Promise<void>",
          docs: "A promise that resolves when the selection is complete.",
        },
        signature: "(index?: number) => Promise<void>",
      },
      {
        name: "selectNodeById",
        docs: "Selects a node in the list by its ID.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(id: string) => Promise<void>",
      },
      {
        name: "setFilter",
        docs: "Sets the filter value and updates the filter input field.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(value: string) => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfDataset",
        docs: "The data set for the LF List component.\r\nThis property is mutable, meaning it can be changed after the component is initialized.",
        type: "LfDataDataset",
      },
      {
        name: "lfEmpty",
        docs: "Empty text displayed when there is no data.",
        type: "string",
      },
      {
        name: "lfEnableDeletions",
        docs: "Defines whether items can be removed from the list or not.",
        type: "boolean",
      },
      {
        name: "lfFilter",
        docs: "When true, displays a filter text field above the list items for searching.",
        type: "boolean",
      },
      {
        name: "lfNavigation",
        docs: "When true, enables items' navigation through arrow keys.",
        type: "boolean",
      },
      {
        name: "lfRipple",
        docs: "When set to true, the pointerdown event will trigger a ripple effect.",
        type: "boolean",
      },
      {
        name: "lfSelectable",
        docs: "Defines whether items are selectable or not.",
        type: "boolean",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUiState",
        docs: "Reflects the specified state color defined by the theme.",
        type: '"danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"',
      },
      {
        name: "lfValue",
        docs: "Sets the initial state of the list.\r\nRelevant only when the list can be selected.",
        type: "number",
      },
    ],
    styles: [
      {
        name: "--lf-list-border-color",
        docs: "Sets the border color for the list component. Defaults to => var(--lf-color-border)",
      },
      {
        name: "--lf-list-border-radius",
        docs: "Sets the border radius for the list component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-list-color-bg",
        docs: "Sets the color-bg color for the list component. Defaults to => var(--lf-color-bg)",
      },
      {
        name: "--lf-list-color-danger",
        docs: "Sets the color-danger color for the list component. Defaults to => var(--lf-color-danger)",
      },
      {
        name: "--lf-list-color-on-bg",
        docs: "Sets the color-on-bg color for the list component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-list-color-on-danger",
        docs: "Sets the color-on-danger color for the list component. Defaults to => var(--lf-color-on-danger)",
      },
      {
        name: "--lf-list-color-on-surface",
        docs: "Sets the color-on-surface color for the list component. Defaults to => var(--lf-color-on-surface)",
      },
      {
        name: "--lf-list-color-primary",
        docs: "Sets the color-primary color for the list component. Defaults to => var(--lf-color-primary)",
      },
      {
        name: "--lf-list-color-surface",
        docs: "Sets the color-surface color for the list component. Defaults to => var(--lf-color-surface)",
      },
      {
        name: "--lf-list-font-family",
        docs: "Sets the primary font family for the list component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-list-font-size",
        docs: "Sets the font size for the list component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-list-item-height",
        docs: "Sets the height for the item of the list component. Defaults to => 2.5em",
      },
      {
        name: "--lf-list-item-padding",
        docs: "Sets the padding for the item of the list component. Defaults to => 0 0.75em",
      },
      {
        name: "--lf-list-item-with-description-height",
        docs: "Sets the height for the item with description of the list component. Defaults to => 3.6em",
      },
    ],
  },
  "lf-masonry": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfMasonryPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfMasonryPropsInterface>",
      },
      {
        name: "getSelectedShape",
        docs: "Returns the selected shape.",
        returns: {
          type: "Promise<LfMasonrySelectedShape>",
          docs: "Selected shape.",
        },
        signature: "() => Promise<LfMasonrySelectedShape>",
      },
      {
        name: "redecorateShapes",
        docs: "Redecorates the shapes, updating potential new values.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "setSelectedShape",
        docs: "Sets the selected shape by index.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(index: number) => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfActions",
        docs: "When true displays floating buttons to customize the view.",
        type: "boolean",
      },
      {
        name: "lfCollapseColumns",
        docs: "When true the masonry will collapse the number of columns to the number of items\r\nwhen the number of items is less than the configured columns. Set to false to\r\npreserve the configured column count even if there are fewer items.",
        type: "boolean",
      },
      {
        name: "lfColumns",
        docs: "Number of columns of the masonry, doesn't affect sequential views.\r\nCan be set with a number or an array of numbers that identify each breakpoint.",
        type: "number | number[]",
      },
      {
        name: "lfDataset",
        docs: "Actual data of the masonry.",
        type: "LfDataDataset",
      },
      {
        name: "lfSelectable",
        docs: "Allows for the selection of elements.",
        type: "boolean",
      },
      {
        name: "lfShape",
        docs: "Sets the type of shapes to compare.",
        type: '"badge" | "button" | "canvas" | "card" | "chart" | "chat" | "chip" | "code" | "image" | "number" | "photoframe" | "progressbar" | "slot" | "text" | "textfield" | "toggle" | "typewriter" | "upload"',
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfView",
        docs: "Sets the type of view, either the actual masonry or a sequential view.",
        type: '"horizontal" | "main" | "vertical"',
      },
    ],
    styles: [
      {
        name: "--lf-masonry-actions-backdrop",
        docs: "Sets the backdrop filter for the actions of the masonry component. Defaults to => blur(10px)",
      },
      {
        name: "--lf-masonry-actions-background",
        docs: "Sets the background for the actions of the masonry component. Defaults to => rgba(var(--lf-color-surface), 0.75)",
      },
      {
        name: "--lf-masonry-actions-border-radius",
        docs: "Sets the border radius for the actions of the masonry component. Defaults to => 50px",
      },
      {
        name: "--lf-masonry-actions-margin",
        docs: "Sets the margin for the actions of the masonry component. Defaults to => 0 0.5em 0.5em 0",
      },
      {
        name: "--lf-masonry-actions-padding",
        docs: "Sets the padding for the actions of the masonry component. Defaults to => 0.75em",
      },
      {
        name: "--lf-masonry-actions-z-index",
        docs: "Sets the z index for the actions of the masonry component. Defaults to => 2",
      },
      {
        name: "--lf-masonry-button-bottom",
        docs: "Sets the bottom for the button of the masonry component. Defaults to => 1em",
      },
      {
        name: "--lf-masonry-button-right",
        docs: "Sets the right for the button of the masonry component. Defaults to => 1em",
      },
      {
        name: "--lf-masonry-column-size",
        docs: "Sets the column size for the grid of the masonry component. Defaults to => minmax(0px, 1fr)",
      },
      {
        name: "--lf-masonry-font-family",
        docs: "Sets the primary font family for the masonry component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-masonry-font-size",
        docs: "Sets the font size for the masonry component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-masonry-grid-gap",
        docs: "Sets the gap for the grid of the masonry component. Defaults to => 0.5em",
      },
      {
        name: "--lf-masonry-grid-gap-actions",
        docs: "Sets the gap for the actions of the masonry component. Defaults to => 0.5em",
      },
      {
        name: "--lf-masonry-grid-gap-actions-sub",
        docs: "Sets the gap for the actions sub of the masonry component. Defaults to => 0.25em",
      },
      {
        name: "--lf-masonry-grid-items-alignment",
        docs: "Sets the items alignment for the grid of the masonry component. Defaults to => start",
      },
      {
        name: "--lf-masonry-padding",
        docs: "Sets the padding for the grid of the masonry component. Defaults to => 0.75em",
      },
      {
        name: "--lf-masonry-selected-border",
        docs: "Sets the border for the selected image of the masonry component. Defaults to => 1px solid rgba(var(--lf-color-secondary, 0.875))",
      },
      {
        name: "--lf-masonry-selected-filter",
        docs: "Sets the filter for the selected image of the masonry component. Defaults to => brightness(110%) drop-shadow(0 0 0.5em rgb(var(--lf-color-secondary)))",
      },
    ],
  },
  "lf-messenger": {
    methods: [
      {
        name: "deleteOption",
        docs: "Removes a specific child node from the messenger's image structure.",
        returns: {
          type: "Promise<void>",
          docs: "A Promise that resolves when the deletion is complete",
        },
        signature:
          "(node: LfMessengerBaseChildNode<LfMessengerUnionChildIds>, type: LfMessengerImageTypes) => Promise<void>",
      },
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfMessengerPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfMessengerPropsInterface>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "reset",
        docs: "Resets the messenger component to its initial state.\r\nClears covers, current character, and message history.\r\nReinitializes the component.",
        returns: {
          type: "Promise<void>",
          docs: "A promise that resolves when the reset is complete",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "save",
        docs: "Asynchronously saves the current messenger state.",
        returns: {
          type: "Promise<void>",
          docs: "A Promise that resolves when the save operation is complete.",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfAutosave",
        docs: "Automatically saves the dataset when a chat updates.",
        type: "boolean",
      },
      {
        name: "lfDataset",
        docs: "The data set for the LF List component.\r\nThis property is mutable, meaning it can be changed after the component is initialized.",
        type: "LfMessengerDataset",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfValue",
        docs: "Sets the initial configuration, including active character and filters.",
        type: "LfMessengerConfig",
      },
    ],
    styles: [
      {
        name: "--lf-messenger-active-options-name-padding",
        docs: "Sets the padding for the name of the active options of the messenger component. Defaults to => 0.5em",
      },
      {
        name: "--lf-messenger-avatar-name-padding",
        docs: "Sets the padding for the name of the character. Defaults to => 0.5em",
      },
      {
        name: "--lf-messenger-color-danger",
        docs: "Sets the color-danger color for the messenger component. Defaults to => var(--lf-color-danger)",
      },
      {
        name: "--lf-messenger-color-on-danger",
        docs: "Sets the color-on-danger color for the messenger component. Defaults to => var(--lf-color-on-danger)",
      },
      {
        name: "--lf-messenger-color-on-success",
        docs: "Sets the color-on-success color for the messenger component. Defaults to => var(--lf-color-on-success)",
      },
      {
        name: "--lf-messenger-color-on-surface",
        docs: "Sets the color-on-surface color for the messenger component. Defaults to => var(--lf-color-on-surface)",
      },
      {
        name: "--lf-messenger-color-success",
        docs: "Sets the color-success color for the messenger component. Defaults to => var(--lf-color-success)",
      },
      {
        name: "--lf-messenger-color-surface",
        docs: "Sets the color-surface color for the messenger component. Defaults to => var(--lf-color-surface)",
      },
      {
        name: "--lf-messenger-customization-title-padding",
        docs: "Sets the padding for the title of the customization panel. Defaults to => 0.5em",
      },
      {
        name: "--lf-messenger-font-family",
        docs: "Sets the primary font family for the messenger component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-messenger-font-size",
        docs: "Sets the font size for the messenger component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-messenger-name-background-color",
        docs: "Sets the background color for the name of the messenger component's option. Defaults to => rgb(var(--lf-color-surface))",
      },
      {
        name: "--lf-messenger-name-height",
        docs: "Sets the height for the name of the character. Defaults to => 3em",
      },
      {
        name: "--lf-messenger-portrait-foredrop-color",
        docs: "Sets the color for the foredrop of the portrait. Defaults to => rgba(var(--lf-color-bg), 0.275)",
      },
    ],
  },
  "lf-photoframe": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfPhotoframePropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfPhotoframePropsInterface>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfOverlay",
        docs: "When not empty, this text will be overlayed on the photo - blocking the view.",
        type: "LfPhotoframeOverlay",
      },
      {
        name: "lfPlaceholder",
        docs: "Html attributes of the picture before the component enters the viewport.",
        type: '{ lfImageProps?: any; lfLabel?: any; lfPosition?: any; lfStyle?: any; lfUiSize?: any; lfUiState?: any; lfAriaLabel?: any; lfDataset?: any; lfIcon?: any; lfIconOff?: any; lfRipple?: any; lfShowSpinner?: any; lfStretchX?: any; lfStretchY?: any; lfStyling?: any; lfToggable?: any; lfTrailingIcon?: any; lfType?: any; lfValue?: any; lfBrush?: any; lfColor?: any; lfCursor?: any; lfOpacity?: any; lfPreview?: any; lfSize?: any; lfStrokeTolerance?: any; lfLayout?: any; lfSizeX?: any; lfSizeY?: any; lfAxis?: any; lfColors?: any; lfLegend?: any; lfSeries?: any; lfTypes?: any; lfXAxis?: any; lfYAxis?: any; lfConfig?: any; lfAttachmentUploadTimeout?: any; lfContextWindow?: any; lfEmpty?: any; lfEndpointUrl?: any; lfFrequencyPenalty?: any; lfMaxTokens?: any; lfPollingInterval?: any; lfPresencePenalty?: any; lfSeed?: any; lfSystem?: any; lfTemperature?: any; lfTools?: any; lfTopP?: any; lfUploadCallback?: any; lfFlat?: any; lfFadeIn?: any; lfFormat?: any; lfLanguage?: any; lfPreserveSpaces?: any; lfShowCopy?: any; lfShowHeader?: any; lfStickyHeader?: any; lfHtmlAttributes?: any; lfMode?: any; lfOverlay?: any; lfPlaceholder?: any; lfThreshold?: any; lfAnimated?: any; lfCenteredLabel?: any; lfIsRadial?: any; lfFormatJSON?: any; lfHelper?: any; lfTrailingIconAction?: any; lfLeadingLabel?: any; lfDeleteSpeed?: any; lfLoop?: any; lfPause?: any; lfSpeed?: any; lfTag?: any; lfUpdatable?: any; disabled?: any; lfAllowFreeInput?: any; lfCache?: any; lfCacheTTL?: any; lfDebounceMs?: any; lfListProps?: any; lfMaxCacheSize?: any; lfMinChars?: any; lfNavigation?: any; lfSpinnerProps?: any; lfTextfieldProps?: any; lfAutoPlay?: any; lfInterval?: any; lfLightbox?: any; lfShape?: any; lfView?: any; lfDisplay?: any; lfResponsive?: any; lfLoadCallback?: any; lfEnableDeletions?: any; lfFilter?: any; lfSelectable?: any; lfActions?: any; lfCollapseColumns?: any; lfColumns?: any; lfAutosave?: any; lfProps?: any; lfTrigger?: any; lfOrientation?: any; lfMax?: any; lfMin?: any; lfStep?: any; lfActive?: any; lfBarVariant?: any; lfDimensions?: any; lfFader?: any; lfFaderTimeout?: any; lfFullScreen?: any; lfTimeout?: any; lfCloseCallback?: any; lfCloseIcon?: any; lfMessage?: any; lfTimer?: any; lfAccordionLayout?: any; lfExpandedNodeIds?: any; lfInitialExpansionDepth?: any; lfGrid?: any; lfSelectedNodeIds?: any; value?: any; htmlProps?: any; accept?: any; "accept-charset"?: any; alt?: any; autocomplete?: any; autofocus?: any; checked?: any; class?: any; dataset?: any; href?: any; id?: any; max?: any; maxLength?: any; min?: any; minLength?: any; multiple?: any; name?: any; placeholder?: any; readonly?: any; role?: any; src?: any; srcset?: any; step?: any; title?: any; type?: any; "aria-"?: any; "data-"?: any; }',
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfThreshold",
        docs: "Percentage of the component dimensions entering the viewport (0.1 => 1).",
        type: "number",
      },
      {
        name: "lfValue",
        docs: "Html attributes of the picture after the component enters the viewport.",
        type: '{ lfImageProps?: any; lfLabel?: any; lfPosition?: any; lfStyle?: any; lfUiSize?: any; lfUiState?: any; lfAriaLabel?: any; lfDataset?: any; lfIcon?: any; lfIconOff?: any; lfRipple?: any; lfShowSpinner?: any; lfStretchX?: any; lfStretchY?: any; lfStyling?: any; lfToggable?: any; lfTrailingIcon?: any; lfType?: any; lfValue?: any; lfBrush?: any; lfColor?: any; lfCursor?: any; lfOpacity?: any; lfPreview?: any; lfSize?: any; lfStrokeTolerance?: any; lfLayout?: any; lfSizeX?: any; lfSizeY?: any; lfAxis?: any; lfColors?: any; lfLegend?: any; lfSeries?: any; lfTypes?: any; lfXAxis?: any; lfYAxis?: any; lfConfig?: any; lfAttachmentUploadTimeout?: any; lfContextWindow?: any; lfEmpty?: any; lfEndpointUrl?: any; lfFrequencyPenalty?: any; lfMaxTokens?: any; lfPollingInterval?: any; lfPresencePenalty?: any; lfSeed?: any; lfSystem?: any; lfTemperature?: any; lfTools?: any; lfTopP?: any; lfUploadCallback?: any; lfFlat?: any; lfFadeIn?: any; lfFormat?: any; lfLanguage?: any; lfPreserveSpaces?: any; lfShowCopy?: any; lfShowHeader?: any; lfStickyHeader?: any; lfHtmlAttributes?: any; lfMode?: any; lfOverlay?: any; lfPlaceholder?: any; lfThreshold?: any; lfAnimated?: any; lfCenteredLabel?: any; lfIsRadial?: any; lfFormatJSON?: any; lfHelper?: any; lfTrailingIconAction?: any; lfLeadingLabel?: any; lfDeleteSpeed?: any; lfLoop?: any; lfPause?: any; lfSpeed?: any; lfTag?: any; lfUpdatable?: any; disabled?: any; lfAllowFreeInput?: any; lfCache?: any; lfCacheTTL?: any; lfDebounceMs?: any; lfListProps?: any; lfMaxCacheSize?: any; lfMinChars?: any; lfNavigation?: any; lfSpinnerProps?: any; lfTextfieldProps?: any; lfAutoPlay?: any; lfInterval?: any; lfLightbox?: any; lfShape?: any; lfView?: any; lfDisplay?: any; lfResponsive?: any; lfLoadCallback?: any; lfEnableDeletions?: any; lfFilter?: any; lfSelectable?: any; lfActions?: any; lfCollapseColumns?: any; lfColumns?: any; lfAutosave?: any; lfProps?: any; lfTrigger?: any; lfOrientation?: any; lfMax?: any; lfMin?: any; lfStep?: any; lfActive?: any; lfBarVariant?: any; lfDimensions?: any; lfFader?: any; lfFaderTimeout?: any; lfFullScreen?: any; lfTimeout?: any; lfCloseCallback?: any; lfCloseIcon?: any; lfMessage?: any; lfTimer?: any; lfAccordionLayout?: any; lfExpandedNodeIds?: any; lfInitialExpansionDepth?: any; lfGrid?: any; lfSelectedNodeIds?: any; value?: any; htmlProps?: any; accept?: any; "accept-charset"?: any; alt?: any; autocomplete?: any; autofocus?: any; checked?: any; class?: any; dataset?: any; href?: any; id?: any; max?: any; maxLength?: any; min?: any; minLength?: any; multiple?: any; name?: any; placeholder?: any; readonly?: any; role?: any; src?: any; srcset?: any; step?: any; title?: any; type?: any; "aria-"?: any; "data-"?: any; }',
      },
    ],
    styles: [
      {
        name: "--lf-photoframe-color-bg",
        docs: "Sets the color-bg color for the photoframe component. Defaults to => var(--lf-color-bg)",
      },
      {
        name: "--lf-photoframe-color-on-bg",
        docs: "Sets the color-on-bg color for the photoframe component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-photoframe-fade-out-time",
        docs: "Sets the fade out time for the placeholder of the photoframe component. Defaults to => 1750ms",
      },
      {
        name: "--lf-photoframe-font-family",
        docs: "Sets the primary font family for the photoframe component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-photoframe-font-size",
        docs: "Sets the font size for the photoframe component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-photoframe-image-fit",
        docs: "Sets the object fit for the image of the photoframe component. Defaults to => cover",
      },
      {
        name: "--lf-photoframe-overlay-zindex",
        docs: "Sets the z-index for the overlay of the photoframe component. Defaults to => 2",
      },
      {
        name: "--lf-photoframe-placeholder-fit",
        docs: "Sets the object fit for the placeholder of the photoframe component. Defaults to => cover",
      },
    ],
  },
  "lf-placeholder": {
    methods: [
      {
        name: "getComponent",
        docs: "Returns the HTMLElement of the component to placeholder load.",
        returns: {
          type: "Promise<LfComponentRootElement>",
          docs: "Placeholder loaded component.",
        },
        signature: "() => Promise<LfComponentRootElement>",
      },
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfPlaceholderPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfPlaceholderPropsInterface>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfIcon",
        docs: "Displays an animated SVG placeholder until the component is loaded.",
        type: '"code" | "upload" | "id" | "ai" | "article" | "brush" | "bug" | "camera" | "check" | "checkbox" | "copy" | "door" | "download" | "droplet" | "edit" | "file" | "folder" | "forms" | "help" | "highlight" | "history" | "home" | "hourglass" | "ikosaedr" | "json" | "key" | "link" | "list" | "loader" | "lock" | "messages" | "microphone" | "moon" | "movie" | "music" | "network" | "notification" | "numbers" | "palette" | "pdf" | "photo" | "progress" | "refresh" | "replace" | "robot" | "schema" | "select" | "search" | "send" | "settings" | "shirt" | "slideshow" | "temperature" | "template" | "wand" | "writing" | "x" | "zip" | "adjustments-horizontal" | "alert-triangle" | "arrow-autofit-content" | "arrow-back" | "bell-ringing" | "brand-facebook" | "brand-github" | "brand-github-copilot" | "brand-instagram" | "brand-linkedin" | "brand-npm" | "brand-reddit" | "brand-x" | "calendar-clock" | "camera-ai" | "caret-down" | "caret-left" | "caret-right" | "caret-up" | "chart-column" | "chart-histogram" | "chevron-compact-down" | "chevron-compact-left" | "chevron-compact-right" | "chevron-compact-up" | "chevron-down" | "chevron-left" | "chevron-right" | "chevrons-down" | "chevrons-left" | "chevrons-right" | "chevrons-up" | "chevron-up" | "circle-arrow-down" | "circle-arrow-left" | "circle-arrow-right" | "circle-arrow-up" | "circle-caret-down" | "circle-caret-left" | "circle-caret-right" | "circle-caret-up" | "circle-chevron-down" | "circle-chevron-left" | "circle-chevron-right" | "circle-chevron-up" | "circle-x" | "code-circle-2" | "color-swatch" | "columns-2" | "contrast-2" | "copy-check" | "drag-drop" | "exclamation-circle" | "filter-search" | "folder-open" | "hexagon-alert" | "hexagon-info" | "hexagon-minus" | "hexagon-minus-2" | "hexagon-photo" | "hexagon-plus" | "hexagon-plus-2" | "hourglass-low" | "image-in-picture" | "inner-shadow-bottom" | "input-search" | "layout-board-split" | "layout-list" | "layout-navbar" | "layout-navbar-inactive" | "layout-sidebar" | "lf-signature" | "lf-website" | "link-plus" | "list-tree" | "loader-2" | "loader-3" | "menu-2" | "message-circle-user" | "off-brush" | "off-hexagon" | "off-highlight" | "off-id" | "off-microphone" | "off-moon" | "off-notification" | "off-palette" | "off-replace" | "off-search" | "off-send" | "off-template" | "percentage-60" | "photo-search" | "photo-x" | "player-record" | "player-stop" | "playstation-circle" | "playstation-square" | "playstation-triangle" | "playstation-x" | "share-2" | "square-toggle" | "square-x" | "stack-pop" | "stack-push" | "stopwatch" | "sunset-2" | "terminal-2" | "time-duration-30" | "toggle-right" | "viewport-tall" | "viewport-wide"',
      },
      {
        name: "lfProps",
        docs: "Sets the props of the component to be placeholder loaded.",
        type: "LfBadgePropsInterface | LfButtonPropsInterface | LfCanvasPropsInterface | LfCardPropsInterface | LfChartPropsInterface | LfChatPropsInterface | LfChipPropsInterface | LfCodePropsInterface | LfImagePropsInterface | LfPhotoframePropsInterface | LfProgressbarPropsInterface | LfTextfieldPropsInterface | LfTogglePropsInterface | LfTypewriterPropsInterface | LfUploadPropsInterface | LfAccordionPropsInterface | LfArticlePropsInterface | LfAutocompletePropsInterface | LfCarouselPropsInterface | LfCheckboxPropsInterface | LfComparePropsInterface | LfDrawerPropsInterface | LfHeaderPropsInterface | LfImageviewerPropsInterface | LfListPropsInterface | LfMasonryPropsInterface | LfMessengerPropsInterface | LfPlaceholderPropsInterface | LfRadioPropsInterface | LfSelectPropsInterface | LfSliderPropsInterface | LfSpinnerPropsInterface | LfSplashPropsInterface | LfTabbarPropsInterface | LfToastPropsInterface | LfTreePropsInterface",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfThreshold",
        docs: "Sets the threshold for the IntersectionObserver.",
        type: "number",
      },
      {
        name: "lfTrigger",
        docs: "Decides when the sub-component should be rendered.\r\nBy default when both the component props exist and the component is in the viewport.",
        type: '"both" | "props" | "viewport"',
      },
      {
        name: "lfValue",
        docs: "Sets the tag name of the component to be placeholder loaded.",
        type: '"LfAccordion" | "LfArticle" | "LfAutocomplete" | "LfBadge" | "LfButton" | "LfCanvas" | "LfCard" | "LfCarousel" | "LfChart" | "LfChat" | "LfCheckbox" | "LfChip" | "LfCode" | "LfCompare" | "LfDrawer" | "LfHeader" | "LfImage" | "LfImageviewer" | "LfList" | "LfMasonry" | "LfMessenger" | "LfPhotoframe" | "LfPlaceholder" | "LfProgressbar" | "LfRadio" | "LfSelect" | "LfSlider" | "LfSpinner" | "LfSplash" | "LfToggle" | "LfTabbar" | "LfTextfield" | "LfToast" | "LfTree" | "LfTypewriter" | "LfUpload"',
      },
    ],
    styles: [
      {
        name: "--lf-placeholder-color-on-bg",
        docs: "Sets the color-on-bg color for the placeholder component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-placeholder-font-family",
        docs: "Sets the primary font family for the placeholder component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-placeholder-font-size",
        docs: "Sets the font size for the placeholder component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-placeholder-hor-alignment",
        docs: "Sets the horizontal alignment for the placeholder component. Defaults to => center",
      },
      {
        name: "--lf-placeholder-ver-alignment",
        docs: "Sets the vertical alignment for the placeholder component. Defaults to => center",
      },
    ],
  },
  "lf-progressbar": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Retrieves the debug information reflecting the current state of the component.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves to a LfDebugLifecycleInfo object containing debug information.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfProgressbarPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfProgressbarPropsInterface>",
      },
      {
        name: "refresh",
        docs: "Triggers a re-render of the component to reflect any state changes.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfAnimated",
        docs: "Specifies whether the progress bar should display animated stripes.",
        type: "boolean",
      },
      {
        name: "lfCenteredLabel",
        docs: "Displays the label in the middle of the progress bar.\r\nIt's the default for the radial variant and can't be changed.",
        type: "boolean",
      },
      {
        name: "lfIcon",
        docs: "Specifies an icon to replace the label.",
        type: "string",
      },
      {
        name: "lfIsRadial",
        docs: "Radial version.",
        type: "boolean",
      },
      {
        name: "lfLabel",
        docs: "Specifies a text for the bar's label.",
        type: "string",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUiState",
        docs: "Reflects the specified state color defined by the theme.",
        type: '"danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"',
      },
      {
        name: "lfValue",
        docs: "The current value the progress bar must display.",
        type: "number",
      },
    ],
    styles: [
      {
        name: "--lf-progressbar-border-color",
        docs: "Sets the border color for the progressbar component. Defaults to => var(--lf-color-border)",
      },
      {
        name: "--lf-progressbar-border-radius",
        docs: "Sets the border radius for the progressbar component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-progressbar-color-on-bg",
        docs: "Sets the color-on-bg color for the progressbar component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-progressbar-color-on-primary",
        docs: "Sets the color-on-primary color for the progressbar component. Defaults to => var(--lf-color-on-primary)",
      },
      {
        name: "--lf-progressbar-color-on-surface",
        docs: "Sets the color-on-surface color for the progressbar component. Defaults to => var(--lf-color-on-surface)",
      },
      {
        name: "--lf-progressbar-color-primary",
        docs: "Sets the color-primary color for the progressbar component. Defaults to => var(--lf-color-primary)",
      },
      {
        name: "--lf-progressbar-color-surface",
        docs: "Sets the color-surface color for the progressbar component. Defaults to => var(--lf-color-surface)",
      },
      {
        name: "--lf-progressbar-font-family",
        docs: "Sets the primary font family for the progressbar component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-progressbar-font-size",
        docs: "Sets the font size for the progressbar component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-progressbar-height",
        docs: "Sets the height for the progressbar component. Defaults to => 100%",
      },
      {
        name: "--lf-progressbar-padding",
        docs: "Sets the padding for the progressbar component. Defaults to => 1em 0em",
      },
      {
        name: "--lf-progressbar-width",
        docs: "Sets the width for the progressbar component. Defaults to => 100%",
      },
    ],
  },
  "lf-radio": {
    methods: [
      {
        name: "clearSelection",
        docs: "Clear the current selection.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "getAdapter",
        docs: "Gets the current adapter instance.",
        returns: {
          type: "Promise<LfRadioAdapter>",
          docs: "",
        },
        signature: "() => Promise<LfRadioAdapter>",
      },
      {
        name: "getDebugInfo",
        docs: "Retrieves the debug information reflecting the current state of the component.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves to a LfDebugLifecycleInfo object containing debug information.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfRadioPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfRadioPropsInterface>",
      },
      {
        name: "getSelectedNode",
        docs: "Gets the currently selected node.",
        returns: {
          type: "Promise<LfDataNode>",
          docs: "A promise that resolves to the selected data node or undefined if no selection.",
        },
        signature: "() => Promise<LfDataNode | undefined>",
      },
      {
        name: "refresh",
        docs: "Triggers a re-render of the component to reflect any state changes.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "selectItem",
        docs: "Select an item by ID.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(nodeId: string) => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfAriaLabel",
        docs: "Aria label for accessibility.",
        type: "string",
      },
      {
        name: "lfDataset",
        docs: "Dataset containing the radio options.",
        type: "LfDataDataset",
      },
      {
        name: "lfLeadingLabel",
        docs: "Whether labels should be positioned before (leading) or after (trailing) the radio controls.",
        type: "boolean",
      },
      {
        name: "lfOrientation",
        docs: "The orientation of the radio group (vertical or horizontal).",
        type: '"horizontal" | "vertical"',
      },
      {
        name: "lfRipple",
        docs: "When set to true, the pointerdown event will trigger a ripple effect.",
        type: "boolean",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUiState",
        docs: "Reflects the specified state color defined by the theme.",
        type: '"danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"',
      },
      {
        name: "lfValue",
        docs: "The ID of the currently selected radio item.",
        type: "string",
      },
    ],
    styles: [
      {
        name: "--lf-radio-circle-border-color",
        docs: "Sets the border color of the radio circle. Defaults to => rgba(var(--lf-color-on-bg), 0.6)",
      },
      {
        name: "--lf-radio-circle-border-width",
        docs: "Sets the border width of the radio circle. Defaults to => 2px",
      },
      {
        name: "--lf-radio-circle-hover-border-color",
        docs: "Sets the border color of the radio circle on hover. Defaults to => rgba(var(--lf-color-primary), 0.875)",
      },
      {
        name: "--lf-radio-circle-selected-border-color",
        docs: "Sets the border color of the radio circle when selected. Defaults to => rgba(var(--lf-color-primary), 1)",
      },
      {
        name: "--lf-radio-control-size",
        docs: "Sets the size of the radio control. Defaults to => 1.25em",
      },
      {
        name: "--lf-radio-dot-background-color",
        docs: "Sets the background color of the selected radio dot. Defaults to => rgba(var(--lf-color-primary), 1)",
      },
      {
        name: "--lf-radio-dot-border-width",
        docs: "Sets the border width of the selected radio dot. Defaults to => 10px (creates a filled circle)",
      },
      {
        name: "--lf-radio-font-family",
        docs: "Sets the primary font family for the radio component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-radio-font-size",
        docs: "Sets the font size for the radio component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-radio-group-gap",
        docs: "Sets the gap between radio items in the group. Defaults to => var(--lf-space-03)",
      },
      {
        name: "--lf-radio-group-horizontal-gap",
        docs: "Sets the gap between radio items in horizontal orientation. Defaults to => var(--lf-space-05)",
      },
      {
        name: "--lf-radio-hover-border-color",
        docs: "Sets the border color on hover. Defaults to => rgba(var(--lf-color-primary), 0.5)",
      },
      {
        name: "--lf-radio-item-gap",
        docs: "Sets the gap between the radio control and label. Defaults to => var(--lf-space-03)",
      },
      {
        name: "--lf-radio-item-selected-color",
        docs: "Sets the color for selected radio items. Defaults to => rgba(var(--lf-color-primary), 1)",
      },
      {
        name: "--lf-radio-label-color",
        docs: "Sets the color of the radio label. Defaults to => rgba(var(--lf-color-on-bg), 0.87)",
      },
      {
        name: "--lf-radio-label-font-size",
        docs: "Sets the font size of the radio label. Defaults to => 1em",
      },
      {
        name: "--lf-radio-label-font-weight",
        docs: "Sets the font weight of the label. Defaults to => 500",
      },
      {
        name: "--lf-radio-label-line-height",
        docs: "Sets the line height of the radio label. Defaults to => 1.5",
      },
      {
        name: "--lf-radio-label-padding",
        docs: "Sets the padding for the label. Defaults to => 0.75em",
      },
      {
        name: "--lf-radio-label-padding-leading",
        docs: "Sets the padding for the label in leading position. Defaults to => 0.75em",
      },
      {
        name: "--lf-radio-label-selected-color",
        docs: "Sets the color of the label when selected. Defaults to => rgba(var(--lf-color-primary), 1)",
      },
      {
        name: "--lf-radio-label-selected-font-weight",
        docs: "Sets the font weight of the label when selected. Defaults to => 500",
      },
      {
        name: "--lf-radio-ripple-size",
        docs: "Sets the size of the ripple effect. Defaults to => 2.5em",
      },
    ],
  },
  "lf-select": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Returns debug information about the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "Promise that resolves with debug information",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Retrieves the public props for the component.",
        returns: {
          type: "Promise<LfSelectPropsInterface>",
          docs: "Promise that resolves with the component props",
        },
        signature: "() => Promise<LfSelectPropsInterface>",
      },
      {
        name: "getSelectedIndex",
        docs: "Returns the index of the currently selected node in the dataset.",
        returns: {
          type: "Promise<number>",
          docs: "Promise that resolves with the selected index or -1 if none",
        },
        signature: "() => Promise<number>",
      },
      {
        name: "getValue",
        docs: "Returns the currently selected node.",
        returns: {
          type: "Promise<LfDataNode>",
          docs: "Promise that resolves with the selected node",
        },
        signature: "() => Promise<LfDataNode>",
      },
      {
        name: "refresh",
        docs: "Forces a re-render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "setValue",
        docs: "Sets the selected value by id.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(id: string) => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfDataset",
        docs: "Sets the dataset containing the selectable options.\nThis property is immutable after the component has loaded.",
        type: "LfDataDataset",
      },
      {
        name: "lfListProps",
        docs: "Sets the props for the internal lf-list component.",
        type: '{ applyFilter?: (value: string) => Promise<void>; focusNext?: () => Promise<void>; focusPrevious?: () => Promise<void>; getSelected?: () => Promise<LfDataNode>; selectNode?: (idx: number) => Promise<void>; selectNodeById?: (id: string) => Promise<void>; setFilter?: (value: string) => Promise<void>; rootElement?: LfListElement; debugInfo?: LfDebugLifecycleInfo; getDebugInfo?: () => Promise<LfDebugLifecycleInfo>; getProps?: (descriptions?: boolean) => Promise<LfComponentPropsFor<LfComponentName>>; lfStyle?: string; refresh?: () => Promise<void>; unmount?: (ms?: number) => Promise<void>; lfDataset?: LfDataDataset; lfEmpty?: string; lfEnableDeletions?: boolean; lfFilter?: boolean; lfNavigation?: boolean; lfRipple?: boolean; lfSelectable?: boolean; lfUiSize?: "large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"; lfUiState?: "danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"; lfValue?: number; }',
      },
      {
        name: "lfNavigation",
        docs: "Enables keyboard navigation with arrow keys.",
        type: "boolean",
      },
      {
        name: "lfStyle",
        docs: "Custom CSS styles to apply to the component.",
        type: "string",
      },
      {
        name: "lfTextfieldProps",
        docs: "Sets the props for the internal lf-textfield component.",
        type: '{ formatJSON?: () => Promise<void>; getElement?: () => Promise<HTMLInputElement | HTMLTextAreaElement>; getValue?: () => Promise<string>; setBlur?: () => Promise<void>; setFocus?: () => Promise<void>; setValue?: (value: string) => Promise<void>; rootElement?: LfTextfieldElement; debugInfo?: LfDebugLifecycleInfo; getDebugInfo?: () => Promise<LfDebugLifecycleInfo>; getProps?: (descriptions?: boolean) => Promise<LfComponentPropsFor<LfComponentName>>; lfStyle?: string; refresh?: () => Promise<void>; unmount?: (ms?: number) => Promise<void>; lfFormatJSON?: LfTextfieldFormatJSON; lfHelper?: LfTextfieldHelper; lfHtmlAttributes?: Partial<LfFrameworkAllowedKeysMap>; lfIcon?: string; lfLabel?: string; lfStretchY?: boolean; lfStyling?: "flat" | "outlined" | "raised" | "textarea"; lfTrailingIcon?: boolean; lfTrailingIconAction?: LfTextfieldTrailingIconAction; lfUiSize?: "large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"; lfUiState?: "danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"; lfValue?: string; }',
      },
      {
        name: "lfUiSize",
        docs: "Sets the UI size of the select field.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUiState",
        docs: "Sets the UI state color of the select field.",
        type: '"danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"',
      },
      {
        name: "lfValue",
        docs: "Sets the initial selected value.\nNon-mutable after component load.",
        type: "number | string",
      },
    ],
    styles: [
      {
        name: "--lf-select-color-primary",
        docs: "Sets the color-primary color for the select component. Defaults to => var(--lf-color-primary)",
      },
      {
        name: "--lf-select-font-family",
        docs: "Sets the primary font family for the select component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-select-font-size",
        docs: "Sets the font size for the select component. Defaults to => var(--lf-font-size)",
      },
    ],
  },
  "lf-slider": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfSliderPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfSliderPropsInterface>",
      },
      {
        name: "getValue",
        docs: "Used to retrieve the component's current state.",
        returns: {
          type: "Promise<LfSliderValue>",
          docs: "Promise resolved with the current state of the component.",
        },
        signature: "() => Promise<LfSliderValue>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "setValue",
        docs: "Sets the component's state.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(value: number) => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfLabel",
        docs: "Defines text to display as a label for the slider.",
        type: "string",
      },
      {
        name: "lfLeadingLabel",
        docs: "When true, displays the label before the slider component.\r\nDefaults to `false`.",
        type: "boolean",
      },
      {
        name: "lfMax",
        docs: "The maximum value allowed by the slider.",
        type: "number",
      },
      {
        name: "lfMin",
        docs: "The minimum value allowed by the slider.",
        type: "number",
      },
      {
        name: "lfRipple",
        docs: "Adds a ripple effect when interacting with the slider.",
        type: "boolean",
      },
      {
        name: "lfStep",
        docs: "Sets the increment or decrement steps when moving the slider.",
        type: "number",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUiState",
        docs: "Reflects the specified state color defined by the theme.",
        type: '"danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"',
      },
      {
        name: "lfValue",
        docs: "The initial numeric value for the slider within the defined range.",
        type: "number",
      },
    ],
    styles: [
      {
        name: "--lf-slider-border-radius",
        docs: "Sets the border radius for the slider component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-slider-box-shadow",
        docs: "Sets the box-shadow for the slider component's track. Defaults to => 0 0.25em 0.5em rgba(var(--lf-comp-color-on-bg, var(--lf-color-on-bg)), 0.2)",
      },
      {
        name: "--lf-slider-color-on-bg",
        docs: "Sets the color-on-bg color for the slider component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-slider-color-primary",
        docs: "Sets the color-primary color for the slider component. Defaults to => var(--lf-color-primary)",
      },
      {
        name: "--lf-slider-font-family",
        docs: "Sets the primary font family for the slider component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-slider-font-size",
        docs: "Sets the font size for the slider component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-slider-input-height",
        docs: "Sets the height for the slider component's input. Defaults to => 3em",
      },
      {
        name: "--lf-slider-label-min-width",
        docs: "Sets the min-width for the slider label. Defaults to => max-content",
      },
      {
        name: "--lf-slider-label-padding-left",
        docs: "Sets the left padding for the slider label. Defaults to => 1.5em",
      },
      {
        name: "--lf-slider-label-padding-right",
        docs: "Sets the right padding for the slider label. Defaults to => 1.5em",
      },
      {
        name: "--lf-slider-margin",
        docs: "Sets the margin for the slider component. Defaults to => 0 0.75em",
      },
      {
        name: "--lf-slider-min-width",
        docs: "Sets the min-width for the slider component. Defaults to => 7em",
      },
      {
        name: "--lf-slider-padding",
        docs: "Sets the padding for the slider component. Defaults to => 2em",
      },
      {
        name: "--lf-slider-thumb-box-shadow",
        docs: "Sets the box-shadow for the slider component's thumb. Defaults to => 0 0.25em 0.5em rgba(var(--lf-comp-color-on-bg, var(--lf-color-on-bg)), 0.2)",
      },
      {
        name: "--lf-slider-thumb-height",
        docs: "Sets the height for the slider component's thumb. Defaults to => 1.25em",
      },
      {
        name: "--lf-slider-thumb-hover-scale",
        docs: "Sets the scale for the slider component's thumb on hover. Defaults to => 1.1",
      },
      {
        name: "--lf-slider-thumb-underlay-top",
        docs: "Sets the top position for the slider component's thumb underlay. Defaults to => -0.6em",
      },
      {
        name: "--lf-slider-thumb-width",
        docs: "Sets the width for the slider component's thumb. Defaults to => 1.25em",
      },
      {
        name: "--lf-slider-track-height",
        docs: "Sets the height for the slider component's track. Defaults to => 0.5em",
      },
      {
        name: "--lf-slider-value-bottom-position",
        docs: "Sets the bottom position for the slider component's value. Defaults to => -3em",
      },
    ],
  },
  "lf-spinner": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProgress",
        docs: "Gets the current progress value.",
        returns: {
          type: "Promise<number>",
          docs: "",
        },
        signature: "() => Promise<number>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfSpinnerPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfSpinnerPropsInterface>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfActive",
        docs: "Specifies if the spinner is animating.",
        type: "boolean",
      },
      {
        name: "lfBarVariant",
        docs: "Controls if the component displays as a bar or a spinner.",
        type: "boolean",
      },
      {
        name: "lfDimensions",
        docs: "Defines the width and height of the spinner.\r\nIn the bar variant, it specifies only the height.",
        type: "string",
      },
      {
        name: "lfFader",
        docs: "Applies a blending modal over the component to darken or lighten the view, based on the theme.",
        type: "boolean",
      },
      {
        name: "lfFaderTimeout",
        docs: "Duration needed for the fader to become active.",
        type: "number",
      },
      {
        name: "lfFullScreen",
        docs: "Fills the entire viewport when enabled.",
        type: "boolean",
      },
      {
        name: "lfLayout",
        docs: "Selects the spinner layout.",
        type: "number",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfTimeout",
        docs: "Duration for the progress bar to fill up (in milliseconds).",
        type: "number",
      },
    ],
    styles: [
      {
        name: "--lf-spinner-font-family",
        docs: "Sets the primary font family for the spinner component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-spinner-font-size",
        docs: "Sets the font size for the spinner component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-spinner-min-height",
        docs: "Sets the minimum height for the spinner component. Defaults to => 0",
      },
    ],
  },
  "lf-splash": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Retrieves the debug information reflecting the current state of the component.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves to a LfDebugLifecycleInfo object containing debug information.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfSplashPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfSplashPropsInterface>",
      },
      {
        name: "refresh",
        docs: "Triggers a re-render of the component to reflect any state changes.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfLabel",
        docs: "Initial text displayed within the component, typically shown during loading.",
        type: "string",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
    ],
    styles: [
      {
        name: "--lf-splash-color-bg",
        docs: "Sets the color-bg color for the splash component. Defaults to => var(--lf-color-bg)",
      },
      {
        name: "--lf-splash-color-on-bg",
        docs: "Sets the color-on-bg color for the splash component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-splash-font-family",
        docs: "Sets the primary font family for the splash component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-splash-font-size",
        docs: "Sets the font size for the splash component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-splash-height",
        docs: "Sets the height for the splash component. Defaults to => 100dvh",
      },
      {
        name: "--lf-splash-left",
        docs: "Sets the left for the splash component. Defaults to => 0",
      },
      {
        name: "--lf-splash-position",
        docs: "Sets the position for the splash component. Defaults to => fixed",
      },
      {
        name: "--lf-splash-top",
        docs: "Sets the top for the splash component. Defaults to => 0",
      },
      {
        name: "--lf-splash-widget-height",
        docs: "Sets the height for the splash widget. Defaults to => 10em",
      },
      {
        name: "--lf-splash-widget-margin",
        docs: "Sets the margin for the splash widget. Defaults to => auto",
      },
      {
        name: "--lf-splash-widget-width",
        docs: "Sets the width for the splash widget. Defaults to => 10em",
      },
      {
        name: "--lf-splash-width",
        docs: "Sets the width for the splash component. Defaults to => 100dvw",
      },
    ],
  },
  "lf-tabbar": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Retrieves the debug information reflecting the current state of the component.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves to a LfDebugLifecycleInfo object containing debug information.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfTabbarPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfTabbarPropsInterface>",
      },
      {
        name: "getValue",
        docs: "Returns the selected node and its index.",
        returns: {
          type: "Promise<LfTabbarState>",
          docs: "Selected node and its index.",
        },
        signature: "() => Promise<LfTabbarState>",
      },
      {
        name: "refresh",
        docs: "Triggers a re-render of the component to reflect any state changes.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "setValue",
        docs: "Sets the value of the component based on the provided argument.",
        returns: {
          type: "Promise<LfTabbarState>",
          docs: "The newly set value.",
        },
        signature: "(value: number | string) => Promise<LfTabbarState>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfAriaLabel",
        docs: "Explicit accessible label prefix for tabs. Final per-tab aria-label resolves as:\r\nlfAriaLabel + ' ' + node.value (if both present) else node.value -> lfAriaLabel -> node.icon -> component id -> 'tab'.",
        type: "string",
      },
      {
        name: "lfDataset",
        docs: "The data set for the LF Tabbar component.\r\nThis property is mutable, meaning it can be changed after the component is initialized.",
        type: "LfDataDataset",
      },
      {
        name: "lfNavigation",
        docs: "When set to true, the tabbar will display navigation arrows for overflow tabs.",
        type: "boolean",
      },
      {
        name: "lfRipple",
        docs: "When set to true, the pointerdown event will trigger a ripple effect.",
        type: "boolean",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUiState",
        docs: "Reflects the specified state color defined by the theme.",
        type: '"danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"',
      },
      {
        name: "lfValue",
        docs: "Sets the initial selected node's index.",
        type: "number | string",
      },
    ],
    styles: [
      {
        name: "--lf-tabbar-border-radius",
        docs: "Sets the border radius for the tabbar component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-tabbar-color-bg",
        docs: "Sets the color-bg color for the tabbar component. Defaults to => var(--lf-color-bg)",
      },
      {
        name: "--lf-tabbar-color-indicator",
        docs: "Sets the color for the tabbar component's indicator. Defaults to => var(--lf-tabbar-color-primary)",
      },
      {
        name: "--lf-tabbar-color-on-bg",
        docs: "Sets the color-on-bg color for the tabbar component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-tabbar-color-primary",
        docs: "Sets the color-primary color for the tabbar component. Defaults to => var(--lf-color-primary)",
      },
      {
        name: "--lf-tabbar-font-family",
        docs: "Sets the primary font family for the tabbar component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-tabbar-font-size",
        docs: "Sets the font size for the tabbar component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-tabbar-height",
        docs: "Sets the height for the tabbar component. Defaults to => 2.25em",
      },
      {
        name: "--lf-tabbar-min-width",
        docs: "Sets the min-width for the tabbar component. Defaults to => 5em",
      },
      {
        name: "--lf-tabbar-padding",
        docs: "Sets the padding for the tabbar component. Defaults to => 0 1.25em",
      },
    ],
  },
  "lf-textfield": {
    methods: [
      {
        name: "formatJSON",
        docs: "Formats the content of the textarea as JSON programmatically and on-demand.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getElement",
        docs: "Fetches the HTML element of the component.",
        returns: {
          type: "Promise<HTMLInputElement | HTMLTextAreaElement>",
          docs: "A promise that resolves with the component's root HTML element.",
        },
        signature: "() => Promise<HTMLTextAreaElement | HTMLInputElement>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfTextfieldPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfTextfieldPropsInterface>",
      },
      {
        name: "getValue",
        docs: "Used to retrieve the component's current state.",
        returns: {
          type: "Promise<string>",
          docs: "Promise resolved with the current state of the component.",
        },
        signature: "() => Promise<string>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "setBlur",
        docs: "Blurs the input element.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "setFocus",
        docs: "Focuses the input element.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "setValue",
        docs: "Sets the component's state.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(value: string) => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfFormatJSON",
        docs: "Automatically formats textarea content to prettier JSON structure.",
        type: "LfTextfieldFormatJSON",
      },
      {
        name: "lfHelper",
        docs: "Sets the helper text for the text field.\r\nThe helper text can provide additional information or instructions to the user.",
        type: "LfTextfieldHelper",
      },
      {
        name: "lfHtmlAttributes",
        docs: "Allows customization of the input or textarea element through additional HTML attributes.\r\nThis can include attributes like 'readonly', 'placeholder', etc., to further customize the behavior or appearance of the input.",
        type: '{ lfImageProps?: any; lfLabel?: any; lfPosition?: any; lfStyle?: any; lfUiSize?: any; lfUiState?: any; lfAriaLabel?: any; lfDataset?: any; lfIcon?: any; lfIconOff?: any; lfRipple?: any; lfShowSpinner?: any; lfStretchX?: any; lfStretchY?: any; lfStyling?: any; lfToggable?: any; lfTrailingIcon?: any; lfType?: any; lfValue?: any; lfBrush?: any; lfColor?: any; lfCursor?: any; lfOpacity?: any; lfPreview?: any; lfSize?: any; lfStrokeTolerance?: any; lfLayout?: any; lfSizeX?: any; lfSizeY?: any; lfAxis?: any; lfColors?: any; lfLegend?: any; lfSeries?: any; lfTypes?: any; lfXAxis?: any; lfYAxis?: any; lfConfig?: any; lfAttachmentUploadTimeout?: any; lfContextWindow?: any; lfEmpty?: any; lfEndpointUrl?: any; lfFrequencyPenalty?: any; lfMaxTokens?: any; lfPollingInterval?: any; lfPresencePenalty?: any; lfSeed?: any; lfSystem?: any; lfTemperature?: any; lfTools?: any; lfTopP?: any; lfUploadCallback?: any; lfFlat?: any; lfFadeIn?: any; lfFormat?: any; lfLanguage?: any; lfPreserveSpaces?: any; lfShowCopy?: any; lfShowHeader?: any; lfStickyHeader?: any; lfHtmlAttributes?: any; lfMode?: any; lfOverlay?: any; lfPlaceholder?: any; lfThreshold?: any; lfAnimated?: any; lfCenteredLabel?: any; lfIsRadial?: any; lfFormatJSON?: any; lfHelper?: any; lfTrailingIconAction?: any; lfLeadingLabel?: any; lfDeleteSpeed?: any; lfLoop?: any; lfPause?: any; lfSpeed?: any; lfTag?: any; lfUpdatable?: any; disabled?: any; lfAllowFreeInput?: any; lfCache?: any; lfCacheTTL?: any; lfDebounceMs?: any; lfListProps?: any; lfMaxCacheSize?: any; lfMinChars?: any; lfNavigation?: any; lfSpinnerProps?: any; lfTextfieldProps?: any; lfAutoPlay?: any; lfInterval?: any; lfLightbox?: any; lfShape?: any; lfView?: any; lfDisplay?: any; lfResponsive?: any; lfLoadCallback?: any; lfEnableDeletions?: any; lfFilter?: any; lfSelectable?: any; lfActions?: any; lfCollapseColumns?: any; lfColumns?: any; lfAutosave?: any; lfProps?: any; lfTrigger?: any; lfOrientation?: any; lfMax?: any; lfMin?: any; lfStep?: any; lfActive?: any; lfBarVariant?: any; lfDimensions?: any; lfFader?: any; lfFaderTimeout?: any; lfFullScreen?: any; lfTimeout?: any; lfCloseCallback?: any; lfCloseIcon?: any; lfMessage?: any; lfTimer?: any; lfAccordionLayout?: any; lfExpandedNodeIds?: any; lfInitialExpansionDepth?: any; lfGrid?: any; lfSelectedNodeIds?: any; value?: any; htmlProps?: any; accept?: any; "accept-charset"?: any; alt?: any; autocomplete?: any; autofocus?: any; checked?: any; class?: any; dataset?: any; href?: any; id?: any; max?: any; maxLength?: any; min?: any; minLength?: any; multiple?: any; name?: any; placeholder?: any; readonly?: any; role?: any; src?: any; srcset?: any; step?: any; title?: any; type?: any; "aria-"?: any; "data-"?: any; }',
      },
      {
        name: "lfIcon",
        docs: "Sets the icon to be displayed within the text field.",
        type: "string",
      },
      {
        name: "lfLabel",
        docs: "Sets the label for the text field.",
        type: "string",
      },
      {
        name: "lfStretchX",
        docs: "Sets the text field to fill the available width of its container.",
        type: "boolean",
      },
      {
        name: "lfStretchY",
        docs: "Sets the text field to fill the available height of its container.",
        type: "boolean",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfStyling",
        docs: "Sets the styling variant for the text field.",
        type: '"flat" | "outlined" | "raised" | "textarea"',
      },
      {
        name: "lfTrailingIcon",
        docs: "When enabled, the text field's icon will be displayed on the trailing side.",
        type: "boolean",
      },
      {
        name: "lfTrailingIconAction",
        docs: "Sets a service icon to be displayed on the trailing side for additional actions.\r\nThis icon is not customizable by consumers and defaults to null (hidden).",
        type: '"--lf-icon-image" | "--lf-icon-upload" | "--lf-icon-delete" | "--lf-icon-danger" | "--lf-icon-disabled" | "--lf-icon-info" | "--lf-icon-primary" | "--lf-icon-secondary" | "--lf-icon-success" | "--lf-icon-warning" | "--lf-icon-copy" | "--lf-icon-download" | "--lf-icon-edit" | "--lf-icon-refresh" | "--lf-icon-search" | "--lf-icon-settings" | "--lf-icon-add" | "--lf-icon-attachment" | "--lf-icon-broken-image" | "--lf-icon-clear" | "--lf-icon-copy-ok" | "--lf-icon-collapsed" | "--lf-icon-dropdown" | "--lf-icon-expanded" | "--lf-icon-loading" | "--lf-icon-minus" | "--lf-icon-next" | "--lf-icon-plus" | "--lf-icon-previous"',
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUiState",
        docs: "Reflects the specified state color defined by the theme.",
        type: '"danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"',
      },
      {
        name: "lfValue",
        docs: "Sets the initial value of the text field.",
        type: "string",
      },
    ],
    styles: [
      {
        name: "--lf-textfield-border-color",
        docs: "Sets the border color for the textfield component. Defaults to => var(--lf-color-border)",
      },
      {
        name: "--lf-textfield-border-radius",
        docs: "Sets the border radius for the textfield component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-textfield-color-on-bg",
        docs: "Sets the color-on-bg color for the textfield component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-textfield-color-primary",
        docs: "Sets the color-primary color for the textfield component. Defaults to => var(--lf-color-primary)",
      },
      {
        name: "--lf-textfield-color-surface",
        docs: "Sets the color-surface color for the textfield component. Defaults to => var(--lf-color-surface)",
      },
      {
        name: "--lf-textfield-font-family",
        docs: "Sets the primary font family for the textfield component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-textfield-font-size",
        docs: "Sets the font size for the textfield component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-textfield-height",
        docs: "Sets the height for the textfield component. Defaults to => 3.5em",
      },
      {
        name: "--lf-textfield-icon-padding",
        docs: "Sets the padding for the textfield icon. Defaults to => 0 0.75em",
      },
      {
        name: "--lf-textfield-input-cursor",
        docs: "Sets the cursor for the textfield input. Defaults to => text",
      },
      {
        name: "--lf-textfield-padding",
        docs: "Sets the padding for the textfield component. Defaults to => 0 1em",
      },
    ],
  },
  "lf-toast": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Retrieves the debug information reflecting the current state of the component.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves to a LfDebugLifecycleInfo object containing debug information.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfToastPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfToastPropsInterface>",
      },
      {
        name: "refresh",
        docs: "Triggers a re-render of the component to reflect any state changes.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfCloseCallback",
        docs: "Callback invoked when the toast is closed.",
        type: "(toast: LfToastInterface, e: PointerEvent, ...args: any[]) => any",
      },
      {
        name: "lfCloseIcon",
        docs: "Sets the close icon of the toast.",
        type: "string",
      },
      {
        name: "lfIcon",
        docs: "Sets the icon of the toast.",
        type: "string",
      },
      {
        name: "lfMessage",
        docs: "Sets the message of the toast.",
        type: "string",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfTimer",
        docs: "When lfTimer is set with a number, the toast will close itself after the specified amount of time (in ms).",
        type: "number",
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUiState",
        docs: "Reflects the specified state color defined by the theme.",
        type: '"danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"',
      },
    ],
    styles: [
      {
        name: "--lf-comp-color-on-bg",
        docs: "Sets the color-on-bg color for the comp component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-toast-accent-height",
        docs: "Sets the height for the toast accent. Defaults to => 0.25em",
      },
      {
        name: "--lf-toast-border-radius",
        docs: "Sets the border radius for the toast component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-toast-color-on-bg",
        docs: "Sets the color-on-bg color for the toast component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-toast-color-primary",
        docs: "Sets the color-primary color for the toast component. Defaults to => var(--lf-color-primary)",
      },
      {
        name: "--lf-toast-color-surface",
        docs: "Sets the color-surface color for the toast component. Defaults to => var(--lf-color-surface)",
      },
      {
        name: "--lf-toast-font-family",
        docs: "Sets the primary font family for the toast component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-toast-font-size",
        docs: "Sets the font size for the toast component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-toast-icon-margin",
        docs: "Sets the margin for the toast icon. Defaults to => auto 0.5em",
      },
      {
        name: "--lf-toast-icon-opacity",
        docs: "Sets the opacity for the toast icon. Defaults to => 1",
      },
      {
        name: "--lf-toast-message-align-content",
        docs: "Sets the align-content for the toast message wrapper. Defaults to => center",
      },
      {
        name: "--lf-toast-message-padding",
        docs: "Sets the padding for the toast message. Defaults to => 0.75em 0.75em 0.75em 0",
      },
      {
        name: "--lf-toast-padding",
        docs: "Sets the padding for the toast message wrapper. Defaults to => 0.75em",
      },
    ],
  },
  "lf-toggle": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfTogglePropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfTogglePropsInterface>",
      },
      {
        name: "getValue",
        docs: "Used to retrieve the component's current state.",
        returns: {
          type: 'Promise<"off" | "on">',
          docs: "Promise resolved with the current state of the component.",
        },
        signature: "() => Promise<LfToggleState>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "setValue",
        docs: "Sets the component's state.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(value: LfToggleState | boolean) => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfAriaLabel",
        docs: "Explicit accessible label for the toggle control. Fallback chain when empty:\r\nlfLabel -> root element id -> 'toggle'. Applied to the native input element.",
        type: "string",
      },
      {
        name: "lfLabel",
        docs: "Defines text to display along with the toggle.",
        type: "string",
      },
      {
        name: "lfLeadingLabel",
        docs: "Defaults at false. When set to true, the label will be displayed before the component.",
        type: "boolean",
      },
      {
        name: "lfRipple",
        docs: "When set to true, the pointerdown event will trigger a ripple effect.",
        type: "boolean",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUiState",
        docs: "Reflects the specified state color defined by the theme.",
        type: '"danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"',
      },
      {
        name: "lfValue",
        docs: "Sets the initial boolean state of the toggle.",
        type: "boolean",
      },
    ],
    styles: [
      {
        name: "--lf-toggle-border-radius",
        docs: "Sets the border radius for the toggle component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-toggle-color-on-bg",
        docs: "Sets the color-on-bg color for the toggle component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-toggle-color-on-surface",
        docs: "Sets the color-on-surface color for the toggle component. Defaults to => var(--lf-color-on-surface)",
      },
      {
        name: "--lf-toggle-color-primary",
        docs: "Sets the color-primary color for the toggle component. Defaults to => var(--lf-color-primary)",
      },
      {
        name: "--lf-toggle-color-surface",
        docs: "Sets the color-surface color for the toggle component. Defaults to => var(--lf-color-surface)",
      },
      {
        name: "--lf-toggle-font-family",
        docs: "Sets the primary font family for the toggle component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-toggle-font-size",
        docs: "Sets the font size for the toggle component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-toggle-form-padding",
        docs: "Sets the padding for the toggle form field. Defaults to => 0.5em",
      },
      {
        name: "--lf-toggle-input-height",
        docs: "Sets the height for the toggle component's input. Defaults to => 3em",
      },
      {
        name: "--lf-toggle-label-min-width",
        docs: "Sets the min-width for the toggle label. Defaults to => max-content",
      },
      {
        name: "--lf-toggle-label-padding-left",
        docs: "Sets the left padding for the toggle label. Defaults to => 1em",
      },
      {
        name: "--lf-toggle-label-padding-right",
        docs: "Sets the right padding for the toggle label. Defaults to => 1em",
      },
      {
        name: "--lf-toggle-margin",
        docs: "Sets the margin for the toggle component. Defaults to => 1em 0.5em",
      },
      {
        name: "--lf-toggle-min-width",
        docs: "Sets the min-width for the toggle component. Defaults to => 4em",
      },
      {
        name: "--lf-toggle-thumb-size",
        docs: "Sets the size for the toggle component's thumb. Defaults to => 1.5em",
      },
      {
        name: "--lf-toggle-track-height",
        docs: "Sets the height for the toggle component's track. Defaults to => 0.5em",
      },
      {
        name: "--lf-toggle-track-width",
        docs: "Sets the width for the toggle component's track. Defaults to => 3em",
      },
    ],
  },
  "lf-tree": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Retrieves the debug information reflecting the current state of the component.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves to a LfDebugLifecycleInfo object containing debug information.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getExpandedNodeIds",
        docs: "Retrieves the identifiers for nodes currently expanded within the tree.",
        returns: {
          type: "Promise<string[]>",
          docs: "",
        },
        signature: "() => Promise<string[]>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfTreePropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfTreePropsInterface>",
      },
      {
        name: "getSelectedNodeIds",
        docs: "Retrieves the identifiers for nodes currently selected within the tree.",
        returns: {
          type: "Promise<string[]>",
          docs: "",
        },
        signature: "() => Promise<string[]>",
      },
      {
        name: "refresh",
        docs: "Triggers a re-render of the component to reflect any state changes.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "selectByPredicate",
        docs: "Selects the first node matching the provided predicate. If no match is found, selection is cleared.\nThis method combines node.find with setSelectedNodes for common selection-by-criteria workflows.",
        returns: {
          type: "Promise<LfDataNode>",
          docs: "Promise resolving to the selected node, or undefined if no match was found",
        },
        signature:
          "(predicate: (node: LfDataNode) => boolean) => Promise<LfDataNode | undefined>",
      },
      {
        name: "setExpandedNodes",
        docs: "Sets the expanded nodes in the tree.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature:
          "(nodes: string | LfDataNode | Array<string | LfDataNode> | null) => Promise<void>",
      },
      {
        name: "setSelectedNodes",
        docs: "Sets the selected nodes in the tree.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature:
          "(nodes: string | LfDataNode | Array<string | LfDataNode> | null) => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfAccordionLayout",
        docs: "When enabled, the first level of depth will create an accordion-style appearance for nodes.",
        type: "boolean",
      },
      {
        name: "lfDataset",
        docs: "The data set for the LF Tree component.\r\nThis property is mutable, meaning it can be changed after the component is initialized.",
        type: "LfDataDataset",
      },
      {
        name: "lfEmpty",
        docs: "Empty text displayed when there is no data.",
        type: "string",
      },
      {
        name: "lfExpandedNodeIds",
        docs: "Identifiers of the nodes that are expanded.\r\nThis property is mutable, meaning it can be changed after the component is initialized.",
        type: "string[]",
      },
      {
        name: "lfFilter",
        docs: "When true, displays a text field which enables filtering the dataset of the tree.",
        type: "boolean",
      },
      {
        name: "lfGrid",
        docs: "When true, the tree behaves like a grid, displaying each node's cells across the configured dataset columns.\r\nThe dataset should provide a `columns` array. Each column id will be looked up inside the node `cells` container; if a matching cell is found its shape/component will be rendered, otherwise a textual fallback (node value / empty) is shown. The first column will still contain the hierarchical expansion affordance and node icon.",
        type: "boolean",
      },
      {
        name: "lfInitialExpansionDepth",
        docs: "The initial depth to which the tree should be expanded upon first render.\r\nA value of 0 means all nodes are collapsed, 1 means only the root nodes are expanded, and so on.\r\nThis property is mutable, meaning it can be changed after the component is initialized.",
        type: "number",
      },
      {
        name: "lfRipple",
        docs: "When set to true, the pointerdown event will trigger a ripple effect.",
        type: "boolean",
      },
      {
        name: "lfSelectable",
        docs: "When true, nodes can be selected.",
        type: "boolean",
      },
      {
        name: "lfSelectedNodeIds",
        docs: "Identifiers of the nodes that are selected.\r\nThis property is mutable, meaning it can be changed after the component is initialized.",
        type: "string[]",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
    ],
    styles: [
      {
        name: "--lf-tree-accordion-node-height",
        docs: "Sets the height for the tree accordion node. Defaults to => 4em",
      },
      {
        name: "--lf-tree-border-radius",
        docs: "Sets the border radius for the tree component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-tree-color-bg",
        docs: "Sets the color-bg color for the tree component. Defaults to => var(--lf-color-bg)",
      },
      {
        name: "--lf-tree-color-on-bg",
        docs: "Sets the color-on-bg color for the tree component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-tree-color-on-surface",
        docs: "Sets the color-on-surface color for the tree component. Defaults to => var(--lf-color-on-surface)",
      },
      {
        name: "--lf-tree-color-surface",
        docs: "Sets the color-surface color for the tree component. Defaults to => var(--lf-color-surface)",
      },
      {
        name: "--lf-tree-font-family",
        docs: "Sets the primary font family for the tree component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-tree-font-size",
        docs: "Sets the font size for the tree component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-tree-node-height",
        docs: "Sets the height for the tree node. Defaults to => 2em",
      },
      {
        name: "--lf-tree-node-padding",
        docs: "Sets the padding for the tree node. Defaults to => 0 1em",
      },
      {
        name: "--lf-tree-padding",
        docs: "Sets the padding for the tree component. Defaults to => 0",
      },
    ],
  },
  "lf-typewriter": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Fetches debug information of the component's current state.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves with the debug information object.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfTypewriterPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfTypewriterPropsInterface>",
      },
      {
        name: "refresh",
        docs: "This method is used to trigger a new render of the component.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfCursor",
        docs: "Sets the behavior of the blinking cursor.",
        type: '"auto" | "disabled" | "enabled"',
      },
      {
        name: "lfDeleteSpeed",
        docs: "Sets the deleting speed in milliseconds.",
        type: "number",
      },
      {
        name: "lfLoop",
        docs: "Enables or disables looping of the text.",
        type: "boolean",
      },
      {
        name: "lfPause",
        docs: "Sets the duration of the pause after typing a complete text.",
        type: "number",
      },
      {
        name: "lfSpeed",
        docs: "Sets the typing speed in milliseconds.",
        type: "number",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfTag",
        docs: "The name of the HTML tag that will wrap the text.",
        type: '"a" | "code" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "pre" | "span"',
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUpdatable",
        docs: "Controls whether the component should update its text content.",
        type: "boolean",
      },
      {
        name: "lfValue",
        docs: "Sets the text or array of texts to display with the typewriter effect.",
        type: "string | string[]",
      },
    ],
    styles: [
      {
        name: "--lf-typewriter-color-bg",
        docs: "Sets the color-bg color for the typewriter component. Defaults to => var(--lf-color-bg)",
      },
      {
        name: "--lf-typewriter-color-on-bg",
        docs: "Sets the color-on-bg color for the typewriter component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-typewriter-cursor-height",
        docs: "Sets the height for the typewriter cursor. Defaults to => 1.25em",
      },
      {
        name: "--lf-typewriter-cursor-margin-left",
        docs: "Sets the left margin for the typewriter cursor. Defaults to => 0.15em",
      },
      {
        name: "--lf-typewriter-cursor-vertical-align",
        docs: "Sets the vertical-align for the typewriter cursor. Defaults to => top",
      },
      {
        name: "--lf-typewriter-cursor-width",
        docs: "Sets the width for the typewriter cursor. Defaults to => 0.125em",
      },
      {
        name: "--lf-typewriter-font-family",
        docs: "Sets the primary font family for the typewriter component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-typewriter-font-size",
        docs: "Sets the font size for the typewriter component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-typewriter-margin",
        docs: "Sets the margin for the typewriter text. Defaults to => 0",
      },
      {
        name: "--lf-typewriter-padding",
        docs: "Sets the padding for the typewriter component. Defaults to => 1em",
      },
    ],
  },
  "lf-upload": {
    methods: [
      {
        name: "getDebugInfo",
        docs: "Retrieves the debug information reflecting the current state of the component.",
        returns: {
          type: "Promise<LfDebugLifecycleInfo>",
          docs: "A promise that resolves to a LfDebugLifecycleInfo object containing debug information.",
        },
        signature: "() => Promise<LfDebugLifecycleInfo>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfUploadPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfUploadPropsInterface>",
      },
      {
        name: "getValue",
        docs: "Returns the component's internal value.",
        returns: {
          type: "Promise<File[]>",
          docs: "",
        },
        signature: "() => Promise<File[]>",
      },
      {
        name: "refresh",
        docs: "Triggers a re-render of the component to reflect any state changes.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "unmount",
        docs: "Initiates the unmount sequence, which removes the component from the DOM after a delay.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(ms?: number) => Promise<void>",
      },
    ],
    props: [
      {
        name: "lfHtmlAttributes",
        docs: "Allows customization of the input element through additional HTML attributes.\r\nThis can include attributes like 'readonly', 'placeholder', etc., to further customize the behavior or appearance of the input.",
        type: '{ lfImageProps?: any; lfLabel?: any; lfPosition?: any; lfStyle?: any; lfUiSize?: any; lfUiState?: any; lfAriaLabel?: any; lfDataset?: any; lfIcon?: any; lfIconOff?: any; lfRipple?: any; lfShowSpinner?: any; lfStretchX?: any; lfStretchY?: any; lfStyling?: any; lfToggable?: any; lfTrailingIcon?: any; lfType?: any; lfValue?: any; lfBrush?: any; lfColor?: any; lfCursor?: any; lfOpacity?: any; lfPreview?: any; lfSize?: any; lfStrokeTolerance?: any; lfLayout?: any; lfSizeX?: any; lfSizeY?: any; lfAxis?: any; lfColors?: any; lfLegend?: any; lfSeries?: any; lfTypes?: any; lfXAxis?: any; lfYAxis?: any; lfConfig?: any; lfAttachmentUploadTimeout?: any; lfContextWindow?: any; lfEmpty?: any; lfEndpointUrl?: any; lfFrequencyPenalty?: any; lfMaxTokens?: any; lfPollingInterval?: any; lfPresencePenalty?: any; lfSeed?: any; lfSystem?: any; lfTemperature?: any; lfTools?: any; lfTopP?: any; lfUploadCallback?: any; lfFlat?: any; lfFadeIn?: any; lfFormat?: any; lfLanguage?: any; lfPreserveSpaces?: any; lfShowCopy?: any; lfShowHeader?: any; lfStickyHeader?: any; lfHtmlAttributes?: any; lfMode?: any; lfOverlay?: any; lfPlaceholder?: any; lfThreshold?: any; lfAnimated?: any; lfCenteredLabel?: any; lfIsRadial?: any; lfFormatJSON?: any; lfHelper?: any; lfTrailingIconAction?: any; lfLeadingLabel?: any; lfDeleteSpeed?: any; lfLoop?: any; lfPause?: any; lfSpeed?: any; lfTag?: any; lfUpdatable?: any; disabled?: any; lfAllowFreeInput?: any; lfCache?: any; lfCacheTTL?: any; lfDebounceMs?: any; lfListProps?: any; lfMaxCacheSize?: any; lfMinChars?: any; lfNavigation?: any; lfSpinnerProps?: any; lfTextfieldProps?: any; lfAutoPlay?: any; lfInterval?: any; lfLightbox?: any; lfShape?: any; lfView?: any; lfDisplay?: any; lfResponsive?: any; lfLoadCallback?: any; lfEnableDeletions?: any; lfFilter?: any; lfSelectable?: any; lfActions?: any; lfCollapseColumns?: any; lfColumns?: any; lfAutosave?: any; lfProps?: any; lfTrigger?: any; lfOrientation?: any; lfMax?: any; lfMin?: any; lfStep?: any; lfActive?: any; lfBarVariant?: any; lfDimensions?: any; lfFader?: any; lfFaderTimeout?: any; lfFullScreen?: any; lfTimeout?: any; lfCloseCallback?: any; lfCloseIcon?: any; lfMessage?: any; lfTimer?: any; lfAccordionLayout?: any; lfExpandedNodeIds?: any; lfInitialExpansionDepth?: any; lfGrid?: any; lfSelectedNodeIds?: any; value?: any; htmlProps?: any; accept?: any; "accept-charset"?: any; alt?: any; autocomplete?: any; autofocus?: any; checked?: any; class?: any; dataset?: any; href?: any; id?: any; max?: any; maxLength?: any; min?: any; minLength?: any; multiple?: any; name?: any; placeholder?: any; readonly?: any; role?: any; src?: any; srcset?: any; step?: any; title?: any; type?: any; "aria-"?: any; "data-"?: any; }',
      },
      {
        name: "lfLabel",
        docs: "Sets the button's label.",
        type: "string",
      },
      {
        name: "lfRipple",
        docs: "When set to true, the pointerdown event will trigger a ripple effect.",
        type: "boolean",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfValue",
        docs: "Initializes the component with these files.",
        type: "File[]",
      },
    ],
    styles: [
      {
        name: "--lf-upload-border-color",
        docs: "Sets the border color for the upload component. Defaults to => var(--lf-color-border)",
      },
      {
        name: "--lf-upload-border-radius",
        docs: "Sets the border radius for the upload component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-upload-button-height",
        docs: "Sets the height for the upload button. Defaults to => 2.75em",
      },
      {
        name: "--lf-upload-color-on-bg",
        docs: "Sets the color-on-bg color for the upload component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-upload-color-surface",
        docs: "Sets the color-surface color for the upload component. Defaults to => var(--lf-color-surface)",
      },
      {
        name: "--lf-upload-font-family",
        docs: "Sets the primary font family for the upload component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-upload-font-size",
        docs: "Sets the font size for the upload component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-upload-grid-gap",
        docs: "Sets the grid-gap for the upload component. Defaults to => 1.25em",
      },
      {
        name: "--lf-upload-item-padding",
        docs: "Sets the padding for the upload item. Defaults to => 0.75em",
      },
      {
        name: "--lf-upload-min-height",
        docs: "Sets the min-height for the upload component. Defaults to => 8em",
      },
      {
        name: "--lf-upload-padding",
        docs: "Sets the padding for the upload component. Defaults to => 1em",
      },
    ],
  },
};
