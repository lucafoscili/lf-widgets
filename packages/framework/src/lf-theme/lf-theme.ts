import {
  LF_THEME_ATTRIBUTE,
  LfComponent,
  LfEffectName,
  LfFrameworkInterface,
  LfThemeBEMModifier,
  LfThemeInterface,
  LfThemeList,
  LfThemeSharedStylesManager,
  THEME_LIST,
} from "@lf-widgets/foundations";
import { bemClass } from "./helpers.bem";
import {
  buildComponentCustomCss,
  buildFontCss,
  buildGlobalStylesCss,
  buildVariablesCss,
} from "./helpers.css";
import { createSharedStylesManager } from "./helpers.shared-styles";
import {
  createSpriteManager,
  getIcon,
  getIcons,
  getThemesData,
} from "./helpers.sprite";

/**
 * Theme manager for LF Widgets.
 * Handles theme switching, CSS variable generation, component registration,
 * and shared styles adoption for shadow DOM components.
 */
export class LfTheme implements LfThemeInterface {
  //#region Private Fields
  #COMPONENTS: Set<LfComponent> = new Set();
  #CURRENT: string;
  #DEFAULT = "dark";
  #LIST: LfThemeList;
  #MANAGER: LfFrameworkInterface;
  #SPRITE_MANAGER: ReturnType<typeof createSpriteManager>;
  #STYLE_ELEMENT: HTMLStyleElement;
  //#endregion

  //#region Public Fields
  /**
   * Shared styles manager for adopting global styles into shadow roots.
   * Automatically used by register/unregister for component lifecycle.
   */
  sharedStyles: LfThemeSharedStylesManager = createSharedStylesManager();
  //#endregion

  //#region Constructor
  constructor(lfFramework: LfFrameworkInterface) {
    this.#MANAGER = lfFramework;
    this.#LIST = THEME_LIST;
    this.#CURRENT = this.#DEFAULT;

    // Initialize sprite manager with lazy path resolution
    this.#SPRITE_MANAGER = createSpriteManager(() => {
      const { assets } = this.#MANAGER;
      return assets.get("./assets/svg/sprite.svg").path;
    });
  }
  //#endregion

  //#region Private Methods
  #consistencyCheck = () => {
    const { logs } = this.#MANAGER.debug;

    if (!this.#LIST?.[this.#CURRENT]) {
      logs.new(this, `Invalid theme! Falling back to (${this.#DEFAULT}).`);
      this.#CURRENT = this.#DEFAULT;
    }
  };

  #updateComponents = () => {
    this.#COMPONENTS.forEach((comp) => {
      if (comp?.rootElement?.isConnected) {
        comp.refresh();
      }
    });
  };

  #updateDocument = () => {
    const { isDark, name } = this.get.current();

    const dom = document.documentElement;
    dom.setAttribute(LF_THEME_ATTRIBUTE.theme, name);

    if (isDark) {
      dom.removeAttribute(LF_THEME_ATTRIBUTE.light);
      dom.setAttribute(LF_THEME_ATTRIBUTE.dark, "");
    } else {
      dom.removeAttribute(LF_THEME_ATTRIBUTE.dark);
      dom.setAttribute(LF_THEME_ATTRIBUTE.light, "");
    }

    document.dispatchEvent(new CustomEvent("lf-theme-change"));
  };

  #updateStyleElement = () => {
    const theme = this.get.current();
    const { assets } = this.#MANAGER;

    let css = "";
    css += buildFontCss(theme.full, (path) => assets.get(path));
    css += buildGlobalStylesCss();
    css += `:root[lf-theme="${this.#CURRENT}"] {${buildVariablesCss(theme.full, this.#MANAGER)}}`;

    this.#STYLE_ELEMENT.innerText = css;
  };
  //#endregion

  //#region bemClass
  /**
   * Generates a BEM (Block Element Modifier) class name string.
   *
   * @param block - The block name in BEM notation
   * @param element - Optional element name in BEM notation
   * @param modifiers - Optional object containing modifier flags
   * @returns A string containing the complete BEM class name with any active modifiers
   */
  bemClass = (
    block: string,
    element?: string,
    modifiers?: Partial<LfThemeBEMModifier>,
  ) => bemClass(block, element, modifiers);
  //#endregion

  //#region get
  get = {
    /**
     * Gets the current theme configuration.
     */
    current: () => {
      this.#consistencyCheck();

      const { variables, isDark, customStyles, font, effects } =
        this.#LIST[this.#CURRENT];

      return {
        variables,
        customStyles,
        font,
        hasEffect: (effect: LfEffectName) => effects.includes(effect),
        isDark,
        name: this.#CURRENT,
        full: this.#LIST[this.#CURRENT],
      };
    },

    /**
     * Sprite utilities for icon management.
     */
    sprite: {
      /**
       * Gets the sprite SVG path.
       */
      path: (): string => {
        const { assets } = this.#MANAGER;
        return assets.get("./assets/svg/sprite.svg").path;
      },

      /**
       * Gets all symbol IDs from the sprite.
       */
      ids: async (): Promise<Set<string>> => {
        return this.#SPRITE_MANAGER.getIds();
      },

      /**
       * Checks if an icon exists in the sprite.
       */
      hasIcon: async (id: string): Promise<boolean> => {
        return this.#SPRITE_MANAGER.hasIcon(id);
      },
    },

    /**
     * Gets an icon from the built-in registry.
     */
    icon: getIcon,

    /**
     * Gets all icons from the built-in registry.
     */
    icons: getIcons,

    /**
     * Gets available themes in various formats.
     */
    themes: () => getThemesData(this.#LIST, this.get.icon("colorSwatch")),
  };
  //#endregion

  //#region set
  /**
   * Sets theme parameters and applies them to the document.
   * If a name is provided, it will be set as the current theme.
   * If a list is provided, it will replace the current theme list.
   *
   * @param name - Optional theme name to set as current
   * @param list - Optional theme list to replace the current one
   */
  set = (name?: string, list?: LfThemeList) => {
    if (typeof document === "undefined") {
      return;
    }

    if (!this.#STYLE_ELEMENT) {
      this.#STYLE_ELEMENT = document.documentElement
        .querySelector("head")
        .appendChild(document.createElement("style"));
    }

    if (name) {
      this.#CURRENT = name;
    }
    if (list) {
      this.#LIST = list;
    }

    this.#consistencyCheck();

    this.#updateStyleElement();
    this.#updateComponents();
    this.#updateDocument();
  };
  //#endregion

  //#region refresh
  /**
   * Refreshes the current theme by updating CSS custom properties.
   * Dispatches a 'lf-theme-refresh' event on success.
   */
  refresh = () => {
    const { logs } = this.#MANAGER.debug;

    try {
      this.#updateStyleElement();
      logs.new(this, "Theme " + this.#CURRENT + " refreshed.");
      document.dispatchEvent(new CustomEvent("lf-theme-refresh"));
    } catch (error) {
      logs.new(this, "Theme not refreshed.", "warning");
    }
  };
  //#endregion

  //#region setLfStyle
  /**
   * Sets and validates custom CSS styles for a component.
   * Combines master styles, component-specific styles, and instance styles.
   *
   * @param comp - The component to apply styles to
   * @returns Combined CSS string if valid, empty string if malicious content detected
   */
  setLfStyle = (comp: LfComponent): string => {
    const { customStyles } = this.get.current();
    return buildComponentCustomCss(comp, customStyles);
  };
  //#endregion

  //#region randomize
  /**
   * Randomly sets a theme from the available themes list.
   * Ensures a different theme is selected than the current one.
   */
  randomize = () => {
    const { logs } = this.#MANAGER.debug;

    const themes = this.get.themes().asArray;
    if (themes.length > 0) {
      let index = null;
      while (index === null || themes[index] === this.#CURRENT) {
        index = Math.floor(Math.random() * Math.floor(themes.length));
      }
      this.set(themes[index]);
    } else {
      logs.new(
        this,
        "Couldn't randomize theme: no themes available!",
        "warning",
      );
    }
  };
  //#endregion

  //#region register
  /**
   * Registers a component to the theme registry.
   * Automatically adopts shared styles into the component's shadow root.
   *
   * @param comp - The component to be registered
   */
  register = (comp: LfComponent) => {
    this.#COMPONENTS.add(comp);

    // Auto-adopt shared styles into shadow root
    const shadowRoot = comp.rootElement?.shadowRoot;
    if (shadowRoot) {
      this.sharedStyles.adopt(shadowRoot);
    }
  };
  //#endregion

  //#region unregister
  /**
   * Unregisters a component from the theme manager.
   * Automatically releases shared styles from the component's shadow root.
   *
   * @param comp - The component to unregister
   */
  unregister = (comp: LfComponent) => {
    // Auto-release shared styles from shadow root
    const shadowRoot = comp.rootElement?.shadowRoot;
    if (shadowRoot) {
      this.sharedStyles.release(shadowRoot);
    }

    this.#COMPONENTS?.delete(comp);
  };
  //#endregion
}
