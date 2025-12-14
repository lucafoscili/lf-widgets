import {
  LF_CAROUSEL_IDS,
  LfCarouselAdapter,
  LfCarouselAdapterHandlers,
} from "@lf-widgets/foundations";

export const prepSideButtonHandlers = (
  getAdapter: () => LfCarouselAdapter,
): LfCarouselAdapterHandlers => {
  return {
    button: (e) => {
      const { eventType, id } = e.detail;

      const { prev, next } = getAdapter().controller.actions.navigation;

      switch (eventType) {
        case "click":
          switch (id) {
            case LF_CAROUSEL_IDS.carousel.back:
              prev();
              break;
            case LF_CAROUSEL_IDS.carousel.forward:
              next();
              break;
          }
      }
    },
  };
};
