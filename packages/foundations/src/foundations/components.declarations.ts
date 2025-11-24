import {
  LfAccordionElement,
  LfAccordionInterface,
  LfAccordionPropsInterface,
} from "../components/accordion.declarations";
import {
  LfArticleElement,
  LfArticleInterface,
  LfArticlePropsInterface,
} from "../components/article.declarations";
import {
  LfAutocompleteElement,
  LfAutocompleteInterface,
  LfAutocompletePropsInterface,
} from "../components/autocomplete.declarations";
import {
  LfBadgeElement,
  LfBadgeInterface,
  LfBadgePropsInterface,
} from "../components/badge.declarations";
import {
  LfBreadcrumbsElement,
  LfBreadcrumbsInterface,
  LfBreadcrumbsPropsInterface,
} from "../components/breadcrumbs.declarations";
import {
  LfButtonElement,
  LfButtonInterface,
  LfButtonPropsInterface,
} from "../components/button.declarations";
import {
  LfCanvasElement,
  LfCanvasInterface,
  LfCanvasPropsInterface,
} from "../components/canvas.declarations";
import {
  LfCardElement,
  LfCardInterface,
  LfCardPropsInterface,
} from "../components/card.declarations";
import {
  LfCarouselElement,
  LfCarouselInterface,
  LfCarouselPropsInterface,
} from "../components/carousel.declarations";
import {
  LfChartElement,
  LfChartInterface,
  LfChartPropsInterface,
} from "../components/chart.declarations";
import {
  LfChatElement,
  LfChatInterface,
  LfChatPropsInterface,
} from "../components/chat.declarations";
import {
  LfCheckboxElement,
  LfCheckboxInterface,
  LfCheckboxPropsInterface,
} from "../components/checkbox.declarations";
import {
  LfChipElement,
  LfChipInterface,
  LfChipPropsInterface,
} from "../components/chip.declarations";
import {
  LfCodeElement,
  LfCodeInterface,
  LfCodePropsInterface,
} from "../components/code.declarations";
import {
  LfCompareElement,
  LfCompareInterface,
  LfComparePropsInterface,
} from "../components/compare.declarations";
import {
  LfDrawerElement,
  LfDrawerInterface,
  LfDrawerPropsInterface,
} from "../components/drawer.declarations";
import {
  LfHeaderElement,
  LfHeaderInterface,
  LfHeaderPropsInterface,
} from "../components/header.declarations";
import {
  LfImageElement,
  LfImageInterface,
  LfImagePropsInterface,
} from "../components/image.declarations";
import {
  LfImageviewerElement,
  LfImageviewerInterface,
  LfImageviewerPropsInterface,
} from "../components/imageviewer.declarations";
import {
  LfListElement,
  LfListInterface,
  LfListPropsInterface,
} from "../components/list.declarations";
import {
  LfMasonryElement,
  LfMasonryInterface,
  LfMasonryPropsInterface,
} from "../components/masonry.declarations";
import {
  LfMessengerElement,
  LfMessengerInterface,
  LfMessengerPropsInterface,
} from "../components/messenger.declarations";
import {
  LfMultiInputElement,
  LfMultiInputInterface,
  LfMultiInputPropsInterface,
} from "../components/multiinput.declarations";
import {
  LfPhotoframeElement,
  LfPhotoframeInterface,
  LfPhotoframePropsInterface,
} from "../components/photoframe.declarations";
import {
  LfPlaceholderElement,
  LfPlaceholderInterface,
  LfPlaceholderPropsInterface,
} from "../components/placeholder.declarations";
import {
  LfProgressbarElement,
  LfProgressbarInterface,
  LfProgressbarPropsInterface,
} from "../components/progressbar.declarations";
import {
  LfRadioElement,
  LfRadioInterface,
  LfRadioPropsInterface,
} from "../components/radio.declarations";
import {
  LfSelectElement,
  LfSelectInterface,
  LfSelectPropsInterface,
} from "../components/select.declarations";
import {
  LfSliderElement,
  LfSliderInterface,
  LfSliderPropsInterface,
} from "../components/slider.declarations";
import {
  LfSpinnerElement,
  LfSpinnerInterface,
  LfSpinnerPropsInterface,
} from "../components/spinner.declarations";
import {
  LfSplashElement,
  LfSplashInterface,
  LfSplashPropsInterface,
} from "../components/splash.declarations";
import {
  LfTabbarElement,
  LfTabbarInterface,
  LfTabbarPropsInterface,
} from "../components/tabbar.declarations";
import {
  LfTextfieldElement,
  LfTextfieldInterface,
  LfTextfieldPropsInterface,
} from "../components/textfield.declarations";
import {
  LfToastElement,
  LfToastInterface,
  LfToastPropsInterface,
} from "../components/toast.declarations";
import {
  LfToggleElement,
  LfToggleInterface,
  LfTogglePropsInterface,
} from "../components/toggle.declarations";
import {
  LfTreeElement,
  LfTreeInterface,
  LfTreePropsInterface,
} from "../components/tree.declarations";
import {
  LfTypewriterElement,
  LfTypewriterInterface,
  LfTypewriterPropsInterface,
} from "../components/typewriter.declarations";
import {
  LfUploadElement,
  LfUploadInterface,
  LfUploadPropsInterface,
} from "../components/upload.declarations";
import {
  LfDataCell,
  LfDataShapeCallback,
  LfDataShapeEventDispatcher,
  LfDataShapeRefCallback,
  LfDataShapes,
  LfFrameworkInterface,
} from "../framework";
import { LfDebugLifecycleInfo } from "../framework/debug.declarations";

/**
 * Strongly typed runtime contract implemented by every LF component.
 *
 * The interface exposes the component-specific root HTMLElement alongside the
 * shared lifecycle API inherited from `LfComponentCommon`.
 *
 * @template T Canonical component name used to resolve the concrete root element type.
 */
export interface LfComponent<T extends LfComponentName = LfComponentName>
  extends LfComponentCommon {
  /**
   * Reference to the rendered custom element associated with the component
   * implementation. Consumers can tap into DOM APIs or imperative Stencil
   * helpers through this handle.
   */
  rootElement: LfComponentElementMap[T];
}
/**
 * Property keys that exist on every component class and can therefore be safely
 * inspected by framework utilities.
 */
export type LfComponentClassProperties = "rootElement" | "debugInfo";
/**
 * Resolves the public interface for a component based on its canonical name.
 *
 * @template T Component name whose class interface should be returned.
 */
export type LfComponentType<T extends LfComponentName = LfComponentName> =
  T extends keyof LfComponentClassMap
    ? LfComponentClassMap[T]
    : LfComponentCommon;
/**
 * Maps canonical component names to the HTMLElement subclass representing their root node.
 *
 * Enables tag-based lookups without sacrificing type safety.
 */
export type LfComponentElementMap = {
  LfAccordion: LfAccordionElement;
  LfArticle: LfArticleElement;
  LfAutocomplete: LfAutocompleteElement;
  LfBadge: LfBadgeElement;
  LfBreadcrumbs: LfBreadcrumbsElement;
  LfButton: LfButtonElement;
  LfCanvas: LfCanvasElement;
  LfCard: LfCardElement;
  LfCarousel: LfCarouselElement;
  LfChart: LfChartElement;
  LfChat: LfChatElement;
  LfCheckbox: LfCheckboxElement;
  LfChip: LfChipElement;
  LfCode: LfCodeElement;
  LfCompare: LfCompareElement;
  LfDrawer: LfDrawerElement;
  LfHeader: LfHeaderElement;
  LfImage: LfImageElement;
  LfImageviewer: LfImageviewerElement;
  LfList: LfListElement;
  LfMasonry: LfMasonryElement;
  LfMessenger: LfMessengerElement;
  LfMultiInput: LfMultiInputElement;
  LfPhotoframe: LfPhotoframeElement;
  LfPlaceholder: LfPlaceholderElement;
  LfProgressbar: LfProgressbarElement;
  LfRadio: LfRadioElement;
  LfSelect: LfSelectElement;
  LfSlider: LfSliderElement;
  LfSpinner: LfSpinnerElement;
  LfSplash: LfSplashElement;
  LfToggle: LfToggleElement;
  LfTabbar: LfTabbarElement;
  LfTextfield: LfTextfieldElement;
  LfToast: LfToastElement;
  LfTree: LfTreeElement;
  LfTypewriter: LfTypewriterElement;
  LfUpload: LfUploadElement;
};
/**
 * Maps component names to the interfaces implemented by their component classes.
 *
 * Used when dynamically working with components while preserving strong typing.
 */
export type LfComponentClassMap = {
  LfAccordion: LfAccordionInterface;
  LfArticle: LfArticleInterface;
  LfAutocomplete: LfAutocompleteInterface;
  LfBadge: LfBadgeInterface;
  LfBreadcrumbs: LfBreadcrumbsInterface;
  LfButton: LfButtonInterface;
  LfCanvas: LfCanvasInterface;
  LfCard: LfCardInterface;
  LfCarousel: LfCarouselInterface;
  LfChart: LfChartInterface;
  LfChat: LfChatInterface;
  LfCheckbox: LfCheckboxInterface;
  LfChip: LfChipInterface;
  LfCode: LfCodeInterface;
  LfCompare: LfCompareInterface;
  LfDrawer: LfDrawerInterface;
  LfHeader: LfHeaderInterface;
  LfImage: LfImageInterface;
  LfImageviewer: LfImageviewerInterface;
  LfList: LfListInterface;
  LfMasonry: LfMasonryInterface;
  LfMessenger: LfMessengerInterface;
  LfMultiInput: LfMultiInputInterface;
  LfPhotoframe: LfPhotoframeInterface;
  LfPlaceholder: LfPlaceholderInterface;
  LfProgressbar: LfProgressbarInterface;
  LfRadio: LfRadioInterface;
  LfSelect: LfSelectInterface;
  LfSlider: LfSliderInterface;
  LfSpinner: LfSpinnerInterface;
  LfSplash: LfSplashInterface;
  LfToggle: LfToggleInterface;
  LfTabbar: LfTabbarInterface;
  LfTextfield: LfTextfieldInterface;
  LfToast: LfToastInterface;
  LfTree: LfTreeInterface;
  LfTypewriter: LfTypewriterInterface;
  LfUpload: LfUploadInterface;
};
/**
 * Lifecycle contract shared by every component implementation.
 *
 * The framework relies on these methods to provide debugging, prop inspection and lifecycle control.
 */
interface LfComponentCommon {
  /**
   * Lifecycle metrics collected by the framework debug service. Updated during
   * render hooks to help visualise state transitions.
   */
  debugInfo: LfDebugLifecycleInfo;
  /**
   * Async accessor returning the latest debug information snapshot. Useful when
   * debugging outside the component instance (e.g. dev tools overlays).
   */
  getDebugInfo: () => Promise<LfDebugLifecycleInfo>;
  /**
   * Retrieves the public props for the component. Passing `true` requests any
   * available descriptions alongside the raw values, enabling documentation views.
   */
  getProps: (
    descriptions?: boolean,
  ) => Promise<LfComponentPropsFor<LfComponentName>>;
  /**
   * Inline CSS string applied to the shadow root when present. Typically set by
   * adapter layers or storybook-style tooling.
   */
  lfStyle?: string;
  /**
   * Forces a re-render of the component so prop or state mutations become visible.
   */
  refresh: () => Promise<void>;
  /**
   * Starts the teardown flow and removes the element from the DOM after the
   * optional delay. Shared by adapters that animate component exits.
   */
  unmount: (ms?: number) => Promise<void>;
}
/**
 * Helper alias that extracts the root element type for a given component name.
 *
 * @template C Component name whose root element type should be returned.
 */
export type LfComponentRootElement<
  C extends LfComponentName = LfComponentName,
> = LfComponentElementMap[C];
/**
 * Convenience alias that returns the props interface associated with a component name.
 *
 * @template C Component name whose props interface is requested.
 */
export type LfComponentPropsFor<C extends LfComponentName> =
  LfComponentPropsMap[C];
/**
 * Resolves the HTML tag name registered for a component.
 *
 * @template C Component name whose custom element tag is requested.
 */
export type LfComponentTag<C extends LfComponentName = LfComponentName> =
  LfComponentTagMap[C];
/**
 * Props shared by every LF component instance.
 *
 * Currently exposes the `lfStyle` string used to inject per-instance CSS.
 */
export interface LfComponentBaseProps {
  lfStyle?: string;
}
/**
 * Input contract provided to data-shape render callbacks inside framework-driven components.
 *
 * @template S Data shape identifier that controls the specialised callback and payload types.
 */
export interface LfShapePropsInterface<S extends LfDataShapes = LfDataShapes> {
  /**
   * Runtime framework instance used to access helpers such as `sanitizeProps`,
   * dataset utilities, and theme helpers when rendering shapes.
   */
  framework: LfFrameworkInterface;
  /**
   * Identifier describing which renderer should be invoked (for example `text`,
   * `badge`, `card`).
   */
  shape: S;
  /**
   * Position of the cell within the parent dataset. Helps the renderer produce
   * deterministic keys and slot names.
   */
  index: number;
  /**
   * Data payload powering the shape. May be partial when upstream providers only
   * supply select fields (value, metadata, etc.).
   */
  cell: Partial<LfDataCell<S>>;
  /**
   * Function invoked after rendering to bubble component events back to the host.
   */
  eventDispatcher: LfDataShapeEventDispatcher;
  /**
   * Optional pre-dispatch hook executed before forwarding events to the dispatcher.
   * Useful for instrumentation or analytics.
   */
  defaultCb?: S extends "text"
    ? never
    : LfDataShapeCallback<LfComponentName, S>;
  /**
   * Ref callback that receives the rendered element for integrations that need
   * direct DOM access.
   */
  refCallback?: LfDataShapeRefCallback<LfComponentName>;
}
/**
 * Utility type describing the attribute dictionary produced by dynamic component wrappers.
 *
 * Keys follow the `lf*` naming convention and values are not constrained at compile time.
 */
export type LfDynamicComponentProps = {
  [K in `lf${Capitalize<string>}`]?: any;
};
/**
 * Union of all canonical component names exposed by the foundations package.
 */
export type LfComponentName =
  | "LfAccordion"
  | "LfArticle"
  | "LfAutocomplete"
  | "LfBadge"
  | "LfBreadcrumbs"
  | "LfButton"
  | "LfCanvas"
  | "LfCard"
  | "LfCarousel"
  | "LfChart"
  | "LfChart"
  | "LfChat"
  | "LfCheckbox"
  | "LfChip"
  | "LfCode"
  | "LfCompare"
  | "LfDrawer"
  | "LfHeader"
  | "LfImage"
  | "LfImageviewer"
  | "LfList"
  | "LfMasonry"
  | "LfMessenger"
  | "LfMultiInput"
  | "LfPhotoframe"
  | "LfPlaceholder"
  | "LfProgressbar"
  | "LfRadio"
  | "LfSelect"
  | "LfSlider"
  | "LfSpinner"
  | "LfSplash"
  | "LfToggle"
  | "LfTabbar"
  | "LfTextfield"
  | "LfToast"
  | "LfTree"
  | "LfTypewriter"
  | "LfUpload";
/**
 * Union of the strongly typed props interfaces for every component.
 *
 * Useful when the exact component is unknown but validation of the props shape is required.
 */
export type LfComponentProps =
  | LfAccordionPropsInterface
  | LfArticlePropsInterface
  | LfAutocompletePropsInterface
  | LfBadgePropsInterface
  | LfBreadcrumbsPropsInterface
  | LfButtonPropsInterface
  | LfCanvasPropsInterface
  | LfCardPropsInterface
  | LfCarouselPropsInterface
  | LfChartPropsInterface
  | LfChatPropsInterface
  | LfCheckboxPropsInterface
  | LfChipPropsInterface
  | LfCodePropsInterface
  | LfComparePropsInterface
  | LfDrawerPropsInterface
  | LfHeaderPropsInterface
  | LfImagePropsInterface
  | LfImageviewerPropsInterface
  | LfListPropsInterface
  | LfMasonryPropsInterface
  | LfMessengerPropsInterface
  | LfMultiInputPropsInterface
  | LfPhotoframePropsInterface
  | LfPlaceholderPropsInterface
  | LfProgressbarPropsInterface
  | LfRadioPropsInterface
  | LfSelectPropsInterface
  | LfSliderPropsInterface
  | LfSpinnerPropsInterface
  | LfSplashPropsInterface
  | LfTogglePropsInterface
  | LfTabbarPropsInterface
  | LfTextfieldPropsInterface
  | LfToastPropsInterface
  | LfTreePropsInterface
  | LfTypewriterPropsInterface
  | LfUploadPropsInterface;
/**
 * Maps component names to their corresponding props interfaces for indexed access.
 */
export type LfComponentPropsMap = {
  LfAccordion: LfAccordionPropsInterface;
  LfArticle: LfArticlePropsInterface;
  LfAutocomplete: LfAutocompletePropsInterface;
  LfBadge: LfBadgePropsInterface;
  LfBreadcrumbs: LfBreadcrumbsPropsInterface;
  LfButton: LfButtonPropsInterface;
  LfCanvas: LfCanvasPropsInterface;
  LfCard: LfCardPropsInterface;
  LfCarousel: LfCarouselPropsInterface;
  LfChart: LfChartPropsInterface;
  LfChat: LfChatPropsInterface;
  LfCheckbox: LfCheckboxPropsInterface;
  LfChip: LfChipPropsInterface;
  LfCode: LfCodePropsInterface;
  LfCompare: LfComparePropsInterface;
  LfDrawer: LfDrawerPropsInterface;
  LfHeader: LfHeaderPropsInterface;
  LfImage: LfImagePropsInterface;
  LfImageviewer: LfImageviewerPropsInterface;
  LfList: LfListPropsInterface;
  LfMasonry: LfMasonryPropsInterface;
  LfMessenger: LfMessengerPropsInterface;
  LfMultiInput: LfMultiInputPropsInterface;
  LfPhotoframe: LfPhotoframePropsInterface;
  LfPlaceholder: LfPlaceholderPropsInterface;
  LfProgressbar: LfProgressbarPropsInterface;
  LfRadio: LfRadioPropsInterface;
  LfSelect: LfSelectPropsInterface;
  LfSlider: LfSliderPropsInterface;
  LfSpinner: LfSpinnerPropsInterface;
  LfSplash: LfSplashPropsInterface;
  LfToggle: LfTogglePropsInterface;
  LfTabbar: LfTabbarPropsInterface;
  LfTextfield: LfTextfieldPropsInterface;
  LfToast: LfToastPropsInterface;
  LfTree: LfTreePropsInterface;
  LfTypewriter: LfTypewriterPropsInterface;
  LfUpload: LfUploadPropsInterface;
};
/**
 * Maps each component name to the custom element tag it registers.
 */
export type LfComponentTagMap = {
  LfAccordion: "lf-accordion";
  LfArticle: "lf-article";
  LfAutocomplete: "lf-autocomplete";
  LfBadge: "lf-badge";
  LfBreadcrumbs: "lf-breadcrumbs";
  LfButton: "lf-button";
  LfCanvas: "lf-canvas";
  LfCard: "lf-card";
  LfCarousel: "lf-carousel";
  LfChart: "lf-chart";
  LfChat: "lf-chat";
  LfCheckbox: "lf-checkbox";
  LfChip: "lf-chip";
  LfCode: "lf-code";
  LfCompare: "lf-compare";
  LfDrawer: "lf-drawer";
  LfHeader: "lf-header";
  LfImage: "lf-image";
  LfImageviewer: "lf-imageviewer";
  LfList: "lf-list";
  LfMasonry: "lf-masonry";
  LfMessenger: "lf-messenger";
  LfMultiInput: "lf-multiinput";
  LfPhotoframe: "lf-photoframe";
  LfPlaceholder: "lf-placeholder";
  LfProgressbar: "lf-progressbar";
  LfRadio: "lf-radio";
  LfSelect: "lf-select";
  LfSlider: "lf-slider";
  LfSpinner: "lf-spinner";
  LfSplash: "lf-splash";
  LfToggle: "lf-toggle";
  LfTabbar: "lf-tabbar";
  LfTextfield: "lf-textfield";
  LfToast: "lf-toast";
  LfTree: "lf-tree";
  LfTypewriter: "lf-typewriter";
  LfUpload: "lf-upload";
};
/**
 * Reverse lookup that resolves the canonical component name from a custom element tag.
 */
export type LfComponentReverseTagMap = {
  "lf-accordion": "LfAccordion";
  "lf-article": "LfArticle";
  "lf-autocomplete": "LfAutocomplete";
  "lf-badge": "LfBadge";
  "lf-breadcrumbs": "LfBreadcrumbs";
  "lf-button": "LfButton";
  "lf-canvas": "LfCanvas";
  "lf-card": "LfCard";
  "lf-carousel": "LfCarousel";
  "lf-chart": "LfChart";
  "lf-chat": "LfChat";
  "lf-checkbox": "LfCheckbox";
  "lf-chip": "LfChip";
  "lf-code": "LfCode";
  "lf-compare": "LfCompare";
  "lf-drawer": "LfDrawer";
  "lf-header": "LfHeader";
  "lf-image": "LfImage";
  "lf-imageviewer": "LfImageviewer";
  "lf-list": "LfList";
  "lf-masonry": "LfMasonry";
  "lf-messenger": "LfMessenger";
  "lf-multiinput": "LfMultiInput";
  "lf-photoframe": "LfPhotoframe";
  "lf-placeholder": "LfPlaceholder";
  "lf-progressbar": "LfProgressbar";
  "lf-radio": "LfRadio";
  "lf-select": "LfSelect";
  "lf-slider": "LfSlider";
  "lf-spinner": "LfSpinner";
  "lf-splash": "LfSplash";
  "lf-toggle": "LfToggle";
  "lf-tabbar": "LfTabbar";
  "lf-textfield": "LfTextfield";
  "lf-toast": "LfToast";
  "lf-tree": "LfTree";
  "lf-typewriter": "LfTypewriter";
  "lf-upload": "LfUpload";
};

//#region Third-party declarations (Stencil)
/**
 * Minimal representation of a Stencil virtual node used by render helpers.
 *
 * Field names follow Stencil's internal `$`-prefixed conventions.
 */
export interface VNode {
  $flags$: number;
  $tag$: string | number | Function;
  $elm$: any;
  $text$: string;
  $children$: VNode[];
  $attrs$?: any;
  $name$?: string;
  $key$?: string | number;
}
/**
 * Base interface implemented by every Stencil-generated HTML element.
 *
 * Combines the native `HTMLElement` contract with the shared LF lifecycle utilities.
 */
export interface HTMLStencilElement
  extends HTMLElement,
    Pick<
      LfComponentCommon,
      "getDebugInfo" | "getProps" | "refresh" | "unmount"
    > {
  componentOnReady(): Promise<this>;
}
//#endregion
