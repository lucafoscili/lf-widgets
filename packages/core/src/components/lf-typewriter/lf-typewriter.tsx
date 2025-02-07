import { getLfFramework } from "@lf-widgets/framework";
import {
  LF_STYLE_ID,
  LF_TYPEWRITER_BLOCKS,
  LF_TYPEWRITER_PARTS,
  LF_TYPEWRITER_PROPS,
  LF_WRAPPER_ID,
  LfFrameworkInterface,
  LfDebugLifecycleInfo,
  LfThemeUISize,
  LfTypewriterCursor,
  LfTypewriterElement,
  LfTypewriterEvent,
  LfTypewriterEventPayload,
  LfTypewriterInterface,
  LfTypewriterPropsInterface,
  LfTypewriterTag,
  LfTypewriterValue,
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

/**
 * The typewriter component displays text with a typewriter effect.
 * The typewriter may display a single text or loop through an array of texts.
 *
 * @component
 * @tag lf-typewriter
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying text with a typewriter effect.
 *
 * @example
 * <lf-typewriter lfValue="Hello, World!"></lf-typewriter>
 *
 * @fires {CustomEvent} lf-typewriter-event - Emitted for various component events
 */
@Component({
  tag: "lf-typewriter",
  styleUrl: "lf-typewriter.scss",
  shadow: true,
})
export class LfTypewriter implements LfTypewriterInterface {
  /**
   * References the root HTML element of the component (<lf-typewriter>).
   */
  @Element() rootElement: LfTypewriterElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() displayedText = "";
  @State() isDeleting = false;
  @State() currentTextIndex = 0;
  //#endregion

  //#region Props
  /**
   * Sets the behavior of the blinking cursor.
   *
   * @type {LfTypewriterCursor}
   * @default "auto"
   * @mutable
   */
  @Prop({ mutable: true }) lfCursor: LfTypewriterCursor = "auto";
  /**
   * Sets the deleting speed in milliseconds.
   *
   * @type {number}
   * @default 50
   * @mutable
   */
  @Prop({ mutable: true }) lfDeleteSpeed: number = 50;
  /**
   * Enables or disables looping of the text.
   *
   * @type {boolean}
   * @default false
   * @mutable
   */
  @Prop({ mutable: true }) lfLoop: boolean = false;
  /**
   * Sets the duration of the pause after typing a complete text.
   *
   * @type {number}
   * @default 500
   * @mutable
   */
  @Prop({ mutable: true }) lfPause: number = 500;
  /**
   * Sets the typing speed in milliseconds.
   * @default 100
   */
  @Prop({ mutable: true }) lfSpeed = 50;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * The name of the HTML tag that will wrap the text.
   *
   * @type {LfTypewriterTag}
   * @default "p"
   * @mutable
   */
  @Prop({ mutable: true }) lfTag: LfTypewriterTag = "p";
  /**
   * The size of the component.
   *
   * @type {LfThemeUISizeKey}
   * @default "medium"
   * @mutable
   */
  @Prop({ mutable: true, reflect: true }) lfUiSize: LfThemeUISize = "medium";
  /**
   * Controls whether the component should update its text content.
   *
   * @type {boolean}
   * @default true
   * @mutable
   */
  @Prop({ mutable: true }) lfUpdatable: boolean = true;
  /**
   * Sets the text or array of texts to display with the typewriter effect.
   *
   * @type {LfTypewriterValue}
   * @default """
   * @mutable
   */
  @Prop({ mutable: true }) lfValue: LfTypewriterValue = "";
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_TYPEWRITER_BLOCKS;
  #p = LF_TYPEWRITER_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #timeout: NodeJS.Timeout;
  #texts: string[] = [];
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-typewriter-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfTypewriterEventPayload>;

  onLfEvent(e: Event | CustomEvent, eventType: LfTypewriterEvent) {
    this.lfEvent.emit({
      comp: this,
      id: this.rootElement.id,
      originalEvent: e,
      eventType,
    });
  }
  //#endregion

  //#region Watchers
  @Watch("lfValue")
  handleLfValueChange() {
    if (this.lfUpdatable) {
      this.#initializeTexts();
      this.#resetTyping();
    }
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
   * @returns {Promise<LfTypewriterPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfTypewriterPropsInterface> {
    const entries = LF_TYPEWRITER_PROPS.map(
      (
        prop,
      ): [
        keyof LfTypewriterPropsInterface,
        LfTypewriterPropsInterface[typeof prop],
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

  //#region Private methods
  #initializeTexts() {
    const { lfValue } = this;

    this.#texts = Array.isArray(lfValue) ? lfValue : [lfValue];
  }
  #startTyping() {
    const currentText = this.#texts[this.currentTextIndex] || "";

    if (this.isDeleting) {
      this.displayedText = currentText.substring(
        0,
        this.displayedText.length - 1,
      );
    } else {
      this.displayedText = currentText.substring(
        0,
        this.displayedText.length + 1,
      );
    }

    if (!this.isDeleting && this.displayedText === currentText) {
      this.#timeout = setTimeout(() => {
        if (this.lfLoop) this.isDeleting = true;
      }, this.lfPause);
    } else if (this.isDeleting && this.displayedText === "") {
      this.isDeleting = false;
      this.currentTextIndex = (this.currentTextIndex + 1) % this.#texts.length;
    } else {
      const delay = this.isDeleting ? this.lfDeleteSpeed : this.lfSpeed;
      this.#timeout = setTimeout(() => this.#startTyping(), delay);
    }
  }
  #resetTyping() {
    clearTimeout(this.#timeout);

    if (this.displayedText) {
      this.isDeleting = true;
      this.#deleteText(() => {
        this.#completeReset();
      });
    } else {
      this.#completeReset();
    }
  }
  #deleteText(callback: () => void) {
    if (this.displayedText.length > 0) {
      this.displayedText = this.displayedText.slice(0, -1);

      this.#timeout = setTimeout(() => {
        this.#deleteText(callback);
      }, this.lfDeleteSpeed);
    } else {
      callback();
    }
  }
  #completeReset() {
    this.isDeleting = false;
    this.currentTextIndex = 0;
    this.#startTyping();
  }
  #prepText() {
    const { bemClass } = this.#framework.theme;

    const { typewriter } = this.#b;
    const { currentTextIndex, displayedText, isDeleting, lfCursor, lfTag } =
      this;

    const shouldShowCursor =
      lfCursor === "enabled" ||
      (lfCursor === "auto" &&
        !isDeleting &&
        displayedText !== this.#texts[currentTextIndex]);

    const TagName = lfTag || "div";

    return (
      <div class={bemClass(typewriter._)} part={this.#p.typewriter}>
        <TagName
          class={bemClass(typewriter._, typewriter.text)}
          part={this.#p.text}
        >
          <span>{displayedText || "\u00A0"}</span>
          {shouldShowCursor && (
            <span
              class={bemClass(typewriter._, typewriter.cursor)}
              part={this.#p.cursor}
            ></span>
          )}
        </TagName>
      </div>
    );
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
  componentWillLoad() {
    this.#initializeTexts();
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    this.onLfEvent(new CustomEvent("ready"), "ready");
    requestAnimationFrame(async () => this.#startTyping());
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
    const { theme } = this.#framework;

    const { lfStyle } = this;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{theme.setLfStyle(this)}</style>}
        <div id={this.#w}>{this.#prepText()}</div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { theme } = this.#framework;

    theme.unregister(this);
    clearTimeout(this.#timeout);
  }
  //#endregion
}
