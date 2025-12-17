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
        name: "getExpandedNodes",
        docs: "Returns the expanded node IDs.",
        returns: {
          type: "Promise<Set<string>>",
          docs: "Expanded node IDs.",
        },
        signature: "() => Promise<Set<string>>",
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
        docs: "Returns the selected node IDs.",
        returns: {
          type: "Promise<Set<string>>",
          docs: "Selected node IDs.",
        },
        signature: "() => Promise<Set<string>>",
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
        docs: "The data set for the LF Accordion component.\nThis property is mutable, meaning it can be changed after the component is initialized.",
        type: "LfDataDataset",
      },
      {
        name: "lfExpanded",
        docs: "IDs of nodes that should be expanded. When provided, the accordion will sync\nits internal expanded state with this array.",
        type: "string[]",
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
        docs: "Border color for accordion items. Defaults to => var(--lf-state-border, var(--lf-color-border))",
      },
      {
        name: "--lf-accordion-border-radius",
        docs: "Border radius for accordion items. Defaults to => var(--lf-ui-border-radius, 0.375em)",
      },
      {
        name: "--lf-accordion-border-width",
        docs: "Border width for accordion items. Defaults to => var(--lf-ui-border-width, 1px)",
      },
      {
        name: "--lf-accordion-color-bg",
        docs: "Background color for accordion headers. Defaults to => var(--lf-state-bg, var(--lf-color-bg))",
      },
      {
        name: "--lf-accordion-color-on-bg",
        docs: "Text color on background surface. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg))",
      },
      {
        name: "--lf-accordion-color-on-primary",
        docs: "Text color on primary surface. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
      },
      {
        name: "--lf-accordion-color-on-surface",
        docs: "Text color on surface. Defaults to => var(--lf-state-on-surface, var(--lf-color-on-surface))",
      },
      {
        name: "--lf-accordion-color-primary",
        docs: "Primary/accent color for selections. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-accordion-color-surface",
        docs: "Surface color for accordion items. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
      },
      {
        name: "--lf-accordion-cursor",
        docs: "Cursor for accordion headers. Defaults to => pointer",
      },
      {
        name: "--lf-accordion-expand-margin",
        docs: "Margin for the expand icon. Defaults to => 0",
      },
      {
        name: "--lf-accordion-flex-direction",
        docs: "Flex direction for accordion container. Defaults to => column",
      },
      {
        name: "--lf-accordion-flex-wrap",
        docs: "Flex wrap for accordion container. Defaults to => nowrap",
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
        name: "--lf-accordion-font-weight",
        docs: "Font weight for accordion headers. Defaults to => var(--lf-font-weight-title)",
      },
      {
        name: "--lf-accordion-gap",
        docs: "Gap between header elements. Defaults to => 0.5em",
      },
      {
        name: "--lf-accordion-icon-margin",
        docs: "Margin for item icons. Defaults to => 0",
      },
      {
        name: "--lf-accordion-icon-size",
        docs: "Size for icons. Defaults to => 1.25em",
      },
      {
        name: "--lf-accordion-line-height",
        docs: "Line height for accordion headers. Defaults to => 1.75em",
      },
      {
        name: "--lf-accordion-padding",
        docs: "Padding for accordion headers. Defaults to => 1em",
      },
      {
        name: "--lf-accordion-text-align",
        docs: "Text alignment for headers. Defaults to => left",
      },
      {
        name: "--lf-accordion-text-margin",
        docs: "Margin for header text. Defaults to => 0",
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
        signature: "(ms?: number) => Promise<void>",
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
        type: '{ lfEvent?: { emit: (payload: LfListEventPayload) => void; }; applyFilter?: (value: string) => Promise<void>; focusNext?: () => Promise<void>; focusPrevious?: () => Promise<void>; getSelected?: () => Promise<LfDataNode>; selectNode?: (idx: number) => Promise<void>; selectNodeById?: (id: string) => Promise<void>; setFilter?: (value: string) => Promise<void>; rootElement?: LfListElement; debugInfo?: LfDebugLifecycleInfo; getDebugInfo?: () => Promise<LfDebugLifecycleInfo>; getProps?: (descriptions?: boolean) => Promise<LfComponentPropsFor<"LfAccordion" | "LfToggle" | "LfArticle" | "LfAutocomplete" | "LfBadge" | "LfBreadcrumbs" | "LfButton" | "LfCanvas" | "LfCard" | "LfCarousel" | "LfChart" | "LfChat" | "LfCheckbox" | "LfChip" | "LfCode" | "LfCompare" | "LfDrawer" | "LfHeader" | "LfImage" | "LfList" | "LfMasonry" | "LfMessenger" | "LfMultiInput" | "LfPhotoframe" | "LfPlaceholder" | "LfProgressbar" | "LfRadio" | "LfSelect" | "LfShapeeditor" | "LfSlider" | "LfSnackbar" | "LfSpinner" | "LfSplash" | "LfTabbar" | "LfTextfield" | "LfToast" | "LfTree" | "LfTypewriter" | "LfUpload">>; lfStyle?: string; refresh?: () => Promise<void>; unmount?: (ms?: number) => Promise<void>; lfDataset?: LfDataDataset; lfEmpty?: string; lfEnableDeletions?: boolean; lfFilter?: boolean; lfNavigation?: boolean; lfRipple?: boolean; lfSelectable?: boolean; lfUiSize?: "large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"; lfUiState?: "danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"; lfValue?: number; }',
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
        type: '{ bigWait?: boolean; getProgress?: () => Promise<number>; lfEvent?: { emit: (payload: LfSpinnerEventPayload) => void; }; progress?: number; rootElement?: LfSpinnerElement; debugInfo?: LfDebugLifecycleInfo; getDebugInfo?: () => Promise<LfDebugLifecycleInfo>; getProps?: (descriptions?: boolean) => Promise<LfComponentPropsFor<"LfAccordion" | "LfToggle" | "LfArticle" | "LfAutocomplete" | "LfBadge" | "LfBreadcrumbs" | "LfButton" | "LfCanvas" | "LfCard" | "LfCarousel" | "LfChart" | "LfChat" | "LfCheckbox" | "LfChip" | "LfCode" | "LfCompare" | "LfDrawer" | "LfHeader" | "LfImage" | "LfList" | "LfMasonry" | "LfMessenger" | "LfMultiInput" | "LfPhotoframe" | "LfPlaceholder" | "LfProgressbar" | "LfRadio" | "LfSelect" | "LfShapeeditor" | "LfSlider" | "LfSnackbar" | "LfSpinner" | "LfSplash" | "LfTabbar" | "LfTextfield" | "LfToast" | "LfTree" | "LfTypewriter" | "LfUpload">>; lfStyle?: string; refresh?: () => Promise<void>; unmount?: (ms?: number) => Promise<void>; lfActive?: boolean; lfBarVariant?: boolean; lfFader?: boolean; lfFaderTimeout?: number; lfFullScreen?: boolean; lfIcon?: LfThemeIcon; lfLayout?: "spinner" | "icon" | "ring" | "dots" | "bars" | "grid" | "pulse" | "wave"; lfTimeout?: number; lfUiSize?: "large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"; lfUiState?: "danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"; }',
      },
      {
        name: "lfStyle",
        docs: "Custom CSS styles to apply to the component.",
        type: "string",
      },
      {
        name: "lfTextfieldProps",
        docs: "Sets the props for the internal lf-textfield component.",
        type: '{ lfEvent?: { emit: (payload: LfTextfieldEventPayload) => void; }; status?: Set<"disabled" | "filled" | "focused" | "full-width" | "has-icon" | "has-label">; value?: string; formatJSON?: () => Promise<void>; getElement?: () => Promise<HTMLInputElement | HTMLTextAreaElement>; getValue?: () => Promise<string>; setBlur?: () => Promise<void>; setFocus?: () => Promise<void>; setValue?: (value: string) => Promise<void>; rootElement?: LfTextfieldElement; debugInfo?: LfDebugLifecycleInfo; getDebugInfo?: () => Promise<LfDebugLifecycleInfo>; getProps?: (descriptions?: boolean) => Promise<LfComponentPropsFor<"LfAccordion" | "LfToggle" | "LfArticle" | "LfAutocomplete" | "LfBadge" | "LfBreadcrumbs" | "LfButton" | "LfCanvas" | "LfCard" | "LfCarousel" | "LfChart" | "LfChat" | "LfCheckbox" | "LfChip" | "LfCode" | "LfCompare" | "LfDrawer" | "LfHeader" | "LfImage" | "LfList" | "LfMasonry" | "LfMessenger" | "LfMultiInput" | "LfPhotoframe" | "LfPlaceholder" | "LfProgressbar" | "LfRadio" | "LfSelect" | "LfShapeeditor" | "LfSlider" | "LfSnackbar" | "LfSpinner" | "LfSplash" | "LfTabbar" | "LfTextfield" | "LfToast" | "LfTree" | "LfTypewriter" | "LfUpload">>; lfStyle?: string; refresh?: () => Promise<void>; unmount?: (ms?: number) => Promise<void>; lfCaptureShortcuts?: boolean; lfFormatJSON?: LfTextfieldFormatJSON; lfHelper?: LfTextfieldHelper; lfHtmlAttributes?: Partial<LfFrameworkAllowedKeysMap>; lfIcon?: LfIconType; lfLabel?: string; lfStretchY?: boolean; lfStyling?: "flat" | "outlined" | "raised" | "textarea"; lfTrailingIcon?: boolean; lfTrailingIconAction?: LfTextfieldTrailingIconAction; lfUiSize?: "large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"; lfUiState?: "danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"; lfValue?: string; }',
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
        name: "--lf-autocomplete-border-radius",
        docs: "Border radius for dropdown. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-autocomplete-color-border",
        docs: "Border color for dropdown. Defaults to => var(--lf-state-border, var(--lf-color-border))",
      },
      {
        name: "--lf-autocomplete-color-on-bg",
        docs: "Text and icon color. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg))",
      },
      {
        name: "--lf-autocomplete-color-primary",
        docs: "Primary color for focus states. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-autocomplete-color-surface",
        docs: "Surface color for dropdown background. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
      },
      {
        name: "--lf-autocomplete-dropdown-background-alpha",
        docs: "Background alpha for dropdown. Defaults to => var(--lf-ui-alpha-glass-solid, 0.875)",
      },
      {
        name: "--lf-autocomplete-dropdown-box-shadow",
        docs: "Box shadow for dropdown. Defaults to => 0 0.25em 0.5em rgba(var(--lf-color-on-bg), 0.15)",
      },
      {
        name: "--lf-autocomplete-dropdown-margin-top",
        docs: "Margin top for dropdown list. Defaults to => 0.25em",
      },
      {
        name: "--lf-autocomplete-font-family",
        docs: "Sets the primary font family for the autocomplete component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-autocomplete-font-size",
        docs: "Sets the font size for the autocomplete component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-autocomplete-spinner-min-height",
        docs: "Min height for spinner area. Defaults to => 0.25em",
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
        name: "--lf-badge-background-alpha",
        docs: "Background alpha for the badge. Defaults to => var(--lf-ui-alpha-glass-solid, 0.875)",
      },
      {
        name: "--lf-badge-border-radius",
        docs: "Border radius for the badge. Defaults to => 50%",
      },
      {
        name: "--lf-badge-box-shadow",
        docs: "Box shadow for the badge. Defaults to => 0 0.125em 0.25em rgba(var(--lf-color-on-bg), 0.2)",
      },
      {
        name: "--lf-badge-color-on-primary",
        docs: "Text color on primary surface. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
      },
      {
        name: "--lf-badge-color-primary",
        docs: "Primary/background color for the badge. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
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
        name: "--lf-badge-font-weight",
        docs: "Font weight for the badge. Defaults to => var(--lf-font-weight-button)",
      },
      {
        name: "--lf-badge-height",
        docs: "Height for the badge. Defaults to => 1.5em",
      },
      {
        name: "--lf-badge-image-height",
        docs: "Height for the badge image. Defaults to => 1em",
      },
      {
        name: "--lf-badge-image-width",
        docs: "Width for the badge image. Defaults to => 1em",
      },
      {
        name: "--lf-badge-padding",
        docs: "Padding for the badge. Defaults to => 0.25em",
      },
      {
        name: "--lf-badge-width",
        docs: "Width for the badge. Defaults to => 1.5em",
      },
    ],
  },
  "lf-breadcrumbs": {
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
          type: "Promise<LfBreadcrumbsPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfBreadcrumbsPropsInterface>",
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
        name: "setCurrentNode",
        docs: "Sets the current node to the specified node ID.",
        returns: {
          type: "Promise<void>",
          docs: "A promise that resolves when the current node has been set.",
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
        name: "lfDataset",
        docs: "Dataset used to build the breadcrumb path.",
        type: "LfDataDataset",
      },
      {
        name: "lfEmpty",
        docs: "Message displayed when the dataset is empty.",
        type: "string",
      },
      {
        name: "lfInteractive",
        docs: "When true, enables interactivity for breadcrumb items.",
        type: "boolean",
      },
      {
        name: "lfMaxItems",
        docs: "Maximum number of breadcrumb items to display.",
        type: "number",
      },
      {
        name: "lfRipple",
        docs: "When true, enables ripple effect on breadcrumb item clicks.",
        type: "boolean",
      },
      {
        name: "lfSeparator",
        docs: "Separator string displayed between breadcrumb items.",
        type: "string",
      },
      {
        name: "lfShowRoot",
        docs: "When true, the root node is included in the breadcrumb path.",
        type: "boolean",
      },
      {
        name: "lfStyle",
        docs: "Custom CSS styles applied to the component.",
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
        docs: "ID of the current node in the breadcrumb path.",
        type: "string",
      },
    ],
    styles: [
      {
        name: "--lf-breadcrumbs-border-radius",
        docs: "Border radius for breadcrumb items. Defaults to => var(--lf-ui-radius)",
      },
      {
        name: "--lf-breadcrumbs-color-on-primary",
        docs: "Text color on primary surface. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
      },
      {
        name: "--lf-breadcrumbs-color-on-surface",
        docs: "Text color on surface. Defaults to => var(--lf-state-on-surface, var(--lf-color-on-surface))",
      },
      {
        name: "--lf-breadcrumbs-color-primary",
        docs: "Primary color for the breadcrumbs. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-breadcrumbs-color-surface",
        docs: "Surface color for breadcrumb items. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
      },
      {
        name: "--lf-breadcrumbs-dot-gap",
        docs: "Gap between dots in truncation indicator. Defaults to => 0.05em",
      },
      {
        name: "--lf-breadcrumbs-dot-gap-hover",
        docs: "Gap between dots on hover. Defaults to => 0.2em",
      },
      {
        name: "--lf-breadcrumbs-empty-color",
        docs: "Color for empty state message. Defaults to => rgba(var(--lf-color-on-surface), 0.6)",
      },
      {
        name: "--lf-breadcrumbs-font-family",
        docs: "Sets the primary font family for the breadcrumbs component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-breadcrumbs-font-size",
        docs: "Sets the font size for the breadcrumbs component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-breadcrumbs-gap",
        docs: "Gap between breadcrumb items. Defaults to => 0.5em",
      },
      {
        name: "--lf-breadcrumbs-item-height",
        docs: "Height for breadcrumb items. Defaults to => 2em",
      },
      {
        name: "--lf-breadcrumbs-item-padding",
        docs: "Padding for breadcrumb items. Defaults to => 0 0.75em",
      },
      {
        name: "--lf-breadcrumbs-padding",
        docs: "Padding for the breadcrumbs container. Defaults to => 0.5em",
      },
      {
        name: "--lf-breadcrumbs-separator-color",
        docs: "Color for separators. Defaults to => rgba(var(--lf-color-on-surface), 0.5)",
      },
      {
        name: "--lf-breadcrumbs-separator-margin",
        docs: "Horizontal margin around separators. Defaults to => 0.25em",
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
          "(label?: string, icon?: LfIconType | null, timeout?: number) => Promise<void>",
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
        type: '"article" | "checkbox" | "code" | "list" | "select" | "upload" | "id" | "copy" | "download" | "edit" | "refresh" | "settings" | "search" | "--lf-icon-image" | "--lf-icon-upload" | "--lf-icon-delete" | "--lf-icon-add" | "--lf-icon-attachment" | "--lf-icon-broken-image" | "--lf-icon-clear" | "--lf-icon-copy" | "--lf-icon-copy-ok" | "--lf-icon-collapsed" | "--lf-icon-danger" | "--lf-icon-disabled" | "--lf-icon-download" | "--lf-icon-dropdown" | "--lf-icon-edit" | "--lf-icon-expanded" | "--lf-icon-info" | "--lf-icon-loading" | "--lf-icon-minus" | "--lf-icon-next" | "--lf-icon-plus" | "--lf-icon-previous" | "--lf-icon-primary" | "--lf-icon-refresh" | "--lf-icon-secondary" | "--lf-icon-settings" | "--lf-icon-success" | "--lf-icon-search" | "--lf-icon-warning" | "ai" | "brush" | "bug" | "bulb" | "camera" | "candle" | "check" | "door" | "droplet" | "file" | "flare" | "folder" | "forms" | "help" | "highlight" | "history" | "home" | "hourglass" | "ikosaedr" | "json" | "key" | "link" | "loader" | "lock" | "maximize" | "messages" | "microphone" | "moon" | "movie" | "music" | "network" | "notification" | "numbers" | "palette" | "pdf" | "photo" | "progress" | "replace" | "robot" | "schema" | "send" | "shirt" | "skew" | "sparkles" | "slideshow" | "temperature" | "template" | "tooltip" | "wand" | "writing" | "x" | "zip" | "adjustments-horizontal" | "alert-triangle" | "arrow-autofit-content" | "arrow-back" | "bell-ringing" | "brand-facebook" | "brand-github" | "brand-github-copilot" | "brand-instagram" | "brand-linkedin" | "brand-npm" | "brand-reddit" | "brand-x" | "calendar-clock" | "camera-ai" | "caret-down" | "caret-left" | "caret-right" | "caret-up" | "chart-column" | "chart-histogram" | "chevron-compact-down" | "chevron-compact-left" | "chevron-compact-right" | "chevron-compact-up" | "chevron-down" | "chevron-left" | "chevron-right" | "chevrons-down" | "chevrons-left" | "chevrons-right" | "chevrons-up" | "chevron-up" | "circle-arrow-down" | "circle-arrow-left" | "circle-arrow-right" | "circle-arrow-up" | "circle-caret-down" | "circle-caret-left" | "circle-caret-right" | "circle-caret-up" | "circle-chevron-down" | "circle-chevron-left" | "circle-chevron-right" | "circle-chevron-up" | "circle-x" | "code-circle-2" | "color-swatch" | "columns-2" | "contrast-2" | "copy-check" | "drag-drop" | "exclamation-circle" | "filter-search" | "folder-open" | "hexagon-alert" | "hexagon-info" | "hexagon-minus" | "hexagon-minus-2" | "hexagon-photo" | "hexagon-plus" | "hexagon-plus-2" | "hourglass-low" | "image-in-picture" | "inner-shadow-bottom" | "input-search" | "layout-board-split" | "layout-list" | "layout-navbar" | "layout-navbar-inactive" | "layout-sidebar" | "lf-signature" | "lf-website" | "link-plus" | "list-tree" | "loader-2" | "loader-3" | "menu-2" | "message-circle-user" | "off-brush" | "off-hexagon" | "off-highlight" | "off-id" | "off-microphone" | "off-moon" | "off-notification" | "off-palette" | "off-replace" | "off-search" | "off-send" | "off-template" | "percentage-60" | "photo-search" | "photo-x" | "picture-in-picture-top" | "player-record" | "player-stop" | "playstation-circle" | "playstation-square" | "playstation-triangle" | "playstation-x" | "route-2" | "share-2" | "square-toggle" | "square-x" | "stack-pop" | "stack-push" | "stopwatch" | "sunset-2" | "terminal-2" | "time-duration-30" | "toggle-right" | "viewport-tall" | "viewport-wide"',
      },
      {
        name: "lfIconOff",
        docs: "When set, the icon button off state will show this icon.",
        type: '"article" | "checkbox" | "code" | "list" | "select" | "upload" | "id" | "copy" | "download" | "edit" | "refresh" | "settings" | "search" | "--lf-icon-image" | "--lf-icon-upload" | "--lf-icon-delete" | "--lf-icon-add" | "--lf-icon-attachment" | "--lf-icon-broken-image" | "--lf-icon-clear" | "--lf-icon-copy" | "--lf-icon-copy-ok" | "--lf-icon-collapsed" | "--lf-icon-danger" | "--lf-icon-disabled" | "--lf-icon-download" | "--lf-icon-dropdown" | "--lf-icon-edit" | "--lf-icon-expanded" | "--lf-icon-info" | "--lf-icon-loading" | "--lf-icon-minus" | "--lf-icon-next" | "--lf-icon-plus" | "--lf-icon-previous" | "--lf-icon-primary" | "--lf-icon-refresh" | "--lf-icon-secondary" | "--lf-icon-settings" | "--lf-icon-success" | "--lf-icon-search" | "--lf-icon-warning" | "ai" | "brush" | "bug" | "bulb" | "camera" | "candle" | "check" | "door" | "droplet" | "file" | "flare" | "folder" | "forms" | "help" | "highlight" | "history" | "home" | "hourglass" | "ikosaedr" | "json" | "key" | "link" | "loader" | "lock" | "maximize" | "messages" | "microphone" | "moon" | "movie" | "music" | "network" | "notification" | "numbers" | "palette" | "pdf" | "photo" | "progress" | "replace" | "robot" | "schema" | "send" | "shirt" | "skew" | "sparkles" | "slideshow" | "temperature" | "template" | "tooltip" | "wand" | "writing" | "x" | "zip" | "adjustments-horizontal" | "alert-triangle" | "arrow-autofit-content" | "arrow-back" | "bell-ringing" | "brand-facebook" | "brand-github" | "brand-github-copilot" | "brand-instagram" | "brand-linkedin" | "brand-npm" | "brand-reddit" | "brand-x" | "calendar-clock" | "camera-ai" | "caret-down" | "caret-left" | "caret-right" | "caret-up" | "chart-column" | "chart-histogram" | "chevron-compact-down" | "chevron-compact-left" | "chevron-compact-right" | "chevron-compact-up" | "chevron-down" | "chevron-left" | "chevron-right" | "chevrons-down" | "chevrons-left" | "chevrons-right" | "chevrons-up" | "chevron-up" | "circle-arrow-down" | "circle-arrow-left" | "circle-arrow-right" | "circle-arrow-up" | "circle-caret-down" | "circle-caret-left" | "circle-caret-right" | "circle-caret-up" | "circle-chevron-down" | "circle-chevron-left" | "circle-chevron-right" | "circle-chevron-up" | "circle-x" | "code-circle-2" | "color-swatch" | "columns-2" | "contrast-2" | "copy-check" | "drag-drop" | "exclamation-circle" | "filter-search" | "folder-open" | "hexagon-alert" | "hexagon-info" | "hexagon-minus" | "hexagon-minus-2" | "hexagon-photo" | "hexagon-plus" | "hexagon-plus-2" | "hourglass-low" | "image-in-picture" | "inner-shadow-bottom" | "input-search" | "layout-board-split" | "layout-list" | "layout-navbar" | "layout-navbar-inactive" | "layout-sidebar" | "lf-signature" | "lf-website" | "link-plus" | "list-tree" | "loader-2" | "loader-3" | "menu-2" | "message-circle-user" | "off-brush" | "off-hexagon" | "off-highlight" | "off-id" | "off-microphone" | "off-moon" | "off-notification" | "off-palette" | "off-replace" | "off-search" | "off-send" | "off-template" | "percentage-60" | "photo-search" | "photo-x" | "picture-in-picture-top" | "player-record" | "player-stop" | "playstation-circle" | "playstation-square" | "playstation-triangle" | "playstation-x" | "route-2" | "share-2" | "square-toggle" | "square-x" | "stack-pop" | "stack-push" | "stopwatch" | "sunset-2" | "terminal-2" | "time-duration-30" | "toggle-right" | "viewport-tall" | "viewport-wide"',
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
        docs: "Alignment for button content. Defaults to => center",
      },
      {
        name: "--lf-button-border-radius",
        docs: "Border radius for the button. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-button-color-on-primary",
        docs: "Text color on filled button surfaces. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
      },
      {
        name: "--lf-button-color-primary",
        docs: "Primary color for the button. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-button-cursor",
        docs: "Cursor style for the button. Defaults to => pointer",
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
        docs: "Font weight for the button. Defaults to => var(--lf-font-weight-primary)",
      },
      {
        name: "--lf-button-height",
        docs: "Height for the button. Defaults to => 3em",
      },
      {
        name: "--lf-button-icon-height",
        docs: "Icon height inside the button. Defaults to => 1.5em",
      },
      {
        name: "--lf-button-icon-width",
        docs: "Icon width inside the button. Defaults to => 1.5em",
      },
      {
        name: "--lf-button-justify-content",
        docs: "Justify content for button. Defaults to => center",
      },
      {
        name: "--lf-button-min-width",
        docs: "Minimum width for the button. Defaults to => 4em",
      },
      {
        name: "--lf-button-padding",
        docs: "Padding for the button. Defaults to => 0 1.25em",
      },
      {
        name: "--lf-button-text-decoration",
        docs: "Text decoration for the button. Defaults to => none",
      },
      {
        name: "--lf-button-text-transform",
        docs: "Text transform for the button. Defaults to => uppercase",
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
        name: "drawLine",
        docs: "Programmatically draws a line between two points on the canvas.\nCoordinates are normalized (0-1 range).",
        returns: {
          type: "Promise<void>",
          docs: "Promise that resolves when the line is drawn",
        },
        signature:
          "(from: LfCanvasPoint, to: LfCanvasPoint, options?: LfCanvasDrawOptions) => Promise<void>",
      },
      {
        name: "drawPath",
        docs: "Programmatically draws a path connecting multiple points on the canvas.\nCoordinates are normalized (0-1 range).",
        returns: {
          type: "Promise<void>",
          docs: "Promise that resolves when the path is drawn",
        },
        signature:
          "(points: LfCanvasPoint[], options?: LfCanvasDrawOptions) => Promise<void>",
      },
      {
        name: "drawShape",
        docs: "Programmatically draws a shape (circle or square) at a specific point.\nCoordinates are normalized (0-1 range).",
        returns: {
          type: "Promise<void>",
          docs: "Promise that resolves when the shape is drawn",
        },
        signature:
          "(point: LfCanvasPoint, options?: LfCanvasDrawOptions) => Promise<void>",
      },
      {
        name: "drawText",
        docs: "Programmatically draws text at a specific point on the canvas.\nCoordinates are normalized (0-1 range).",
        returns: {
          type: "Promise<void>",
          docs: "Promise that resolves when the text is drawn",
        },
        signature:
          "(text: string, point: LfCanvasPoint, options?: LfCanvasTextOptions) => Promise<void>",
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
        docs: "Retrieves the HTMLImageElement from the canvas.",
        returns: {
          type: "Promise<HTMLImageElement>",
          docs: "A promise that resolves with the HTMLImageElement instance\nrepresenting the image element in the canvas.",
        },
        signature: "() => Promise<HTMLImageElement>",
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
        docs: "Resizes the canvas elements to match the container's dimensions.\n\nThis method performs the following operations:\n1. Calculates available space from the parent element (to avoid circular dependency with boxing CSS)\n2. Extracts image dimensions using `getImageDimensions()` helper\n3. Determines image orientation and updates state\n4. Calculates boxing type (letterbox/pillarbox) based on aspect ratio mismatch\n5. Waits for next frame to ensure boxing CSS is applied\n6. Sets canvas dimensions to match the final rendered container size\n\nThe boxing calculation helps correctly map pointer coordinates to image coordinates\nwhen the image aspect ratio differs from the available space.",
        returns: {
          type: "Promise<void>",
          docs: "A Promise that resolves when the resize operation is complete",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "setCanvasHeight",
        docs: "Sets the canvas height for both the board and preview elements.\nIf a value is provided, it will set that specific height.\nIf no value is provided, it will set the height based on the container's bounding client rect.",
        returns: {
          type: "Promise<void>",
          docs: "Promise that resolves when the height has been set",
        },
        signature: "(value?: number) => Promise<void>",
      },
      {
        name: "setCanvasWidth",
        docs: "Sets the width of the canvas element(s).\nIf a value is provided, sets the width to that specific value.\nIf no value is provided, sets the width to match the container's width.\nWhen cursor preview is enabled, also updates the preview canvas width.",
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
        name: "lfAutoResize",
        docs: "Enables automatic resizing of the canvas when the parent container resizes.\nWhen disabled, the canvas will not respond to container size changes.",
        type: "boolean",
      },
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
        docs: "Simplifies the coordinates array by applying the Ramer-Douglas-Peucker algorithm.\nThis prop sets the tolerance of the algorithm (null to disable).",
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
        name: "--lf-card-color-on-primary",
        docs: "Text color on primary surfaces. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
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
        docs: "Moves the carousel to the next slide.\nTriggers the next slide transition using the carousel controller's next function.",
        returns: {
          type: "Promise<void>",
          docs: "A promise that resolves when the slide transition is complete.",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "prevSlide",
        docs: "Moves the carousel to the previous slide by invoking the `previous` method\nfrom the carousel controller's index set.",
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
        docs: "The data set for the LF Carousel component.\nThis property is mutable, meaning it can be changed after the component is initialized.",
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
        type: '"accordion" | "badge" | "button" | "canvas" | "card" | "chart" | "chat" | "chip" | "code" | "image" | "number" | "photoframe" | "progressbar" | "slot" | "text" | "textfield" | "toggle" | "typewriter" | "upload"',
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
        docs: "Border radius for the carousel container. Defaults to => var(--lf-ui-border-radius, 0.25em)",
      },
      {
        name: "--lf-carousel-color-on-primary",
        docs: "Text/icon color on primary surfaces. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
      },
      {
        name: "--lf-carousel-color-on-surface",
        docs: "Text/icon color on surface. Defaults to => var(--lf-state-on-surface, var(--lf-color-on-surface))",
      },
      {
        name: "--lf-carousel-color-primary",
        docs: "Primary color for carousel navigation elements. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-carousel-color-surface",
        docs: "Surface color for the slide bar. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
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
        docs: "Height of the slide indicator bar. Defaults to => 0.75em",
      },
      {
        name: "--lf-carousel-slide-bar-opacity",
        docs: "Opacity of the slide bar at rest. Defaults to => 0.75",
      },
      {
        name: "--lf-carousel-slide-bar-opacity-hover",
        docs: "Opacity of the slide bar on hover. Defaults to => 1",
      },
      {
        name: "--lf-carousel-transition-duration",
        docs: "Duration for slide transitions. Defaults to => 0.5s",
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
        docs: "The data set for the LF Chart component.\nThis property is mutable, meaning it can be changed after the component is initialized.",
        type: "LfDataDataset",
      },
      {
        name: "lfLegend",
        docs: "Sets the position of the legend.\nSupported values: bottom, left, right, top, hidden.\nKeep in mind that legend types are tied to chart types, some combinations might not work.",
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
        name: "--lf-chart-background-alpha",
        docs: "Background alpha for the chart. Defaults to => var(--lf-ui-alpha-glass-hint, 0.125)",
      },
      {
        name: "--lf-chart-color-bg",
        docs: "Background color for the chart container. Defaults to => var(--lf-state-bg, var(--lf-color-bg))",
      },
      {
        name: "--lf-chart-color-on-bg",
        docs: "Text/element color on background. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg))",
      },
      {
        name: "--lf-chart-font-family",
        docs: "Sets the primary font family for the chart component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-chart-font-size",
        docs: "Sets the font size for the chart component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-chart-min-height",
        docs: "Minimum height for the chart container. Defaults to => var(--lf_chart_height, 100%)",
      },
      {
        name: "--lf-chart-min-width",
        docs: "Minimum width for the chart container. Defaults to => var(--lf_chart_width, 100%)",
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
        name: "retryConnection",
        docs: "",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
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
        name: "lfConfig",
        docs: "Configuration object for LLM, tools, UI, and attachments.\nAll chat settings are configured through this single prop.",
        type: "LfChatConfig",
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfToolHandlers",
        docs: "Map of tool names to their execution handler functions.\nEach handler receives the parsed arguments and returns a result.\nThis is kept as a separate prop (not in lfConfig) because functions are not serializable.",
        type: "{ [x: string]: (args: Record<string, unknown>) => string | LfLLMToolResponse | Promise<string | LfLLMToolResponse>; }",
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUploadCallback",
        docs: "Callback for uploading files to external storage.\nReturns attachment metadata after upload completes.\nThis is kept as a separate prop (not in lfConfig) because functions are not serializable.",
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
        docs: "Padding for attachments area. Defaults to => 0",
      },
      {
        name: "--lf-chat-buttons-padding",
        docs: "Padding for button area. Defaults to => 1em 0",
      },
      {
        name: "--lf-chat-color-bg",
        docs: "Background color for chat container. Defaults to => var(--lf-state-bg, var(--lf-color-bg))",
      },
      {
        name: "--lf-chat-color-border",
        docs: "Border color for elements. Defaults to => var(--lf-state-border, var(--lf-color-border))",
      },
      {
        name: "--lf-chat-color-on-bg",
        docs: "Text on background. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg))",
      },
      {
        name: "--lf-chat-color-on-primary",
        docs: "Text on primary surfaces. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
      },
      {
        name: "--lf-chat-color-on-surface",
        docs: "Text on surface. Defaults to => var(--lf-state-on-surface, var(--lf-color-on-surface))",
      },
      {
        name: "--lf-chat-color-primary",
        docs: "Primary accent color. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-chat-color-surface",
        docs: "Surface color for messages/elements. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
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
        name: "--lf-chat-icon-color",
        docs: "Color for status icons. Defaults to => rgba($bgC, 1)",
      },
      {
        name: "--lf-chat-icon-height",
        docs: "Height for icons. Defaults to => 4em",
      },
      {
        name: "--lf-chat-icon-width",
        docs: "Width for icons. Defaults to => 4em",
      },
      {
        name: "--lf-chat-outer-grid-gap",
        docs: "Gap between main sections. Defaults to => 0.75em",
      },
      {
        name: "--lf-chat-padding",
        docs: "Padding for the chat container. Defaults to => 1em 0",
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
          type: 'Promise<"off" | "on" | "indeterminate">',
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
        docs: "Explicit accessible label for the checkbox control. Fallback chain when empty:\r\nlfLabel -> root element id -> 'checkbox'. Applied to the native input element.",
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
        docs: "Sets the initial boolean state of the checkbox.\r\nSet to null for indeterminate state.",
        type: "boolean",
      },
    ],
    styles: [
      {
        name: "--lf-checkbox-animation-duration",
        docs: "Animation duration for state changes. Defaults to => 90ms",
      },
      {
        name: "--lf-checkbox-border-radius",
        docs: "Border radius for the background. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-checkbox-checkmark-stroke-width",
        docs: "Stroke width for checkmark. Defaults to => 3.12px",
      },
      {
        name: "--lf-checkbox-color-on-primary",
        docs: "Color for checkmark on primary background. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
      },
      {
        name: "--lf-checkbox-color-primary",
        docs: "Primary color for checked/active states. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-checkbox-color-surface",
        docs: "Surface/track background color. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
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
        name: "--lf-checkbox-size",
        docs: "Size for the checkbox control. Defaults to => 1.5em",
      },
      {
        name: "--lf-checkbox-surface-border-radius",
        docs: "Border radius for the surface. Defaults to => 50%",
      },
      {
        name: "--lf-checkbox-surface-size",
        docs: "Size for the surface area. Defaults to => 3.5em",
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
        docs: "Sets the border radius for chips. Defaults to => 1em",
      },
      {
        name: "--lf-chip-color-border",
        docs: "Border color for chips. Defaults to => var(--lf-state-border, var(--lf-color-border))",
      },
      {
        name: "--lf-chip-color-on-bg",
        docs: "Color for text on background. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg)) Wrapper variables:",
      },
      {
        name: "--lf-chip-color-on-primary",
        docs: "Color for content on primary backgrounds. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
      },
      {
        name: "--lf-chip-color-on-surface",
        docs: "Color for content on surface backgrounds. Defaults to => var(--lf-state-on-surface, var(--lf-color-on-surface))",
      },
      {
        name: "--lf-chip-color-primary",
        docs: "Primary color for selected/active states. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-chip-color-surface",
        docs: "Surface background color. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
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
        name: "--lf-chip-height",
        docs: "Sets the height for chip items. Defaults to => 2em",
      },
      {
        name: "--lf-chip-indent-multiplier",
        docs: "Multiplier for indent width calculation. Defaults to => 10 Item/chip variables:",
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
      {
        name: "--lf-chip-padding",
        docs: "Sets the padding for chips. Defaults to => 0 0.75em Chip set variables:",
      },
      {
        name: "--lf-chip-set-gap",
        docs: "Sets the gap for chip sets. Defaults to => 0.5em",
      },
      {
        name: "--lf-chip-set-padding",
        docs: "Sets the padding for chip sets. Defaults to => 0.25em",
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
        name: "--lf-code-border-radius",
        docs: "Border radius for the code component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-code-border-right",
        docs: "Sets the border right for the header. Defaults to => 1px solid var(--lf-color-border)",
      },
      {
        name: "--lf-code-border-top",
        docs: "Sets the border top for the header. Defaults to => 1px solid var(--lf-color-border)",
      },
      {
        name: "--lf-code-color-on-primary",
        docs: "Text color on primary surface. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
      },
      {
        name: "--lf-code-color-on-surface",
        docs: "Text color on surface. Defaults to => var(--lf-state-on-surface, var(--lf-color-on-surface))",
      },
      {
        name: "--lf-code-color-primary",
        docs: "Primary/accent color for the code component. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-code-color-surface",
        docs: "Surface/background color for code body. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
      },
      {
        name: "--lf-code-font-family",
        docs: "Sets the primary font family for the code component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-code-font-family-monospace",
        docs: "Sets the monospace font family. Defaults to => var(--lf-font-family-monospace)",
      },
      {
        name: "--lf-code-font-size",
        docs: "Sets the font size for the code component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-code-header-height",
        docs: "Sets the height for the header. Defaults to => 2.25em",
      },
      {
        name: "--lf-code-header-justify",
        docs: "Sets the justify-content for the header. Defaults to => space-between",
      },
      {
        name: "--lf-code-header-padding",
        docs: "Sets the padding for the header. Defaults to => 0.25em 0.75em",
      },
      {
        name: "--lf-code-header-position",
        docs: "Sets the position for the sticky header. Defaults to => sticky",
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
        docs: "The data set for the LF Chart component.\nThis property is mutable, meaning it can be changed after the component is initialized.",
        type: "LfDataDataset",
      },
      {
        name: "lfShape",
        docs: "Sets the type of shapes to compare.",
        type: '"accordion" | "badge" | "button" | "canvas" | "card" | "chart" | "chat" | "chip" | "code" | "image" | "number" | "photoframe" | "progressbar" | "slot" | "text" | "textfield" | "toggle" | "typewriter" | "upload"',
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
        docs: "Border color for panels. Defaults to => var(--lf-color-border)",
      },
      {
        name: "--lf-compare-border-radius",
        docs: "Border radius for panels. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-compare-color-on-primary",
        docs: "Text color on primary surface. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
      },
      {
        name: "--lf-compare-color-primary",
        docs: "Primary color for the compare component. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
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
        docs: "Sets the grid template for the compare component. Defaults to => 1fr auto",
      },
      {
        name: "--lf-compare-panel-height",
        docs: "Sets the height for the panel. Defaults to => auto",
      },
      {
        name: "--lf-compare-panel-max-height",
        docs: "Sets the max height for the panel. Defaults to => 50%",
      },
      {
        name: "--lf-compare-panel-width",
        docs: "Sets the width for the panel. Defaults to => 50%",
      },
      {
        name: "--lf-compare-panel-z-index",
        docs: "Sets the z index for the panel. Defaults to => var(--lf-ui-zindex-portal)",
      },
      {
        name: "--lf-compare-slider-thickness",
        docs: "Sets the thickness for the slider. Defaults to => 3px",
      },
      {
        name: "--lf-compare-toolbar-justify",
        docs: "Sets the justify for the toolbar. Defaults to => space-between",
      },
      {
        name: "--lf-compare-toolbar-padding",
        docs: "Padding for the toolbar. Defaults to => 0.5em",
      },
      {
        name: "--lf-compare-toolbar-width",
        docs: "Width for the toolbar. Defaults to => 100%",
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
        docs: "Sets the border for the drawer component. Defaults to => 1px solid rgba(var(--lf-color-border), 0.75)",
      },
      {
        name: "--lf-drawer-border-radius",
        docs: "Sets the border radius for the drawer component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-drawer-color-bg",
        docs: "Background color for the drawer. Defaults to => var(--lf-state-bg, var(--lf-color-bg))",
      },
      {
        name: "--lf-drawer-color-drawer",
        docs: "Sets the color-drawer color for the drawer component. Defaults to => var(--lf-color-drawer)",
      },
      {
        name: "--lf-drawer-color-on-bg",
        docs: "Text color for the drawer. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg))",
      },
      {
        name: "--lf-drawer-color-on-drawer",
        docs: "Sets the color-on-drawer color for the drawer component. Defaults to => var(--lf-color-on-drawer)",
      },
      {
        name: "--lf-drawer-color-on-primary",
        docs: "Text color on primary surfaces. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
      },
      {
        name: "--lf-drawer-color-primary",
        docs: "Primary/accent color for the drawer. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
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
        docs: "Box shadow for the left-positioned drawer. Defaults to => 4px 0 10px -2px rgba(var(--lf-color-on-drawer), 0.2), ...",
      },
      {
        name: "--lf-drawer-right-box-shadow",
        docs: "Box shadow for the right-positioned drawer. Defaults to => -4px 0 10px -2px rgba(var(--lf-color-on-drawer), 0.2), ...",
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
        docs: "Sets the justify-content for the header section. Defaults to => space-between",
      },
      {
        name: "--lf-header-padding",
        docs: "Sets the padding for the header section. Defaults to => 0.5em 0.75em",
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
        docs: "Allows customization of the image element.\nThis can include attributes like 'alt', 'aria-', etc., to further customize the behavior or appearance of the input.",
        type: '{ autocomplete?: any; placeholder?: any; name?: any; id?: any; disabled?: any; class?: any; href?: any; lfAriaLabel?: any; lfLabel?: any; lfLeadingLabel?: any; lfRipple?: any; lfStyle?: any; lfUiSize?: any; lfUiState?: any; lfValue?: any; lfDataset?: any; lfExpanded?: any; lfImageProps?: any; lfPosition?: any; lfIcon?: any; lfIconOff?: any; lfShowSpinner?: any; lfStretchX?: any; lfStretchY?: any; lfStyling?: any; lfToggable?: any; lfTrailingIcon?: any; lfType?: any; lfAutoResize?: any; lfBrush?: any; lfColor?: any; lfCursor?: any; lfOpacity?: any; lfPreview?: any; lfSize?: any; lfStrokeTolerance?: any; lfLayout?: any; lfSizeX?: any; lfSizeY?: any; lfAxis?: any; lfColors?: any; lfLegend?: any; lfSeries?: any; lfTypes?: any; lfXAxis?: any; lfYAxis?: any; lfConfig?: any; lfToolHandlers?: any; lfUploadCallback?: any; lfFlat?: any; lfFadeIn?: any; lfFormat?: any; lfLanguage?: any; lfPreserveSpaces?: any; lfShowCopy?: any; lfShowHeader?: any; lfStickyHeader?: any; lfHtmlAttributes?: any; lfOverlay?: any; lfPlaceholder?: any; lfThreshold?: any; lfAnimated?: any; lfCenteredLabel?: any; lfIsRadial?: any; lfCaptureShortcuts?: any; lfFormatJSON?: any; lfHelper?: any; lfTrailingIconAction?: any; lfDeleteSpeed?: any; lfLoop?: any; lfPause?: any; lfSpeed?: any; lfTag?: any; lfUpdatable?: any; lfEmpty?: any; lfAllowFreeInput?: any; lfCache?: any; lfCacheTTL?: any; lfDebounceMs?: any; lfListProps?: any; lfMaxCacheSize?: any; lfMinChars?: any; lfNavigation?: any; lfSpinnerProps?: any; lfTextfieldProps?: any; lfInteractive?: any; lfMaxItems?: any; lfSeparator?: any; lfShowRoot?: any; lfAutoPlay?: any; lfInterval?: any; lfLightbox?: any; lfShape?: any; lfView?: any; lfDisplay?: any; lfResponsive?: any; lfEnableDeletions?: any; lfFilter?: any; lfSelectable?: any; lfActions?: any; lfCollapseColumns?: any; lfColumns?: any; lfAutosave?: any; lfChipProps?: any; lfMaxHistory?: any; lfMode?: any; lfProps?: any; lfTrigger?: any; lfOrientation?: any; lfLoadCallback?: any; lfMax?: any; lfMin?: any; lfStep?: any; lfAction?: any; lfActionCallback?: any; lfCloseIcon?: any; lfDuration?: any; lfMessage?: any; lfActive?: any; lfBarVariant?: any; lfFader?: any; lfFaderTimeout?: any; lfFullScreen?: any; lfTimeout?: any; lfCloseCallback?: any; lfTimer?: any; lfAccordionLayout?: any; lfExpandedNodeIds?: any; lfInitialExpansionDepth?: any; lfGrid?: any; lfSelectedNodeIds?: any; value?: any; htmlProps?: any; accept?: any; "accept-charset"?: any; alt?: any; autofocus?: any; checked?: any; dataset?: any; max?: any; maxLength?: any; min?: any; minLength?: any; multiple?: any; readonly?: any; role?: any; src?: any; srcset?: any; step?: any; title?: any; type?: any; "aria-"?: any; "data-"?: any; }',
      },
      {
        name: "lfShowSpinner",
        docs: "Controls the display of a loading indicator.\nWhen enabled, a spinner is shown until the image finishes loading.\nThis property is not compatible with SVG images.",
        type: "boolean",
      },
      {
        name: "lfSizeX",
        docs: "Sets the width of the icon.\nThis property accepts any valid CSS measurement value (e.g., px, %, vh, etc.) and defaults to 100%.",
        type: "string",
      },
      {
        name: "lfSizeY",
        docs: "Sets the height of the icon.\nThis property accepts any valid CSS measurement value (e.g., px, %, vh, etc.) and defaults to 100%.",
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
        docs: "Defines the source URL of the image.\nThis property is used to set the image resource that the component should display.",
        type: "string",
      },
    ],
    styles: [
      {
        name: "--lf-image-border-radius",
        docs: "Border radius for the image. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-image-color-on-bg",
        docs: "Color for icon content. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg))",
      },
      {
        name: "--lf-image-color-surface",
        docs: "Surface background for placeholder. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
      },
      {
        name: "--lf-image-fit",
        docs: "Object fit for the image element. Defaults to => cover",
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
        name: "--lf-image-height",
        docs: "Height for the image component. Defaults to => auto",
      },
      {
        name: "--lf-image-icon-size",
        docs: "Size for the icon fallback. Defaults to => 3em",
      },
      {
        name: "--lf-image-position",
        docs: "Object position for the image. Defaults to => center",
      },
      {
        name: "--lf-image-width",
        docs: "Width for the image component. Defaults to => auto",
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
        docs: "Border color for the list. Defaults to => var(--lf-color-border)",
      },
      {
        name: "--lf-list-border-radius",
        docs: "Border radius for the list. Defaults to => var(--lf-ui-radius)",
      },
      {
        name: "--lf-list-border-width",
        docs: "Border width for the list. Defaults to => 1px",
      },
      {
        name: "--lf-list-color-bg",
        docs: "Background color for the list. Defaults to => var(--lf-state-bg, var(--lf-color-bg))",
      },
      {
        name: "--lf-list-color-on-bg",
        docs: "Text color on background. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg))",
      },
      {
        name: "--lf-list-color-on-primary",
        docs: "Text color on primary surface. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
      },
      {
        name: "--lf-list-color-on-surface",
        docs: "Text color on surface. Defaults to => var(--lf-state-on-surface, var(--lf-color-on-surface))",
      },
      {
        name: "--lf-list-color-primary",
        docs: "Primary/accent color for selected items. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-list-color-surface",
        docs: "Surface color for filter area. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
      },
      {
        name: "--lf-list-font-family",
        docs: "Font family for the list. Defaults to => var(--lf-font-family)",
      },
      {
        name: "--lf-list-font-size",
        docs: "Base font size (scaled by --lf-ui-size). Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-list-item-height",
        docs: "Height for list items. Defaults to => 2.5em",
      },
      {
        name: "--lf-list-item-padding",
        docs: "Padding for list items. Defaults to => 0 0.75em",
      },
      {
        name: "--lf-list-item-with-description-height",
        docs: "Height for items with description. Defaults to => 3.6em",
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
        docs: "When true the masonry will collapse the number of columns to the number of items\nwhen the number of items is less than the configured columns. Set to false to\npreserve the configured column count even if there are fewer items.",
        type: "boolean",
      },
      {
        name: "lfColumns",
        docs: "Number of columns of the masonry, doesn't affect sequential views.\nCan be set with a number or an array of numbers that identify each breakpoint.",
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
        type: '"accordion" | "badge" | "button" | "canvas" | "card" | "chart" | "chat" | "chip" | "code" | "image" | "number" | "photoframe" | "progressbar" | "slot" | "text" | "textfield" | "toggle" | "typewriter" | "upload"',
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
        name: "--lf-masonry-capture-border-radius",
        docs: "Sets the border radius for the capture overlay. Defaults to => 4px",
      },
      {
        name: "--lf-masonry-capture-selected-border",
        docs: "Sets the border for the selected capture item. Defaults to => 2px solid rgba(var(--lf-color-secondary), 0.875)",
      },
      {
        name: "--lf-masonry-capture-selected-filter",
        docs: "Sets the filter for the selected capture item. Defaults to => brightness(110%) drop-shadow(0 0 0.5em rgb(var(--lf-color-secondary)))",
      },
      {
        name: "--lf-masonry-chart-min-height",
        docs: "Sets the minimum height for the chart inside the capture. Defaults to => 150px",
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
        name: "--lf-masonry-grid-overflow",
        docs: "Sets the overflow for the grid of the masonry component. Defaults to => auto",
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
        docs: "Resets the messenger component to its initial state.\nClears covers, current character, and message history.\nReinitializes the component.",
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
        docs: "The data set for the LF List component.\nThis property is mutable, meaning it can be changed after the component is initialized.",
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
        docs: "Padding for active option names. Defaults to => 0.5em",
      },
      {
        name: "--lf-messenger-avatar-name-padding",
        docs: "Padding for the avatar name area. Defaults to => 0.5em",
      },
      {
        name: "--lf-messenger-color-bg",
        docs: "Background color for messenger container. Defaults to => var(--lf-state-bg, var(--lf-color-bg))",
      },
      {
        name: "--lf-messenger-color-border",
        docs: "Border color for elements. Defaults to => var(--lf-state-border, var(--lf-color-border))",
      },
      {
        name: "--lf-messenger-color-on-bg",
        docs: "Text on background. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg))",
      },
      {
        name: "--lf-messenger-color-on-primary",
        docs: "Text on primary surfaces. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
      },
      {
        name: "--lf-messenger-color-on-surface",
        docs: "Text on surface. Defaults to => var(--lf-state-on-surface, var(--lf-color-on-surface))",
      },
      {
        name: "--lf-messenger-color-primary",
        docs: "Primary accent color. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-messenger-color-surface",
        docs: "Surface color for panels and elements. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
      },
      {
        name: "--lf-messenger-customization-title-padding",
        docs: "Padding for customization titles. Defaults to => 0.5em",
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
        docs: "Background color for name areas. Defaults to => rgb(var(--lf-color-surface))",
      },
      {
        name: "--lf-messenger-name-height",
        docs: "Height for character name area. Defaults to => 3em",
      },
      {
        name: "--lf-messenger-portrait-foredrop-color",
        docs: "Color for portrait foredrop effect. Defaults to => rgba(var(--lf-color-bg), 0.275)",
      },
    ],
  },
  "lf-multiinput": {
    methods: [
      {
        name: "addToHistory",
        docs: "",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(value: string) => Promise<void>",
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
        name: "getHistory",
        docs: "",
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
          type: "Promise<LfMultiInputPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfMultiInputPropsInterface>",
      },
      {
        name: "getState",
        docs: "",
        returns: {
          type: "Promise<{ value: string; history: string[]; }>",
          docs: "",
        },
        signature: "() => Promise<{ value: string; history: string[]; }>",
      },
      {
        name: "getValue",
        docs: "",
        returns: {
          type: "Promise<string>",
          docs: "",
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
        name: "setHistory",
        docs: "",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(values: string[]) => Promise<void>",
      },
      {
        name: "setValue",
        docs: "",
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
        name: "lfAllowFreeInput",
        docs: "When false, values must match an entry in the history dataset to be accepted on commit.",
        type: "boolean",
      },
      {
        name: "lfChipProps",
        docs: "Props forwarded to the internal lf-chip history row.",
        type: '{ lfEvent?: { emit: (payload: LfChipEventPayload) => void; }; expandedNodes?: Set<LfDataNode>; selectedNodes?: Set<LfDataNode>; getSelectedNodes?: () => Promise<Set<LfDataNode>>; setSelectedNodes?: (nodes: (string[] | LfDataNode[]) & any[]) => Promise<void>; rootElement?: LfChipElement; debugInfo?: LfDebugLifecycleInfo; getDebugInfo?: () => Promise<LfDebugLifecycleInfo>; getProps?: (descriptions?: boolean) => Promise<LfComponentPropsFor<"LfAccordion" | "LfToggle" | "LfArticle" | "LfAutocomplete" | "LfBadge" | "LfBreadcrumbs" | "LfButton" | "LfCanvas" | "LfCard" | "LfCarousel" | "LfChart" | "LfChat" | "LfCheckbox" | "LfChip" | "LfCode" | "LfCompare" | "LfDrawer" | "LfHeader" | "LfImage" | "LfList" | "LfMasonry" | "LfMessenger" | "LfMultiInput" | "LfPhotoframe" | "LfPlaceholder" | "LfProgressbar" | "LfRadio" | "LfSelect" | "LfShapeeditor" | "LfSlider" | "LfSnackbar" | "LfSpinner" | "LfSplash" | "LfTabbar" | "LfTextfield" | "LfToast" | "LfTree" | "LfTypewriter" | "LfUpload">>; lfStyle?: string; refresh?: () => Promise<void>; unmount?: (ms?: number) => Promise<void>; lfAriaLabel?: string; lfDataset?: LfDataDataset; lfFlat?: boolean; lfRipple?: boolean; lfShowSpinner?: boolean; lfStyling?: "input" | "choice" | "filter" | "standard"; lfUiSize?: "large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"; lfUiState?: "danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"; lfValue?: string[]; }',
      },
      {
        name: "lfDataset",
        docs: "Dataset backing the history chips. Nodes are treated as the source of truth.",
        type: "LfDataDataset",
      },
      {
        name: "lfMaxHistory",
        docs: "Maximum number of history entries to retain.",
        type: "number",
      },
      {
        name: "lfMode",
        docs: 'Behaviour mode for the component.\n- "history": single-value + commit history (default).\n- "tags": tag selection where the value is a comma-separated list of tags.',
        type: '"history" | "tags"',
      },
      {
        name: "lfStyle",
        docs: "Custom CSS string injected into the component shadow root.",
        type: "string",
      },
      {
        name: "lfTextfieldProps",
        docs: "Props forwarded to the internal lf-textfield input.",
        type: '{ lfEvent?: { emit: (payload: LfTextfieldEventPayload) => void; }; status?: Set<"disabled" | "filled" | "focused" | "full-width" | "has-icon" | "has-label">; value?: string; formatJSON?: () => Promise<void>; getElement?: () => Promise<HTMLInputElement | HTMLTextAreaElement>; getValue?: () => Promise<string>; setBlur?: () => Promise<void>; setFocus?: () => Promise<void>; setValue?: (value: string) => Promise<void>; rootElement?: LfTextfieldElement; debugInfo?: LfDebugLifecycleInfo; getDebugInfo?: () => Promise<LfDebugLifecycleInfo>; getProps?: (descriptions?: boolean) => Promise<LfComponentPropsFor<"LfAccordion" | "LfToggle" | "LfArticle" | "LfAutocomplete" | "LfBadge" | "LfBreadcrumbs" | "LfButton" | "LfCanvas" | "LfCard" | "LfCarousel" | "LfChart" | "LfChat" | "LfCheckbox" | "LfChip" | "LfCode" | "LfCompare" | "LfDrawer" | "LfHeader" | "LfImage" | "LfList" | "LfMasonry" | "LfMessenger" | "LfMultiInput" | "LfPhotoframe" | "LfPlaceholder" | "LfProgressbar" | "LfRadio" | "LfSelect" | "LfShapeeditor" | "LfSlider" | "LfSnackbar" | "LfSpinner" | "LfSplash" | "LfTabbar" | "LfTextfield" | "LfToast" | "LfTree" | "LfTypewriter" | "LfUpload">>; lfStyle?: string; refresh?: () => Promise<void>; unmount?: (ms?: number) => Promise<void>; lfCaptureShortcuts?: boolean; lfFormatJSON?: LfTextfieldFormatJSON; lfHelper?: LfTextfieldHelper; lfHtmlAttributes?: Partial<LfFrameworkAllowedKeysMap>; lfIcon?: LfIconType; lfLabel?: string; lfStretchY?: boolean; lfStyling?: "flat" | "outlined" | "raised" | "textarea"; lfTrailingIcon?: boolean; lfTrailingIconAction?: LfTextfieldTrailingIconAction; lfUiSize?: "large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"; lfUiState?: "danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"; lfValue?: string; }',
      },
      {
        name: "lfUiSize",
        docs: "UI size token propagated to children.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUiState",
        docs: "UI state token propagated to children.",
        type: '"danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"',
      },
      {
        name: "lfValue",
        docs: "Initial string value for the textfield.",
        type: "string",
      },
    ],
    styles: [
      {
        name: "--lf-multiinput-color-border",
        docs: "Border color for the component. Defaults to => var(--lf-state-border, var(--lf-color-border))",
      },
      {
        name: "--lf-multiinput-color-on-bg",
        docs: "Color for text on background. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg)) Layout variables:",
      },
      {
        name: "--lf-multiinput-color-on-primary",
        docs: "Color for content on primary backgrounds. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
      },
      {
        name: "--lf-multiinput-color-on-surface",
        docs: "Color for content on surface backgrounds. Defaults to => var(--lf-state-on-surface, var(--lf-color-on-surface))",
      },
      {
        name: "--lf-multiinput-color-primary",
        docs: "Primary color for focus states. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-multiinput-color-surface",
        docs: "Surface background color. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
      },
      {
        name: "--lf-multiinput-font-family",
        docs: "Sets the primary font family for the multiinput component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-multiinput-font-size",
        docs: "Sets the font size for the multiinput component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-multiinput-gap",
        docs: "Gap between textfield and history area. Defaults to => 0.5em",
      },
      {
        name: "--lf-multiinput-history-gap",
        docs: "Gap between chips in the history area. Defaults to => 0.5em",
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
        type: '{ autocomplete?: any; placeholder?: any; name?: any; id?: any; disabled?: any; class?: any; href?: any; lfAriaLabel?: any; lfLabel?: any; lfLeadingLabel?: any; lfRipple?: any; lfStyle?: any; lfUiSize?: any; lfUiState?: any; lfValue?: any; lfDataset?: any; lfExpanded?: any; lfImageProps?: any; lfPosition?: any; lfIcon?: any; lfIconOff?: any; lfShowSpinner?: any; lfStretchX?: any; lfStretchY?: any; lfStyling?: any; lfToggable?: any; lfTrailingIcon?: any; lfType?: any; lfAutoResize?: any; lfBrush?: any; lfColor?: any; lfCursor?: any; lfOpacity?: any; lfPreview?: any; lfSize?: any; lfStrokeTolerance?: any; lfLayout?: any; lfSizeX?: any; lfSizeY?: any; lfAxis?: any; lfColors?: any; lfLegend?: any; lfSeries?: any; lfTypes?: any; lfXAxis?: any; lfYAxis?: any; lfConfig?: any; lfToolHandlers?: any; lfUploadCallback?: any; lfFlat?: any; lfFadeIn?: any; lfFormat?: any; lfLanguage?: any; lfPreserveSpaces?: any; lfShowCopy?: any; lfShowHeader?: any; lfStickyHeader?: any; lfHtmlAttributes?: any; lfOverlay?: any; lfPlaceholder?: any; lfThreshold?: any; lfAnimated?: any; lfCenteredLabel?: any; lfIsRadial?: any; lfCaptureShortcuts?: any; lfFormatJSON?: any; lfHelper?: any; lfTrailingIconAction?: any; lfDeleteSpeed?: any; lfLoop?: any; lfPause?: any; lfSpeed?: any; lfTag?: any; lfUpdatable?: any; lfEmpty?: any; lfAllowFreeInput?: any; lfCache?: any; lfCacheTTL?: any; lfDebounceMs?: any; lfListProps?: any; lfMaxCacheSize?: any; lfMinChars?: any; lfNavigation?: any; lfSpinnerProps?: any; lfTextfieldProps?: any; lfInteractive?: any; lfMaxItems?: any; lfSeparator?: any; lfShowRoot?: any; lfAutoPlay?: any; lfInterval?: any; lfLightbox?: any; lfShape?: any; lfView?: any; lfDisplay?: any; lfResponsive?: any; lfEnableDeletions?: any; lfFilter?: any; lfSelectable?: any; lfActions?: any; lfCollapseColumns?: any; lfColumns?: any; lfAutosave?: any; lfChipProps?: any; lfMaxHistory?: any; lfMode?: any; lfProps?: any; lfTrigger?: any; lfOrientation?: any; lfLoadCallback?: any; lfMax?: any; lfMin?: any; lfStep?: any; lfAction?: any; lfActionCallback?: any; lfCloseIcon?: any; lfDuration?: any; lfMessage?: any; lfActive?: any; lfBarVariant?: any; lfFader?: any; lfFaderTimeout?: any; lfFullScreen?: any; lfTimeout?: any; lfCloseCallback?: any; lfTimer?: any; lfAccordionLayout?: any; lfExpandedNodeIds?: any; lfInitialExpansionDepth?: any; lfGrid?: any; lfSelectedNodeIds?: any; value?: any; htmlProps?: any; accept?: any; "accept-charset"?: any; alt?: any; autofocus?: any; checked?: any; dataset?: any; max?: any; maxLength?: any; min?: any; minLength?: any; multiple?: any; readonly?: any; role?: any; src?: any; srcset?: any; step?: any; title?: any; type?: any; "aria-"?: any; "data-"?: any; }',
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
        type: '{ autocomplete?: any; placeholder?: any; name?: any; id?: any; disabled?: any; class?: any; href?: any; lfAriaLabel?: any; lfLabel?: any; lfLeadingLabel?: any; lfRipple?: any; lfStyle?: any; lfUiSize?: any; lfUiState?: any; lfValue?: any; lfDataset?: any; lfExpanded?: any; lfImageProps?: any; lfPosition?: any; lfIcon?: any; lfIconOff?: any; lfShowSpinner?: any; lfStretchX?: any; lfStretchY?: any; lfStyling?: any; lfToggable?: any; lfTrailingIcon?: any; lfType?: any; lfAutoResize?: any; lfBrush?: any; lfColor?: any; lfCursor?: any; lfOpacity?: any; lfPreview?: any; lfSize?: any; lfStrokeTolerance?: any; lfLayout?: any; lfSizeX?: any; lfSizeY?: any; lfAxis?: any; lfColors?: any; lfLegend?: any; lfSeries?: any; lfTypes?: any; lfXAxis?: any; lfYAxis?: any; lfConfig?: any; lfToolHandlers?: any; lfUploadCallback?: any; lfFlat?: any; lfFadeIn?: any; lfFormat?: any; lfLanguage?: any; lfPreserveSpaces?: any; lfShowCopy?: any; lfShowHeader?: any; lfStickyHeader?: any; lfHtmlAttributes?: any; lfOverlay?: any; lfPlaceholder?: any; lfThreshold?: any; lfAnimated?: any; lfCenteredLabel?: any; lfIsRadial?: any; lfCaptureShortcuts?: any; lfFormatJSON?: any; lfHelper?: any; lfTrailingIconAction?: any; lfDeleteSpeed?: any; lfLoop?: any; lfPause?: any; lfSpeed?: any; lfTag?: any; lfUpdatable?: any; lfEmpty?: any; lfAllowFreeInput?: any; lfCache?: any; lfCacheTTL?: any; lfDebounceMs?: any; lfListProps?: any; lfMaxCacheSize?: any; lfMinChars?: any; lfNavigation?: any; lfSpinnerProps?: any; lfTextfieldProps?: any; lfInteractive?: any; lfMaxItems?: any; lfSeparator?: any; lfShowRoot?: any; lfAutoPlay?: any; lfInterval?: any; lfLightbox?: any; lfShape?: any; lfView?: any; lfDisplay?: any; lfResponsive?: any; lfEnableDeletions?: any; lfFilter?: any; lfSelectable?: any; lfActions?: any; lfCollapseColumns?: any; lfColumns?: any; lfAutosave?: any; lfChipProps?: any; lfMaxHistory?: any; lfMode?: any; lfProps?: any; lfTrigger?: any; lfOrientation?: any; lfLoadCallback?: any; lfMax?: any; lfMin?: any; lfStep?: any; lfAction?: any; lfActionCallback?: any; lfCloseIcon?: any; lfDuration?: any; lfMessage?: any; lfActive?: any; lfBarVariant?: any; lfFader?: any; lfFaderTimeout?: any; lfFullScreen?: any; lfTimeout?: any; lfCloseCallback?: any; lfTimer?: any; lfAccordionLayout?: any; lfExpandedNodeIds?: any; lfInitialExpansionDepth?: any; lfGrid?: any; lfSelectedNodeIds?: any; value?: any; htmlProps?: any; accept?: any; "accept-charset"?: any; alt?: any; autofocus?: any; checked?: any; dataset?: any; max?: any; maxLength?: any; min?: any; minLength?: any; multiple?: any; readonly?: any; role?: any; src?: any; srcset?: any; step?: any; title?: any; type?: any; "aria-"?: any; "data-"?: any; }',
      },
    ],
    styles: [
      {
        name: "--lf-photoframe-aspect-ratio",
        docs: "Aspect ratio for the frame. Defaults to => auto",
      },
      {
        name: "--lf-photoframe-border-radius",
        docs: "Border radius for the frame. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-photoframe-color-bg",
        docs: "Background color for overlay. Defaults to => var(--lf-state-bg, var(--lf-color-bg))",
      },
      {
        name: "--lf-photoframe-color-on-bg",
        docs: "Text color on overlay. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg))",
      },
      {
        name: "--lf-photoframe-color-on-surface",
        docs: "Icon color on surface. Defaults to => var(--lf-state-on-surface, var(--lf-color-on-surface))",
      },
      {
        name: "--lf-photoframe-color-surface",
        docs: "Surface background for icon fallback. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
      },
      {
        name: "--lf-photoframe-description-size",
        docs: "Font size for description. Defaults to => 0.875em",
      },
      {
        name: "--lf-photoframe-fit",
        docs: "Object fit for the image. Defaults to => cover",
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
        name: "--lf-photoframe-height",
        docs: "Height for the frame. Defaults to => auto",
      },
      {
        name: "--lf-photoframe-overlay-align",
        docs: "Alignment for overlay content. Defaults to => flex-end",
      },
      {
        name: "--lf-photoframe-overlay-justify",
        docs: "Justify content for overlay. Defaults to => flex-end",
      },
      {
        name: "--lf-photoframe-overlay-opacity",
        docs: "Opacity for the overlay. Defaults to => 0",
      },
      {
        name: "--lf-photoframe-overlay-opacity-hover",
        docs: "Opacity on hover. Defaults to => 1",
      },
      {
        name: "--lf-photoframe-overlay-padding",
        docs: "Padding for overlay content. Defaults to => 1em",
      },
      {
        name: "--lf-photoframe-position",
        docs: "Object position for the image. Defaults to => center",
      },
      {
        name: "--lf-photoframe-title-size",
        docs: "Font size for title. Defaults to => 1.125em",
      },
      {
        name: "--lf-photoframe-title-weight",
        docs: "Font weight for title. Defaults to => 600",
      },
      {
        name: "--lf-photoframe-width",
        docs: "Width for the frame. Defaults to => auto",
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
        type: '"article" | "checkbox" | "code" | "list" | "select" | "upload" | "id" | "copy" | "download" | "edit" | "refresh" | "settings" | "search" | "ai" | "brush" | "bug" | "bulb" | "camera" | "candle" | "check" | "door" | "droplet" | "file" | "flare" | "folder" | "forms" | "help" | "highlight" | "history" | "home" | "hourglass" | "ikosaedr" | "json" | "key" | "link" | "loader" | "lock" | "maximize" | "messages" | "microphone" | "moon" | "movie" | "music" | "network" | "notification" | "numbers" | "palette" | "pdf" | "photo" | "progress" | "replace" | "robot" | "schema" | "send" | "shirt" | "skew" | "sparkles" | "slideshow" | "temperature" | "template" | "tooltip" | "wand" | "writing" | "x" | "zip" | "adjustments-horizontal" | "alert-triangle" | "arrow-autofit-content" | "arrow-back" | "bell-ringing" | "brand-facebook" | "brand-github" | "brand-github-copilot" | "brand-instagram" | "brand-linkedin" | "brand-npm" | "brand-reddit" | "brand-x" | "calendar-clock" | "camera-ai" | "caret-down" | "caret-left" | "caret-right" | "caret-up" | "chart-column" | "chart-histogram" | "chevron-compact-down" | "chevron-compact-left" | "chevron-compact-right" | "chevron-compact-up" | "chevron-down" | "chevron-left" | "chevron-right" | "chevrons-down" | "chevrons-left" | "chevrons-right" | "chevrons-up" | "chevron-up" | "circle-arrow-down" | "circle-arrow-left" | "circle-arrow-right" | "circle-arrow-up" | "circle-caret-down" | "circle-caret-left" | "circle-caret-right" | "circle-caret-up" | "circle-chevron-down" | "circle-chevron-left" | "circle-chevron-right" | "circle-chevron-up" | "circle-x" | "code-circle-2" | "color-swatch" | "columns-2" | "contrast-2" | "copy-check" | "drag-drop" | "exclamation-circle" | "filter-search" | "folder-open" | "hexagon-alert" | "hexagon-info" | "hexagon-minus" | "hexagon-minus-2" | "hexagon-photo" | "hexagon-plus" | "hexagon-plus-2" | "hourglass-low" | "image-in-picture" | "inner-shadow-bottom" | "input-search" | "layout-board-split" | "layout-list" | "layout-navbar" | "layout-navbar-inactive" | "layout-sidebar" | "lf-signature" | "lf-website" | "link-plus" | "list-tree" | "loader-2" | "loader-3" | "menu-2" | "message-circle-user" | "off-brush" | "off-hexagon" | "off-highlight" | "off-id" | "off-microphone" | "off-moon" | "off-notification" | "off-palette" | "off-replace" | "off-search" | "off-send" | "off-template" | "percentage-60" | "photo-search" | "photo-x" | "picture-in-picture-top" | "player-record" | "player-stop" | "playstation-circle" | "playstation-square" | "playstation-triangle" | "playstation-x" | "route-2" | "share-2" | "square-toggle" | "square-x" | "stack-pop" | "stack-push" | "stopwatch" | "sunset-2" | "terminal-2" | "time-duration-30" | "toggle-right" | "viewport-tall" | "viewport-wide"',
      },
      {
        name: "lfProps",
        docs: "Sets the props of the component to be placeholder loaded.",
        type: "LfAccordionPropsInterface | LfTogglePropsInterface | LfBadgePropsInterface | LfButtonPropsInterface | LfCanvasPropsInterface | LfCardPropsInterface | LfChartPropsInterface | LfChatPropsInterface | LfChipPropsInterface | LfCodePropsInterface | LfImagePropsInterface | LfPhotoframePropsInterface | LfProgressbarPropsInterface | LfTextfieldPropsInterface | LfTypewriterPropsInterface | LfUploadPropsInterface | LfArticlePropsInterface | LfAutocompletePropsInterface | LfBreadcrumbsPropsInterface | LfCarouselPropsInterface | LfCheckboxPropsInterface | LfComparePropsInterface | LfDrawerPropsInterface | LfHeaderPropsInterface | LfListPropsInterface | LfMasonryPropsInterface | LfMessengerPropsInterface | LfMultiInputPropsInterface | LfPlaceholderPropsInterface | LfRadioPropsInterface | LfSelectPropsInterface | LfShapeeditorPropsInterface | LfSliderPropsInterface | LfSnackbarPropsInterface | LfSpinnerPropsInterface | LfSplashPropsInterface | LfTabbarPropsInterface | LfToastPropsInterface | LfTreePropsInterface",
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
        docs: "Decides when the sub-component should be rendered.\nBy default when both the component props exist and the component is in the viewport.",
        type: '"both" | "props" | "viewport"',
      },
      {
        name: "lfValue",
        docs: "Sets the tag name of the component to be placeholder loaded.",
        type: '"LfAccordion" | "LfToggle" | "LfArticle" | "LfAutocomplete" | "LfBadge" | "LfBreadcrumbs" | "LfButton" | "LfCanvas" | "LfCard" | "LfCarousel" | "LfChart" | "LfChat" | "LfCheckbox" | "LfChip" | "LfCode" | "LfCompare" | "LfDrawer" | "LfHeader" | "LfImage" | "LfList" | "LfMasonry" | "LfMessenger" | "LfMultiInput" | "LfPhotoframe" | "LfPlaceholder" | "LfProgressbar" | "LfRadio" | "LfSelect" | "LfShapeeditor" | "LfSlider" | "LfSnackbar" | "LfSpinner" | "LfSplash" | "LfTabbar" | "LfTextfield" | "LfToast" | "LfTree" | "LfTypewriter" | "LfUpload"',
      },
    ],
    styles: [
      {
        name: "--lf-placeholder-border-radius",
        docs: "Border radius for the placeholder. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-placeholder-color-on-surface",
        docs: "Text color on surface. Defaults to => var(--lf-state-on-surface, var(--lf-color-on-surface))",
      },
      {
        name: "--lf-placeholder-color-primary",
        docs: "Primary/icon color. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-placeholder-color-surface",
        docs: "Surface background color. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
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
        name: "--lf-placeholder-height",
        docs: "Height for the placeholder. Defaults to => 100%",
      },
      {
        name: "--lf-placeholder-icon-size",
        docs: "Size for the animated icon. Defaults to => 3em",
      },
      {
        name: "--lf-placeholder-min-height",
        docs: "Minimum height. Defaults to => 3em",
      },
      {
        name: "--lf-placeholder-min-width",
        docs: "Minimum width. Defaults to => 3em",
      },
      {
        name: "--lf-placeholder-padding",
        docs: "Padding for the placeholder. Defaults to => 1em",
      },
      {
        name: "--lf-placeholder-width",
        docs: "Width for the placeholder. Defaults to => 100%",
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
        docs: "Displays the label in the middle of the progress bar.\nIt's the default for the radial variant and can't be changed.",
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
        docs: "Height for linear progressbar. Defaults to => 0.5em",
      },
      {
        name: "--lf-progressbar-radial-size",
        docs: "Size for radial progressbar. Defaults to => 4em",
      },
      {
        name: "--lf-progressbar-radial-thickness",
        docs: "Stroke thickness for radial. Defaults to => 0.375em",
      },
      {
        name: "--lf-progressbar-radial-value-size",
        docs: "Font size for center value. Defaults to => 1em",
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
        docs: "Border color of the radio circle. Defaults to => rgba(var(--lf-color-on-bg), 0.6)",
      },
      {
        name: "--lf-radio-circle-border-width",
        docs: "Border width of the radio circle. Defaults to => 2px",
      },
      {
        name: "--lf-radio-circle-hover-border-color",
        docs: "Border color on hover. Defaults to => rgba(var(--lf-color-primary), 0.875)",
      },
      {
        name: "--lf-radio-circle-selected-border-color",
        docs: "Border color when selected. Defaults to => rgba(var(--lf-color-primary), 1)",
      },
      {
        name: "--lf-radio-color-on-bg",
        docs: "Text color for labels. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg))",
      },
      {
        name: "--lf-radio-color-primary",
        docs: "Primary color for selected/active states. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-radio-control-size",
        docs: "Size of the radio control. Defaults to => 1.25em",
      },
      {
        name: "--lf-radio-dot-background-color",
        docs: "Background color of selected dot. Defaults to => rgba(var(--lf-color-primary), 1)",
      },
      {
        name: "--lf-radio-dot-border-width",
        docs: "Border width of the dot. Defaults to => 0.5em",
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
        docs: "Gap between radio items in the group. Defaults to => 1em",
      },
      {
        name: "--lf-radio-group-horizontal-gap",
        docs: "Gap between items in horizontal orientation. Defaults to => 1.25em",
      },
      {
        name: "--lf-radio-hover-border-color",
        docs: "Control border color on hover. Defaults to => rgba(var(--lf-color-primary), 0.5)",
      },
      {
        name: "--lf-radio-item-gap",
        docs: "Gap between radio control and label. Defaults to => var(--lf-space-03)",
      },
      {
        name: "--lf-radio-item-selected-color",
        docs: "Color for selected radio items. Defaults to => rgba(var(--lf-color-primary), 1)",
      },
      {
        name: "--lf-radio-label-color",
        docs: "Label text color. Defaults to => rgba(var(--lf-color-on-bg), 0.87)",
      },
      {
        name: "--lf-radio-label-font-size",
        docs: "Label font size. Defaults to => 1em",
      },
      {
        name: "--lf-radio-label-font-weight",
        docs: "Label font weight. Defaults to => 500",
      },
      {
        name: "--lf-radio-label-line-height",
        docs: "Label line height. Defaults to => 1.5",
      },
      {
        name: "--lf-radio-label-padding",
        docs: "Label padding. Defaults to => 0.75em",
      },
      {
        name: "--lf-radio-label-padding-leading",
        docs: "Label padding in leading position. Defaults to => 0.75em",
      },
      {
        name: "--lf-radio-label-selected-color",
        docs: "Label color when selected. Defaults to => rgba(var(--lf-color-primary), 1)",
      },
      {
        name: "--lf-radio-label-selected-font-weight",
        docs: "Label font weight when selected. Defaults to => 600",
      },
      {
        name: "--lf-radio-ripple-size",
        docs: "Size of the ripple effect. Defaults to => 2.5em",
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
        docs: "Sets the dataset containing the selectable options.\r\nThis property is immutable after the component has loaded.",
        type: "LfDataDataset",
      },
      {
        name: "lfListProps",
        docs: "Sets the props for the internal lf-list component.",
        type: '{ lfEvent?: { emit: (payload: LfListEventPayload) => void; }; applyFilter?: (value: string) => Promise<void>; focusNext?: () => Promise<void>; focusPrevious?: () => Promise<void>; getSelected?: () => Promise<LfDataNode>; selectNode?: (idx: number) => Promise<void>; selectNodeById?: (id: string) => Promise<void>; setFilter?: (value: string) => Promise<void>; rootElement?: LfListElement; debugInfo?: LfDebugLifecycleInfo; getDebugInfo?: () => Promise<LfDebugLifecycleInfo>; getProps?: (descriptions?: boolean) => Promise<LfComponentPropsFor<"LfAccordion" | "LfToggle" | "LfArticle" | "LfAutocomplete" | "LfBadge" | "LfBreadcrumbs" | "LfButton" | "LfCanvas" | "LfCard" | "LfCarousel" | "LfChart" | "LfChat" | "LfCheckbox" | "LfChip" | "LfCode" | "LfCompare" | "LfDrawer" | "LfHeader" | "LfImage" | "LfList" | "LfMasonry" | "LfMessenger" | "LfMultiInput" | "LfPhotoframe" | "LfPlaceholder" | "LfProgressbar" | "LfRadio" | "LfSelect" | "LfShapeeditor" | "LfSlider" | "LfSnackbar" | "LfSpinner" | "LfSplash" | "LfTabbar" | "LfTextfield" | "LfToast" | "LfTree" | "LfTypewriter" | "LfUpload">>; lfStyle?: string; refresh?: () => Promise<void>; unmount?: (ms?: number) => Promise<void>; lfDataset?: LfDataDataset; lfEmpty?: string; lfEnableDeletions?: boolean; lfFilter?: boolean; lfNavigation?: boolean; lfRipple?: boolean; lfSelectable?: boolean; lfUiSize?: "large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"; lfUiState?: "danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"; lfValue?: number; }',
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
        type: '{ lfEvent?: { emit: (payload: LfTextfieldEventPayload) => void; }; status?: Set<"disabled" | "filled" | "focused" | "full-width" | "has-icon" | "has-label">; value?: string; formatJSON?: () => Promise<void>; getElement?: () => Promise<HTMLInputElement | HTMLTextAreaElement>; getValue?: () => Promise<string>; setBlur?: () => Promise<void>; setFocus?: () => Promise<void>; setValue?: (value: string) => Promise<void>; rootElement?: LfTextfieldElement; debugInfo?: LfDebugLifecycleInfo; getDebugInfo?: () => Promise<LfDebugLifecycleInfo>; getProps?: (descriptions?: boolean) => Promise<LfComponentPropsFor<"LfAccordion" | "LfToggle" | "LfArticle" | "LfAutocomplete" | "LfBadge" | "LfBreadcrumbs" | "LfButton" | "LfCanvas" | "LfCard" | "LfCarousel" | "LfChart" | "LfChat" | "LfCheckbox" | "LfChip" | "LfCode" | "LfCompare" | "LfDrawer" | "LfHeader" | "LfImage" | "LfList" | "LfMasonry" | "LfMessenger" | "LfMultiInput" | "LfPhotoframe" | "LfPlaceholder" | "LfProgressbar" | "LfRadio" | "LfSelect" | "LfShapeeditor" | "LfSlider" | "LfSnackbar" | "LfSpinner" | "LfSplash" | "LfTabbar" | "LfTextfield" | "LfToast" | "LfTree" | "LfTypewriter" | "LfUpload">>; lfStyle?: string; refresh?: () => Promise<void>; unmount?: (ms?: number) => Promise<void>; lfCaptureShortcuts?: boolean; lfFormatJSON?: LfTextfieldFormatJSON; lfHelper?: LfTextfieldHelper; lfHtmlAttributes?: Partial<LfFrameworkAllowedKeysMap>; lfIcon?: LfIconType; lfLabel?: string; lfStretchY?: boolean; lfStyling?: "flat" | "outlined" | "raised" | "textarea"; lfTrailingIcon?: boolean; lfTrailingIconAction?: LfTextfieldTrailingIconAction; lfUiSize?: "large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"; lfUiState?: "danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"; lfValue?: string; }',
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
        docs: "Sets the initial selected value.\r\nNon-mutable after component load.",
        type: "number | string",
      },
    ],
    styles: [
      {
        name: "--lf-select-color-bg",
        docs: "Background color for the select. Defaults to => var(--lf-state-bg, var(--lf-color-bg))",
      },
      {
        name: "--lf-select-color-border",
        docs: "Border color for the select. Defaults to => var(--lf-color-border)",
      },
      {
        name: "--lf-select-color-on-bg",
        docs: "Text/icon color on background. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg))",
      },
      {
        name: "--lf-select-color-on-primary",
        docs: "Text color on primary surfaces. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
      },
      {
        name: "--lf-select-color-on-surface",
        docs: "Text color on surface. Defaults to => var(--lf-state-on-surface, var(--lf-color-on-surface))",
      },
      {
        name: "--lf-select-color-primary",
        docs: "Primary color for focus/hover states. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-select-color-surface",
        docs: "Surface color for dropdown background. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
      },
      {
        name: "--lf-select-font-family",
        docs: "Sets the primary font family for the select component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-select-font-size",
        docs: "Sets the font size for the select component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-select-input-cursor",
        docs: "Cursor style for the input. Defaults to => pointer",
      },
      {
        name: "--lf-select-transition-duration",
        docs: "Transition duration for hover/focus. Defaults to => 0.2s",
      },
    ],
  },
  "lf-shapeeditor": {
    methods: [
      {
        name: "addSnapshot",
        docs: "Appends a new snapshot to the current shape's history with updated cell properties.\nThis is shape-agnostic and works with any cell type.\nIt has no effect when the current shape is not set.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(props: Record<string, unknown>) => Promise<void>",
      },
      {
        name: "clearHistory",
        docs: "Clears the history related to the shape identified by the index.\nWhen index is not provided, it clear the full history.",
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
          type: "Promise<LfShapeeditorAdapterRefs>",
          docs: "",
        },
        signature: "() => Promise<LfShapeeditorAdapterRefs>",
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
        name: "getDsl",
        docs: "Returns the full DSL configuration including behavioral metadata.\nConsumers can use this to read the current filter's behavior type,\ncommit trigger, and button visibility flags.",
        returns: {
          type: "Promise<LfShapeeditorConfigDsl>",
          docs: "The current DSL or null if not set.",
        },
        signature: "() => Promise<LfShapeeditorConfigDsl | null>",
      },
      {
        name: "getProps",
        docs: "Used to retrieve component's properties and descriptions.",
        returns: {
          type: "Promise<LfShapeeditorPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfShapeeditorPropsInterface>",
      },
      {
        name: "getSettings",
        docs: "Returns the current configuration settings.",
        returns: {
          type: "Promise<LfShapeeditorConfigSettings>",
          docs: "The current settings object.",
        },
        signature: "() => Promise<LfShapeeditorConfigSettings>",
      },
      {
        name: "getShapeElement",
        docs: "Returns the underlying shape element (e.g., lf-canvas, lf-image, lf-chart) in the preview area.\nUseful for programmatic access to shape-specific methods like brush settings on canvas.",
        returns: {
          type: "Promise<Element>",
          docs: "The shape element, or null if not found.",
        },
        signature: "() => Promise<Element | null>",
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
        name: "resetControls",
        docs: "Resets all controls to their default values as defined in the control configurations.\nOnly resets controls that have a defaultValue defined.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "() => Promise<void>",
      },
      {
        name: "setPreviewValue",
        docs: "Sets a temporary preview value that overrides the current snapshot.\nPass null to clear the preview and show the actual snapshot value.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature: "(value: string | null) => Promise<void>",
      },
      {
        name: "setProgressbar",
        docs: "Updates the progress bar state.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature:
          "(state: Partial<LfShapeeditorProgressbarState>) => Promise<void>",
      },
      {
        name: "setSettings",
        docs: "Updates the configuration settings programmatically.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature:
          "(settings: LfShapeeditorConfigSettings, replace?: boolean) => Promise<void>",
      },
      {
        name: "setSnackbar",
        docs: "Updates the snackbar state.",
        returns: {
          type: "Promise<void>",
          docs: "",
        },
        signature:
          "(state: Partial<LfShapeeditorSnackbarState>) => Promise<void>",
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
        docs: "The data set for the LF Shapeeditor component.\nThis property is mutable, meaning it can be changed after the component is initialized.",
        type: "LfDataDataset",
      },
      {
        name: "lfLoadCallback",
        docs: "Callback invoked when the load button is clicked.",
        type: "(shapeeditor: LfShapeeditorInterface, dir: string) => Promise<void>",
      },
      {
        name: "lfNavigation",
        docs: "Configuration options for the navigation panel.",
        type: "LfShapeeditorNavigation",
      },
      {
        name: "lfShape",
        docs: "The shape type to render in the preview area.\nDetermines which LfShape component is used for preview.",
        type: '"accordion" | "badge" | "button" | "canvas" | "card" | "chart" | "chat" | "chip" | "code" | "image" | "number" | "photoframe" | "progressbar" | "slot" | "text" | "textfield" | "toggle" | "typewriter" | "upload"',
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
        name: "--lf-shapeeditor-actions-gap",
        docs: "Sets the gap between action items. Defaults to => 0",
      },
      {
        name: "--lf-shapeeditor-actions-padding",
        docs: "Sets the padding for the actions area. Defaults to => 0",
      },
      {
        name: "--lf-shapeeditor-chart-min-height",
        docs: "Sets the minimum height for chart previews. Defaults to => 150px",
      },
      {
        name: "--lf-shapeeditor-color-bg",
        docs: "Sets the color-bg color for the shapeeditor component. Defaults to => var(--lf-color-bg)",
      },
      {
        name: "--lf-shapeeditor-color-border",
        docs: "Border color for panels and elements. Defaults to => var(--lf-state-border, var(--lf-color-border))",
      },
      {
        name: "--lf-shapeeditor-color-on-bg",
        docs: "Sets the color-on-bg color for the shapeeditor component. Defaults to => var(--lf-color-on-bg)",
      },
      {
        name: "--lf-shapeeditor-color-on-primary",
        docs: "Text on primary surfaces. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
      },
      {
        name: "--lf-shapeeditor-color-on-surface",
        docs: "Text on surface. Defaults to => var(--lf-state-on-surface, var(--lf-color-on-surface))",
      },
      {
        name: "--lf-shapeeditor-color-primary",
        docs: "Primary accent color. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-shapeeditor-color-surface",
        docs: "Surface color for panels. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
      },
      {
        name: "--lf-shapeeditor-control-actions-padding",
        docs: "Sets the padding for the control actions area. Defaults to => 0",
      },
      {
        name: "--lf-shapeeditor-font-family",
        docs: "Sets the primary font family for the shapeeditor component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-shapeeditor-font-size",
        docs: "Sets the font size for the shapeeditor component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-shapeeditor-history-padding",
        docs: "Sets the padding for the history panel. Defaults to => 0",
      },
      {
        name: "--lf-shapeeditor-history-width",
        docs: "Sets the width for the history panel. Defaults to => 180px",
      },
      {
        name: "--lf-shapeeditor-nav-ratio",
        docs: "Sets the navigation column width ratio. Defaults to => 0.3 (30%)",
      },
      {
        name: "--lf-shapeeditor-nav-width",
        docs: "Sets the width for the navigation tree panel. Defaults to => 200px",
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
        docs: "Used to retrieve the component's current state.\r\nReturns the value from the adapter's internal state.",
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
        docs: "Border radius for track and thumb. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-slider-box-shadow",
        docs: "Box shadow for track. Defaults to => 0 0.25em 0.5em rgba(var(--lf-color-on-bg), 0.2)",
      },
      {
        name: "--lf-slider-color-on-bg",
        docs: "Color for value text. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg))",
      },
      {
        name: "--lf-slider-color-primary",
        docs: "Primary color for track fill and thumb. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
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
        name: "--lf-slider-font-weight",
        docs: "Font weight for value display. Defaults to => var(--lf-font-weight-button)",
      },
      {
        name: "--lf-slider-gap",
        docs: "Gap between label and track. Defaults to => 0.5em",
      },
      {
        name: "--lf-slider-label-padding-left",
        docs: "Left padding for label. Defaults to => 0.5em",
      },
      {
        name: "--lf-slider-margin",
        docs: "Margin for slider container. Defaults to => 0 0.75em",
      },
      {
        name: "--lf-slider-min-width",
        docs: "Minimum width for slider. Defaults to => 7em",
      },
      {
        name: "--lf-slider-thumb-box-shadow",
        docs: "Box shadow for thumb. Defaults to => 0 0.25em 0.5em rgba(var(--lf-color-on-bg), 0.2)",
      },
      {
        name: "--lf-slider-thumb-height",
        docs: "Height for the thumb. Defaults to => 1.5em",
      },
      {
        name: "--lf-slider-thumb-underlay-top",
        docs: "Top position for underlay. Defaults to => -1em",
      },
      {
        name: "--lf-slider-thumb-width",
        docs: "Width for the thumb. Defaults to => 1.5em",
      },
      {
        name: "--lf-slider-track-height",
        docs: "Height for the track. Defaults to => 0.5em",
      },
      {
        name: "--lf-slider-track-margin-top",
        docs: "Top margin for track. Defaults to => 0.75em",
      },
    ],
  },
  "lf-snackbar": {
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
          type: "Promise<LfSnackbarPropsInterface>",
          docs: "Promise resolved with an object containing the component's properties.",
        },
        signature: "() => Promise<LfSnackbarPropsInterface>",
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
        name: "lfAction",
        docs: "Text label for action button. If omitted, no action button appears.",
        type: "string",
      },
      {
        name: "lfActionCallback",
        docs: "Callback invoked when the action button is clicked.\nReceives snackbar instance and pointer event.",
        type: "(snackbar: LfSnackbarInterface, e: PointerEvent, ...args: unknown[]) => unknown",
      },
      {
        name: "lfCloseIcon",
        docs: "Icon shown in the close button.",
        type: '"article" | "checkbox" | "code" | "list" | "select" | "upload" | "id" | "copy" | "download" | "edit" | "refresh" | "settings" | "search" | "--lf-icon-image" | "--lf-icon-upload" | "--lf-icon-delete" | "--lf-icon-add" | "--lf-icon-attachment" | "--lf-icon-broken-image" | "--lf-icon-clear" | "--lf-icon-copy" | "--lf-icon-copy-ok" | "--lf-icon-collapsed" | "--lf-icon-danger" | "--lf-icon-disabled" | "--lf-icon-download" | "--lf-icon-dropdown" | "--lf-icon-edit" | "--lf-icon-expanded" | "--lf-icon-info" | "--lf-icon-loading" | "--lf-icon-minus" | "--lf-icon-next" | "--lf-icon-plus" | "--lf-icon-previous" | "--lf-icon-primary" | "--lf-icon-refresh" | "--lf-icon-secondary" | "--lf-icon-settings" | "--lf-icon-success" | "--lf-icon-search" | "--lf-icon-warning" | "ai" | "brush" | "bug" | "bulb" | "camera" | "candle" | "check" | "door" | "droplet" | "file" | "flare" | "folder" | "forms" | "help" | "highlight" | "history" | "home" | "hourglass" | "ikosaedr" | "json" | "key" | "link" | "loader" | "lock" | "maximize" | "messages" | "microphone" | "moon" | "movie" | "music" | "network" | "notification" | "numbers" | "palette" | "pdf" | "photo" | "progress" | "replace" | "robot" | "schema" | "send" | "shirt" | "skew" | "sparkles" | "slideshow" | "temperature" | "template" | "tooltip" | "wand" | "writing" | "x" | "zip" | "adjustments-horizontal" | "alert-triangle" | "arrow-autofit-content" | "arrow-back" | "bell-ringing" | "brand-facebook" | "brand-github" | "brand-github-copilot" | "brand-instagram" | "brand-linkedin" | "brand-npm" | "brand-reddit" | "brand-x" | "calendar-clock" | "camera-ai" | "caret-down" | "caret-left" | "caret-right" | "caret-up" | "chart-column" | "chart-histogram" | "chevron-compact-down" | "chevron-compact-left" | "chevron-compact-right" | "chevron-compact-up" | "chevron-down" | "chevron-left" | "chevron-right" | "chevrons-down" | "chevrons-left" | "chevrons-right" | "chevrons-up" | "chevron-up" | "circle-arrow-down" | "circle-arrow-left" | "circle-arrow-right" | "circle-arrow-up" | "circle-caret-down" | "circle-caret-left" | "circle-caret-right" | "circle-caret-up" | "circle-chevron-down" | "circle-chevron-left" | "circle-chevron-right" | "circle-chevron-up" | "circle-x" | "code-circle-2" | "color-swatch" | "columns-2" | "contrast-2" | "copy-check" | "drag-drop" | "exclamation-circle" | "filter-search" | "folder-open" | "hexagon-alert" | "hexagon-info" | "hexagon-minus" | "hexagon-minus-2" | "hexagon-photo" | "hexagon-plus" | "hexagon-plus-2" | "hourglass-low" | "image-in-picture" | "inner-shadow-bottom" | "input-search" | "layout-board-split" | "layout-list" | "layout-navbar" | "layout-navbar-inactive" | "layout-sidebar" | "lf-signature" | "lf-website" | "link-plus" | "list-tree" | "loader-2" | "loader-3" | "menu-2" | "message-circle-user" | "off-brush" | "off-hexagon" | "off-highlight" | "off-id" | "off-microphone" | "off-moon" | "off-notification" | "off-palette" | "off-replace" | "off-search" | "off-send" | "off-template" | "percentage-60" | "photo-search" | "photo-x" | "picture-in-picture-top" | "player-record" | "player-stop" | "playstation-circle" | "playstation-square" | "playstation-triangle" | "playstation-x" | "route-2" | "share-2" | "square-toggle" | "square-x" | "stack-pop" | "stack-push" | "stopwatch" | "sunset-2" | "terminal-2" | "time-duration-30" | "toggle-right" | "viewport-tall" | "viewport-wide"',
      },
      {
        name: "lfDuration",
        docs: "Auto-dismiss duration in milliseconds. Set to 0 to disable auto-dismiss.",
        type: "number",
      },
      {
        name: "lfIcon",
        docs: "Optional icon shown at the start of the snackbar.",
        type: '"article" | "checkbox" | "code" | "list" | "select" | "upload" | "id" | "copy" | "download" | "edit" | "refresh" | "settings" | "search" | "--lf-icon-image" | "--lf-icon-upload" | "--lf-icon-delete" | "--lf-icon-add" | "--lf-icon-attachment" | "--lf-icon-broken-image" | "--lf-icon-clear" | "--lf-icon-copy" | "--lf-icon-copy-ok" | "--lf-icon-collapsed" | "--lf-icon-danger" | "--lf-icon-disabled" | "--lf-icon-download" | "--lf-icon-dropdown" | "--lf-icon-edit" | "--lf-icon-expanded" | "--lf-icon-info" | "--lf-icon-loading" | "--lf-icon-minus" | "--lf-icon-next" | "--lf-icon-plus" | "--lf-icon-previous" | "--lf-icon-primary" | "--lf-icon-refresh" | "--lf-icon-secondary" | "--lf-icon-settings" | "--lf-icon-success" | "--lf-icon-search" | "--lf-icon-warning" | "ai" | "brush" | "bug" | "bulb" | "camera" | "candle" | "check" | "door" | "droplet" | "file" | "flare" | "folder" | "forms" | "help" | "highlight" | "history" | "home" | "hourglass" | "ikosaedr" | "json" | "key" | "link" | "loader" | "lock" | "maximize" | "messages" | "microphone" | "moon" | "movie" | "music" | "network" | "notification" | "numbers" | "palette" | "pdf" | "photo" | "progress" | "replace" | "robot" | "schema" | "send" | "shirt" | "skew" | "sparkles" | "slideshow" | "temperature" | "template" | "tooltip" | "wand" | "writing" | "x" | "zip" | "adjustments-horizontal" | "alert-triangle" | "arrow-autofit-content" | "arrow-back" | "bell-ringing" | "brand-facebook" | "brand-github" | "brand-github-copilot" | "brand-instagram" | "brand-linkedin" | "brand-npm" | "brand-reddit" | "brand-x" | "calendar-clock" | "camera-ai" | "caret-down" | "caret-left" | "caret-right" | "caret-up" | "chart-column" | "chart-histogram" | "chevron-compact-down" | "chevron-compact-left" | "chevron-compact-right" | "chevron-compact-up" | "chevron-down" | "chevron-left" | "chevron-right" | "chevrons-down" | "chevrons-left" | "chevrons-right" | "chevrons-up" | "chevron-up" | "circle-arrow-down" | "circle-arrow-left" | "circle-arrow-right" | "circle-arrow-up" | "circle-caret-down" | "circle-caret-left" | "circle-caret-right" | "circle-caret-up" | "circle-chevron-down" | "circle-chevron-left" | "circle-chevron-right" | "circle-chevron-up" | "circle-x" | "code-circle-2" | "color-swatch" | "columns-2" | "contrast-2" | "copy-check" | "drag-drop" | "exclamation-circle" | "filter-search" | "folder-open" | "hexagon-alert" | "hexagon-info" | "hexagon-minus" | "hexagon-minus-2" | "hexagon-photo" | "hexagon-plus" | "hexagon-plus-2" | "hourglass-low" | "image-in-picture" | "inner-shadow-bottom" | "input-search" | "layout-board-split" | "layout-list" | "layout-navbar" | "layout-navbar-inactive" | "layout-sidebar" | "lf-signature" | "lf-website" | "link-plus" | "list-tree" | "loader-2" | "loader-3" | "menu-2" | "message-circle-user" | "off-brush" | "off-hexagon" | "off-highlight" | "off-id" | "off-microphone" | "off-moon" | "off-notification" | "off-palette" | "off-replace" | "off-search" | "off-send" | "off-template" | "percentage-60" | "photo-search" | "photo-x" | "picture-in-picture-top" | "player-record" | "player-stop" | "playstation-circle" | "playstation-square" | "playstation-triangle" | "playstation-x" | "route-2" | "share-2" | "square-toggle" | "square-x" | "stack-pop" | "stack-push" | "stopwatch" | "sunset-2" | "terminal-2" | "time-duration-30" | "toggle-right" | "viewport-tall" | "viewport-wide"',
      },
      {
        name: "lfMessage",
        docs: "Message text displayed in the snackbar.",
        type: "string",
      },
      {
        name: "lfPosition",
        docs: "Positioning of the snackbar on screen.",
        type: '"bottom-center" | "bottom-left" | "bottom-right" | "inline" | "top-center" | "top-left" | "top-right"',
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
        name: "--lf-snackbar-action-font-family",
        docs: "Font family for action buttons. Defaults to => inherit",
      },
      {
        name: "--lf-snackbar-action-font-size",
        docs: "Font size for action buttons. Defaults to => 0.875em",
      },
      {
        name: "--lf-snackbar-border-radius",
        docs: "Sets the border radius for the snackbar component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-snackbar-close-button-size",
        docs: "Size for close button. Defaults to => 1.5em",
      },
      {
        name: "--lf-snackbar-color-on-primary",
        docs: "Text on primary. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
      },
      {
        name: "--lf-snackbar-color-on-surface",
        docs: "Sets the color-on-surface color for the snackbar component. Defaults to => var(--lf-color-on-surface)",
      },
      {
        name: "--lf-snackbar-color-primary",
        docs: "Sets the color-primary color for the snackbar component. Defaults to => var(--lf-color-primary)",
      },
      {
        name: "--lf-snackbar-color-surface",
        docs: "Sets the color-surface color for the snackbar component. Defaults to => var(--lf-color-surface)",
      },
      {
        name: "--lf-snackbar-font-family",
        docs: "Sets the primary font family for the snackbar component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-snackbar-font-size",
        docs: "Sets the font size for the snackbar component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-snackbar-glass-opacity",
        docs: "Opacity for glass effect. Defaults to => var(--lf-ui-alpha-glass, 0.375)",
      },
      {
        name: "--lf-snackbar-icon-color",
        docs: "Color for leading icon. Defaults to => rgba($primaryC, 1)",
      },
      {
        name: "--lf-snackbar-icon-height",
        docs: "Height for icon. Defaults to => 1.5em",
      },
      {
        name: "--lf-snackbar-icon-width",
        docs: "Width for icon. Defaults to => 1.5em",
      },
      {
        name: "--lf-snackbar-max-width",
        docs: "Maximum width for snackbar. Defaults to => clamp(288px, 80vw, 568px)",
      },
      {
        name: "--lf-snackbar-message-font-size",
        docs: "Font size for message. Defaults to => 0.875em",
      },
      {
        name: "--lf-snackbar-min-width",
        docs: "Minimum width for snackbar. Defaults to => 288px",
      },
      {
        name: "--lf-snackbar-padding",
        docs: "Padding for snackbar content. Defaults to => 0.875em 1em",
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
        name: "lfIcon",
        docs: 'Icon to display when using the "icon" layout.\r\nThe icon will rotate with the spinner animation.',
        type: '"article" | "checkbox" | "code" | "list" | "select" | "upload" | "id" | "copy" | "download" | "edit" | "refresh" | "settings" | "search" | "ai" | "brush" | "bug" | "bulb" | "camera" | "candle" | "check" | "door" | "droplet" | "file" | "flare" | "folder" | "forms" | "help" | "highlight" | "history" | "home" | "hourglass" | "ikosaedr" | "json" | "key" | "link" | "loader" | "lock" | "maximize" | "messages" | "microphone" | "moon" | "movie" | "music" | "network" | "notification" | "numbers" | "palette" | "pdf" | "photo" | "progress" | "replace" | "robot" | "schema" | "send" | "shirt" | "skew" | "sparkles" | "slideshow" | "temperature" | "template" | "tooltip" | "wand" | "writing" | "x" | "zip" | "adjustments-horizontal" | "alert-triangle" | "arrow-autofit-content" | "arrow-back" | "bell-ringing" | "brand-facebook" | "brand-github" | "brand-github-copilot" | "brand-instagram" | "brand-linkedin" | "brand-npm" | "brand-reddit" | "brand-x" | "calendar-clock" | "camera-ai" | "caret-down" | "caret-left" | "caret-right" | "caret-up" | "chart-column" | "chart-histogram" | "chevron-compact-down" | "chevron-compact-left" | "chevron-compact-right" | "chevron-compact-up" | "chevron-down" | "chevron-left" | "chevron-right" | "chevrons-down" | "chevrons-left" | "chevrons-right" | "chevrons-up" | "chevron-up" | "circle-arrow-down" | "circle-arrow-left" | "circle-arrow-right" | "circle-arrow-up" | "circle-caret-down" | "circle-caret-left" | "circle-caret-right" | "circle-caret-up" | "circle-chevron-down" | "circle-chevron-left" | "circle-chevron-right" | "circle-chevron-up" | "circle-x" | "code-circle-2" | "color-swatch" | "columns-2" | "contrast-2" | "copy-check" | "drag-drop" | "exclamation-circle" | "filter-search" | "folder-open" | "hexagon-alert" | "hexagon-info" | "hexagon-minus" | "hexagon-minus-2" | "hexagon-photo" | "hexagon-plus" | "hexagon-plus-2" | "hourglass-low" | "image-in-picture" | "inner-shadow-bottom" | "input-search" | "layout-board-split" | "layout-list" | "layout-navbar" | "layout-navbar-inactive" | "layout-sidebar" | "lf-signature" | "lf-website" | "link-plus" | "list-tree" | "loader-2" | "loader-3" | "menu-2" | "message-circle-user" | "off-brush" | "off-hexagon" | "off-highlight" | "off-id" | "off-microphone" | "off-moon" | "off-notification" | "off-palette" | "off-replace" | "off-search" | "off-send" | "off-template" | "percentage-60" | "photo-search" | "photo-x" | "picture-in-picture-top" | "player-record" | "player-stop" | "playstation-circle" | "playstation-square" | "playstation-triangle" | "playstation-x" | "route-2" | "share-2" | "square-toggle" | "square-x" | "stack-pop" | "stack-push" | "stopwatch" | "sunset-2" | "terminal-2" | "time-duration-30" | "toggle-right" | "viewport-tall" | "viewport-wide"',
      },
      {
        name: "lfLayout",
        docs: 'Selects the spinner layout style.\r\nAvailable: "ring", "dots", "bars", "spinner", "grid", "icon", "pulse", "wave"',
        type: '"bars" | "dots" | "grid" | "icon" | "pulse" | "ring" | "spinner" | "wave"',
      },
      {
        name: "lfStyle",
        docs: "Custom styling for the component.",
        type: "string",
      },
      {
        name: "lfTimeout",
        docs: "Duration for the progress bar to fill up (in milliseconds).\r\nOnly applies when lfBarVariant is true.",
        type: "number",
      },
      {
        name: "lfUiSize",
        docs: "The size of the component.\r\nControls the spinner dimensions using predefined sizes.",
        type: '"large" | "medium" | "small" | "xlarge" | "xsmall" | "xxlarge" | "xxsmall"',
      },
      {
        name: "lfUiState",
        docs: "Reflects the specified state color defined by the theme.\r\nControls the spinner color using theme state colors.",
        type: '"danger" | "disabled" | "info" | "primary" | "secondary" | "success" | "warning"',
      },
    ],
    styles: [
      {
        name: "--lf-spinner-border-radius",
        docs: "Border radius for layout wrapper. Defaults to => 0.5em",
      },
      {
        name: "--lf-spinner-color-bg",
        docs: "Background color for layout wrapper. Defaults to => var(--lf-state-bg, var(--lf-color-bg))",
      },
      {
        name: "--lf-spinner-color-on-bg",
        docs: "Label text color. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg))",
      },
      {
        name: "--lf-spinner-color-primary",
        docs: "Primary color for spinner elements. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-spinner-font-family",
        docs: "Sets the primary font family for the spinner component. Defaults to => var(--lf-font-family-primary)",
      },
      {
        name: "--lf-spinner-font-size",
        docs: "Sets the font size for the spinner component. Defaults to => var(--lf-font-size)",
      },
      {
        name: "--lf-spinner-ring-thickness",
        docs: "Thickness for ring spinners. Defaults to => 0.35em",
      },
      {
        name: "--lf-spinner-size",
        docs: "Size for the spinner. Defaults to => 7em",
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
        docs: "Background color for the splash component. Defaults to => var(--lf-state-bg, var(--lf-color-bg))",
      },
      {
        name: "--lf-splash-color-on-bg",
        docs: "Text color on background surface. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg))",
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
        docs: "Sets the left position for the splash component. Defaults to => 0",
      },
      {
        name: "--lf-splash-position",
        docs: "Sets the position for the splash component. Defaults to => fixed",
      },
      {
        name: "--lf-splash-top",
        docs: "Sets the top position for the splash component. Defaults to => 0",
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
        docs: "Explicit accessible label prefix for tabs. Final per-tab aria-label resolves as:\nlfAriaLabel + ' ' + node.value (if both present) else node.value -> lfAriaLabel -> node.icon -> component id -> 'tab'.",
        type: "string",
      },
      {
        name: "lfDataset",
        docs: "The data set for the LF Tabbar component.\nThis property is mutable, meaning it can be changed after the component is initialized.",
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
        docs: "Border radius for tabs. Defaults to => var(--lf-ui-border-radius, 0.25em)",
      },
      {
        name: "--lf-tabbar-color-bg",
        docs: "Background color for the tabbar. Defaults to => var(--lf-state-bg, var(--lf-color-bg))",
      },
      {
        name: "--lf-tabbar-color-indicator",
        docs: "Color for the active tab indicator. Defaults to => var(--lf-tabbar-color-primary)",
      },
      {
        name: "--lf-tabbar-color-on-bg",
        docs: "Text color on background. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg))",
      },
      {
        name: "--lf-tabbar-color-on-primary",
        docs: "Text color on primary surface. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
      },
      {
        name: "--lf-tabbar-color-primary",
        docs: "Primary/accent color for active states. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
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
        name: "--lf-tabbar-font-weight",
        docs: "Font weight for tab labels. Defaults to => var(--lf-font-weight-button)",
      },
      {
        name: "--lf-tabbar-height",
        docs: "Height for the tabbar. Defaults to => 2.25em",
      },
      {
        name: "--lf-tabbar-min-width",
        docs: "Minimum width for each tab. Defaults to => 5em",
      },
      {
        name: "--lf-tabbar-tab-padding",
        docs: "Padding for each tab. Defaults to => 0 1.25em",
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
        name: "lfCaptureShortcuts",
        docs: "When enabled, prevents propagation of common keyboard shortcuts\n(e.g. Ctrl/Cmd + C, V, X, Z, Y, A) from the internal input or textarea\nto parent components.",
        type: "boolean",
      },
      {
        name: "lfFormatJSON",
        docs: "Automatically formats textarea content to prettier JSON structure.",
        type: "LfTextfieldFormatJSON",
      },
      {
        name: "lfHelper",
        docs: "Sets the helper text for the text field.\nThe helper text can provide additional information or instructions to the user.",
        type: "LfTextfieldHelper",
      },
      {
        name: "lfHtmlAttributes",
        docs: "Allows customization of the input or textarea element through additional HTML attributes.\nThis can include attributes like 'readonly', 'placeholder', etc., to further customize the behavior or appearance of the input.",
        type: '{ autocomplete?: any; placeholder?: any; name?: any; id?: any; disabled?: any; class?: any; href?: any; lfAriaLabel?: any; lfLabel?: any; lfLeadingLabel?: any; lfRipple?: any; lfStyle?: any; lfUiSize?: any; lfUiState?: any; lfValue?: any; lfDataset?: any; lfExpanded?: any; lfImageProps?: any; lfPosition?: any; lfIcon?: any; lfIconOff?: any; lfShowSpinner?: any; lfStretchX?: any; lfStretchY?: any; lfStyling?: any; lfToggable?: any; lfTrailingIcon?: any; lfType?: any; lfAutoResize?: any; lfBrush?: any; lfColor?: any; lfCursor?: any; lfOpacity?: any; lfPreview?: any; lfSize?: any; lfStrokeTolerance?: any; lfLayout?: any; lfSizeX?: any; lfSizeY?: any; lfAxis?: any; lfColors?: any; lfLegend?: any; lfSeries?: any; lfTypes?: any; lfXAxis?: any; lfYAxis?: any; lfConfig?: any; lfToolHandlers?: any; lfUploadCallback?: any; lfFlat?: any; lfFadeIn?: any; lfFormat?: any; lfLanguage?: any; lfPreserveSpaces?: any; lfShowCopy?: any; lfShowHeader?: any; lfStickyHeader?: any; lfHtmlAttributes?: any; lfOverlay?: any; lfPlaceholder?: any; lfThreshold?: any; lfAnimated?: any; lfCenteredLabel?: any; lfIsRadial?: any; lfCaptureShortcuts?: any; lfFormatJSON?: any; lfHelper?: any; lfTrailingIconAction?: any; lfDeleteSpeed?: any; lfLoop?: any; lfPause?: any; lfSpeed?: any; lfTag?: any; lfUpdatable?: any; lfEmpty?: any; lfAllowFreeInput?: any; lfCache?: any; lfCacheTTL?: any; lfDebounceMs?: any; lfListProps?: any; lfMaxCacheSize?: any; lfMinChars?: any; lfNavigation?: any; lfSpinnerProps?: any; lfTextfieldProps?: any; lfInteractive?: any; lfMaxItems?: any; lfSeparator?: any; lfShowRoot?: any; lfAutoPlay?: any; lfInterval?: any; lfLightbox?: any; lfShape?: any; lfView?: any; lfDisplay?: any; lfResponsive?: any; lfEnableDeletions?: any; lfFilter?: any; lfSelectable?: any; lfActions?: any; lfCollapseColumns?: any; lfColumns?: any; lfAutosave?: any; lfChipProps?: any; lfMaxHistory?: any; lfMode?: any; lfProps?: any; lfTrigger?: any; lfOrientation?: any; lfLoadCallback?: any; lfMax?: any; lfMin?: any; lfStep?: any; lfAction?: any; lfActionCallback?: any; lfCloseIcon?: any; lfDuration?: any; lfMessage?: any; lfActive?: any; lfBarVariant?: any; lfFader?: any; lfFaderTimeout?: any; lfFullScreen?: any; lfTimeout?: any; lfCloseCallback?: any; lfTimer?: any; lfAccordionLayout?: any; lfExpandedNodeIds?: any; lfInitialExpansionDepth?: any; lfGrid?: any; lfSelectedNodeIds?: any; value?: any; htmlProps?: any; accept?: any; "accept-charset"?: any; alt?: any; autofocus?: any; checked?: any; dataset?: any; max?: any; maxLength?: any; min?: any; minLength?: any; multiple?: any; readonly?: any; role?: any; src?: any; srcset?: any; step?: any; title?: any; type?: any; "aria-"?: any; "data-"?: any; }',
      },
      {
        name: "lfIcon",
        docs: "Sets the icon to be displayed within the text field.",
        type: '"article" | "checkbox" | "code" | "list" | "select" | "upload" | "id" | "copy" | "download" | "edit" | "refresh" | "settings" | "search" | "--lf-icon-image" | "--lf-icon-upload" | "--lf-icon-delete" | "--lf-icon-add" | "--lf-icon-attachment" | "--lf-icon-broken-image" | "--lf-icon-clear" | "--lf-icon-copy" | "--lf-icon-copy-ok" | "--lf-icon-collapsed" | "--lf-icon-danger" | "--lf-icon-disabled" | "--lf-icon-download" | "--lf-icon-dropdown" | "--lf-icon-edit" | "--lf-icon-expanded" | "--lf-icon-info" | "--lf-icon-loading" | "--lf-icon-minus" | "--lf-icon-next" | "--lf-icon-plus" | "--lf-icon-previous" | "--lf-icon-primary" | "--lf-icon-refresh" | "--lf-icon-secondary" | "--lf-icon-settings" | "--lf-icon-success" | "--lf-icon-search" | "--lf-icon-warning" | "ai" | "brush" | "bug" | "bulb" | "camera" | "candle" | "check" | "door" | "droplet" | "file" | "flare" | "folder" | "forms" | "help" | "highlight" | "history" | "home" | "hourglass" | "ikosaedr" | "json" | "key" | "link" | "loader" | "lock" | "maximize" | "messages" | "microphone" | "moon" | "movie" | "music" | "network" | "notification" | "numbers" | "palette" | "pdf" | "photo" | "progress" | "replace" | "robot" | "schema" | "send" | "shirt" | "skew" | "sparkles" | "slideshow" | "temperature" | "template" | "tooltip" | "wand" | "writing" | "x" | "zip" | "adjustments-horizontal" | "alert-triangle" | "arrow-autofit-content" | "arrow-back" | "bell-ringing" | "brand-facebook" | "brand-github" | "brand-github-copilot" | "brand-instagram" | "brand-linkedin" | "brand-npm" | "brand-reddit" | "brand-x" | "calendar-clock" | "camera-ai" | "caret-down" | "caret-left" | "caret-right" | "caret-up" | "chart-column" | "chart-histogram" | "chevron-compact-down" | "chevron-compact-left" | "chevron-compact-right" | "chevron-compact-up" | "chevron-down" | "chevron-left" | "chevron-right" | "chevrons-down" | "chevrons-left" | "chevrons-right" | "chevrons-up" | "chevron-up" | "circle-arrow-down" | "circle-arrow-left" | "circle-arrow-right" | "circle-arrow-up" | "circle-caret-down" | "circle-caret-left" | "circle-caret-right" | "circle-caret-up" | "circle-chevron-down" | "circle-chevron-left" | "circle-chevron-right" | "circle-chevron-up" | "circle-x" | "code-circle-2" | "color-swatch" | "columns-2" | "contrast-2" | "copy-check" | "drag-drop" | "exclamation-circle" | "filter-search" | "folder-open" | "hexagon-alert" | "hexagon-info" | "hexagon-minus" | "hexagon-minus-2" | "hexagon-photo" | "hexagon-plus" | "hexagon-plus-2" | "hourglass-low" | "image-in-picture" | "inner-shadow-bottom" | "input-search" | "layout-board-split" | "layout-list" | "layout-navbar" | "layout-navbar-inactive" | "layout-sidebar" | "lf-signature" | "lf-website" | "link-plus" | "list-tree" | "loader-2" | "loader-3" | "menu-2" | "message-circle-user" | "off-brush" | "off-hexagon" | "off-highlight" | "off-id" | "off-microphone" | "off-moon" | "off-notification" | "off-palette" | "off-replace" | "off-search" | "off-send" | "off-template" | "percentage-60" | "photo-search" | "photo-x" | "picture-in-picture-top" | "player-record" | "player-stop" | "playstation-circle" | "playstation-square" | "playstation-triangle" | "playstation-x" | "route-2" | "share-2" | "square-toggle" | "square-x" | "stack-pop" | "stack-push" | "stopwatch" | "sunset-2" | "terminal-2" | "time-duration-30" | "toggle-right" | "viewport-tall" | "viewport-wide"',
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
        docs: "Sets a service icon to be displayed on the trailing side for additional actions.\nThis icon is not customizable by consumers and defaults to null (hidden).",
        type: '"--lf-icon-image" | "--lf-icon-upload" | "--lf-icon-delete" | "--lf-icon-add" | "--lf-icon-attachment" | "--lf-icon-broken-image" | "--lf-icon-clear" | "--lf-icon-copy" | "--lf-icon-copy-ok" | "--lf-icon-collapsed" | "--lf-icon-danger" | "--lf-icon-disabled" | "--lf-icon-download" | "--lf-icon-dropdown" | "--lf-icon-edit" | "--lf-icon-expanded" | "--lf-icon-info" | "--lf-icon-loading" | "--lf-icon-minus" | "--lf-icon-next" | "--lf-icon-plus" | "--lf-icon-previous" | "--lf-icon-primary" | "--lf-icon-refresh" | "--lf-icon-secondary" | "--lf-icon-settings" | "--lf-icon-success" | "--lf-icon-search" | "--lf-icon-warning"',
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
        name: "--lf-textfield-border-radius",
        docs: "Border radius for the field. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-textfield-color-border",
        docs: "Border color for outlined variant. Defaults to => var(--lf-state-border, var(--lf-color-border))",
      },
      {
        name: "--lf-textfield-color-on-bg",
        docs: "Text and icon color. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg))",
      },
      {
        name: "--lf-textfield-color-primary",
        docs: "Primary color for focus states. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-textfield-color-surface",
        docs: "Surface color for raised variant. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
      },
      {
        name: "--lf-textfield-counter-padding",
        docs: "Padding for character counter. Defaults to => 0.5em 0.875em 0 0",
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
        docs: "Height for the textfield. Defaults to => 3.5em",
      },
      {
        name: "--lf-textfield-helper-padding",
        docs: "Padding for helper text. Defaults to => 0.375em 0.875em 0 0.875em",
      },
      {
        name: "--lf-textfield-icon-size",
        docs: "Size for leading/trailing icons. Defaults to => 1.5em",
      },
      {
        name: "--lf-textfield-input-padding",
        docs: "Padding for the input element. Defaults to => 0.25em 0.5em",
      },
      {
        name: "--lf-textfield-label-font-size",
        docs: "Font size for the label. Defaults to => 0.75em",
      },
      {
        name: "--lf-textfield-label-font-weight",
        docs: "Font weight for the label. Defaults to => var(--lf-font-weight-button)",
      },
      {
        name: "--lf-textfield-label-transition",
        docs: "Transition for label animation. Defaults to => 150ms cubic-bezier(0.4, 0, 0.2, 1)",
      },
      {
        name: "--lf-textfield-outline-width",
        docs: "Width for focus outline. Defaults to => 0.15em",
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
        name: "--lf-toast-accent-height",
        docs: "Height for accent bar. Defaults to => 0.25em",
      },
      {
        name: "--lf-toast-border-radius",
        docs: "Sets the border radius for the toast component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-toast-color-bg",
        docs: "Message text color. Defaults to => var(--lf-state-bg, var(--lf-color-bg))",
      },
      {
        name: "--lf-toast-color-primary",
        docs: "Primary color for accent bar. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-toast-color-surface",
        docs: "Background color for toast. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
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
        name: "--lf-toast-icon-color",
        docs: "Color for leading icon. Defaults to => rgba($primaryC, 1)",
      },
      {
        name: "--lf-toast-icon-height",
        docs: "Height for icon. Defaults to => 1.5em",
      },
      {
        name: "--lf-toast-icon-margin",
        docs: "Margin for icon. Defaults to => auto 0.5em",
      },
      {
        name: "--lf-toast-icon-opacity",
        docs: "Opacity for icon. Defaults to => 1",
      },
      {
        name: "--lf-toast-icon-width",
        docs: "Width for icon. Defaults to => 1.5em",
      },
      {
        name: "--lf-toast-message-align-content",
        docs: "Alignment for message content. Defaults to => center",
      },
      {
        name: "--lf-toast-message-padding",
        docs: "Padding for message. Defaults to => 0.75em 0.75em 0.75em 0",
      },
      {
        name: "--lf-toast-padding",
        docs: "Padding for toast wrapper. Defaults to => 0.75em",
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
        name: "--lf-toggle-color-on-bg",
        docs: "Label text color. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg))",
      },
      {
        name: "--lf-toggle-color-on-surface",
        docs: "Thumb color in off state. Defaults to => var(--lf-state-on-surface, var(--lf-color-on-surface))",
      },
      {
        name: "--lf-toggle-color-primary",
        docs: "Primary color for active/on state. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-toggle-color-surface",
        docs: "Surface color for track background. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
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
        name: "--lf-toggle-thumb-border-radius",
        docs: "Border radius for thumb. Defaults to => 50%",
      },
      {
        name: "--lf-toggle-thumb-inset",
        docs: "Inset for thumb positioning. Defaults to => 0.125em",
      },
      {
        name: "--lf-toggle-thumb-offset",
        docs: "Translation distance when on. Defaults to => 1.25em",
      },
      {
        name: "--lf-toggle-thumb-shadow",
        docs: "Box shadow for thumb. Defaults to => 0 2px 4px rgba(0, 0, 0, 0.2)",
      },
      {
        name: "--lf-toggle-thumb-size",
        docs: "Size for the thumb. Defaults to => 1.25em",
      },
      {
        name: "--lf-toggle-track-border-radius",
        docs: "Border radius for track. Defaults to => 1em",
      },
      {
        name: "--lf-toggle-track-height",
        docs: "Height for the track. Defaults to => 1.5em",
      },
      {
        name: "--lf-toggle-track-width",
        docs: "Width for the track. Defaults to => 2.75em",
      },
      {
        name: "--lf-toggle-underlay-size",
        docs: "Size for focus underlay. Defaults to => 2.5em",
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
        docs: "Height for accordion-style nodes (depth 0). Defaults to => 4em",
      },
      {
        name: "--lf-tree-border-radius",
        docs: "Border radius for the tree container. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-tree-color-bg",
        docs: "Background color for the tree. Defaults to => var(--lf-state-bg, var(--lf-color-bg))",
      },
      {
        name: "--lf-tree-color-on-bg",
        docs: "Text color on the tree background. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg))",
      },
      {
        name: "--lf-tree-color-on-primary",
        docs: "Text color on primary surfaces. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
      },
      {
        name: "--lf-tree-color-on-surface",
        docs: "Sets the color-on-surface color for the tree component. Defaults to => var(--lf-color-on-surface)",
      },
      {
        name: "--lf-tree-color-primary",
        docs: "Primary/accent color for selected/highlighted nodes. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-tree-color-surface",
        docs: "Surface color for tree elements. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
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
        name: "--lf-tree-icon-size",
        docs: "Size for icons in tree nodes. Defaults to => 1.5em",
      },
      {
        name: "--lf-tree-node-height",
        docs: "Height for tree nodes. Defaults to => 2em",
      },
      {
        name: "--lf-tree-node-padding",
        docs: "Padding for tree nodes. Defaults to => 0 1em",
      },
      {
        name: "--lf-tree-padding",
        docs: "Padding for the tree container. Defaults to => 0",
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
        docs: "Background color for the typewriter container. Defaults to => var(--lf-state-bg, var(--lf-color-bg))",
      },
      {
        name: "--lf-typewriter-color-on-bg",
        docs: "Text color on background surface. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg))",
      },
      {
        name: "--lf-typewriter-color-on-primary",
        docs: "Text color on primary surface. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))",
      },
      {
        name: "--lf-typewriter-color-primary",
        docs: "Primary/background color for the typewriter. Defaults to => var(--lf-state-primary, var(--lf-color-primary))",
      },
      {
        name: "--lf-typewriter-cursor-blink-duration",
        docs: "Duration for the cursor blink animation. Defaults to => 800ms",
      },
      {
        name: "--lf-typewriter-cursor-height",
        docs: "Height for the blinking cursor. Defaults to => 1.25em",
      },
      {
        name: "--lf-typewriter-cursor-margin-left",
        docs: "Left margin for the cursor. Defaults to => 0.15em",
      },
      {
        name: "--lf-typewriter-cursor-vertical-align",
        docs: "Vertical alignment for the cursor. Defaults to => top",
      },
      {
        name: "--lf-typewriter-cursor-width",
        docs: "Width for the blinking cursor. Defaults to => 0.125em",
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
        docs: "Margin for the typewriter text element. Defaults to => 0",
      },
      {
        name: "--lf-typewriter-padding",
        docs: "Padding for the typewriter container. Defaults to => 1em",
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
        docs: "Allows customization of the input element through additional HTML attributes.\nThis can include attributes like 'readonly', 'placeholder', etc., to further customize the behavior or appearance of the input.",
        type: '{ autocomplete?: any; placeholder?: any; name?: any; id?: any; disabled?: any; class?: any; href?: any; lfAriaLabel?: any; lfLabel?: any; lfLeadingLabel?: any; lfRipple?: any; lfStyle?: any; lfUiSize?: any; lfUiState?: any; lfValue?: any; lfDataset?: any; lfExpanded?: any; lfImageProps?: any; lfPosition?: any; lfIcon?: any; lfIconOff?: any; lfShowSpinner?: any; lfStretchX?: any; lfStretchY?: any; lfStyling?: any; lfToggable?: any; lfTrailingIcon?: any; lfType?: any; lfAutoResize?: any; lfBrush?: any; lfColor?: any; lfCursor?: any; lfOpacity?: any; lfPreview?: any; lfSize?: any; lfStrokeTolerance?: any; lfLayout?: any; lfSizeX?: any; lfSizeY?: any; lfAxis?: any; lfColors?: any; lfLegend?: any; lfSeries?: any; lfTypes?: any; lfXAxis?: any; lfYAxis?: any; lfConfig?: any; lfToolHandlers?: any; lfUploadCallback?: any; lfFlat?: any; lfFadeIn?: any; lfFormat?: any; lfLanguage?: any; lfPreserveSpaces?: any; lfShowCopy?: any; lfShowHeader?: any; lfStickyHeader?: any; lfHtmlAttributes?: any; lfOverlay?: any; lfPlaceholder?: any; lfThreshold?: any; lfAnimated?: any; lfCenteredLabel?: any; lfIsRadial?: any; lfCaptureShortcuts?: any; lfFormatJSON?: any; lfHelper?: any; lfTrailingIconAction?: any; lfDeleteSpeed?: any; lfLoop?: any; lfPause?: any; lfSpeed?: any; lfTag?: any; lfUpdatable?: any; lfEmpty?: any; lfAllowFreeInput?: any; lfCache?: any; lfCacheTTL?: any; lfDebounceMs?: any; lfListProps?: any; lfMaxCacheSize?: any; lfMinChars?: any; lfNavigation?: any; lfSpinnerProps?: any; lfTextfieldProps?: any; lfInteractive?: any; lfMaxItems?: any; lfSeparator?: any; lfShowRoot?: any; lfAutoPlay?: any; lfInterval?: any; lfLightbox?: any; lfShape?: any; lfView?: any; lfDisplay?: any; lfResponsive?: any; lfEnableDeletions?: any; lfFilter?: any; lfSelectable?: any; lfActions?: any; lfCollapseColumns?: any; lfColumns?: any; lfAutosave?: any; lfChipProps?: any; lfMaxHistory?: any; lfMode?: any; lfProps?: any; lfTrigger?: any; lfOrientation?: any; lfLoadCallback?: any; lfMax?: any; lfMin?: any; lfStep?: any; lfAction?: any; lfActionCallback?: any; lfCloseIcon?: any; lfDuration?: any; lfMessage?: any; lfActive?: any; lfBarVariant?: any; lfFader?: any; lfFaderTimeout?: any; lfFullScreen?: any; lfTimeout?: any; lfCloseCallback?: any; lfTimer?: any; lfAccordionLayout?: any; lfExpandedNodeIds?: any; lfInitialExpansionDepth?: any; lfGrid?: any; lfSelectedNodeIds?: any; value?: any; htmlProps?: any; accept?: any; "accept-charset"?: any; alt?: any; autofocus?: any; checked?: any; dataset?: any; max?: any; maxLength?: any; min?: any; minLength?: any; multiple?: any; readonly?: any; role?: any; src?: any; srcset?: any; step?: any; title?: any; type?: any; "aria-"?: any; "data-"?: any; }',
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
        docs: "Border color for the upload component. Defaults to => var(--lf-color-border)",
      },
      {
        name: "--lf-upload-border-radius",
        docs: "Border radius for the upload component. Defaults to => var(--lf-ui-border-radius)",
      },
      {
        name: "--lf-upload-border-width",
        docs: "Border width for the upload component. Defaults to => 1px",
      },
      {
        name: "--lf-upload-button-height",
        docs: "Height for the upload button area. Defaults to => 2.75em",
      },
      {
        name: "--lf-upload-color-on-surface",
        docs: "Text color on surface. Defaults to => var(--lf-state-on-surface, var(--lf-color-on-surface))",
      },
      {
        name: "--lf-upload-color-surface",
        docs: "Surface/background color for the upload. Defaults to => var(--lf-state-surface, var(--lf-color-surface))",
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
        name: "--lf-upload-font-weight",
        docs: "Font weight for the upload label. Defaults to => var(--lf-font-weight-button)",
      },
      {
        name: "--lf-upload-grid-gap",
        docs: "Grid gap when files are selected. Defaults to => 1.25em",
      },
      {
        name: "--lf-upload-icon-color",
        docs: "Icon color in file items. Defaults to => var(--lf-color-on-surface)",
      },
      {
        name: "--lf-upload-icon-size",
        docs: "Icon size in file items. Defaults to => 1.5em",
      },
      {
        name: "--lf-upload-info-height",
        docs: "Max height for the file info area. Defaults to => minmax(auto, 25vh)",
      },
      {
        name: "--lf-upload-item-padding",
        docs: "Padding for file items. Defaults to => 0.75em",
      },
      {
        name: "--lf-upload-min-height",
        docs: "Minimum height for the upload component. Defaults to => 8em",
      },
      {
        name: "--lf-upload-padding",
        docs: "Padding for the upload component. Defaults to => 1em",
      },
    ],
  },
};
