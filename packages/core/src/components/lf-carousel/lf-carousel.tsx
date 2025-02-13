import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_CAROUSEL_BLOCKS,
  LF_CAROUSEL_PARTS,
  LF_CAROUSEL_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfCarouselAdapter,
  LfCarouselElement,
  LfCarouselEvent,
  LfCarouselEventPayload,
  LfCarouselInterface,
  LfCarouselPropsInterface,
  LfDataCell,
  LfDataDataset,
  LfDataShapes,
  LfDataShapesMap,
  LfDebugLifecycleInfo,
  LfEvent,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import {
  Component,
  Element,
  Event,
  EventEmitter,
  forceUpdate,
  Fragment,
  h,
  Host,
  Method,
  Prop,
  State,
  VNode,
  Watch,
} from "@stencil/core";
import { awaitFramework } from "../../utils/setup";
import { autoplay, navigation } from "./helpers.utils";
import { createAdapter } from "./lf-carousel-adapter";

/**
 * The carousel component displays a carousel with slides that can be navigated using navigation controls or by clicking on slide indicators.
 * The component supports autoplay, lightbox mode, and custom styling.
 * The carousel component can be used to display images, videos, or other content in a carousel format.
 *
 * @component
 * @tag lf-carousel
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable, reusable UI element for displaying content in a carousel format.
 * The component supports autoplay, navigation controls, lightbox mode, and custom styling.
 *
 * @example
 * <lf-carousel
 * lfAutoPlay={true}
 * lfInterval={3000}
 * lfLightbox={true}
 * ></lf-carousel>
 *
 * @fires {CustomEvent} lf-carousel-event - Emitted for various component events
 */
@Component({
  tag: "lf-carousel",
  styleUrl: "lf-carousel.scss",
  shadow: true,
})
export class LfCarousel implements LfCarouselInterface {
  /**
   * References the root HTML element of the component (<lf-carousel>).
   */
  @Element() rootElement: LfCarouselElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() currentIndex = 0;
  @State() shapes: LfDataShapesMap = {};
  //#endregion

  //#region Props
  /**
   * The data set for the LF Carousel component.
   * This property is mutable, meaning it can be changed after the component is initialized.
   *
   * @type {LfDataDataset}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-carousel lfDataset={dataset}></lf-carousel>
   * ```
   */
  @Prop({ mutable: true }) lfDataset: LfDataDataset = null;
  /**
   * Enable or disable autoplay for the carousel.
   *
   * @type {boolean}
   * @default false
   *
   * @example
   * ```tsx
   * <lf-carousel lfAutoPlay={true}></lf-carousel>
   * ```
   */
  @Prop({ mutable: false }) lfAutoPlay: boolean = false;
  /**
   * Interval in milliseconds for autoplay.
   *
   * @type {number}
   * @default false
   */
  @Prop({ mutable: false }) lfInterval: number = 3000;
  /**
   * Determines whether the carousel should display a lightbox when an item is clicked.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-carousel lfLightbox={true}></lf-carousel>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfLightbox: boolean = false;
  /**
   * Determines whether the carousel should display navigation controls (prev/next buttons).
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-carousel lfNavigation={false}></lf-carousel>
   * ```
   */
  @Prop({ mutable: true }) lfNavigation: boolean = false;
  /**
   * Sets the type of shapes to compare.
   *
   * @type {LfDataShapes}
   * @default "image"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-carousel lfShape="image"></lf-carousel>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfShape: LfDataShapes = "image";
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-carousel lfStyle="#lf-component { color: red; }"></lf-carousel>
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_CAROUSEL_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_CAROUSEL_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #carousel: HTMLDivElement;
  #interval: NodeJS.Timeout;
  #adapter: LfCarouselAdapter;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-carousel-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfCarouselEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfCarouselEvent) {
    const { lightbox } = this.#framework.effects;

    switch (eventType) {
      case "lf-event":
        if (this.lfLightbox) {
          const { comp, eventType } = (e as LfEvent).detail;

          if (eventType === "click") {
            const { rootElement } = comp;
            if (rootElement instanceof HTMLElement) {
              lightbox.show(rootElement);
            }
          }
        }
        break;
    }

    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
    });
  }
  //#endregion

  //#region Watchers
  @Watch("lfDataset")
  @Watch("lfShape")
  async updateShapes() {
    if (!this.#framework) {
      return;
    }

    const { data, debug } = this.#framework;

    try {
      this.shapes = data.cell.shapes.getAll(this.lfDataset);
    } catch (error) {
      debug.logs.new(this, "Error updating shapes: " + error, "error");
    }
  }
  //#endregion

  //#region Public methods
  /**
   * Fetches debug information of the component's current state.
   * @returns {Promise<LfDebugLifecycleInfo>} A promise that resolves with the debug information object.
   */
  @Method()
  async getDebugInfo(): Promise<LfDebugLifecycleInfo> {
    return this.debugInfo;
  }
  /**
   * Used to retrieve component's properties and descriptions.
   * @returns {Promise<LfCarouselPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfCarouselPropsInterface> {
    const entries = LF_CAROUSEL_PROPS.map(
      (
        prop,
      ): [
        keyof LfCarouselPropsInterface,
        LfCarouselPropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Navigates to a specific slide in the carousel by its index.
   * @param {number} index - The zero-based index of the slide to display.
   * @returns {Promise<void>} A promise that resolves when the slide transition is complete.
   */
  @Method()
  async goToSlide(index: number): Promise<void> {
    const { current } = this.#adapter.controller.set.index;

    current(index);
  }
  /**
   * Moves the carousel to the next slide.
   * Triggers the next slide transition using the carousel controller's next function.
   * @returns {Promise<void>} A promise that resolves when the slide transition is complete.
   */
  @Method()
  async nextSlide(): Promise<void> {
    const { next } = this.#adapter.controller.set.index;

    next();
  }
  /**
   * Moves the carousel to the previous slide by invoking the `previous` method
   * from the carousel controller's index set.
   * @returns {Promise<void>} A promise that resolves when the slide transition is complete
   */
  @Method()
  async prevSlide(): Promise<void> {
    const { previous } = this.#adapter.controller.set.index;

    previous();
  }
  /**
   * This method is used to trigger a new render of the component.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }
  /**
   * Initiates the unmount sequence, which removes the component from the DOM after a delay.
   * @param {number} ms - Number of milliseconds
   */
  @Method()
  async unmount(ms: number = 0): Promise<void> {
    setTimeout(() => {
      this.onLfEvent(new CustomEvent("unmount"), "unmount");
      this.rootElement.remove();
    }, ms);
  }
  //#endregion

  //#region Private methods
  #initAdapter = () => {
    this.#adapter = createAdapter(
      {
        blocks: this.#b,
        compInstance: this,
        cyAttributes: CY_ATTRIBUTES,
        index: {
          current: () => this.currentIndex,
        },
        interval: () => this.#interval,
        manager: this.#framework,
        parts: LF_CAROUSEL_PARTS,
        totalSlides: () => this.#getTotalSlides(),
      },
      {
        index: {
          current: (value) => (this.currentIndex = value),
          next: () => {
            this.currentIndex = navigation.calcNextIdx(
              this.currentIndex,
              this.#getTotalSlides(),
            );
          },
          previous: () => {
            this.currentIndex = navigation.calcPreviousIdx(
              this.currentIndex,
              this.#getTotalSlides(),
            );
          },
        },
        interval: (value) => (this.#interval = value),
      },
      () => this.#adapter,
    );
  };
  #getTotalSlides() {
    return this.shapes?.[this.lfShape]?.length || 0;
  }
  #hasShapes() {
    return !!this.shapes?.[this.lfShape];
  }
  #prepCarousel(): VNode {
    const { bemClass } = this.#framework.theme;

    const { carousel } = this.#b;
    const { elements } = this.#adapter;
    const { jsx } = elements;
    const { back, forward } = jsx;

    if (this.#hasShapes()) {
      const shapes = this.shapes[this.lfShape];
      if (shapes?.length) {
        return (
          <Fragment>
            <div
              aria-live="polite"
              class={bemClass(carousel._, carousel.track)}
              part={this.#p.track}
              role="region"
            >
              {this.#prepSlide()}
              {this.lfNavigation && back()}
              {this.lfNavigation && forward()}
            </div>
            {this.#prepIndicators()}
          </Fragment>
        );
      }
    }

    return null;
  }
  #prepIndicators(): VNode[] {
    const { bemClass } = this.#framework.theme;

    const { slideBar } = this.#b;
    const totalSlides = this.#getTotalSlides();

    const segments = [];

    for (let index = 0; index < totalSlides; index++) {
      const label = `Jump to slide ${index + 1}`;
      segments.push(
        <div
          aria-label={label}
          class={bemClass(slideBar._, slideBar.segment, {
            active: index === this.currentIndex,
          })}
          data-cy={this.#cy.button}
          data-index={index}
          onClick={async () => this.goToSlide(index)}
          part={this.#p.segment}
          role="button"
          tabIndex={0}
          title={label}
        ></div>,
      );
    }

    return (
      <div class={bemClass(slideBar._)} part={this.#p.slideBar}>
        {segments}
      </div>
    );
  }
  #prepSlide(): VNode {
    const { decorate } = this.#framework.data.cell.shapes;
    const { bemClass } = this.#framework.theme;

    const { currentIndex, lfShape } = this;

    const { carousel } = this.#b;

    const props: Partial<LfDataCell<LfDataShapes>>[] = this.shapes[lfShape].map(
      () => ({
        htmlProps: {
          dataset: {
            lf: this.#lf.fadeIn,
          },
        },
      }),
    );

    const decoratedShapes = decorate(
      lfShape,
      this.shapes[lfShape],
      async (e) => this.onLfEvent(e, "lf-event"),
      props,
    );

    return (
      <div
        class={bemClass(carousel._, carousel.slide)}
        data-index={currentIndex}
      >
        <Fragment>{decoratedShapes[currentIndex]}</Fragment>
      </div>
    );
  }
  //#endregion

  //#region Lifecycle hooks
  connectedCallback() {
    if (this.#framework) {
      this.#framework.theme.register(this);
    }
  }
  async componentWillLoad() {
    this.#framework = await awaitFramework(this);
    this.#initAdapter();
    this.updateShapes();

    if (this.lfAutoPlay) {
      autoplay.start(this.#adapter);
    }
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;
    const { register } = this.#framework.drag;
    const { next, previous } = this.#adapter.controller.set.index;

    register.swipe(this.#carousel, {
      onEnd: (_e, session) => {
        if (session.swipeData?.direction) {
          const { direction } = session.swipeData;
          if (direction === "left") {
            next();
          } else if (direction === "right") {
            previous();
          }
        }
      },
    });

    this.onLfEvent(new CustomEvent("ready"), "ready");
    info.update(this, "did-load");
  }
  componentWillRender() {
    const { info } = this.#framework.debug;

    info.update(this, "will-render");
  }
  componentDidRender() {
    const { info } = this.#framework.debug;

    info.update(this, "did-render");
  }
  render() {
    const { bemClass, setLfStyle } = this.#framework.theme;

    const { lfStyle } = this;

    const { carousel } = this.#b;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div
            class={bemClass(carousel._)}
            part={this.#p.carousel}
            ref={(el) => {
              if (el) {
                this.#carousel = el;
              }
            }}
            role="region"
          >
            {this.#prepCarousel()}
          </div>
        </div>
      </Host>
    );
  }

  disconnectedCallback() {
    this.#framework?.drag.unregister.swipe(this.#carousel);
    this.#framework?.theme.unregister(this);
    autoplay.stop(this.#adapter);
  }
  //#endregion
}
