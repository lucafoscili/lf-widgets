import {
  LF_PLACEHOLDER_BLOCKS,
  LF_PLACEHOLDER_IDS,
  LF_PLACEHOLDER_PARTS,
  LF_PLACEHOLDER_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfComponentName,
  LfComponentProps,
  LfComponentRootElement,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfPlaceholderAdapter,
  LfPlaceholderElement,
  LfPlaceholderEvent,
  LfPlaceholderEventPayload,
  LfPlaceholderInterface,
  LfPlaceholderPropsInterface,
  LfPlaceholderTrigger,
  LfThemeIcon,
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
import { prepPlaceholderActions } from "./actions.placeholder";
import { prepPlaceholderComputed } from "./computed.placeholder";
import { PlaceholderFC } from "./fc";
import { createAdapter } from "./lf-placeholder-adapter";

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
  #adapter: LfPlaceholderAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_PLACEHOLDER_BLOCKS;
  #ids = LF_PLACEHOLDER_IDS;
  #p = LF_PLACEHOLDER_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #intObserver: IntersectionObserver = null;
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
  //#endregion

  //#region Public methods
  /**
   * Returns the HTMLElement of the component to placeholder load.
   * @returns {LfGenericRootElement} Placeholder loaded component.
   */
  @Method()
  async getComponent(): Promise<LfComponentRootElement> {
    return this.#adapter?.elements.refs.component;
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
      this.#adapter.dispatcher.emit("unmount");
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
      eventType: LfPlaceholderEvent,
      detail?: Partial<LfPlaceholderEventPayload>,
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
      });
    },
  });
  /**
   * Initializes the adapter with v4.0.0 architecture.
   *
   * Structure:
   * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
   * - controller.computed: Derived predicates (shouldRender)
   * - controller.actions: Complex operations (triggerLoad)
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
      // Getters - base getters (via utility)
      createBaseGetters({
        blocks: () => this.#b,
        compInstance: () => this,
        framework: () => this.#framework,
        ids: () => this.#ids,
        parts: () => this.#p,
      }),
      // Computed - derived predicates (from dedicated file)
      prepPlaceholderComputed(getAdapter),
      // Actions - complex multi-step operations (from dedicated file)
      prepPlaceholderActions(getAdapter),
      // Adapter accessor
      getAdapter,
    );

    // Combine adapter parts with dispatcher
    this.#adapter = {
      ...adapterWithoutDispatcher,
      dispatcher: this.#createDispatcher(),
    };
  };
  #setObserver(): void {
    const { debug } = this.#framework;

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        const isHydrated = this.rootElement.hasAttribute("lf-hydrated");
        if (entry.isIntersecting && isHydrated) {
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
  connectedCallback() {
    if (this.#framework) {
      this.#framework.theme.register(this);
      this.#setObserver();
    }
  }
  async componentWillLoad() {
    this.#framework = await awaitFramework(this);
    this.#initAdapter();
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    this.#setObserver();
    this.#intObserver.observe(this.rootElement);
    this.#adapter.dispatcher.emit("ready");
    info.update(this, "did-load");
  }
  componentWillRender() {
    const { info } = this.#framework.debug;

    info.update(this, "will-render");
  }
  componentDidRender() {
    const { info } = this.#framework.debug;

    const { component } = this.#adapter.elements.refs;
    if (component && !this.#placeholderComponentLoaded) {
      this.#placeholderComponentLoaded = true;
      this.#adapter.dispatcher.emit("load");
    }
    info.update(this, "did-render");
  }
  render() {
    const { theme } = this.#framework;
    const { setLfStyle } = theme;

    const { lfStyle } = this;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <PlaceholderFC adapter={this.#adapter} />
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);
    this.#intObserver?.unobserve(this.rootElement);
  }
  //#endregion
}
