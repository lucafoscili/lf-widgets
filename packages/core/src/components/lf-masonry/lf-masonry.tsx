import {
  LF_MASONRY_BLOCKS,
  LF_MASONRY_CSS_VARS,
  LF_MASONRY_DEFAULT_COLUMNS,
  LF_MASONRY_IDS,
  LF_MASONRY_PARTS,
  LF_MASONRY_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfDataDataset,
  LfDataShapes,
  LfDataShapesMap,
  LfDebugLifecycleInfo,
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
  h,
  Host,
  Method,
  Prop,
  State,
  Watch,
} from "@stencil/core";
import { createBaseGetters } from "../../utils/adapter";
import { awaitFramework } from "../../utils/setup";
import { createAdapter } from "./lf-masonry-adapter";
import { LfMasonryFC } from "./lf-masonry-fc";

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
  /**
   * This is the ONLY @State in the component (besides debugInfo). It's a simple counter that gets
   * incremented by the adapter's onStateChange callback to trigger re-renders.
   *
   * All actual component state lives in the adapter's closure variables.
   * This approach gives us:
   * - Predictable renders (only when adapter explicitly requests)
   * - Batch-friendly updates (adapter can make multiple changes before triggering render)
   * - Testable state logic (adapter can be tested without DOM)
   */
  @State() private _renderTick = 0;
  @State() debugInfo: LfDebugLifecycleInfo;

  /**
   * Bridge getter for selectedShape to satisfy LfMasonryInterface.
   * Actual state lives in adapter - this just exposes it.
   * @deprecated Use adapter.controller.get.selectedShape() internally
   */
  get selectedShape(): LfMasonrySelectedShape {
    return this.#adapter?.controller.get.selectedShape() ?? {};
  }

  /**
   * Bridge getter for shapes to satisfy LfMasonryInterface.
   * Actual state lives in adapter - this just exposes it.
   * @deprecated Use adapter.controller.get.shapes() internally
   */
  get shapes(): LfDataShapesMap {
    return this.#adapter?.controller.get.shapes() ?? {};
  }
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
  #ids = LF_MASONRY_IDS;
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
  onLfEvent(
    e: Event | CustomEvent,
    eventType: LfMasonryEvent,
    refKey?: string,
  ): void {
    const { lfSelectable, lfShape } = this;
    const { get, set } = this.#adapter.controller;
    const selectedShape = get.selectedShape();
    const shapes = get.shapes();

    let shouldUpdateState = false;
    const state: LfMasonrySelectedShape = {};

    switch (eventType) {
      case "click":
        if (lfSelectable) {
          const index = parseInt(refKey?.split("-")[1] || "", 10);
          if (selectedShape.index !== index) {
            state.index = index;
            state.shape = shapes[lfShape][index];
          }
          shouldUpdateState = true;
        }
        break;
    }

    if (shouldUpdateState) {
      set.selectedShape(state);
    }

    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
      selectedShape: get.selectedShape(),
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
      const shapes = data.cell.shapes.getAll(this.lfDataset);
      this.#adapter.controller.set.shapes(shapes);
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
    return this.#adapter.controller.get.selectedShape();
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
    const { get, set } = this.#adapter.controller;

    const shapes = get.shapes();
    const shape = shapes?.[this.lfShape]?.[index];
    if (shape) {
      const newState: LfMasonrySelectedShape = {
        index,
        shape,
      };
      set.selectedShape(newState);
    } else {
      set.selectedShape({});
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
  /**
   * Creates the dispatcher for centralized event emission.
   * All component events route through this dispatcher.
   * @see Section 5.5 of 4_0_0_REFACTORING.md
   */
  #createDispatcher = () => ({
    emit: (
      eventType: LfMasonryEvent,
      detail?: Partial<LfMasonryEventPayload>,
    ) => {
      this.#framework?.debug?.logs.new(
        this,
        `Event: ${eventType}`,
        "informational",
      );

      const selectedShape = this.#adapter.controller.get.selectedShape();
      this.lfEvent.emit({
        comp: this,
        eventType,
        id: this.rootElement.id,
        originalEvent: detail?.originalEvent,
        selectedShape: detail?.selectedShape ?? selectedShape,
      });
    },
  });
  /**
   * Initializes the adapter with "Adapter as Core" architecture.
   *
   * Structure:
   * - controller.get: Base getters + state getters from closure
   * - controller.set: State setters that write to closure + trigger render
   * - controller.computed: Derived predicates (pure functions)
   * - controller.actions: Complex operations (select, clearSelection, etc.)
   * - elements: JSX factories + refs
   * - dispatcher: Centralized event emission
   * - handlers: Event callbacks
   *
   * State lives in adapter closure, WC is thin shell:
   * - onStateChange callback increments _renderTick to trigger re-render
   *
   * @see Section 5 of 4_0_0_REFACTORING.md
   */
  #initAdapter = () => {
    // Adapter accessor - shared by all factories
    const getAdapter = () => this.#adapter;

    // onStateChange callback - increments _renderTick to trigger Stencil re-render
    const onStateChange = () => {
      this._renderTick++;
    };

    // Base getters via utility (excludes state getters)
    const baseGetters = createBaseGetters({
      blocks: () => this.#b,
      compInstance: () => this,
      framework: () => this.#framework,
      ids: () => this.#ids,
      parts: () => this.#p,
    });

    // Extended base getters with component-specific non-state getters
    const extendedBaseGetters = {
      ...baseGetters,
      currentColumns: () => this.#currentColumns,
      view: () => this.lfView,
    };

    // Initial state
    const initialState = {
      selectedShape: {},
      shapes: {},
      viewportWidth: window.innerWidth,
    };

    const adapterWithoutDispatcher = createAdapter(
      extendedBaseGetters,
      initialState,
      onStateChange,
      getAdapter,
    );

    // Combine adapter parts with dispatcher
    this.#adapter = {
      ...adapterWithoutDispatcher,
      dispatcher: this.#createDispatcher(),
    };
  };
  #hasShapes = () => {
    const shapes = this.#adapter?.controller.get.shapes() ?? {};
    return !!shapes?.[this.lfShape];
  };
  #isMasonry = () => {
    return this.lfView === "main";
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
    const { lfColumns, lfShape } = this;
    const viewportWidth = this.#adapter?.controller.get.viewportWidth() ?? 0;
    const shapes = this.#adapter?.controller.get.shapes() ?? {};

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
  #handleResize = this.#debounce(() => {
    this.#adapter.controller.set.viewportWidth(window.innerWidth);
  }, 200);
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
    // Set initial viewport width via adapter
    this.#adapter.controller.set.viewportWidth(window.innerWidth);

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
    if (this.lfSelectable && hasThemeRipple) {
      this.#captureElements.forEach((item) => {
        effects.register.ripple(item);
      });
    }

    debug.info.update(this, "did-render");
  }
  render() {
    const { setLfStyle } = this.#framework.theme;
    const { get } = this.#adapter.controller;

    const { lfStyle } = this;
    const selectedShape = get.selectedShape();
    const shapes = get.shapes();

    const style = {
      [this.#v.columns]: String(this.#currentColumns),
    };

    this.#captureElements = [];

    return (
      <Host style={style}>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <LfMasonryFC
            actions={this.lfActions}
            adapter={this.#adapter}
            captureRef={(el: HTMLDivElement) => {
              if (el && !this.#captureElements.includes(el)) {
                this.#captureElements.push(el);
              }
            }}
            columns={this.#currentColumns}
            framework={this.#framework}
            onItemClick={(
              e: MouseEvent | PointerEvent,
              _index: number,
              refKey: string,
            ) => {
              this.onLfEvent(e, "click", refKey);
            }}
            onShapeEvent={(e: CustomEvent, refKey: string) => {
              this.onLfEvent(e, "lf-event", refKey);
            }}
            selectable={this.lfSelectable}
            selectedShape={selectedShape}
            shape={this.lfShape}
            shapes={shapes}
            view={this.lfView}
          />
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
