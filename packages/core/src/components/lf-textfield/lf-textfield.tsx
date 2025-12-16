import {
  LF_STYLE_ID,
  LF_TEXTFIELD_BLOCKS,
  LF_TEXTFIELD_IDS,
  LF_TEXTFIELD_PARTS,
  LF_TEXTFIELD_PROPS,
  LF_WRAPPER_ID,
  LfDebugLifecycleInfo,
  LfFrameworkAllowedKeysMap,
  LfFrameworkInterface,
  LfIconType,
  LfTextfieldAdapter,
  LfTextfieldElement,
  LfTextfieldEvent,
  LfTextfieldEventPayload,
  LfTextfieldFormatJSON,
  LfTextfieldHelper,
  LfTextfieldInterface,
  LfTextfieldModifiers,
  LfTextfieldPropsInterface,
  LfTextfieldStyling,
  LfTextfieldTrailingIconAction,
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
import { createAdapter } from "./lf-textfield-adapter";
/**
 * The text field may include an icon, label, helper text, and a character counter.
 *
 * @component
 * @tag lf-textfield
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying a text field with an icon, label, and helper text.
 *
 * @example
 * <lf-textfield lfLabel="Username" />
 *
 * @fires {CustomEvent} lf-textfield-event - Emitted for various component events
 */
@Component({
  tag: "lf-textfield",
  styleUrl: "lf-textfield.scss",
  shadow: true,
})
export class LfTextfield implements LfTextfieldInterface {
  /**
   * References the root HTML element of the component (<lf-textfield>).
   */
  @Element() rootElement: LfTextfieldElement;

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

  //#region Bridge getters (for interface compatibility)
  /**
   * Bridge getter to satisfy LfTextfieldInterface.
   * Actual state lives in adapter - this just exposes it.
   * @deprecated Use adapter.controller.get.value() internally
   */
  get value(): string {
    return this.#adapter?.controller.get.value() ?? "";
  }

  /**
   * Bridge getter to satisfy LfTextfieldInterface.
   * Actual state lives in adapter - this just exposes it.
   * @deprecated Use adapter.controller.get.status() internally
   */
  get status(): Set<LfTextfieldModifiers> {
    return this.#adapter?.controller.get.status() ?? new Set();
  }
  //#endregion

  //#region Props
  /**
   * When enabled, prevents propagation of common keyboard shortcuts
   * (e.g. Ctrl/Cmd + C, V, X, Z, Y, A) from the internal input or textarea
   * to parent components.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfCaptureShortcuts={false} />
   * ```
   */
  @Prop({ mutable: true }) lfCaptureShortcuts: boolean = true;
  /**
   * Automatically formats textarea content to prettier JSON structure.
   *
   * @type {LfTextfieldFormatJSON | null}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfFormatJSON={{ onBlur: false, onInput: 750 }} />
   * ```
   */
  @Prop({ mutable: true }) lfFormatJSON: LfTextfieldFormatJSON | null = null;
  /**
   * Sets the helper text for the text field.
   * The helper text can provide additional information or instructions to the user.
   *
   * @type {LfTextfieldHelper}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfHelper={{ value: "Please enter your message", showWhenFocused: true }} />
   * ```
   */
  @Prop({ mutable: true }) lfHelper: LfTextfieldHelper = null;
  /**
   * Allows customization of the input or textarea element through additional HTML attributes.
   * This can include attributes like 'readonly', 'placeholder', etc., to further customize the behavior or appearance of the input.
   *
   * @type {Partial<LfFrameworkAllowedKeysMap>}
   * @default undefined
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfHtmlAttributes={{ maxLength: 100 }} />
   * ```
   */
  @Prop({ mutable: true }) lfHtmlAttributes: Partial<LfFrameworkAllowedKeysMap>;
  /**
   * Sets the icon to be displayed within the text field.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfIcon="search" />
   * ```
   */
  @Prop({ mutable: true }) lfIcon: LfIconType | null = null;
  /**
   * Sets the label for the text field.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfLabel="Username" />
   * ```
   */
  @Prop({ mutable: true }) lfLabel: string = "";
  /**
   * Sets the text field to fill the available width of its container.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfStretchX={true} />
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfStretchX: boolean = false;
  /**
   * Sets the text field to fill the available height of its container.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfStretchY={true} />
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfStretchY: boolean = false;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfStyle="#lf-component { color: red; }" />
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * Sets the styling variant for the text field.
   *
   * @type {LfTextfieldStyling}
   * @default "raised"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfStyling="outlined" />
   * ```
   */
  @Prop({ mutable: true }) lfStyling: LfTextfieldStyling = "raised";
  /**
   * When enabled, the text field's icon will be displayed on the trailing side.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfIcon="search" lfTrailingIcon={true} />
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfTrailingIcon: boolean = false;
  /**
   * Sets a service icon to be displayed on the trailing side for additional actions.
   * This icon is not customizable by consumers and defaults to null (hidden).
   *
   * @type { LfTextfieldTrailingIconAction}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfTrailingIconAction="settings" />
   * ```
   */
  @Prop({ mutable: true }) lfTrailingIconAction: LfTextfieldTrailingIconAction =
    null;
  /**
   * The size of the component.
   *
   * @type {LfThemeUISizeKey}
   * @default "medium"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfUiSize="small" />
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
   * <lf-textfield lfUiState="error" />
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  /**
   * Sets the initial value of the text field.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfValue="initial value" />
   * ```
   */
  @Prop({ mutable: false }) lfValue: string = "";
  //#endregion

  //#region Internal variables
  #adapter: LfTextfieldAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_TEXTFIELD_BLOCKS;
  #ids = LF_TEXTFIELD_IDS;
  #p = LF_TEXTFIELD_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #debounceTimeout: NodeJS.Timeout;
  #formattingError = "";
  #hasOutline = false;
  #maxLength: number | undefined;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-textfield-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfTextfieldEventPayload>;
  //#endregion

  //#region Public methods
  /**
   * Formats the content of the textarea as JSON programmatically and on-demand.
   */
  @Method()
  async formatJSON(): Promise<void> {
    await this.#adapter.controller.actions.formatJSON();
  }
  /**
   * Fetches debug information of the component's current state.
   * @returns {Promise<LfDebugLifecycleInfo>} A promise that resolves with the debug information object.
   */
  @Method()
  async getDebugInfo(): Promise<LfDebugLifecycleInfo> {
    return this.debugInfo;
  }
  /**
   * Fetches the HTML element of the component.
   * @returns {Promise<HTMLTextAreaElement | HTMLInputElement>} A promise that resolves with the component's root HTML element.
   */
  @Method()
  async getElement(): Promise<HTMLTextAreaElement | HTMLInputElement> {
    return this.#adapter.elements.refs.input;
  }
  /**
   * Used to retrieve component's properties and descriptions.
   * @returns {Promise<LfTextfieldPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfTextfieldPropsInterface> {
    const entries = LF_TEXTFIELD_PROPS.map(
      (
        prop,
      ): [
        keyof LfTextfieldPropsInterface,
        LfTextfieldPropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Used to retrieve the component's current state.
   * @returns {Promise<string>} Promise resolved with the current state of the component.
   */
  @Method()
  async getValue(): Promise<string> {
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
   * Blurs the input element.
   */
  @Method()
  async setBlur(): Promise<void> {
    this.#adapter.controller.actions.blur();
  }
  /**
   * Focuses the input element.
   */
  @Method()
  async setFocus(): Promise<void> {
    this.#adapter.controller.actions.focus();
  }
  /**
   * Sets the component's state.
   * @param {string} value - The new state to be set on the component.
   * @returns {Promise<void>}
   */
  @Method()
  async setValue(value: string): Promise<void> {
    this.#adapter.controller.actions.updateState(value);
  }
  /**
   * Initiates the unmount sequence, which removes the component from the DOM after a delay.
   * @param {number} ms - Number of milliseconds
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
      eventType: LfTextfieldEvent,
      detail?: Partial<LfTextfieldEventPayload>,
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
        iconType: detail?.iconType,
        inputValue: detail?.inputValue,
        target: detail?.target ?? this.#adapter.elements.refs.input,
        value: this.value,
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
   * - controller.get: State reads (value, status) + base getters (blocks, compInstance, etc.)
   * - controller.set: State writes (value, status) → triggers onStateChange
   * - controller.computed: Derived predicates (isDisabled, isOutlined, isTextarea)
   * - controller.actions: Complex operations (focus, blur, updateState, formatJSON)
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
    const initialValue = this.lfValue ?? "";

    const adapterWithoutDispatcher = createAdapter(
      // Base getters (via utility) + component-specific reads (non-state)
      {
        ...createBaseGetters({
          blocks: () => this.#b,
          compInstance: () => this,
          framework: () => this.#framework,
          ids: () => this.#ids,
          parts: () => this.#p,
        }),
        styling: () => this.#normalizedStyling(),
        maxLength: () => this.#maxLength,
        formattingError: () => this.#formattingError,
        hasOutline: () => this.#hasOutline,
      },
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
  #normalizedStyling(): LfTextfieldStyling {
    return this.lfStyling
      ? (this.lfStyling.toLowerCase() as LfTextfieldStyling)
      : "raised";
  }
  #updateStatus = () => {
    const { isDisabled } = this.#adapter.controller.computed;
    const { value, status: getStatus } = this.#adapter.controller.get;
    const { status: setStatus } = this.#adapter.controller.set;
    const currentStatus = getStatus();
    const currentValue = value();

    const propertiesToUpdateStatus: {
      condition: () => boolean;
      status: LfTextfieldModifiers;
    }[] = [
      { condition: () => Boolean(currentValue), status: "filled" },
      { condition: () => isDisabled(), status: "disabled" },
      { condition: () => Boolean(this.lfStretchX), status: "full-width" },
      { condition: () => Boolean(this.lfIcon), status: "has-icon" },
      { condition: () => Boolean(this.lfLabel), status: "has-label" },
    ];

    propertiesToUpdateStatus.forEach(({ condition, status }) => {
      const shouldHave = condition();
      const has = currentStatus.has(status);
      if (shouldHave && !has) {
        setStatus(status, true);
      } else if (!shouldHave && has) {
        setStatus(status, false);
      }
    });
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

    // Initial value is now set in createAdapter via initialValue parameter
    // If there's a value, we need to format JSON if configured
    if (this.lfValue && this.lfFormatJSON) {
      await this.formatJSON();
    }
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    // Emit ready event via dispatcher
    this.#adapter.dispatcher.emit("ready", {
      value: this.value,
    });
    info.update(this, "did-load");
  }
  componentWillRender() {
    const { info } = this.#framework.debug;

    info.update(this, "will-render");
    this.#hasOutline = this.#adapter.controller.computed.isOutlined();
    this.#maxLength = this.lfHtmlAttributes?.maxLength;
    this.#updateStatus();
  }
  componentDidRender() {
    const { info } = this.#framework.debug;

    info.update(this, "did-render");
  }
  render() {
    const { theme } = this.#framework;
    const { bemClass, setLfStyle } = theme;

    const { lfStyle, lfStyling, status } = this;
    const {
      counter,
      helper,
      icon,
      iconAction,
      input,
      label,
      textarea,
      underline,
    } = this.#adapter.elements.jsx;
    const { isTextarea } = this.#adapter.controller.computed;
    const { lfAttributes } = this.#adapter.controller.get;

    const lf = lfAttributes();
    const modifiers: Record<string, boolean> = { [lfStyling]: true };
    status.forEach((status) => {
      modifiers[status] = true;
    });
    if (this.lfTrailingIconAction) {
      modifiers["has-actions"] = true;
    }

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div
            class={bemClass(this.#b.textfield._, null, modifiers)}
            data-lf={lf[this.lfUiState]}
            part={this.#p.textfield}
          >
            {isTextarea()
              ? [counter(), icon(), textarea(), iconAction()]
              : [icon(), input(), iconAction(), label(), underline()]}
          </div>
          {helper()}
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    try {
      clearTimeout(this.#debounceTimeout);
    } catch (e) {}
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}
