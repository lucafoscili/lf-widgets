import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_SHAPEEDITOR_BLOCKS,
  LF_SHAPEEDITOR_IDS,
  LF_SHAPEEDITOR_PARTS,
  LF_SHAPEEDITOR_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfDataDataset,
  LfDataShapes,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfMasonrySelectedShape,
  LfShapeeditorAdapter,
  LfShapeeditorAdapterDispatcher,
  LfShapeeditorAdapterRefs,
  LfShapeeditorConfigDsl,
  LfShapeeditorConfigSettings,
  LfShapeeditorElement,
  LfShapeeditorEvent,
  LfShapeeditorEventPayload,
  LfShapeeditorHistory,
  LfShapeeditorInterface,
  LfShapeeditorLoadCallback,
  LfShapeeditorNavigation,
  LfShapeeditorProgressbarState,
  LfShapeeditorPropsInterface,
  LfShapeeditorSnackbarState,
} from "@lf-widgets/foundations";
import {
  Component,
  Element,
  Event,
  EventEmitter,
  forceUpdate,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
} from "@stencil/core";
import { awaitFramework } from "../../utils/setup";
import { ShapeeditorFC } from "./fc";
import {
  clearHistory,
  clearSelection,
  newShape,
  parseConfigDslFromNode,
  resetControls,
  updateCellProps,
} from "./helpers.utils";
import {
  createAdapter,
  LfShapeeditorInitialState,
} from "./lf-shapeeditor-adapter";

/**
 * A universal 3-panel interactive explorer that transforms any LfShape type
 * into an explorable, configurable, and previewable experience.
 *
 * The shapeeditor provides:
 * - Navigation panel (left): file tree, masonry gallery for shape selection
 * - Preview panel (right-top): shape preview with spinner
 * - Settings panel (right-bottom): actions, configuration controls, progressbar, snackbar
 *
 * @component
 * @tag lf-shapeeditor
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for exploring and editing any shape type.
 *
 * @example
 * <lf-shapeeditor
 *   lfDataset={dataset}
 *   lfShape="image"
 * ></lf-shapeeditor>
 *
 * @fires {CustomEvent} lf-shapeeditor-event - Emitted for various component events
 */
@Component({
  tag: "lf-shapeeditor",
  styleUrl: "lf-shapeeditor.scss",
  shadow: true,
})
export class LfShapeeditor implements LfShapeeditorInterface {
  /**
   * References the root HTML element of the component (<lf-shapeeditor>).
   */
  @Element() rootElement: LfShapeeditorElement;

  //#region States
  /**
   * Single render-tick state per "Adapter as Core" pattern (v4.0.0 Section 5.9).
   * All component state lives in adapter closure; this just triggers re-renders.
   */
  @State() _renderTick = 0;
  /**
   * Debug information state property created through LfFramework debug utility.
   * Used to store and manage debug-related information for the component.
   * @remarks This state property is initialized using the debug.info.create() method from the framework instance.
   */
  @State() debugInfo: LfDebugLifecycleInfo;
  //#endregion

  //#region State Accessors (delegate to adapter closure)
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get currentShape(): LfMasonrySelectedShape {
    return this.#adapter?.controller.get.currentShape()?.shape ?? {};
  }
  set currentShape(value: LfMasonrySelectedShape) {
    this.#adapter?.controller.set.currentShape(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get history(): LfShapeeditorHistory {
    return this.#adapter?.controller.get.history.full() ?? {};
  }
  set history(_value: LfShapeeditorHistory) {
    // History is managed via actions, not direct setter
    console.warn(
      "history should be managed via adapter.controller.actions.history",
    );
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get historyIndex(): number | null {
    return this.#adapter?.controller.get.history.index() ?? null;
  }
  set historyIndex(value: number | null) {
    if (value !== null) {
      this.#adapter?.controller.set.history.index(value);
    }
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get isNavigationTreeOpen(): boolean {
    return this.#adapter?.controller.get.navigation.isTreeOpen() ?? false;
  }
  set isNavigationTreeOpen(value: boolean) {
    this.#adapter?.controller.set.navigation.isTreeOpen(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get isSpinnerActive(): boolean {
    return this.#adapter?.controller.get.spinnerStatus() ?? false;
  }
  set isSpinnerActive(value: boolean) {
    this.#adapter?.controller.set.spinnerStatus(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get configControls() {
    return this.#adapter?.controller.get.config.controls() ?? [];
  }
  set configControls(value) {
    this.#adapter?.controller.set.config.controls(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get configLayout() {
    return this.#adapter?.controller.get.config.layout();
  }
  set configLayout(value) {
    this.#adapter?.controller.set.config.layout(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get configSettings(): LfShapeeditorConfigSettings {
    return this.#adapter?.controller.get.config.settings() ?? {};
  }
  set configSettings(value: LfShapeeditorConfigSettings) {
    this.#adapter?.controller.set.config.settings(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get expandedSettingsGroups(): string[] {
    return this.#adapter?.controller.get.config.expandedGroups() ?? [];
  }
  set expandedSettingsGroups(value: string[]) {
    this.#adapter?.controller.set.config.expandedGroups(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get previewValue(): string | null {
    return this.#adapter?.controller.get.previewValue() ?? null;
  }
  set previewValue(value: string | null) {
    this.#adapter?.controller.set.previewValue(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get progressbarState(): LfShapeeditorProgressbarState {
    return (
      this.#adapter?.controller.get.progressbar() ?? {
        uiState: "info",
        value: 0,
        visible: false,
      }
    );
  }
  set progressbarState(value: LfShapeeditorProgressbarState) {
    this.#adapter?.controller.set.progressbar(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get isHistoryPopupOpen(): boolean {
    return this.#adapter?.controller.get.history.isPopupOpen() ?? false;
  }
  set isHistoryPopupOpen(value: boolean) {
    this.#adapter?.controller.set.history.isPopupOpen(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get snackbarState(): LfShapeeditorSnackbarState {
    return (
      this.#adapter?.controller.get.snackbar() ?? {
        message: "",
        uiState: "info",
        visible: false,
      }
    );
  }
  set snackbarState(value: LfShapeeditorSnackbarState) {
    this.#adapter?.controller.set.snackbar(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get resetKey(): number {
    return this.#adapter?.controller.get.resetKey() ?? 0;
  }
  set resetKey(_value: number) {
    // resetKey is managed via actions.incrementResetKey
    this.#adapter?.controller.actions.incrementResetKey();
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get configBehavior() {
    return this.#adapter?.controller.get.config.behavior();
  }
  set configBehavior(value) {
    this.#adapter?.controller.set.config.behavior(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get configCommitTrigger() {
    return this.#adapter?.controller.get.config.commitTrigger();
  }
  set configCommitTrigger(value) {
    this.#adapter?.controller.set.config.commitTrigger(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get configShowApplyButton() {
    return this.#adapter?.controller.get.config.showApplyButton();
  }
  set configShowApplyButton(value) {
    this.#adapter?.controller.set.config.showApplyButton(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get configShowResetButton(): boolean {
    return this.#adapter?.controller.get.config.showResetButton() ?? true;
  }
  set configShowResetButton(value: boolean) {
    this.#adapter?.controller.set.config.showResetButton(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get configEnablePreview() {
    return this.#adapter?.controller.get.config.enablePreview();
  }
  set configEnablePreview(value) {
    this.#adapter?.controller.set.config.enablePreview(value);
  }
  //#endregion

  //#region Props
  /**
   * The data set for the LF Shapeeditor component.
   * This property is mutable, meaning it can be changed after the component is initialized.
   *
   * @type {LfDataDataset}
   * @default null
   * @mutable
   */
  @Prop({ mutable: true }) lfDataset: LfDataDataset = {};
  /**
   * Callback invoked when the load button is clicked.
   *
   * @type {LfShapeeditorLoadCallback}
   * @default null
   * @mutable
   */
  @Prop({ mutable: true }) lfLoadCallback: LfShapeeditorLoadCallback = null;
  /**
   * Configuration options for the navigation panel.
   *
   * @type {LfShapeeditorNavigation}
   * @default undefined
   * @mutable
   */
  @Prop({ mutable: true }) lfNavigation?: LfShapeeditorNavigation;
  /**
   * The shape type to render in the preview area.
   * Determines which LfShape component is used for preview.
   *
   * @type {LfDataShapes}
   * @default "image"
   * @mutable
   */
  @Prop({ mutable: true }) lfShape: LfDataShapes = "image";
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * Configuration parameters of the detail view.
   *
   * @type {LfDataDataset}
   * @default {}
   * @mutable
   */
  @Prop({ mutable: true }) lfValue: LfDataDataset = {};
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_SHAPEEDITOR_BLOCKS.shapeeditor;
  #cy = CY_ATTRIBUTES;
  #ids = LF_SHAPEEDITOR_IDS.shapeeditor;
  #lf = LF_ATTRIBUTES;
  #p = LF_SHAPEEDITOR_PARTS.shapeeditor;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #adapter: LfShapeeditorAdapter;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-shapeeditor-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfShapeeditorEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfShapeeditorEvent) {
    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
    });
  }
  //#endregion

  //#region Listeners
  /**
   * Handles keyboard shortcuts for undo (Ctrl+Z) and redo (Ctrl+Y).
   */
  @Listen("keydown")
  handleKeyDown(e: KeyboardEvent) {
    if (!this.currentShape || !Object.keys(this.currentShape)?.length) {
      return;
    }

    const history = this.history[this.currentShape.index];
    if (!history?.length) {
      return;
    }

    if (e.ctrlKey && e.key === "z") {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.#adapter.controller.set.history.index(this.historyIndex - 1);
      }
    }

    if (e.ctrlKey && e.key === "y") {
      e.preventDefault();
      if (this.historyIndex < history.length - 1) {
        this.#adapter.controller.set.history.index(this.historyIndex + 1);
      }
    }
  }
  //#endregion

  //#region Public methods
  /**
   * Appends a new snapshot to the current shape's history with updated cell properties.
   * This is shape-agnostic and works with any cell type.
   * It has no effect when the current shape is not set.
   *
   * @param props - An object containing the property key-value pairs to update on the cell.
   *                For image editing, pass `{ value: "base64..." }` or `{ lfValue: "base64..." }`.
   *                For component playgrounds, pass any prop like `{ lfLabel: "New Label", lfDisabled: true }`.
   */
  @Method()
  async addSnapshot(props: Record<string, unknown>): Promise<void> {
    const { currentShape } = this;

    if (!currentShape || !Object.keys(currentShape)?.length) {
      return;
    }

    const { history } = this.#adapter.controller.actions;

    const s = newShape(currentShape);
    updateCellProps(s.shape, props);
    history.new(s, true);
  }
  /**
   * Clears the history related to the shape identified by the index.
   * When index is not provided, it clear the full history.
   */
  @Method()
  async clearHistory(index: number = null): Promise<void> {
    await clearHistory(this.#adapter, index);
  }
  /**
   * Clears the currently selected shape.
   */
  @Method()
  async clearSelection(): Promise<void> {
    await clearSelection(this.#adapter);
  }
  /**
   * This method is used to retrieve the references to the subcomponents.
   */
  @Method()
  async getComponents(): Promise<LfShapeeditorAdapterRefs> {
    return this.#adapter.elements.refs;
  }
  /**
   * Fetches the current snapshot.
   * @returns {Promise<{shape: LfMasonrySelectedShape; value: string;}>} A promise that resolves with the current snapshot's object.
   */
  @Method()
  async getCurrentSnapshot(): Promise<{
    shape: LfMasonrySelectedShape;
    value: string;
  }> {
    return this.#adapter.controller.computed.history.currentSnapshot();
  }
  /**
   * Returns the underlying shape element (e.g., lf-canvas, lf-image, lf-chart) in the preview area.
   * Useful for programmatic access to shape-specific methods like brush settings on canvas.
   * @returns {Promise<Element | null>} The shape element, or null if not found.
   */
  @Method()
  async getShapeElement(): Promise<Element | null> {
    const { shape } = this.#adapter.elements.refs.preview;
    if (!shape) return null;

    // The shape component will be the first child element
    return shape.firstElementChild;
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
   * @returns {Promise<LfShapeeditorPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfShapeeditorPropsInterface> {
    const entries = LF_SHAPEEDITOR_PROPS.map(
      (
        prop,
      ): [
        keyof LfShapeeditorPropsInterface,
        LfShapeeditorPropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Returns the current configuration settings.
   * @returns {Promise<LfShapeeditorConfigSettings>} The current settings object.
   */
  @Method()
  async getSettings(): Promise<LfShapeeditorConfigSettings> {
    return { ...this.configSettings };
  }
  /**
   * Returns the full DSL configuration including behavioral metadata.
   * Consumers can use this to read the current filter's behavior type,
   * commit trigger, and button visibility flags.
   * @returns {Promise<LfShapeeditorConfigDsl | null>} The current DSL or null if not set.
   */
  @Method()
  async getDsl(): Promise<LfShapeeditorConfigDsl | null> {
    if (!this.configControls?.length) {
      return null;
    }
    return {
      controls: this.configControls,
      layout: this.configLayout,
      defaultSettings: this.configSettings,
      behavior: this.configBehavior,
      commitTrigger: this.configCommitTrigger,
      showApplyButton: this.configShowApplyButton,
      showResetButton: this.configShowResetButton,
      enablePreview: this.configEnablePreview,
    };
  }
  /**
   * This method is used to trigger a new render of the component.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }
  /**
   * Clears the full history and clears the current selection.
   */
  @Method()
  async reset(): Promise<void> {
    await clearHistory(this.#adapter);
    await clearSelection(this.#adapter);
  }
  /**
   * Resets all controls to their default values as defined in the control configurations.
   * Only resets controls that have a defaultValue defined.
   */
  @Method()
  async resetControls(): Promise<void> {
    await resetControls(this.#adapter);
  }
  /**
   * Updates the configuration settings programmatically.
   * @param {LfShapeeditorConfigSettings} settings - The settings to merge or replace.
   * @param {boolean} replace - If true, replaces all settings; if false, merges with existing.
   */
  @Method()
  async setSettings(
    settings: LfShapeeditorConfigSettings,
    replace: boolean = false,
  ): Promise<void> {
    if (replace) {
      this.configSettings = { ...settings };
    } else {
      this.configSettings = { ...this.configSettings, ...settings };
    }
  }
  /**
   * Displays/hides the spinner over the preview.
   */
  @Method()
  async setSpinnerStatus(status: boolean): Promise<void> {
    this.isSpinnerActive = status;
  }
  /**
   * Updates the progress bar state.
   * @param {Partial<LfShapeeditorProgressbarState>} state - The progress bar state to merge.
   */
  @Method()
  async setProgressbar(
    state: Partial<LfShapeeditorProgressbarState>,
  ): Promise<void> {
    this.progressbarState = { ...this.progressbarState, ...state };
  }
  /**
   * Sets a temporary preview value that overrides the current snapshot.
   * Pass null to clear the preview and show the actual snapshot value.
   * @param {string | null} value - The preview value to display, or null to clear.
   */
  @Method()
  async setPreviewValue(value: string | null): Promise<void> {
    this.previewValue = value;
  }
  /**
   * Updates the snackbar state.
   * @param {Partial<LfShapeeditorSnackbarState>} state - The snackbar state to merge.
   */
  @Method()
  async setSnackbar(state: Partial<LfShapeeditorSnackbarState>): Promise<void> {
    this.snackbarState = { ...this.snackbarState, ...state };
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
  /**
   * Initialize adapter using "Adapter as Core" pattern (v4.0.0 Section 5.9).
   * State lives in adapter closure; WC is a thin shell with single `_renderTick`.
   */
  #initAdapter = () => {
    // Base getters - read from WC instance (non-state values)
    const baseGetters = {
      blocks: () => this.#b,
      compInstance: () => this,
      cyAttributes: () => this.#cy,
      framework: () => this.#framework,
      ids: () => this.#ids,
      lfAttributes: () => this.#lf,
      parts: () => this.#p,
    };

    // Parse DSL from node first to get initial config values
    const { data } = this.#framework;
    const { find } = data.node;
    const nodeWithDsl = find(this.lfValue, (n) =>
      Boolean((n as any).cells && "lfCode" in (n as any).cells),
    );
    const dsl = parseConfigDslFromNode(nodeWithDsl as any);

    // Initial state for closure variables
    const initialState: LfShapeeditorInitialState = {
      currentShape: {},
      history: {},
      historyIndex: null,
      isNavigationTreeOpen: Boolean(this.lfNavigation?.treeProps?.lfDataset),
      isSpinnerActive: false,
      configControls: dsl?.controls || [],
      configLayout: dsl?.layout,
      configSettings: dsl?.defaultSettings || {},
      expandedSettingsGroups: [],
      previewValue: null,
      progressbarState: { uiState: "info", value: 0, visible: false },
      isHistoryPopupOpen: false,
      snackbarState: { message: "", uiState: "info", visible: false },
      resetKey: 0,
      configBehavior: dsl?.behavior,
      configCommitTrigger: dsl?.commitTrigger,
      configShowApplyButton: dsl?.showApplyButton,
      configShowResetButton: dsl?.showResetButton ?? true,
      configEnablePreview: dsl?.enablePreview,
    };

    // State change callback - increments _renderTick to trigger re-render
    const onStateChange = () => {
      this._renderTick++;
    };

    // Create adapter without dispatcher first (circular reference)
    const adapterWithoutDispatcher = createAdapter(
      baseGetters,
      initialState,
      onStateChange,
      () => this.#adapter,
    );

    // Create inline dispatcher per v4.0.0 Section 5.5
    const dispatcher: LfShapeeditorAdapterDispatcher = {
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
    };

    // Combine into final adapter
    this.#adapter = {
      ...adapterWithoutDispatcher,
      dispatcher,
    } as LfShapeeditorAdapter;
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
    // DSL initialization is now handled inside #initAdapter
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    this.onLfEvent(new CustomEvent("ready"), "ready");
    info.update(this, "did-load");
  }
  componentWillRender() {
    const { info } = this.#framework.debug;

    info.update(this, "will-render");
  }
  componentDidRender() {
    const { debug, tooltip } = this.#framework;
    const { info } = debug;
    const { refs } = this.#adapter.elements;

    refs.settings.controls.items.infoIcons?.forEach((icon) => {
      const content = icon.getAttribute("aria-label");
      if (!content || tooltip.isRegistered(icon)) {
        return;
      }

      tooltip.register(icon, {
        content,
        placement: "bottom",
      });
    });

    info.update(this, "did-render");
  }
  render() {
    const { bemClass, setLfStyle } = this.#framework.theme;
    const { lfStyle } = this;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div class={bemClass(this.#b._)} part={this.#p._}>
            <ShapeeditorFC adapter={this.#adapter} />
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { tooltip } = this.#framework;
    this.#adapter.elements.refs.settings.controls.items.infoIcons?.forEach(
      (icon) => {
        tooltip.unregister(icon);
      },
    );

    this.#framework?.theme.unregister(this);
  }
  //#endregion
}
