import {
  LF_ICONS_REGISTRY,
  LF_THEME_ATTRIBUTE,
  LF_THEME_COLORS_PREFIX,
  LF_THEME_ICONS_PREFIX,
  LfColorInput,
  LfComponent,
  LfFrameworkInterface,
  LfDataDataset,
  LfDataNode,
  LfThemeBEMModifier,
  LfThemeCustomStyles,
  LfThemeInterface,
  LfThemeList,
  THEME_LIST,
  GLOBAL_STYLES,
} from "@lf-widgets/foundations";

export class LfTheme implements LfThemeInterface {
  #COMPONENTS: Set<LfComponent> = new Set();
  #CURRENT: string;
  #DEFAULT = "dark";
  #LIST: LfThemeList;
  #MANAGER: LfFrameworkInterface;
  #MASTER_CUSTOM_STYLE: keyof LfThemeCustomStyles = "MASTER";
  #STYLE_ELEMENT: HTMLStyleElement;
  // Cached sprite sheet indexing for centralized access
  #SPRITE_IDS?: Set<string>;
  #SPRITE_INDEXING?: Promise<Set<string>>;

  constructor(lfFramework: LfFrameworkInterface) {
    this.#MANAGER = lfFramework;
    this.#LIST = THEME_LIST;
    this.#CURRENT = this.#DEFAULT;
  }

  #consistencyCheck = () => {
    const { logs } = this.#MANAGER.debug;

    if (!this.#LIST?.[this.#CURRENT]) {
      logs.new(this, `Invalid theme! Falling back to (${this.#DEFAULT}).`);
      this.#CURRENT = this.#DEFAULT;
    }
  };
  #prepFont = () => {
    const { get } = this.#MANAGER.assets;

    let css = "";
    const { font } = this.get.current();

    if (font?.length) {
      font.forEach((f) => {
        const path = get(`./assets/fonts/${f}-Regular`).path;

        css += `@font-face{font-family:${f.split("-")[0].replace(/(?<!^)(?=[A-Z])/g, " ")};`;
        css += `src:url('${path}.woff2')format('woff2');}`;
      });
    }

    return css;
  };
  #prepGlobalStyles = (): string => {
    let css = "";

    for (const [selector, rules] of Object.entries(GLOBAL_STYLES)) {
      if (selector.startsWith("@keyframes")) {
        css += `${selector} { `;
        if (Array.isArray(rules)) {
          for (const frame of rules) {
            for (const [frameKey, props] of Object.entries(frame)) {
              css += `${frameKey} { `;
              for (const [prop, value] of Object.entries(
                props as Record<string, string>,
              )) {
                css += `${prop}: ${value}; `;
              }
              css += `} `;
            }
          }
        }
        css += `} `;
      } else {
        css += `${selector} { `;
        for (const [prop, value] of Object.entries(
          rules as Record<string, string>,
        )) {
          css += `${prop}: ${value}; `;
        }
        css += `} `;
      }
    }
    return css.trim();
  };
  #prepVariables = () => {
    const { assets, color } = this.#MANAGER;

    let css = "";
    const { variables } = this.get.current();

    Object.entries(variables).forEach(([key, val]) => {
      switch (key) {
        case key.startsWith(LF_THEME_COLORS_PREFIX) && key:
          const { rgbValues } = color.compute(val as LfColorInput);

          css += `${key}: ${rgbValues};`;
          break;
        case key.startsWith(LF_THEME_ICONS_PREFIX) && key:
          const path = assets.get(`./assets/svg/${val}.svg`).path;

          css += `${key}: url(${path}) no-repeat center;`;
          break;
        default:
          css += `${key}: ${val};`;
          break;
      }
    });

    return css;
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
    let css = "";
    css += this.#prepFont();
    css += this.#prepGlobalStyles();
    css += `:root[lf-theme="${this.#CURRENT}"] {${this.#prepVariables()}}`;

    this.#STYLE_ELEMENT.innerText = css;
  };

  //#region bemClass
  /**
   * Generates a BEM (Block Element Modifier) class name string.
   *
   * @param block - The block name in BEM notation
   * @param element - Optional element name in BEM notation
   * @param modifiers - Optional object containing modifier flags. Keys represent modifier names, values determine if modifier is active
   * @returns A string containing the complete BEM class name with any active modifiers
   *
   * @example
   * // Returns "button"
   * bemClass('button')
   *
   * @example
   * // Returns "button__icon"
   * bemClass('button', 'icon')
   *
   * @example
   * // Returns "button__icon button__icon--large button__icon--active"
   * bemClass('button', 'icon', { large: true, active: true, disabled: false })
   */
  bemClass = (
    block: string,
    element?: string,
    modifiers?: Partial<LfThemeBEMModifier>,
  ) => {
    let baseClass = element ? `${block}__${element}` : block;

    if (modifiers) {
      const modifierClasses = Object.entries(modifiers)
        .filter(([_, isActive]) => isActive)
        .map(([key]) => `${baseClass}--${key}`);
      baseClass += ` ${modifierClasses.join(" ")}`;
    }

    return baseClass.trim();
  };
  //#endregion

  //#region get
  get = {
    current: () => {
      this.#consistencyCheck();

      const { variables, isDark, customStyles, font } =
        this.#LIST[this.#CURRENT];

      return {
        variables,
        customStyles,
        font,
        isDark,
        name: this.#CURRENT,
        full: this.#LIST[this.#CURRENT],
      };
    },
    sprite: {
      path: (): string => {
        const { assets } = this.#MANAGER;
        return assets.get("./assets/svg/sprite.svg").path;
      },
      ids: async (): Promise<Set<string>> => {
        if (this.#SPRITE_IDS) return this.#SPRITE_IDS;
        if (this.#SPRITE_INDEXING) return this.#SPRITE_INDEXING;

        this.#SPRITE_INDEXING = (async () => {
          try {
            const { assets } = this.#MANAGER;
            const sprite = assets.get("./assets/svg/sprite.svg");
            if (!sprite?.path || typeof fetch === "undefined")
              return new Set<string>();
            const res = await fetch(sprite.path);
            if (!res.ok) return new Set<string>();
            const text = await res.text();
            const ids = new Set<string>();
            const re = /<symbol\s+id=\"([^\"]+)\"/g;
            let m: RegExpExecArray | null;
            while ((m = re.exec(text))) ids.add(m[1]);
            this.#SPRITE_IDS = ids;
            return ids;
          } catch {
            return new Set<string>();
          } finally {
            this.#SPRITE_INDEXING = undefined;
          }
        })();

        return this.#SPRITE_INDEXING;
      },
      hasIcon: async (id: string): Promise<boolean> => {
        const ids = await this.get.sprite.ids();
        return ids.has(id);
      },
    },
    icon: (name: keyof typeof LF_ICONS_REGISTRY) => LF_ICONS_REGISTRY[name],
    icons: () => LF_ICONS_REGISTRY,
    themes: (): {
      asArray: string[];
      asDataset: LfDataDataset;
    } => {
      const asArray: string[] = [];
      const nodes: LfDataNode[] = [];
      Object.keys(this.#LIST).forEach((id) => {
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
              icon: this.get.icon("colorSwatch"),
              id: "root",
              value: "Random",
              children: nodes,
            },
          ],
        },
      };
    },
  };
  //#endregion

  //#region set
  /**
   * Sets theme parameters and applies them to the document.
   * If a name is provided, it will be set as the current theme.
   * If a list is provided, it will replace the current theme list.
   * Generates and applies CSS variables based on the selected theme.
   * Falls back to default theme if the selected theme is invalid.
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
   * Refreshes the current theme by updating CSS custom properties and icons in the document.
   * Applies changes to the :root element with the current theme name and dispatches a 'lf-theme-refresh' event.
   * If the refresh fails, logs a warning message.
   *
   * @remarks
   * The refresh method combines theme variables and icons into a single CSS rule set.
   *
   * @fires CustomEvent#lf-theme-refresh - When theme refresh is successful
   *
   * @example
   * ```ts
   * themeManager.refresh();
   * ```
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
   * Sets and validates custom CSS styles for a Lf-widgets component.
   * The function combines different sources of styles and checks for malicious CSS content.
   *
   * Style sources (in order of application):
   * 1. Master custom style (if exists)
   * 2. Component-specific style based on tag name (if exists)
   * 3. Component's lfStyle property (if exists)
   *
   * @param comp - The Lf-widgets component to apply styles to
   * @returns {string} Combined CSS string if valid, empty string if malicious content detected
   *
   * @example
   * const component = new LfComponent();
   * const cssStyles = setLfStyle(component);
   * if (cssStyles) {
   *   // Apply styles
   * }
   */
  setLfStyle = (comp: LfComponent): string => {
    const isMaliciousCSS = (css: string) => {
      if (!css) return true;
      if (/javascript:/i.test(css)) return true;
      if (/<script>/i.test(css)) return true;
      if (/url\(.*(javascript|data):/i.test(css)) return true;
      return false;
    };

    let css = "";
    const { customStyles } = this.get.current();
    const tag = comp.rootElement.tagName as keyof LfThemeCustomStyles;

    if (customStyles?.[this.#MASTER_CUSTOM_STYLE]) {
      css += customStyles[this.#MASTER_CUSTOM_STYLE];
    }
    if (customStyles?.[tag]) {
      css += ` ${customStyles[tag]}`;
    }
    if (comp.lfStyle) {
      css += ` ${comp.lfStyle}`;
    }

    return (!isMaliciousCSS(css) && css) || "";
  };
  //#endregion

  //#region randomize
  /**
   * Randomly sets a theme from the available themes list.
   * If the randomly selected theme is the current one, it will keep generating a new random index until a different theme is selected.
   * If no themes are available, a warning log will be generated.
   *
   * @throws Logs a warning if no themes are available
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
   * @param comp - The component to be registered. Must be a LfGenericComponent instance.
   */
  register = (comp: LfComponent) => {
    this.#COMPONENTS.add(comp);
  };
  //#endregion

  //#region unregister
  /**
   * Unregisters a component from the theme manager.
   *
   * @param comp - The component to unregister from theme management
   * @returns A function that handles the unregistration of the component
   */
  unregister = (comp: LfComponent) => {
    this.#COMPONENTS?.delete(comp);
  };
  //#endregion
}
