import {
  COVER_ICONS,
  CY_ATTRIBUTES,
  IMAGE_TYPE_IDS,
  LF_ATTRIBUTES,
  LF_MESSENGER_BLOCKS,
  LF_MESSENGER_CLEAN_UI,
  LF_MESSENGER_PARTS,
  LF_MESSENGER_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfChatStatus,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfMessengerAdapter,
  LfMessengerBaseChildNode,
  LfMessengerCharacterNode,
  LfMessengerChat,
  LfMessengerChildIds,
  LfMessengerConfig,
  LfMessengerCovers,
  LfMessengerDataset,
  LfMessengerEditingStatus,
  LfMessengerElement,
  LfMessengerEvent,
  LfMessengerEventPayload,
  LfMessengerFilters,
  LfMessengerHistory,
  LfMessengerImageTypes,
  LfMessengerInterface,
  LfMessengerPanels,
  LfMessengerPropsInterface,
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
import { awaitFramework } from "../../utils/setup";
import {
  assignPropsToChatCell,
  extractPropsFromChatCell,
  hasNodes,
} from "./helpers.utils";
import { createAdapter } from "./lf-messenger-adapter";

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
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() chat: LfMessengerChat = {};
  @State() connectionStatus: LfChatStatus = "offline";
  @State() covers: LfMessengerCovers = {};
  @State() currentCharacter: LfMessengerCharacterNode;
  @State()
  formStatusMap: LfMessengerEditingStatus<LfMessengerImageTypes> =
    IMAGE_TYPE_IDS.reduce((acc, type) => {
      acc[type] = null;
      return acc;
    }, {} as LfMessengerEditingStatus<LfMessengerImageTypes>);
  @State() history: LfMessengerHistory = {};
  @State()
  hoveredCustomizationOption: LfMessengerBaseChildNode<
    LfMessengerChildIds<LfMessengerUnionChildIds>
  >;
  @State() saveInProgress = false;
  @State() ui = LF_MESSENGER_CLEAN_UI();
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
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_MESSENGER_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #adapter: LfMessengerAdapter;
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
    const { currentCharacter, rootElement, ui } = this;

    const config: LfMessengerConfig = {
      currentCharacter: currentCharacter?.id,
      ui,
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
    this.covers = {};
    this.currentCharacter = null;
    this.history = {};

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
    this.#adapter = createAdapter(
      {
        blocks: this.#b,
        compInstance: this,
        cyAttributes: this.#cy,
        lfAttributes: this.#lf,
        manager: this.#framework,
        parts: this.#p,
      },
      () => this.#adapter,
    );
  };
  #initCharacter = (character: LfMessengerCharacterNode) => {
    const { get } = this.#adapter.controller;

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
    this.chat[character.id] = {};

    const chatCell = chat?.cells?.lfChat;
    if (chatCell) {
      extractPropsFromChatCell(chatCell, this.chat[character.id]);
    }

    const history = chatCell?.lfValue || chatCell?.value || [];
    this.history[character.id] = JSON.stringify(history);
    Object.assign(this.covers, covers);
  };
  #initConfig = () => {
    const { byId } = this.#adapter.controller.get.character;
    const { lfValue } = this;

    const currentCharacter = lfValue.currentCharacter;
    const filters = lfValue.ui?.filters || LF_MESSENGER_CLEAN_UI().filters;
    const panels = lfValue.ui?.panels || LF_MESSENGER_CLEAN_UI().panels;

    if (currentCharacter) {
      this.currentCharacter = byId(currentCharacter);
    }

    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        const k = key as keyof LfMessengerFilters;
        const filter = filters[k];
        this.ui.filters[k] = filter;
      }
    }
    for (const key in panels) {
      if (Object.prototype.hasOwnProperty.call(panels, key)) {
        const k = key as keyof LfMessengerPanels;
        const panel = panels[k];
        this.ui.panels[k] = panel;
      }
    }
  };
  #save = async () => {
    const { get, set } = this.#adapter.controller;
    const { save } = this.#adapter.elements.refs.character;
    const { covers, history, lfDataset } = this;

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
          const root = this.#adapter.controller.get.image.root(type);

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
            save.setMessage("Saved!", icon);
          }),
        800,
      );
    });
  };
  #prepCharacter = (): VNode => {
    const { bemClass } = this.#framework.theme;

    const { character } = this.#b;
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

    const { chat: c } = this.#b;
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

    const { covers } = this.#b;
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

    const { extraContext } = this.#b;
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

    const { form } = this.#b;
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

    const { list } = this.#b;
    const { controller, elements, handlers } = this.#adapter;
    const { byType, coverIndex, title } = controller.get.image;
    const { edit, remove } = elements.jsx.customization.list;
    const { image } = handlers.customization;
    const { formStatusMap, hoveredCustomizationOption, ui } = this;
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
                    this.hoveredCustomizationOption = node;
                  }
                }}
                onPointerLeave={() => (this.hoveredCustomizationOption = null)}
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
      const { options } = this.#b;
      const { image } = this.#adapter.controller.get;
      const { asCover } = image;
      const { ui } = this;

      const { value, node, title } = asCover(opt);
      const isEnabled = ui.options[opt];
      const option = opt.slice(0, -1);
      const fallback = value as (typeof COVER_ICONS)[number];

      const icon = !node
        ? fallback
        : this.#framework.theme.get.icon(
            isEnabled ? "hexagonMinus2" : "offHexagon",
          );
      const { style } = this.#framework.assets.get(`./assets/svg/${icon}.svg`);

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
                  ui.options[opt] = !isEnabled;
                  this.refresh();
                }}
              >
                <div
                  class={bemClass(options._, options.blockerIcon)}
                  style={style}
                ></div>
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
              <div
                class={bemClass(options._, options.placeholderIcon)}
                style={style}
              ></div>
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
              <div
                class={bemClass(options._, options.info)}
                title={title}
              ></div>
            )}
          </div>
        </div>
      );
    });
  };
  #prepRoster = () => {
    const { bemClass } = this.#framework.theme;

    const { roster } = this.#b;
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

    const { messenger, roster } = this.#b;
    const { lfStyle } = this;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          {this.currentCharacter ? (
            <div class={bemClass(messenger._)} part={this.#p.messenger}>
              {this.#prepCharacter()}
              {this.#prepChat()}
              {this.#prepExtraContext()}
            </div>
          ) : (
            <div class={bemClass(roster._)} part={this.#p.roster}>
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
