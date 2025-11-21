import {
  CY_ATTRIBUTES,
  LF_CANVAS_BLOCKS,
  LF_CANVAS_PARTS,
  LF_CANVAS_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfCanvasAdapter,
  LfCanvasBoxing,
  LfCanvasBrush,
  LfCanvasCursor,
  LfCanvasElement,
  LfCanvasEvent,
  LfCanvasEventPayload,
  LfCanvasInterface,
  LfCanvasOrientation,
  LfCanvasPoints,
  LfCanvasPropsInterface,
  LfCanvasType,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfImageElement,
  LfImagePropsInterface,
} from "@lf-widgets/foundations";
import {
  Component,
  Element,
  Event,
  EventEmitter,
  forceUpdate,
  h,
  Host,
  Method,
  Prop,
  State,
} from "@stencil/core";
import { awaitFramework } from "../../utils/setup";
import {
  calcBoxing,
  calcOrientation,
  getImageDimensions,
} from "./helpers.utils";
import { createAdapter } from "./lf-canvas-adapter";

/**
 * The canvas component allows users to draw on a canvas element using a brush tool.
 * The component provides various properties for customizing the brush size, color, opacity,
 * and shape, as well as the cursor style and preview display. The component also supports
 * loading an image into the canvas for reference or tracing purposes.
 *
 * @component
 * @tag lf-canvas
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable, reusable UI element
 * for drawing on a canvas. The component supports various brush styles, colors, and sizes, as
 * well as the ability to simplify drawn paths using the Ramer-Douglas-Peucker algorithm.
 *
 * @example
 * <lf-canvas
 * lfBrush="round"
 * lfColor="#ff0000"
 * lfCursor="preview"
 * lfImageProps={{ lfValue: "path/to/image.png" }}
 * lfOpacity={1.0}
 * ></lf-canvas>
 *
 * @fires {CustomEvent} lf-canvas-event - Emitted for various component events
 */
@Component({ tag: "lf-canvas", styleUrl: "lf-canvas.scss", shadow: true })
export class LfCanvas implements LfCanvasInterface {
  /**
   * References the root HTML element of the component (<lf-canvas>).
   */
  @Element() rootElement: LfCanvasElement;

  //#region States
  @State() boxing: LfCanvasBoxing = null;
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() isPainting = false;
  @State() orientation: LfCanvasOrientation = null;
  @State() points: LfCanvasPoints = [];
  //#endregion

  //#region Props
  /**
   * The shape of the brush.
   *
   * @type {LfCanvasBrush}
   * @default "round"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-canvas lfBrush="round" />
   * ```
   */
  @Prop({ mutable: true }) lfBrush: LfCanvasBrush = "round";
  /**
   * The color of the brush.
   *
   * @type {string}
   * @default "#ff0000"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-canvas lfColor="#ff0000" />
   * ```
   */
  @Prop({ mutable: true }) lfColor: string = "#ff0000";
  /**
   * Sets the style of the cursor.
   *
   * @type {LfCanvasCursor}
   * @default "preview"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-canvas lfCursor="preview" />
   * ```
   */
  @Prop({ mutable: true }) lfCursor: LfCanvasCursor = "preview";
  /**
   * The props of the image displayed inside the canvas.
   *
   * @type {LfImagePropsInterface}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-canvas lfImageProps={{ lfValue: "path/to/image.png" }} />
   * ```
   */
  @Prop({ mutable: true }) lfImageProps: LfImagePropsInterface = null;
  /**
   * The opacity of the brush.
   *
   * @type {number}
   * @default 1.0
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-canvas lfOpacity={1.0} />
   * ```
   */
  @Prop({ mutable: true }) lfOpacity: number = 1.0;
  /**
   * Displays the brush track of the current stroke.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-canvas lfPreview={true} />
   * ```
   */
  @Prop({ mutable: true }) lfPreview: boolean = true;
  /**
   * Simplifies the coordinates array by applying the Ramer-Douglas-Peucker algorithm.
   * This prop sets the tolerance of the algorithm (null to disable).
   *
   * @type {number}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-canvas lfStrokeTolerance={10} />
   * ```
   */
  @Prop({ mutable: true }) lfStrokeTolerance: number = null;
  /**
   * The size of the brush.
   *
   * @type {number}
   * @default 10
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-canvas lfSize={10} />
   * ```
   */
  @Prop({ mutable: true }) lfSize: number = 10;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-canvas lfStyle=":host { color: red; }" />
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_CANVAS_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #p = LF_CANVAS_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #adapter: LfCanvasAdapter;
  #container: HTMLDivElement;
  #resizeObserver: ResizeObserver;
  #resizeTimeout: NodeJS.Timeout;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-canvas-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfCanvasEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfCanvasEvent) {
    const { coordinates } = this.#adapter.toolkit;
    const { lfStrokeTolerance, points, rootElement } = this;

    this.lfEvent.emit({
      comp: this,
      id: rootElement.id,
      originalEvent: e,
      eventType,
      points:
        lfStrokeTolerance !== null && points?.length
          ? coordinates.simplify(points, lfStrokeTolerance)
          : points,
    });
  }
  //#endregion

  //#region Public methods
  /**
   * Clears the specified canvas type of all drawn content.
   * @param type - The type of canvas to clear. Defaults to "board".
   * @returns A promise that resolves when the canvas has been cleared.
   */
  @Method()
  async clearCanvas(type: LfCanvasType = "board"): Promise<void> {
    const { clear } = this.#adapter.toolkit.ctx;

    clear(type);
  }
  /**
   * Retrieves the canvas element based on the specified type.
   * @param type - The type of canvas to retrieve. Defaults to "board".
   * @returns Promise that resolves to the requested HTMLCanvasElement.
   */
  @Method()
  async getCanvas(type: LfCanvasType = "board"): Promise<HTMLCanvasElement> {
    const { board, preview } = this.#adapter.elements.refs;

    return type === "board" ? board : preview;
  }
  /**
   * Fetches debug information of the component's current state.
   * @returns {Promise<LfDebugLifecycleInfo>} A promise that resolves with the debug information object.
   */
  @Method()
  async getDebugInfo(): Promise<LfDebugLifecycleInfo> {
    return this.debugInfo;
  }
  /**
   * Retrieves the HTMLLfImageElement from the canvas.
   * @returns A promise that resolves with the HTMLLfImageElement instance
   * representing the image element in the canvas.
   */
  @Method()
  async getImage(): Promise<LfImageElement> {
    const { image } = this.#adapter.elements.refs;

    return image;
  }
  /**
   * Used to retrieve component's properties and descriptions.
   * @returns {Promise<LfCanvasPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfCanvasPropsInterface> {
    const entries = LF_CANVAS_PROPS.map(
      (
        prop,
      ): [
        keyof LfCanvasPropsInterface,
        LfCanvasPropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }
  /**
   * This method is used to trigger a new render of the component.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }
  /**
   * Resizes the canvas elements to match the container's dimensions.
   *
   * This method performs the following operations:
   * 1. Calculates available space from the parent element (to avoid circular dependency with boxing CSS)
   * 2. Extracts image dimensions using `getImageDimensions()` helper
   * 3. Determines image orientation and updates state
   * 4. Calculates boxing type (letterbox/pillarbox) based on aspect ratio mismatch
   * 5. Waits for next frame to ensure boxing CSS is applied
   * 6. Sets canvas dimensions to match the final rendered container size
   *
   * The boxing calculation helps correctly map pointer coordinates to image coordinates
   * when the image aspect ratio differs from the available space.
   *
   * @returns A Promise that resolves when the resize operation is complete
   */
  @Method()
  async resizeCanvas(): Promise<void> {
    const { set } = this.#adapter.controller;
    const { board, image, preview } = this.#adapter.elements.refs;

    // Get available space from parent to calculate boxing correctly
    const parent = this.rootElement.parentElement;
    const availableWidth = parent
      ? parent.getBoundingClientRect().width
      : this.#container.getBoundingClientRect().width;
    const availableHeight = parent
      ? parent.getBoundingClientRect().height
      : this.#container.getBoundingClientRect().height;

    const img = await image.getImage();
    const imgOri = calcOrientation(img);
    set.orientation(imgOri);

    // Calculate boxing type to correctly map pointer coordinates to image coordinates
    const { width: imgWidth, height: imgHeight } = getImageDimensions(img);

    const newBoxing = calcBoxing(
      availableWidth,
      availableHeight,
      imgWidth,
      imgHeight,
    );
    // Only update boxing if it changed to prevent infinite resize loop
    if (this.boxing !== newBoxing) {
      set.boxing(newBoxing);
    }

    // After boxing is determined, set canvas dimensions to match actual rendered size
    // Use requestAnimationFrame to ensure CSS has been applied
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const { height, width } = this.#container.getBoundingClientRect();
    board.height = height;
    board.width = width;

    if (this.#isCursorPreview()) {
      preview.height = height;
      preview.width = width;
    }
  }
  /**
   * Sets the canvas height for both the board and preview elements.
   * If a value is provided, it will set that specific height.
   * If no value is provided, it will set the height based on the container's bounding client rect.
   *
   * @param value - Optional number representing the desired canvas height in pixels
   * @returns Promise that resolves when the height has been set
   */
  @Method()
  async setCanvasHeight(value?: number): Promise<void> {
    const { board, preview } = this.#adapter.elements.refs;

    if (value !== undefined) {
      board.height = value;

      if (this.#isCursorPreview()) {
        preview.height = value;
      }
    } else {
      const { height } = this.#container.getBoundingClientRect();
      board.height = height;

      if (this.#isCursorPreview()) {
        preview.height = height;
      }
    }
  }
  /**
   * Sets the width of the canvas element(s).
   * If a value is provided, sets the width to that specific value.
   * If no value is provided, sets the width to match the container's width.
   * When cursor preview is enabled, also updates the preview canvas width.
   *
   * @param value - Optional width value in pixels
   * @returns Promise that resolves when width is set
   */
  @Method()
  async setCanvasWidth(value?: number): Promise<void> {
    const { board, preview } = this.#adapter.elements.refs;

    if (value !== undefined) {
      board.width = value;

      if (this.#isCursorPreview()) {
        preview.width = value;
      }
    } else {
      const { width } = this.#container.getBoundingClientRect();
      board.width = width;

      if (this.#isCursorPreview()) {
        preview.width = width;
      }
    }
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
  /**
   * Initializes the canvas adapter with getters, setters, and toolkit references.
   * Creates the adapter that manages component state and provides helper methods
   * for canvas operations, coordinate calculations, and drawing.
   */
  #initAdapter = () => {
    this.#adapter = createAdapter(
      {
        blocks: this.#b,
        boxing: () => this.boxing,
        compInstance: this,
        cyAttributes: this.#cy,
        isCursorPreview: () => this.#isCursorPreview(),
        isPainting: () => this.isPainting,
        manager: this.#framework,
        orientation: () => this.orientation,
        parts: this.#p,
        points: () => this.points,
      },
      {
        boxing: (value) => (this.boxing = value),
        isPainting: (value) => (this.isPainting = value),
        orientation: (value) => (this.orientation = value),
        points: (value) => (this.points = value),
      },
      () => this.#adapter,
    );
  };
  /**
   * Initializes the ResizeObserver to monitor dimension changes.
   *
   * Observes the parent element (not the Host element itself) to prevent infinite loops
   * that would occur if the Host's boxing CSS changes triggered the observer, which would
   * recalculate boxing, triggering CSS changes again, etc.
   *
   * The observer debounces resize events with a 100ms timeout to avoid excessive
   * recalculations during continuous resize operations.
   */
  #initResizeObserver = () => {
    const observeTarget = this.rootElement.parentElement || this.rootElement;

    this.#resizeObserver = new ResizeObserver(() => {
      clearTimeout(this.#resizeTimeout);
      this.#resizeTimeout = setTimeout(() => {
        this.resizeCanvas();
      }, 100);
    });
    this.#resizeObserver.observe(observeTarget);
  };
  /**
   * Checks if the cursor preview mode is enabled.
   * @returns True if cursor preview is enabled, false otherwise
   */
  #isCursorPreview() {
    return this.lfCursor === "preview";
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
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    if (this.lfImageProps) {
      this.resizeCanvas();
    }
    this.#initResizeObserver();

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

    const { board, image, preview } = this.#adapter.elements.jsx;
    const { lfStyle } = this;
    const shouldRenderPreview = this.#isCursorPreview() || this.lfPreview;

    const { canvas } = this.#b;

    return (
      <Host data-orientation={this.orientation} data-boxing={this.boxing}>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div
            class={bemClass(canvas._, null, {
              hidden: this.#isCursorPreview(),
            })}
            part={this.#p.canvas}
            ref={(el) => {
              if (el) {
                this.#container = el;
              }
            }}
          >
            {image()}
            {board()}
            {shouldRenderPreview && preview()}
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);

    if (this.#resizeObserver) {
      this.#resizeObserver.disconnect();
    }
  }
  //#endregion
}
