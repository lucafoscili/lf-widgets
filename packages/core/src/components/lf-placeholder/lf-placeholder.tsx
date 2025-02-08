import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_PLACEHOLDER_BLOCKS,
  LF_PLACEHOLDER_PARTS,
  LF_PLACEHOLDER_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfComponentName,
  LfComponentProps,
  LfComponentRootElement,
  LfComponentTag,
  LfDebugLifecycleInfo,
  LfEvent,
  LfFrameworkInterface,
  LfPlaceholderElement,
  LfPlaceholderEvent,
  LfPlaceholderEventPayload,
  LfPlaceholderInterface,
  LfPlaceholderPropsInterface,
  LfPlaceholderTrigger,
  LfThemeIcon,
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
  VNode,
} from "@stencil/core";

/**
 * Represents a placeholder loading component that renders a placeholder until the main component is loaded.
 *
 * @component
 * @tag lf-placeholder
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for placeholder loading components.
 *
 * @example
 * <lf-placeholder
 * lfProps={{ lfLabel: "My button" }}
 * lfValue="LfButton"></lf-placeholder>
 *
 * @fires {CustomEvent} lf-placeholder-event - Emitted for various component events
 */
@Component({
  tag: "lf-placeholder",
  styleUrl: "lf-placeholder.scss",
  shadow: true,
})
export class LfPlaceholder implements LfPlaceholderInterface {
  /**
   * References the root HTML element of the component (<lf-placeholder>).
   */
  @Element() rootElement: LfPlaceholderElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() isInViewport = false;
  //#endregion

  //#region Props
  /**
   * Displays an animated SVG placeholder until the component is loaded.
   *
   * @type {LfThemeIcon}
   * @default "template"
   *
   * @example
   * ```tsx
   * <lf-placeholder lfIcon="loading"></lf-placeholder>
   * ```
   */
  @Prop({ mutable: false }) lfIcon: LfThemeIcon = "template";
  /**
   * Sets the props of the component to be placeholder loaded.
   *
   * @type {LfComponentProps}
   * @default {}
   *
   * @example
   * ```tsx
   * <lf-placeholder lfProps={{ title: "My Card" }}></lf-placeholder>
   * ```
   */
  @Prop({ mutable: false }) lfProps: LfComponentProps = {};
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-placeholder lfStyle="#lf-component { color: red; }"></lf-placeholder>
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * Sets the threshold for the IntersectionObserver.
   *
   * @type {number}
   * @default 0.25
   *
   * @example
   * ```tsx
   * <lf-placeholder lfThreshold="0.5"></lf-placeholder>
   * ```
   */
  @Prop({ mutable: false }) lfThreshold: number = 0.25;
  /**
   * Decides when the sub-component should be rendered.
   * By default when both the component props exist and the component is in the viewport.
   *
   * @type {LfPlaceholderTrigger}
   * @default "both"
   *
   * @example
   * ```tsx
   * <lf-placeholder lfTrigger="viewport"></lf-placeholder>
   * ```
   */
  @Prop({ mutable: false }) lfTrigger: LfPlaceholderTrigger = "both";
  /**
   * Sets the tag name of the component to be placeholder loaded.
   *
   * @type {LfComponentName}
   * @default "LfCard"
   *
   * @example
   * ```tsx
   * <lf-placeholder lfValue="LfCard"></lf-placeholder>
   * ```
   */
  @Prop({ mutable: false }) lfValue: LfComponentName = "LfCard";
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_PLACEHOLDER_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_PLACEHOLDER_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #intObserver: IntersectionObserver = null;
  #placeholderComponent: LfComponentRootElement = null;
  #placeholderComponentLoaded = false;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-placeholder-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfPlaceholderEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfPlaceholderEvent) {
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
   * Returns the HTMLElement of the component to placeholder load.
   * @returns {LfGenericRootElement} Placeholder loaded component.
   */
  @Method()
  async getComponent(): Promise<LfComponentRootElement> {
    return this.#placeholderComponent;
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
   * Used to retrieve component's properties and descriptions.
   * @returns {Promise<LfPlaceholderPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfPlaceholderPropsInterface> {
    const entries = LF_PLACEHOLDER_PROPS.map(
      (
        prop,
      ): [
        keyof LfPlaceholderPropsInterface,
        LfPlaceholderPropsInterface[typeof prop],
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
  #setObserver(): void {
    const { debug } = this.#framework;

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          debug.logs.new(
            this,
            "lf-placeholder entering the viewport, rendering " +
              this.lfValue +
              ".",
          );
          this.isInViewport = true;
          this.#intObserver.unobserve(this.rootElement);
        }
      });
    };
    this.#intObserver = new IntersectionObserver(callback, {
      threshold: this.lfThreshold,
    });
  }
  //#endregion

  //#region Lifecycle hooks
  async connectedCallback() {
    if (!this.#framework) {
      this.#framework = await onFrameworkReady;
      this.debugInfo = this.#framework.debug.info.create();
    }
    this.#framework.theme.register(this);
    this.#setObserver();
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    this.#intObserver.observe(this.rootElement);
    this.onLfEvent(new CustomEvent("ready"), "ready");
    info.update(this, "did-load");
  }
  componentWillRender() {
    const { info } = this.#framework.debug;

    info.update(this, "will-render");
  }
  componentDidRender() {
    const { info } = this.#framework.debug;

    if (this.#placeholderComponent && !this.#placeholderComponentLoaded) {
      this.#placeholderComponentLoaded = true;
      this.onLfEvent(new CustomEvent("load"), "load");
    }
    info.update(this, "did-render");
  }
  render() {
    const { assets, sanitizeProps, theme } = this.#framework;
    const { bemClass, setLfStyle } = theme;

    const { placeholder } = this.#b;
    const { isInViewport, lfValue, lfProps, lfTrigger, lfIcon, lfStyle } = this;

    let content: VNode;

    const shouldRender = Boolean(
      (lfTrigger === "viewport" && isInViewport) ||
        (lfTrigger === "props" && lfProps) ||
        (lfTrigger === "both" && lfProps && isInViewport),
    );

    if (shouldRender) {
      const name = lfValue.toLowerCase().replace("lf", "");
      const evDispatcher = {
        [`onLf-${name}-event`]: (e: LfEvent) => {
          this.onLfEvent(e, "lf-event");
        },
      };
      const Tag = ("lf-" + name) as LfComponentTag<typeof lfValue>;
      content = (
        <Tag
          {...(sanitizeProps(lfProps, lfValue) as any)}
          {...evDispatcher}
          data-lf={LF_ATTRIBUTES.fadeIn}
          ref={(el: LfComponentRootElement) =>
            (this.#placeholderComponent = el)
          }
        ></Tag>
      );
    } else if (lfIcon) {
      const { style } = assets.get(`./assets/svg/${lfIcon}.svg`);
      content = (
        <div
          class={bemClass(placeholder._, placeholder.icon)}
          data-cy={this.#cy.maskedSvg}
          data-lf={this.#lf.fadeIn}
          part={this.#p.icon}
          style={style}
        ></div>
      );
    }

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div class={bemClass(placeholder._)} part={this.#p.placeholder}>
            {content}
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { theme } = this.#framework;

    theme.unregister(this);
    this.#intObserver?.unobserve(this.rootElement);
  }
  //#endregion
}
