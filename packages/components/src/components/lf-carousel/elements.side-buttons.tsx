import {
  LF_CAROUSEL_IDS,
  LfCarouselAdapter,
  LfCarouselAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";

//#endregion
export const prepSideButtonsJsx = (
  getAdapter: () => LfCarouselAdapter,
): LfCarouselAdapterJsx => {
  return {
    //#region Back
    back: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { assignRef, theme } = manager;
      const { refs } = elements;
      const { button } = handlers;
      const { "--lf-icon-previous": prev } = theme.get.current().variables;

      return (
        <lf-button
          class={theme.bemClass(blocks.carousel._, blocks.carousel.back)}
          data-cy={cyAttributes.button}
          id={LF_CAROUSEL_IDS.back}
          lfIcon={prev}
          lfStyling="icon"
          lfUiSize="large"
          onLf-button-event={button}
          part={parts.back}
          ref={assignRef(refs, "back")}
          title="Previous slide."
        ></lf-button>
      );
    },
    //#endregion

    //#region Forward
    forward: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { assignRef, theme } = manager;
      const { refs } = elements;
      const { button } = handlers;
      const { "--lf-icon-next": next } = theme.get.current().variables;

      return (
        <lf-button
          class={theme.bemClass(blocks.carousel._, blocks.carousel.forward)}
          data-cy={cyAttributes.button}
          id={LF_CAROUSEL_IDS.forward}
          lfIcon={next}
          lfStyling="icon"
          lfUiSize="large"
          onLf-button-event={button}
          part={parts.forward}
          ref={assignRef(refs, "forward")}
          title="Next slide."
        ></lf-button>
      );
    },
    //#endregion
  };
};
