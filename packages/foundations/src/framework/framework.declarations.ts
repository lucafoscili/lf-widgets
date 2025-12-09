import { getComponentProps } from "../foundations/components.constants";
import {
  LfComponentName,
  LfComponentPropsFor,
} from "../foundations/components.declarations";
import { LfColorInterface } from "./color.declarations";
import { LfDataInterface, LfDataShapes } from "./data.declarations";
import { LfDebugInterface } from "./debug.declarations";
import { LfDragInterface } from "./drag.declarations";
import { LfEffectsInterface } from "./effects.declarations";
import {
  LF_FRAMEWORK_ALLOWED_ATTRS,
  LF_FRAMEWORK_ALLOWED_PREFIXES,
  LF_FRAMEWORK_MODULES,
} from "./framework.constants";
import { LfLLMInterface } from "./llm.declarations";
import { LfPortalInterface } from "./portal.declarations";
import { LfSyntaxInterface } from "./syntax.declarations";
import { LfThemeInterface } from "./theme.declarations";
import { LfTooltipInterface } from "./tooltip.declarations";

//#region Class
/**
 * Primary interface exposing the core runtime framework.
 */
export interface LfFrameworkInterface {
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
  syntax: LfSyntaxInterface;
  theme: LfThemeInterface;
  tooltip: LfTooltipInterface;
  utilities: LfFrameworkUtilities;
  addClickCallback: (cb: LfFrameworkClickCb, async?: boolean) => void;
  assignRef: <R extends string>(
    refs: Record<R, HTMLElement>,
    key: R,
  ) => (el: HTMLElement) => void;
  getModules: () => Map<LfFrameworkModuleKey, LfFrameworkModuleOptions>;
  register: (
    module: LfFrameworkModuleKey,
    options: Partial<LfFrameworkModuleOptions>,
  ) => void;
  removeClickCallback: (cb: LfFrameworkClickCb) => void;
  sanitizeProps<P extends { [key: string]: any }>(props: P): P;
  sanitizeProps<C extends LfComponentName>(
    props: Partial<LfComponentPropsFor<C>>,
    compName: C,
  ): Partial<LfComponentPropsFor<C>>;
  shapes: {
    get: () => LfFrameworkShapes;
    set: (value: LfFrameworkShapes) => void;
  };
}
//#endregion

//#region Utilities
/**
 * Internal utilities registry maintained by the core runtime framework.
 */
export interface LfFrameworkUtilities {
  clickCallbacks?: Set<LfFrameworkClickCb>;
}
/**
 * Click callback metadata tracked by the core runtime framework.
 */
export interface LfFrameworkClickCb {
  cb: () => unknown;
  element?: HTMLElement;
}
/**
 * Union of module identifiers recognised by the core runtime framework.
 */
export type LfFrameworkModuleKey = (typeof LF_FRAMEWORK_MODULES)[number];
/**
 * Resolver used by the core runtime framework to compute module asset paths.
 */
export type LfFrameworkGetAssetPath = (
  value: string,
  module?: LfFrameworkModuleKey,
) => {
  path: string;
  style: { mask: string; webkitMask: string };
};
/**
 * Setter used by the core runtime framework to override module asset paths.
 */
export type LfFrameworkSetAssetPath = (
  value: string,
  module?: LfFrameworkModuleKey,
) => void;
/**
 * Configuration options for the module in the core runtime framework.
 */
export interface LfFrameworkModuleOptions {
  name: LfFrameworkModuleKey;
  getAssetPath?: (value: string) => string;
  setAssetPath?: (value: string) => void;
}
/**
 * Utility type used by the core runtime framework.
 */
export type LfFrameworkEvent = CustomEvent<LfFrameworkEventPayload>;
/**
 * Payload definition dispatched with events from the core runtime framework.
 */
export interface LfFrameworkEventPayload {
  lfFramework: LfFrameworkInterface;
}
/**
 * Dictionary mapping allowed keys within the core runtime framework.
 */
export type LfFrameworkAllowedKeysMap = {
  [P in (typeof LF_FRAMEWORK_ALLOWED_PREFIXES)[number] as
    | `${P}-`
    | (typeof LF_FRAMEWORK_ALLOWED_ATTRS)[number]
    | ReturnType<typeof getComponentProps>[keyof ReturnType<
        typeof getComponentProps
      >][number]]: any;
};
/**
 * Dictionary mapping shapes within the core runtime framework.
 */
export type LfFrameworkShapesMap = WeakMap<
  LfFrameworkInterface,
  Record<LfDataShapes, string>
>;
/**
 * Data shape helper describing framework for the core runtime framework.
 */
export type LfFrameworkShapes = Record<LfDataShapes, string>;
//#endregion
