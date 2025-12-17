import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_UPLOAD_BLOCKS,
  LF_UPLOAD_PARTS,
  LfIconType,
  LfUploadAdapter,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h, VNode } from "@stencil/core";
import { FIcon } from "../../../utils/icon";

//#region Props
export interface UploadFCProps {
  adapter: LfUploadAdapter;
}
//#endregion

/**
 * FC for the upload component wrapper.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfUploadFC (pure presentational) with adapter state.
 */
export const UploadFC: FunctionalComponent<UploadFCProps> = ({ adapter }) => {
  const { controller, elements, handlers } = adapter;
  const { get, computed } = controller;

  const framework = get.framework();
  const compInstance = get.compInstance();
  const { assignRef, sanitizeProps, theme } = framework;
  const { bemClass } = theme;
  const { refs } = elements;

  const { lfHtmlAttributes, lfLabel, selectedFiles } = compInstance;
  const { hasSelectedFiles, formatFileSize, getFileIcon } = computed;

  const b = LF_UPLOAD_BLOCKS;
  const p = LF_UPLOAD_PARTS;
  const cy = CY_ATTRIBUTES;
  const lf = LF_ATTRIBUTES;

  const { "--lf-icon-clear": clearIcon } = theme.get.current().variables;

  //#region File Icon Helper
  const renderFileIcon = (file: File, isClear = false): VNode => {
    const icon = isClear ? clearIcon : getFileIcon(file);

    return (
      <div
        class={bemClass(b.fileInfo._, b.fileInfo.icon, {
          "has-actions": isClear,
        })}
        onClick={isClear ? (e) => handlers.delete(e, file) : undefined}
        part={p.icon}
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
        class={bemClass(b.fileInfo._, b.fileInfo.item)}
        data-lf={lf.fadeIn}
        key={index}
      >
        {renderFileIcon(file, false)}
        <span class={bemClass(b.fileInfo._, b.fileInfo.name)} title={file.name}>
          {file.name}
        </span>
        <span
          class={bemClass(b.fileInfo._, b.fileInfo.size)}
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
    if (!hasSelectedFiles()) {
      return null;
    }

    return (
      <div class={bemClass(b.fileInfo._)} ref={assignRef(refs, "fileInfo")}>
        {selectedFiles.map((file: File, index: number) =>
          renderFileItem(file, index),
        )}
      </div>
    );
  };
  //#endregion

  //#region Upload Section
  const renderUpload = (): VNode => {
    return (
      <div class={bemClass(b.fileUpload._)}>
        <input
          {...sanitizeProps(lfHtmlAttributes)}
          class={bemClass(b.fileUpload._, b.fileUpload.input)}
          data-cy={cy.input}
          id="upload-input"
          multiple
          onChange={() => handlers.upload()}
          ref={assignRef(refs, "input")}
          type="file"
        />
        <label
          class={bemClass(b.fileUpload._, b.fileUpload.label)}
          htmlFor="upload-input"
          onPointerDown={(e) => handlers.pointerdown(e)}
          ref={assignRef(refs, "label")}
        >
          <div class={bemClass(b.fileUpload._, b.fileUpload.text)}>
            {lfLabel}
          </div>
        </label>
      </div>
    );
  };
  //#endregion

  return (
    <div
      class={bemClass(b.upload._, null, {
        "has-description": hasSelectedFiles(),
      })}
      ref={assignRef(refs, "upload")}
    >
      {renderUpload()}
      {renderFileInfo()}
    </div>
  );
};
