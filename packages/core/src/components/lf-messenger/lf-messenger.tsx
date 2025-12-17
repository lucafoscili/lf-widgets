import {
  COVER_ICONS,
  IMAGE_TYPE_IDS,
  LF_ATTRIBUTES,
  LF_MESSENGER_BLOCKS,
  LF_MESSENGER_CLEAN_UI,
  LF_MESSENGER_PARTS,
  LF_MESSENGER_PROPS,
  LF_STYLE_ID,
  LF_THEME_ICONS,
  LF_WRAPPER_ID,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfIconType,
  LfMessengerAdapter,
  LfMessengerBaseChildNode,
  LfMessengerCharacterNode,
  LfMessengerChat,
  LfMessengerConfig,
  LfMessengerCovers,
  LfMessengerDataset,
  LfMessengerElement,
  LfMessengerEvent,
  LfMessengerEventPayload,
  LfMessengerFilters,
  LfMessengerHistory,
  LfMessengerImageTypes,
  LfMessengerInterface,
  LfMessengerPanels,
  LfMessengerPropsInterface,
  LfMessengerUI,
  LfMessengerUnionChildIds,
  OPTION_TYPE_IDS,
} from "@lf-widgets/foundations";
import {
  Component,
  Element,
  Event,
  EventEmitter,
  forceUpdate,
  Fragment,
  h,
  Host,
  Method,
  Prop,
  State,
  VNode,
} from "@stencil/core";
import { FIcon } from "../../utils/icon";
import { awaitFramework } from "../../utils/setup";
import { prepMessengerActions } from "./actions.messenger";
import { prepMessengerComputed } from "./computed.messenger";
import {
  assignPropsToChatCell,
  extractPropsFromChatCell,
  hasNodes,
} from "./helpers.utils";
import { createAdapter, LfMessengerAdapterState } from "./lf-messenger-adapter";

/**
 * Represents a messenger component that displays a chat interface with characters and messages.
 * The messenger component allows users to interact with characters, view messages, and customize the chat.
 * The component supports various customization options, including character selection, message history, and styling.
 *
 * @component
 * @tag lf-messenger
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying a chat interface with characters and messages.
 *
 * @example
 * <lf-messenger
 * lfDataset={dataset}
 * lfValue={config}
 * ></lf-messenger>
 *
 * @fires {CustomEvent} lf-messenger-event - Emitted for various component events
 */
@Component({
  tag: "lf-messenger",
  styleUrl: "lf-messenger.scss",
  shadow: true,
})
export class LfMessenger implements LfMessengerInterface {
  /**
   * References the root HTML element of the component (<lf-messenger>).
   */
  @Element() rootElement: LfMessengerElement;

  //#region States
  /**
   * Debug information for component lifecycle.
   */
  @State() debugInfo: LfDebugLifecycleInfo;
  /**
   * Render trigger for adapter state changes.
   * Incremented by onStateChange callback to trigger re-renders.
   */
  @State() private _renderTick = 0;
  //#endregion

  //#region Bridge getters/setters for public API compatibility
  /**
   * Gets the chat state from the adapter - returns the full chat map keyed by character ID.
   */
  get chat(): LfMessengerChat {
    return this.#state?.chat || {};
  }
  /**
   * Sets the chat state through the adapter (for test compatibility).
   */
  set chat(value: LfMessengerChat) {
    if (this.#state) {
      this.#state.chat = value;
      this.#onStateChange();
    }
  }
  /**
   * Gets the connection status from the adapter.
   */
  get connectionStatus() {
    return this.#adapter?.controller.get.status.connection() || "offline";
  }
  /**
   * Sets the connection status through the adapter (for test compatibility).
   */
  set connectionStatus(value) {
    if (this.#adapter) {
      this.#adapter.controller.set.status.connection(value);
    }
  }
  /**
   * Gets the covers state from the adapter.
   */
  get covers(): LfMessengerCovers {
    return this.#state?.covers || {};
  }
  /**
   * Sets the covers state through the adapter (for test compatibility).
   */
  set covers(value: LfMessengerCovers) {
    if (this.#state) {
      this.#state.covers = value;
      this.#onStateChange();
    }
  }
  /**
   * Gets the current character from the adapter.
   */
  get currentCharacter(): LfMessengerCharacterNode {
    return this.#adapter?.controller.get.character.current();
  }
  /**
   * Sets the current character through the adapter (for test compatibility).
   */
  set currentCharacter(value: LfMessengerCharacterNode) {
    if (this.#adapter) {
      this.#adapter.controller.set.character.current(value);
    }
  }
  /**
   * Gets the form status map from the adapter.
   */
  get formStatusMap() {
    return this.#adapter?.controller.get.status.formStatus();
  }
  /**
   * Sets the form status map through the adapter (for test compatibility).
   */
  set formStatusMap(value) {
    if (this.#state) {
      this.#state.formStatusMap = value;
      this.#onStateChange();
    }
  }
  /**
   * Gets the history state from the adapter.
   */
  get history(): LfMessengerHistory {
    return this.#adapter?.controller.get.history() || {};
  }
  /**
   * Sets the history state through the adapter (for test compatibility).
   */
  set history(value: LfMessengerHistory) {
    if (this.#state) {
      this.#state.history = value;
      this.#onStateChange();
    }
  }
  /**
   * Gets the hovered customization option from the adapter.
   */
  get hoveredCustomizationOption() {
    return this.#adapter?.controller.get.status.hoveredCustomizationOption();
  }
  /**
   * Sets the hovered customization option through the adapter (for test compatibility).
   */
  set hoveredCustomizationOption(value) {
    if (this.#adapter) {
      this.#adapter.controller.set.status.hoveredCustomizationOption(value);
    }
  }
  /**
   * Gets the save in progress status from the adapter.
   */
  get saveInProgress(): boolean {
    return this.#adapter?.controller.get.status.save.inProgress() || false;
  }
  /**
   * Sets the save in progress status through the adapter (for test compatibility).
   */
  set saveInProgress(value: boolean) {
    if (this.#adapter) {
      this.#adapter.controller.set.status.save.inProgress(value);
    }
  }
  /**
   * Gets the UI state from the adapter.
   */
  get ui(): LfMessengerUI {
    return this.#adapter?.controller.get.ui() || LF_MESSENGER_CLEAN_UI();
  }
  /**
   * Sets the UI state through the adapter (for test compatibility).
   */
  set ui(value: LfMessengerUI) {
    if (this.#state) {
      this.#state.ui = value;
      this.#onStateChange();
    }
  }
  //#endregion

  //#region Props
  /**
   * Automatically saves the dataset when a chat updates.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-messenger lfAutosave={true}></lf-messenger>
   * ```
   */
  @Prop({ mutable: true }) lfAutosave: boolean = true;
  /**
   * The data set for the LF List component.
   * This property is mutable, meaning it can be changed after the component is initialized.
   *
   * @type {LfMessengerDataset}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-messenger lfDataset={dataset}></lf-messenger>
   * ```
   */
  @Prop({ mutable: true }) lfDataset: LfMessengerDataset = null;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-messenger lfStyle="#lf-component { color: red; }"></lf-messenger>
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * Sets the initial configuration, including active character and filters.
   *
   * @type {LfMessengerConfig}
   * @default null
   *
   * @example
   * ```tsx
   * <lf-messenger lfValue={config}></lf-messenger>
   * ```
   */
  @Prop({ mutable: false }) lfValue: LfMessengerConfig = null;
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_MESSENGER_BLOCKS;
  #lf = LF_ATTRIBUTES;
  #p = LF_MESSENGER_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #adapter: LfMessengerAdapter;
  #state: LfMessengerAdapterState;
  /**
   * Callback to trigger re-render when adapter state changes.
   */
  #onStateChange = () => {
    this._renderTick++;
  };
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-messenger-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfMessengerEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfMessengerEvent) {
    const { rootElement } = this;

    const config: LfMessengerConfig = {
      currentCharacter: this.currentCharacter?.id,
      ui: this.ui,
    };
    this.lfEvent.emit({
      comp: this,
      id: rootElement.id,
      originalEvent: e,
      eventType,
      config,
    });
  }
  //#endregion

  //#region Public methods
  /**
   * Removes a specific child node from the messenger's image structure.
   * @param node - The child node to be removed from the messenger tree
   * @param type - The type of image messenger structure to modify
   * @returns A Promise that resolves when the deletion is complete
   */
  @Method()
  async deleteOption(
    node: LfMessengerBaseChildNode<LfMessengerUnionChildIds>,
    type: LfMessengerImageTypes,
  ): Promise<void> {
    const { root } = this.#adapter.controller.get.image;

    const rootNode = root(type);
    const idx = rootNode.children.indexOf(node);
    if (idx > -1) {
      rootNode.children.splice(idx, 1);
      this.refresh();
    }
  }
  /**
   * Fetches debug information of the component's current state.
   * @returns {Promise<LfDebugLifecycleInfo>} A promise that resolves with the debug information object.
   */
  @Method()
  async getDebugInfo(): Promise<LfDebugLifecycleInfo> {
    return this.debugInfo;
  }
  /**
   * Used to retrieve component's properties and descriptions.
   * @returns {Promise<LfMessengerPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfMessengerPropsInterface> {
    const entries = LF_MESSENGER_PROPS.map(
      (
        prop,
      ): [
        keyof LfMessengerPropsInterface,
        LfMessengerPropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }
  /**
   * This method is used to trigger a new render of the component.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }
  /**
   * Resets the messenger component to its initial state.
   * Clears covers, current character, and message history.
   * Reinitializes the component.
   * @returns A promise that resolves when the reset is complete
   */
  @Method()
  async reset(): Promise<void> {
    // Reset state through adapter
    if (this.#state) {
      this.#state.covers = {};
      this.#state.currentCharacter = null;
      this.#state.history = {};
    }

    this.#initialize();
  }
  /**
   * Asynchronously saves the current messenger state.
   * @returns A Promise that resolves when the save operation is complete.
   */
  @Method()
  async save(): Promise<void> {
    this.#save();
  }
  /**
   * Initiates the unmount sequence, which removes the component from the DOM after a delay.
   * @param {number} ms - Number of milliseconds
   */
  @Method()
  async unmount(ms: number = 0): Promise<void> {
    setTimeout(() => {
      this.onLfEvent(new CustomEvent("unmount"), "unmount");
      this.rootElement.remove();
    }, ms);
  }
  //#endregion

  //#region Private methods
  #initialize = () => {
    const { lfDataset, lfValue } = this;

    if (hasNodes(this.#adapter)) {
      for (let index = 0; index < lfDataset.nodes.length; index++) {
        const character = lfDataset.nodes[index];
        this.#initCharacter(character);
      }
    }

    if (lfValue) {
      this.#initConfig();
    }
  };
  #initAdapter = () => {
    // Create adapter with closure state
    this.#adapter = createAdapter(
      () => this,
      () => this.#framework,
      this.#onStateChange,
    );

    // Store reference to state for direct access in reset/init
    this.#state = (this.#adapter.controller.get as any).__state;

    // Add computed and actions
    this.#adapter.controller.computed = prepMessengerComputed(
      () => this.#adapter,
    );
    this.#adapter.controller.actions = prepMessengerActions(
      () => this.#adapter,
    );

    // Add dispatcher for centralized event emission (v4.0.0)
    this.#adapter.dispatcher = {
      emit: (eventType, detail) => {
        this.#framework?.debug?.logs.new(
          this,
          `Event: ${eventType}`,
          "informational",
        );

        const config: LfMessengerConfig = {
          currentCharacter: this.currentCharacter?.id,
          ui: this.ui,
        };

        this.lfEvent.emit({
          comp: this,
          eventType,
          id: this.rootElement.id,
          originalEvent: detail?.originalEvent,
          config,
        });
      },
    };
  };
  #initCharacter = (character: LfMessengerCharacterNode) => {
    const { get, set } = this.#adapter.controller;

    const covers: LfMessengerCovers = {
      [character.id]: IMAGE_TYPE_IDS.reduce(
        (acc, type) => {
          acc[type] =
            Number(get.image.root(type, character).value).valueOf() || 0;
          return acc;
        },
        {} as LfMessengerCovers[typeof character.id],
      ),
    };

    const chat = character.children?.find((n) => n.id === "chat");

    // Initialize chat state for this character
    set.character.chat({}, character);

    const chatCell = chat?.cells?.lfChat;
    const charChat = get.character.chat(character) || {};
    if (chatCell) {
      extractPropsFromChatCell(chatCell, charChat);
      set.character.chat(charChat, character);
    }

    const history = chatCell?.lfValue || chatCell?.value || [];
    set.character.history(JSON.stringify(history), character);

    // Merge covers into state
    const currentCovers = this.#adapter.controller.get.status.formStatus()
      ? this.covers
      : {};
    Object.assign(currentCovers, covers);
    if (this.#state) {
      this.#state.covers = { ...this.#state.covers, ...covers };
    }
  };
  #initConfig = () => {
    const { byId } = this.#adapter.controller.get.character;
    const { set } = this.#adapter.controller;
    const { lfValue } = this;

    const currentCharacter = lfValue.currentCharacter;
    const filters = lfValue.ui?.filters || LF_MESSENGER_CLEAN_UI().filters;
    const panels = lfValue.ui?.panels || LF_MESSENGER_CLEAN_UI().panels;

    if (currentCharacter) {
      set.character.current(byId(currentCharacter));
    }

    // Update filters through adapter
    const currentUi = this.#adapter.controller.get.ui();
    const newFilters = { ...currentUi.filters };
    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        const k = key as keyof LfMessengerFilters;
        newFilters[k] = filters[k];
      }
    }
    set.ui.filters(newFilters);

    // Update panels through state
    if (this.#state) {
      const newPanels = { ...this.#state.ui.panels };
      for (const key in panels) {
        if (Object.prototype.hasOwnProperty.call(panels, key)) {
          const k = key as keyof LfMessengerPanels;
          newPanels[k] = panels[k];
        }
      }
      this.#state.ui = { ...this.#state.ui, panels: newPanels };
    }
  };
  #save = async () => {
    const { get, set } = this.#adapter.controller;
    const { save } = this.#adapter.elements.refs.character;
    const { lfDataset } = this;
    const covers = this.covers;
    const history = this.history;

    requestAnimationFrame(() => set.status.save.inProgress(true));

    for (let index = 0; index < lfDataset.nodes.length; index++) {
      const character = lfDataset.nodes[index];
      const id = character.id;
      const chatNode = character.children.find((n) => n.id === "chat");

      const { chat } = get.character;

      const saveChat = () => {
        if (history[id] && chatNode) {
          const historyJson = JSON.parse(history[id]);
          try {
            chatNode.cells.lfChat.value = historyJson;
          } catch (error) {
            chatNode.cells = {
              lfChat: {
                shape: "chat",
                value: historyJson,
              },
            };
          }

          const chatCell = chatNode.cells.lfChat;
          assignPropsToChatCell(chatCell, chat(character));
        }
      };

      const saveCovers = () => {
        IMAGE_TYPE_IDS.forEach((type) => {
          const root = this.#adapter.controller.get.image.root(type, character);

          if (covers[id] && root) {
            root.value = covers[id][type];
          }
        });
      };

      saveChat();
      saveCovers();
    }
    this.onLfEvent(new CustomEvent("save"), "save");

    requestAnimationFrame(async () => {
      setTimeout(
        () =>
          requestAnimationFrame(async () => {
            const { "--lf-icon-success": icon } =
              this.#framework.theme.get.current().variables;

            set.status.save.inProgress(false);

            // Temporarily show "Saved!" message on button
            if (save) {
              const originalLabel = save.textContent;
              const originalIcon = save.dataset.icon;
              save.textContent = "Saved!";
              save.dataset.icon = icon;
              setTimeout(() => {
                save.textContent = originalLabel;
                save.dataset.icon = originalIcon || "";
              }, 1000);
            }
          }),
        800,
      );
    });
  };
  #prepCharacter = (): VNode => {
    const { bemClass } = this.#framework.theme;

    const { character } = this.#b.messenger;
    const { controller, elements } = this.#adapter;
    const { name } = controller.get.character;
    const { avatar, biography, save, statusIcon } = elements.jsx.character;
    const { isLeftCollapsed } = this.ui.panels;

    return (
      <div
        class={bemClass(character._, null, {
          collapsed: isLeftCollapsed,
        })}
      >
        <div class={bemClass(character._, character.avatar)}>
          {avatar()}
          <div class={bemClass(character._, character.nameWrapper)}>
            <div class={bemClass(character._, character.name)}>
              {statusIcon()}
              <div class={bemClass(character._, character.label)}>{name()}</div>
            </div>
            {save()}
          </div>
        </div>
        <div class={bemClass(character._, character.biography)}>
          {biography()}
        </div>
      </div>
    );
  };
  #prepChat = (): VNode => {
    const { bemClass } = this.#framework.theme;

    const { chat: c } = this.#b.messenger;
    const { chat, leftExpander, rightExpander, tabbar } =
      this.#adapter.elements.jsx.chat;

    return (
      <div class={bemClass(c._)}>
        <div
          class={bemClass(c._, c.expander, {
            left: true,
          })}
        >
          {leftExpander()}
        </div>
        <div class={bemClass(c._, c.navigation)}>{tabbar()}</div>
        <div class={bemClass(c._, c.chat)}>{chat()}</div>
        <div
          class={bemClass(c._, c.expander, {
            right: true,
          })}
        >
          {rightExpander()}
        </div>
      </div>
    );
  };
  #prepCovers = (type: LfMessengerImageTypes, images: VNode[]): VNode => {
    const { bemClass } = this.#framework.theme;

    const { covers } = this.#b.messenger;
    const { add } = this.#adapter.elements.jsx.customization.form[type];

    return (
      <Fragment>
        <div class={bemClass(covers._)}>
          <div class={bemClass(covers._, covers.title)}>
            <div class={bemClass(covers._, covers.label)}>{type}</div>
            {add()}
          </div>
          <div class={bemClass(covers._, covers.images)}>{images}</div>
        </div>
      </Fragment>
    );
  };
  #prepExtraContext = (): VNode => {
    const { bemClass } = this.#framework.theme;

    const { extraContext } = this.#b.messenger;
    const { customization, options } = this.#adapter.elements.jsx;
    const { back, customize } = options;
    const { filters } = customization;
    const { customizationView } = this.ui;
    const { isRightCollapsed } = this.ui.panels;

    return (
      <div
        class={bemClass(extraContext._, null, {
          collapsed: isRightCollapsed,
          input: customizationView,
        })}
      >
        {customizationView ? (
          <Fragment>
            {filters()}
            <div class={bemClass(extraContext._, extraContext.list)}>
              {this.#prepList()}
            </div>
            {back()}
          </Fragment>
        ) : (
          <Fragment>
            <div class={bemClass(extraContext._, extraContext.options)}>
              {this.#prepOptions()}
            </div>
            {customize()}
          </Fragment>
        )}
      </div>
    );
  };
  #prepForm = (type: LfMessengerImageTypes): VNode => {
    const { bemClass } = this.#framework.theme;

    const { form } = this.#b.messenger;
    const { cancel, confirm, description, id, imageUrl, title } =
      this.#adapter.elements.jsx.customization.form[type];

    const nodeId = this.formStatusMap[type];
    const rootChildren = this.#adapter.controller.get.image.byType(type);
    const node = rootChildren.find((n) => n.id === nodeId);

    return (
      <div class={bemClass(form._)}>
        <div class={bemClass(form._, form.label)}>Create {type}</div>
        {id(nodeId)}
        {title(node)}
        {description(node)}
        {imageUrl(node)}
        <div class={bemClass(form._, form.confirm)}>
          {cancel()}
          {confirm()}
        </div>
      </div>
    );
  };
  #prepList = (): VNode => {
    const { bemClass } = this.#framework.theme;

    const { list } = this.#b.messenger;
    const { controller, elements, handlers } = this.#adapter;
    const { byType, coverIndex, title } = controller.get.image;
    const { edit, remove } = elements.jsx.customization.list;
    const { image } = handlers.customization;
    const formStatusMap = this.formStatusMap;
    const hoveredCustomizationOption = this.hoveredCustomizationOption;
    const ui = this.ui;
    const { filters } = ui;

    return (
      <Fragment>
        {IMAGE_TYPE_IDS.map((type) => {
          if (filters[type]) {
            const isFormActive = formStatusMap[type];
            const activeIndex = coverIndex(type);
            const images: VNode[] = byType(type).map((node, j) => (
              <div
                class={bemClass(list._, null, {
                  selected: activeIndex === j,
                })}
                onClick={(e) => image(e, node, j)}
                onPointerEnter={() => {
                  if (activeIndex !== j) {
                    controller.set.status.hoveredCustomizationOption(node);
                  }
                }}
                onPointerLeave={() =>
                  controller.set.status.hoveredCustomizationOption(null)
                }
              >
                <img
                  alt={title(node)}
                  class={bemClass(list._, list.image)}
                  data-lf={this.#lf.fadeIn}
                  src={node?.cells?.lfImage?.value}
                  title={title(node)}
                />
                {hoveredCustomizationOption === node && (
                  <div
                    class={bemClass(list._, list.actions)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {edit(type, node)}
                    {remove(type, node)}
                  </div>
                )}
              </div>
            ));
            return (
              <Fragment>
                {isFormActive
                  ? this.#prepForm(type)
                  : this.#prepCovers(type, images)}
              </Fragment>
            );
          }
          return null;
        })}
      </Fragment>
    );
  };
  #prepOptions = (): VNode[] => {
    const { bemClass } = this.#framework.theme;

    return OPTION_TYPE_IDS.map((opt) => {
      const { options } = this.#b.messenger;
      const { image } = this.#adapter.controller.get;
      const { asCover } = image;
      const ui = this.ui;

      const { value, node, title } = asCover(opt);
      const isEnabled = ui.options[opt];
      const option = opt.slice(0, -1);
      const fallback = value as (typeof COVER_ICONS)[number];

      const icon = !node
        ? fallback
        : this.#framework.theme.get.icon(
            isEnabled ? "hexagonMinus2" : "offHexagon",
          );

      return (
        <div class={bemClass(options._, options.wrapper)}>
          {node ? (
            <Fragment>
              <img
                alt={title}
                class={bemClass(options._, options.cover)}
                data-lf={this.#lf.fadeIn}
                src={value}
              ></img>
              <div
                class={bemClass(options._, options.blocker, {
                  active: !isEnabled,
                })}
                onClick={() => {
                  this.#adapter.controller.set.ui.options(!isEnabled, opt);
                }}
              >
                <FIcon
                  framework={this.#framework}
                  icon={icon as LfIconType}
                  wrapperClass={bemClass(options._, options.blockerIcon)}
                />
                <div class={bemClass(options._, options.blockerLabel)}>
                  {isEnabled ? "Click to disable" : "Click to enable"}
                </div>
              </div>
            </Fragment>
          ) : (
            <div
              class={bemClass(options._, options.placeholder)}
              title={`No ${option} selected.`}
            >
              <FIcon
                framework={this.#framework}
                icon={icon as LfIconType}
                wrapperClass={bemClass(options._, options.placeholderIcon)}
              />
            </div>
          )}
          <div class={bemClass(options._, options.name)}>
            <div
              class={bemClass(options._, options.label)}
              title={`Active ${option}.`}
            >
              {option}
            </div>
            {title && (
              <FIcon
                framework={this.#framework}
                icon={LF_THEME_ICONS.info}
                wrapperClass={bemClass(options._, options.info)}
                style={{ cursor: "help" }}
              />
            )}
          </div>
        </div>
      );
    });
  };
  #prepRoster = () => {
    const { bemClass } = this.#framework.theme;

    const { roster_sub: roster } = this.#b.messenger;
    const { get, set } = this.#adapter.controller;

    const avatars: VNode[] = [];

    const characters = get.character.list();
    characters.forEach((c) => {
      const image = get.image.asCover("avatars", c);
      avatars.push(
        <div
          class={bemClass(roster._, roster.portrait)}
          onClick={() => {
            set.character.current(c);
          }}
        >
          <img
            class={bemClass(roster._, roster.image)}
            src={image.value}
            title={image.title || ""}
          />
          <div class={bemClass(roster._, roster.name)}>
            <div class={bemClass(roster._, roster.label)}>
              {get.character.name(c)}
            </div>
          </div>
        </div>,
      );
    });

    return avatars?.length ? (
      avatars
    ) : (
      <div class={bemClass(roster._, roster.emptyData)}>
        There are no characters in your roster!
      </div>
    );
  };
  //#endregion

  //#region Lifecycle hooks
  connectedCallback() {
    if (this.#framework) {
      this.#framework.theme.register(this);
    }
  }
  async componentWillLoad() {
    this.#framework = await awaitFramework(this);
    this.#initAdapter();
    this.#initialize();
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    this.onLfEvent(new CustomEvent("ready"), "ready");
    info.update(this, "did-load");
  }
  componentWillRender() {
    const { info } = this.#framework.debug;

    info.update(this, "will-render");
  }
  componentDidRender() {
    const { info } = this.#framework.debug;

    info.update(this, "did-render");
  }
  render() {
    const { bemClass, setLfStyle } = this.#framework.theme;

    if (!hasNodes(this.#adapter)) {
      return;
    }

    const { messenger } = this.#b;
    const { lfStyle } = this;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          {this.currentCharacter ? (
            <div
              class={bemClass(messenger._)}
              part={this.#p.messenger.messenger}
            >
              {this.#prepCharacter()}
              {this.#prepChat()}
              {this.#prepExtraContext()}
            </div>
          ) : (
            <div
              class={bemClass(messenger._, messenger.roster)}
              part={this.#p.messenger.roster}
            >
              {this.#prepRoster()}
            </div>
          )}
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}
