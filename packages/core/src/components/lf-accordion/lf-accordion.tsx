import {
  LF_ACCORDION_BLOCKS,
  LF_ACCORDION_IDS,
  LF_ACCORDION_PARTS,
  LF_ACCORDION_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfAccordionAdapter,
  LfAccordionElement,
  LfAccordionEvent,
  LfAccordionEventPayload,
  LfAccordionInterface,
  LfAccordionPropsInterface,
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
import { prepAccordionActions } from "./actions.accordion";
import { prepAccordionComputed } from "./computed.accordion";
import { createAdapter } from "./lf-accordion-adapter";

/**
 * Represents an accordion-style component that displays a list of data items,
 * allowing users to expand or collapse content sections. Implements various
 * methods for managing state, retrieving component properties, handling user
 * interactions, and unmounting the component. Ripple effects may be enabled or
 * disabled via a property.
 *
 * @component
 * @tag lf-accordion
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element with expandable/collapsible sections.
 *
 * @example
 * <lf-accordion
 *   lfDataset={{
 *     nodes: [
 *       { id: "1", value: "Item 1", description: "Description 1" },
 *       { id: "2", value: "Item 2", description: "Description 2" }
 *     ]
 *   }}
 *   lfRipple={true}
 *   lfUiSize="medium"
 *   lfUiState="primary"
 *   lfStyle="#lf-component { background-color: red; }"
 * ></lf-accordion>
 *
 * @fires {CustomEvent} lf-accordion-event - Emitted for various component events
 */
@Component({
  tag: "lf-accordion",
  styleUrl: "lf-accordion.scss",
  shadow: true,
})
export class LfAccordion implements LfAccordionInterface {
  /**
   * References the root HTML element of the component (<lf-accordion>).
   */
  @Element() rootElement: LfAccordionElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() expandedNodeIds: Set<string> = new Set();
  @State() selectedNodeIds: Set<string> = new Set();
  //#endregion

  //#region Props
  /**
   * The data set for the LF Accordion component.
   * This property is mutable, meaning it can be changed after the component is initialized.
   *
   * @type {LfDataDataset}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-accordion
   *  lfDataset={{
   *   nodes: [
   *   { id: "1", value: "Item 1", description: "Description 1" },
   *   { id: "2", value: "Item 2", description: "Description 2" },
   *  ],
   * }}
   * ></lf-accordion>
   * ```
   */
  @Prop({ mutable: true }) lfDataset: LfDataDataset = null;
  /**
   * IDs of nodes that should be expanded. When provided, the accordion will sync
   * its internal expanded state with this array.
   *
   * @type {string[]}
   * @default []
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-accordion lfExpanded={["node-1", "node-2"]}></lf-accordion>
   * ```
   */
  @Prop({ mutable: true }) lfExpanded: string[] = [];
  /**
   * Indicates whether the ripple effect is enabled for the accordion component.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-accordion lfRipple={false}></lf-accordion>
   * ```
   */
  @Prop({ mutable: true }) lfRipple: boolean = true;
  /**
   * The size of the component.
   *
   * @type {LfThemeUISize}
   * @default "medium"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-accordion lfUiSize="small"></lf-accordion>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfUiSize: LfThemeUISize = "medium";
  /**
   * The color theme state for the component.
   *
   * @type {LfThemeUIState}
   * @default "primary"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-accordion lfUiState="secondary"></lf-accordion>
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-accordion lfStyle="color: red;"></lf-accordion>
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  //#endregion

  //#region Internal variables
  #adapter: LfAccordionAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_ACCORDION_BLOCKS;
  #ids = LF_ACCORDION_IDS;
  #p = LF_ACCORDION_PARTS;
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
    eventName: "lf-accordion-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfAccordionEventPayload>;
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
   * @returns {Promise<LfAccordionPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfAccordionPropsInterface> {
    const entries = LF_ACCORDION_PROPS.map(
      (
        prop,
      ): [
        keyof LfAccordionPropsInterface,
        LfAccordionPropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Returns the expanded node IDs.
   * @returns {Promise<Set<string>>} Expanded node IDs.
   */
  @Method()
  async getExpandedNodes(): Promise<Set<string>> {
    return this.expandedNodeIds;
  }
  /**
   * Returns the selected node IDs.
   * @returns {Promise<Set<string>>} Selected node IDs.
   */
  @Method()
  async getSelectedNodes(): Promise<Set<string>> {
    return this.selectedNodeIds;
  }
  /**
   * This method is used to trigger a new render of the component.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }
  /**
   * Toggles a node in the accordion, expanding or collapsing it based on its current state.
   * @param {string} id - The ID of the node to toggle.
   * @param {Event} [e] - The event that triggered the node toggle action.
   */
  @Method()
  async toggleNode(id: string, e?: Event) {
    const node = this.lfDataset.nodes.find((n) => n.id === id);
    if (!node) {
      return;
    }

    this.#adapter.controller.actions.toggle(node, e);
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
      eventType: LfAccordionEvent,
      detail?: Partial<LfAccordionEventPayload>,
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
      });
    },
  });
  /**
   * Initializes the adapter with v4.0.0 architecture.
   *
   * Structure:
   * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
   * - controller.set: N/A for accordion
   * - controller.computed: Derived predicates (isExpanded, isExpandible, isSelected)
   * - controller.actions: Complex operations (toggle)
   * - elements: JSX factories + refs
   * - dispatcher: Centralized event emission
   *
   * @see Section 5 of 4_0_0_REFACTORING.md
   */
  #initAdapter = () => {
    // Adapter accessor - shared by all factories
    const getAdapter = () => this.#adapter;

    const adapterWithoutDispatcher = createAdapter(
      // Getters - base getters (via utility)
      {
        ...createBaseGetters({
          blocks: () => this.#b,
          compInstance: () => this,
          framework: () => this.#framework,
          ids: () => this.#ids,
          parts: () => this.#p,
        }),
      },
      // Setters - N/A for accordion
      {},
      // Computed - derived predicates (from dedicated file)
      prepAccordionComputed(getAdapter),
      // Actions - complex multi-step operations (from dedicated file)
      prepAccordionActions(getAdapter),
      // Adapter accessor
      getAdapter,
    );

    // Combine adapter parts with dispatcher
    this.#adapter = {
      ...adapterWithoutDispatcher,
      dispatcher: this.#createDispatcher(),
    };
  };
  #syncExpandedFromProp() {
    if (this.lfExpanded?.length) {
      this.expandedNodeIds = new Set(this.lfExpanded);
    }
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
    this.#syncExpandedFromProp();
  }
  componentWillUpdate() {
    this.#syncExpandedFromProp();
  }
  componentDidLoad() {
    const { debug, effects, theme } = this.#framework;
    const { headers } = this.#adapter.elements.refs;

    const hasThemeRipple = theme.get.current().hasEffect("ripple");
    if (this.lfRipple && hasThemeRipple) {
      headers.forEach((header) => {
        if (header) {
          effects.register.ripple(header);
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
    const { debug } = this.#framework;

    debug.info.update(this, "did-render");
  }
  render() {
    const { setLfStyle } = this.#framework.theme;
    const { lfStyle } = this;

    // Clear refs before render
    this.#adapter.elements.refs.headers.clear();

    const { accordion: accordionJsx } = this.#adapter.elements.jsx;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>{accordionJsx()}</div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { effects, theme } = this.#framework ?? {};

    if (this.#adapter) {
      const { headers } = this.#adapter.elements.refs;

      const hasThemeRipple = theme?.get.current().hasEffect("ripple");
      if (effects && this.lfRipple && hasThemeRipple) {
        headers.forEach((header) => {
          if (header) {
            effects.unregister.ripple(header);
          }
        });
      }
    }

    theme?.unregister(this);
  }
  //#endregion
}
