import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LfIconType,
  LfUploadAdapter,
  LfUploadAdapterJsx,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { FIcon } from "../../utils/icon";

/**
 * Prepares JSX factory functions for the upload component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (hasSelectedFiles, formatFileSize, getFileIcon)
 * - Uses `controller.actions` for complex operations (handleFiles, deleteFile)
 * - Routes all events through dispatcher via handlers
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepUploadJsx = (
  getAdapter: () => LfUploadAdapter,
): LfUploadAdapterJsx => {
  return {
    //#region Upload
    upload: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, compInstance, framework } = controller.get;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const cy = CY_ATTRIBUTES;

      const { lfHtmlAttributes, lfLabel } = comp;
      const { assignRef, sanitizeProps, theme } = mgr;
      const { bemClass } = theme;
      const { refs } = elements;

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
    },
    //#endregion

    //#region File Info
    fileInfo: () => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { blocks, compInstance, framework } = controller.get;
      const { hasSelectedFiles } = controller.computed;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();

      const { selectedFiles } = comp;
      const { assignRef, theme } = mgr;
      const { bemClass } = theme;
      const { refs } = elements;

      if (!hasSelectedFiles()) {
        return null;
      }

      return (
        <div class={bemClass(b.fileInfo._)} ref={assignRef(refs, "fileInfo")}>
          {selectedFiles.map((file: File, index: number) =>
            prepUploadJsx(getAdapter).fileItem(file, index),
          )}
        </div>
      );
    },
    //#endregion

    //#region File Item
    fileItem: (file: File, index: number) => {
      const adapter = getAdapter();
      const { controller } = adapter;
      const { blocks, framework } = controller.get;
      const { formatFileSize } = controller.computed;

      const mgr = framework();
      const b = blocks();
      const lf = LF_ATTRIBUTES;

      const { theme } = mgr;
      const { bemClass } = theme;

      return (
        <div
          class={bemClass(b.fileInfo._, b.fileInfo.item)}
          data-lf={lf.fadeIn}
          key={index}
        >
          {prepUploadJsx(getAdapter).fileIcon(file, false)}
          <span
            class={bemClass(b.fileInfo._, b.fileInfo.name)}
            title={file.name}
          >
            {file.name}
          </span>
          <span
            class={bemClass(b.fileInfo._, b.fileInfo.size)}
            title={file.size.toString()}
          >
            {formatFileSize(file.size)}
          </span>
          {prepUploadJsx(getAdapter).fileIcon(file, true)}
        </div>
      );
    },
    //#endregion

    //#region File Icon
    fileIcon: (file: File, isClear = false): VNode => {
      const adapter = getAdapter();
      const { controller, handlers } = adapter;
      const { blocks, framework, parts } = controller.get;
      const { getFileIcon } = controller.computed;

      const mgr = framework();
      const b = blocks();
      const p = parts();

      const { theme } = mgr;
      const { bemClass } = theme;
      const { "--lf-icon-clear": clear } = theme.get.current().variables;

      const icon = isClear ? clear : getFileIcon(file);

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
          <FIcon framework={mgr} icon={icon as LfIconType} />
        </div>
      );
    },
    //#endregion
  };
};
