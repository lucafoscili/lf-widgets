import {
  LF_SELECT_BLOCKS,
  LF_SELECT_PARTS,
  LF_SELECT_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfDataDataset,
  LfDataNode,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfListInterface,
  LfSelectAdapter,
  LfSelectElement,
  LfSelectEvent,
  LfSelectEventPayload,
  LfSelectInterface,
  LfSelectPropsInterface,
  LfTextfieldInterface,
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
  Watch,
} from "@stencil/core";
import { createBaseGetters } from "../../utils/adapter";
import { awaitFramework } from "../../utils/setup";
import { prepSelectActions } from "./actions.select";
import { prepSelectComputed } from "./computed.select";
import { createAdapter } from "./lf-select-adapter";
import { findNodeById, hasNodeWithId } from "./utils.select";

/**
 * The select component provides a dropdown selection interface that combines textfield styling with list functionality.
 * It displays selected values in a textfield-like appearance and shows available options in a dropdown list.
 *
 * @component
 * @tag lf-select
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for dropdown selection with unified textfield and list event handling.
 *
 * @example
 * <lf-select lfDataset={dataset} lfLabel="Select an option" />
 *
 * @fires {CustomEvent} lf-select-event - Emitted for various component events
 */
@Component({
  tag: "lf-select",
  styleUrl: "lf-select.scss",
  shadow: true,
})
export class LfSelect implements LfSelectInterface {
  /**
   * References the root HTML element of the component (<lf-select>).
   */
  @Element() rootElement: LfSelectElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() focused = false;
  @State() value: string | null = null;
  //#endregion

  //#region Props
  /**
   * Sets the dataset containing the selectable options.
   * This property is immutable after the component has loaded.
   *
   * @type {LfDataDataset}
   * @default null
   * @mutable false
   *
   * @example
   * ```tsx
   * <lf-select lfDataset={{ nodes: [{ id: "1", value: "Option 1" }, { id: "2", value: "Option 2" }] }} />
   * ```
   */
  @Prop({ mutable: false }) lfDataset: LfDataDataset = null;
  /**
   * Sets the props for the internal lf-list component.
   *
   * @type {Partial<LfListInterface>}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-select lfListProps={{ lfUiSize: "small" }} />
   * ```
   */
  @Prop({ mutable: true }) lfListProps: Partial<LfListInterface> = null;
  /**
   * Enables keyboard navigation with arrow keys.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-select lfNavigation={false} />
   * ```
   */
  @Prop({ mutable: true }) lfNavigation: boolean = true;
  /**
   * Custom CSS styles to apply to the component.
   *
   * @type {string}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-select lfStyle="color: red;" />
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = null;
  /**
   * Sets the props for the internal lf-textfield component.
   *
   * @type {Partial<LfTextfieldInterface>}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-select lfTextfieldProps={{ lfUiSize: "small" }} />
   * ```
   */
  @Prop({ mutable: true }) lfTextfieldProps: Partial<LfTextfieldInterface> =
    null;
  /**
   * Sets the UI size of the select field.
   *
   * @type {LfThemeUISize}
   * @default "medium"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-select lfUiSize="large" />
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfUiSize: LfThemeUISize = "medium";
  /**
   * Sets the UI state color of the select field.
   *
   * @type {LfThemeUIState}
   * @default "primary"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-select lfUiState="success" />
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  /**
   * Sets the initial selected value.
   * Non-mutable after component load.
   *
   * @type {string | number}
   * @default null
   *
   * @example
   * ```tsx
   * <lf-select lfValue="option1" />
   * ```
   */
  @Prop({ mutable: false }) lfValue: string | number = null;
  //#endregion

  //#region Internal variables
  #adapter: LfSelectAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_SELECT_BLOCKS;
  #p = LF_SELECT_PARTS;
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
    eventName: "lf-select-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfSelectEventPayload>;
  //#endregion

  //#region Watchers
  @Watch("lfDataset")
  onLfDatasetChange() {
    // Validate current value against new dataset
    if (
      !this.lfDataset ||
      (this.value && !hasNodeWithId(this.lfDataset, this.value))
    ) {
      this.value = null;
    }
  }
  //#endregion

  //#region Public methods
  /**
   * Returns debug information about the component's current state.
   * @returns Promise that resolves with debug information
   */
  @Method()
  async getDebugInfo(): Promise<LfDebugLifecycleInfo> {
    return this.debugInfo;
  }
  /**
   * Retrieves the public props for the component.
   * @returns Promise that resolves with the component props
   */
  @Method()
  async getProps(): Promise<LfSelectPropsInterface> {
    const entries = LF_SELECT_PROPS.map(
      (
        prop,
      ): [
        keyof LfSelectPropsInterface,
        LfSelectPropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Returns the currently selected node.
   * @returns Promise that resolves with the selected node
   */
  @Method()
  async getValue(): Promise<LfDataNode> {
    return this.#adapter.controller.get.selectedNode();
  }
  /**
   * Returns the index of the currently selected node in the dataset.
   * @returns Promise that resolves with the selected index or -1 if none
   */
  @Method()
  async getSelectedIndex(): Promise<number> {
    const selectedNode = this.#adapter.controller.get.selectedNode();
    if (!selectedNode) {
      return -1;
    }
    return this.#adapter.controller.get.indexById(selectedNode.id);
  }
  /**
   * Forces a re-render of the component.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }
  /**
   * Sets the selected value by id.
   * @param id - The id of the node to select
   */
  @Method()
  async setValue(id: string): Promise<void> {
    await this.#adapter.controller.actions.setValue(id);
  }
  /**
   * Initiates the unmount sequence.
   * @param ms - Delay in milliseconds
   */
  @Method()
  async unmount(ms: number = 0): Promise<void> {
    setTimeout(() => {
      this.#adapter.dispatcher.emit("unmount", {
        value: this.value,
      });
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
      eventType: LfSelectEvent,
      detail?: Partial<LfSelectEventPayload>,
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
        value: detail?.value,
      });
    },
  });
  /**
   * Initializes the adapter with v4.0.0 architecture.
   *
   * Structure:
   * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + component state
   * - controller.set: Simple setters (list)
   * - controller.computed: Derived predicates (isDisabled)
   * - controller.actions: Complex operations (setValue, navigate)
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
          ids: () => ({}),
          parts: () => this.#p,
        }),
        indexById: (id: string) =>
          this.lfDataset?.nodes?.findIndex((n) => n.id === id) ?? -1,
        lfDataset: () => this.lfDataset,
        selectedNode: () => findNodeById(this.lfDataset, this.value),
      },
      // Setters - simple single-value assignments (enhanced in adapter factory)
      { list: () => {} },
      // Computed - derived predicates (from dedicated file)
      prepSelectComputed(getAdapter),
      // Actions - complex multi-step operations (from dedicated file)
      prepSelectActions(getAdapter),
      // Adapter accessor
      getAdapter,
    );

    // Combine adapter parts with dispatcher
    this.#adapter = {
      ...adapterWithoutDispatcher,
      dispatcher: this.#createDispatcher(),
    };
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

    if (typeof this.lfValue === "number") {
      this.value = this.lfDataset.nodes[this.lfValue]?.id || null;
    } else if (typeof this.lfValue === "string" && this.lfValue !== "") {
      this.value = this.lfValue;
    }

    this.#initAdapter();
  }
  componentDidLoad() {
    const { debug } = this.#framework;

    // Emit ready event via dispatcher
    this.#adapter.dispatcher.emit("ready", {
      value: this.value,
    });
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
    const { theme } = this.#framework;
    const { bemClass, setLfStyle } = theme;
    const { cyAttributes, lfAttributes, parts } = this.#adapter.controller.get;
    const { lfStyle } = this;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div
            class={bemClass(this.#b.select._)}
            data-cy={cyAttributes().node}
            data-lf={lfAttributes()[this.lfUiState]}
            part={parts().select}
            ref={(el) => {
              if (el) {
                this.#adapter.elements.refs.select = el;
              }
            }}
          >
            {this.#adapter.elements.jsx.textfield()}
            {this.#adapter.elements.jsx.list()}
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    if (this.#adapter) {
      const { list } = this.#adapter.elements.refs;
      this.#framework?.portal.close(list);
    }
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}
