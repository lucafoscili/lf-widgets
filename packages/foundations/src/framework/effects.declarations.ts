import { LF_EFFECTS_LIST } from "./effects.constants";

//#region Class
export interface LfEffectsInterface {
  backdrop: {
    hide: () => void;
    isVisible: () => boolean;
    show: (onClose?: () => void) => void;
  };
  isRegistered: (element: HTMLElement) => boolean;
  lightbox: {
    hide: () => void;
    isVisible: () => boolean;
    show: (element: HTMLElement, closeCb?: (...args: any[]) => void) => void;
  };
  register: {
    tilt: (element: HTMLElement, intensity?: number) => void;
  };
  ripple: (
    e: PointerEvent,
    element: HTMLElement,
    autoSurfaceRadius?: boolean,
  ) => void;
  set: {
    intensity: (key: keyof LfEffectsIntensities, value: number) => void;
    timeout: (key: keyof LfEffectsTimeouts, value: number) => void;
  };
  unregister: {
    tilt: (element: HTMLElement) => void;
  };
}
//#endregion

//#region Utilities
export type LfEffectsIntensities = Partial<{
  [index: LfEffectsValues[number]]: number;
}>;
export type LfEffectsTimeouts = Partial<{
  [index: LfEffectsValues[number]]: number;
}>;
export type LfEffectsValues = (typeof LF_EFFECTS_LIST)[number];
//#endregion
