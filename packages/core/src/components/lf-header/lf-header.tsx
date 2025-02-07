import { getLfFramework } from "@lf-widgets/framework";
import {
  LF_HEADER_BLOCKS,
  LF_HEADER_PARTS,
  LF_HEADER_PROPS,
  LF_HEADER_SLOT,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfFrameworkInterface,
  LfDebugLifecycleInfo,
  LfHeaderElement,
  LfHeaderEvent,
  LfHeaderEventPayload,
  LfHeaderInterface,
  LfHeaderPropsInterface,
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
 * Represents a header component that displays a title or logo at the top of the screen.
 * The header may contain a navigation menu, search bar, or other elements.
 * The content of the header is customizable through slots.
 *
 * @component
 * @tag lf-header
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying a header at the top of the screen.
 *
 * @example
 * <lf-header>
 *  <h1 slot="content">My Header</h1>
 * </lf-header>
 *
 * @fires {CustomEvent} lf-header-event - Emitted for various component events
 */
@Component({
  tag: "lf-header",
  styleUrl: "lf-header.scss",
  shadow: true,
})
export class LfHeader implements LfHeaderInterface {
  /**
   * References the root HTML element of the component (<lf-header>).
   */
  @Element() rootElement: LfHeaderElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  //#endregion

  //#region Props
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
  #b = LF_HEADER_BLOCKS;
  #p = LF_HEADER_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  //#endregion

  //#region
  @Event({
    eventName: "lf-header-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfHeaderEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfHeaderEvent) {
    this.lfEvent.emit({
      comp: this,
      id: this.rootElement.id,
      originalEvent: e,
      eventType,
    });
  }
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
   * @returns {Promise<LfHeaderPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfHeaderPropsInterface> {
    const entries = LF_HEADER_PROPS.map(
      (
        prop,
      ): [
        keyof LfHeaderPropsInterface,
        LfHeaderPropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }
  /**
   * This method is used to trigger a new render of the component.
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

    const { header } = this.#b;
    const { lfStyle } = this;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <header class={bemClass(header._)} part={this.#p.header}>
            <section
              class={bemClass(header._, header.section)}
              part={this.#p.section}
            >
              <slot name={LF_HEADER_SLOT}></slot>
            </section>
          </header>
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
