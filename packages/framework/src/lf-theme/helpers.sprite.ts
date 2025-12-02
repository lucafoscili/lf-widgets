import {
  LF_ICONS_REGISTRY,
  LfDataDataset,
  LfDataNode,
  LfIconType,
  LfThemeList,
} from "@lf-widgets/foundations";

//#region Sprite Indexing
/**
 * Creates a sprite indexing manager for efficient icon lookups.
 * Caches the sprite symbol IDs after first fetch to avoid repeated parsing.
 *
 * @param getSpritePath - Function that returns the sprite SVG path
 * @returns Object with methods to get sprite IDs and check icon existence
 */
export const createSpriteManager = (getSpritePath: () => string) => {
  /** Cached sprite IDs */
  let spriteIds: Set<string> | undefined;

  /** Promise for in-flight indexing operation */
  let indexingPromise: Promise<Set<string>> | undefined;

  /**
   * Fetches and parses sprite IDs from the SVG sprite file.
   * Returns cached result if available.
   *
   * @returns Promise resolving to Set of symbol IDs
   */
  const getIds = async (): Promise<Set<string>> => {
    if (spriteIds) return spriteIds;
    if (indexingPromise) return indexingPromise;

    indexingPromise = (async () => {
      try {
        const spritePath = getSpritePath();
        if (!spritePath || typeof fetch === "undefined") {
          return new Set<string>();
        }

        const res = await fetch(spritePath);
        if (!res.ok) return new Set<string>();

        const text = await res.text();
        const ids = new Set<string>();
        const re = /<symbol\s+id="([^"]+)"/g;
        let m: RegExpExecArray | null;

        while ((m = re.exec(text))) {
          ids.add(m[1]);
        }

        spriteIds = ids;
        return ids;
      } catch {
        return new Set<string>();
      } finally {
        indexingPromise = undefined;
      }
    })();

    return indexingPromise;
  };

  /**
   * Checks if an icon exists in the sprite.
   *
   * @param id - The icon ID to check
   * @returns Promise resolving to true if icon exists
   */
  const hasIcon = async (id: string): Promise<boolean> => {
    const ids = await getIds();
    return ids.has(id);
  };

  return {
    getIds,
    hasIcon,
  };
};
//#endregion

//#region Icon Registry
/**
 * Gets an icon from the built-in icons registry.
 *
 * @param name - The icon name from the registry
 * @returns The icon data
 */
export const getIcon = (name: keyof typeof LF_ICONS_REGISTRY) =>
  LF_ICONS_REGISTRY[name];

/**
 * Gets all icons from the built-in icons registry.
 *
 * @returns The complete icons registry
 */
export const getIcons = () => LF_ICONS_REGISTRY;
//#endregion

//#region Theme List
/**
 * Converts a theme list to various formats for UI consumption.
 *
 * @param themeList - The theme list to convert
 * @param rootIcon - Icon to use for the root node
 * @returns Object containing themes as array and as dataset
 */
export const getThemesData = (
  themeList: LfThemeList,
  rootIcon: LfIconType,
): {
  asArray: string[];
  asDataset: LfDataDataset;
} => {
  const asArray: string[] = [];
  const nodes: LfDataNode[] = [];

  Object.keys(themeList).forEach((id) => {
    const char0 = id.charAt(0).toUpperCase();
    asArray.push(id);
    nodes.push({
      id,
      value: `${char0}${id.substring(1)}`,
    });
  });

  return {
    asArray,
    asDataset: {
      nodes: [
        {
          icon: rootIcon,
          id: "root",
          value: "Random",
          children: nodes,
        },
      ],
    },
  };
};
//#endregion
