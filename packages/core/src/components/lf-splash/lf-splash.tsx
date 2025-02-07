import { getLfFramework } from "@lf-widgets/framework";
import {
  LF_SPLASH_BLOCKS,
  LF_SPLASH_PARTS,
  LF_SPLASH_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfFrameworkInterface,
  LfDebugLifecycleInfo,
  LfSplashElement,
  LfSplashEvent,
  LfSplashEventPayload,
  LfSplashInterface,
  LfSplashPropsInterface,
  LfSplashStates,
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

/**
 * The splash component is designed to be displayed during the initial loading of a page or application.
 * The splash screen may include a logo, text, or other elements to provide a branded loading experience.
 *
 * @component
 * @tag lf-splash
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying a splash screen during the initial loading of a page or application.
 *
 * @example
 * <lf-splash lfLabel="Loading..."></lf-splash>
 *
 * @fires {CustomEvent} lf-splash-event - Emitted for various component events
 */
@Component({
  tag: "lf-splash",
  styleUrl: "lf-splash.scss",
  shadow: true,
})
export class LfSplash implements LfSplashInterface {
  /**
   * References the root HTML element of the component (<lf-splash>).
   */
  @Element() rootElement: LfSplashElement;

  //#region States
  /**
   * Debug information state property created through LFManager debug utility.
   * Used to store and manage debug-related information for the accordion component.
   * @remarks This state property is initialized using the debug.info.create() method from the lfFramework instance.
   */
  @State() debugInfo: LfDebugLifecycleInfo;
  /**
   * The status of the component.
   * @default ""
   */
  @State() state: LfSplashStates = "initializing";
  //#endregion

  //#region Props
  /**
   * Initial text displayed within the component, typically shown during loading.
   *
   * @type {string}
   * @default "Loading..."
   * @mutable
   */
  @Prop({ mutable: true }) lfLabel: string = "Loading...";
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_SPLASH_BLOCKS;
  #p = LF_SPLASH_PARTS;
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
    eventName: "lf-splash-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfSplashEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfSplashEvent) {
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
   * @returns {Promise<LfSplashPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfSplashPropsInterface> {
    const entries = LF_SPLASH_PROPS.map(
      (
        prop,
      ): [
        keyof LfSplashPropsInterface,
        LfSplashPropsInterface[typeof prop],
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
  async unmount(ms: number = 575): Promise<void> {
    setTimeout(() => {
      this.state = "unmounting";
      setTimeout(() => {
        this.onLfEvent(new CustomEvent("unmount"), "unmount");
        this.rootElement.remove();
      }, 300);
    }, ms);
  }
  //#endregion

  //#region Lifecycle hooks
  connectedCallback() {
    if (!this.#framework) {
      this.#framework = getLfFramework();
      this.debugInfo = this.#framework.debug.info.create();
    }
    this.#framework.theme.register(this);
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
    const { bemClass, setLfStyle } = this.#framework.theme;

    const { lfLabel, lfStyle, state } = this;
    const isUnmounting = state === "unmounting";

    const { splash } = this.#b;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div
            class={bemClass(splash._, null, {
              active: isUnmounting,
            })}
            part={this.#p.splash}
          >
            <div
              class={bemClass(splash._, splash.content)}
              part={this.#p.content}
            >
              <div
                class={bemClass(splash._, splash.widget)}
                part={this.#p.widget}
              >
                <slot></slot>
              </div>
              <div
                class={bemClass(splash._, splash.label)}
                part={this.#p.label}
              >
                {isUnmounting ? "Ready!" : lfLabel}
              </div>
            </div>
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { theme } = this.#framework;

    theme.unregister(this);
  }
  //#endregion
}
