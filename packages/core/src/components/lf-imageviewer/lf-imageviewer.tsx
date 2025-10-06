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
  LfImageviewerNavigation,
  LfImageviewerPropsInterface,
  LfMasonrySelectedShape,
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
   * Tracks whether the navigation tree panel is currently expanded.
   */
  @State() isNavigationTreeOpen = false;
  /**
   * Represents the loading state of the image viewer.
   * When true, displays a loading spinner while the image is being loaded.
   */
  @State() isSpinnerActive = false;
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
   * Configuration options for the navigation panel.
   *
   * @type {LfImageviewerNavigation}
   * @default undefined
   * @mutable
   */
  @Prop({ mutable: true }) lfNavigation?: LfImageviewerNavigation;
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
  #b = LF_IMAGEVIEWER_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_IMAGEVIEWER_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #adapter: LfImageviewerAdapter;
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
        navigation: {
          hasNav: () => Boolean(this.lfNavigation?.treeProps?.lfDataset),
          isTreeOpen: () => this.isNavigationTreeOpen,
        },
        parts: this.#p,
        spinnerStatus: () => this.isSpinnerActive,
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

    const { load, masonry, navToggle, textfield, tree } =
      this.#adapter.elements.jsx.navigation;
    const navBlock = this.#b.navigationGrid;
    const hasNav = Boolean(this.lfNavigation?.treeProps?.lfDataset);

    const shouldShowNavToggle =
      hasNav && Boolean(this.lfNavigation?.treeProps?.lfDataset);
    const shouldShowTree = shouldShowNavToggle && this.isNavigationTreeOpen;
    const wrapperClass = bemClass(navBlock._, undefined, {
      "has-drawer": shouldShowTree,
      "has-nav": shouldShowNavToggle,
    });

    return (
      <div class={wrapperClass} part={this.#p.navigation}>
        {shouldShowTree && tree()}
        {shouldShowNavToggle && navToggle()}
        {textfield()}
        {load()}
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
