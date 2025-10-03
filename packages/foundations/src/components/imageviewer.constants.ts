import { LfImageviewerPropsInterface } from "./imageviewer.declarations";

//#region Blocks
export const LF_IMAGEVIEWER_BLOCKS = {
  detailsGrid: {
    _: "details-grid",
    actions: "actions",
    canvas: "canvas",
    clearHistory: "clear-history",
    delete: "delete",
    redo: "details-redo",
    commitChanges: "commit-changes",
    preview: "preview",
    settings: "settings",
    spinner: "spinner",
    tree: "tree",
    undo: "undo",
  },
  imageviewer: { _: "imageviewer" },
  mainGrid: { _: "main-grid" },
  navigationGrid: {
    _: "navigation-grid",
    content: "content",
    button: "button",
    masonry: "masonry",
    tree: "tree",
    treeContent: "tree-content",
    treeHeader: "tree-header",
    treeShell: "tree-shell",
    treeToggle: "tree-toggle",
    textfield: "textfield",
  },
} as const;
//#endregion

//#region Events
export const LF_IMAGEVIEWER_EVENTS = ["lf-event", "ready", "unmount"] as const;
//#endregion

//#region Ids
export const IDS = {
  details: {
    canvas: "details-canvas",
    clearHistory: "details-clear-history",
    deleteShape: "details-delete-shape",
    redo: "details-redo",
    save: "details-save",
    spinner: "details-spinner",
    tree: "details-tree",
    undo: "details-undo",
  },
  navigation: {
    load: "navigation-load",
    masonry: "navigation-masonry",
    tree: "navigation-tree",
    treeToggle: "navigation-tree-toggle",
    textfield: "navigation-textfield",
  },
} as const;
//#endregion

//#region Parts
export const LF_IMAGEVIEWER_PARTS = {
  details: "details",
  imageviewer: "imageviewer",
  navigation: "navigation",
} as const;
//#endregion

//#region Props
export const LF_IMAGEVIEWER_PROPS = [
  "lfDataset",
  "lfLoadCallback",
  "lfNavigationTree",
  "lfStyle",
  "lfTreeProps",
  "lfValue",
] as const satisfies (keyof LfImageviewerPropsInterface)[];
//#endregion
