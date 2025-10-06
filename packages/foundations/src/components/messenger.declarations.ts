import {
  LfComponentAdapter,
  LfComponentAdapterGetters,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
  LfComponentAdapterSetters,
} from "../foundations/adapter.declarations";
import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
} from "../foundations/components.constants";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LfFrameworkInterface } from "../framework/framework.declarations";
import { LfButtonElement, LfButtonEventPayload } from "./button.declarations";
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
import { LF_MESSENGER_BLOCKS, LF_MESSENGER_PARTS } from "./messenger.constants";
import { LfTabbarElement, LfTabbarEventPayload } from "./tabbar.declarations";
import { LfTextfieldElement } from "./textfield.declarations";

//#region Class
/**
 * Primary interface implemented by the `lf-messenger` component. It merges the shared component contract with the component-specific props.
 */
export interface LfMessengerInterface
  extends LfComponent<"LfMessenger">,
    LfMessengerPropsInterface {}
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
 */
export interface LfMessengerAdapter
  extends LfComponentAdapter<LfMessengerInterface> {
  controller: {
    get: LfMessengerAdapterGetters;
    set: LfMessengerAdapterSetters;
  };
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
    save: LfButtonElement;
    statusIcon: LfImageElement;
  };
  chat: {
    chat: LfChatElement;
    leftExpander: LfButtonElement;
    rightExpander: LfButtonElement;
    tabbar: LfTabbarElement;
  };
  customization: {
    filters: LfChipElement;
    form: {
      [K in LfMessengerImageTypes]: {
        add: LfButtonElement;
        cancel: LfButtonElement;
        confirm: LfButtonElement;
        id: LfTextfieldElement;
        title: LfTextfieldElement;
        imageUrl: LfTextfieldElement;
        description: LfTextfieldElement;
      };
    };
    list: {
      edit: LfButtonElement;
      remove: LfButtonElement;
    };
  };
  options: {
    back: LfButtonElement;
    customize: LfButtonElement;
  };
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfMessengerAdapterHandlers extends LfComponentAdapterHandlers {
  character: {
    button: (e: CustomEvent<LfButtonEventPayload>) => Promise<void>;
    list: (e: CustomEvent<LfListEventPayload>) => Promise<void>;
  };
  chat: {
    button: (e: CustomEvent<LfButtonEventPayload>) => Promise<void>;
    chat: (e: CustomEvent<LfChatEventPayload>) => Promise<void>;
    tabbar: (e: CustomEvent<LfTabbarEventPayload>) => Promise<void>;
  };
  customization: {
    button: <
      T1 extends LfMessengerImageTypes,
      T2 extends LfMessengerBaseChildNode<LfMessengerUnionChildIds>,
    >(
      e: CustomEvent<LfButtonEventPayload>,
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
    button: (e: CustomEvent<LfButtonEventPayload>) => Promise<void>;
  };
}
/**
 * Subset of adapter getters required during initialisation.
 */
export type LfMessengerAdapterInitializerGetters = Pick<
  LfMessengerAdapterGetters,
  | "blocks"
  | "compInstance"
  | "cyAttributes"
  | "lfAttributes"
  | "manager"
  | "parts"
>;
/**
 * Utility interface used by the `lf-messenger` component.
 */
export interface LfMessengerAdapterGetCharacter {
  biography: (character?: LfMessengerCharacterNode) => string;
  byId: (id: string) => LfMessengerCharacterNode;
  chat: (character?: LfMessengerCharacterNode) => LfChatPropsInterface;
  current: () => LfMessengerCharacterNode;
  history: (character?: LfMessengerCharacterNode) => string;
  list: () => LfMessengerCharacterNode[];
  name: (character?: LfMessengerCharacterNode) => string;
  next: (character?: LfMessengerCharacterNode) => LfMessengerCharacterNode;
  previous: (character?: LfMessengerCharacterNode) => LfMessengerCharacterNode;
}
/**
 * Utility interface used by the `lf-messenger` component.
 */
export interface LfMessengerAdapterGetImage {
  asCover: <T extends LfMessengerImageTypes>(
    type: T,
    character?: LfMessengerCharacterNode,
  ) => {
    node?: LfMessengerBaseChildNode<LfMessengerUnionChildIds>;
    title?: string;
    value: string;
  };
  byType: <T extends LfMessengerImageTypes>(
    type: T,
    character?: LfMessengerCharacterNode,
  ) => Array<LfMessengerBaseChildNode<LfMessengerUnionChildIds>>;
  coverIndex: (
    type: LfMessengerImageTypes,
    character?: LfMessengerCharacterNode,
  ) => number;
  newId: <T extends LfMessengerImageTypes>(
    type: T,
  ) => LfMessengerChildIds<LfMessengerUnionChildIds>;
  root: <T extends LfMessengerImageTypes>(
    type: T,
    character?: LfMessengerCharacterNode,
  ) => LfMessengerBaseRootNode<LfMessengerImageTypes>;
  title: <T extends LfMessengerUnionChildIds>(
    node: LfMessengerBaseChildNode<T>,
  ) => string;
}
/**
 * Utility interface used by the `lf-messenger` component.
 */
export interface LfMessengerAdapterGetters
  extends LfComponentAdapterGetters<LfMessengerInterface> {
  blocks: typeof LF_MESSENGER_BLOCKS;
  compInstance: LfMessengerInterface;
  character: LfMessengerAdapterGetCharacter;
  config: () => LfMessengerConfig;
  cyAttributes: typeof CY_ATTRIBUTES;
  history: () => LfMessengerHistory;
  lfAttributes: typeof LF_ATTRIBUTES;
  image: LfMessengerAdapterGetImage;
  manager: LfFrameworkInterface;
  parts: typeof LF_MESSENGER_PARTS;
  status: {
    connection: () => LfChatStatus;
    formStatus: () => LfMessengerEditingStatus<LfMessengerImageTypes>;
    hoveredCustomizationOption: () => LfMessengerBaseChildNode<LfMessengerUnionChildIds>;
    save: {
      inProgress: () => boolean;
    };
  };
}
/**
 * Utility interface used by the `lf-messenger` component.
 */
export interface LfMessengerAdapterSetCharacter
  extends LfComponentAdapterSetters {
  chat: (
    chat: LfChatPropsInterface,
    character?: LfMessengerCharacterNode,
  ) => void;
  current: (character?: LfMessengerCharacterNode) => void;
  history: (history: string, character?: LfMessengerCharacterNode) => void;
  next: (character?: LfMessengerCharacterNode) => void;
  previous: (character?: LfMessengerCharacterNode) => void;
}
/**
 * Utility interface used by the `lf-messenger` component.
 */
export interface LfMessengerAdapterSetImage extends LfComponentAdapterSetters {
  cover: (
    type: LfMessengerImageTypes,
    value: number,
    character?: LfMessengerCharacterNode,
  ) => void;
}
/**
 * Utility interface used by the `lf-messenger` component.
 */
export interface LfMessengerAdapterSetters extends LfComponentAdapterSetters {
  character: LfMessengerAdapterSetCharacter;
  data: () => void;
  image: LfMessengerAdapterSetImage;
  status: {
    connection: (status: LfChatStatus) => void;
    editing: <T extends LfMessengerUnionChildIds>(
      type: LfMessengerImageTypes,
      id: LfMessengerChildIds<T>,
    ) => void;
    hoveredCustomizationOption: <T extends LfMessengerUnionChildIds>(
      node: LfMessengerBaseChildNode<T>,
    ) => void;
    save: {
      inProgress: (value: boolean) => void;
    };
  };
  ui: {
    customization: (value: boolean) => void;
    filters: (filter: LfMessengerFilters) => void;
    options: <T extends LfMessengerImageRootIds<LfMessengerOptionTypes>>(
      value: boolean,
      type: LfMessengerRootIds<T>,
    ) => void;
    panel: (panel: LfMessengerPanelsValue, value?: boolean) => boolean;
    setFormState: <T extends LfMessengerUnionChildIds>(
      value: boolean,
      type: LfMessengerImageTypes,
      node?: LfMessengerBaseChildNode<T>,
    ) => void;
  };
}
//#endregion

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
  descriptionTextarea: LfTextfieldElement;
  idTextfield: LfTextfieldElement;
  titleTextarea: LfTextfieldElement;
  imageUrlTextarea: LfTextfieldElement;
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
export type LfMessengerEvent = "ready" | "save" | "unmount";
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
