import {
  getComponentProps,
  LF_FRAMEWORK_ALLOWED_ATTRS,
  LF_FRAMEWORK_ALLOWED_PREFIXES,
  LfColorInterface,
  LfComponentName,
  LfComponentPropsFor,
  LfDataInterface,
  LfDebugInterface,
  LfDragInterface,
  LfEffectsInterface,
  LfFrameworkClickCb,
  LfFrameworkGetAssetPath,
  LfFrameworkInterface,
  LfFrameworkModuleKey,
  LfFrameworkModuleOptions,
  LfFrameworkSetAssetPath,
  LfFrameworkShapes,
  LfFrameworkShapesMap,
  LfFrameworkUtilities,
  LfLLMInterface,
  LfPortalInterface,
  LfSyntaxInterface,
  LfThemeInterface,
} from "@lf-widgets/foundations";
import { LfColor } from "../lf-color/lf-color";
import { LfData } from "../lf-data/lf-data";
import { LfDebug } from "../lf-debug/lf-debug";
import { LfDrag } from "../lf-drag/lf-drag";
import { LfEffects } from "../lf-effects/lf-effects";
import { LfLLM } from "../lf-llm/lf-llm";
import { LfPortal } from "../lf-portal/lf-portal";
import { LfSyntax } from "../lf-syntax/lf-syntax";
import { LfTheme } from "../lf-theme/lf-theme";

// Fallback asset path functions for environments without Stencil
let ASSET_BASE_PATH = "";
const fallbackGetAssetPath = (path: string) => {
  return ASSET_BASE_PATH + path;
};
const fallbackSetAssetPath = (path: string) => {
  ASSET_BASE_PATH = path.endsWith("/") ? path : path + "/";
};

// Default to fallbacks - components will register Stencil functions if available
let getAssetPath = fallbackGetAssetPath;
let setAssetPath = fallbackSetAssetPath;

export class LfFramework implements LfFrameworkInterface {
  #LISTENERS_SETUP = false;
  #MODULES = new Map<LfFrameworkModuleKey, LfFrameworkModuleOptions>([
    [
      "lf-framework",
      {
        name: "lf-framework",
        getAssetPath,
        setAssetPath,
      },
    ],
  ]);
  #SHAPES: LfFrameworkShapesMap = new WeakMap();

  #data?: LfDataInterface;
  #drag?: LfDragInterface;
  #llm?: LfLLMInterface;
  #portal?: LfPortalInterface;
  #syntax?: LfSyntaxInterface;

  assets: {
    get: LfFrameworkGetAssetPath;
    set: LfFrameworkSetAssetPath;
  };
  color: LfColorInterface;
  debug: LfDebugInterface;
  effects: LfEffectsInterface;
  utilities: LfFrameworkUtilities;
  theme: LfThemeInterface;

  constructor() {
    const ICON_STYLE_CACHE = new Map<
      string,
      { path: string; style: { mask: string; webkitMask: string } }
    >();

    this.assets = {
      get: (value, module = "lf-framework") => {
        if (!this.#MODULES.has(module)) {
          this.debug.logs.new(
            this,
            `Module ${module} is not registered.`,
            "error",
          );
          return {
            path: "",
            style: { mask: "", webkitMask: "" },
          };
        }

        const { getAssetPath } = this.#MODULES.get(module);
        const resolveGetAssetPath =
          typeof getAssetPath === "function"
            ? getAssetPath
            : fallbackGetAssetPath;

        if (ICON_STYLE_CACHE.has(value)) {
          return ICON_STYLE_CACHE.get(value);
        }

        const path = resolveGetAssetPath(value);
        const style = {
          mask: `url('${path}') no-repeat center`,
          webkitMask: `url('${path}') no-repeat center`,
        };
        const cached = { path, style };

        ICON_STYLE_CACHE.set(value, cached);

        return cached;
      },
      set: (value, module?) => {
        if (!module) {
          this.#MODULES.forEach(({ setAssetPath }) => {
            if (typeof setAssetPath === "function") {
              setAssetPath(value);
            } else {
              fallbackSetAssetPath(value);
            }
          });
        } else if (this.#MODULES.has(module)) {
          const { setAssetPath } = this.#MODULES.get(module);
          if (typeof setAssetPath === "function") {
            setAssetPath(value);
          } else {
            fallbackSetAssetPath(value);
          }
        }
      },
    };

    this.color = new LfColor(this);
    this.debug = new LfDebug(this);
    this.effects = new LfEffects(this);
    this.theme = new LfTheme(this);
    this.utilities = {
      clickCallbacks: new Set(),
    };
  }

  //#region Lazy Getters for Heavy Modules
  /**
   * Data module - lazy initialized on first access.
   * Provides utilities for data manipulation and tree structures.
   */
  get data(): LfDataInterface {
    if (!this.#data) {
      this.#data = new LfData(this);
    }
    return this.#data;
  }

  /**
   * Drag module - lazy initialized on first access.
   * Provides drag-and-drop functionality.
   */
  get drag(): LfDragInterface {
    if (!this.#drag) {
      this.#drag = new LfDrag(this);
    }
    return this.#drag;
  }

  /**
   * LLM module - lazy initialized on first access.
   * Provides utilities for LLM streaming and interaction.
   */
  get llm(): LfLLMInterface {
    if (!this.#llm) {
      this.#llm = new LfLLM(this);
    }
    return this.#llm;
  }

  /**
   * Portal module - lazy initialized on first access.
   * Manages DOM portals for rendering content outside component tree.
   */
  get portal(): LfPortalInterface {
    if (!this.#portal) {
      this.#portal = new LfPortal(this);
    }
    return this.#portal;
  }

  /**
   * Syntax module - lazy initialized on first access.
   * Provides markdown parsing and code syntax highlighting.
   * Heavy module: loads Prism + Markdown-it only when needed.
   */
  get syntax(): LfSyntaxInterface {
    if (!this.#syntax) {
      this.#syntax = new LfSyntax(this);
    }
    return this.#syntax;
  }
  //#endregion

  #setupListeners = () => {
    if (typeof document === "undefined") {
      return;
    }

    document.addEventListener("click", (e) => {
      const { utilities, portal } = this;
      const { clickCallbacks } = utilities;

      const paths = e.composedPath() as HTMLElement[];

      clickCallbacks.forEach(({ cb, element }) => {
        if (!element?.isConnected) {
          cb();
          return;
        }

        if (paths.includes(element)) {
          return;
        }

        const portalState = portal.getState(element);
        if (portalState) {
          const { parent } = portalState;

          if (!paths.includes(parent)) {
            cb();
          }
        } else {
          cb();
        }
      });
    });
  };

  //#region addClickCallback
  /**
   * Adds a callback function to be executed when a click event occurs.
   * @param cb - The callback function to be added.
   * @param async - Optional boolean flag. If true, the callback is added asynchronously using requestAnimationFrame.
   *                If false or not provided, the callback is added synchronously.
   */
  addClickCallback = (cb: LfFrameworkClickCb, async?: boolean) => {
    const { utilities } = this;
    const { clickCallbacks } = utilities;

    if (!this.#LISTENERS_SETUP) {
      this.#LISTENERS_SETUP = true;
      this.#setupListeners();
    }

    if (async) {
      requestAnimationFrame(async () => clickCallbacks.add(cb));
    } else {
      clickCallbacks.add(cb);
    }
  };
  //#endregion

  //#region assignRef
  /**
   * Creates a function to bind an HTML element reference to a specified key.
   *
   * This higher-order function accepts a record of HTML element references and a key.
   * It returns a callback that, when provided with a non-null HTML element, assigns it
   * to the specified key within the reference record.
   *
   * @template R - The type of keys used in the reference record.
   * @param refs - An object mapping keys to HTML elements. The element will be assigned to this object.
   * @param key - The key within the refs object where the element should be stored.
   * @returns A function that takes an HTML element and assigns it to the provided reference key if the element exists.
   */
  assignRef =
    <R extends string>(refs: Record<R & string, HTMLElement>, key: R) =>
    (el: HTMLElement) => {
      if (el) refs[key] = el;
    };
  //#endregion

  //#region getModules
  /**
   * Retrieves the list of registered modules.
   * @returns A Map object containing the registered modules.
   */
  getModules = () => this.#MODULES;
  //#endregion

  //#region register
  /**
   * Registers a new module with the corresponding options.
   * If the module is already registered, the function logs an error and exits early.
   *
   * @param module - The unique key identifier for the module.
   * @param options - A partial configuration object for the module excluding the "name" property.
   */
  register = (
    module: LfFrameworkModuleKey,
    options: Partial<Omit<LfFrameworkModuleOptions, "name">>,
  ) => {
    if (this.#MODULES.has(module)) {
      this.debug.logs.new(
        this,
        `Module ${module} is already registered.`,
        "error",
      );
      return;
    }

    const safeGet =
      typeof options.getAssetPath === "function"
        ? options.getAssetPath
        : fallbackGetAssetPath;
    const safeSet =
      typeof options.setAssetPath === "function"
        ? options.setAssetPath
        : fallbackSetAssetPath;

    this.#MODULES.set(module, {
      name: module,
      getAssetPath: safeGet,
      setAssetPath: safeSet,
    });

    this.debug.logs.new(this, `Module ${module} registered.`);
  };
  //#endregion

  //#region removeClickCallback
  /**
   * Removes a callback function from the list of click event listeners.
   * @param cb - The callback function to be removed from the click event listeners.
   */
  removeClickCallback = (cb: LfFrameworkClickCb) => {
    this.utilities.clickCallbacks.delete(cb);
  };
  //#endregion

  //#region sanitizeProps
  /**
   * Sanitizes component properties by filtering out potentially malicious or disallowed attributes.
   *
   * @param props - The properties object to sanitize
   * @param compName - Optional component name to apply component-specific allowed attributes
   *
   * @typeParam P - Type extending GenericObject for the props parameter
   * @typeParam C - Type extending LfComponentName for the component name
   *
   * @returns A sanitized version of the props object, typed either as LfComponentPropsFor<C> if compName is provided, or as P otherwise
   *
   * @remarks
   * The function performs the following sanitization:
   * - Filters props against a whitelist of allowed HTML attributes
   * - Allows data-* and aria-* attributes
   * - Allows component-specific attributes based on compName
   * - Removes event handlers (on* attributes)
   * - Checks for potentially malicious values containing 'javascript:' or '<script>'
   */
  sanitizeProps<C extends LfComponentName>(
    props: { [key: string]: any },
    compName: C,
  ): LfComponentPropsFor<C>;
  sanitizeProps<P extends { [key: string]: any }>(props: P): P;
  sanitizeProps<P extends { [key: string]: any }, C extends LfComponentName>(
    props: P,
    compName?: C,
  ): LfComponentPropsFor<C> | P {
    const ALLOWED_ATTRS = new Set<string>(LF_FRAMEWORK_ALLOWED_ATTRS);
    const ALLOWED_PREFIXES = new Set<string>(LF_FRAMEWORK_ALLOWED_PREFIXES);
    const PROPS = getComponentProps();

    if (compName && PROPS[compName]) {
      for (const key of PROPS[compName]) {
        ALLOWED_ATTRS.add(key as string);
      }
    }

    const isAllowedAttribute = (attrName: string): boolean => {
      if (ALLOWED_ATTRS.has(attrName)) return true;
      if (ALLOWED_PREFIXES.has(attrName.split("-")[0])) return true;
      return false;
    };

    const isMaliciousValue = (value: any): boolean => {
      if (typeof value !== "string") return false;
      if (/javascript:/i.test(value)) return true;
      if (/<script>/i.test(value)) return true;
      return false;
    };

    const sanitized: { [key: string]: any } = {};
    for (const key in props) {
      if (!Object.prototype.hasOwnProperty.call(props, key)) continue;
      const value = props[key];

      if (key.toLowerCase().startsWith("on")) continue;
      if (!isAllowedAttribute(key)) continue;
      if (isMaliciousValue(value)) continue;

      sanitized[key] = value;
    }

    if (compName) {
      return sanitized as unknown as LfComponentPropsFor<C>;
    } else {
      return sanitized as P;
    }
  }
  //#endregion

  //#region shapes
  shapes = {
    get: () => this.#SHAPES.get(this),
    set: (shapes: LfFrameworkShapes) => {
      this.#SHAPES.set(this, shapes);
    },
  };
  //#endregion
}
