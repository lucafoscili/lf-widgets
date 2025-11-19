import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_AUTOCOMPLETE_BLOCKS,
  LF_AUTOCOMPLETE_PARTS,
  LF_AUTOCOMPLETE_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfAutocompleteAdapter,
  LfAutocompleteCache,
  LfAutocompleteElement,
  LfAutocompleteEvent,
  LfAutocompleteEventPayload,
  LfAutocompleteInterface,
  LfDataDataset,
  LfDataNode,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfListInterface,
  LfSpinnerInterface,
  LfTextfieldInterface,
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
  Watch,
} from "@stencil/core";
import { awaitFramework } from "../../utils/setup";
import { createAdapter } from "./lf-autocomplete-adapter";

/**
 * The autocomplete component provides an input field with dynamic, server-fetched suggestions.
 * It displays results in a dropdown list and debounces user input to optimize API requests.
 *
 * @component
 * @tag lf-autocomplete
 * @shadow true
 *
 * @remarks
 * Unlike lf-select (which uses static datasets), autocomplete always fetches data dynamically
 * from the server based on user input. It debounces requests, shows a loading indicator,
 * and only triggers requests after a minimum number of characters are typed.
 *
 * @example
 * <lf-autocomplete lfMinChars={3} lfDebounceMs={300} lfDataset={results} />
 *
 * @fires {CustomEvent} lf-autocomplete-event - Emitted for input, request, select, and other events
 */
@Component({
  tag: "lf-autocomplete",
  styleUrl: "lf-autocomplete.scss",
  shadow: true,
})
export class LfAutocomplete implements LfAutocompleteInterface {
  /**
   * References the root HTML element of the component (<lf-autocomplete>).
   */
  @Element() rootElement: LfAutocompleteElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() highlightedIndex: number = -1;
  @State() loading: boolean = false;
  @State() inputValue: string = "";
  @State() lastRequestedQuery: string = "";
  //#endregion

  //#region Props
  /**
   * Allows input of values that are not present in the dataset.
   * When true, users can type and submit any value. When false, only values from the dataset can be selected.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-autocomplete lfAllowFreeInput={false} />
   * ```
   */
  @Prop({ mutable: true }) lfAllowFreeInput: boolean = true;
  /**
   * Enables caching of autocomplete results.
   * When enabled, previously fetched results are stored and reused for identical queries.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-autocomplete lfCache={true} />
   * ```
   */
  @Prop({ mutable: true }) lfCache: boolean = false;
  /**
   * Sets the time-to-live for cached entries in milliseconds.
   * Cached entries older than this will be considered expired.
   *
   * @type {number}
   * @default 300000 (5 minutes)
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-autocomplete lfCacheTTL={600000} />
   * ```
   */
  @Prop({ mutable: true }) lfCacheTTL: number = 300000;
  /**
   * Sets the dataset containing the autocomplete suggestions.
   * This is typically updated dynamically in response to request events.
   *
   * @type {LfDataDataset}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-autocomplete lfDataset={{ nodes: [{ id: "1", value: "Result 1" }] }} />
   * ```
   */
  @Prop({ mutable: true }) lfDataset: LfDataDataset = null;
  /**
   * Sets the debounce delay in milliseconds before triggering a request event.
   *
   * @type {number}
   * @default 300
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-autocomplete lfDebounceMs={500} />
   * ```
   */
  @Prop({ mutable: true }) lfDebounceMs: number = 300;
  /**
   * Sets the props for the internal lf-list component.
   *
   * @type {Partial<LfListInterface>}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-autocomplete lfListProps={{ lfUiSize: "small" }} />
   * ```
   */
  @Prop({ mutable: true }) lfListProps: Partial<LfListInterface> = null;
  /**
   * Sets the maximum number of entries in the cache.
   * When exceeded, oldest entries are evicted (FIFO).
   *
   * @type {number}
   * @default 100
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-autocomplete lfMaxCacheSize={50} />
   * ```
   */
  @Prop({ mutable: true }) lfMaxCacheSize: number = 100;
  /**
   * Sets the minimum number of characters required before triggering a request.
   *
   * @type {number}
   * @default 3
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-autocomplete lfMinChars={2} />
   * ```
   */
  @Prop({ mutable: true }) lfMinChars: number = 3;
  /**
   * Enables keyboard navigation with arrow keys.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-autocomplete lfNavigation={false} />
   * ```
   */
  @Prop({ mutable: true }) lfNavigation: boolean = true;
  /**
   * Sets the props for the internal lf-spinner component.
   *
   * @type {Partial<LfSpinnerInterface>}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-autocomplete lfSpinnerProps={{ lfUiSize: "small" }} />
   * ```
   */
  @Prop({ mutable: true }) lfSpinnerProps: Partial<LfSpinnerInterface> = null;
  /**
   * Custom CSS styles to apply to the component.
   *
   * @type {string}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-autocomplete lfStyle="color: red;" />
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = null;
  /**
   * Sets the props for the internal lf-textfield component.
   *
   * @type {Partial<LfTextfieldInterface>}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-autocomplete lfTextfieldProps={{ lfLabel: "Search..." }} />
   * ```
   */
  @Prop({ mutable: true }) lfTextfieldProps: Partial<LfTextfieldInterface> =
    null;
  /**
   * Sets the UI size of the autocomplete field.
   *
   * @type {LfThemeUISize}
   * @default "medium"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-autocomplete lfUiSize="small" />
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfUiSize: LfThemeUISize = "medium";
  /**
   * Sets the UI state (primary, secondary, disabled, etc.).
   *
   * @type {LfThemeUIState}
   * @default "primary"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-autocomplete lfUiState="disabled" />
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  /**
   * Sets the initial value of the input field.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-autocomplete lfValue="initial text" />
   * ```
   */
  @Prop({ mutable: true }) lfValue: string = "";
  //#endregion

  //#region Watchers
  @Watch("lfDataset")
  async onLfDatasetChange() {
    this.#adapter.controller.set.dataset(this.lfDataset);
  }
  @Watch("loading")
  onLoadingChange(newValue: boolean) {
    if (newValue && this.#adapter) {
      const { dropdown } = this.#adapter.elements.refs;
      if (dropdown && !this.#framework.portal.isInPortal(dropdown)) {
        this.#adapter.controller.set.list("open");
      }
    }
  }
  //#endregion

  //#region Internal variables
  #adapter: LfAutocompleteAdapter;
  #blurTimeout: NodeJS.Timeout | null = null;
  #cache: LfAutocompleteCache = new Map();
  #debounceTimer: NodeJS.Timeout | null = null;
  #framework: LfFrameworkInterface;
  #b = LF_AUTOCOMPLETE_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_AUTOCOMPLETE_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  //#endregion

  //#region Constants
  static readonly BLUR_DELAY_MS = 200;
  //#endregion

  //#region Events
  /**
   * Unified custom event emitted for all autocomplete interactions.
   * Check the eventType property to distinguish between different events:
   * - "input": User typed in the field (includes query)
   * - "request": Debounce complete, ready to fetch data (includes query)
   * - "change": User selected an item from the list
   * - "lf-event": Generic passthrough for child component events
   * - "ready": Component initialized
   * - "unmount": Component unmounting
   *
   * @event lf-autocomplete-event
   */
  @Event({
    eventName: "lf-autocomplete-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfAutocompleteEventPayload>;

  onLfEvent(
    e: Event | CustomEvent,
    eventType: LfAutocompleteEvent,
    args?: { node?: LfDataNode; query?: string },
  ) {
    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement?.id || "",
      originalEvent: e,
      node: args?.node,
      query: args?.query,
    });
  }
  //#endregion

  //#region Public methods
  /**
   * Clears the cache of the autocomplete component.
   *
   * @example
   * ```tsx
   * const autocomplete = document.querySelector('lf-autocomplete');
   * autocomplete.clearCache();
   * ```
   */
  @Method()
  async clearCache(): Promise<void> {
    this.#cache.clear();
  }
  /**
   * Clears the input field.
   *
   * @returns {Promise<void>}
   *
   * @example
   * ```tsx
   * const autocomplete = document.querySelector('lf-autocomplete');
   * await autocomplete.clearInput();
   * ```
   */
  @Method()
  async clearInput(): Promise<void> {
    await this.#adapter.controller.set.input("");
  }
  /**
   * Retrieves the debug information for this component instance.
   *
   * @returns {Promise<LfDebugLifecycleInfo>} Lifecycle and performance metrics
   *
   * @example
   * ```tsx
   * const autocomplete = document.querySelector('lf-autocomplete');
   * const debugInfo = await autocomplete.getDebugInfo();
   * ```
   */
  @Method()
  async getDebugInfo(): Promise<LfDebugLifecycleInfo> {
    return this.debugInfo;
  }
  /**
   * Retrieves all public props of this component as an object.
   *
   * @returns {Promise<LfAutocompletePropsInterface>} All component props
   *
   * @example
   * ```tsx
   * const autocomplete = document.querySelector('lf-autocomplete');
   * const props = await autocomplete.getProps();
   * ```
   */
  @Method()
  async getProps(): Promise<any> {
    const props: any = {};
    LF_AUTOCOMPLETE_PROPS.forEach((p) => (props[p] = this[p]));
    return props;
  }
  /**
   * Returns the current input value.
   *
   * @returns {Promise<string>} The current input text
   *
   * @example
   * ```tsx
   * const autocomplete = document.querySelector('lf-autocomplete');
   * const value = await autocomplete.getValue();
   * ```
   */
  @Method()
  async getValue(): Promise<string> {
    return this.inputValue;
  }
  /**
   * Forces the component to re-render.
   *
   * @returns {Promise<void>}
   *
   * @example
   * ```tsx
   * const autocomplete = document.querySelector('lf-autocomplete');
   * await autocomplete.refresh();
   * ```
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }
  /**
   * Sets the input value.
   *
   * @param {string} value - The new input value
   * @returns {Promise<void>}
   *
   * @example
   * ```tsx
   * const autocomplete = document.querySelector('lf-autocomplete');
   * await autocomplete.setValue("new value");
   * ```
   */
  @Method()
  async setValue(value: string): Promise<void> {
    await this.#adapter.controller.set.input(value);
  }
  /**
   * Performs cleanup for the component.
   *
   * @returns {Promise<void>}
   *
   * @example
   * ```tsx
   * const autocomplete = document.querySelector('lf-autocomplete');
   * await autocomplete.unmount();
   * ```
   */
  @Method()
  async unmount(): Promise<void> {
    this.onLfEvent(new CustomEvent("unmount"), "unmount");
  }
  //#endregion

  //#region Private methods
  #clearBlurTimeout() {
    if (this.#blurTimeout) {
      clearTimeout(this.#blurTimeout);
      this.#blurTimeout = null;
    }
  }
  #evictCacheIfNeeded() {
    if (this.#cache.size > this.lfMaxCacheSize) {
      const oldestKey = this.#cache.keys().next().value;
      this.#cache.delete(oldestKey);
    }
  }
  #normalizeQuery(query: string): string {
    return query.trim().toLowerCase();
  }
  #setLoading(isLoading: boolean) {
    this.loading = isLoading;
  }
  #setBlurTimeout(
    callback: () => void,
    delay: number = LfAutocomplete.BLUR_DELAY_MS,
  ) {
    this.#clearBlurTimeout();
    this.#blurTimeout = setTimeout(callback, delay);
  }
  #initAdapter() {
    this.#adapter = createAdapter(
      {
        blocks: this.#b,
        cache: () => this.#cache,
        compInstance: this,
        cyAttributes: this.#cy,
        hasCache: () => this.lfCache && this.#cache.size > 0,
        highlightedIndex: () => this.highlightedIndex,
        indexById: (id: string) =>
          this.lfDataset?.nodes?.findIndex((n) => n.id === id) ?? -1,
        inputValue: () => this.inputValue,
        isDisabled: () => this.lfUiState === "disabled",
        isLoading: () => this.loading,
        lfAllowFreeInput: () => this.lfAllowFreeInput,
        lfAttributes: this.#lf,
        lfDataset: () => this.lfDataset,
        manager: this.#framework,
        parts: this.#p,
        selectedNode: () => null,
      },
      {
        blurTimeout: {
          clear: () => {
            this.#clearBlurTimeout();
          },
          new: (callback: () => void, delay?: number) => {
            this.#setBlurTimeout(callback, delay);
          },
        },
        dataset: async (dataset: LfDataDataset | null) => {
          const { refs } = this.#adapter.elements;
          if (refs.list && dataset) {
            await refs.list.refresh();
          }

          if (this.lfCache && this.lastRequestedQuery && dataset) {
            const normalized = this.#normalizeQuery(this.lastRequestedQuery);
            this.#cache.set(normalized, { dataset, timestamp: Date.now() });
            this.#evictCacheIfNeeded();
            this.lastRequestedQuery = "";
          }

          if (dataset) {
            this.lfListProps = { ...this.lfListProps, lfFilter: false };
            this.#setLoading(false);
            return;
          }

          this.#adapter.controller.set.list("open");
        },
        input: async (value: string) => {
          this.inputValue = value;
          const { refs } = this.#adapter.elements;
          if (refs.textfield) {
            await refs.textfield.setValue(value);
          }

          if (this.#debounceTimer) {
            clearTimeout(this.#debounceTimer);
          }

          if (value.length < this.lfMinChars) {
            this.#adapter.controller.set.list("close");
            this.#setLoading(false);
            return;
          }

          this.#adapter.controller.set.list("open");
          this.#adapter.controller.set.highlight(-1);

          const normalized = this.#normalizeQuery(value);
          if (this.lfCache && this.#cache.has(normalized)) {
            const entry = this.#cache.get(normalized);
            if (Date.now() - entry.timestamp > this.lfCacheTTL) {
              this.#cache.delete(normalized);
            } else {
              this.lfDataset = entry.dataset;
              this.lfListProps = { ...this.lfListProps, lfFilter: false };
              this.#setLoading(false);
              return;
            }
          }

          this.lfDataset = null;
          this.#setLoading(true);

          this.#debounceTimer = setTimeout(() => {
            this.lastRequestedQuery = value;
            this.onLfEvent(new CustomEvent("request"), "request", {
              query: value,
            });
          }, this.lfDebounceMs);
        },
        select: async (node: LfDataNode) => {
          this.inputValue = String(node.value || "");
          const { refs } = this.#adapter.elements;
          if (refs.textfield) {
            await refs.textfield.setValue(this.inputValue);
          }
          this.#adapter.controller.set.list("close");
          refs.textfield?.setFocus();
          this.onLfEvent(new CustomEvent("change"), "change", { node });
        },
        highlight: (index: number) => {
          this.highlightedIndex = index;
        },
      },
      () => this.#adapter,
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
    this.#framework = await awaitFramework(this);
    this.inputValue = this.lfValue || "";
    this.#initAdapter();
  }
  componentWillRender() {
    const { info } = this.#framework.debug;

    info.update(this, "will-render");
  }
  componentDidRender() {
    const { info } = this.#framework.debug;

    info.update(this, "did-render");
  }
  componentDidLoad() {
    const { debug } = this.#framework;

    this.onLfEvent(new CustomEvent("ready"), "ready");
    debug.info.update(this, "did-load");
  }
  render() {
    const { bemClass, setLfStyle } = this.#framework.theme;
    const { lfStyle } = this;
    const isExpanded =
      this.#adapter &&
      this.#framework.portal.isInPortal(this.#adapter.elements.refs.dropdown);
    const dropdownId = `${this.rootElement.id || "autocomplete"}-dropdown`;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div
            class={bemClass(this.#b.autocomplete._)}
            data-lf={this.#lf[this.lfUiState]}
            part={this.#p.autocomplete}
            role="combobox"
            aria-expanded={isExpanded ? "true" : "false"}
            aria-haspopup="listbox"
            aria-owns={dropdownId}
          >
            {this.#adapter.elements.jsx.textfield()}
            {this.#adapter.elements.jsx.dropdown()}
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    if (this.#debounceTimer) {
      clearTimeout(this.#debounceTimer);
    }
    this.#clearBlurTimeout();
    if (this.#adapter) {
      const { dropdown } = this.#adapter.elements.refs;
      this.#framework?.portal.close(dropdown);
    }
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}
