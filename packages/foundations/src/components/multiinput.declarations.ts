import {
  LfComponentAdapter,
  LfComponentAdapterBaseGetters,
  LfComponentAdapterDispatchDetail,
  LfComponentAdapterDispatcher,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
  LfComponentAdapterSetters,
  VNode,
} from "../foundations";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEvent, LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import {
  LfChipElement,
  LfChipEventPayload,
  LfChipInterface,
} from "./chip.declarations";
import {
  LF_MULTIINPUT_BLOCKS,
  LF_MULTIINPUT_EVENTS,
  LF_MULTIINPUT_PARTS,
} from "./multiinput.constants";
import {
  LfTextfieldEventPayload,
  LfTextfieldInterface,
} from "./textfield.declarations";

//#region Interface
export interface LfMultiInputInterface
  extends LfComponent<"LfMultiInput">,
    LfMultiInputPropsInterface {
  addToHistory: (value: string) => Promise<void>;
  getHistory: () => Promise<string[]>;
  getState: () => Promise<{ value: string; history: string[] }>;
  getValue: () => Promise<string>;
  setHistory: (values: string[]) => Promise<void>;
  setValue: (value: string) => Promise<void>;
}
export interface LfMultiInputElement
  extends HTMLStencilElement,
    Omit<LfMultiInputInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-multiinput` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Pure state reads (ALL must be functions `() => T`)
 * - controller.set: Simple single-value assignments
 * - controller.computed: Derived values, predicates (pure functions)
 * - controller.actions: Multi-step operations (toggles, batch changes)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfMultiInputAdapter
  extends LfComponentAdapter<
    LfMultiInputInterface,
    LfMultiInputEventPayload,
    LfMultiInputAdapterHandlers,
    LfMultiInputAdapterJsx,
    LfMultiInputAdapterRefs,
    LfMultiInputAdapterControllerGetters,
    LfMultiInputAdapterControllerSetters,
    LfMultiInputAdapterControllerComputed,
    LfMultiInputAdapterControllerActions
  > {
  controller: {
    get: LfMultiInputAdapterControllerGetters;
    set: LfMultiInputAdapterControllerSetters;
    computed: LfMultiInputAdapterControllerComputed;
    actions: LfMultiInputAdapterControllerActions;
  };
  dispatcher: LfMultiInputAdapterDispatcher;
  elements: {
    jsx: LfMultiInputAdapterJsx;
    refs: LfMultiInputAdapterRefs;
  };
  handlers: LfMultiInputAdapterHandlers;
}
/**
 * Read-only controller surface exposed by the adapter for integration code.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 * Contains ONLY pure state reads - predicates go in `computed`.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfMultiInputAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfMultiInputInterface,
    (typeof LF_MULTIINPUT_BLOCKS)["multiinput"],
    Record<string, never>,
    typeof LF_MULTIINPUT_PARTS
  > {
  /** Current history nodes */
  historyNodes: () => LfDataNode[];
  /** Current history values as strings */
  historyValues: () => string[];
  /** Current dataset */
  lfDataset: () => LfDataDataset;
  /** Current input value */
  value: () => string;
  /** Maximum history entries allowed */
  maxHistory: () => number;
  /** Whether component is in tags mode */
  isTagsMode: () => boolean;
  /** Whether free input is allowed */
  allowFreeInput: () => boolean;
}
/**
 * Simple single-value assignments exposed by the adapter.
 * Each setter performs exactly ONE state change.
 */
export interface LfMultiInputAdapterControllerSetters
  extends LfComponentAdapterSetters {
  /** Replace history nodes */
  history: (nodes: LfDataNode[]) => Promise<void>;
  /** Update current value */
  value: (value: string) => Promise<void>;
}
/**
 * Derived values and predicates computed from state.
 * Pure functions with no side effects.
 */
export interface LfMultiInputAdapterControllerComputed {
  /** Whether history has items */
  hasItems: () => boolean;
  /** Whether component is disabled */
  isDisabled: () => boolean;
  /** Whether max history limit is reached */
  isAtLimit: () => boolean;
  /** Whether value is a duplicate in history */
  isDuplicate: (value: string) => boolean;
  /** Whether the value is allowed (based on mode and allowFreeInput) */
  isValueAllowed: (value: string) => boolean;
  /** Get current tags from value (tags mode only) */
  currentTags: () => string[];
}
/**
 * Multi-step operations that may batch changes or have side effects.
 */
export interface LfMultiInputAdapterControllerActions {
  /** Add item to history with validation */
  addItem: (value: string) => Promise<void>;
  /** Remove item from history by index */
  removeItem: (index: number) => Promise<void>;
  /** Clear all history items */
  clearAll: () => Promise<void>;
  /** Commit current value (validate + add to history + clear input) */
  commitValue: (value: string) => Promise<void>;
  /** Toggle tag selection (tags mode only) */
  toggleTag: (tag: string) => Promise<void>;
}
export interface LfMultiInputAdapterJsx extends LfComponentAdapterJsx {
  chips: () => VNode | null;
  textfield: () => VNode;
}
export interface LfMultiInputAdapterRefs extends LfComponentAdapterRefs {
  chips: LfChipElement;
  /** FC usage: input element from LfTextfieldFC */
  textfield: HTMLInputElement | HTMLTextAreaElement | null;
}
export interface LfMultiInputAdapterHandlers
  extends LfComponentAdapterHandlers {
  chips: (event: LfEvent<LfChipEventPayload>) => Promise<void>;
  textfield: (event: LfEvent<LfTextfieldEventPayload>) => Promise<void>;
  /**
   * FC-compatible textfield input handler.
   * Called directly by LfTextfieldFC's onInput callback.
   */
  textfieldInput: (event: Event, value: string) => void;
  /**
   * FC-compatible textfield keydown handler.
   * Called directly by LfTextfieldFC's onKeyDown callback.
   */
  textfieldKeyDown: (event: KeyboardEvent) => void;
  /**
   * FC-compatible textfield action icon click handler.
   * Called directly by LfTextfieldFC's onIconClick callback.
   */
  textfieldIconClick: (
    event: MouseEvent,
    iconType: "regular" | "action",
  ) => void;
}
//#endregion

//#region Dispatcher
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfMultiInputAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfMultiInputEventPayload>;
export type LfMultiInputAdapterDispatcherDetailOverrides = {
  [E in LfMultiInputEvent]: E extends "lf-event"
    ? LfMultiInputAdapterDispatchDetailBase & {
        originalEvent: CustomEvent;
      }
    : E extends "ready" | "unmount"
      ? Omit<LfMultiInputAdapterDispatchDetailBase, "originalEvent"> & {
          originalEvent?: never;
        }
      : LfMultiInputAdapterDispatchDetailBase;
};
export type LfMultiInputAdapterDispatcher = LfComponentAdapterDispatcher<
  LfMultiInputEventPayload,
  LfMultiInputAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Events
export type LfMultiInputEvent = (typeof LF_MULTIINPUT_EVENTS)[number];
export interface LfMultiInputEventPayload
  extends LfEventPayload<"LfMultiInput", LfMultiInputEvent> {
  node?: LfDataNode;
  value?: string;
}
//#endregion

//#region Props
export interface LfMultiInputPropsInterface {
  lfAllowFreeInput?: boolean;
  lfChipProps?: Partial<LfChipInterface>;
  lfDataset?: LfDataDataset;
  lfMaxHistory?: number;
  lfMode?: LfMultiInputMode;
  lfStyle?: string;
  lfTextfieldProps?: Partial<LfTextfieldInterface>;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: string;
}
export type LfMultiInputMode = "history" | "tags";
//#endregion
