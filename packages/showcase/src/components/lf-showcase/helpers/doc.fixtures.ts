import { LfComponentTag, LfFrameworkInterface } from "@lf-widgets/foundations";
import { getAccordionFixtures } from "../assets/data/accordion";
import { getArticleFixtures } from "../assets/data/article";
import { getAutocompleteFixtures } from "../assets/data/autocomplete";
import { getBadgeFixtures } from "../assets/data/badge";
import { getButtonFixtures } from "../assets/data/button";
import { getCanvasFixtures } from "../assets/data/canvas";
import { getCardFixtures } from "../assets/data/card";
import { getCarouselFixtures } from "../assets/data/carousel";
import { getChartFixtures } from "../assets/data/chart";
import { getChatFixtures } from "../assets/data/chat";
import { getCheckboxFixtures } from "../assets/data/checkbox";
import { getChipFixtures } from "../assets/data/chip";
import { getCodeFixtures } from "../assets/data/code";
import { getColorFixtures } from "../assets/data/color";
import { getCompareFixtures } from "../assets/data/compare";
import { getDataFixtures } from "../assets/data/data";
import { getDebugFixtures } from "../assets/data/debug";
import { getDragFixtures } from "../assets/data/drag";
import { getDrawerFixtures } from "../assets/data/drawer";
import { getEffectsFixtures } from "../assets/data/effects";
import { getFrameworkFixtures } from "../assets/data/framework";
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
import { getRadioFixtures } from "../assets/data/radio";
import { getSelectFixtures } from "../assets/data/select";
import { getMultiInputFixtures } from "../assets/data/multiinput";
import { getSliderFixtures } from "../assets/data/slider";
import { getSpinnerFixtures } from "../assets/data/spinner";
import { getSplashFixtures } from "../assets/data/splash";
import { getSyntaxFixtures } from "../assets/data/syntax";
import { getTabbarFixtures } from "../assets/data/tabbar";
import { getTextfieldFixtures } from "../assets/data/textfield";
import { getThemeFixtures } from "../assets/data/theme";
import { getToastFixtures } from "../assets/data/toast";
import { getToggleFixtures } from "../assets/data/toggle";
import { getTreeFixtures } from "../assets/data/tree";
import { getTypewriterFixtures } from "../assets/data/typewriter";
import { getUploadFixtures } from "../assets/data/upload";
import { LfShowcase } from "../lf-showcase";

export const getAllComponentFixtures = <C extends LfComponentTag>(
  showcase: LfShowcase,
  component: C,
  framework: LfFrameworkInterface,
) => {
  switch (component) {
    case "lf-accordion":
      return getAccordionFixtures(framework);
    case "lf-article":
      return getArticleFixtures(framework);
    case "lf-autocomplete":
      return getAutocompleteFixtures(framework);
    case "lf-badge":
      return getBadgeFixtures(framework);
    case "lf-button":
      return getButtonFixtures(framework);
    case "lf-canvas":
      return getCanvasFixtures(framework);
    case "lf-carousel":
      return getCarouselFixtures(framework);
    case "lf-card":
      return getCardFixtures(framework);
    case "lf-chart":
      return getChartFixtures(framework);
    case "lf-chat":
      return getChatFixtures(framework);
    case "lf-checkbox":
      return getCheckboxFixtures(framework);
    case "lf-chip":
      return getChipFixtures(framework);
    case "lf-code":
      return getCodeFixtures(framework);
    case "lf-compare":
      return getCompareFixtures(framework);
    case "lf-drawer":
      return getDrawerFixtures(showcase);
    case "lf-header":
      return getHeaderFixtures(showcase);
    case "lf-image":
      return getImageFixtures(framework);
    case "lf-imageviewer":
      return getImageviewerFixtures(framework);
    case "lf-list":
      return getListFixtures(framework);
    case "lf-masonry":
      return getMasonryFixtures(framework);
    case "lf-messenger":
      return getMessengerFixtures(framework);
    case "lf-multiinput":
      return getMultiInputFixtures(framework);
    case "lf-photoframe":
      return getPhotoframeFixtures(framework);
    case "lf-placeholder":
      return getPlaceholderFixtures(framework);
    case "lf-progressbar":
      return getProgressbarFixtures(framework);
    case "lf-radio":
      return getRadioFixtures(framework);
    case "lf-select":
      return getSelectFixtures(framework);
    case "lf-slider":
      return getSliderFixtures(framework);
    case "lf-spinner":
      return getSpinnerFixtures(framework);
    case "lf-splash":
      return getSplashFixtures(framework);
    case "lf-tabbar":
      return getTabbarFixtures(framework);
    case "lf-textfield":
      return getTextfieldFixtures(framework);
    case "lf-toast":
      return getToastFixtures(framework);
    case "lf-toggle":
      return getToggleFixtures(framework);
    case "lf-tree":
      return getTreeFixtures(framework);
    case "lf-typewriter":
      return getTypewriterFixtures(framework);
    case "lf-upload":
      return getUploadFixtures(framework);
  }
};

export const getAllFrameworkFixtures = (framework: string) => {
  switch (framework.toLowerCase()) {
    case "color":
      return getColorFixtures();
    case "data":
      return getDataFixtures();
    case "debug":
      return getDebugFixtures();
    case "drag":
      return getDragFixtures();
    case "effects":
      return getEffectsFixtures();
    case "framework":
      return getFrameworkFixtures();
    case "llm":
      return getLlmFixtures();
    case "portal":
      return getPortalFixtures();
    case "syntax":
      return getSyntaxFixtures();
    case "theme":
      return getThemeFixtures();
    default:
      return null;
  }
};
