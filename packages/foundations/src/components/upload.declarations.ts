import {
  LfComponentAdapter,
  LfComponentAdapterActions,
  LfComponentAdapterBaseGetters,
  LfComponentAdapterComputed,
  LfComponentAdapterDispatchDetail,
  LfComponentAdapterDispatcher,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
} from "../foundations/adapter.declarations";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfFrameworkAllowedKeysMap } from "../framework";
import {
  LF_UPLOAD_BLOCKS,
  LF_UPLOAD_EVENTS,
  LF_UPLOAD_IDS,
  LF_UPLOAD_PARTS,
} from "./upload.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-upload` component. It merges the shared component contract with the component-specific props.
 */
export interface LfUploadInterface
  extends LfComponent<"LfUpload">,
    LfUploadPropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfUploadEventPayload) => void;
  };
  /**
   * Internal runtime state for selected files.
   */
  selectedFiles: File[];
}
/**
 * DOM element type for the custom element registered as `lf-upload`.
 */
export interface LfUploadElement
  extends HTMLStencilElement,
    Omit<LfUploadInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-upload` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived predicates (hasSelectedFiles, formatFileSize, getFileIcon)
 * - controller.actions: Complex operations (handleFiles, deleteFile)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfUploadAdapter
  extends LfComponentAdapter<
    LfUploadInterface,
    LfUploadEventPayload,
    LfUploadAdapterHandlers,
    LfUploadAdapterJsx,
    LfUploadAdapterRefs,
    LfUploadAdapterControllerGetters,
    never,
    LfUploadAdapterControllerComputed,
    LfUploadAdapterControllerActions
  > {
  controller: {
    get: LfUploadAdapterControllerGetters;
    computed: LfUploadAdapterControllerComputed;
    actions: LfUploadAdapterControllerActions;
  };
  elements: {
    jsx: LfUploadAdapterJsx;
    refs: LfUploadAdapterRefs;
  };
  handlers: LfUploadAdapterHandlers;
  dispatcher: LfUploadAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_UPLOAD_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfUploadAdapterRefs extends LfComponentAdapterRefs {
  input: HTMLInputElement | null;
  label: HTMLElement | null;
  fileInfo: HTMLElement | null;
  upload: HTMLElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfUploadAdapterJsx extends LfComponentAdapterJsx {
  upload: () => VNode;
  fileInfo: () => VNode | VNode[];
  fileItem: (file: File, index: number) => VNode;
  fileIcon: (file: File, isClear?: boolean) => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfUploadAdapterHandlers extends LfComponentAdapterHandlers {
  delete: (e: Event, file: File) => void;
  pointerdown: (e: PointerEvent) => void;
  upload: () => void;
}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfUploadAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfUploadInterface,
    typeof LF_UPLOAD_BLOCKS,
    typeof LF_UPLOAD_IDS,
    typeof LF_UPLOAD_PARTS
  > {}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfUploadAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether any files are currently selected */
  hasSelectedFiles: () => boolean;
  /** Formats a file size to human-readable string */
  formatFileSize: (size: number) => string;
  /** Gets the appropriate icon for a file type */
  getFileIcon: (file: File) => string;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfUploadAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Handle files from input change */
  handleFiles: (files: FileList | null) => void;
  /** Delete a specific file from the selection */
  deleteFile: (file: File) => void;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfUploadAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfUploadEventPayload>;
export type LfUploadAdapterDispatcherDetailOverrides = {
  [E in LfUploadEvent]: E extends "delete"
    ? LfUploadAdapterDispatchDetailBase & { originalEvent: Event }
    : E extends "pointerdown"
      ? LfUploadAdapterDispatchDetailBase & { originalEvent: PointerEvent }
      : E extends "upload"
        ? LfUploadAdapterDispatchDetailBase & { originalEvent?: Event }
        : E extends "ready" | "unmount"
          ? Omit<LfUploadAdapterDispatchDetailBase, "originalEvent"> & {
              originalEvent?: never;
            }
          : LfUploadAdapterDispatchDetailBase;
};
export type LfUploadAdapterDispatcher = LfComponentAdapterDispatcher<
  LfUploadEventPayload,
  LfUploadAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-upload`.
 */
export type LfUploadEvent = (typeof LF_UPLOAD_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-upload` events.
 */
export interface LfUploadEventPayload
  extends LfEventPayload<"LfUpload", LfUploadEvent> {
  selectedFiles: File[];
}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-upload` component.
 */
export interface LfUploadPropsInterface {
  lfHtmlAttributes?: Partial<LfFrameworkAllowedKeysMap>;
  lfLabel?: string;
  lfRipple?: boolean;
  lfStyle?: string;
  lfValue?: File[];
}
//#endregion
