import { LfAccordionEvent } from "../components/accordion.declarations";
import { LfArticleEvent } from "../components/article.declarations";
import { LfBadgeEvent } from "../components/badge.declarations";
import { LfButtonEvent } from "../components/button.declarations";
import { LfCanvasEvent } from "../components/canvas.declarations";
import { LfCardEvent } from "../components/card.declarations";
import { LfCarouselEvent } from "../components/carousel.declarations";
import { LfChartEvent } from "../components/chart.declarations";
import { LfChatEvent } from "../components/chat.declarations";
import { LfChipEvent } from "../components/chip.declarations";
import { LfCodeEvent } from "../components/code.declarations";
import { LfCompareEvent } from "../components/compare.declarations";
import { LfDrawerEvent } from "../components/drawer.declarations";
import { LfHeaderEvent } from "../components/header.declarations";
import { LfImageEvent } from "../components/image.declarations";
import { LfImageviewerEvent } from "../components/imageviewer.declarations";
import { LfListEvent } from "../components/list.declarations";
import { LfMasonryEvent } from "../components/masonry.declarations";
import { LfMessengerEvent } from "../components/messenger.declarations";
import { LfPhotoframeEvent } from "../components/photoframe.declarations";
import { LfPlaceholderEvent } from "../components/placeholder.declarations";
import { LfProgressbarEvent } from "../components/progressbar.declarations";
import { LfSliderEvent } from "../components/slider.declarations";
import { LfSpinnerEvent } from "../components/spinner.declarations";
import { LfSplashEvent } from "../components/splash.declarations";
import { LfTabbarEvent } from "../components/tabbar.declarations";
import { LfTextfieldEvent } from "../components/textfield.declarations";
import { LfToastEvent } from "../components/toast.declarations";
import { LfToggleEvent } from "../components/toggle.declarations";
import { LfTreeEvent } from "../components/tree.declarations";
import { LfTypewriterEvent } from "../components/typewriter.declarations";
import { LfUploadEvent } from "../components/upload.declarations";
import {
  LfComponent,
  LfComponentName,
  LfComponentTag,
  LfComponentType,
} from "./components.declarations";

export type LfEvent<P extends LfEventPayload = LfEventPayload> = CustomEvent<P>;
export type LfEventName<C extends LfComponentName = LfComponentName> =
  `${LfComponentTag<C>}-event`;
export type LfEventType<
  C extends LfComponent<LfComponentName> = LfComponent<LfComponentName>,
> = ComponentEventMap[ExtractComponentName<C>];
export interface LfEventPayload<
  C extends LfComponentName = LfComponentName,
  T extends LfEventType<LfComponent<C>> = LfEventType<LfComponent<C>>,
> {
  comp: LfComponentType<C>;
  eventType: T;
  id: string;
  originalEvent: CustomEvent | Event;
}
export type LfEventPayloadName<C extends LfComponentName> = `${C}EventPayload`;
export type ComponentEventMap = {
  LfAccordion: LfAccordionEvent;
  LfArticle: LfArticleEvent;
  LfBadge: LfBadgeEvent;
  LfButton: LfButtonEvent;
  LfCanvas: LfCanvasEvent;
  LfCard: LfCardEvent;
  LfCarousel: LfCarouselEvent;
  LfChart: LfChartEvent;
  LfChat: LfChatEvent;
  LfChip: LfChipEvent;
  LfCode: LfCodeEvent;
  LfCompare: LfCompareEvent;
  LfDrawer: LfDrawerEvent;
  LfHeader: LfHeaderEvent;
  LfImage: LfImageEvent;
  LfImageviewer: LfImageviewerEvent;
  LfList: LfListEvent;
  LfMasonry: LfMasonryEvent;
  LfMessenger: LfMessengerEvent;
  LfPhotoframe: LfPhotoframeEvent;
  LfPlaceholder: LfPlaceholderEvent;
  LfProgressbar: LfProgressbarEvent;
  LfSlider: LfSliderEvent;
  LfSpinner: LfSpinnerEvent;
  LfSplash: LfSplashEvent;
  LfToggle: LfToggleEvent;
  LfTabbar: LfTabbarEvent;
  LfTextfield: LfTextfieldEvent;
  LfToast: LfToastEvent;
  LfTree: LfTreeEvent;
  LfTypewriter: LfTypewriterEvent;
  LfUpload: LfUploadEvent;
};
type ExtractComponentName<C> = C extends LfComponent<infer N> ? N : never;
