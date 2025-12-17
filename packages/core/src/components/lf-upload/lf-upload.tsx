import {
  LF_STYLE_ID,
  LF_UPLOAD_BLOCKS,
  LF_UPLOAD_IDS,
  LF_UPLOAD_PARTS,
  LF_UPLOAD_PROPS,
  LF_WRAPPER_ID,
  LfDebugLifecycleInfo,
  LfFrameworkAllowedKeysMap,
  LfFrameworkInterface,
  LfUploadAdapter,
  LfUploadElement,
  LfUploadEvent,
  LfUploadEventPayload,
  LfUploadInterface,
  LfUploadPropsInterface,
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
import { prepUploadActions } from "./actions.upload";
import { prepUploadComputed } from "./computed.upload";
import { UploadFC } from "./fc/upload-fc";
import { createAdapter } from "./lf-upload-adapter";

/**
 * The upload component allows users to upload files, displaying the selected files and their sizes.
 * The component can be customized with a label, ripple effect, and custom styling.
 *
 * @component
 * @tag lf-upload
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for uploading files.
 *
 * @example
 * <lf-upload lfLabel="Choose files..."></lf-upload>
 *
 * @fires {CustomEvent} lf-upload-event - Emitted for various component events
 */
@Component({
  tag: "lf-upload",
  styleUrl: "lf-upload.scss",
  shadow: true,
})
export class LfUpload implements LfUploadInterface {
  /**
   * References the root HTML element of the component (<lf-upload>).
   */
  @Element() rootElement: LfUploadElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() selectedFiles: File[] = [];
  //#endregion

  //#region Props
  /**
   * Allows customization of the input element through additional HTML attributes.
   * This can include attributes like 'readonly', 'placeholder', etc., to further customize the behavior or appearance of the input.
   *
   * @type {Partial<LfFrameworkAllowedKeysMap>}
   * @default undefined
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-upload lfHtmlAttributes={{ accept: "image/*" }} />
   * ```
   */
  @Prop({ mutable: true }) lfHtmlAttributes: Partial<LfFrameworkAllowedKeysMap>;
  /**
   * Sets the button's label.
   *
   * @type {dtring}
   * @default "Upload files..."
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-upload lfLabel="Choose files..."></lf-upload>
   * ```
   */
  @Prop({ mutable: true }) lfLabel: string = "Upload files...";
  /**
   * When set to true, the pointerdown event will trigger a ripple effect.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-upload lfRipple={true}></lf-upload>
   * ```
   */
  @Prop({ mutable: true }) lfRipple: boolean = true;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-upload lfStyle="#lf-component { color: red; }"></lf-upload>
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * Initializes the component with these files.
   *
   * @type {File[]}
   * @default null
   *
   * @example
   * ```tsx
   * <lf-upload lfValue={[file1, file2]}></lf-upload>
   * ```
   */
  @Prop({ mutable: false }) lfValue: File[] = null;
  //#endregion

  //#region Internal variables
  #adapter: LfUploadAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_UPLOAD_BLOCKS;
  #ids = LF_UPLOAD_IDS;
  #p = LF_UPLOAD_PARTS;
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
    eventName: "lf-upload-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfUploadEventPayload>;
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
   * @returns {Promise<LfUploadPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfUploadPropsInterface> {
    const entries = LF_UPLOAD_PROPS.map(
      (
        prop,
      ): [
        keyof LfUploadPropsInterface,
        LfUploadPropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Returns the component's internal value.
   */
  @Method()
  async getValue(): Promise<File[]> {
    return this.selectedFiles;
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
      this.#adapter.dispatcher.emit("unmount", {
        selectedFiles: this.selectedFiles,
      });
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
      eventType: LfUploadEvent,
      detail?: Partial<LfUploadEventPayload>,
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
        selectedFiles: this.selectedFiles,
      });
    },
  });
  /**
   * Initializes the adapter with v4.0.0 architecture.
   *
   * Structure:
   * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
   * - controller.computed: Derived predicates (hasSelectedFiles, formatFileSize, getFileIcon)
   * - controller.actions: Complex operations (handleFiles, deleteFile)
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
      // Computed - derived predicates (from dedicated file)
      prepUploadComputed(getAdapter),
      // Actions - complex multi-step operations (from dedicated file)
      prepUploadActions(getAdapter),
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

    if (Array.isArray(this.lfValue)) {
      this.selectedFiles = this.lfValue;
    }
  }
  componentDidLoad() {
    const { debug, effects, theme } = this.#framework;
    const { label } = this.#adapter.elements.refs;

    const hasThemeRipple = theme.get.current().hasEffect("ripple");
    if (this.lfRipple && hasThemeRipple && label) {
      effects.register.ripple(label);
    }

    // Emit ready event via dispatcher
    this.#adapter.dispatcher.emit("ready", {
      selectedFiles: this.selectedFiles,
    });
    debug.info.update(this, "did-load");
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

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <UploadFC adapter={this.#adapter} />
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { effects, theme } = this.#framework ?? {};

    if (this.#adapter) {
      const { label } = this.#adapter.elements.refs;

      const hasThemeRipple = theme?.get.current().hasEffect("ripple");
      if (effects && this.lfRipple && hasThemeRipple && label) {
        effects.unregister.ripple(label);
      }
    }

    theme?.unregister(this);
  }
  //#endregion
}
