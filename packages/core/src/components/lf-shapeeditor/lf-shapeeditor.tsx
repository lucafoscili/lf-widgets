import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_SHAPEEDITOR_BLOCKS,
  LF_SHAPEEDITOR_IDS,
  LF_SHAPEEDITOR_PARTS,
  LF_SHAPEEDITOR_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfDataCell,
  LfDataDataset,
  LfDataShapes,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfMasonrySelectedShape,
  LfShapeeditorAdapter,
  LfShapeeditorAdapterRefs,
  LfShapeeditorBehavior,
  LfShapeeditorCommitTrigger,
  LfShapeeditorConfigDsl,
  LfShapeeditorConfigSettings,
  LfShapeeditorControlConfig,
  LfShapeeditorElement,
  LfShapeeditorEvent,
  LfShapeeditorEventPayload,
  LfShapeeditorHistory,
  LfShapeeditorInterface,
  LfShapeeditorLayout,
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
  VNode,
} from "@stencil/core";
import { awaitFramework } from "../../utils/setup";
import {
  clearHistory,
  clearSelection,
  newShape,
  parseConfigDslFromNode,
  resetControls,
  updateCellProps,
} from "./helpers.utils";
import { createAdapter } from "./lf-shapeeditor-adapter";

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
   * Debug information state property created through LFManager debug utility.
   * Used to store and manage debug-related information for the component.
   * @remarks This state property is initialized using the debug.info.create() method from the lfFramework instance.
   */
  @State() debugInfo: LfDebugLifecycleInfo;
  /**
   * The currently selected shape in the masonry layout.
   * Represents the dimensions and position of the selected item.
   * @internal
   * @type {LfMasonrySelectedShape}
   */
  @State() currentShape: LfMasonrySelectedShape = {};
  /**
   * History state of the shapeeditor component.
   * Tracks the navigation history of viewed shapes.
   * @property {LfShapeeditorHistory} history - An object storing the viewing history information
   */
  @State() history: LfShapeeditorHistory = {};
  /**
   * The current index position in the shape history navigation.
   * Used to track and manage navigation through previously viewed shapes.
   * @remarks When null, indicates no history navigation is active
   */
  @State() historyIndex: number = null;
  /**
   * Tracks whether the navigation tree panel is currently expanded.
   */
  @State() isNavigationTreeOpen = false;
  /**
   * Represents the loading state of the shapeeditor.
   * When true, displays a loading spinner while the shape is being loaded.
   */
  @State() isSpinnerActive = false;
  /**
   * Declarative control definitions driving the configuration panel.
   */
  @State() configControls: LfShapeeditorControlConfig[] = [];
  /**
   * Optional layout describing how controls are grouped.
   */
  @State() configLayout: LfShapeeditorLayout;
  /**
   * Current settings values derived from the active controls.
   */
  @State() configSettings: LfShapeeditorConfigSettings = {};
  /**
   * IDs of expanded accordion groups in the settings panel.
   */
  @State() expandedSettingsGroups: string[] = [];
  /**
   * Temporary preview value that overrides the current snapshot when set.
   * Used for live preview during control interactions without creating history entries.
   */
  @State() previewValue: string | null = null;
  /**
   * State for the absolute-positioned progress bar.
   */
  @State() progressbarState: LfShapeeditorProgressbarState = {
    uiState: "info",
    value: 0,
    visible: false,
  };
  /**
   * Tracks whether the history popup is open.
   */
  @State() isHistoryPopupOpen = false;
  /**
   * State for the inline snackbar notification.
   */
  @State() snackbarState: LfShapeeditorSnackbarState = {
    message: "",
    uiState: "info",
    visible: false,
  };
  /**
   * Counter incremented on reset to force control re-creation.
   * Used as part of control keys to ensure they re-render with new values.
   */
  @State() resetKey = 0;
  /**
   * Behavioral classification for the current DSL configuration.
   * @internal
   */
  @State() configBehavior: LfShapeeditorBehavior;
  /**
   * Commit trigger specification for "configure" behaviors.
   * @internal
   */
  @State() configCommitTrigger: LfShapeeditorCommitTrigger;
  /**
   * Whether to display the Apply button based on DSL configuration.
   * @internal
   */
  @State() configShowApplyButton: boolean;
  /**
   * Whether to display the Reset button based on DSL configuration.
   * @internal
   */
  @State() configShowResetButton: boolean = true;
  /**
   * Whether live preview is enabled for the current DSL configuration.
   * @internal
   */
  @State() configEnablePreview: boolean;
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
        // Component-specific getters
        config: {
          behavior: () => this.configBehavior,
          commitTrigger: () => this.configCommitTrigger,
          controls: () => this.configControls,
          enablePreview: () => this.configEnablePreview,
          expandedGroups: () => this.expandedSettingsGroups,
          layout: () => this.configLayout,
          settings: () => this.configSettings,
          showApplyButton: () => this.configShowApplyButton,
          showResetButton: () => this.configShowResetButton,
        },
        currentShape: () => this.#getSelectedShapeValue(this.currentShape),
        history: {
          current: () => this.history[this.currentShape.index],
          full: () => this.history,
          index: () => this.historyIndex,
          isPopupOpen: () => this.isHistoryPopupOpen,
        },
        navigation: {
          isTreeOpen: () => this.isNavigationTreeOpen,
        },
        previewValue: () => this.previewValue,
        progressbar: () => this.progressbarState,
        resetKey: () => this.resetKey,
        snackbar: () => this.snackbarState,
        spinnerStatus: () => this.isSpinnerActive,
      },
      // SET: Simple single-value assignments
      {
        config: {
          behavior: (behavior?: LfShapeeditorBehavior) => {
            this.configBehavior = behavior;
          },
          commitTrigger: (trigger?: LfShapeeditorCommitTrigger) => {
            this.configCommitTrigger = trigger;
          },
          controls: (controls: LfShapeeditorControlConfig[]) => {
            this.configControls = controls || [];
          },
          enablePreview: (enable?: boolean) => {
            this.configEnablePreview = enable;
          },
          expandedGroups: (groups: string[]) => {
            this.expandedSettingsGroups = groups || [];
          },
          layout: (layout?: LfShapeeditorLayout) => {
            this.configLayout = layout;
          },
          settings: (settings: LfShapeeditorConfigSettings) => {
            this.configSettings = { ...(settings || {}) };
          },
          showApplyButton: (show?: boolean) => {
            this.configShowApplyButton = show;
          },
          showResetButton: (show?: boolean) => {
            this.configShowResetButton = show;
          },
        },
        currentShape: (node: LfMasonrySelectedShape) =>
          (this.currentShape = node),
        history: {
          index: (index: number) => (this.historyIndex = index),
          isPopupOpen: (open: boolean) => (this.isHistoryPopupOpen = open),
        },
        navigation: {
          isTreeOpen: (open: boolean) => {
            this.isNavigationTreeOpen = open;
          },
        },
        previewValue: (value: string | null) => {
          this.previewValue = value;
        },
        progressbar: (state: Partial<LfShapeeditorProgressbarState>) => {
          this.progressbarState = { ...this.progressbarState, ...state };
        },
        snackbar: (state: Partial<LfShapeeditorSnackbarState>) => {
          this.snackbarState = { ...this.snackbarState, ...state };
        },
      },
      // COMPUTED: Derived values and predicates (pure functions)
      {
        history: {
          currentSnapshot: () => {
            if (this.historyIndex === null) {
              return null;
            }

            const snapshot =
              this.history[this.currentShape.index][this.historyIndex];

            return this.#getSelectedShapeValue(snapshot);
          },
        },
        navigation: {
          hasNav: () => Boolean(this.lfNavigation?.treeProps?.lfDataset),
        },
      },
      // ACTIONS: Multi-step operations
      {
        history: {
          new: (selectedShape: LfMasonrySelectedShape, isSnapshot = false) => {
            const historyByIndex = this.history?.[selectedShape.index] || [];

            if (this.historyIndex < historyByIndex.length - 1) {
              historyByIndex.splice(this.historyIndex + 1);
            }

            if (historyByIndex?.length && !isSnapshot) {
              historyByIndex[0] = selectedShape;
              return;
            }

            historyByIndex.push(selectedShape);
            this.history[selectedShape.index] = historyByIndex;
            this.historyIndex = historyByIndex.length - 1;
          },
          pop: (index?: number) => {
            if (index !== null && index !== undefined) {
              this.history[index] = [this.history[index][0]];
              if (this.historyIndex === 0) {
                this.refresh();
              } else {
                this.historyIndex = 0;
              }
            } else {
              this.history = {};
              this.historyIndex = null;
            }
          },
          toggle: () => {
            this.isHistoryPopupOpen = !this.isHistoryPopupOpen;
          },
        },
        navigation: {
          toggle: () => {
            this.isNavigationTreeOpen = !this.isNavigationTreeOpen;
          },
        },
        incrementResetKey: () => {
          this.resetKey++;
        },
      },
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
  #getSelectedShapeValue(selectedShape: LfMasonrySelectedShape) {
    const { data } = this.#framework;
    const { cell } = data;
    const { stringify } = cell;

    if (selectedShape.index !== undefined) {
      const value =
        selectedShape.shape.value ||
        (selectedShape.shape as Partial<LfDataCell<"image">>).lfValue;
      return {
        shape: selectedShape,
        value: stringify(value),
      };
    }

    return null;
  }
  #prepShapeeditor(): VNode {
    const { bemClass } = this.#framework.theme;

    const { navigation, preview, settings } = this.#b;
    const { explorer, jump, masonry } = this.#adapter.elements.jsx.navigation;
    const { history, shape, spinner } = this.#adapter.elements.jsx.preview;
    const { actions, controls, progressbar, tree } =
      this.#adapter.elements.jsx.settings;
    const { currentShape, history: historyState } =
      this.#adapter.controller.get;

    const hasNav = Boolean(this.lfNavigation?.treeProps?.lfDataset);
    const shouldShowLoad = Boolean(this.lfLoadCallback);
    const shouldShowExpander =
      hasNav && Boolean(this.lfNavigation?.treeProps?.lfDataset);
    const shouldShowTree = shouldShowExpander && this.isNavigationTreeOpen;
    const shouldShowHistory = historyState.isPopupOpen();

    return (
      <div
        class={bemClass(this.#b._, this.#b.grid, {
          selected: !!currentShape(),
        })}
      >
        {/* Navigation Panel */}
        <div
          class={bemClass(navigation._, undefined, {
            "has-drawer": shouldShowTree,
            "has-header": shouldShowLoad,
            "has-nav": shouldShowExpander,
          })}
          part={this.#p.navigation._}
        >
          {shouldShowExpander && explorer()}
          {shouldShowLoad && jump()}
          {masonry()}
        </div>
        {/* Preview Panel */}
        <div
          class={bemClass(preview._, undefined, {
            "has-history": shouldShowHistory,
          })}
          part={this.#p.preview._}
        >
          {shouldShowHistory && history()}
          {shape()}
          {spinner()}
        </div>
        {/* Settings Panel */}
        <div class={bemClass(settings._)} part={this.#p.settings._}>
          {actions()}
          {progressbar()}
          {tree()}
          {controls()}
        </div>
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
    this.#framework = await awaitFramework(this);
    this.#initAdapter();
    if (this.#adapter.controller.computed.navigation.hasNav()) {
      this.isNavigationTreeOpen = true;
    }

    // Initialise configuration DSL from the first matching node in lfValue, if present.
    const { data } = this.#framework;
    const { find } = data.node;
    const nodeWithDsl = find(this.lfValue, (n) =>
      Boolean((n as any).cells && "lfCode" in (n as any).cells),
    );
    const dsl = parseConfigDslFromNode(nodeWithDsl as any);
    if (dsl) {
      this.configControls = dsl.controls || [];
      this.configLayout = dsl.layout;
      this.configSettings = dsl.defaultSettings || {};
      // Behavioral metadata
      this.configBehavior = dsl.behavior;
      this.configCommitTrigger = dsl.commitTrigger;
      this.configShowApplyButton = dsl.showApplyButton;
      this.configShowResetButton = dsl.showResetButton ?? true;
      this.configEnablePreview = dsl.enablePreview;
    }
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
            {this.#prepShapeeditor()}
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
