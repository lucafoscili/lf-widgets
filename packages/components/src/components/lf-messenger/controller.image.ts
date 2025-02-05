import {
  AVATAR_COVER,
  LfMessengerAdapter,
  LfMessengerAdapterGetters,
  LfMessengerAdapterSetters,
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
import { LfMessenger } from "./lf-messenger";

//#region Getters
export const prepImageGetters = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterGetters["image"] => {
  return {
    asCover: (type, character?) => getAsCover(getAdapter, type, character),
    byType: (type, character?) => getByType(getAdapter, type, character),
    coverIndex: (type, character?) => {
      const adapter = getAdapter();
      const { covers } = adapter.controller.get.compInstance as LfMessenger;
      const { id } = defaultToCurrentCharacter(adapter, character);

      return covers[id][type];
    },
    newId: (type) => getNewId(getAdapter, type),
    root: (type, character?) => {
      const adapter = getAdapter();
      const { children } = defaultToCurrentCharacter(adapter, character);

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
): LfMessengerAdapterSetters["image"] => {
  return {
    cover: (
      type: LfMessengerImageTypes,
      value: number,
      character?: LfMessengerCharacterNode,
    ) => {
      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;
      const { id } = defaultToCurrentCharacter(getAdapter(), character);

      const c = compInstance as LfMessenger;

      c.covers[id][type] = value;
      c.refresh();
    },
  };
};
//#endregion

//#region Helpers
const getAsCover = (
  getAdapter: () => LfMessengerAdapter,
  type: LfMessengerImageTypes,
  character: LfMessengerCharacterNode,
) => {
  const adapter = getAdapter();
  const { compInstance, image } = adapter.controller.get;
  const { children, id } = defaultToCurrentCharacter(adapter, character);
  const { covers } = compInstance as LfMessenger;

  try {
    const root = children.find((n) => n.id === type);
    const index = covers[id][type];
    const node = root.children[index];

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
    }
  }
};
const getByType = (
  getAdapter: () => LfMessengerAdapter,
  type: LfMessengerImageTypes,
  character: LfMessengerCharacterNode,
) => {
  const { children } = defaultToCurrentCharacter(getAdapter(), character);

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
