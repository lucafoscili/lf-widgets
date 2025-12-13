import type {
  LfRadioAdapter,
  LfRadioEvent,
  LfRadioEventPayload,
  LfRadioInterface,
  LfRadioOrientation,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import {
  LF_RADIO_BLOCKS,
  LF_RADIO_IDS,
  LF_RADIO_PARTS,
  LF_RADIO_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfDataDataset,
  LfDataNode,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfRadioElement,
  LfRadioPropsInterface,
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
import { prepRadioActions } from "./actions.radio";
import { prepRadioComputed } from "./computed.radio";
import { createAdapter } from "./lf-radio-adapter";

/**
 * LfRadio is a Stencil component that renders a group of radio buttons based on a provided dataset.
 * It supports various configurations such as orientation, labeling position, ripple effects, and theming.
 * The component manages selection state and emits events for user interactions like pointerdown and change.
 * It implements the LfRadioInterface and integrates with the LfFramework for theming and effects.
 *
 * @component
 * @tag lf-radio
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying radio buttons.
 *
 * @example
 * <lf-radio
 *   lfDataset={{ nodes: [{ id: 'option1', value: 'Option 1' }, { id: 'option2', value: 'Option 2' }] }}
 *   lfOrientation="horizontal"
 *   lfValue="option1"
 * ></lf-radio>
 *
 * @fires {CustomEvent} lf-radio-event - Emitted for various component events
 * ```
 */
@Component({
  tag: "lf-radio",
  styleUrl: "lf-radio.scss",
  shadow: true,
})
export class LfRadio implements LfRadioInterface {
  /**
   * References the root HTML element of the component (<lf-radio>).
   */
  @Element() rootElement: LfRadioElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() value: string | undefined;
  //#endregion

  //#region Props
  /**
   * Aria label for accessibility.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-radio lfAriaLabel="Options"></lf-radio>
   * ```
   */
  @Prop({ mutable: true }) lfAriaLabel: string;
  /**
   * Dataset containing the radio options.
   *
   * @type {LfDataDataset}
   * @default {}
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-radio lfDataset={...}></lf-radio>
   * ```
   */
  @Prop({ mutable: true }) lfDataset: LfDataDataset = {};
  /**
   * The orientation of the radio group (vertical or horizontal).
   *
   * @type {LfRadioOrientation}
   * @default "vertical"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-radio lfOrientation="horizontal"></lf-radio>
   * ```
   */
  @Prop({ mutable: true }) lfOrientation: LfRadioOrientation = "vertical";
  /**
   * Whether labels should be positioned before (leading) or after (trailing) the radio controls.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-radio lfLeadingLabel={true}></lf-radio>
   * ```
   */
  @Prop({ mutable: true }) lfLeadingLabel: boolean = false;
  /**
   * When set to true, the pointerdown event will trigger a ripple effect.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-radio lfRipple={true} />
   * ```
   */
  @Prop({ mutable: true }) lfRipple: boolean = true;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-radio lfStyle="#lf-component { color: red; }"></lf-radio>
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string;
  /**
   * The size of the component.
   *
   * @type {LfThemeUISizeKey}
   * @default "medium"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-radio lfUiSize="small"></lf-radio>
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
   * <lf-radio lfUiState="secondary"></lf-radio>
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  /**
   * The ID of the currently selected radio item.
   *
   * @type {string}
   * @default undefined
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-radio lfValue="option2"></lf-radio>
   * ```
   */
  @Prop({ mutable: false }) lfValue: string;
  //#endregion

  //#region Internal variables
  #adapter: LfRadioAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_RADIO_BLOCKS;
  #ids = LF_RADIO_IDS;
  #p = LF_RADIO_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  //#endregion

  //#region Events
  /**
   * Handle component events.
   */
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-radio-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfRadioEventPayload>;
  //#endregion

  //#region Public methods
  /**
   * Clear the current selection.
   */
  @Method()
  async clearSelection(): Promise<void> {
    this.#adapter.controller.actions.clear();
  }
  /**
   * Gets the current adapter instance.
   */
  @Method()
  async getAdapter(): Promise<LfRadioAdapter> {
    return this.#adapter;
  }
  /**
   * Retrieves the debug information reflecting the current state of the component.
   * @returns {Promise<LfDebugLifecycleInfo>} A promise that resolves to a LfDebugLifecycleInfo object containing debug information.
   */
  @Method()
  async getDebugInfo(): Promise<LfDebugLifecycleInfo> {
    return this.debugInfo;
  }
  /**
   * Gets the currently selected node.
   * @returns {Promise<LfDataNode | undefined>} A promise that resolves to the selected data node or undefined if no selection.
   */
  @Method()
  async getSelectedNode(): Promise<LfDataNode | undefined> {
    if (!this.value || !this.lfDataset?.nodes) {
      return undefined;
    }

    return this.lfDataset.nodes.find((node) => node.id === this.value);
  }
  /**
   * Used to retrieve component's properties and descriptions.
   * @returns {Promise<LfRadioPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfRadioPropsInterface> {
    const entries = LF_RADIO_PROPS.map(
      (
        prop,
      ): [keyof LfRadioPropsInterface, LfRadioPropsInterface[typeof prop]] => [
        prop,
        this[prop],
      ],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Triggers a re-render of the component to reflect any state changes.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }
  /**
   * Select an item by ID.
   * @param {string} nodeId - The ID of the item to select.
   */
  @Method()
  async selectItem(nodeId: string): Promise<void> {
    this.#adapter.controller.actions.select(nodeId);
  }
  /**
   * Initiates the unmount sequence, which removes the component from the DOM after a delay.
   * @param {number} ms - Number of milliseconds
   */
  @Method()
  async unmount(ms: number = 0): Promise<void> {
    setTimeout(() => {
      this.#adapter.dispatcher.emit("unmount", {
        node: null,
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
    emit: (eventType: LfRadioEvent, detail?: Partial<LfRadioEventPayload>) => {
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
        node: detail?.node ?? null,
        previousValue: detail?.previousValue ?? null,
        value: this.value ?? null,
      });
    },
  });
  /**
   * Initializes the adapter with v4.0.0 architecture.
   *
   * Structure:
   * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
   * - controller.set: Simple setters (updateDataset)
   * - controller.computed: Derived predicates (isDisabled, hasNodes, isHorizontal, etc.)
   * - controller.actions: Complex operations (select, clear, focusNext, focusPrevious)
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
      },
      // Setters - simple single-value assignments (enhanced in adapter factory)
      { updateDataset: () => {} },
      // Computed - derived predicates (from dedicated file)
      prepRadioComputed(getAdapter),
      // Actions - complex multi-step operations (from dedicated file)
      prepRadioActions(getAdapter),
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

    if (this.lfValue) {
      this.value = this.lfValue;
    }

    this.#initAdapter();
  }
  componentDidLoad() {
    const { debug, effects, theme } = this.#framework;

    const hasThemeRipple = theme.get.current().hasEffect("ripple");
    if (this.lfRipple && hasThemeRipple) {
      this.#adapter.elements.refs.items.forEach((item) => {
        if (item) {
          effects.register.ripple(item);
        }
      });
    }

    // Emit ready event via dispatcher
    this.#adapter.dispatcher.emit("ready", {
      node: null,
    });
    debug.info.update(this, "did-load");
  }
  componentWillRender() {
    const { info } = this.#framework.debug;

    info.update(this, "will-render");
  }
  componentDidRender() {
    const { debug, effects, theme } = this.#framework;
    const { info } = debug;

    const hasThemeRipple = theme.get.current().hasEffect("ripple");
    if (this.lfRipple && hasThemeRipple) {
      this.#adapter.elements.refs.items.forEach((item) => {
        if (item) {
          effects.register.ripple(item);
        }
      });
    }

    info.update(this, "did-render");
  }
  render() {
    const { setLfStyle } = this.#framework.theme;
    const { jsx } = this.#adapter.elements;
    const { hasNodes } = this.#adapter.controller.computed;
    const { lfStyle } = this;

    const nodes = this.lfDataset?.nodes || [];

    if (!hasNodes()) {
      return;
    }

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>{jsx.radio(nodes)}</div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { effects, theme } = this.#framework ?? {};

    const hasThemeRipple = theme?.get.current().hasEffect("ripple");
    if (hasThemeRipple && effects) {
      this.#adapter.elements.refs.items.forEach((item) => {
        if (item) {
          effects.unregister.ripple(item);
        }
      });
    }

    theme?.unregister(this);
  }
  //#endregion
}
