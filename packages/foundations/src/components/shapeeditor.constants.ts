import { LfShapeeditorPropsInterface } from "./shapeeditor.declarations";

//#region Blocks
export const LF_SHAPEEDITOR_BLOCKS = {
  detailsGrid: {
    _: "details-grid",
    actions: "actions",
    preview: "preview",
    clearHistory: "clear-history",
    controlItem: "control-item",
    delete: "delete",
    infoIcon: "info-icon",
    redo: "details-redo",
    commitChanges: "commit-changes",
    shape: "shape",
    settings: "settings",
    spinner: "spinner",
    standaloneControl: "standalone-control",
    tree: "tree",
    undo: "undo",
  },
  shapeeditor: { _: "shapeeditor" },
  mainGrid: { _: "main-grid" },
  navigationGrid: {
    _: "navigation-grid",
    button: "button",
    masonry: "masonry",
    navToggle: "nav-toggle",
    tree: "tree",
    textfield: "textfield",
  },
} as const;
//#endregion

//#region Events
export const LF_SHAPEEDITOR_EVENTS = ["lf-event", "ready", "unmount"] as const;
//#endregion

//#region Ids
export const LF_SHAPEEDITOR_IDS = {
  details: {
    clearHistory: "details-clear-history",
    deleteShape: "details-delete-shape",
    redo: "details-redo",
    save: "details-save",
    shape: "details-shape",
    spinner: "details-spinner",
    tree: "details-tree",
    undo: "details-undo",
  },
  navigation: {
    load: "navigation-load",
    masonry: "navigation-masonry",
    navToggle: "navigation-nav-toggle",
    tree: "navigation-tree",
    textfield: "navigation-textfield",
  },
} as const;
/** Alias for convenience in component files */
export { LF_SHAPEEDITOR_IDS as IDS };
//#endregion

//#region Parts
export const LF_SHAPEEDITOR_PARTS = {
  details: "details",
  shapeeditor: "shapeeditor",
  navigation: "navigation",
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
