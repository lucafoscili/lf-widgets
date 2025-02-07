import { getComponentProps } from "../foundations/components.constants";
import {
  LfComponentName,
  LfComponentPropsFor,
} from "../foundations/components.declarations";
import { LfColorInterface } from "./color.declarations";
import { LfDataInterface } from "./data.declarations";
import { LfDebugInterface } from "./debug.declarations";
import { LfDragInterface } from "./drag.declarations";
import { LfEffectsInterface } from "./effects.declarations";
import {
  LF_FRAMEWORK_ALLOWED_ATTRS,
  LF_FRAMEWORK_ALLOWED_PREFIXES,
} from "./framework.constants";
import { LfLLMInterface } from "./llm.declarations";
import { LfPortalInterface } from "./portal.declarations";
import { LfThemeInterface } from "./theme.declarations";

//#region Class
export interface LfFrameworkInterface {
  assets: {
    get: LfFrameworkComputedGetAssetPath;
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
  addClickCallback: (cb: LfFrameworkClickCb, async?: boolean) => void;
  assignRef: <R extends string>(
    refs: Record<R, HTMLElement>,
    key: R,
  ) => (el: HTMLElement) => void;
  removeClickCallback: (cb: LfFrameworkClickCb) => void;
  sanitizeProps<P extends { [key: string]: any }>(props: P): P;
  sanitizeProps<C extends LfComponentName>(
    props: { [key: string]: any },
    compName: C,
  ): LfComponentPropsFor<C>;
}
//#endregion

//#region Utilities
export interface LfFrameworkUtilities {
  clickCallbacks?: Set<LfFrameworkClickCb>;
}
export interface LfFrameworkClickCb {
  cb: () => unknown;
  element?: HTMLElement;
}
export type LfFrameworkGetAssetPath = (value: string) => string;
export type LfFrameworkSetAssetPath = (value: string) => void;
export type LfFrameworkComputedGetAssetPath = (value: string) => {
  path: string;
  style: { mask: string; webkitMask: string };
};
export type LfFrameworkEvent = CustomEvent<LfFrameworkEventPayload>;
export interface LfFrameworkEventPayload {
  lfFramework: LfFrameworkInterface;
}
export type LfFrameworkAllowedKeysMap = {
  [P in (typeof LF_FRAMEWORK_ALLOWED_PREFIXES)[number] as
    | `${P}-`
    | (typeof LF_FRAMEWORK_ALLOWED_ATTRS)[number]
    | ReturnType<typeof getComponentProps>[keyof ReturnType<
        typeof getComponentProps
      >][number]]: any;
};

//#endregion
