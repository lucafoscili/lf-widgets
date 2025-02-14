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
  LfThemeInterface,
} from "@lf-widgets/foundations";
import { getAssetPath, setAssetPath } from "@stencil/core";
import { LfColor } from "../lf-color/lf-color";
import { LfData } from "../lf-data/lf-data";
import { LfDebug } from "../lf-debug/lf-debug";
import { LfDrag } from "../lf-drag/lf-drag";
import { LfEffects } from "../lf-effects/lf-effects";
import { LfLLM } from "../lf-llm/lf-llm";
import { LfPortal } from "../lf-portal/lf-portal";
import { LfTheme } from "../lf-theme/lf-theme";

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

  assets: {
    get: LfFrameworkGetAssetPath;
    set: LfFrameworkSetAssetPath;
  };
  color: LfColorInterface;
  data: LfDataInterface;
  debug: LfDebugInterface;
  drag: LfDragInterface;
  effects: LfEffectsInterface;
  llm: LfLLMInterface;
  portal: LfPortalInterface;
  utilities: LfFrameworkUtilities;
  theme: LfThemeInterface;

  constructor() {
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

        const path = getAssetPath(value);
        const style = {
          mask: `url('${path}') no-repeat center`,
          webkitMask: `url('${path}') no-repeat center`,
        };

        return {
          path,
          style,
        };
      },
      set: (value, module?) => {
        if (!module) {
          this.#MODULES.forEach(({ setAssetPath }) => setAssetPath(value));
        } else if (this.#MODULES.has(module)) {
          const { setAssetPath } = this.#MODULES.get(module);
          setAssetPath(value);
        }
      },
    };

    this.color = new LfColor(this);
    this.data = new LfData(this);
    this.debug = new LfDebug(this);
    this.drag = new LfDrag(this);
    this.effects = new LfEffects(this);
    this.llm = new LfLLM(this);
    this.portal = new LfPortal(this);
    this.theme = new LfTheme(this);
    this.utilities = {
      clickCallbacks: new Set(),
    };
  }

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

    this.#MODULES.set(module, { name: module, ...options });

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
