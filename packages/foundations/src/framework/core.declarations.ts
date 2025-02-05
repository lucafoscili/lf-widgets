import { getComponentProps } from "../foundations/components.constants";
import {
  LfComponentName,
  LfComponentPropsFor,
} from "../foundations/components.declarations";
import { LfColorInterface } from "./color.declarations";
import {
  LF_CORE_ALLOWED_ATTRS,
  LF_CORE_ALLOWED_PREFIXES,
} from "./core.constants";
import { LfDataInterface } from "./data.declarations";
import { LfDebugInterface } from "./debug.declarations";
import { LfDragInterface } from "./drag.declarations";
import { LfEffectsInterface } from "./effects.declarations";
import { LfLLMInterface } from "./llm.declarations";
import { LfPortalInterface } from "./portal.declarations";
import { LfThemeInterface } from "./theme.declarations";

//#region Class
export interface LfCoreInterface {
  assets: {
    get: LfCoreComputedGetAssetPath;
    set: LfCoreSetAssetPath;
  };
  color: LfColorInterface;
  data: LfDataInterface;
  debug: LfDebugInterface;
  drag: LfDragInterface;
  effects: LfEffectsInterface;
  llm: LfLLMInterface;
  portal: LfPortalInterface;
  utilities: LfCoreUtilities;
  theme: LfThemeInterface;
  addClickCallback: (cb: LfCoreClickCb, async?: boolean) => void;
  assignRef: <R extends string>(
    refs: Record<R, HTMLElement>,
    key: R,
  ) => (el: HTMLElement) => void;
  removeClickCallback: (cb: LfCoreClickCb) => void;
  sanitizeProps<P extends { [key: string]: any }>(props: P): P;
  sanitizeProps<C extends LfComponentName>(
    props: { [key: string]: any },
    compName: C,
  ): LfComponentPropsFor<C>;
}
//#endregion

//#region Utilities
export interface LfCoreUtilities {
  clickCallbacks?: Set<LfCoreClickCb>;
}
export interface LfCoreClickCb {
  cb: () => unknown;
  element?: HTMLElement;
}
export type LfCoreGetAssetPath = (value: string) => string;
export type LfCoreSetAssetPath = (value: string) => void;
export type LfCoreComputedGetAssetPath = (value: string) => {
  path: string;
  style: { mask: string; webkitMask: string };
};
export type LfCoreEvent = CustomEvent<LfCoreEventPayload>;
export interface LfCoreEventPayload {
  lfCore: LfCoreInterface;
}
export type LfCoreAllowedKeysMap = {
  [P in (typeof LF_CORE_ALLOWED_PREFIXES)[number] as
    | `${P}-`
    | (typeof LF_CORE_ALLOWED_ATTRS)[number]
    | ReturnType<typeof getComponentProps>[keyof ReturnType<
        typeof getComponentProps
      >][number]]: any;
};

//#endregion
