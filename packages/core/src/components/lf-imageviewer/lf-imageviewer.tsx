import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_IMAGEVIEWER_BLOCKS,
  LF_IMAGEVIEWER_PARTS,
  LF_IMAGEVIEWER_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfDataCell,
  LfDataDataset,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfImageviewerAdapter,
  LfImageviewerAdapterRefs,
  LfImageviewerElement,
  LfImageviewerEvent,
  LfImageviewerEventPayload,
  LfImageviewerHistory,
  LfImageviewerInterface,
  LfImageviewerLoadCallback,
  LfImageviewerNavigationTreeOptions,
  LfImageviewerNavigationTreeState,
  LfImageviewerPropsInterface,
  LfMasonrySelectedShape,
  LfThemeBEMModifier,
  LfTreePropsInterface,
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
  VNode,
} from "@stencil/core";
import { awaitFramework } from "../../utils/setup";
import {
  clearHistory,
  clearSelection,
  newShape,
  updateValue,
} from "./helpers.utils";
import { createAdapter } from "./lf-imageviewer-adapter";

type NavigationTreeLayoutMode = "accordion" | "grid";
interface NavigationTreeOptionsNormalized {
  collapsedWidth: number;
  defaultOpen: boolean;
  enabled: boolean;
  layout: {
    columns: number;
    mode: NavigationTreeLayoutMode;
  };
  maxWidth: number;
  minWidth: number;
  position: "start" | "end";
  width: number;
}

const NAVIGATION_TREE_DEFAULTS: NavigationTreeOptionsNormalized = {
  collapsedWidth: 48,
  defaultOpen: true,
  enabled: false,
  layout: {
    columns: 1,
    mode: "accordion",
  },
  maxWidth: 420,
  minWidth: 240,
  position: "start",
  width: 320,
};

/**
 * Represents an image viewer component that displays a collection of images in a masonry layout.
 * The image viewer allows users to navigate through images, view details, and interact with the images.
 * The component supports various customization options, including image loading, navigation, and styling.
 *
 * @component
 * @tag lf-imageviewer
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying images in a masonry layout.
 *
 * @example
 * <lf-imageviewer
 * lfDataset={dataset}
 * lfLoadCallback={loadCallback}
 * ></lf-imageviewer>
 *
 * @fires {CustomEvent} lf-imageviewer-event - Emitted for various component events
 */
@Component({
  tag: "lf-imageviewer",
  styleUrl: "lf-imageviewer.scss",
  shadow: true,
})
export class LfImageviewer implements LfImageviewerInterface {
  /**
   * References the root HTML element of the component (<lf-imageviewer>).
   */
  @Element() rootElement: LfImageviewerElement;

  //#region States
  /**
   * Debug information state property created through LFManager debug utility.
   * Used to store and manage debug-related information for the accordion component.
   * @remarks This state property is initialized using the debug.info.create() method from the lfFramework instance.
   */
  @State() debugInfo: LfDebugLifecycleInfo;
  /**
   * The currently selected shape in the masonry layout.
   * Represents the dimensions and position of the selected image.
   * @internal
   * @type {LfMasonrySelectedShape}
   */
  @State() currentShape: LfMasonrySelectedShape = {};
  /**
   * History state of the image viewer component.
   * Tracks the navigation history of viewed images.
   * @property {LfImageviewerHistory} history - An object storing the viewing history information
   */
  @State() history: LfImageviewerHistory = {};
  /**
   * The current index position in the image history navigation.
   * Used to track and manage navigation through previously viewed images.
   * @remarks When null, indicates no history navigation is active
   */
  @State() historyIndex: number = null;
  /**
   * Represents the loading state of the image viewer.
   * When true, displays a loading spinner while the image is being loaded.
   */
  @State() isSpinnerActive = false;
  /**
   * Tracks whether the navigation tree panel is currently expanded.
   */
  @State() isNavigationTreeOpen = false;
  //#endregion

  //#region Props
  /**
   * The data set for the LF Imageviewer component.
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
   * @type {LfImageviewerLoadCallback}
   * @default null
   * @mutable
   */
  @Prop({ mutable: true }) lfLoadCallback: LfImageviewerLoadCallback = null;
  /**
   * Configuration options for the navigation tree.
   * Accepts a boolean to toggle visibility or an object to customize layout.
   *
   * @type {boolean | LfImageviewerNavigationTreeOptions}
   * @default false
   * @mutable
   */
  @Prop({ mutable: true })
  lfNavigationTree: boolean | LfImageviewerNavigationTreeOptions = false;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * Overrides the default tree props applied to the navigation tree instance.
   *
   * @type {Partial<LfTreePropsInterface>}
   * @default {}
   * @mutable
   */
  @Prop({ mutable: true }) lfTreeProps: Partial<LfTreePropsInterface> = {};
  /**
   * Configuration parameters of the detail view.
   *
   * @type {LfDataDataset}
   * @default {}
   * @mutable
   */
  @Prop({ mutable: true }) lfValue: LfDataDataset = {};
  //#endregion

  //#region Watchers
  @Watch("lfNavigationTree")
  onLfNavigationTreeChange(
    value: boolean | LfImageviewerNavigationTreeOptions,
  ) {
    this.#updateNavigationTreeOptions(value, true);
  }
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_IMAGEVIEWER_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_IMAGEVIEWER_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #adapter: LfImageviewerAdapter;
  #navigationTreeOptions: NavigationTreeOptionsNormalized =
    this.#cloneNavigationTreeDefaults();
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-imageviewer-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfImageviewerEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfImageviewerEvent) {
    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
    });
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
  async getComponents(): Promise<LfImageviewerAdapterRefs> {
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
   * @returns {Promise<LfImageviewerPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfImageviewerPropsInterface> {
    const entries = LF_IMAGEVIEWER_PROPS.map(
      (
        prop,
      ): [
        keyof LfImageviewerPropsInterface,
        LfImageviewerPropsInterface[typeof prop],
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
   * Clears the full history and clears the current selection.
   */
  @Method()
  async reset(): Promise<void> {
    await clearHistory(this.#adapter);
    await clearSelection(this.#adapter);
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
  #cloneNavigationTreeDefaults(): NavigationTreeOptionsNormalized {
    const {
      collapsedWidth,
      defaultOpen,
      enabled,
      layout,
      maxWidth,
      minWidth,
      position,
      width,
    } = NAVIGATION_TREE_DEFAULTS;

    return {
      collapsedWidth,
      defaultOpen,
      enabled,
      layout: { ...layout },
      maxWidth,
      minWidth,
      position,
      width,
    };
  }
  #normalizeNavigationTreeOptions(
    value: boolean | LfImageviewerNavigationTreeOptions,
  ): NavigationTreeOptionsNormalized {
    const defaults = this.#cloneNavigationTreeDefaults();

    if (value === true) {
      defaults.enabled = true;
      return defaults;
    }

    if (!value) {
      defaults.enabled = false;
      return defaults;
    }

    defaults.enabled = value.enabled ?? true;

    if (typeof value.defaultOpen === "boolean") {
      defaults.defaultOpen = value.defaultOpen;
    }

    if (value.position === "end") {
      defaults.position = "end";
    }

    defaults.minWidth = this.#parseSize(value.minWidth, defaults.minWidth);
    defaults.maxWidth = this.#parseSize(value.maxWidth, defaults.maxWidth);

    if (defaults.minWidth > defaults.maxWidth) {
      const swap = defaults.minWidth;
      defaults.minWidth = defaults.maxWidth;
      defaults.maxWidth = swap;
    }

    defaults.width = this.#parseSize(value.width, defaults.width);
    defaults.width = this.#clamp(
      defaults.width,
      defaults.minWidth,
      defaults.maxWidth,
    );

    if (value.layout) {
      const { mode, columns } = value.layout;

      if (mode === "grid" || mode === "accordion") {
        defaults.layout.mode = mode;
      }

      if (
        typeof columns === "number" &&
        Number.isFinite(columns) &&
        columns > 0
      ) {
        defaults.layout.columns = Math.max(1, Math.floor(columns));
      }
    }

    return defaults;
  }
  #parseSize(value: number | string, fallback: number): number {
    if (typeof value === "number" && Number.isFinite(value)) {
      return Math.max(0, value);
    }

    if (typeof value === "string") {
      const parsed = Number.parseFloat(value);
      if (Number.isFinite(parsed)) {
        return Math.max(0, parsed);
      }
    }

    return fallback;
  }
  #clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
  #updateNavigationTreeOptions(
    value: boolean | LfImageviewerNavigationTreeOptions,
    preserveState = false,
  ) {
    const previous = this.#navigationTreeOptions;
    const next = this.#normalizeNavigationTreeOptions(value);

    this.#navigationTreeOptions = next;

    if (!next.enabled) {
      this.isNavigationTreeOpen = false;
      return;
    }

    if (!preserveState || !previous.enabled) {
      this.isNavigationTreeOpen = next.defaultOpen;
    }
  }
  #getNavigationTreeState(): LfImageviewerNavigationTreeState {
    const {
      collapsedWidth,
      defaultOpen,
      enabled,
      layout,
      maxWidth,
      minWidth,
      position,
      width,
    } = this.#navigationTreeOptions;

    const open = enabled && this.isNavigationTreeOpen;

    return {
      collapsedWidth,
      defaultOpen,
      enabled,
      layout: { ...layout },
      maxWidth,
      minWidth,
      open,
      position,
      width,
    };
  }
  #getTreeProps(): Partial<LfTreePropsInterface> {
    const { layout } = this.#navigationTreeOptions;

    const defaults: Partial<LfTreePropsInterface> = {
      lfAccordionLayout: layout.mode === "accordion",
      lfFilter: false,
      lfSelectable: true,
      lfUiSize: "small",
    };

    if (layout.mode === "grid") {
      defaults.lfAccordionLayout = false;
      defaults.lfGrid = true;
    }

    const custom = this.lfTreeProps ?? {};
    const props = { ...defaults, ...custom } as Partial<LfTreePropsInterface>;

    if (!props.lfDataset) {
      props.lfDataset = this.lfDataset;
    }

    return props;
  }
  #getNavigationTreeShellStyle(
    tree: LfImageviewerNavigationTreeState,
  ): Record<string, string> {
    const width = this.#computeNavigationTreeWidth(tree);
    const collapsed = tree.collapsedWidth;
    const minWidth = tree.open ? tree.minWidth : collapsed;
    const maxWidth = tree.open ? tree.maxWidth : collapsed;

    return {
      maxWidth: `${maxWidth}px`,
      minWidth: `${minWidth}px`,
      width: `${width}px`,
    };
  }
  #computeNavigationTreeWidth(tree: LfImageviewerNavigationTreeState): number {
    if (!tree.open) {
      return tree.collapsedWidth;
    }

    return this.#clamp(tree.width, tree.minWidth, tree.maxWidth);
  }
  #initAdapter = () => {
    this.#adapter = createAdapter(
      {
        blocks: this.#b,
        compInstance: this,
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
        navigationTree: () => this.#getNavigationTreeState(),
        parts: this.#p,
        spinnerStatus: () => this.isSpinnerActive,
        treeProps: () => this.#getTreeProps(),
      },
      {
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
        navigationTreeOpen: (open: boolean) =>
          (this.isNavigationTreeOpen = open),
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
      canvas,
      clearHistory,
      deleteShape,
      redo,
      save,
      spinner,
      tree,
      undo,
    } = this.#adapter.elements.jsx.details;

    return (
      <div class={bemClass(detailsGrid._)} part={this.#p.details}>
        <div class={bemClass(detailsGrid._, detailsGrid.preview)}>
          {canvas()}
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
          <slot name="settings"></slot>
        </div>
      </div>
    );
  }
  #prepImageviewer(): VNode {
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

    const { load, masonry, textfield, tree, treeToggle } =
      this.#adapter.elements.jsx.navigation;
    const navigationTree = this.#adapter.controller.get.navigationTree();
    const navBlock = this.#b.navigationGrid;

    const modifiers: Partial<LfThemeBEMModifier> = {
      "with-tree": navigationTree.enabled,
      "tree-closed": navigationTree.enabled && !navigationTree.open,
      "tree-end": navigationTree.enabled && navigationTree.position === "end",
    };

    const wrapperClass = bemClass(navBlock._, undefined, modifiers);

    const content = (
      <div class={bemClass(navBlock._, navBlock.content)}>
        {textfield()}
        {load()}
        {masonry()}
      </div>
    );

    if (!navigationTree.enabled) {
      return (
        <div class={wrapperClass} part={this.#p.navigation}>
          {content}
        </div>
      );
    }

    const treeShellModifiers: Partial<LfThemeBEMModifier> | undefined =
      navigationTree.position === "end"
        ? ({ "tree-end": true } as Partial<LfThemeBEMModifier>)
        : undefined;

    const renderTreeSection = () => (
      <div
        class={bemClass(navBlock._, navBlock.treeShell, treeShellModifiers)}
        style={this.#getNavigationTreeShellStyle(navigationTree)}
      >
        <div class={bemClass(navBlock._, navBlock.treeHeader)}>
          {treeToggle()}
        </div>
        <div
          aria-hidden={!navigationTree.open ? "true" : "false"}
          class={bemClass(navBlock._, navBlock.treeContent)}
          style={{ display: navigationTree.open ? "block" : "none" }}
        >
          {tree()}
        </div>
      </div>
    );

    return (
      <div class={wrapperClass} part={this.#p.navigation}>
        {navigationTree.position === "start" && renderTreeSection()}
        {content}
        {navigationTree.position === "end" && renderTreeSection()}
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
    this.#updateNavigationTreeOptions(this.lfNavigationTree);
    this.#initAdapter();
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
            class={bemClass(this.#b.imageviewer._)}
            part={this.#p.imageviewer}
          >
            {this.#prepImageviewer()}
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
