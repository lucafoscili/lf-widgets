import {
  LF_SPLASH_BLOCKS,
  LF_SPLASH_IDS,
  LF_SPLASH_PARTS,
  LF_SPLASH_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfSplashAdapter,
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
import { createBaseGetters } from "../../utils/adapter";
import { awaitFramework } from "../../utils/setup";
import { prepSplashActions } from "./actions.splash";
import { prepSplashComputed } from "./computed.splash";
import { createAdapter } from "./lf-splash-adapter";

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
  #adapter: LfSplashAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_SPLASH_BLOCKS;
  #ids = LF_SPLASH_IDS;
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
        this.#adapter.dispatcher.emit("unmount");
        this.rootElement.remove();
      }, 300);
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
      eventType: LfSplashEvent,
      detail?: Partial<LfSplashEventPayload>,
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
   * - controller.computed: Derived predicates (isUnmounting)
   * - controller.actions: Complex operations (none for this simple component)
   * - elements: JSX factories + refs
   * - dispatcher: Centralized event emission
   * - handlers: Event callbacks (none for this simple component)
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
      prepSplashComputed(getAdapter),
      // Actions - complex multi-step operations (from dedicated file)
      prepSplashActions(getAdapter),
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
    const { setLfStyle } = this.#framework.theme;

    const { lfStyle } = this;
    const { splash } = this.#adapter.elements.jsx;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>{splash()}</div>
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}
