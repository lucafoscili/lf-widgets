import {
  LF_BREADCRUMBS_BLOCKS,
  LF_BREADCRUMBS_IDS,
  LF_BREADCRUMBS_PARTS,
  LF_BREADCRUMBS_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfBreadcrumbsAdapter,
  LfBreadcrumbsElement,
  LfBreadcrumbsEvent,
  LfBreadcrumbsEventPayload,
  LfBreadcrumbsInterface,
  LfBreadcrumbsPropsInterface,
  LfDataDataset,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfThemeUISize,
  LfThemeUIState,
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
import { createBaseGetters } from "../../utils/adapter";
import { awaitFramework } from "../../utils/setup";
import { prepBreadcrumbsActions } from "./actions.breadcrumbs";
import { prepBreadcrumbsComputed } from "./computed.breadcrumbs";
import { BreadcrumbsFC } from "./fc";
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
 *   lf-value="node-id"
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
  @State() expanded: boolean = false;
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
   * <lf-breadcrumbs lf-value="node-123"></lf-breadcrumbs>
   * ```
   */
  @Prop({ mutable: false }) lfValue?: string;
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
  /**
   * Reflects the specified state color defined by the theme.
   *
   * @type {LfThemeUIState}
   * @default "primary"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-button lfUiState="success"></lf-button>
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  //#endregion

  //#region Internal variables
  #adapter: LfBreadcrumbsAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_BREADCRUMBS_BLOCKS;
  #ids = LF_BREADCRUMBS_IDS;
  #p = LF_BREADCRUMBS_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-breadcrumbs-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfBreadcrumbsEventPayload>;
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
      this.#adapter.dispatcher.emit("unmount");
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
      eventType: LfBreadcrumbsEvent,
      detail?: Partial<LfBreadcrumbsEventPayload>,
    ) => {
      this.#framework.debug?.logs.new(
        this,
        `Event: ${eventType}`,
        "informational",
      );

      this.lfEvent.emit({
        comp: this,
        eventType,
        id: this.rootElement.id,
        originalEvent: detail?.originalEvent,
        node: detail?.node,
        index: detail?.index,
      });
    },
  });
  /**
   * Initializes the adapter with v4.0.0 architecture.
   *
   * Structure:
   * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + component state
   * - controller.set: Simple setters (currentNode, expanded)
   * - controller.computed: Derived predicates (isInteractive, isExpanded, isEmpty)
   * - controller.actions: Complex operations (toggleExpand, setCurrentNode)
   * - elements: JSX factories + refs
   * - dispatcher: Centralized event emission
   * - handlers: Event callbacks
   *
   * @see Section 5 of 4_0_0_REFACTORING.md
   */
  #initAdapter = () => {
    // Adapter accessor - shared by all factories
    const getAdapter = () => this.#adapter;

    const adapterWithoutDispatcher = createAdapter(
      // Getters - base getters (via utility) + component-specific state reads
      {
        ...createBaseGetters({
          blocks: () => this.#b,
          compInstance: () => this,
          framework: () => this.#framework,
          ids: () => this.#ids,
          parts: () => this.#p,
        }),
        dataset: () => this.lfDataset,
        path: () =>
          buildBreadcrumbPath(
            this.#framework,
            this.lfDataset,
            this.currentNodeId ?? this.lfValue,
            this.#isEnabled(this.lfShowRoot),
          ),
        separator: () => `${this.lfSeparator ?? ">"}`,
        uiSize: () => this.lfUiSize,
      },
      // Setters - simple single-value assignments
      {
        currentNode: async (nodeId: string) => {
          this.currentNodeId = nodeId;
          await this.refresh();
        },
        expanded: async (value: boolean) => {
          this.expanded = value;
          await this.refresh();
        },
      },
      // Computed - derived predicates (from dedicated file)
      prepBreadcrumbsComputed(getAdapter),
      // Actions - complex multi-step operations (from dedicated file)
      prepBreadcrumbsActions(getAdapter),
      // Adapter accessor
      getAdapter,
    );

    // Combine adapter parts with dispatcher
    this.#adapter = {
      ...adapterWithoutDispatcher,
      dispatcher: this.#createDispatcher(),
    };
  };
  #isEnabled(value?: boolean | string) {
    return value !== false && value !== "false";
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
    this.currentNodeId = this.lfValue ?? null;
  }
  componentDidLoad() {
    const { debug, effects, theme } = this.#framework;

    const hasThemeRipple = theme.get.current().hasEffect("ripple");
    if (this.#isEnabled(this.lfRipple) && hasThemeRipple) {
      this.#adapter.elements.refs.items.forEach((el) => {
        if (el) {
          effects.register.ripple(el);
        }
      });
    }

    // Emit ready event via dispatcher
    this.#adapter.dispatcher.emit("ready");
    debug.info.update(this, "did-load");
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
    const { lfAttributes } = this.#adapter.controller.get;

    const lf = lfAttributes();

    return (
      <Host>
        {this.lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w} data-lf={lf[this.lfUiState]}>
          <BreadcrumbsFC adapter={this.#adapter} />
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { effects, theme } = this.#framework ?? {};

    const hasThemeRipple = theme?.get.current().hasEffect("ripple");
    if (effects && this.#isEnabled(this.lfRipple) && hasThemeRipple) {
      this.#adapter?.elements.refs.items.forEach((el) => {
        if (el) {
          effects.unregister.ripple(el);
        }
      });
    }

    theme?.unregister(this);
  }
  //#endregion
}
