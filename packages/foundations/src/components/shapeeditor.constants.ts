import { LfShapeeditorPropsInterface } from "./shapeeditor.declarations";

//#region Blocks
/**
 * BEM block structure for the shapeeditor component.
 * Nested structure where:
 * - `string` values = BEM elements (parent__element)
 * - `object` values with `_` = BEM sub-blocks (standalone .block)
 *
 * This mirrors the actual DOM hierarchy.
 */
export const LF_SHAPEEDITOR_BLOCKS = {
  /** Root component block */
  shapeeditor: {
    _: "shapeeditor",
    grid: "grid",
    viewer: "viewer",
    /** Navigation panel - left side */
    navigation: {
      _: "navigation",
      /** Explorer sub-block (tree + expander) */
      explorer: {
        _: "explorer",
        tree: "tree",
        expander: "expander",
      },
      /** Jump sub-block (textfield + load) */
      jump: {
        _: "jump",
        textfield: "textfield",
        load: "load",
      },
      masonry: "masonry",
    },
    /** Preview panel - right top */
    preview: {
      _: "preview",
      /** History sub-block (list of snapshots) */
      history: {
        _: "history",
        list: "list",
      },
      shape: "shape",
      spinner: "spinner",
    },
    /** Settings panel - right bottom */
    settings: {
      _: "settings",
      progressbar: "progressbar",
      tree: "tree",
      /** Actions sub-block (history, delete, undo/redo, commit) */
      actions: {
        _: "actions",
        delete: "delete",
        badge: "badge",
        clear: "clear",
        redo: "redo",
        undo: "undo",
        commit: "commit",
      },
      /** Controls sub-block (snackbar, items, controlActions) */
      controls: {
        _: "controls",
        snackbar: "snackbar",
        /** Items sub-block (accordion, individual controls) */
        items: {
          _: "items",
          accordion: "accordion",
          item: "item",
          info: "info",
        },
        /** Control actions sub-block (apply, reset) */
        controlActions: {
          _: "control-actions",
          apply: "apply",
          reset: "reset",
        },
      },
    },
  },
} as const;
//#endregion

//#region Events
export const LF_SHAPEEDITOR_EVENTS = [
  "apply",
  "change",
  "lf-event",
  "preview",
  "ready",
  "reset",
  "unmount",
] as const;
//#endregion

//#region Ids
/**
 * Element IDs for the shapeeditor component.
 * Nested structure mirrors BLOCKS - use for getElementById, data-cy, etc.
 */
export const LF_SHAPEEDITOR_IDS = {
  shapeeditor: {
    _: "shapeeditor",
    navigation: {
      _: "navigation",
      explorer: {
        _: "explorer",
        tree: "explorer-tree",
        expander: "explorer-expander",
      },
      jump: {
        _: "jump",
        textfield: "jump-textfield",
        load: "jump-load",
      },
      masonry: "navigation-masonry",
    },
    preview: {
      _: "preview",
      history: {
        _: "history",
        list: "history-list",
      },
      shape: "preview-shape",
      spinner: "preview-spinner",
    },
    settings: {
      _: "settings",
      progressbar: "settings-progressbar",
      tree: "settings-tree",
      actions: {
        _: "actions",
        delete: "actions-delete",
        badge: "actions-badge",
        clear: "actions-clear",
        redo: "actions-redo",
        undo: "actions-undo",
        commit: "actions-commit",
      },
      controls: {
        _: "controls",
        snackbar: "controls-snackbar",
        items: {
          _: "items",
          accordion: "items-accordion",
        },
        controlActions: {
          _: "control-actions",
          apply: "control-actions-apply",
          reset: "control-actions-reset",
        },
      },
    },
  },
} as const;
/** Alias for convenience - provides direct access to shapeeditor's children */
export const IDS = LF_SHAPEEDITOR_IDS.shapeeditor;
//#endregion

//#region Parts
/**
 * CSS parts for the shapeeditor component.
 * Nested structure mirrors BLOCKS - use for ::part() styling.
 */
export const LF_SHAPEEDITOR_PARTS = {
  shapeeditor: {
    _: "shapeeditor",
    navigation: {
      _: "navigation",
      explorer: "explorer",
      jump: "jump",
      masonry: "masonry",
    },
    preview: {
      _: "preview",
      history: "history",
    },
    settings: {
      _: "settings",
      actions: "actions",
      controls: {
        _: "controls",
        items: "items",
        controlActions: "control-actions",
      },
    },
  },
} as const;
//#endregion

//#region Props
export const LF_SHAPEEDITOR_PROPS = [
  "lfDataset",
  "lfLoadCallback",
  "lfNavigation",
  "lfShape",
  "lfStyle",
  "lfValue",
] as const satisfies (keyof LfShapeeditorPropsInterface)[];
//#endregion
