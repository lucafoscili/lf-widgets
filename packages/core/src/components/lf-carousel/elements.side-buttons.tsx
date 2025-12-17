import {
  LF_CAROUSEL_IDS,
  LfCarouselAdapter,
  LfCarouselAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { ButtonFC } from "../lf-button/fc/button-fc";

//#endregion
export const prepSideButtonsJsx = (
  getAdapter: () => LfCarouselAdapter,
): LfCarouselAdapterJsx => {
  return {
    //#region Back
    back: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, framework, parts } = controller.get;
      const { assignRef, theme } = framework();
      const { refs } = elements;
      const { button } = handlers;
      const { "--lf-icon-previous": prev } = theme.get.current().variables;

      return (
        <ButtonFC
          className={theme.bemClass(blocks()._, blocks().back)}
          dataCy={cyAttributes().button}
          framework={framework()}
          icon={prev}
          id={LF_CAROUSEL_IDS.carousel.back}
          onClick={(e) => button(e, LF_CAROUSEL_IDS.carousel.back)}
          part={parts().back}
          buttonRef={assignRef(refs, "back")}
          styling="icon"
          title="Previous slide."
          uiSize="large"
        />
      );
    },
    //#endregion

    //#region Forward
    forward: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, framework, parts } = controller.get;
      const { assignRef, theme } = framework();
      const { refs } = elements;
      const { button } = handlers;
      const { "--lf-icon-next": next } = theme.get.current().variables;

      return (
        <ButtonFC
          className={theme.bemClass(blocks()._, blocks().forward)}
          dataCy={cyAttributes().button}
          framework={framework()}
          icon={next}
          id={LF_CAROUSEL_IDS.carousel.forward}
          onClick={(e) => button(e, LF_CAROUSEL_IDS.carousel.forward)}
          part={parts().forward}
          buttonRef={assignRef(refs, "forward")}
          styling="icon"
          title="Next slide."
          uiSize="large"
        />
      );
    },
    //#endregion
  };
};
