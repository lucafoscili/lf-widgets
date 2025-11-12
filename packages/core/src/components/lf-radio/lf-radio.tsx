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
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_RADIO_BLOCKS,
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
import { awaitFramework } from "../../utils/setup";
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
  @State() value: string;
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
  #b = LF_RADIO_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #framework: LfFrameworkInterface;
  #lf = LF_ATTRIBUTES;
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
  async onLfEvent(
    e: Event | CustomEvent,
    eventType: LfRadioEvent,
    _index?: number,
    node?: LfDataNode,
  ) {
    const { effects } = this.#framework;
    const { lfRipple } = this;

    const previousValue = this.value;

    switch (eventType) {
      case "change":
      case "click": {
        await this.#adapter.controller.set.selection.select(node?.id);
        break;
      }
      case "pointerdown": {
        if (lfRipple) {
          const surface = node?.id
            ? this.#adapter?.elements.refs.ripples.get(node.id)
            : undefined;
          if (surface) {
            effects.ripple(e as PointerEvent, surface);
          }
        }
        break;
      }
    }

    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
      node: node || null,
      previousValue: previousValue || null,
      value: this.value || null,
    });
  }
  //#endregion

  //#region Public methods
  /**
   * Clear the current selection.
   */
  @Method()
  async clearSelection(): Promise<void> {
    const { controller } = this.#adapter;

    await controller.set.selection.clear();
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
    const { controller } = this.#adapter;

    await controller.set.selection.select(nodeId);
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

    this.#adapter = createAdapter(
      {
        blocks: this.#b,
        compInstance: this,
        cyAttributes: this.#cy,
        lfAttributes: this.#lf,
        manager: this.#framework,
        parts: this.#p,
        data: {
          dataset: () => this.lfDataset,
          nodes: () => this.lfDataset?.nodes || [],
          nodeById: (id: string) =>
            this.lfDataset?.nodes?.find((n) => n.id === id),
          selectedNode: () => {
            const selectedId = this.value;
            if (!selectedId || !this.lfDataset?.nodes) {
              return undefined;
            }

            return this.lfDataset.nodes.find((n) => n.id === selectedId);
          },
        },
        state: {
          selectedId: () => this.value,
          isSelected: (nodeId: string) => this.value === nodeId,
        },
        ui: {
          orientation: () => this.lfOrientation,
          isLeadingLabel: () => this.lfLeadingLabel,
          hasRipple: () => this.lfRipple,
        },
      },
      {
        selection: {
          select: async (nodeId: string | undefined) => {
            this.#adapter.controller.get.compInstance;

            const isDisabled = nodeId
              ? this.#adapter.controller.get.data.nodeById(nodeId)?.isDisabled
              : this.lfUiState === "disabled"
                ? true
                : false;

            if (isDisabled) {
              return;
            }

            this.value = nodeId;
          },
          clear: async () => {
            await this.#adapter.controller.set.selection.select(undefined);
          },
        },
        data: {
          updateDataset: async (dataset: LfDataDataset) => {
            const currentSelectedId =
              this.#adapter.controller.get.state.selectedId();

            this.lfDataset = dataset;

            if (currentSelectedId) {
              const stillExists = dataset?.nodes?.some(
                (n) => n.id === currentSelectedId,
              );
              if (!stillExists) {
                await this.#adapter.controller.set.selection.clear();
              }
            }
          },
        },
      },
      () => this.#adapter,
    );
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
    const { lfStyle } = this;

    const nodes = this.lfDataset?.nodes || [];

    if (!nodes || nodes.length === 0) {
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
    this.#framework.theme.unregister(this);
  }
  //#endregion
}
