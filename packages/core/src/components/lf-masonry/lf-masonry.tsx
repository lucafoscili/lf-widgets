import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_MASONRY_BLOCKS,
  LF_MASONRY_CSS_VARS,
  LF_MASONRY_DEFAULT_COLUMNS,
  LF_MASONRY_PARTS,
  LF_MASONRY_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfDataCell,
  LfDataDataset,
  LfDataShapes,
  LfDataShapesMap,
  LfDebugLifecycleInfo,
  LfEvent,
  LfFrameworkInterface,
  LfMasonryAdapter,
  LfMasonryColumns,
  LfMasonryElement,
  LfMasonryEvent,
  LfMasonryEventPayload,
  LfMasonryInterface,
  LfMasonryPropsInterface,
  LfMasonrySelectedShape,
  LfMasonryView,
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
import { LfShape } from "../../utils/shapes";
import { createAdapter } from "./lf-masonry-adapter";

/**
 * A masonry component that displays a collection of shapes in a grid layout.
 * The masonry component supports various customization options, including shape selection, view type, and styling.
 * The component allows users to interact with shapes, view details, and customize the layout.
 *
 * @component
 * @tag lf-masonry
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying shapes in a masonry layout.
 *
 * @example
 * <lf-masonry
 * lfDataset={dataset}
 * lfShape="image"
 * ></lf-masonry>
 *
 * @fires {CustomEvent} lf-masonry-event - Emitted for various component events
 */
@Component({
  tag: "lf-masonry",
  styleUrl: "lf-masonry.scss",
  shadow: true,
})
export class LfMasonry implements LfMasonryInterface {
  /**
   * References the root HTML element of the component (<lf-masonry>).
   */
  @Element() rootElement: LfMasonryElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() selectedShape: LfMasonrySelectedShape = {};
  @State() shapes: LfDataShapesMap = {};
  @State() viewportWidth: number;
  //#endregion

  //#region Props
  /**
   * When true displays floating buttons to customize the view.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-masonry lfActions={true}></lf-masonry>
   * ```
   */
  @Prop({ mutable: true }) lfActions: boolean = false;
  /**
   * When true and lfSelectable is enabled, captures selection events on a transparent overlay
   * preventing deeper interaction with the contained shapes (e.g., prevents drawing on a canvas).
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-masonry lfCaptureSelection={true} lfSelectable={true}></lf-masonry>
   * ```
   */
  @Prop({ mutable: true }) lfCaptureSelection: boolean = false;
  /**
   * When true the masonry will collapse the number of columns to the number of items
   * when the number of items is less than the configured columns. Set to false to
   * preserve the configured column count even if there are fewer items.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-masonry lfCollapseColumns={false}></lf-masonry>
   * ```
   */
  @Prop({ mutable: true }) lfCollapseColumns: boolean = true;
  /**
   * Number of columns of the masonry, doesn't affect sequential views.
   * Can be set with a number or an array of numbers that identify each breakpoint.
   *
   * @type {LfMasonryColumns}
   * @default [640, 768, 1024, 1920, 2560]
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-masonry lfColumns={3}></lf-masonry>
   * ```
   */
  @Prop({ mutable: true }) lfColumns: LfMasonryColumns = Array.from(
    LF_MASONRY_DEFAULT_COLUMNS,
  );
  /**
   * Actual data of the masonry.
   *
   * @type {LfDataDataset}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-masonry lfDataset={data}></lf-masonry>
   * ```
   */
  @Prop({ mutable: true }) lfDataset: LfDataDataset = null;
  /**
   * Allows for the selection of elements.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-masonry lfSelectable={true}></lf-masonry>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfSelectable: boolean = false;
  /**
   * Sets the type of shapes to compare.
   *
   * @type {LfDataShapes}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-masonry lfShape="image"></lf-masonry>
   * ```
   */
  @Prop({ mutable: true }) lfShape: LfDataShapes = "image";
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-masonry lfStyle="#lf-component { color: red; }"></lf-masonry>
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * Sets the type of view, either the actual masonry or a sequential view.
   *
   * @type {LfMasonryView}
   * @default main
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-masonry lfView="vertical"></lf-masonry>
   * ```
   */
  @Prop({ mutable: true }) lfView: LfMasonryView = "main";
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_MASONRY_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_MASONRY_PARTS;
  #s = LF_STYLE_ID;
  #v = LF_MASONRY_CSS_VARS;
  #w = LF_WRAPPER_ID;
  #currentColumns: number;
  #timeout: NodeJS.Timeout;
  #adapter: LfMasonryAdapter;
  #captureElements: HTMLDivElement[] = [];
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-masonry-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfMasonryEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfMasonryEvent) {
    const { lfSelectable, lfShape, selectedShape, shapes } = this;

    let shouldUpdateState = false;
    const state: LfMasonrySelectedShape = {};

    switch (eventType) {
      case "lf-event":
        const { comp, eventType } = (e as LfEvent).detail;
        switch (eventType) {
          case "click":
            if (lfSelectable) {
              const index = parseInt(comp.rootElement.dataset.index);
              if (selectedShape.index !== index) {
                state.index = index;
                state.shape = shapes[lfShape][index];
              }
              shouldUpdateState = true;
            }
            break;
        }
        break;
    }

    if (shouldUpdateState) {
      this.selectedShape = state;
    }

    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
      selectedShape: this.selectedShape,
    });
  }
  //#endregion

  //#region Watchers
  @Watch("lfColumns")
  validateColumns() {
    if (!this.#framework) {
      return;
    }

    const { debug } = this.#framework;

    if (
      Array.isArray(this.lfColumns) &&
      !this.#validateBreakpoints(this.lfColumns)
    ) {
      debug.logs.new(
        this,
        "Invalid breakpoints in lfColumns: must be sorted in ascending order.",
        "warning",
      );
      this.lfColumns = [...LF_MASONRY_DEFAULT_COLUMNS];
    }
  }
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
   * @returns {Promise<LfMasonryPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfMasonryPropsInterface> {
    const entries = LF_MASONRY_PROPS.map(
      (
        prop,
      ): [
        keyof LfMasonryPropsInterface,
        LfMasonryPropsInterface[typeof prop],
      ] => [prop, this[prop] as LfMasonryPropsInterface[typeof prop]],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Returns the selected shape.
   * @returns {Promise<LfMasonrySelectedShape>} Selected shape.
   */
  @Method()
  async getSelectedShape(): Promise<LfMasonrySelectedShape> {
    return this.selectedShape;
  }
  /**
   * Redecorates the shapes, updating potential new values.
   */
  @Method()
  async redecorateShapes(): Promise<void> {
    this.updateShapes();
  }
  /**
   * This method is used to trigger a new render of the component.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }
  /**
   * Sets the selected shape by index.
   */
  @Method()
  async setSelectedShape(index: number): Promise<void> {
    const { debug } = this.#framework;

    const shape = this.shapes?.[this.lfShape]?.[index];
    if (shape) {
      const newState: LfMasonrySelectedShape = {
        index,
        shape,
      };
      this.selectedShape = newState;
    } else {
      this.selectedShape = {};
      debug.logs.new(this, `Couldn't set shape with index: ${index}`);
    }
    this.updateShapes();
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
        currentColumns: () => this.#currentColumns,
        cyAttributes: this.#cy,
        isMasonry: () => this.#isMasonry(),
        isVertical: () => this.#isVertical(),
        lfAttributes: this.#lf,
        manager: this.#framework,
        parts: this.#p,
        shapes: () => this.shapes,
      },
      () => this.#adapter,
    );
  };
  #hasShapes = () => {
    return !!this.shapes?.[this.lfShape];
  };
  #isMasonry = () => {
    return this.lfView === "main";
  };
  #isVertical = () => {
    return this.lfView === "vertical";
  };
  #debounce = (cb: () => void, wait: number) => {
    return () => {
      clearTimeout(this.#timeout);
      this.#timeout = setTimeout(cb, wait);
    };
  };
  #validateBreakpoints = (breakpoints: number[]) => {
    return breakpoints.every((val, i, arr) => i === 0 || arr[i - 1] < val);
  };
  #calculateColumnCount() {
    const { lfColumns, viewportWidth, shapes, lfShape } = this;

    if (!this.#hasShapes()) {
      return 1;
    }

    if (typeof lfColumns === "number") {
      return this.lfCollapseColumns
        ? Math.min(lfColumns, shapes[lfShape]?.length || 0)
        : lfColumns;
    }

    if (Array.isArray(lfColumns)) {
      const breakpoints = lfColumns;

      let columnCount = 1;

      for (let i = 0; i < breakpoints.length; i++) {
        if (viewportWidth >= breakpoints[i]) {
          columnCount = i + 1;
        } else {
          break;
        }
      }

      return this.lfCollapseColumns
        ? Math.min(columnCount, shapes?.[lfShape]?.length || 0)
        : columnCount;
    }

    return 1;
  }
  #divideShapesIntoColumns = (): VNode[][] => {
    const { lfCaptureSelection, lfSelectable, lfShape, selectedShape, shapes } =
      this;
    const { bemClass } = this.#framework.theme;
    const { grid } = this.#b;

    const props: Partial<LfDataCell<LfDataShapes>>[] = shapes[this.lfShape].map(
      () => ({
        htmlProps: {
          dataset: { lf: this.#lf.fadeIn, selected: "" },
        },
      }),
    );
    if (selectedShape.index !== undefined) {
      props[selectedShape.index] = {
        htmlProps: {
          dataset: { lf: this.#lf.fadeIn, selected: "true" },
        },
      };
    }
    const columns: VNode[][] = Array.from(
      { length: this.#currentColumns },
      (): VNode[] => [],
      [],
    );

    const shouldCapture = lfCaptureSelection && lfSelectable;

    for (let index = 0; index < shapes[lfShape].length; index++) {
      const cell = shapes[lfShape][index];
      const defaultCell = props[index];

      const shapeElement = (
        <LfShape
          cell={Object.assign(defaultCell, cell)}
          index={index}
          shape={lfShape}
          eventDispatcher={async (e) => this.onLfEvent(e, "lf-event")}
          framework={this.#framework}
        ></LfShape>
      );

      if (shouldCapture) {
        columns[index % this.#currentColumns].push(
          <div
            class={bemClass(grid._, grid.capture)}
            data-index={index}
            data-selected={selectedShape.index === index ? "true" : ""}
            onClick={(e) => this.#handleCaptureClick(e, index)}
            ref={(el) => {
              if (el && !this.#captureElements.includes(el)) {
                this.#captureElements.push(el);
              }
            }}
          >
            {shapeElement}
          </div>,
        );
      } else {
        columns[index % this.#currentColumns].push(shapeElement);
      }
    }

    return columns;
  };
  #handleCaptureClick = (e: MouseEvent, index: number) => {
    e.stopPropagation();

    const { lfShape, selectedShape, shapes } = this;
    let shouldUpdateState = false;
    const state: LfMasonrySelectedShape = {};

    if (selectedShape.index !== index) {
      state.index = index;
      state.shape = shapes[lfShape][index];
      shouldUpdateState = true;
    } else {
      // Clicking same item deselects
      shouldUpdateState = true;
    }

    if (shouldUpdateState) {
      this.selectedShape = state;
    }

    this.lfEvent.emit({
      comp: this,
      eventType: "lf-event",
      id: this.rootElement.id,
      originalEvent: e,
      selectedShape: this.selectedShape,
    });
  };
  #handleResize = this.#debounce(() => {
    this.viewportWidth = window.innerWidth;
  }, 200);
  #prepActions = (): VNode => {
    const { bemClass } = this.#framework.theme;

    const { grid } = this.#b;
    const { addColumn, changeView, removeColumn } = this.#adapter.elements.jsx;

    return (
      <div class={bemClass(grid._, grid.actions)} data-lf={this.#lf.fadeIn}>
        {this.#isMasonry() && (
          <div class={bemClass(grid._, grid.sub)}>
            {addColumn()}
            {removeColumn()}
          </div>
        )}
        {changeView()}
      </div>
    );
  };
  #prepView = (): VNode[] => {
    const { bemClass } = this.#framework.theme;

    const { grid } = this.#b;

    const nodes = this.#divideShapesIntoColumns();
    return nodes.map((column, index) => (
      <div key={index} class={bemClass(grid._, grid.column)}>
        {column.map((element) => (
          <Fragment>{element}</Fragment>
        ))}
      </div>
    ));
  };
  #prepMasonry = (): VNode => {
    const { bemClass } = this.#framework.theme;

    const { grid } = this.#b;
    const { lfActions, lfShape, lfView, shapes } = this;

    if (this.#hasShapes()) {
      if (shapes[lfShape]?.length) {
        return (
          <Fragment>
            <div
              class={bemClass(grid._, null, {
                [lfView]: true,
              })}
            >
              {this.#prepView()}
            </div>
            {lfActions && this.#prepActions()}
          </Fragment>
        );
      }
    }

    return null;
  };
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
  }
  componentDidLoad() {
    window.addEventListener("resize", this.#handleResize);
    this.viewportWidth = window.innerWidth; // re-render expected

    const { info } = this.#framework.debug;

    this.onLfEvent(new CustomEvent("ready"), "ready");
    info.update(this, "did-load");
  }
  componentWillRender() {
    const { info } = this.#framework.debug;

    this.#currentColumns = this.#isMasonry() ? this.#calculateColumnCount() : 1;
    info.update(this, "will-render");
  }
  componentDidRender() {
    const { debug, effects, theme } = this.#framework;

    const hasThemeRipple = theme.get.current().hasEffect("ripple");
    if (this.lfCaptureSelection && hasThemeRipple) {
      this.#captureElements.forEach((item) => {
        effects.register.ripple(item);
      });
    }

    debug.info.update(this, "did-render");
  }
  render() {
    const { bemClass, setLfStyle } = this.#framework.theme;

    const { masonry } = this.#b;
    const { lfStyle } = this;

    const style = {
      [this.#v.columns]: String(this.#currentColumns),
    };

    this.#captureElements = [];

    return (
      <Host style={style}>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div class={bemClass(masonry._)}>{this.#prepMasonry()}</div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { effects, theme } = this.#framework;

    const hasThemeRipple = theme?.get.current().hasEffect("ripple");
    if (hasThemeRipple) {
      this.#captureElements.forEach((item) => {
        effects.unregister.ripple(item);
      });
    }

    theme.unregister(this);
    window.removeEventListener("resize", this.#handleResize);
  }
  //#endregion
}
