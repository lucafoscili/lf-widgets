import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_CODE_BLOCKS,
  LF_CODE_PARTS,
  LF_CODE_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfCodeElement,
  LfCodeEvent,
  LfCodeEventPayload,
  LfCodeInterface,
  LfCodePropsInterface,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfThemeUISize,
  LfThemeUIState,
  onFrameworkReady,
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
import Prism from "prismjs";
import { LF_CODE_CSS } from "./prism.css.highlight";
import { LF_CODE_JAVASCRIPT } from "./prism.javascript.highlight";
import { LF_CODE_JSON } from "./prism.json.highlight";
import { LF_CODE_JSX } from "./prism.jsx.highlight.js";
import { LF_CODE_MARKDOWN } from "./prism.markdown.highlight";
import { LF_CODE_MARKUP } from "./prism.markup.highlight";
import { LF_CODE_PYTHON } from "./prism.python.highlight";
import { LF_CODE_REGEX } from "./prism.regex.highlight";
import { LF_CODE_SCSS } from "./prism.scss.highlight";
import { LF_CODE_TSX } from "./prism.tsx.highlight";
import { LF_CODE_TYPESCRIPT } from "./prism.typescript.highlight";

/**
 * The code component displays a snippet of code in a styled container with
 * syntax highlighting. The component supports various languages and provides
 * options for formatting, preserving spaces, and showing a copy button.
 *
 * @component
 * @tag lf-code
 * @shadow true
 *
 * @remarks
 * This component uses the Prism.js library to provide syntax highlighting for
 * code snippets. The component supports various languages and provides options
 * for formatting, preserving spaces, and showing a copy button.
 *
 * @example
 * <lf-code
 * lfFormat={true}
 * lfLanguage="javascript"
 * lfPreserveSpaces={true}
 * ></lf-code>
 *
 * @fires {CustomEvent} lf-code-event - Emitted for various component events
 */
@Component({
  tag: "lf-code",
  styleUrl: "lf-code.scss",
  shadow: true,
})
export class LfCode implements LfCodeInterface {
  /**
   * References the root HTML element of the component (<lf-code>).
   */
  @Element() rootElement: LfCodeElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() value = "";
  //#endregion

  //#region Props
  /**
   * Automatically formats the value.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-code lfFormat={true} />
   * ```
   */
  @Prop({ mutable: true }) lfFormat: boolean = true;
  /**
   * Sets the language of the snippet.
   *
   * @type {string}
   * @default "javascript"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-code lfLanguage="javascript" />
   * ```
   */
  @Prop({ mutable: true }) lfLanguage: string = "javascript";
  /**
   * Whether to preserve spaces or not. When missing it is set automatically.
   *
   * @type {boolean}
   * @default undefined
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-code lfPreserveSpaces={true} />
   * ```
   */
  @Prop({ mutable: true }) lfPreserveSpaces: boolean;
  /**
   * Whether to show the copy button or not.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-code lfShowCopy={true} />
   * ```
   */
  @Prop({ mutable: true }) lfShowCopy: boolean = true;
  /**
   * Whether to show the header or not.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-code lfShowHeader={true} />
   * ```
   */
  @Prop({ mutable: true }) lfShowHeader: boolean = true;
  /**
   * Determines whether the header is sticky or not.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-code lfStickyHeader={true} />
   * ```
   */
  @Prop({ mutable: true }) lfStickyHeader: boolean = true;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-code lfStyle="#lf-component { color: red; }" />
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
   * <lf-code lfUiSize="small" />
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
   * <lf-code lfUiState="success" />
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  /**
   * String containing the snippet of code to display.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-code lfValue="const hello = 'world';" />
   * ```
   */
  @Prop({ mutable: true }) lfValue: string = "";
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_CODE_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_CODE_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #el: HTMLPreElement | HTMLDivElement;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-code-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfCodeEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfCodeEvent) {
    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
    });
  }
  //#endregion

  //#region Watchers
  @Watch("lfLanguage")
  loadLanguage() {
    switch (this.lfLanguage.toLowerCase()) {
      case "css":
        LF_CODE_CSS(Prism);
        break;
      case "javascript":
        LF_CODE_JAVASCRIPT(Prism);
        break;
      case "json":
        LF_CODE_JSON(Prism);
        break;
      case "jsx":
        LF_CODE_JSX(Prism);
        break;
      case "markdown":
        LF_CODE_MARKDOWN(Prism);
        break;
      case "markup":
        LF_CODE_MARKUP(Prism);
        break;
      case "python":
        LF_CODE_PYTHON(Prism);
        break;
      case "regex":
        LF_CODE_REGEX(Prism);
        break;
      case "scss":
        LF_CODE_SCSS(Prism);
        break;
      case "tsx":
        LF_CODE_TSX(Prism);
        break;
      default:
      case "typescript":
        LF_CODE_TYPESCRIPT(Prism);
        break;
    }
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
   * @returns {Promise<LfCodePropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfCodePropsInterface> {
    const entries = LF_CODE_PROPS.map(
      (
        prop,
      ): [keyof LfCodePropsInterface, LfCodePropsInterface[typeof prop]] => [
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
  #onFrameworkReady = async () => {
    this.#framework = await onFrameworkReady;
    this.debugInfo = this.#framework.debug.info.create();
    this.#framework.theme.register(this);
  };
  #format(value: string) {
    const { stringify } = this.#framework.data.cell;

    if (typeof value === "string" && /^[\{\}]\s*$/i.test(value)) {
      return value.trim();
    } else if (this.#isJson(value)) {
      const parsed = JSON.parse(value);
      return JSON.stringify(parsed, null, 2);
    } else {
      return stringify(value);
    }
  }
  #isObjectLike(
    obj: unknown,
  ): obj is Record<string | number | symbol, unknown> {
    return typeof obj === "object" && obj !== null;
  }
  #isDictionary(
    obj: unknown,
  ): obj is Record<string | number | symbol, unknown> {
    return (
      this.#isObjectLike(obj) &&
      Object.values(obj).every((value) => value != null)
    );
  }
  #isJson(value: string | Record<string, unknown>) {
    return (
      this.lfLanguage?.toLowerCase() === "json" || this.#isDictionary(value)
    );
  }
  #updateValue() {
    const { lfFormat, lfValue } = this;

    this.value = lfFormat ? this.#format(lfValue) : lfValue;
  }
  #prepHeader() {
    const { bemClass, get } = this.#framework.theme;
    const {
      "--lf-icon-copy": copy,
      "--lf-icon-copy-ok": copyOk,
      "--lf-icon-warning": warning,
    } = get.current().variables;

    const { code } = this.#b;
    const { lfLanguage, lfShowCopy, lfValue } = this;

    return (
      <div
        class={bemClass(code._, code.header, {
          sticky: this.lfStickyHeader,
        })}
        data-lf={this.#lf[this.lfUiState]}
        part={this.#p.header}
      >
        <span class={bemClass(code._, code.title)} part={this.#p.title}>
          {lfLanguage}
        </span>
        {lfShowCopy && (
          <lf-button
            data-cy={this.#cy.button}
            lfIcon={copy}
            lfLabel="Copy"
            lfStretchY={true}
            lfStyling="flat"
            lfUiSize={this.lfUiSize}
            lfUiState={this.lfUiState}
            onLf-button-event={(e) => {
              const { comp, eventType } = e.detail;
              switch (eventType) {
                case "click":
                  try {
                    navigator.clipboard.writeText(lfValue);
                    comp.setMessage("Copied!", copyOk);
                  } catch (error) {
                    comp.setMessage("Failed...", warning);
                  }

                  break;
              }
            }}
            part={this.#p.copy}
          ></lf-button>
        )}
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
    await this.#onFrameworkReady();
    this.loadLanguage();
    this.#updateValue();
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    this.onLfEvent(new CustomEvent("ready"), "ready");
    info.update(this, "did-load");
  }
  componentWillUpdate() {
    this.value = this.#format(this.lfValue);
  }
  componentWillRender() {
    const { info } = this.#framework.debug;

    info.update(this, "will-render");
  }
  componentDidRender() {
    const { info } = this.#framework.debug;

    if (this.#el) {
      Prism.highlightElement(this.#el);
    }

    info.update(this, "did-render");
  }
  render() {
    const { bemClass, setLfStyle } = this.#framework.theme;

    const { code } = this.#b;
    const { lfLanguage, lfPreserveSpaces, lfStyle } = this;

    const isPreserveSpaceMissing = !!(
      lfPreserveSpaces !== true && lfPreserveSpaces !== false
    );
    const lowerCaseLanguage = lfLanguage.toLowerCase();
    const isLikelyTextual =
      lowerCaseLanguage === "css" ||
      lowerCaseLanguage === "doc" ||
      lowerCaseLanguage === "markdown" ||
      lowerCaseLanguage === "plaintext" ||
      lowerCaseLanguage === "text" ||
      lowerCaseLanguage === "";
    const shouldPreserveSpace =
      lfPreserveSpaces || (isPreserveSpaceMissing && !isLikelyTextual);
    const TagName = shouldPreserveSpace ? "pre" : "div";

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div
            class={bemClass(code._, null, { "has-header": this.lfShowHeader })}
            part={this.#p.code}
          >
            {this.lfShowHeader && this.#prepHeader()}
            <TagName
              class={`language-${lfLanguage} ${shouldPreserveSpace ? "" : "body"}`}
              data-lf={this.#lf.fadeIn}
              key={this.value}
              part={this.#p.prism}
              ref={(el) => {
                if (el) {
                  this.#el = el;
                }
              }}
            >
              {shouldPreserveSpace ? <code>{this.value}</code> : this.value}
            </TagName>
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}
