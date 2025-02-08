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
export interface LfMessengerInterface
  extends LfComponent<"LfMessenger">,
    LfMessengerPropsInterface {}
export interface LfMessengerElement
  extends HTMLStencilElement,
    LfMessengerInterface {}
//#endregion

//#region Adapter
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
export type LfMessengerAdapterInitializerGetters = Pick<
  LfMessengerAdapterGetters,
  | "blocks"
  | "compInstance"
  | "cyAttributes"
  | "lfAttributes"
  | "manager"
  | "parts"
>;
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
export interface LfMessengerAdapterSetImage extends LfComponentAdapterSetters {
  cover: (
    type: LfMessengerImageTypes,
    value: number,
    character?: LfMessengerCharacterNode,
  ) => void;
}
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
export interface LfMessengerDataset extends LfDataDataset {
  nodes?: LfMessengerCharacterNode[];
}
export type LfMessengerCharacterId = `character_${string}`;
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
export interface LfMessengerBaseRootNode<T extends LfMessengerTypes>
  extends LfDataNode {
  id: T;
}
export interface LfMessengerBaseImageRootNode<
  T extends LfMessengerBaseChildNode<LfMessengerUnionChildIds>,
  T1 extends LfMessengerImageTypes,
> extends LfMessengerBaseRootNode<LfMessengerImageTypes> {
  id: LfMessengerImageRootIds<T1>;
  children?: T[];
  value: number;
}
export type LfMessengerTypes = "biography" | "chat" | LfMessengerImageTypes;
export type LfMessengerImageTypes = "avatars" | LfMessengerOptionTypes;
export type LfMessengerOptionTypes =
  | "locations"
  | "outfits"
  | "styles"
  | "timeframes";
export type LfMessengerRootIds<T extends LfMessengerTypes> = T;
export type LfMessengerImageRootIds<T extends LfMessengerImageTypes> = T;
export interface LfMessengerBiographyRootNode
  extends LfMessengerBaseRootNode<LfMessengerRootIds<"biography">> {
  id: LfMessengerRootIds<"biography">;
  value: string;
}
export interface LfMessengerChatRootNode
  extends LfMessengerBaseRootNode<LfMessengerRootIds<"chat">> {
  id: LfMessengerRootIds<"chat">;
  value: string;
}
export interface LfMessengerAvatarRootNode
  extends LfMessengerBaseImageRootNode<
    LfMessengerAvatarNode,
    LfMessengerImageRootIds<"avatars">
  > {
  id: LfMessengerImageRootIds<"avatars">;
}
export interface LfMessengerLocationRootNode
  extends LfMessengerBaseImageRootNode<
    LfMessengerLocationNode,
    LfMessengerImageRootIds<"locations">
  > {
  id: LfMessengerImageRootIds<"locations">;
}
export interface LfMessengerOutfitRootNode
  extends LfMessengerBaseImageRootNode<
    LfMessengerOutfitNode,
    LfMessengerImageRootIds<"outfits">
  > {
  id: LfMessengerImageRootIds<"outfits">;
}
export interface LfMessengerStyleRootNode
  extends LfMessengerBaseImageRootNode<
    LfMessengerStyleNode,
    LfMessengerImageRootIds<"styles">
  > {
  id: LfMessengerImageRootIds<"styles">;
}
export interface LfMessengerTimeframeRootNode
  extends LfMessengerBaseImageRootNode<
    LfMessengerTimeframeNode,
    LfMessengerImageRootIds<"timeframes">
  > {
  id: LfMessengerImageRootIds<"timeframes">;
}
//#endregion
//#region Children nodes
export interface LfMessengerBaseChildNode<T extends LfMessengerUnionChildIds>
  extends LfDataNode {
  cells: { lfImage: { shape: "image"; value: string } };
  id: T;
  value: string;
}
export type LfMessengerChildTypes = "avatar" | LfMessengerChildOptionTypes;
export type LfMessengerChildOptionTypes =
  | "location"
  | "outfit"
  | "style"
  | "timeframe";
export type LfMessengerPrefix<T extends LfMessengerChildTypes> = `${T}_`;
export type LfMessengerAvatarId = `${LfMessengerPrefix<"avatar">}${string}`;
export type LfMessengerLocationId = `${LfMessengerPrefix<"location">}${string}`;
export type LfMessengerOutfitId = `${LfMessengerPrefix<"outfit">}${string}`;
export type LfMessengerStyleId = `${LfMessengerPrefix<"style">}${string}`;
export type LfMessengerTimeframeId =
  `${LfMessengerPrefix<"timeframe">}${string}`;
export type LfMessengerUnionChildIds =
  | LfMessengerAvatarId
  | LfMessengerLocationId
  | LfMessengerOutfitId
  | LfMessengerStyleId
  | LfMessengerTimeframeId;
export type LfMessengerChildIds<T extends LfMessengerUnionChildIds> = T;
export interface LfMessengerAvatarNode
  extends LfMessengerBaseChildNode<LfMessengerAvatarId> {
  id: LfMessengerChildIds<LfMessengerAvatarId>;
}
export interface LfMessengerLocationNode
  extends LfMessengerBaseChildNode<LfMessengerLocationId> {
  id: LfMessengerChildIds<LfMessengerLocationId>;
}
export interface LfMessengerOutfitNode
  extends LfMessengerBaseChildNode<LfMessengerOutfitId> {
  id: LfMessengerChildIds<LfMessengerOutfitId>;
}
export interface LfMessengerStyleNode
  extends LfMessengerBaseChildNode<LfMessengerStyleId> {
  id: LfMessengerChildIds<LfMessengerStyleId>;
}
export interface LfMessengerTimeframeNode
  extends LfMessengerBaseChildNode<LfMessengerTimeframeId> {
  id: LfMessengerChildIds<LfMessengerTimeframeId>;
}
//#endregion

//#region States
export interface LfMessengerChat {
  [index: LfMessengerCharacterId]: LfChatPropsInterface;
}
export interface LfMessengerConfig {
  currentCharacter: string;
  ui: LfMessengerUI;
}
export interface LfMessengerCovers {
  [index: LfMessengerCharacterId]: {
    [K in LfMessengerImageTypes]: number;
  };
}
export interface LfMessengerHistory {
  [index: LfMessengerCharacterId]: string;
}
export interface LfMessengerImageEditComponents {
  descriptionTextarea: LfTextfieldElement;
  idTextfield: LfTextfieldElement;
  titleTextarea: LfTextfieldElement;
  imageUrlTextarea: LfTextfieldElement;
}
export type LfMessengerEditingStatus<T extends LfMessengerImageTypes> = {
  [index in LfMessengerImageRootIds<T>]: LfMessengerUnionChildIds;
};
export type LfMessengerFilters = {
  [T in LfMessengerImageTypes]: boolean;
};
export type LfMessengerOptions = {
  [T in LfMessengerOptionTypes]: boolean;
};
export interface LfMessengerPanels {
  isLeftCollapsed: boolean;
  isRightCollapsed: boolean;
}
export interface LfMessengerUI {
  customizationView: boolean;
  filters: LfMessengerFilters;
  form: LfMessengerFilters;
  options: LfMessengerOptions;
  panels: LfMessengerPanels;
}
export type LfMessengerPanelsValue = "left" | "right";
//#endregion
//#region Events
export type LfMessengerEvent = "ready" | "save" | "unmount";
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
export interface LfMessengerPropsInterface {
  lfAutosave?: boolean;
  lfDataset?: LfMessengerDataset;
  lfStyle?: string;
  lfValue?: LfMessengerConfig;
}
//#endregion
