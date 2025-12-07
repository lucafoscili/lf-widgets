import { LF_ACCORDION_PROPS } from "../components/accordion.constants";
import { LF_ARTICLE_PROPS } from "../components/article.constants";
import { LF_AUTOCOMPLETE_PROPS } from "../components/autocomplete.constants";
import { LF_BADGE_PROPS } from "../components/badge.constants";
import { LF_BREADCRUMBS_PROPS } from "../components/breadcrumbs.constants";
import { LF_BUTTON_PROPS } from "../components/button.constants";
import { LF_CANVAS_PROPS } from "../components/canvas.constants";
import { LF_CARD_PROPS } from "../components/card.constants";
import { LF_CAROUSEL_PROPS } from "../components/carousel.constants";
import { LF_CHART_PROPS } from "../components/chart.constants";
import { LF_CHAT_PROPS } from "../components/chat.constants";
import { LF_CHECKBOX_PROPS } from "../components/checkbox.constants";
import { LF_CHIP_PROPS } from "../components/chip.constants";
import { LF_CODE_PROPS } from "../components/code.constants";
import { LF_COMPARE_PROPS } from "../components/compare.constants";
import { LF_DRAWER_PROPS } from "../components/drawer.constants";
import { LF_HEADER_PROPS } from "../components/header.constants";
import { LF_IMAGE_PROPS } from "../components/image.constants";
import { LF_LIST_PROPS } from "../components/list.constants";
import { LF_MASONRY_PROPS } from "../components/masonry.constants";
import { LF_MESSENGER_PROPS } from "../components/messenger.constants";
import { LF_MULTIINPUT_PROPS } from "../components/multiinput.constants";
import { LF_PHOTOFRAME_PROPS } from "../components/photoframe.constants";
import { LF_PLACEHOLDER_PROPS } from "../components/placeholder.constants";
import { LF_PROGRESSBAR_PROPS } from "../components/progressbar.constants";
import { LF_RADIO_PROPS } from "../components/radio.constants";
import { LF_SELECT_PROPS } from "../components/select.constants";
import { LF_SHAPEEDITOR_PROPS } from "../components/shapeeditor.constants";
import { LF_SLIDER_PROPS } from "../components/slider.constants";
import { LF_SNACKBAR_PROPS } from "../components/snackbar.constants";
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

/**
 * Namespace prefix applied to every CSS custom property emitted by LF components.
 *
 * Useful when generating token names programmatically, e.g. `${CSS_VAR_PREFIX}color-primary`.
 */
export const CSS_VAR_PREFIX = "--lf-" as const;
/**
 * Canonical collection of `data-cy` attribute values used by end-to-end tests.
 *
 * Keys describe the semantic target and values are the identifiers written to
 * the DOM to keep selectors consistent across packages.
 */
export const CY_ATTRIBUTES = {
  button: "button",
  canvas: "canvas",
  check: "check",
  dropdownButton: "dropdown-button",
  dropdownMenu: "dropdown-menu",
  effects: "effects",
  fIcon: "f-icon",
  icon: "icon",
  image: "image",
  input: "input",
  node: "node",
  portal: "portal",
  shape: "shape",
  showcaseExample: "showcase-example",
  showcaseGridWrapper: "showcase-grid-wrapper",
  spinner: "spinner",
} as const;
/**
 * Composable effect attributes that use hierarchical dataset naming.
 *
 * These are applied via JavaScript (element.dataset.lfEffectName) to allow
 * multiple effects per element. CSS targets these via [data-lf-effect-name].
 *
 * NOTE: These values are the camelCase dataset keys (e.g., "lfNeonGlow" → data-lf-neon-glow).
 */
export const LF_EFFECT_ATTRIBUTES = {
  neonGlow: "lfNeonGlow",
  neonGlowReflection: "lfNeonGlowReflection",
  ripple: "lfRipple",
  tilt: "lfTilt",
} as const;
/**
 * Utility attributes that are mutually exclusive (structural elements).
 *
 * Uses single-value pattern (data-lf="<utility>") for elements that serve
 * a specific structural purpose. Applied via setAttribute or JSX data-lf prop.
 */
export const LF_UTILITY_ATTRIBUTES = {
  backdrop: "backdrop",
  fadeIn: "fade-in",
  lightbox: "lightbox",
  lightboxContent: "lightbox-content",
  portal: "portal",
} as const;
/**
 * State attributes for semantic coloring (mutually exclusive per element).
 */
export const LF_STATE_ATTRIBUTES = {
  danger: "danger",
  disabled: "disabled",
  icon: "icon",
  info: "info",
  primary: "primary",
  secondary: "secondary",
  success: "success",
  warning: "warning",
} as const;
/**
 * @deprecated Use LF_EFFECT_ATTRIBUTES, LF_UTILITY_ATTRIBUTES, or LF_STATE_ATTRIBUTES instead.
 * Kept for backward compatibility during migration.
 *
 * Shared set of boolean host attributes that influence component styling or behaviour.
 * Centralises attribute names so adapters and components avoid hard-coding strings.
 *
 * NOTE: For effects (neonGlow, tilt, ripple), components should use the dataset API
 * directly (e.g., element.dataset.lfNeonGlow) for hierarchical composability.
 * The values here maintain backward compatibility for components still using data-lf="...".
 */
export const LF_ATTRIBUTES = {
  // Utilities (mutually exclusive, data-lf="value")
  ...LF_UTILITY_ATTRIBUTES,
  // States (semantic colors, data-lf="value")
  ...LF_STATE_ATTRIBUTES,
  // Backward compat: old effect names for data-lf="value" pattern
  // Components should migrate to dataset API for composability
  neonGlow: "neon-glow",
  neonGlowReflection: "neon-glow-reflection",
  ripple: "ripple",
  tilt: "tilt",
} as const;
/**
 * DOM id assigned to the global `<style>` element injected by the runtime.
 *
 * Components reuse this when mounting per-instance `<style>` tags so tooling can
 * detect or replace them.
 */
export const LF_STYLE_ID = "lf-style" as const;
/**
 * DOM id prefix applied to wrapper elements that host LF components.
 *
 * Allows developer tools to locate the root container wrapper reliably.
 */
export const LF_WRAPPER_ID = "lf-component" as const;
/**
 * Returns the list of public property names supported by each component.
 *
 * Used by docs generators, playgrounds, and adapters to reflectively inspect
 * which props exist on a component.
 */
export const getComponentProps = (): {
  [K in LfComponentName]: (keyof LfComponentPropsMap[K])[];
} => {
  return {
    LfAccordion: LF_ACCORDION_PROPS,
    LfArticle: LF_ARTICLE_PROPS,
    LfAutocomplete: LF_AUTOCOMPLETE_PROPS,
    LfBadge: LF_BADGE_PROPS,
    LfBreadcrumbs: LF_BREADCRUMBS_PROPS,
    LfButton: LF_BUTTON_PROPS,
    LfCanvas: LF_CANVAS_PROPS,
    LfCard: LF_CARD_PROPS,
    LfCarousel: LF_CAROUSEL_PROPS,
    LfChart: LF_CHART_PROPS,
    LfChat: LF_CHAT_PROPS,
    LfCheckbox: LF_CHECKBOX_PROPS,
    LfChip: LF_CHIP_PROPS,
    LfCode: LF_CODE_PROPS,
    LfCompare: LF_COMPARE_PROPS,
    LfDrawer: LF_DRAWER_PROPS,
    LfHeader: LF_HEADER_PROPS,
    LfImage: LF_IMAGE_PROPS,
    LfList: LF_LIST_PROPS,
    LfMasonry: LF_MASONRY_PROPS,
    LfMessenger: LF_MESSENGER_PROPS,
    LfMultiInput: LF_MULTIINPUT_PROPS,
    LfPhotoframe: LF_PHOTOFRAME_PROPS,
    LfPlaceholder: LF_PLACEHOLDER_PROPS,
    LfProgressbar: LF_PROGRESSBAR_PROPS,
    LfRadio: LF_RADIO_PROPS,
    LfSelect: LF_SELECT_PROPS,
    LfShapeeditor: LF_SHAPEEDITOR_PROPS,
    LfSlider: LF_SLIDER_PROPS,
    LfSnackbar: LF_SNACKBAR_PROPS,
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
