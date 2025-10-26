import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_STYLE_ID,
  LF_UPLOAD_BLOCKS,
  LF_UPLOAD_PARTS,
  LF_UPLOAD_PROPS,
  LF_WRAPPER_ID,
  LfDebugLifecycleInfo,
  LfFrameworkAllowedKeysMap,
  LfFrameworkInterface,
  LfUploadElement,
  LfUploadEvent,
  LfUploadEventPayload,
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
  VNode,
} from "@stencil/core";
import { awaitFramework } from "../../utils/setup";

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
export class LfUpload {
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
  #framework: LfFrameworkInterface;
  #b = LF_UPLOAD_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_UPLOAD_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #r: HTMLElement;
  #input: HTMLInputElement;
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
  onLfEvent(e: Event | CustomEvent, eventType: LfUploadEvent, file?: File) {
    const { effects } = this.#framework;

    switch (eventType) {
      case "delete":
        this.selectedFiles = this.selectedFiles.filter((f) => f !== file);
        break;

      case "pointerdown":
        if (this.lfRipple) {
          effects.ripple(e as PointerEvent, this.#r);
        }
        break;
    }

    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
      selectedFiles: this.selectedFiles,
    });
  }
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
      this.onLfEvent(new CustomEvent("unmount"), "unmount");
      this.rootElement.remove();
    }, ms);
  }
  //#endregion

  //#region Private methods
  #formatFileSize(size: number): string {
    const units = ["Bytes", "KB", "MB", "GB", "TB"];
    let unitIndex = 0;

    if (size > 10000) {
      size /= 1024;
      size /= 1024;
      unitIndex = 2;
    } else {
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
  #handleFileChange() {
    if (this.#input.files) {
      this.selectedFiles = Array.from(this.#input.files);
    } else {
      this.selectedFiles = [];
    }
    this.onLfEvent(new CustomEvent("upload"), "upload");
  }
  #prepFileInfo() {
    const { bemClass } = this.#framework.theme;

    const { fileInfo } = this.#b;

    return this.selectedFiles.map((file, index) => (
      <div
        class={bemClass(fileInfo._, fileInfo.item)}
        data-lf={this.#lf.fadeIn}
        key={index}
      >
        {this.#prepIcon(file)}
        <span class={bemClass(fileInfo._, fileInfo.name)} title={file.name}>
          {file.name}
        </span>
        <span
          class={bemClass(fileInfo._, fileInfo.size)}
          title={file.size.toString()}
        >
          {this.#formatFileSize(file.size)}
        </span>
        {this.#prepIcon(file, true)}
      </div>
    ));
  }
  #prepIcon = (f: File, isClear = false): VNode => {
    const { assets, theme } = this.#framework;
    const { get } = assets;
    const { bemClass } = theme;
    const { file, movie, music, pdf, photo, zip } =
      this.#framework.theme.get.icons();
    const { "--lf-icon-clear": clear } =
      this.#framework.theme.get.current().variables;

    const { fileInfo } = this.#b;

    const isLikelyImage =
      f.type.includes("image") ||
      f.type.includes("jpg") ||
      f.type.includes("png") ||
      f.type.includes("jpeg") ||
      f.type.includes("gif");

    const isLikelyAudio =
      f.type.includes("audio") ||
      f.type.includes("mp3") ||
      f.type.includes("wav") ||
      f.type.includes("ogg");

    const isLikelyVideo =
      f.type.includes("video") ||
      f.type.includes("mp4") ||
      f.type.includes("avi") ||
      f.type.includes("mov");

    const isLikelyZip =
      f.type.includes("7z") ||
      f.type.includes("zip") ||
      f.type.includes("application/zip") ||
      f.type.includes("application/x-zip-compressed");

    const isLikelyPdf = f.type.includes("pdf");

    const icon = isClear
      ? clear
      : isLikelyImage
        ? photo
        : isLikelyAudio
          ? music
          : isLikelyVideo
            ? movie
            : isLikelyPdf
              ? pdf
              : isLikelyZip
                ? zip
                : file;
    const { style } = get(`./assets/svg/${icon}.svg`);

    return (
      <div
        class={bemClass(fileInfo._, fileInfo.icon, {
          "has-actions": isClear,
        })}
        data-cy={this.#cy.maskedSvg}
        onClick={isClear ? (e) => this.onLfEvent(e, "delete", f) : null}
        part={this.#p.icon}
        style={style}
        tabIndex={isClear && 0}
        title={isClear ? "Remove file" : f.type}
      ></div>
    );
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
    if (Array.isArray(this.lfValue)) {
      this.selectedFiles = this.lfValue;
    }
  }
  componentDidLoad() {
    const { debug } = this.#framework;

    this.onLfEvent(new CustomEvent("ready"), "ready");
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
    const { sanitizeProps, theme } = this.#framework;
    const { bemClass, setLfStyle } = theme;

    const { fileInfo, fileUpload, upload } = this.#b;
    const { lfLabel, lfRipple, lfStyle, selectedFiles } = this;

    const hasSelectedFiles = !!selectedFiles?.length;
    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div
            class={bemClass(upload._, null, {
              "has-description": Boolean(selectedFiles?.length),
            })}
          >
            <div
              class={bemClass(fileUpload._)}
              onPointerDown={(e) => this.onLfEvent(e, "pointerdown")}
            >
              <input
                {...sanitizeProps(this.lfHtmlAttributes)}
                class={bemClass(fileUpload._, fileUpload.input)}
                data-cy={this.#cy.input}
                id="upload-input"
                multiple
                onChange={() => this.#handleFileChange()}
                ref={(el) => {
                  if (el) {
                    this.#input = el;
                  }
                }}
                type="file"
              />
              <label
                class={bemClass(fileUpload._, fileUpload.label)}
                data-cy={this.#cy.rippleSurface}
                data-lf={this.#lf.rippleSurface}
                htmlFor="upload-input"
                ref={(el) => {
                  if (lfRipple) {
                    this.#r = el;
                  }
                }}
              >
                <div class={bemClass(fileUpload._, fileUpload.text)}>
                  {lfLabel}
                </div>
              </label>
            </div>
            <div class={bemClass(fileInfo._)}>
              {hasSelectedFiles && this.#prepFileInfo()}
            </div>
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
