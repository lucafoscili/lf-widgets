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
  LfBadgeElement,
  LfBadgeInterface,
  LfBadgePropsInterface,
} from "../components/badge.declarations";
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
import { LfDebugLifecycleInfo } from "../framework/debug.declarations";

export interface LfComponent<T extends LfComponentName = LfComponentName>
  extends LfComponentCommon {
  rootElement: LfComponentElementMap[T];
}
export type LfComponentType<T extends LfComponentName = LfComponentName> =
  T extends keyof LfComponentClassMap
    ? LfComponentClassMap[T]
    : LfComponentCommon;
export type LfComponentElementMap = {
  LfAccordion: LfAccordionElement;
  LfArticle: LfArticleElement;
  LfBadge: LfBadgeElement;
  LfButton: LfButtonElement;
  LfCanvas: LfCanvasElement;
  LfCard: LfCardElement;
  LfCarousel: LfCarouselElement;
  LfChart: LfChartElement;
  LfChat: LfChatElement;
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
  LfPhotoframe: LfPhotoframeElement;
  LfPlaceholder: LfPlaceholderElement;
  LfProgressbar: LfProgressbarElement;
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
export type LfComponentClassMap = {
  LfAccordion: LfAccordionInterface;
  LfArticle: LfArticleInterface;
  LfBadge: LfBadgeInterface;
  LfButton: LfButtonInterface;
  LfCanvas: LfCanvasInterface;
  LfCard: LfCardInterface;
  LfCarousel: LfCarouselInterface;
  LfChart: LfChartInterface;
  LfChat: LfChatInterface;
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
  LfPhotoframe: LfPhotoframeInterface;
  LfPlaceholder: LfPlaceholderInterface;
  LfProgressbar: LfProgressbarInterface;
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
interface LfComponentCommon {
  debugInfo: LfDebugLifecycleInfo;
  getDebugInfo: () => Promise<LfDebugLifecycleInfo>;
  getProps: (
    descriptions?: boolean,
  ) => Promise<LfComponentPropsFor<LfComponentName>>;
  lfStyle?: string;
  refresh: () => Promise<void>;
  unmount: (ms?: number) => Promise<void>;
}
export type LfComponentRootElement<
  C extends LfComponentName = LfComponentName,
> = LfComponentElementMap[C];
export type LfComponentPropsFor<C extends LfComponentName> =
  LfComponentPropsMap[C];
export type LfComponentTag<C extends LfComponentName = LfComponentName> =
  LfComponentTagMap[C];
export interface LfComponentBaseProps {
  lfStyle?: string;
}
export type LfDynamicComponentProps = {
  [K in `lf${Capitalize<string>}`]?: any;
};
export type LfComponentName =
  | "LfAccordion"
  | "LfArticle"
  | "LfBadge"
  | "LfButton"
  | "LfCanvas"
  | "LfCard"
  | "LfCarousel"
  | "LfChart"
  | "LfChat"
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
  | "LfPhotoframe"
  | "LfPlaceholder"
  | "LfProgressbar"
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
export type LfComponentProps =
  | LfAccordionPropsInterface
  | LfArticlePropsInterface
  | LfBadgePropsInterface
  | LfButtonPropsInterface
  | LfCanvasPropsInterface
  | LfCardPropsInterface
  | LfCarouselPropsInterface
  | LfChartPropsInterface
  | LfChatPropsInterface
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
  | LfPhotoframePropsInterface
  | LfPlaceholderPropsInterface
  | LfProgressbarPropsInterface
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
export type LfComponentPropsMap = {
  LfAccordion: LfAccordionPropsInterface;
  LfArticle: LfArticlePropsInterface;
  LfBadge: LfBadgePropsInterface;
  LfButton: LfButtonPropsInterface;
  LfCanvas: LfCanvasPropsInterface;
  LfCard: LfCardPropsInterface;
  LfCarousel: LfCarouselPropsInterface;
  LfChart: LfChartPropsInterface;
  LfChat: LfChatPropsInterface;
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
  LfPhotoframe: LfPhotoframePropsInterface;
  LfPlaceholder: LfPlaceholderPropsInterface;
  LfProgressbar: LfProgressbarPropsInterface;
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
export type LfComponentTagMap = {
  LfAccordion: "lf-accordion";
  LfArticle: "lf-article";
  LfBadge: "lf-badge";
  LfButton: "lf-button";
  LfCanvas: "lf-canvas";
  LfCard: "lf-card";
  LfCarousel: "lf-carousel";
  LfChart: "lf-chart";
  LfChat: "lf-chat";
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
  LfPhotoframe: "lf-photoframe";
  LfPlaceholder: "lf-placeholder";
  LfProgressbar: "lf-progressbar";
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
export type LfComponentReverseTagMap = {
  "lf-accordion": "LfAccordion";
  "lf-article": "LfArticle";
  "lf-badge": "LfBadge";
  "lf-button": "LfButton";
  "lf-canvas": "LfCanvas";
  "lf-card": "LfCard";
  "lf-carousel": "LfCarousel";
  "lf-chart": "LfChart";
  "lf-chat": "LfChat";
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
  "lf-photoframe": "LfPhotoframe";
  "lf-placeholder": "LfPlaceholder";
  "lf-progressbar": "LfProgressbar";
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
export interface HTMLStencilElement
  extends HTMLElement,
    Pick<
      LfComponentCommon,
      "getDebugInfo" | "getProps" | "refresh" | "unmount"
    > {
  componentOnReady(): Promise<this>;
}
//#endregion
