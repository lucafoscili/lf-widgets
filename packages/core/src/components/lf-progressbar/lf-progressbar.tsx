import {
  LF_ATTRIBUTES,
  LF_PROGRESSBAR_BLOCKS,
  LF_PROGRESSBAR_CSS_VARIABLES,
  LF_PROGRESSBAR_PARTS,
  LF_PROGRESSBAR_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfIconType,
  LfProgressbarElement,
  LfProgressbarEvent,
  LfProgressbarEventPayload,
  LfProgressbarInterface,
  LfProgressbarPropsInterface,
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
  VNode,
} from "@stencil/core";
import { FIcon } from "../../utils/icon";
import { awaitFramework } from "../../utils/setup";

/**
 * A progress bar component that displays the progress of a task or process.
 * The progress bar may be linear or radial, and may include a label or icon.
 * The progress bar may be animated and styled according to the theme.
 *
 * @component
 * @tag lf-progressbar
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying progress bars.
 *
 * @example
 * <lf-progressbar lfValue={75}></lf-progressbar>
 *
 * @fires {CustomEvent} lf-progressbar-event - Emitted for various component events
 */
@Component({
  tag: "lf-progressbar",
  styleUrl: "lf-progressbar.scss",
  shadow: true,
})
export class LfProgressbar implements LfProgressbarInterface {
  /**
   * References the root HTML element of the component (<lf-progressbar>).
   */
  @Element() rootElement: LfProgressbarElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  //#endregion

  //#region Props
  /**
   * Specifies whether the progress bar should display animated stripes.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-progressbar lfAnimated={true}></lf-progressbar>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfAnimated: boolean = false;
  /**
   * Displays the label in the middle of the progress bar.
   * It's the default for the radial variant and can't be changed.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-progressbar lfCenteredLabel={true}></lf-progressbar>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfCenteredLabel: boolean = false;
  /**
   * Specifies an icon to replace the label.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-progressbar lfIcon="loading"></lf-progressbar>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfIcon: string = "";
  /**
   * Radial version.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-progressbar lfIsRadial={true}></lf-progressbar>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfIsRadial: boolean = false;
  /**
   * Specifies a text for the bar's label.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-progressbar lfLabel="Loading..."></lf-progressbar>
   * ```
   */
  @Prop({ mutable: true }) lfLabel: string = "";
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-progressbar lfStyle="#lf-component { color: red; }"></lf-progressbar>
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
   * <lf-progressbar lfUiSize="small"></lf-progressbar>
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
   * <lf-progressbar lfUiState="secondary"></lf-progressbar>
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  /**
   * The current value the progress bar must display.
   *
   * @type {number}
   * @default 0
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-progressbar lfValue={75}></lf-progressbar>
   * ```
   */
  @Prop({ mutable: true }) lfValue: number = 0;
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_PROGRESSBAR_BLOCKS;
  #lf = LF_ATTRIBUTES;
  #p = LF_PROGRESSBAR_PARTS;
  #s = LF_STYLE_ID;
  #v = LF_PROGRESSBAR_CSS_VARIABLES;
  #w = LF_WRAPPER_ID;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-progressbar-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfProgressbarEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfProgressbarEvent) {
    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
    });
  }
  //#endregion

  //#region Public methods
  /**
   * Retrieves the debug information reflecting the current state of the component.
   * @returns {Promise<LfDebugLifecycleInfo>} A promise that resolves to a LfDebugLifecycleInfo object containing debug information.
   */
  @Method()
  async getDebugInfo(): Promise<LfDebugLifecycleInfo> {
    return this.debugInfo;
  }
  /**
   * Used to retrieve component's properties and descriptions.
   * @returns {Promise<LfProgressbarPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfProgressbarPropsInterface> {
    const entries = LF_PROGRESSBAR_PROPS.map(
      (
        prop,
      ): [
        keyof LfProgressbarPropsInterface,
        LfProgressbarPropsInterface[typeof prop],
      ] => [prop, this[prop]],
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
  #normalizePercent(value: number): number {
    if (
      typeof value !== "number" ||
      Number.isNaN(value) ||
      !Number.isFinite(value)
    ) {
      return 0;
    }
    if (value <= 0) {
      return 0;
    }
    if (value >= 100) {
      return 100;
    }
    return value;
  }

  #prepIcon() {
    const { bemClass } = this.#framework.theme;

    const { progressbar } = this.#b;
    const { lfIcon } = this;

    return (
      <div
        class={bemClass(progressbar._, progressbar.icon)}
        part={this.#p.icon}
      >
        <FIcon framework={this.#framework} icon={lfIcon as LfIconType} />
      </div>
    );
  }
  #prepLabel() {
    const { bemClass } = this.#framework.theme;

    const { progressbar } = this.#b;
    const { lfIcon, lfLabel, lfValue } = this;

    const label: VNode[] = lfLabel
      ? [
          <div
            class={bemClass(progressbar._, progressbar.text)}
            part={this.#p.text}
          >
            {lfLabel}
          </div>,
        ]
      : [
          <div
            class={bemClass(progressbar._, progressbar.text)}
            part={this.#p.text}
          >
            {lfValue}
          </div>,
          <div
            class={bemClass(progressbar._, progressbar.mu)}
            part={this.#p.mu}
          >
            %
          </div>,
        ];
    return (
      <div class={bemClass(progressbar._, progressbar.label)}>
        {lfIcon && this.#prepIcon()}
        {label}
      </div>
    );
  }
  #prepProgressBar() {
    const { bemClass } = this.#framework.theme;

    const { progressbar } = this.#b;

    return (
      <div
        class={bemClass(progressbar._)}
        data-lf={this.#lf[this.lfUiState]}
        part={this.#p.progressbar}
      >
        <div
          class={bemClass(progressbar._, progressbar.percentage)}
          part={this.#p.percentage}
        >
          {!this.lfCenteredLabel && this.#prepLabel()}
        </div>
        {this.lfCenteredLabel && this.#prepLabel()}
      </div>
    );
  }
  #prepRadialBar() {
    const { bemClass } = this.#framework.theme;

    const { pie, progressbar } = this.#b;

    return (
      <div
        class={bemClass(progressbar._)}
        data-lf={this.#lf[this.lfUiState]}
        part={this.#p.progressbar}
      >
        {this.#prepLabel()}
        <div
          class={bemClass(pie._, null, {
            empty: this.lfValue <= 50,
            full: this.lfValue > 50,
            "has-value": Boolean(this.lfValue),
          })}
        >
          <div
            class={bemClass(pie._, pie.halfCircle, {
              left: true,
            })}
          ></div>
          <div
            class={bemClass(pie._, pie.halfCircle, {
              right: true,
            })}
          ></div>
        </div>
        <div class={bemClass(pie._, pie.track)} part={this.#p.track}></div>
      </div>
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
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    this.onLfEvent(new CustomEvent("ready"), "ready");
    info.update(this, "did-load");
  }
  componentWillRender() {
    const { info } = this.#framework.debug;

    const sanitizedValue = this.#normalizePercent(this.lfValue);
    if (sanitizedValue !== this.lfValue) {
      this.lfValue = sanitizedValue;
    }

    info.update(this, "will-render");
  }
  componentDidRender() {
    const { info } = this.#framework.debug;

    info.update(this, "did-render");
  }
  render() {
    const { theme } = this.#framework;

    const { lfIsRadial, lfStyle, lfValue } = this;

    return (
      <Host>
        <style id={this.#s}>
          {`
                :host {
                  ${this.#v.transform}: rotate(${lfValue * 3.6}deg);
                  ${this.#v.width}: ${lfValue}%;
                }
                ${(lfStyle && theme.setLfStyle(this)) || ""}`}
        </style>
        <div id={this.#w}>
          {lfIsRadial ? this.#prepRadialBar() : this.#prepProgressBar()}
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}
