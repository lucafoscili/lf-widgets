//#region Blocks
/**
 * BEM block structure for the messenger component.
 * Nested structure where:
 * - `string` values = BEM elements (parent__element)
 * - `object` values with `_` = BEM sub-blocks (standalone .block)
 *
 * This mirrors the actual DOM hierarchy.
 *
 * @remarks
 * This file is intentionally separate to avoid circular dependency issues
 * when using `typeof` for type inference.
 */
export const LF_MESSENGER_BLOCKS = {
  /** Root component block */
  messenger: {
    _: "messenger",
    emptyData: "empty-data",
    roster: "roster",
    /** Character sub-block */
    character: {
      _: "character",
      avatar: "avatar",
      biography: "biography",
      image: "image",
      label: "label",
      name: "name",
      nameWrapper: "name-wrapper",
      saveButton: "save-button",
      status: "status",
    },
    /** Chat sub-block */
    chat: {
      _: "chat",
      chat: "chat",
      expander: "expander",
      navigation: "navigation",
    },
    /** Covers sub-block */
    covers: {
      _: "covers",
      add: "add",
      images: "images",
      label: "label",
      title: "title",
    },
    /** Extra context sub-block */
    extraContext: {
      _: "extra-context",
      list: "list",
      options: "options",
    },
    /** Form sub-block */
    form: {
      _: "form",
      button: "button",
      confirm: "confirm",
      field: "field",
      label: "label",
    },
    /** List sub-block */
    list: {
      _: "list",
      actions: "actions",
      image: "image",
    },
    /** Options sub-block */
    options: {
      _: "options",
      blocker: "blocker",
      blockerIcon: "blocker-icon",
      blockerLabel: "blocker-label",
      cover: "cover",
      info: "info",
      label: "label",
      name: "name",
      placeholder: "placeholder",
      placeholderIcon: "placeholder-icon",
      wrapper: "wrapper",
    },
    /** Roster sub-block */
    roster_sub: {
      _: "roster",
      emptyData: "empty-data",
      image: "image",
      label: "label",
      name: "name",
      portrait: "portrait",
    },
  },
} as const;

/**
 * Type for the messenger blocks structure.
 */
export type LfMessengerBlocksType = typeof LF_MESSENGER_BLOCKS;
/**
 * Type for the messenger block (inner messenger object).
 * Used by adapter getters.
 */
export type LfMessengerBlockType = LfMessengerBlocksType["messenger"];
//#endregion
