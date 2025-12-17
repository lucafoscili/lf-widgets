import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_UPLOAD_BLOCKS,
  LF_UPLOAD_PARTS,
  LfFrameworkAllowedKeysMap,
  LfFrameworkInterface,
  LfIconType,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h, VNode } from "@stencil/core";
import { FIcon } from "../../utils/icon";

//#region Props Interface
/**
 * Props interface for the pure presentational LfUploadFC.
 *
 * This interface removes the `lf*` prefix convention used by Web Components
 * and uses direct prop names instead. All state is owned by the parent;
 * the FC is purely presentational.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export interface LfUploadFCProps {
  /** Reference callback for the upload container element */
  uploadRef?: (el: HTMLDivElement | null) => void;
  /** Assigned class for custom styling */
  className?: string;
  /** Framework instance for theming utilities (required) */
  framework: LfFrameworkInterface;
  /** Unique identifier for the component */
  id?: string;
  /** Selected files to display */
  files?: File[];
  /** Format file size callback */
  formatFileSize?: (size: number) => string;
  /** Get file icon callback */
  getFileIcon?: (file: File) => string;
  /** Allows customization of the input element */
  htmlAttributes?: Partial<LfFrameworkAllowedKeysMap>;
  /** Sets the button's label */
  label?: string;
  /** Callback fired when file input changes */
  onFileChange?: (e: Event) => void;
  /** Callback fired on delete button click */
  onFileDelete?: (e: Event, file: File) => void;
  /** Callback fired on label pointerdown */
  onPointerDown?: (e: PointerEvent) => void;
  /** Custom CSS styles to apply */
  style?: { [key: string]: string };
  /**
   * UI size multiplier for the component.
   * Controls font-size scaling.
   * @default "medium"
   */
  uiSize?: LfThemeUISize;
  /**
   * UI state for theming (primary, success, warning, danger, etc.).
   * Controls color scheme.
   * @default "primary"
   */
  uiState?: LfThemeUIState;
}
//#endregion

/**
 * LfUploadFC - Functional Component for Upload
 *
 * This is a stateless functional component that renders an upload widget.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-upload Web Component (thin wrapper)
 * 2. Inside other components (composed usage)
 * 3. Via LfShape rendering (if upload becomes a data shape)
 *
 * Benefits over direct WC usage in compositions:
 * - No Shadow DOM overhead (single shadow root for parent)
 * - No lifecycle hooks per instance
 * - No theme registration per instance
 * - Direct callbacks instead of CustomEvent dispatch
 * - State flows unidirectionally from parent
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export const LfUploadFC: FunctionalComponent<LfUploadFCProps> = ({
  uploadRef,
  className,
  framework,
  id,
  files = [],
  formatFileSize = (size: number) => `${size} bytes`,
  getFileIcon = () => "document",
  htmlAttributes,
  label = "Upload files...",
  onFileChange,
  onFileDelete,
  onPointerDown,
  style,
  uiSize = "medium",
  uiState = "primary",
}) => {
  const { bemClass } = framework.theme;
  const { sanitizeProps } = framework;

  const blocks = LF_UPLOAD_BLOCKS;
  const parts = LF_UPLOAD_PARTS;
  const cy = CY_ATTRIBUTES;
  const lf = LF_ATTRIBUTES;

  const { fileInfo, fileUpload, upload } = blocks;

  const hasFiles = files && files.length > 0;

  // Build style object with size variable if not medium (default)
  const computedStyle =
    uiSize !== "medium"
      ? { ...style, "--lf-fc-ui-size": `var(--lf-ui-size-${uiSize})` }
      : style;

  // Get clear icon from theme
  const { "--lf-icon-clear": clearIcon } =
    framework.theme.get.current().variables;

  //#region File Icon Helper
  const renderFileIcon = (file: File, isClear = false): VNode => {
    const icon = isClear ? clearIcon : getFileIcon(file);

    return (
      <div
        class={bemClass(fileInfo._, fileInfo.icon, {
          "has-actions": isClear,
        })}
        onClick={isClear ? (e) => onFileDelete?.(e, file) : undefined}
        part={parts.icon}
        tabIndex={isClear ? 0 : undefined}
        title={isClear ? "Remove file" : file.type}
      >
        <FIcon framework={framework} icon={icon as LfIconType} />
      </div>
    );
  };
  //#endregion

  //#region File Item Helper
  const renderFileItem = (file: File, index: number): VNode => {
    return (
      <div
        class={bemClass(fileInfo._, fileInfo.item)}
        data-lf={lf.fadeIn}
        key={index}
      >
        {renderFileIcon(file, false)}
        <span class={bemClass(fileInfo._, fileInfo.name)} title={file.name}>
          {file.name}
        </span>
        <span
          class={bemClass(fileInfo._, fileInfo.size)}
          title={file.size.toString()}
        >
          {formatFileSize(file.size)}
        </span>
        {renderFileIcon(file, true)}
      </div>
    );
  };
  //#endregion

  //#region File Info Section
  const renderFileInfo = (): VNode | null => {
    if (!hasFiles) {
      return null;
    }

    return (
      <div class={bemClass(fileInfo._)} part={parts.fileInfo}>
        {files.map((file: File, index: number) => renderFileItem(file, index))}
      </div>
    );
  };
  //#endregion

  //#region Upload Section
  const renderUploadArea = (): VNode => {
    return (
      <div class={bemClass(fileUpload._)}>
        <input
          {...sanitizeProps(htmlAttributes)}
          class={bemClass(fileUpload._, fileUpload.input)}
          data-cy={cy.input}
          id="upload-input"
          multiple
          onChange={(e) => onFileChange?.(e)}
          type="file"
        />
        <label
          class={bemClass(fileUpload._, fileUpload.label)}
          htmlFor="upload-input"
          onPointerDown={(e) => onPointerDown?.(e)}
        >
          <div class={bemClass(fileUpload._, fileUpload.text)}>{label}</div>
        </label>
      </div>
    );
  };
  //#endregion

  return (
    <div
      class={`${bemClass(upload._, null, { "has-description": hasFiles })}${className ? ` ${className}` : ""}`}
      data-lf={uiState}
      id={id}
      part={parts.upload}
      ref={uploadRef}
      style={computedStyle}
    >
      {renderUploadArea()}
      {renderFileInfo()}
    </div>
  );
};
