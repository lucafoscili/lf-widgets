import { LfCodeInterface } from "../components/code.declarations";
import { LfToggleInterface } from "../components/toggle.declarations";
import {
  LfComponent,
  LfComponentName,
} from "../foundations/components.declarations";
import { LfColorInterface } from "./color.declarations";
import { LfCoreInterface } from "./core.declarations";
import { LfDataInterface } from "./data.declarations";
import { LfDragInterface } from "./drag.declarations";
import { LfEffectsInterface } from "./effects.declarations";
import { LfLLMInterface } from "./llm.declarations";
import { LfPortalInterface } from "./portal.declarations";
import { LfThemeInterface } from "./theme.declarations";
import {
  LF_DEBUG_CATEGORIES,
  LF_DEBUG_LIFECYCLES,
  LF_DEBUG_LOG_TYPES,
} from "./debug.constants";

//#region Class
export interface LfDebugInterface {
  info: {
    create: () => LfDebugLifecycleInfo;
    update: (
      comp: LfComponent<LfComponentName>,
      lifecycle: LfDebugLifecycles,
    ) => Promise<void>;
  };
  logs: LfDebugLogFactory;
  isEnabled: () => boolean;
  register: (comp: LfDebugManagedComponents) => void;
  toggle: (value?: boolean, dispatch?: boolean) => boolean;
  unregister: (comp: LfDebugManagedComponents) => void;
}
//#endregion

//#region Utilities
export interface LfDebugLifecycleInfo {
  endTime: number;
  renderCount: number;
  renderEnd: number;
  renderStart: number;
  startTime: number;
}
export interface LfDebugLogFactory {
  dump: () => void;
  fromComponent(comp: LfDebugLogClass): comp is LfComponent;
  new: (
    comp: LfDebugLogClass,
    message: string,
    category?: LfDebugCategory,
  ) => Promise<void>;
  print: () => void;
}
export type LfDebugManagedComponents = LfCodeInterface | LfToggleInterface;
export interface LfDebugLog {
  category: LfDebugCategory;
  class: LfDebugLogClass;
  date: Date;
  id: string;
  message: string;
  type: LfDebugLogType;
}
export type LfDebugLogToPrintEntry = {
  class: LfDebugLogClass;
  date: string;
  message: string;
};
export type LfDebugLogClass =
  | LfColorInterface
  | LfComponent
  | LfDataInterface
  | LfDebugInterface
  | LfDragInterface
  | LfLLMInterface
  | LfCoreInterface
  | LfPortalInterface
  | LfEffectsInterface
  | LfThemeInterface;
export type LfDebugLogsToPrint = {
  [index in LfDebugLogType]: LfDebugLogToPrintEntry[];
};
export type LfDebugCategory = (typeof LF_DEBUG_CATEGORIES)[number];
export type LfDebugLifecycles = (typeof LF_DEBUG_LIFECYCLES)[number];
export type LfDebugLogType = (typeof LF_DEBUG_LOG_TYPES)[number];
//#endregion
