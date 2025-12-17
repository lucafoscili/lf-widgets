import {
  LF_HEADER_BLOCKS,
  LF_HEADER_IDS,
  LF_HEADER_PARTS,
  LF_HEADER_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfHeaderAdapter,
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
import { HeaderFC } from "./fc";
import { createBaseGetters } from "../../utils/adapter";
import { awaitFramework } from "../../utils/setup";
import { createAdapter } from "./lf-header-adapter";

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
  #adapter: LfHeaderAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_HEADER_BLOCKS;
  #ids = LF_HEADER_IDS;
  #p = LF_HEADER_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;

  /**
   * Callback to trigger re-render when adapter state changes.
   * "Adapter as Core" Pattern: increments _renderTick to signal Stencil.
   */
  #onStateChange = () => {
    this._renderTick++;
  };
  //#endregion

  //#region Events
  @Event({
    eventName: "lf-header-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfHeaderEventPayload>;
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
      this.#adapter.dispatcher.emit("unmount");
      this.rootElement.remove();
    }, ms);
  }
  //#endregion

  //#region Private methods
  /**
   * Creates the dispatcher for centralized event emission.
   * All component events route through this dispatcher.
   *
   * @see Section 5.5 of 4_0_0_REFACTORING.md
   */
  #createDispatcher = () => ({
    emit: (
      eventType: LfHeaderEvent,
      detail?: Partial<LfHeaderEventPayload>,
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
   * Initializes the adapter with "Adapter as Core" architecture.
   *
   * "Adapter as Core" Pattern:
   * - Adapter OWNS the runtime state (via closure variables)
   * - onStateChange callback increments _renderTick to trigger re-render
   * - WC is a thin shell: lifecycle + HTML interface + single render trigger
   *
   * Structure:
   * - controller.get: Base getters (blocks, compInstance, framework, etc.)
   * - controller.set: State writes → triggers onStateChange
   * - controller.computed: Derived predicates
   * - controller.actions: Complex operations
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
      // onStateChange callback
      this.#onStateChange,
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

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <HeaderFC adapter={this.#adapter} />
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}
