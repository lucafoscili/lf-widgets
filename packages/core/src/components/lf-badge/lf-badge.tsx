import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_BADGE_BLOCKS,
  LF_BADGE_IDS,
  LF_BADGE_PARTS,
  LF_BADGE_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfBadgeAdapter,
  LfBadgeElement,
  LfBadgeEventPayload,
  LfBadgeInterface,
  LfBadgePositions,
  LfBadgePropsInterface,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfImagePropsInterface,
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
import { awaitFramework } from "../../utils/setup";
import { computeBadgeStyles } from "./elements.badge";
import { createAdapter } from "./lf-badge-adapter";

/**
 * Simple component that displays a badge with an optional image and label.
 * The badge can be positioned in one of the four corners of its container.
 * Custom styling can be applied to the badge and its components.
 * The badge can be styled with a theme color and size.
 *
 * @component
 * @tag lf-badge
 * @shadow true
 *
 * @example
 * <lf-badge
 * lfImageProps={{ lfValue: "path/to/image.png" }}
 * lfLabel="New"
 * lfPosition="bottom-right"
 * lfStyle="#lf-component { background-color: red; }"
 * lfUiSize="small"
 * lfUiState="success"
 * ></lf-badge>
 *
 * @fires {CustomEvent} lf-badge-event - Emitted for various component events
 */
@Component({
  tag: "lf-badge",
  styleUrl: "lf-badge.scss",
  shadow: true,
})
export class LfBadge implements LfBadgeInterface {
  /**
   * References the root HTML element of the component (<lf-badge>).
   */
  @Element() rootElement: LfBadgeElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  //#endregion

  //#region Props
  /**
   * The props of the image displayed inside the badge.
   *
   * @type {LfImagePropsInterface}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-badge lfImageProps={{ lfValue: "path/to/image.png" }}></lf-badge>
   * ```
   */
  @Prop({ mutable: true }) lfImageProps: LfImagePropsInterface = null;
  /**
   * The label displayed inside the badge.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-badge lfLabel="New"></lf-badge>
   * ```
   */
  @Prop({ mutable: true }) lfLabel: string = "";
  /**
   * The position of the badge in relation of its container.
   *
   * @type {LfBadgePositions}
   * @default "top-left"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-badge lfPosition="bottom-right"></lf-badge>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfPosition: LfBadgePositions =
    "top-left";
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-badge lfStyle="color: red;"></lf-badge>
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * The size of the component.
   *
   * @type {LfThemeUISize}
   * @default "medium"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-badge lfUiSize="small"></lf-badge>
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
   * <lf-badge lfUiState="success"></lf-badge>
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #adapter: LfBadgeAdapter;
  #b = LF_BADGE_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #ids = LF_BADGE_IDS;
  #lf = LF_ATTRIBUTES;
  #p = LF_BADGE_PARTS;
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
    eventName: "lf-badge-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfBadgeEventPayload>;
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
   * @returns {Promise<LfBadgePropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfBadgePropsInterface> {
    const entries = LF_BADGE_PROPS.map(
      (
        prop,
      ): [keyof LfBadgePropsInterface, LfBadgePropsInterface[typeof prop]] => [
        prop,
        this[prop],
      ],
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
      this.#adapter.dispatcher.emit("unmount");
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
    this.#initAdapter();
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    this.#adapter.dispatcher.emit("ready");
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
    const { setLfStyle } = theme;
    const { lfPosition, lfStyle } = this;

    const { jsx } = this.#adapter.elements;

    return (
      <Host>
        <style id={this.#s}>
          {computeBadgeStyles(lfPosition, lfStyle, setLfStyle, this)}
        </style>
        <div id={this.#w} data-lf={this.#lf[this.lfUiState]}>
          {jsx.badge()}
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);
  }
  //#endregion

  //#region Private methods
  #initAdapter = () => {
    const adapterParts = createAdapter(
      // GET: Pure state reads (ALL must be functions)
      {
        // Base getters (v4.0.0 - ALL must be functions)
        blocks: () => this.#b,
        compInstance: () => this,
        cyAttributes: () => this.#cy,
        framework: () => this.#framework,
        ids: () => this.#ids,
        lfAttributes: () => this.#lf,
        parts: () => this.#p,
      },
      // SET: Simple single-value assignments (empty for badge)
      {},
      // COMPUTED: Derived values and predicates (empty for badge)
      {},
      // ACTIONS: Multi-step operations (empty for badge)
      {},
      () => this.#adapter,
    );

    // Add dispatcher for centralized event emission (v4.0.0)
    this.#adapter = {
      ...adapterParts,
      dispatcher: {
        emit: (eventType, detail) => {
          this.#framework?.debug?.logs.new(
            this,
            `Event: ${eventType}`,
            "informational",
          );
          this.lfEvent.emit({
            comp: this,
            eventType,
            id: this.rootElement.id,
            originalEvent: detail?.originalEvent,
          });
        },
      },
    };
  };
  //#endregion
}
