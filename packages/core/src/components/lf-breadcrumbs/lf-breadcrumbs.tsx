import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_BREADCRUMBS_BLOCKS,
  LF_BREADCRUMBS_PARTS,
  LF_BREADCRUMBS_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfBreadcrumbsAdapter,
  LfBreadcrumbsElement,
  LfBreadcrumbsEvent,
  LfBreadcrumbsEventArguments,
  LfBreadcrumbsEventPayload,
  LfBreadcrumbsInterface,
  LfBreadcrumbsPropsInterface,
  LfDataDataset,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfThemeUISize,
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
import { awaitFramework } from "../../utils/setup";
import { buildBreadcrumbPath } from "./helpers.path";
import { createAdapter } from "./lf-breadcrumbs-adapter";

/**
 * The LfBreadcrumbs component is a Stencil-based web component designed to render a breadcrumb navigation trail
 * based on a hierarchical dataset. It allows users to visualize and interact with the path from a root node to the
 * current node, supporting features like customizable separators, maximum items display, ripple effects, and theming.
 *
 * This component integrates with the LF Framework for theming, debugging, and effects management. It emits events
 * for user interactions and provides methods for programmatic control, such as setting the current node or refreshing
 * the component.
 *
 * Key features include:
 * - Dynamic breadcrumb path generation from a dataset.
 * - Interactive navigation with click events and optional ripple effects.
 * - Configurable UI size, separator, and visibility of the root node.
 * - Support for debugging and lifecycle management.
 *
 * @example
 * ```html
 * <lf-breadcrumbs
 *   lf-dataset="your-dataset"
 *   lf-current-node-id="node-id"
 *   lf-separator=">"
 *   lf-show-root="true"
 *   lf-interactive="true"
 * ></lf-breadcrumbs>
 * ```
 *
 * @fires lf-breadcrumbs-event - Emitted for various events like 'ready', 'click', and 'unmount'.
 *
 * @slot - Default slot for custom content, though primarily used for internal rendering.
 *
 * @cssprop --lf-breadcrumbs-color - Color of the breadcrumb text.
 * @cssprop --lf-breadcrumbs-font-size - Font size of the breadcrumbs.
 * @cssprop --lf-breadcrumbs-separator-margin - Margin around the separator.
 */
@Component({
  tag: "lf-breadcrumbs",
  styleUrl: "lf-breadcrumbs.scss",
  shadow: true,
})
export class LfBreadcrumbs implements LfBreadcrumbsInterface {
  /**
   * References the root HTML element of the component (<lf-breadcrumbs>).
   */
  @Element() rootElement: LfBreadcrumbsElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() currentNodeId: string = null;
  //#endregion

  //#region Props
  /**
   * ID of the current node in the breadcrumb path.
   *
   * @type {string}
   * @default undefined
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-breadcrumbs lf-current-node-id="node-123"></lf-breadcrumbs>
   * ```
   */
  @Prop({ mutable: true }) lfCurrentNodeId?: string; //FIXME: shouldn't this be non-mutable & called lfValue based on the architectural guidelines?
  /**
   * Dataset used to build the breadcrumb path.
   *
   * @type {LfDataDataset}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-breadcrumbs lf-dataset="{...}"></lf-breadcrumbs>
   * ```
   */
  @Prop({ mutable: true }) lfDataset: LfDataDataset = null;
  /**
   * Message displayed when the dataset is empty.
   *
   * @type {string}
   * @default "Empty data."
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-breadcrumbs lf-empty="No data available."></lf-breadcrumbs>
   * ```
   */
  @Prop({ mutable: true }) lfEmpty: string = "Empty data.";
  /**
   * When true, enables interactivity for breadcrumb items.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-breadcrumbs lf-interactive="false"></lf-breadcrumbs>
   * ```
   */
  @Prop({ mutable: true }) lfInteractive: boolean = true;
  /**
   * Maximum number of breadcrumb items to display.
   *
   * @type {number}
   * @default undefined
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-breadcrumbs lf-max-items="5"></lf-breadcrumbs>
   * ```
   */
  @Prop({ mutable: true }) lfMaxItems?: number;
  /**
   * When true, enables ripple effect on breadcrumb item clicks.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-breadcrumbs lf-ripple="true"></lf-breadcrumbs>
   * ```
   */
  @Prop({ mutable: true }) lfRipple: boolean = false;
  /**
   * Separator string displayed between breadcrumb items.
   *
   * @type {string}
   * @default ">"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-breadcrumbs lf-separator="/"></lf-breadcrumbs>
   * ```
   */
  @Prop({ mutable: true }) lfSeparator: string = ">";
  /**
   * When true, the root node is included in the breadcrumb path.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-breadcrumbs lf-show-root="false"></lf-breadcrumbs>
   * ```
   */
  @Prop({ mutable: true }) lfShowRoot: boolean = true;
  /**
   * Custom CSS styles applied to the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-breadcrumbs lf-style="--lf-breadcrumbs-color: red;"></lf-breadcrumbs>
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * The size of the component.
   *
   * @type {LfThemeUISizeKey}
   * @default "medium"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-button lfUiSize="small"></lf-button>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfUiSize: LfThemeUISize = "medium";
  //FIXME: investigate wheteher we need lfUiState too or if it's correctly omitted. Especially in relation to the selected state.
  //#endregion

  //#region Internal variables
  #adapter: LfBreadcrumbsAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_BREADCRUMBS_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_BREADCRUMBS_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  //#endregion

  //#region Events
  @Event({
    eventName: "lf-breadcrumbs-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfBreadcrumbsEvent: EventEmitter<LfBreadcrumbsEventPayload>;

  onLfEvent = (
    e: Event | CustomEvent,
    eventType: LfBreadcrumbsEvent,
    args?: LfBreadcrumbsEventArguments,
  ) => {
    const payload: LfBreadcrumbsEventPayload = {
      comp: this,
      eventType,
      id: this.rootElement?.id,
      originalEvent: e,
      ...(args || {}),
    };

    this.lfBreadcrumbsEvent.emit(payload); //FIXME: this should be the last line of the method, ensuring that all the logic is executed before emitting the event. The payload should be just built before thus line.

    if (
      eventType === "click" &&
      this.#adapter.controller.get.isEnabled(this.lfRipple) &&
      args?.node
    ) {
      const rippleTarget = this.#adapter?.elements.refs.ripples.get(
        args.node.id,
      );
      this.#framework?.effects.ripple(e as PointerEvent, rippleTarget);
    }
  };
  //#endregion

  //#region Watchers
  @Watch("lfCurrentNodeId") //FIXME: this should be removed as lfCurrentNodeId (aka lfValue) is not mutable
  handleCurrentNodeId(newValue: string) {
    this.currentNodeId = newValue;
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
   * @returns {Promise<LfBreadcrumbsPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfBreadcrumbsPropsInterface> {
    const entries = LF_BREADCRUMBS_PROPS.map(
      (
        prop,
      ): [
        keyof LfBreadcrumbsPropsInterface,
        LfBreadcrumbsPropsInterface[typeof prop],
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
   * Sets the current node to the specified node ID.
   * @param nodeId - The ID of the node to set as current.
   * @returns A promise that resolves when the current node has been set.
   */
  @Method()
  async setCurrentNode(nodeId: string): Promise<void> {
    await this.#adapter.controller.set.currentNode(nodeId);
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
        dataset: () => this.lfDataset,
        isEnabled: (value?) => value !== false && value !== "false",
        lfAttributes: this.#lf,
        manager: () => this.#framework,
        parts: this.#p,
        path: () =>
          buildBreadcrumbPath(
            this.#framework,
            this.lfDataset,
            this.currentNodeId ?? this.lfCurrentNodeId,
            this.#adapter.controller.get.isEnabled(this.lfShowRoot),
          ),
        separator: () => `${this.lfSeparator ?? ">"}`,
        uiSize: () => this.lfUiSize,
      },
      {
        currentNode: async (nodeId: string) => {
          this.lfCurrentNodeId = nodeId;
          this.currentNodeId = nodeId;
        },
      },
      () => this.#adapter,
    );
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
    this.currentNodeId = this.lfCurrentNodeId ?? null;
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
    const { setLfStyle } = this.#framework.theme;
    const { jsx } = this.#adapter.elements;

    return (
      <Host>
        {this.lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>{jsx.items()}</div>
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}
