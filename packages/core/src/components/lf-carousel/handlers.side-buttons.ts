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

      const { next, previous } = getAdapter().controller.set.index;

      switch (eventType) {
        case "click":
          switch (id) {
            case LF_CAROUSEL_IDS.back:
              previous();
              break;
            case LF_CAROUSEL_IDS.forward:
              next();
              break;
          }
      }
    },
  };
};
