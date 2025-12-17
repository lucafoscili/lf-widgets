import { LfCarouselAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfCarouselFC } from "../lf-carousel-fc";

//#region Props
export interface CarouselFCProps {
  adapter: LfCarouselAdapter;
}
//#endregion

/**
 * FC adapter wrapper for the carousel component.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfCarouselFC (pure presentational) with adapter state.
 */
export const CarouselFC: FunctionalComponent<CarouselFCProps> = ({
  adapter,
}) => {
  const { controller, dispatcher, elements } = adapter;
  const { get, actions } = controller;

  const framework = get.framework();
  const compInstance = get.compInstance();
  const { assignRef } = framework;
  const { refs } = elements;

  const { lfLightbox, lfNavigation, lfShape } = compInstance;

  return (
    <LfCarouselFC
      carouselRef={assignRef(refs, "carousel")}
      currentIndex={get.currentIndex()}
      framework={framework}
      lightbox={lfLightbox}
      navigation={lfNavigation}
      onBack={() => actions.navigation.prev()}
      onForward={() => actions.navigation.next()}
      onSegmentClick={(index: number) => actions.navigation.goTo(index)}
      onShapeEvent={(e: CustomEvent) =>
        dispatcher.emit("lf-event", { originalEvent: e })
      }
      shape={lfShape}
      shapes={get.shapes()}
      totalSlides={get.totalSlides()}
    />
  );
};
