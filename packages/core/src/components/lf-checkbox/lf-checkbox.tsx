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
import { LfCheckboxFC } from "./fc";
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
  /**
   * "Adapter as Core" Pattern:
   * This is the ONLY @State in the component. It's a simple counter that gets
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

  /**
   * Bridge getter to satisfy LfCheckboxInterface.
   * Actual state lives in adapter - this just exposes it.
   * @deprecated Use adapter.controller.get.value() internally
   */
  get value(): LfCheckboxState {
    return this.#adapter?.controller.get.value() ?? "off";
  }
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
    return this.#adapter.controller.get.value();
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
    if (typeof value === "boolean") {
      value = value ? "on" : "off";
    } else if (value === null) {
      value = "indeterminate";
    }
    this.#adapter.controller.set.value(value);
  }

  /**
   * Initiates the unmount sequence, removing the component from the DOM after a delay.
   * @param {number} ms - Number of milliseconds to wait before unmounting
   */
  @Method()
  async unmount(ms: number = 0): Promise<void> {
    setTimeout(() => {
      const value = this.#adapter.controller.get.value();
      this.#adapter.dispatcher.emit("unmount", {
        value,
        valueAsBoolean: value === "on",
        isIndeterminate: value === "indeterminate",
      });
      this.rootElement.remove();
    }, ms);
  }
  //#endregion

  //#region Private methods
  /**
   * Creates the dispatcher for centralized event emission.
   * All component events route through this dispatcher.
   *
   * Note: Reads value from adapter state, not WC state.
   *
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

      const value = this.#adapter.controller.get.value();
      this.lfEvent.emit({
        comp: this,
        eventType,
        id: this.rootElement.id,
        originalEvent: detail?.originalEvent,
        value,
        valueAsBoolean: value === "on",
        isIndeterminate: value === "indeterminate",
      });
    },
  });

  /**
   * Initializes the adapter with "Adapter as Core" architecture.
   *
   * "Adapter as Core" Pattern:
   * - Adapter OWNS the runtime state (via closure variables)
   * - onStateChange callback increments _renderTick to trigger re-render
   * - WC is a thin shell: lifecycle + HTML interface + single render trigger
   *
   * Structure:
   * - controller.get: State reads (value) + base getters (blocks, compInstance, etc.)
   * - controller.set: State writes (value) → triggers onStateChange
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

    // onStateChange callback - increments _renderTick to trigger Stencil re-render
    const onStateChange = () => {
      this._renderTick++;
    };

    // Initial value from prop
    let initialValue: LfCheckboxState;
    if (this.lfValue === true) {
      initialValue = "on";
    } else if (this.lfValue === null) {
      initialValue = "indeterminate";
    } else {
      initialValue = "off";
    }

    const adapterWithoutDispatcher = createAdapter(
      // Base getters (via utility) - does NOT include value getter
      createBaseGetters({
        blocks: () => this.#b,
        compInstance: () => this,
        framework: () => this.#framework,
        ids: () => this.#ids,
        parts: () => this.#p,
      }),
      // Initial state value
      initialValue,
      // onStateChange callback
      onStateChange,
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
    // Note: Initial value is now set in createAdapter via initialValue parameter
  }

  componentDidLoad() {
    const { debug, effects, theme } = this.#framework;
    const { surface } = this.#adapter.elements.refs;

    const hasThemeRipple = theme.get.current().hasEffect("ripple");
    if (this.lfRipple && hasThemeRipple && surface) {
      effects.register.ripple(surface);
    }

    // Emit ready event via dispatcher
    const value = this.#adapter.controller.get.value();
    this.#adapter.dispatcher.emit("ready", {
      value,
      valueAsBoolean: value === "on",
      isIndeterminate: value === "indeterminate",
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

    const {
      lfAriaLabel,
      lfLabel,
      lfLeadingLabel,
      lfStyle,
      lfUiSize,
      lfUiState,
    } = this;
    const { computed } = this.#adapter.controller;
    const { refs } = this.#adapter.elements;

    const checked = computed.isChecked();
    const disabled = computed.isDisabled();
    const indeterminate = computed.isIndeterminate();

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{theme.setLfStyle(this)}</style>}
        <div id={this.#w}>
          <LfCheckboxFC
            ariaLabel={lfAriaLabel}
            checked={checked}
            disabled={disabled}
            framework={this.#framework}
            indeterminate={indeterminate}
            inputRef={(el) => {
              if (refs) refs.input = el;
            }}
            label={lfLabel}
            labelRef={(el) => {
              if (refs) refs.label = el;
            }}
            leadingLabel={lfLeadingLabel}
            onBlur={(e) =>
              this.#adapter.dispatcher.emit("blur", { originalEvent: e })
            }
            onChange={(newChecked, _newIndeterminate, e) => {
              // Toggle the value via adapter
              const newValue: LfCheckboxState = newChecked ? "on" : "off";
              this.#adapter.controller.set.value(newValue);
              this.#adapter.dispatcher.emit("change", { originalEvent: e });
            }}
            onFocus={(e) =>
              this.#adapter.dispatcher.emit("focus", { originalEvent: e })
            }
            onPointerDown={(e) =>
              this.#adapter.dispatcher.emit("pointerdown", { originalEvent: e })
            }
            surfaceRef={(el) => {
              if (refs) refs.surface = el;
            }}
            uiSize={lfUiSize}
            uiState={lfUiState}
          />
        </div>
      </Host>
    );
  }

  disconnectedCallback() {
    const { effects, theme } = this.#framework ?? {};
    const { surface } = this.#adapter?.elements.refs ?? {};

    const hasThemeRipple = theme?.get.current().hasEffect("ripple");
    if (effects && this.lfRipple && hasThemeRipple && surface) {
      effects.unregister.ripple(surface);
    }

    theme?.unregister(this);
  }
  //#endregion
}
