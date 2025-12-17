import {
  AVATAR_COVER,
  LfMessengerAdapter,
  LfMessengerAdapterControllerGetters,
  LfMessengerAdapterControllerSetters,
  LfMessengerBaseChildNode,
  LfMessengerBaseRootNode,
  LfMessengerCharacterNode,
  LfMessengerChildIds,
  LfMessengerChildTypes,
  LfMessengerImageTypes,
  LfMessengerPrefix,
  LfMessengerUnionChildIds,
  LOCATION_COVER,
  OUTFIT_COVER,
  STYLE_COVER,
  TIMEFRAME_COVER,
} from "@lf-widgets/foundations";
import { defaultToCurrentCharacter } from "./helpers.utils";
import { LfMessengerAdapterState } from "./lf-messenger-adapter";

//#region Getters
export const prepImageGetters = (
  getAdapter: () => LfMessengerAdapter,
  state: LfMessengerAdapterState,
): LfMessengerAdapterControllerGetters["image"] => {
  return {
    asCover: (type, character?) =>
      getAsCover(getAdapter, state, type, character),
    byType: (type, character?) => getByType(getAdapter, state, type, character),
    coverIndex: (type, character?) => {
      const adapter = getAdapter();
      const { id } = defaultToCurrentCharacter(adapter, state, character);

      return state.covers[id]?.[type] ?? 0;
    },
    newId: (type) => getNewId(getAdapter, type),
    root: (type, character?) => {
      const adapter = getAdapter();
      const { children } = defaultToCurrentCharacter(adapter, state, character);

      const node = children.find((n) => n.id === type);

      return node as LfMessengerBaseRootNode<LfMessengerImageTypes>;
    },
    title: (node) => {
      const title = node?.value || "";
      const description = node?.description || "";
      return title && description
        ? `${title} - ${description}`
        : description
          ? description
          : title
            ? title
            : "";
    },
  };
};
//#endregion

//#region Setters
export const prepImageSetters = (
  getAdapter: () => LfMessengerAdapter,
  state: LfMessengerAdapterState,
  onStateChange: () => void,
): LfMessengerAdapterControllerSetters["image"] => {
  return {
    cover: (
      type: LfMessengerImageTypes,
      value: number,
      character?: LfMessengerCharacterNode,
    ) => {
      const adapter = getAdapter();
      const { id } = defaultToCurrentCharacter(adapter, state, character);

      state.covers = {
        ...state.covers,
        [id]: { ...state.covers[id], [type]: value },
      };
      onStateChange();
    },
  };
};
//#endregion

//#region Helpers
const pickFallBackCover = (type: LfMessengerImageTypes) => {
  switch (type) {
    case "avatars":
      return { value: AVATAR_COVER };
    case "locations":
      return { value: LOCATION_COVER };
    case "outfits":
      return { value: OUTFIT_COVER };
    case "styles":
      return { value: STYLE_COVER };
    case "timeframes":
      return { value: TIMEFRAME_COVER };
    default:
      return { value: "" };
  }
};
const getAsCover = (
  getAdapter: () => LfMessengerAdapter,
  state: LfMessengerAdapterState,
  type: LfMessengerImageTypes,
  character: LfMessengerCharacterNode,
) => {
  const adapter = getAdapter();
  const { image } = adapter.controller.get;
  const { children, id } = defaultToCurrentCharacter(adapter, state, character);

  try {
    const root = children.find((n) => n.id === type);
    const index = state.covers[id]?.[type] ?? 0;
    const node = root.children[index];

    if (!node?.cells?.lfImage?.value) {
      return pickFallBackCover(type);
    }

    return {
      node: root.children[
        index
      ] as LfMessengerBaseChildNode<LfMessengerUnionChildIds>,
      title: image.title(
        node as LfMessengerBaseChildNode<LfMessengerUnionChildIds>,
      ),
      value: node.cells.lfImage.value,
    };
  } catch (error) {
    return pickFallBackCover(type);
  }
};
const getByType = (
  getAdapter: () => LfMessengerAdapter,
  state: LfMessengerAdapterState,
  type: LfMessengerImageTypes,
  character: LfMessengerCharacterNode,
) => {
  const { children } = defaultToCurrentCharacter(
    getAdapter(),
    state,
    character,
  );

  const node = children.find((child) => child.id === type);

  if (node?.children) {
    return node.children as LfMessengerBaseChildNode<LfMessengerUnionChildIds>[];
  } else {
    return [];
  }
};
const getNewId = (
  getAdapter: () => LfMessengerAdapter,
  type: LfMessengerImageTypes,
) => {
  const { byType } = getAdapter().controller.get.image;

  let index = 0;
  let prefix: LfMessengerPrefix<LfMessengerChildTypes>;
  let nodeId: LfMessengerChildIds<LfMessengerUnionChildIds>;

  switch (type) {
    case "avatars":
      prefix = "avatar_";
      break;
    case "locations":
      prefix = "location_";
      break;
    case "outfits":
      prefix = "outfit_";
      break;
    case "styles":
      prefix = "style_";
      break;
    case "timeframes":
      prefix = "timeframe_";
      break;
    default:
      throw new Error(`Unknown image type: ${type}`);
  }

  do {
    nodeId = `${prefix}${index.toString()}`;
    index++;
  } while (byType(type).some((node) => node.id === nodeId));

  return nodeId;
};
//#endregion
