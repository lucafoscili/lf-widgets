import {
  LF_CHECKBOX_BLOCKS,
  LF_CHECKBOX_IDS,
  LF_CHECKBOX_PARTS,
  LF_CHECKBOX_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfCheckboxAdapter,
  LfCheckboxElement,
  LfCheckboxEvent,
  LfCheckboxEventPayload,
  LfCheckboxInterface,
  LfCheckboxPropsInterface,
  LfCheckboxState,
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
import { prepCheckboxActions } from "./actions.checkbox";
import { prepCheckboxComputed } from "./computed.checkbox";
import { createAdapter } from "./lf-checkbox-adapter";

/**
 * The checkbox component is a three-state selection control.
 * It supports unchecked, checked, and indeterminate states.
 * The checkbox features Material Design-inspired animations and styling.
 *
 * @component
 * @tag lf-checkbox
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for three-state selection.
 *
 * @example
 * <lf-checkbox lfLabel="Accept terms and conditions"></lf-checkbox>
 *
 * @fires {CustomEvent} lf-checkbox-event - Emitted for various component events
 */
@Component({
  tag: "lf-checkbox",
  styleUrl: "lf-checkbox.scss",
  shadow: true,
})
export class LfCheckbox implements LfCheckboxInterface {
  /**
   * References the root HTML element of the component (<lf-checkbox>).
   */
  @Element() rootElement: LfCheckboxElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() value: LfCheckboxState = "off";
  //#endregion

  //#region Props
  /**
   * Explicit accessible label for the checkbox control. Fallback chain when empty:
   * lfLabel -> root element id -> 'checkbox'. Applied to the native input element.
   *
   * @type {string}
   * @default ""
   * @mutable
   */
  @Prop({ mutable: true }) lfAriaLabel: string = "";
  /**
   * Defines text to display along with the checkbox.
   *
   * @type {string}
   * @default ""
   * @mutable
   */
  @Prop({ mutable: true }) lfLabel: string = "";
  /**
   * When set to true, the label will be displayed before the checkbox.
   *
   * @type {boolean}
   * @default false
   * @mutable
   */
  @Prop({ mutable: true }) lfLeadingLabel: boolean = false;
  /**
   * When set to true, the pointerdown event will trigger a ripple effect.
   *
   * @type {boolean}
   * @default true
   * @mutable
   */
  @Prop({ mutable: true }) lfRipple: boolean = true;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * The size of the component.
   *
   * @type {LfThemeUISize}
   * @default "medium"
   * @mutable
   */
  @Prop({ mutable: true, reflect: true }) lfUiSize: LfThemeUISize = "medium";
  /**
   * Reflects the specified state color defined by the theme.
   *
   * @type {LfThemeUIState}
   * @default "primary"
   * @mutable
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";

  /**
   * Sets the initial boolean state of the checkbox.
   * Set to null for indeterminate state.
   *
   * @type {boolean}
   * @default false
   */
  @Prop({ mutable: false }) lfValue: boolean | null = false;
  //#endregion

  //#region Internal variables
  #adapter: LfCheckboxAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_CHECKBOX_BLOCKS;
  #ids = LF_CHECKBOX_IDS;
  #p = LF_CHECKBOX_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string and state information.
   */
  @Event({
    eventName: "lf-checkbox-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfCheckboxEventPayload>;
  //#endregion

  //#region Public methods
  /**
   * Fetches debug information of the component's current state.
   */
  @Method()
  async getDebugInfo(): Promise<LfDebugLifecycleInfo> {
    return this.debugInfo;
  }

  /**
   * Used to retrieve component's properties and descriptions.
   */
  @Method()
  async getProps(): Promise<LfCheckboxPropsInterface> {
    const entries = LF_CHECKBOX_PROPS.map(
      (
        prop,
      ): [
        keyof LfCheckboxPropsInterface,
        LfCheckboxPropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }

  /**
   * Retrieves the current value of the checkbox.
   */
  @Method()
  async getValue(): Promise<LfCheckboxState> {
    return this.value;
  }

  /**
   * This method is used to trigger a new render of the component.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }

  /**
   * Sets the value of the checkbox.
   * @param {LfCheckboxState | boolean} value - The value to set (true, false, or null for indeterminate)
   */
  @Method()
  async setValue(value: LfCheckboxState | boolean): Promise<void> {
    if (value === true || value === "on") {
      this.value = "on";
    } else if (value === false || value === "off") {
      this.value = "off";
    } else {
      this.value = "indeterminate";
    }
  }

  /**
   * Initiates the unmount sequence, removing the component from the DOM after a delay.
   * @param {number} ms - Number of milliseconds to wait before unmounting
   */
  @Method()
  async unmount(ms: number = 0): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.#adapter.dispatcher.emit("unmount");
        this.rootElement.remove();
        resolve();
      }, ms);
    });
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
      eventType: LfCheckboxEvent,
      detail?: Partial<LfCheckboxEventPayload>,
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
        value: this.value,
        valueAsBoolean: this.value === "on",
        isIndeterminate: this.value === "indeterminate",
      });
    },
  });

  /**
   * Initializes the adapter with v4.0.0 architecture.
   *
   * Structure:
   * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
   * - controller.set: Simple setters (none for checkbox)
   * - controller.computed: Derived predicates (isChecked, isDisabled, isIndeterminate)
   * - controller.actions: Complex operations (toggle)
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
      // Setters - simple single-value assignments (none for checkbox)
      {},
      // Computed - derived predicates (from dedicated file)
      prepCheckboxComputed(getAdapter),
      // Actions - complex multi-step operations (from dedicated file)
      prepCheckboxActions(getAdapter),
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
    this.#initAdapter();

    if (this.lfValue) {
      this.value = "on";
    } else if (this.lfValue === null) {
      this.value = "indeterminate";
    } else {
      this.value = "off";
    }
  }

  componentDidLoad() {
    const { debug, effects, theme } = this.#framework;
    const { surface } = this.#adapter.elements.refs;

    const hasThemeRipple = theme.get.current().hasEffect("ripple");
    if (this.lfRipple && hasThemeRipple && surface) {
      effects.register.ripple(surface);
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
    const { theme } = this.#framework;
    const { lfLabel, lfLeadingLabel, lfStyle, lfUiState } = this;
    const { background, input, label } = this.#adapter.elements.jsx;
    const { isChecked, isDisabled, isIndeterminate } =
      this.#adapter.controller.computed;
    const { lfAttributes } = this.#adapter.controller.get;
    const { refs } = this.#adapter.elements;

    const { bemClass } = theme;
    const { formField, checkbox } = this.#b;
    const lf = lfAttributes();

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{theme.setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div
            class={bemClass(formField._, null, {
              leading: lfLeadingLabel,
            })}
            data-lf={lf[lfUiState]}
          >
            <div
              class={bemClass(checkbox._)}
              onClick={(e) => this.#adapter.handlers.checkbox.onChange(e)}
              onPointerDown={(e) =>
                this.#adapter.handlers.checkbox.onPointerDown(e)
              }
              ref={(el) => {
                if (refs) {
                  refs.surface = el;
                }
              }}
            >
              <div
                class={bemClass(checkbox._, checkbox.surface, {
                  checked: isChecked(),
                  indeterminate: isIndeterminate(),
                  disabled: isDisabled(),
                })}
                part={this.#p.checkbox}
              >
                {input()}
                {background()}
              </div>
            </div>
            {lfLabel && label()}
          </div>
        </div>
      </Host>
    );
  }

  disconnectedCallback() {
    const { effects, theme } = this.#framework ?? {};

    if (this.#adapter) {
      const { surface } = this.#adapter.elements.refs;

      const hasThemeRipple = theme?.get.current().hasEffect("ripple");
      if (effects && this.lfRipple && hasThemeRipple && surface) {
        effects.unregister.ripple(surface);
      }
    }

    theme?.unregister(this);
  }
  //#endregion
}
