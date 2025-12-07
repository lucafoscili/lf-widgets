import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_SHAPEEDITOR_BLOCKS,
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
  LfShapeeditorPropsInterface,
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
  updateValue,
} from "./helpers.utils";
import { createAdapter } from "./lf-shapeeditor-adapter";

/**
 * A universal 4-panel interactive explorer that transforms any LfShape type
 * into an explorable, configurable, and previewable experience.
 *
 * The shapeeditor provides:
 * - Categories panel (masonry) for high-level grouping
 * - Items panel (tree) for detailed selection and history
 * - Preview panel (any LfShape) for visual output
 * - Configuration panel (slot) for parameter editing
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
  #b = LF_SHAPEEDITOR_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_SHAPEEDITOR_PARTS;
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
   * Appends a new snapshot to the current shape's history by duplicating it with an updated value.
   * It has no effect when the current shape is not set.
   */
  @Method()
  async addSnapshot(value: string): Promise<void> {
    const { currentShape } = this;

    if (!currentShape || !Object.keys(currentShape)?.length) {
      return;
    }

    const { history } = this.#adapter.controller.set;

    const s = newShape(currentShape);
    updateValue(s.shape, value);
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
    return this.#adapter.controller.get.history.currentSnapshot();
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
    this.#adapter = createAdapter(
      {
        blocks: this.#b,
        compInstance: this,
        config: {
          controls: () => this.configControls,
          expandedGroups: () => this.expandedSettingsGroups,
          layout: () => this.configLayout,
          settings: () => this.configSettings,
        },
        currentShape: () => this.#getSelectedShapeValue(this.currentShape),
        cyAttributes: this.#cy,
        history: {
          current: () => this.history[this.currentShape.index],
          currentSnapshot: () => {
            if (this.historyIndex === null) {
              return null;
            }

            const snapshot =
              this.history[this.currentShape.index][this.historyIndex];

            return this.#getSelectedShapeValue(snapshot);
          },
          full: () => this.history,
          index: () => this.historyIndex,
        },
        lfAttribute: this.#lf,
        manager: this.#framework,
        navigation: {
          hasNav: () => Boolean(this.lfNavigation?.treeProps?.lfDataset),
          isTreeOpen: () => this.isNavigationTreeOpen,
        },
        parts: this.#p,
        spinnerStatus: () => this.isSpinnerActive,
      },
      {
        config: {
          controls: (controls) => {
            this.configControls = controls || [];
          },
          expandedGroups: (groups) => {
            this.expandedSettingsGroups = groups || [];
          },
          layout: (layout) => {
            this.configLayout = layout;
          },
          settings: (settings) => {
            this.configSettings = { ...(settings || {}) };
          },
        },
        currentShape: (node) => (this.currentShape = node),
        history: {
          index: (index) => (this.historyIndex = index),
          new: (selectedShape, isSnapshot = false) => {
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
          pop: (index = null) => {
            if (index !== null) {
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
        },
        navigation: {
          isTreeOpen: (open: boolean) => {
            this.isNavigationTreeOpen = open;
          },
          toggleTree: () => {
            this.isNavigationTreeOpen = !this.isNavigationTreeOpen;
          },
        },
      },
      () => this.#adapter,
    );
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
  #prepViewer(): VNode {
    const { bemClass } = this.#framework.theme;

    const { detailsGrid } = this.#b;
    const {
      clearHistory,
      deleteShape,
      redo,
      save,
      settings,
      shape,
      spinner,
      tree,
      undo,
    } = this.#adapter.elements.jsx.details;

    return (
      <div class={bemClass(detailsGrid._)} part={this.#p.details}>
        <div class={bemClass(detailsGrid._, detailsGrid.preview)}>
          {shape()}
          {spinner()}
        </div>
        <div class={bemClass(detailsGrid._, detailsGrid.actions)}>
          {deleteShape()}
          {clearHistory()}
          {undo()}
          {redo()}
          {save()}
        </div>
        {tree()}
        <div class={bemClass(detailsGrid._, detailsGrid.settings)}>
          {settings()}
        </div>
      </div>
    );
  }
  #prepShapeeditor(): VNode {
    const { bemClass } = this.#framework.theme;

    const { currentShape } = this.#adapter.controller.get;

    return (
      <div
        class={bemClass(this.#b.mainGrid._, null, {
          selected: !!currentShape(),
        })}
      >
        {this.#prepExplorer()}
        {this.#prepViewer()}
      </div>
    );
  }
  #prepExplorer(): VNode {
    const { bemClass } = this.#framework.theme;

    const { load, masonry, navToggle, textfield, tree } =
      this.#adapter.elements.jsx.navigation;
    const navBlock = this.#b.navigationGrid;
    const hasNav = Boolean(this.lfNavigation?.treeProps?.lfDataset);

    const shouldShowLoad = Boolean(this.lfLoadCallback);
    const shouldShowNavToggle =
      hasNav && Boolean(this.lfNavigation?.treeProps?.lfDataset);
    const shouldShowTree = shouldShowNavToggle && this.isNavigationTreeOpen;
    const wrapperClass = bemClass(navBlock._, undefined, {
      "has-drawer": shouldShowTree,
      "has-nav": shouldShowNavToggle,
    });

    return (
      <div class={wrapperClass} part={this.#p.navigation}>
        {tree()}
        {navToggle()}
        {shouldShowLoad && [textfield(), load()]}
        {masonry()}
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
    if (this.#adapter.controller.get.navigation.hasNav()) {
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
    const { info } = this.#framework.debug;

    info.update(this, "did-render");
  }
  render() {
    const { bemClass, setLfStyle } = this.#framework.theme;
    const { lfStyle } = this;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div
            class={bemClass(this.#b.shapeeditor._)}
            part={this.#p.shapeeditor}
          >
            {this.#prepShapeeditor()}
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}
