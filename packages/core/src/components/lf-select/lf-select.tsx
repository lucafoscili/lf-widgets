import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
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
import { awaitFramework } from "../../utils/setup";
import { createAdapter } from "./lf-select-adapter";

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
  @State() isOpen = false;
  @State() value: string = null;
  //#endregion

  //#region Props
  /**
   * Sets the dataset containing the selectable options.
   *
   * @type {LfDataDataset}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-select lfDataset={{ nodes: [{ id: "1", value: "Option 1" }, { id: "2", value: "Option 2" }] }} />
   * ```
   */
  @Prop({ mutable: true }) lfDataset: LfDataDataset = null;
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

  //#region Watchers
  @Watch("lfDataset")
  onLfDatasetChange() {
    if (this.value && !this.#consistencyCheck(this.value)) {
      this.value = null;
    }
  }
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #adapter: LfSelectAdapter;
  #b = LF_SELECT_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
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
  onLfEvent(
    e: Event | CustomEvent,
    eventType: LfSelectEvent,
    node?: LfDataNode,
    value?: string | number,
  ) {
    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement?.id || "",
      originalEvent: e,
      node,
      value,
    });
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
   * Returns the currently selected node.
   * @returns Promise that resolves with the selected node
   */
  @Method()
  async getValue(): Promise<LfDataNode> {
    return this.#adapter.controller.get.selectedNode();
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
    if (this.#consistencyCheck(id)) {
      this.#adapter.controller.set.select.value(id);
    }
  }
  /**
   * Initiates the unmount sequence.
   * @param ms - Delay in milliseconds
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
  #consistencyCheck(id: string): boolean {
    return (
      !id || (this.lfDataset?.nodes?.some((node) => node.id === id) ?? false)
    );
  }
  #initAdapter() {
    this.#adapter = createAdapter(
      {
        blocks: this.#b,
        compInstance: this,
        cyAttributes: this.#cy,
        isDisabled: () => this.lfUiState === "disabled",
        isOpen: () => this.isOpen,
        lfAttributes: this.#lf,
        manager: this.#framework,
        parts: this.#p,
        selectedNode: () =>
          this.lfDataset?.nodes?.find((node) => node.id === this.value),
      },
      {
        select: {
          open: (open: boolean) => {
            const { list } = this.#adapter.elements.refs;

            const {
              close,
              isInPortal,
              open: portalOpen,
            } = this.#framework.portal;

            if (open) {
              portalOpen(list, this.#adapter.elements.refs.textfield);
            } else {
              if (isInPortal(list)) {
                close(list);
              }
            }

            this.isOpen = open;
          },
          value: (value: string) => {
            this.#adapter.elements.refs.list?.selectNodeById(value);
            this.#adapter.elements.refs.textfield.setValue(value);
            this.value = value;
          },
        },
      },
      () => this.#adapter,
    );
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

    const strValue = this.lfValue?.toString();
    if (this.lfValue && this.#consistencyCheck(strValue)) {
      this.value = strValue;
    }
  }
  async componentDidLoad() {
    const { info } = this.#framework.debug;

    this.onLfEvent(new CustomEvent("ready"), "ready");
    await info.update(this, "did-load");
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
    const { lfStyle } = this;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div
            class={bemClass(this.#b._)}
            data-lf={this.#lf[this.lfUiState]}
            part={this.#p.select}
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

      if (list && this.#framework?.portal.isInPortal(list)) {
        this.#framework?.portal.close(list);
      }
    }
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}
