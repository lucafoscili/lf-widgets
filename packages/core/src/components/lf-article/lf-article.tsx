import {
  LF_ARTICLE_BLOCKS,
  LF_ARTICLE_IDS,
  LF_ARTICLE_PARTS,
  LF_ARTICLE_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfArticleAdapter,
  LfArticleDataset,
  LfArticleElement,
  LfArticleEvent,
  LfArticleEventPayload,
  LfArticleInterface,
  LfArticlePropsInterface,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfThemeUISize,
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
import { createAdapter } from "./lf-article-adapter";

/**
 * Represents an article-style component that displays structured content
 * with headings, paragraphs, and other HTML elements. Implements methods
 * for managing state, retrieving component properties, handling user
 * interactions, and unmounting the component.
 *
 * @component
 * @tag lf-article
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying articles with structured content.
 *
 * @example
 * <lf-article
 *  lfDataset={{
 *   nodes: [
 *    { value: "Article 1", children: [ { value: "Section 1", children: [ { value: "Paragraph 1" } ] } ] }
 *  ]
 * }}
 * ></lf-article>
 *
 * @fires {CustomEvent} lf-article-event - Emitted for various component events
 */
@Component({
  tag: "lf-article",
  styleUrl: "lf-article.scss",
  shadow: true,
})
export class LfArticle implements LfArticleInterface {
  /**
   * References the root HTML element of the component (<lf-article>).
   */
  @Element() rootElement: LfArticleElement;

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
   * The data set for the LF Article component.
   * This property is mutable, meaning it can be changed after the component is initialized.
   *
   * @type {LfArticleDataset}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-article lfDataset={{ nodes: [ { value: "Article 1", children: [ { value: "Section 1", children: [ { value: "Paragraph 1" } ] } ] } ] }} />
   * ```
   */
  @Prop({ mutable: true }) lfDataset: LfArticleDataset = null;
  /**
   * Empty text displayed when there is no data.
   *
   * @type {string}
   * @default "Empty data."
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-article lfEmpty="No content available" />
   * ```
   */
  @Prop({ mutable: true }) lfEmpty: string = "Empty data.";
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-article lfStyle=".article { color: blue; }" />
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
   * <lf-article lfUiSize="large" />
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfUiSize: LfThemeUISize = "medium";
  //#endregion

  //#region Internal variables
  #adapter: LfArticleAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_ARTICLE_BLOCKS;
  #ids = LF_ARTICLE_IDS;
  #p = LF_ARTICLE_PARTS;
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
    eventName: "lf-article-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfArticleEventPayload>;
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
   * @returns {Promise<LfArticlePropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfArticlePropsInterface> {
    const entries = LF_ARTICLE_PROPS.map(
      (
        prop,
      ): [
        keyof LfArticlePropsInterface,
        LfArticlePropsInterface[typeof prop],
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
      eventType: LfArticleEvent,
      detail?: Partial<LfArticleEventPayload>,
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
   * - controller.get: State reads + base getters (blocks, compInstance, framework, etc.)
   * - controller.set: State writes → triggers onStateChange
   * - controller.computed: Derived predicates (hasNodes)
   * - controller.actions: Complex operations (none for this component)
   * - elements: JSX factories + refs
   * - dispatcher: Centralized event emission
   * - handlers: Event callbacks for LfShape events
   *
   * @see Section 5 of 4_0_0_REFACTORING.md
   */
  #initAdapter = () => {
    // Adapter accessor - shared by all factories
    const getAdapter = () => this.#adapter;

    // onStateChange callback - increments _renderTick to trigger Stencil re-render
    const onStateChange = () => {
      this._renderTick++;
    };

    const adapterWithoutDispatcher = createAdapter(
      // Base getters (via utility)
      createBaseGetters({
        blocks: () => this.#b,
        compInstance: () => this,
        framework: () => this.#framework,
        ids: () => this.#ids,
        parts: () => this.#p,
      }),
      // onStateChange callback
      onStateChange,
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
    const { theme } = this.#framework;
    const { setLfStyle } = theme;

    const { lfStyle } = this;
    const { article } = this.#adapter.elements.jsx;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>{article()}</div>
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}
