import { LF_ACCORDION_PROPS } from "../components/accordion.constants";
import { LF_ARTICLE_PROPS } from "../components/article.constants";
import { LF_BADGE_PROPS } from "../components/badge.constants";
import { LF_BUTTON_PROPS } from "../components/button.constants";
import { LF_CANVAS_PROPS } from "../components/canvas.constants";
import { LF_CARD_PROPS } from "../components/card.constants";
import { LF_CAROUSEL_PROPS } from "../components/carousel.constants";
import { LF_CHART_PROPS } from "../components/chart.constants";
import { LF_CHAT_PROPS } from "../components/chat.constants";
import { LF_CHIP_PROPS } from "../components/chip.constants";
import { LF_CODE_PROPS } from "../components/code.constants";
import { LF_COMPARE_PROPS } from "../components/compare.constants";
import { LF_DRAWER_PROPS } from "../components/drawer.constants";
import { LF_HEADER_PROPS } from "../components/header.constants";
import { LF_IMAGE_PROPS } from "../components/image.constants";
import { LF_IMAGEVIEWER_PROPS } from "../components/imageviewer.constants";
import { LF_LIST_PROPS } from "../components/list.constants";
import { LF_MASONRY_PROPS } from "../components/masonry.constants";
import { LF_MESSENGER_PROPS } from "../components/messenger.constants";
import { LF_PHOTOFRAME_PROPS } from "../components/photoframe.constants";
import { LF_PLACEHOLDER_PROPS } from "../components/placeholder.constants";
import { LF_PROGRESSBAR_PROPS } from "../components/progressbar.constants";
import { LF_SLIDER_PROPS } from "../components/slider.constants";
import { LF_SPINNER_PROPS } from "../components/spinner.constants";
import { LF_SPLASH_PROPS } from "../components/splash.constants";
import { LF_TABBAR_PROPS } from "../components/tabbar.constants";
import { LF_TEXTFIELD_PROPS } from "../components/textfield.constants";
import { LF_TOAST_PROPS } from "../components/toast.constants";
import { LF_TOGGLE_PROPS } from "../components/toggle.constants";
import { LF_TREE_PROPS } from "../components/tree.constants";
import { LF_TYPEWRITER_PROPS } from "../components/typewriter.constants";
import { LF_UPLOAD_PROPS } from "../components/upload.constants";
import {
  LfComponentName,
  LfComponentPropsMap,
} from "./components.declarations";

export const CSS_VAR_PREFIX = "--lf-" as const;
export const CY_ATTRIBUTES = {
  button: "button",
  canvas: "canvas",
  check: "check",
  dropdownButton: "dropdown-button",
  dropdownMenu: "dropdown-menu",
  effects: "effects",
  icon: "icon",
  image: "image",
  input: "input",
  maskedSvg: "masked-svg",
  node: "node",
  portal: "portal",
  rippleSurface: "ripple-surface",
  shape: "shape",
  showcaseExample: "showcase-example",
  showcaseGridWrapper: "showcase-grid-wrapper",
} as const;
export const LF_ATTRIBUTES = {
  backdrop: "backdrop",
  danger: "danger",
  disabled: "disabled",
  fadeIn: "fade-in",
  icon: "icon",
  info: "info",
  lightbox: "lightbox",
  lightboxContent: "lightbox-content",
  portal: "portal",
  primary: "primary",
  ripple: "ripple",
  rippleSurface: "ripple-surface",
  secondary: "secondary",
  success: "success",
  tilt: "tilt",
  warning: "warning",
} as const;
export const LF_STYLE_ID = "lf-style" as const;
export const LF_WRAPPER_ID = "lf-component" as const;
export const getComponentProps = (): {
  [K in LfComponentName]: (keyof LfComponentPropsMap[K])[];
} => {
  return {
    LfAccordion: LF_ACCORDION_PROPS,
    LfArticle: LF_ARTICLE_PROPS,
    LfBadge: LF_BADGE_PROPS,
    LfButton: LF_BUTTON_PROPS,
    LfCanvas: LF_CANVAS_PROPS,
    LfCard: LF_CARD_PROPS,
    LfCarousel: LF_CAROUSEL_PROPS,
    LfChart: LF_CHART_PROPS,
    LfChat: LF_CHAT_PROPS,
    LfChip: LF_CHIP_PROPS,
    LfCode: LF_CODE_PROPS,
    LfCompare: LF_COMPARE_PROPS,
    LfDrawer: LF_DRAWER_PROPS,
    LfHeader: LF_HEADER_PROPS,
    LfImage: LF_IMAGE_PROPS,
    LfImageviewer: LF_IMAGEVIEWER_PROPS,
    LfList: LF_LIST_PROPS,
    LfMasonry: LF_MASONRY_PROPS,
    LfMessenger: LF_MESSENGER_PROPS,
    LfPhotoframe: LF_PHOTOFRAME_PROPS,
    LfPlaceholder: LF_PLACEHOLDER_PROPS,
    LfProgressbar: LF_PROGRESSBAR_PROPS,
    LfSlider: LF_SLIDER_PROPS,
    LfSpinner: LF_SPINNER_PROPS,
    LfSplash: LF_SPLASH_PROPS,
    LfTabbar: LF_TABBAR_PROPS,
    LfTextfield: LF_TEXTFIELD_PROPS,
    LfToast: LF_TOAST_PROPS,
    LfToggle: LF_TOGGLE_PROPS,
    LfTree: LF_TREE_PROPS,
    LfTypewriter: LF_TYPEWRITER_PROPS,
    LfUpload: LF_UPLOAD_PROPS,
  } as const;
};
