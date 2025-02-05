import { LfComponentTag, LfCoreInterface } from "@lf-widgets/foundations";
import { getAccordionFixtures } from "../assets/data/accordion";
import { getArticleFixtures } from "../assets/data/article";
import { getBadgeFixtures } from "../assets/data/badge";
import { getButtonFixtures } from "../assets/data/button";
import { getCanvasFixtures } from "../assets/data/canvas";
import { getCardFixtures } from "../assets/data/card";
import { getCarouselFixtures } from "../assets/data/carousel";
import { getChartFixtures } from "../assets/data/chart";
import { getChatFixtures } from "../assets/data/chat";
import { getChipFixtures } from "../assets/data/chip";
import { getCodeFixtures } from "../assets/data/code";
import { getColorFixtures } from "../assets/data/color";
import { getCompareFixtures } from "../assets/data/compare";
import { getCoreFixtures } from "../assets/data/core";
import { getDataFixtures } from "../assets/data/data";
import { getDebugFixtures } from "../assets/data/debug";
import { getDragFixtures } from "../assets/data/drag";
import { getDrawerFixtures } from "../assets/data/drawer";
import { getEffectsFixtures } from "../assets/data/effects";
import { getHeaderFixtures } from "../assets/data/header";
import { getImageFixtures } from "../assets/data/image";
import { getImageviewerFixtures } from "../assets/data/imageviewer";
import { getListFixtures } from "../assets/data/list";
import { getLlmFixtures } from "../assets/data/llm";
import { getMasonryFixtures } from "../assets/data/masonry";
import { getMessengerFixtures } from "../assets/data/messenger";
import { getPhotoframeFixtures } from "../assets/data/photoframe";
import { getPlaceholderFixtures } from "../assets/data/placeholder";
import { getPortalFixtures } from "../assets/data/portal";
import { getProgressbarFixtures } from "../assets/data/progressbar";
import { getSliderFixtures } from "../assets/data/slider";
import { getSpinnerFixtures } from "../assets/data/spinner";
import { getSplashFixtures } from "../assets/data/splash";
import { getTabbarFixtures } from "../assets/data/tabbar";
import { getTextfieldFixtures } from "../assets/data/textfield";
import { getThemeFixtures } from "../assets/data/theme";
import { getToastFixtures } from "../assets/data/toast";
import { getToggleFixtures } from "../assets/data/toggle";
import { getTreeFixtures } from "../assets/data/tree";
import { getTypewriterFixtures } from "../assets/data/typewriter";
import { getUploadFixtures } from "../assets/data/upload";
import { LfShowcase } from "../lf-showcase";

export const getComponentFixtures = <C extends LfComponentTag>(
  showcase: LfShowcase,
  component: C,
  core: LfCoreInterface,
) => {
  switch (component) {
    case "lf-accordion":
      return getAccordionFixtures(core);
    case "lf-article":
      return getArticleFixtures(core);
    case "lf-badge":
      return getBadgeFixtures(core);
    case "lf-button":
      return getButtonFixtures(core);
    case "lf-canvas":
      return getCanvasFixtures(core);
    case "lf-carousel":
      return getCarouselFixtures(core);
    case "lf-card":
      return getCardFixtures(core);
    case "lf-chart":
      return getChartFixtures(core);
    case "lf-chat":
      return getChatFixtures(core);
    case "lf-chip":
      return getChipFixtures(core);
    case "lf-code":
      return getCodeFixtures(core);
    case "lf-compare":
      return getCompareFixtures(core);
    case "lf-drawer":
      return getDrawerFixtures(showcase);
    case "lf-header":
      return getHeaderFixtures(showcase);
    case "lf-image":
      return getImageFixtures(core);
    case "lf-imageviewer":
      return getImageviewerFixtures(core);
    case "lf-list":
      return getListFixtures(core);
    case "lf-masonry":
      return getMasonryFixtures(core);
    case "lf-messenger":
      return getMessengerFixtures(core);
    case "lf-photoframe":
      return getPhotoframeFixtures(core);
    case "lf-placeholder":
      return getPlaceholderFixtures(core);
    case "lf-progressbar":
      return getProgressbarFixtures(core);
    case "lf-slider":
      return getSliderFixtures(core);
    case "lf-spinner":
      return getSpinnerFixtures(core);
    case "lf-splash":
      return getSplashFixtures(core);
    case "lf-tabbar":
      return getTabbarFixtures(core);
    case "lf-textfield":
      return getTextfieldFixtures(core);
    case "lf-toast":
      return getToastFixtures(core);
    case "lf-toggle":
      return getToggleFixtures(core);
    case "lf-tree":
      return getTreeFixtures(core);
    case "lf-typewriter":
      return getTypewriterFixtures(core);
    case "lf-upload":
      return getUploadFixtures(core);
  }

  return null;
};

export const getFrameworkFixtures = (framework: string) => {
  switch (framework.toLowerCase()) {
    case "color":
      return getColorFixtures();
    case "core":
      return getCoreFixtures();
    case "data":
      return getDataFixtures();
    case "debug":
      return getDebugFixtures();
    case "drag":
      return getDragFixtures();
    case "effects":
      return getEffectsFixtures();
    case "llm":
      return getLlmFixtures();
    case "portal":
      return getPortalFixtures();
    case "theme":
      return getThemeFixtures();
  }

  return null;
};
