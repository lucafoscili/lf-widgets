import { LfDataDataset } from "../framework/data.declarations";
import { LfThemeIcon, LfThemeInterface } from "../framework/theme.declarations";
import {
  LfMessengerChildTypes,
  LfMessengerImageRootIds,
  LfMessengerImageTypes,
  LfMessengerOptionTypes,
  LfMessengerPropsInterface,
  LfMessengerUI,
} from "./messenger.declarations";

//#region Blocks
export const LF_MESSENGER_BLOCKS = {
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
  chat: {
    _: "chat",
    chat: "chat",
    expander: "expander",
    navigation: "navigation",
  },
  covers: {
    _: "covers",
    add: "add",
    images: "images",
    label: "label",
    title: "title",
  },
  extraContext: {
    _: "extra-context",
    list: "list",
    options: "options",
  },
  form: {
    _: "form",
    button: "button",
    confirm: "confirm",
    field: "field",
    label: "label",
  },
  list: {
    _: "list",
    actions: "actions",
    image: "image",
  },
  messenger: { _: "messenger" },
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
  roster: {
    _: "roster",
    emptyData: "empty-data",
    image: "image",
    label: "label",
    name: "name",
    portrait: "portrait",
  },
} as const;
//#endregion

//#region Clean UI flags
/**
 * Returns a clean/default UI configuration object for the LF Messenger component.
 *
 * @returns {LfMessengerUI} An object containing the default UI state with:
 * - customizationView: View state for customization panel
 * - filters: States for different filter visibility options
 * - form: States for different form element visibility
 * - options: Available feature toggles
 * - panels: Collapse states for left and right panels
 */
export const LF_MESSENGER_CLEAN_UI = (): LfMessengerUI => {
  return {
    customizationView: false,
    filters: {
      avatars: false,
      locations: false,
      outfits: false,
      styles: false,
      timeframes: false,
    },
    form: {
      avatars: false,
      locations: false,
      outfits: false,
      styles: false,
      timeframes: false,
    },
    options: {
      locations: true,
      outfits: true,
      styles: true,
      timeframes: true,
    },
    panels: {
      isLeftCollapsed: false,
      isRightCollapsed: false,
    },
  };
};
//#endregion

//#region Parts
export const LF_MESSENGER_PARTS = {
  emptyData: "empty-data",
  messenger: "messenger",
  roster: "roster",
} as const;
//#endregion

//#region Props
export const LF_MESSENGER_PROPS = [
  "lfAutosave",
  "lfDataset",
  "lfStyle",
  "lfValue",
] as const satisfies (keyof LfMessengerPropsInterface)[];
//#endregion

//#region Ids
/**
 * Object containing constant ID values used throughout the messenger component.
 * @constant
 * @property {Object} chat - IDs related to chat elements
 * @property {string} chat.leftExpander - ID for the left expansion control
 * @property {string} chat.rightExpander - ID for the right expansion control
 * @property {Object} options - IDs related to option buttons
 * @property {string} options.back - ID for the back navigation button
 * @property {string} options.customize - ID for the customization button
 */
export const LF_MESSENGER_IDS = {
  chat: {
    leftExpander: "left-expander",
    rightExpander: "right-expaner",
  },
  options: {
    back: "back-button",
    customize: "customize-button",
  },
} as const;
//#endregion

export const AVATAR_COVER: LfThemeIcon = "id" as const;
export const LOCATION_COVER: LfThemeIcon = "sunset-2" as const;
export const OUTFIT_COVER: LfThemeIcon = "shirt" as const;
export const STYLE_COVER: LfThemeIcon = "color-swatch" as const;
export const TIMEFRAME_COVER: LfThemeIcon = "calendar-clock" as const;
/**
 * Array containing various cover icon types used in the messenger component.
 * @constant {string[]} COVER_ICONS
 */
export const COVER_ICONS = [
  AVATAR_COVER,
  LOCATION_COVER,
  OUTFIT_COVER,
  STYLE_COVER,
  TIMEFRAME_COVER,
] as const;

/**
 * Dataset representing filter options for the messenger component.
 * Contains a list of selectable nodes, each representing a different filter category.
 * Each node includes:
 * - description: A text description of what the filter shows
 * - icon: The cover image/icon for the filter category
 * - id: Unique identifier for the filter
 * - value: Display name of the filter category
 *
 * @constant
 * @type {LfDataDataset}
 */
export const LF_MESSENGER_FILTER: LfDataDataset = {
  nodes: [
    {
      description: "View avatars",
      icon: AVATAR_COVER,
      id: "avatars",
      value: "Avatars",
    },
    {
      description: "View outfits",
      icon: OUTFIT_COVER,
      id: "outfits",
      value: "Outfits",
    },
    {
      description: "View locations",
      icon: LOCATION_COVER,
      id: "locations",
      value: "Locations",
    },
    {
      description: "View styles",
      icon: STYLE_COVER,
      id: "styles",
      value: "Styles",
    },
    {
      description: "View timeframes",
      icon: TIMEFRAME_COVER,
      id: "timeframes",
      value: "Timeframes",
    },
  ],
} as const;

export const LF_MESSENGER_MENU = (theme: LfThemeInterface): LfDataDataset => {
  const { "--lf-icon-download": download, "--lf-icon-settings": settings } =
    theme.get.current().variables;

  return {
    nodes: [
      {
        children: [
          {
            description: "Download the LF Widgets JSON, used as a dataset.",
            icon: download,
            id: "lfDataset",
            value: "Download dataset",
          },
          {
            description: "Download the current configuration settings.",
            icon: settings,
            id: "settings",
            value: "Download configuration",
          },
        ],
        id: "root",
        value: "",
      },
    ],
  };
};

/**
 * Maps child component types to their corresponding image asset directory names.
 * This mapping is used to determine where to find images for different messenger child components.
 *
 * @constant
 * @type {Record<LfMessengerChildTypes, LfMessengerImageTypes>}
 *
 * @example
 * // If childType is 'avatar', the corresponding image directory would be 'avatars'
 * const imageDir = CHILD_ROOT_MAP[childType];
 */
export const CHILD_ROOT_MAP: Record<
  LfMessengerChildTypes,
  LfMessengerImageTypes
> = {
  avatar: "avatars",
  location: "locations",
  outfit: "outfits",
  style: "styles",
  timeframe: "timeframes",
} as const;

/**
 * Array of valid option types for the messenger component.
 * Contains predefined categories used for organizing messenger options.
 * @type {LfMessengerOptionTypes[]}
 * @readonly
 */
export const OPTION_TYPE_IDS: LfMessengerOptionTypes[] = [
  "locations",
  "outfits",
  "styles",
  "timeframes",
] as const;

export const IMAGE_TYPE_IDS: LfMessengerImageRootIds<LfMessengerImageTypes>[] =
  ["avatars", ...OPTION_TYPE_IDS] as const;

export const LF_MESSENGER_NAV = (theme: LfThemeInterface): LfDataDataset => {
  const { "--lf-icon-next": next, "--lf-icon-previous": previous } =
    theme.get.current().variables;

  return {
    nodes: [
      {
        description: "Previous character",
        icon: previous,
        id: "previous",
        value: "",
      },
      {
        description: "Character selection",
        id: "character_list",
        value: "Character list",
      },
      {
        description: "Next character",
        icon: next,
        id: "next",
        value: "",
      },
    ],
  };
};
