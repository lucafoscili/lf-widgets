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
import { createBaseGetters } from "../../utils/adapter";
import { awaitFramework } from "../../utils/setup";
import { prepHeaderActions } from "./actions.header";
import { prepHeaderComputed } from "./computed.header";
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
   * Initializes the adapter for the header component.
   *
   * v4.0.0 Architecture:
   * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
   * - controller.set: Empty for display-only component
   * - controller.computed: Empty for display-only component
   * - controller.actions: Empty for display-only component
   * - elements: JSX factories + refs
   * - dispatcher: Centralized event emission
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
      // Setters - empty for display-only component
      {},
      // Computed - empty for display-only component
      prepHeaderComputed(),
      // Actions - empty for display-only component
      prepHeaderActions(),
      // Adapter accessor
      getAdapter,
    );

    // Combine adapter parts with dispatcher
    this.#adapter = {
      ...adapterWithoutDispatcher,
      dispatcher: {
        emit: (eventType, detail) => {
          this.lfEvent.emit({
            comp: this,
            eventType,
            id: this.rootElement.id,
            originalEvent: detail?.originalEvent,
          });
        },
      },
    } as LfHeaderAdapter;
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
    const { header } = this.#adapter.elements.jsx;

    const { lfStyle } = this;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>{header()}</div>
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}
