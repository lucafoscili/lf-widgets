import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_COMPARE_BLOCKS,
  LF_COMPARE_CSS_VARS,
  LF_COMPARE_PARTS,
  LF_COMPARE_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfCompareAdapter,
  LfCompareElement,
  LfCompareEvent,
  LfCompareEventPayload,
  LfCompareInterface,
  LfComparePropsInterface,
  LfCompareView,
  LfDataCell,
  LfDataDataset,
  LfDataShapes,
  LfDataShapesMap,
  LfDebugLifecycleInfo,
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
import { createAdapter } from "./lf-compare-adapter";
import { defineShapes } from "../../utils/shapes";

/**
 * Represents a comparison component that displays two shapes side by side or
 * overlaid on top of each other. Implements methods for fetching debug
 * information, retrieving component properties, refreshing the component, and
 * initiating the unmount sequence. The component may be styled with custom CSS.
 *
 * @component
 * @tag lf-compare
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for comparing two shapes. The component supports various
 * view types, including overlay and side-by-side comparisons.
 *
 * @example
 * <lf-compare
 * lfDataset={dataset}
 * lfShape="image"
 * ></lf-compare>
 *
 * @fires {CustomEvent} lf-compare-event - Emitted for various component events
 */
@Component({
  tag: "lf-compare",
  styleUrl: "lf-compare.scss",
  shadow: true,
})
export class LfCompare implements LfCompareInterface {
  /**
   * References the root HTML element of the component (<lf-compare>).
   */
  @Element() rootElement: LfCompareElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() isLeftPanelOpened = false;
  @State() isRightPanelOpened = false;
  @State() leftShape: LfDataCell;
  @State() rightShape: LfDataCell;
  @State() shapes: LfDataShapesMap = {};
  //#endregion

  //#region Props
  /**
   * The data set for the LF Chart component.
   * This property is mutable, meaning it can be changed after the component is initialized.
   *
   * @type {LfDataDataset}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-compare lfDataset={dataset}></lf-compare>
   * ```
   */
  @Prop({ mutable: true }) lfDataset: LfDataDataset = null;
  /**
   * Sets the type of shapes to compare.
   *
   * @type {LfDataShapes}
   * @default "image"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-compare lfShape="image"></lf-compare>
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
   * <lf-compare lfStyle="#lf-component { color: red; }"></lf-compare>
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * Sets the type of view, either styled as a before-after or a side-by-side comparison.
   *
   * @type {LfCompareView}
   * @default "overlay"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-compare lfView="split"></lf-compare>
   * ```
   */
  @Prop({ mutable: true }) lfView: LfCompareView = "main";
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_COMPARE_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_COMPARE_PARTS;
  #s = LF_STYLE_ID;
  #v = LF_COMPARE_CSS_VARS;
  #w = LF_WRAPPER_ID;
  #adapter: LfCompareAdapter;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-compare-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfCompareEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfCompareEvent) {
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
      const shapes = this.#getShapes();
      this.leftShape = shapes[0];
      this.rightShape = shapes[1];
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
   * @returns {Promise<LfComparePropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfComparePropsInterface> {
    const entries = LF_COMPARE_PROPS.map(
      (
        prop,
      ): [
        keyof LfComparePropsInterface,
        LfComparePropsInterface[typeof prop],
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
        cyAttributes: this.#cy,
        isOverlay: () => this.#isOverlay(),
        lfAttributes: this.#lf,
        manager: this.#framework,
        parts: this.#p,
        shapes: () => this.#getShapes(),
      },
      {
        leftPanelOpened: (value?) => {
          if (value === undefined) {
            this.isLeftPanelOpened = !this.isLeftPanelOpened;
          } else {
            this.isLeftPanelOpened = value;
          }
        },
        leftShape: (shape) => (this.leftShape = shape),
        rightPanelOpened: (value?) => {
          if (value === undefined) {
            this.isRightPanelOpened = !this.isRightPanelOpened;
          } else {
            this.isRightPanelOpened = value;
          }
        },
        rightShape: (shape) => (this.rightShape = shape),
        splitView: (value) => {
          this.lfView = value ? "split" : "main";
        },
      },
      () => this.#adapter,
    );
  };
  #getShapes() {
    return this.shapes?.[this.lfShape] || [];
  }
  #hasShapes() {
    return !!this.shapes?.[this.lfShape];
  }
  #isOverlay() {
    return !!(this.lfView === "main");
  }
  #prepCompare(): VNode {
    const { bemClass } = this.#framework.theme;

    const { compare } = this.#b;

    if (this.#hasShapes()) {
      const shapes = this.shapes[this.lfShape];
      if (shapes?.length > 1) {
        return (
          <div class={bemClass(compare._, compare.grid)}>
            {this.#prepView()}
            {this.#prepToolbar()}
          </div>
        );
      }
    }

    return null;
  }
  #prepToolbar(): VNode {
    const { bemClass } = this.#framework.theme;

    const { toolbar } = this.#b;
    const { changeView, leftButton, rightButton } = this.#adapter.elements.jsx;

    return (
      <div class={bemClass(toolbar._)}>
        {leftButton()}
        {changeView()}
        {rightButton()}
      </div>
    );
  }
  #prepView(): VNode {
    const { data, sanitizeProps, theme } = this.#framework;
    const { bemClass } = theme;

    const { view } = this.#b;
    const { left, right } = this.#adapter.controller.get.defaults;
    const { leftTree, rightTree } = this.#adapter.elements.jsx;
    const {
      isLeftPanelOpened,
      isRightPanelOpened,
      lfShape,
      lfView,
      leftShape,
      rightShape,
    } = this;

    const leftShapes = left?.[lfShape]?.() || [];
    const leftSanitized: LfDataCell[] = [];
    for (let index = 0; index < leftShapes.length; index++) {
      const s = leftShapes[index];
      leftSanitized.push(sanitizeProps(s));
    }
    const rightShapes = right?.[lfShape]?.() || [];
    const rightSanitized: LfDataCell[] = [];
    for (let index = 0; index < rightShapes.length; index++) {
      const s = rightShapes[index];
      rightSanitized.push(sanitizeProps(s));
    }

    const shapes = data.cell.shapes.decorate(
      lfShape,
      [leftShape, rightShape],
      async (e) => this.onLfEvent(e, "lf-event"),
      [...leftSanitized, ...rightSanitized],
    );

    return (
      <Fragment>
        <div
          class={bemClass(view._, null, {
            [lfView]: true,
          })}
        >
          <div class={bemClass(view._, view.left)}>{shapes[0]}</div>
          {isLeftPanelOpened && leftTree()}
          {isRightPanelOpened && rightTree()}
          {this.#isOverlay() && (
            <div
              class={bemClass(view._, view.slider)}
              onChange={this.#updateOverlayInput}
              onInput={this.#updateOverlayInput}
            >
              <input
                class={bemClass(view._, view.input)}
                data-cy={this.#cy.input}
                min="0"
                max="100"
                type="range"
                value="50"
              />
            </div>
          )}
          <div class={bemClass(view._, view.right)}>{shapes[1]}</div>
        </div>
      </Fragment>
    );
  }
  #updateOverlayInput = (event: InputEvent) => {
    const { target } = event;
    if (target instanceof HTMLInputElement) {
      const sliderValue = 100 - parseInt(target.value);
      this.rootElement.style.setProperty(
        this.#v.overlayWidth,
        `${sliderValue}%`,
      );
    }
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
    defineShapes(this.#framework);
    this.#initAdapter();
    this.updateShapes();
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

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

    const { compare } = this.#b;
    const { lfStyle } = this;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div class={bemClass(compare._)} part={this.#p.compare}>
            {this.#prepCompare()}
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}
