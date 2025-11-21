import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_MULTIINPUT_BLOCKS,
  LF_MULTIINPUT_PARTS,
  LF_MULTIINPUT_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfChipInterface,
  LfDataDataset,
  LfDataNode,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfMultiInputAdapter,
  LfMultiInputElement,
  LfMultiInputEvent,
  LfMultiInputEventPayload,
  LfMultiInputInterface,
  LfMultiInputMode,
  LfMultiInputPropsInterface,
  LfTextfieldInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import {
  Component,
  Element,
  Event,
  EventEmitter,
  forceUpdate,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch,
} from "@stencil/core";
import { awaitFramework } from "../../utils/setup";
import {
  historyDiffers,
  historyValues,
  normalizeHistoryNodes,
  normalizeHistoryValues,
} from "./helpers.history";
import { normalizeTags, parseTags, stringifyTags } from "./helpers.tags";
import { createAdapter } from "./lf-multiinput-adapter";

/**
 * The multiinput component combines a textfield with a chip-based history bar.
 * It exposes a single string value while allowing quick selection from recent entries.
 *
 * @component
 * @tag lf-multiinput
 * @shadow true
 *
 * @example
 * <lf-multiinput lfValue="Hello" lfMaxHistory={5}></lf-multiinput>
 *
 * @fires {CustomEvent} lf-multiinput-event - Emitted for ready/input/change/select-history/clear-history/unmount events
 */
@Component({
  tag: "lf-multiinput",
  styleUrl: "lf-multiinput.scss",
  shadow: true,
})
export class LfMultiInput implements LfMultiInputInterface {
  /**
   * References the root HTML element of the component (<lf-multiinput>).
   */
  @Element() rootElement: LfMultiInputElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() historyNodes: LfDataNode[] = [];
  @State() value = "";
  //#endregion

  //#region Props
  /**
   * When false, values must match an entry in the history dataset to be accepted on commit.
   *
   * @type {boolean}
   * @default true
   * @mutable
   */
  @Prop({ mutable: true }) lfAllowFreeInput: boolean = true;
  /**
   * Props forwarded to the internal lf-chip history row.
   *
   * @type {Partial<LfChipInterface>}
   * @default null
   * @mutable
   */
  @Prop({ mutable: true }) lfChipProps: Partial<LfChipInterface> = null;
  /**
   * Dataset backing the history chips. Nodes are treated as the source of truth.
   *
   * @type {LfDataDataset}
   * @default null
   * @mutable
   */
  @Prop({ mutable: true }) lfDataset: LfDataDataset = null;
  /**
   * Maximum number of history entries to retain.
   *
   * @type {number}
   * @default 10
   * @mutable
   */
  @Prop({ mutable: true }) lfMaxHistory: number = 10;
  /**
   * Custom CSS string injected into the component shadow root.
   *
   * @type {string}
   * @default null
   * @mutable
   */
  @Prop({ mutable: true }) lfStyle: string = null;
  /**
   * Behaviour mode for the component.
   * - "history": single-value + commit history (default).
   * - "tags": tag selection where the value is a comma-separated list of tags.
   *
   * @type {LfMultiInputMode}
   * @default "history"
   * @mutable
   */
  @Prop({ mutable: true }) lfMode: LfMultiInputMode = "history";
  /**
   * Props forwarded to the internal lf-textfield input.
   *
   * @type {Partial<LfTextfieldInterface>}
   * @default null
   * @mutable
   */
  @Prop({ mutable: true }) lfTextfieldProps: Partial<LfTextfieldInterface> =
    null;
  /**
   * UI size token propagated to children.
   *
   * @type {LfThemeUISize}
   * @default "medium"
   * @mutable
   */
  @Prop({ mutable: true, reflect: true }) lfUiSize: LfThemeUISize = "medium";
  /**
   * UI state token propagated to children.
   *
   * @type {LfThemeUIState}
   * @default "primary"
   * @mutable
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  /**
   * Initial string value for the textfield.
   *
   * @type {string}
   * @default ""
   * @mutable false
   */
  @Prop({ mutable: false }) lfValue: string = "";
  //#endregion

  //#region Internal variables
  #adapter: LfMultiInputAdapter;
  #framework: LfFrameworkInterface;
  #isSyncingDataset = false;
  #lastValidValue = "";
  #b = LF_MULTIINPUT_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_MULTIINPUT_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  //#endregion

  //#region Events
  /**
   * Unified event emitted for all interactions within the component.
   * Check `detail.eventType` to branch on specific actions.
   */
  @Event({
    eventName: "lf-multiinput-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfMultiInputEventPayload>;
  async onLfEvent(
    e: Event | CustomEvent,
    eventType: LfMultiInputEvent,
    args?: {
      node?: LfDataNode;
      value?: string;
    },
  ) {
    const { node, value } = args || {};

    switch (eventType) {
      case "change": {
        if (this.#isTagsMode()) {
          await this.#applyTagsCommit(value ?? "");
        } else {
          await this.#applyHistoryCommit(value ?? "", {
            clearTextfield: true,
            addToHistory: true,
          });
        }
        break;
      }
      case "clear-history":
        await this.#clearHistory();
        break;
      case "input":
        await this.#updateValue(value ?? "", {
          validate: false,
          syncTextfield: false,
        });
        break;
      case "select-history":
        if (node) {
          const raw = String(node.value ?? "");
          if (this.#isTagsMode()) {
            await this.#applyTagsCommit(raw, node);
          } else {
            await this.#applyHistoryCommit(raw, { addToHistory: false });
          }
          await this.#syncTextfieldValue(this.value);
        }
        break;
      default:
        break;
    }

    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement?.id || "",
      originalEvent: e,
      node,
      value: this.value,
    });
  }
  //#endregion

  //#region Watchers
  @Watch("lfAllowFreeInput")
  async onLfAllowFreeInputChange() {
    await this.#ensureValueValidity();
  }
  @Watch("lfDataset")
  async onLfDatasetChange(newDataset: LfDataDataset) {
    if (this.#isSyncingDataset) {
      return;
    }
    const normalized = normalizeHistoryNodes(
      newDataset?.nodes || [],
      this.#maxHistory(),
      (value, index) => this.#createNodeId(value, index),
    );
    const shouldResync = historyDiffers(normalized, this.historyNodes);
    this.historyNodes = normalized;
    if (shouldResync) {
      await this.#setHistoryNodes(normalized, { preserveColumns: true });
    } else {
      await this.#syncChipSelection();
    }
    await this.#ensureValueValidity();
  }
  @Watch("lfMaxHistory")
  async onLfMaxHistoryChange() {
    const normalized = normalizeHistoryNodes(
      this.historyNodes,
      this.#maxHistory(),
      (value, index) => this.#createNodeId(value, index),
    );
    await this.#setHistoryNodes(normalized, { preserveColumns: true });
  }
  //#endregion

  //#region Public methods
  @Method()
  /**
   * Adds a value to the history, ensuring no duplicates and maintaining order.
   * If the component is disabled or the value is empty, no action is taken.
   * The history is normalized, converted to nodes, and updated asynchronously.
   * @param value - The string value to add to the history.
   * @returns A promise that resolves when the history has been updated.
   */
  async addToHistory(value: string): Promise<void> {
    if (this.#isDisabled() || !value) {
      return;
    }
    const current = historyValues(this.historyNodes);
    const nextValues = [value, ...current.filter((v) => v !== value)];
    const normalized = normalizeHistoryValues(nextValues, this.#maxHistory());
    const nodes = this.#createNodesFromValues(normalized);
    await this.#setHistoryNodes(nodes, { preserveColumns: true });
  }
  /**
   * Fetches debug information of the component's current state.
   * @returns {Promise<LfDebugLifecycleInfo>} A promise that resolves with the debug information object.
   */
  @Method()
  async getDebugInfo(): Promise<LfDebugLifecycleInfo> {
    return this.debugInfo;
  }
  @Method()
  /**
   * Retrieves the history of values entered in the multi-input component.
   *
   * @returns {Promise<string[]>} A promise that resolves to an array of strings representing the historical values.
   */
  async getHistory(): Promise<string[]> {
    return historyValues(this.historyNodes);
  }
  /**
   * Used to retrieve component's properties and descriptions.
   * @returns {Promise<LfMultiInputPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfMultiInputPropsInterface> {
    const entries = LF_MULTIINPUT_PROPS.map(
      (
        prop,
      ): [
        keyof LfMultiInputPropsInterface,
        LfMultiInputPropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }
  @Method()
  /**
   * Retrieves the current state of the multi-input component, including its value and history.
   * @returns A promise that resolves to an object containing the current value as a string and the history as an array of strings.
   */
  async getState(): Promise<{ value: string; history: string[] }> {
    return { value: await this.getValue(), history: await this.getHistory() };
  }
  @Method()
  /**
   * Retrieves the current value of the multiinput component.
   * @returns {Promise<string>} The value as a string, or an empty string if no value is set.
   */
  async getValue(): Promise<string> {
    return this.value || "";
  }
  /**
   * This method is used to trigger a new render of the component.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }
  @Method()
  /**
   * Sets the history values for the multi-input component.
   * Normalizes the provided values, creates nodes from them, sets the history nodes while preserving columns,
   * and ensures the current value remains valid.
   * @param values - An array of string values to set as history.
   * @returns A promise that resolves when the history has been set and validity ensured.
   */
  async setHistory(values: string[]): Promise<void> {
    const normalized = normalizeHistoryValues(values || [], this.#maxHistory());
    const nodes = this.#createNodesFromValues(normalized);
    await this.#setHistoryNodes(nodes, { preserveColumns: true });
    await this.#ensureValueValidity();
  }
  @Method()
  /**
   * Sets the value of the multiinput component.
   * @param value - The string value to set.
   * @returns A promise that resolves when the value is updated and validated.
   */
  async setValue(value: string): Promise<void> {
    await this.#updateValue(value || "", { validate: true });
  }
  /**
   * Initiates the unmount sequence, which removes the component from the DOM after a delay.
   * @param {number} ms - Number of milliseconds
   */
  @Method()
  async unmount(ms: number = 0): Promise<void> {
    setTimeout(() => {
      this.onLfEvent(new CustomEvent("unmount"), "unmount", {
        value: this.value,
      });
      this.rootElement.remove();
    }, ms);
  }
  //#endregion

  //#region Private methods
  async #applyHistoryCommit(
    rawValue: string,
    options?: { clearTextfield?: boolean; addToHistory?: boolean },
  ) {
    const shouldClearTextfield = options?.clearTextfield === true;
    const shouldAddToHistory = options?.addToHistory !== false;

    const updated = await this.#updateValue(rawValue || "", {
      validate: true,
      syncTextfield: !shouldClearTextfield,
    });
    if (!updated) {
      return;
    }
    if (shouldAddToHistory && this.value) {
      await this.addToHistory(this.value);
    }

    if (shouldClearTextfield) {
      await this.#syncTextfieldValue("");
    }
  }
  async #applyTagsCommit(rawValue: string, node?: LfDataNode) {
    const isChipToggle = !!node;

    let tags: string[];
    if (isChipToggle) {
      const current = this.#currentTags();
      const tag = (rawValue ?? "").trim();
      if (!tag) {
        tags = current;
      } else if (current.includes(tag)) {
        tags = current.filter((t) => t !== tag);
      } else {
        tags = [...current, tag];
      }
    } else {
      tags = parseTags(rawValue ?? "");
    }

    tags = normalizeTags(tags);

    if (!this.lfAllowFreeInput) {
      tags = this.#filterAllowedTags(tags);
    }

    const stringValue = stringifyTags(tags);
    await this.#updateValue(stringValue, {
      validate: false,
      syncTextfield: false,
    });

    if (this.lfAllowFreeInput && tags.length) {
      await this.#ensureTagsInHistory(tags);
    }
  }
  async #clearHistory() {
    if (this.#isDisabled()) {
      return;
    }

    await this.setHistory([]);
    if (this.#isTagsMode()) {
      await this.#updateValue("", { validate: false });
    }
  }
  #createNodeId(value: string, index: number) {
    const prefix = this.rootElement?.id || "multiinput";
    const randomness = Math.random().toString(36).slice(2, 8);
    return `${prefix}-${index}-${randomness}-${value.length}`;
  }
  #createNodesFromValues(values: string[]): LfDataNode[] {
    const existing =
      this.lfDataset?.nodes?.reduce(
        (map, node) => map.set(String(node?.value ?? ""), node),
        new Map<string, LfDataNode>(),
      ) || new Map<string, LfDataNode>();

    return values.map((value, index) => {
      const candidate = existing.get(value);
      return {
        ...candidate,
        id: candidate?.id || this.#createNodeId(value, index),
        value,
      };
    });
  }
  async #ensureValueValidity() {
    if (!this.#isValueAllowed(this.value)) {
      await this.#updateValue(this.#lastValidValue || "", { validate: false });
    }
  }
  #filterAllowedTags(tags: string[]): string[] {
    const allowed = new Set(historyValues(this.historyNodes));
    return tags.filter((tag) => allowed.has(tag));
  }
  #currentTags(): string[] {
    return normalizeTags(parseTags(this.value));
  }
  async #ensureTagsInHistory(tags: string[]): Promise<void> {
    const current = historyValues(this.historyNodes);
    const currentSet = new Set(current);
    const newTags = (tags || []).filter((tag) => !currentSet.has(tag));

    if (!newTags.length) {
      return;
    }

    const union = normalizeHistoryValues(
      [...newTags, ...current],
      this.#maxHistory(),
    );
    await this.setHistory(union);
  }
  #initAdapter() {
    this.#adapter = createAdapter(
      {
        blocks: this.#b,
        compInstance: this,
        cyAttributes: this.#cy,
        historyNodes: () => this.historyNodes,
        historyValues: () => historyValues(this.historyNodes),
        isDisabled: () => this.#isDisabled(),
        lfAttributes: this.#lf,
        lfDataset: () => this.lfDataset,
        manager: this.#framework,
        parts: this.#p,
        value: () => this.value,
      },
      {
        history: async (nodes: LfDataNode[]) => {
          await this.#setHistoryNodes(nodes, { preserveColumns: true });
        },
        value: async (value: string) => {
          await this.#updateValue(value, {
            validate: false,
            syncTextfield: false,
          });
        },
      },
      () => this.#adapter,
    );
  }
  #isDisabled() {
    return this.lfUiState === "disabled";
  }
  #isTagsMode() {
    return this.lfMode === "tags";
  }
  #isValueAllowed(value: string) {
    if (this.#isTagsMode()) {
      return true;
    }
    if (this.lfAllowFreeInput) {
      return true;
    }
    if (!value) {
      return true;
    }
    return historyValues(this.historyNodes).includes(value);
  }
  #maxHistory() {
    const parsed =
      typeof this.lfMaxHistory === "number" && this.lfMaxHistory >= 0
        ? this.lfMaxHistory
        : 10;
    return parsed;
  }
  async #setHistoryNodes(
    nodes: LfDataNode[],
    options?: { preserveColumns?: boolean },
  ) {
    this.historyNodes = [...nodes];
    const columns = options?.preserveColumns ? this.lfDataset?.columns : null;
    this.#isSyncingDataset = true;
    this.lfDataset = {
      ...(columns ? { columns: [...columns] } : {}),
      nodes: [...nodes],
    };
    this.#isSyncingDataset = false;
    await this.#syncChipSelection();
  }
  async #syncTextfieldValue(value: string) {
    const textfield = this.#adapter?.elements.refs.textfield;
    if (textfield) {
      await textfield.setValue(value ?? "");
    }
  }
  async #syncChipSelection() {
    const chip = this.#adapter?.elements.refs.chips;
    if (!chip) {
      return;
    }

    if (this.#isTagsMode()) {
      const tags = this.#currentTags();
      const selectedIds = this.historyNodes
        .filter((n) => tags.includes(String(n?.value ?? "")))
        .map((node) => node.id);
      await chip.setSelectedNodes(selectedIds);
      return;
    }

    const selectedIds = this.historyNodes
      .filter((n) => String(n?.value ?? "") === this.value)
      .map((node) => node.id);
    if (selectedIds?.length) {
      await chip.setSelectedNodes(selectedIds);
    } else {
      await chip.setSelectedNodes([]);
    }
  }
  async #updateValue(
    rawValue: string,
    options: { validate?: boolean; syncTextfield?: boolean } = {},
  ): Promise<boolean> {
    const normalized = rawValue ?? "";

    if (options.validate && !this.#isValueAllowed(normalized)) {
      await this.#syncTextfieldValue(this.#lastValidValue);
      this.value = this.#lastValidValue;
      await this.#syncChipSelection();
      return false;
    }

    this.value = normalized;
    if (options.validate && this.#isValueAllowed(normalized)) {
      this.#lastValidValue = normalized;
    }
    if (options.syncTextfield !== false) {
      await this.#syncTextfieldValue(normalized);
    }
    await this.#syncChipSelection();
    return true;
  }
  //#endregion

  //#region Lifecycle hooks
  connectedCallback() {
    if (this.#framework) {
      this.#framework.theme.register(this);
    }
  }
  async componentWillLoad() {
    this.#framework = await awaitFramework(this);
    const initialNodes = normalizeHistoryNodes(
      this.lfDataset?.nodes || [],
      this.#maxHistory(),
      (value, index) => this.#createNodeId(value, index),
    );
    await this.#setHistoryNodes(initialNodes, { preserveColumns: true });
    await this.#updateValue(this.lfValue || "", { validate: true });
    this.#initAdapter();
  }
  componentWillRender() {
    const { info } = this.#framework.debug;

    info.update(this, "will-render");
  }
  componentDidRender() {
    const { info } = this.#framework.debug;

    info.update(this, "did-render");
  }
  async componentDidLoad() {
    const { debug } = this.#framework;

    this.onLfEvent(new CustomEvent("ready"), "ready");
    debug.info.update(this, "did-load");
    await this.#syncChipSelection();
  }
  render() {
    const { bemClass, setLfStyle } = this.#framework.theme;
    const { lfStyle } = this;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div
            class={bemClass(this.#b.multiinput._)}
            data-lf={this.#lf[this.lfUiState]}
            part={this.#p.multiinput}
          >
            {this.#adapter.elements.jsx.textfield()}
            <div
              class={bemClass(this.#b.multiinput._, this.#b.multiinput.history)}
              part={this.#p.history}
            >
              {this.#adapter.elements.jsx.chips()}
            </div>
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework.theme.unregister(this);
  }
  //#endregion
}
