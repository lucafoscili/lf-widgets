import {
  LfComponentAdapter,
  LfComponentAdapterBaseGetters,
  LfComponentAdapterDispatchDetail,
  LfComponentAdapterDispatcher,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
  LfComponentAdapterSetters,
} from "../foundations/adapter.declarations";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import {
  LfChatElement,
  LfChatEventPayload,
  LfChatPropsInterface,
  LfChatStatus,
} from "./chat.declarations";
import { LfChipElement, LfChipEventPayload } from "./chip.declarations";
import { LfCodeElement } from "./code.declarations";
import { LfImageElement } from "./image.declarations";
import { LfListEventPayload } from "./list.declarations";
import { LfMessengerBlockType } from "./messenger.blocks";
import {
  LF_MESSENGER_EVENTS,
  LF_MESSENGER_IDS,
  LF_MESSENGER_PARTS,
} from "./messenger.constants";
import { LfTabbarElement, LfTabbarEventPayload } from "./tabbar.declarations";

//#region Class
/**
 * Primary interface implemented by the `lf-messenger` component. It merges the shared component contract with the component-specific props.
 */
export interface LfMessengerInterface
  extends LfComponent<"LfMessenger">,
    LfMessengerPropsInterface {
  /**
   * Removes a specific child node from the messenger's image structure.
   * @param node - The child node to be removed from the messenger tree
   * @param type - The type of image messenger structure to modify
   * @returns A Promise that resolves when the deletion is complete
   */
  deleteOption: (
    node: LfMessengerBaseChildNode<LfMessengerUnionChildIds>,
    type: LfMessengerImageTypes,
  ) => Promise<void>;
  /**
   * Resets the messenger component to its initial state.
   * @returns A promise that resolves when the reset is complete
   */
  reset: () => Promise<void>;
  /**
   * Asynchronously saves the current messenger state.
   * @returns A Promise that resolves when the save operation is complete.
   */
  save: () => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-messenger`.
 */
export interface LfMessengerElement
  extends HTMLStencilElement,
    Omit<LfMessengerInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-messenger` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Pure state reads (ALL must be functions `() => T`)
 * - controller.set: Simple single-value assignments
 * - controller.computed: Derived values, predicates (pure functions)
 * - controller.actions: Multi-step operations (toggles, batch changes)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks grouped by panel
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfMessengerAdapter
  extends LfComponentAdapter<
    LfMessengerInterface,
    LfMessengerEventPayload,
    LfMessengerAdapterHandlers,
    LfMessengerAdapterJsx,
    LfMessengerAdapterRefs,
    LfMessengerAdapterControllerGetters,
    LfMessengerAdapterControllerSetters,
    LfMessengerAdapterControllerComputed,
    LfMessengerAdapterControllerActions
  > {
  controller: {
    get: LfMessengerAdapterControllerGetters;
    set: LfMessengerAdapterControllerSetters;
    computed: LfMessengerAdapterControllerComputed;
    actions: LfMessengerAdapterControllerActions;
  };
  dispatcher: LfMessengerAdapterDispatcher;
  elements: {
    jsx: LfMessengerAdapterJsx;
    refs: LfMessengerAdapterRefs;
  };
  handlers: LfMessengerAdapterHandlers;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfMessengerAdapterJsx extends LfComponentAdapterJsx {
  character: {
    avatar: () => VNode;
    biography: () => VNode;
    save: () => VNode;
    statusIcon: () => VNode;
  };
  chat: {
    chat: () => VNode;
    leftExpander: () => VNode;
    rightExpander: () => VNode;
    tabbar: () => VNode;
  };
  customization: {
    filters: () => VNode;
    form: {
      [K in LfMessengerImageTypes]: {
        add: () => VNode;
        cancel: () => VNode;
        confirm: () => VNode;
        id: (id: LfMessengerUnionChildIds) => VNode;
        title: (
          node?: LfMessengerBaseChildNode<LfMessengerUnionChildIds>,
        ) => VNode;
        imageUrl: (
          node?: LfMessengerBaseChildNode<LfMessengerUnionChildIds>,
        ) => VNode;
        description: (
          node?: LfMessengerBaseChildNode<LfMessengerUnionChildIds>,
        ) => VNode;
      };
    };
    list: {
      edit: (
        type: LfMessengerImageTypes,
        node: LfMessengerBaseChildNode<LfMessengerUnionChildIds>,
      ) => VNode;
      remove: (
        type: LfMessengerImageTypes,
        node: LfMessengerBaseChildNode<LfMessengerUnionChildIds>,
      ) => VNode;
    };
  };
  options: {
    back: () => VNode;
    customize: () => VNode;
  };
}
/**
 * Strongly typed DOM references captured by the component adapter.
 */
export interface LfMessengerAdapterRefs extends LfComponentAdapterRefs {
  character: {
    avatar: HTMLImageElement;
    biography: LfCodeElement;
    save: HTMLButtonElement;
    statusIcon: LfImageElement;
  };
  chat: {
    chat: LfChatElement;
    leftExpander: HTMLButtonElement;
    rightExpander: HTMLButtonElement;
    tabbar: LfTabbarElement;
  };
  customization: {
    filters: LfChipElement;
    form: {
      [K in LfMessengerImageTypes]: {
        add: HTMLButtonElement;
        cancel: HTMLButtonElement;
        confirm: HTMLButtonElement;
        id: HTMLInputElement | HTMLTextAreaElement;
        title: HTMLInputElement | HTMLTextAreaElement;
        imageUrl: HTMLInputElement | HTMLTextAreaElement;
        description: HTMLInputElement | HTMLTextAreaElement;
      };
    };
    list: {
      edit: HTMLButtonElement;
      remove: HTMLButtonElement;
    };
  };
  options: {
    back: HTMLButtonElement;
    customize: HTMLButtonElement;
  };
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfMessengerAdapterHandlers extends LfComponentAdapterHandlers {
  character: {
    button: (e: MouseEvent) => Promise<void>;
    list: (e: CustomEvent<LfListEventPayload>) => Promise<void>;
  };
  chat: {
    button: (e: MouseEvent, id: string) => Promise<void>;
    chat: (e: CustomEvent<LfChatEventPayload>) => Promise<void>;
    tabbar: (e: CustomEvent<LfTabbarEventPayload>) => Promise<void>;
  };
  customization: {
    button: <
      T1 extends LfMessengerImageTypes,
      T2 extends LfMessengerBaseChildNode<LfMessengerUnionChildIds>,
    >(
      e: MouseEvent,
      type: T1,
      action: "add" | "cancel" | "confirm" | "edit" | "delete",
      node: T2,
    ) => Promise<void>;
    chip: (e: CustomEvent<LfChipEventPayload>) => Promise<void>;
    image: <T extends LfMessengerUnionChildIds>(
      e: MouseEvent,
      node: LfMessengerBaseChildNode<T>,
      index: number,
    ) => Promise<void>;
  };
  options: {
    button: (e: MouseEvent, id: string) => Promise<void>;
  };
}
/**
 * Read-only controller surface exposed by the adapter for integration code.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 * Contains ONLY pure state reads - predicates go in `computed`.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfMessengerAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfMessengerInterface,
    LfMessengerBlockType,
    (typeof LF_MESSENGER_IDS)["messenger"],
    (typeof LF_MESSENGER_PARTS)["messenger"]
  > {
  /** Character state reads */
  character: {
    /** Get character biography text */
    biography: (character?: LfMessengerCharacterNode) => string;
    /** Get character by ID */
    byId: (id: string) => LfMessengerCharacterNode;
    /** Get chat configuration for character */
    chat: (character?: LfMessengerCharacterNode) => LfChatPropsInterface;
    /** Get currently selected character */
    current: () => LfMessengerCharacterNode;
    /** Get chat history for character */
    history: (character?: LfMessengerCharacterNode) => string;
    /** Get all characters */
    list: () => LfMessengerCharacterNode[];
    /** Get character name */
    name: (character?: LfMessengerCharacterNode) => string;
    /** Get next character in list */
    next: (character?: LfMessengerCharacterNode) => LfMessengerCharacterNode;
    /** Get previous character in list */
    previous: (
      character?: LfMessengerCharacterNode,
    ) => LfMessengerCharacterNode;
  };
  /** Configuration state reads */
  config: () => LfMessengerConfig;
  /** Dataset state reads */
  data: () => LfMessengerDataset;
  /** History state reads */
  history: () => LfMessengerHistory;
  /** Image state reads */
  image: {
    /** Get image as cover with metadata */
    asCover: <T extends LfMessengerImageTypes>(
      type: T,
      character?: LfMessengerCharacterNode,
    ) => {
      node?: LfMessengerBaseChildNode<LfMessengerUnionChildIds>;
      title?: string;
      value: string;
    };
    /** Get images by type */
    byType: <T extends LfMessengerImageTypes>(
      type: T,
      character?: LfMessengerCharacterNode,
    ) => Array<LfMessengerBaseChildNode<LfMessengerUnionChildIds>>;
    /** Get cover index for image type */
    coverIndex: (
      type: LfMessengerImageTypes,
      character?: LfMessengerCharacterNode,
    ) => number;
    /** Generate new ID for image type */
    newId: <T extends LfMessengerImageTypes>(
      type: T,
    ) => LfMessengerChildIds<LfMessengerUnionChildIds>;
    /** Get root node for image type */
    root: <T extends LfMessengerImageTypes>(
      type: T,
      character?: LfMessengerCharacterNode,
    ) => LfMessengerBaseRootNode<LfMessengerImageTypes>;
    /** Get image title */
    title: <T extends LfMessengerUnionChildIds>(
      node: LfMessengerBaseChildNode<T>,
    ) => string;
  };
  /** Status state reads */
  status: {
    /** Get connection status */
    connection: () => LfChatStatus;
    /** Get form editing status map */
    formStatus: () => LfMessengerEditingStatus<LfMessengerImageTypes>;
    /** Get currently hovered customization option */
    hoveredCustomizationOption: () => LfMessengerBaseChildNode<LfMessengerUnionChildIds>;
    /** Save operation status */
    save: {
      /** Whether save is in progress */
      inProgress: () => boolean;
    };
  };
  /** UI state reads */
  ui: () => LfMessengerUI;
}
/**
 * Simple single-value assignments exposed by the adapter.
 * Each setter performs exactly ONE state change.
 * Multi-step operations go in `actions`.
 */
export interface LfMessengerAdapterControllerSetters
  extends LfComponentAdapterSetters {
  /** Character setters */
  character: {
    /** Set chat configuration */
    chat: (
      chat: LfChatPropsInterface,
      character?: LfMessengerCharacterNode,
    ) => void;
    /** Set current character */
    current: (character?: LfMessengerCharacterNode) => void;
    /** Set chat history */
    history: (history: string, character?: LfMessengerCharacterNode) => void;
  };
  /** Persist dataset */
  data: () => void;
  /** Image setters */
  image: {
    /** Set cover index */
    cover: (
      type: LfMessengerImageTypes,
      value: number,
      character?: LfMessengerCharacterNode,
    ) => void;
  };
  /** Status setters */
  status: {
    /** Set connection status */
    connection: (status: LfChatStatus) => void;
    /** Set editing status */
    editing: <T extends LfMessengerUnionChildIds>(
      type: LfMessengerImageTypes,
      id: LfMessengerChildIds<T>,
    ) => void;
    /** Set hovered customization option */
    hoveredCustomizationOption: <T extends LfMessengerUnionChildIds>(
      node: LfMessengerBaseChildNode<T>,
    ) => void;
    /** Save status setters */
    save: {
      /** Set save in progress flag */
      inProgress: (value: boolean) => void;
    };
  };
  /** UI setters */
  ui: {
    /** Set customization view visibility */
    customization: (value: boolean) => void;
    /** Set filters */
    filters: (filter: LfMessengerFilters) => void;
    /** Set option visibility */
    options: <T extends LfMessengerImageRootIds<LfMessengerOptionTypes>>(
      value: boolean,
      type: LfMessengerRootIds<T>,
    ) => void;
    /** Toggle panel collapsed state */
    panel: (panel: LfMessengerPanelsValue, value?: boolean) => boolean;
    /** Set form state */
    setFormState: <T extends LfMessengerUnionChildIds>(
      value: boolean,
      type: LfMessengerImageTypes,
      node?: LfMessengerBaseChildNode<T>,
    ) => void;
  };
}
/**
 * Derived values and predicates computed from state.
 * Pure functions with no side effects.
 */
export interface LfMessengerAdapterControllerComputed {
  /** Character computed values */
  character: {
    /** Whether a character is currently selected */
    hasCharacter: () => boolean;
    /** Whether the given ID matches the current character */
    isCurrentCharacter: (id: string) => boolean;
  };
  /** Image computed values */
  image: {
    /** Whether there are any images of the given type */
    hasImages: (type: LfMessengerImageTypes) => boolean;
  };
  /** UI computed values */
  ui: {
    /** Whether the given panel is collapsed */
    isPanelCollapsed: (panel: LfMessengerPanelsValue) => boolean;
    /** Whether the customization view is active */
    isCustomizing: () => boolean;
    /** Whether the given filter is active */
    isFilterActive: (filter: LfMessengerImageTypes) => boolean;
    /** Whether the given option is enabled */
    isOptionEnabled: (option: LfMessengerOptionTypes) => boolean;
  };
}
/**
 * Multi-step operations that may batch changes or toggle state.
 * May have side effects.
 */
export interface LfMessengerAdapterControllerActions {
  /** Character actions */
  character: {
    /** Navigate to next character */
    next: (character?: LfMessengerCharacterNode) => void;
    /** Navigate to previous character */
    previous: (character?: LfMessengerCharacterNode) => void;
    /** Select a character by node */
    select: (character: LfMessengerCharacterNode) => void;
  };
  /** UI actions */
  ui: {
    /** Toggle panel collapsed state */
    togglePanel: (panel: LfMessengerPanelsValue) => void;
    /** Toggle customization view */
    toggleCustomization: () => void;
    /** Toggle filter */
    toggleFilter: (filter: LfMessengerImageTypes) => void;
    /** Toggle option */
    toggleOption: (option: LfMessengerOptionTypes) => void;
  };
}
//#endregion

//#region Dispatcher
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfMessengerAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfMessengerEventPayload>;
export type LfMessengerAdapterDispatcherDetailOverrides = {
  [E in LfMessengerEvent]: E extends "ready" | "unmount"
    ? Omit<LfMessengerAdapterDispatchDetailBase, "originalEvent"> & {
        originalEvent?: never;
      }
    : LfMessengerAdapterDispatchDetailBase;
};
export type LfMessengerAdapterDispatcher = LfComponentAdapterDispatcher<
  LfMessengerEventPayload,
  LfMessengerAdapterDispatcherDetailOverrides
>;

//#region Character node
/**
 * Dataset wrapper consumed by the component for data-driven rendering.
 */
export interface LfMessengerDataset extends LfDataDataset {
  nodes?: LfMessengerCharacterNode[];
}
/**
 * Utility type used by the `lf-messenger` component.
 */
export type LfMessengerCharacterId = `character_${string}`;
/**
 * Tree node description used by the character in `lf-messenger`.
 */
export interface LfMessengerCharacterNode extends LfDataNode {
  children: [
    LfMessengerAvatarRootNode,
    LfMessengerBiographyRootNode,
    LfMessengerChatRootNode,
    LfMessengerLocationRootNode,
    LfMessengerOutfitRootNode,
    LfMessengerStyleRootNode,
    LfMessengerTimeframeRootNode,
  ];
  id: LfMessengerCharacterId;
  value: string;
}
//#endregion

//#region Root nodes
/**
 * Tree node description used by the base root in `lf-messenger`.
 */
export interface LfMessengerBaseRootNode<T extends LfMessengerTypes>
  extends LfDataNode {
  id: T;
}
/**
 * Tree node description used by the base image root in `lf-messenger`.
 */
export interface LfMessengerBaseImageRootNode<
  T extends LfMessengerBaseChildNode<LfMessengerUnionChildIds>,
  T1 extends LfMessengerImageTypes,
> extends LfMessengerBaseRootNode<LfMessengerImageTypes> {
  id: LfMessengerImageRootIds<T1>;
  children?: T[];
  value: number;
}
/**
 * Union of type tokens consumed by `lf-messenger`.
 */
export type LfMessengerTypes = "biography" | "chat" | LfMessengerImageTypes;
/**
 * Union of type tokens consumed by `lf-messenger`.
 */
export type LfMessengerImageTypes = "avatars" | LfMessengerOptionTypes;
/**
 * Union of type tokens consumed by `lf-messenger`.
 */
export type LfMessengerOptionTypes =
  | "locations"
  | "outfits"
  | "styles"
  | "timeframes";
/**
 * Utility type used by the `lf-messenger` component.
 */
export type LfMessengerRootIds<T extends LfMessengerTypes> = T;
/**
 * Utility type used by the `lf-messenger` component.
 */
export type LfMessengerImageRootIds<T extends LfMessengerImageTypes> = T;
/**
 * Tree node description used by the biography root in `lf-messenger`.
 */
export interface LfMessengerBiographyRootNode
  extends LfMessengerBaseRootNode<LfMessengerRootIds<"biography">> {
  id: LfMessengerRootIds<"biography">;
  value: string;
}
/**
 * Tree node description used by the chat root in `lf-messenger`.
 */
export interface LfMessengerChatRootNode
  extends LfMessengerBaseRootNode<LfMessengerRootIds<"chat">> {
  id: LfMessengerRootIds<"chat">;
  value: string;
}
/**
 * Tree node description used by the avatar root in `lf-messenger`.
 */
export interface LfMessengerAvatarRootNode
  extends LfMessengerBaseImageRootNode<
    LfMessengerAvatarNode,
    LfMessengerImageRootIds<"avatars">
  > {
  id: LfMessengerImageRootIds<"avatars">;
}
/**
 * Tree node description used by the location root in `lf-messenger`.
 */
export interface LfMessengerLocationRootNode
  extends LfMessengerBaseImageRootNode<
    LfMessengerLocationNode,
    LfMessengerImageRootIds<"locations">
  > {
  id: LfMessengerImageRootIds<"locations">;
}
/**
 * Tree node description used by the outfit root in `lf-messenger`.
 */
export interface LfMessengerOutfitRootNode
  extends LfMessengerBaseImageRootNode<
    LfMessengerOutfitNode,
    LfMessengerImageRootIds<"outfits">
  > {
  id: LfMessengerImageRootIds<"outfits">;
}
/**
 * Tree node description used by the style root in `lf-messenger`.
 */
export interface LfMessengerStyleRootNode
  extends LfMessengerBaseImageRootNode<
    LfMessengerStyleNode,
    LfMessengerImageRootIds<"styles">
  > {
  id: LfMessengerImageRootIds<"styles">;
}
/**
 * Tree node description used by the timeframe root in `lf-messenger`.
 */
export interface LfMessengerTimeframeRootNode
  extends LfMessengerBaseImageRootNode<
    LfMessengerTimeframeNode,
    LfMessengerImageRootIds<"timeframes">
  > {
  id: LfMessengerImageRootIds<"timeframes">;
}
//#endregion
//#region Children nodes
/**
 * Tree node description used by the base child in `lf-messenger`.
 */
export interface LfMessengerBaseChildNode<T extends LfMessengerUnionChildIds>
  extends LfDataNode {
  cells: { lfImage: { shape: "image"; value: string } };
  id: T;
  value: string;
}
/**
 * Union of type tokens consumed by `lf-messenger`.
 */
export type LfMessengerChildTypes = "avatar" | LfMessengerChildOptionTypes;
/**
 * Union of type tokens consumed by `lf-messenger`.
 */
export type LfMessengerChildOptionTypes =
  | "location"
  | "outfit"
  | "style"
  | "timeframe";
/**
 * Utility type used by the `lf-messenger` component.
 */
export type LfMessengerPrefix<T extends LfMessengerChildTypes> = `${T}_`;
/**
 * Utility type used by the `lf-messenger` component.
 */
export type LfMessengerAvatarId = `${LfMessengerPrefix<"avatar">}${string}`;
/**
 * Utility type used by the `lf-messenger` component.
 */
export type LfMessengerLocationId = `${LfMessengerPrefix<"location">}${string}`;
/**
 * Utility type used by the `lf-messenger` component.
 */
export type LfMessengerOutfitId = `${LfMessengerPrefix<"outfit">}${string}`;
/**
 * Utility type used by the `lf-messenger` component.
 */
export type LfMessengerStyleId = `${LfMessengerPrefix<"style">}${string}`;
/**
 * Utility type used by the `lf-messenger` component.
 */
export type LfMessengerTimeframeId =
  `${LfMessengerPrefix<"timeframe">}${string}`;
/**
 * Utility type used by the `lf-messenger` component.
 */
export type LfMessengerUnionChildIds =
  | LfMessengerAvatarId
  | LfMessengerLocationId
  | LfMessengerOutfitId
  | LfMessengerStyleId
  | LfMessengerTimeframeId;
/**
 * Utility type used by the `lf-messenger` component.
 */
export type LfMessengerChildIds<T extends LfMessengerUnionChildIds> = T;
/**
 * Tree node description used by the avatar in `lf-messenger`.
 */
export interface LfMessengerAvatarNode
  extends LfMessengerBaseChildNode<LfMessengerAvatarId> {
  id: LfMessengerChildIds<LfMessengerAvatarId>;
}
/**
 * Tree node description used by the location in `lf-messenger`.
 */
export interface LfMessengerLocationNode
  extends LfMessengerBaseChildNode<LfMessengerLocationId> {
  id: LfMessengerChildIds<LfMessengerLocationId>;
}
/**
 * Tree node description used by the outfit in `lf-messenger`.
 */
export interface LfMessengerOutfitNode
  extends LfMessengerBaseChildNode<LfMessengerOutfitId> {
  id: LfMessengerChildIds<LfMessengerOutfitId>;
}
/**
 * Tree node description used by the style in `lf-messenger`.
 */
export interface LfMessengerStyleNode
  extends LfMessengerBaseChildNode<LfMessengerStyleId> {
  id: LfMessengerChildIds<LfMessengerStyleId>;
}
/**
 * Tree node description used by the timeframe in `lf-messenger`.
 */
export interface LfMessengerTimeframeNode
  extends LfMessengerBaseChildNode<LfMessengerTimeframeId> {
  id: LfMessengerChildIds<LfMessengerTimeframeId>;
}
//#endregion

//#region States
/**
 * Utility interface used by the `lf-messenger` component.
 */
export interface LfMessengerChat {
  [index: LfMessengerCharacterId]: LfChatPropsInterface;
}
/**
 * Configuration object for the component experience in `lf-messenger`.
 */
export interface LfMessengerConfig {
  currentCharacter: string;
  ui: LfMessengerUI;
}
/**
 * Utility interface used by the `lf-messenger` component.
 */
export interface LfMessengerCovers {
  [index: LfMessengerCharacterId]: {
    [K in LfMessengerImageTypes]: number;
  };
}
/**
 * History snapshot maintained by the component to enable undo/redo flows.
 */
export interface LfMessengerHistory {
  [index: LfMessengerCharacterId]: string;
}
/**
 * Utility interface used by the `lf-messenger` component.
 */
export interface LfMessengerImageEditComponents {
  descriptionTextarea: HTMLInputElement | HTMLTextAreaElement | null;
  idTextfield: HTMLInputElement | HTMLTextAreaElement | null;
  titleTextarea: HTMLInputElement | HTMLTextAreaElement | null;
  imageUrlTextarea: HTMLInputElement | HTMLTextAreaElement | null;
}
/**
 * Utility type used by the `lf-messenger` component.
 */
export type LfMessengerEditingStatus<T extends LfMessengerImageTypes> = {
  [index in LfMessengerImageRootIds<T>]: LfMessengerUnionChildIds;
};
/**
 * Utility type used by the `lf-messenger` component.
 */
export type LfMessengerFilters = {
  [T in LfMessengerImageTypes]: boolean;
};
/**
 * Configuration options for the component within `lf-messenger`.
 */
export type LfMessengerOptions = {
  [T in LfMessengerOptionTypes]: boolean;
};
/**
 * Utility interface used by the `lf-messenger` component.
 */
export interface LfMessengerPanels {
  isLeftCollapsed: boolean;
  isRightCollapsed: boolean;
}
/**
 * Utility interface used by the `lf-messenger` component.
 */
export interface LfMessengerUI {
  customizationView: boolean;
  filters: LfMessengerFilters;
  form: LfMessengerFilters;
  options: LfMessengerOptions;
  panels: LfMessengerPanels;
}
/**
 * Utility type used by the `lf-messenger` component.
 */
export type LfMessengerPanelsValue = "left" | "right";
//#endregion
//#region Events
/**
 * Union of event identifiers emitted by `lf-messenger`.
 */
export type LfMessengerEvent = (typeof LF_MESSENGER_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-messenger` events.
 */
export interface LfMessengerEventPayload
  extends LfEventPayload<"LfMessenger", LfMessengerEvent> {
  config: LfMessengerConfig;
}
//#endregion
//#region Props
export enum LfMessengerProps {
  lfAutosave = "Automatically saves the dataset when a chat updates.",
  lfDataset = "The actual data of the component.",
  lfStyle = "Custom style of the component.",
  lfValue = "Sets the initial configuration, including active character and filters.",
}
/**
 * Public props accepted by the `lf-messenger` component.
 */
export interface LfMessengerPropsInterface {
  lfAutosave?: boolean;
  lfDataset?: LfMessengerDataset;
  lfStyle?: string;
  lfValue?: LfMessengerConfig;
}
//#endregion
