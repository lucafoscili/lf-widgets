import {
  LF_ATTRIBUTES,
  LF_CAROUSEL_BLOCKS,
  LF_CAROUSEL_IDS,
  LF_CAROUSEL_PARTS,
  LfDataCell,
  LfDataShapes,
  LfDataShapesMap,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { Fragment, FunctionalComponent, h, VNode } from "@stencil/core";
import { LfShape } from "../../utils/shapes";
import { ButtonFC } from "../lf-button/fc/button-fc";

//#region FC Props Interface
/**
 * Props interface for the LfCarouselFC functional component.
 * Defined locally until foundations rebuild exports LfCarouselFCProps.
 */
export interface LfCarouselFCProps {
  /** Reference callback for the carousel container element */
  carouselRef?: (el: HTMLDivElement | null) => void;
  /** Assigned class for custom styling */
  className?: string;
  /** Current slide index being displayed */
  currentIndex: number;
  /** Framework instance for theming utilities (required) */
  framework: LfFrameworkInterface;
  /** Unique identifier for the component */
  id?: string;
  /** Whether lightbox mode is enabled (adds pointer cursor) */
  lightbox?: boolean;
  /** Whether navigation buttons are visible */
  navigation?: boolean;
  /** Callback fired when back button is clicked */
  onBack?: () => void;
  /** Callback fired when forward button is clicked */
  onForward?: () => void;
  /** Callback fired when a segment (indicator) is clicked */
  onSegmentClick?: (index: number) => void;
  /** Callback fired on LfShape event dispatch */
  onShapeEvent?: (e: CustomEvent) => void;
  /** Shape type for rendering slides */
  shape: LfDataShapes;
  /** Shapes map containing slide data */
  shapes: LfDataShapesMap;
  /** Custom CSS styles to apply (object format for Stencil JSX) */
  style?: { [key: string]: string };
  /** Total number of slides */
  totalSlides: number;
}
//#endregion

/**
 * LfCarouselFC - Functional Component for Carousel
 *
 * This is a stateless functional component that renders a carousel with slides.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-carousel Web Component (thin wrapper)
 * 2. Inside other components (composed usage)
 *
 * Benefits over direct WC usage in compositions:
 * - No Shadow DOM overhead (single shadow root for parent)
 * - No lifecycle hooks per instance
 * - No theme registration per instance
 * - Direct callbacks instead of CustomEvent dispatch
 * - State flows unidirectionally from parent
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export const LfCarouselFC: FunctionalComponent<LfCarouselFCProps> = ({
  carouselRef,
  className,
  currentIndex,
  framework,
  id,
  lightbox = false,
  navigation = false,
  onBack,
  onForward,
  onSegmentClick,
  onShapeEvent,
  shape,
  shapes,
  style,
  totalSlides,
}) => {
  const { bemClass } = framework.theme;
  const { "--lf-icon-previous": prevIcon, "--lf-icon-next": nextIcon } =
    framework.theme.get.current().variables;

  const blocks = LF_CAROUSEL_BLOCKS;
  const parts = LF_CAROUSEL_PARTS;
  const ids = LF_CAROUSEL_IDS;
  const lf = LF_ATTRIBUTES;

  const { carousel, slideBar } = blocks;

  const hasSlides = shapes?.[shape]?.length > 0;

  //#region Slide Renderer
  const renderSlide = (): VNode => {
    if (!hasSlides) return null;

    const props: Partial<LfDataCell<LfDataShapes>>[] = shapes[shape].map(
      () => ({
        htmlProps: {
          dataset: {
            lf: lf.fadeIn,
          },
        },
      }),
    );

    const cell = shapes[shape][currentIndex];
    const defaultCell = props[currentIndex];

    return (
      <div
        class={bemClass(carousel._, carousel.slide)}
        data-index={currentIndex}
      >
        <LfShape
          cell={Object.assign(defaultCell, cell)}
          index={currentIndex}
          shape={shape}
          eventDispatcher={async (e) => onShapeEvent?.(e)}
          framework={framework}
        ></LfShape>
      </div>
    );
  };
  //#endregion

  //#region Navigation Buttons
  const renderNavigation = (): VNode[] => {
    if (!navigation) return null;

    return [
      <ButtonFC
        className={bemClass(carousel._, carousel.back)}
        framework={framework}
        icon={prevIcon}
        id={ids.carousel.back}
        key={ids.carousel.back}
        onClick={() => onBack?.()}
        part={parts.back}
        styling="icon"
        title="Previous slide."
        uiSize="large"
      />,
      <ButtonFC
        className={bemClass(carousel._, carousel.forward)}
        framework={framework}
        icon={nextIcon}
        id={ids.carousel.forward}
        key={ids.carousel.forward}
        onClick={() => onForward?.()}
        part={parts.forward}
        styling="icon"
        title="Next slide."
        uiSize="large"
      />,
    ];
  };
  //#endregion

  //#region Slide Indicators
  const renderIndicators = (): VNode => {
    const segments = [];

    for (let index = 0; index < totalSlides; index++) {
      const label = `Jump to slide ${index + 1}`;
      segments.push(
        <div
          aria-label={label}
          class={bemClass(slideBar._, slideBar.segment, {
            active: index === currentIndex,
          })}
          data-index={index}
          onClick={() => onSegmentClick?.(index)}
          part={parts.segment}
          role="button"
          tabIndex={0}
          title={label}
        ></div>,
      );
    }

    return (
      <div class={bemClass(slideBar._)} part={parts.slideBar}>
        {segments}
      </div>
    );
  };
  //#endregion

  //#region Main Render
  if (!hasSlides) {
    return null;
  }

  return (
    <div
      class={`${bemClass(carousel._)}${className ? ` ${className}` : ""}`}
      data-lf-lightbox={lightbox ? "" : undefined}
      id={id}
      part={parts.carousel}
      ref={carouselRef}
      role="region"
      style={style}
    >
      <Fragment>
        <div
          aria-live="polite"
          class={bemClass(carousel._, carousel.track)}
          part={parts.track}
          role="region"
        >
          {renderSlide()}
          {renderNavigation()}
        </div>
        {renderIndicators()}
      </Fragment>
    </div>
  );
  //#endregion
};
