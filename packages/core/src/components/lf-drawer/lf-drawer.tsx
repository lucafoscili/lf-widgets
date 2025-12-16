import {
  LF_DRAWER_BLOCKS,
  LF_DRAWER_IDS,
  LF_DRAWER_PARTS,
  LF_DRAWER_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfDebugLifecycleInfo,
  LfDrawerAdapter,
  LfDrawerDisplay,
  LfDrawerElement,
  LfDrawerEvent,
  LfDrawerEventPayload,
  LfDrawerInterface,
  LfDrawerPosition,
  LfDrawerPropsInterface,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import {
  Component,
  Element,
  Event,
  EventEmitter,
  forceUpdate,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
  Watch,
} from "@stencil/core";
import { createBaseGetters } from "../../utils/adapter";
import { awaitFramework } from "../../utils/setup";
import { prepDrawerActions } from "./actions.drawer";
import { prepDrawerComputed } from "./computed.drawer";
import { DrawerFC } from "./fc";
import { createAdapter } from "./lf-drawer-adapter";

/**
 * Represents a drawer-style component that displays content on the screen,
 * allowing users to open or close the drawer. Implements various methods for
 * managing state, retrieving component properties, handling user interactions,
 * and unmounting the component. Responsive behavior may be enabled via a property.
 *
 * @component
 * @tag lf-drawer
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element with a sliding or docked drawer. The drawer may be
 * responsive to screen width, switching between sliding and docked display modes.
 *
 * @example
 * <lf-drawer
 * lfDisplay="slide"
 * lfPosition="left"
 * lfResponsive={768}
 * ></lf-drawer>
 *
 * @fires {CustomEvent} lf-drawer-event - Emitted for various component events
 */
@Component({
  tag: "lf-drawer",
  styleUrl: "lf-drawer.scss",
  shadow: true,
})
export class LfDrawer implements LfDrawerInterface {
  /**
   * References the root HTML element of the component (<lf-drawer>).
   */
  @Element() rootElement: LfDrawerElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  //#endregion

  //#region Props
  /**
   * The display mode of the drawer.
   *
   * @type {LfDrawerDisplay}
   * @default "sliding"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-drawer lfDisplay="dock">
   *  <div>Drawer content</div>
   * </lf-drawer>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfDisplay: LfDrawerDisplay = "slide";
  /**
   * The position of the drawer on the screen.
   *
   * @type {LfDrawerPosition}
   * @default "left"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-drawer lfPosition="right">
   *  <div>Drawer content</div>
   * </lf-drawer>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfPosition: LfDrawerPosition = "left";
  /**
   * A number representing a screen-width breakpoint for responsiveness.
   * If set to 0 (or negative), no responsiveness is applied, and `lfDisplay` remains what you set.
   * If > 0, the drawer will switch to `"dock"` if `window.innerWidth >= lfResponsive`,
   * otherwise `"slide"`.
   *
   * @type {number}
   * @default 0
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-drawer lfResponsive={768}>
   *  <div>Drawer content</div>
   * </lf-drawer>
   * ```
   */
  @Prop({ mutable: true }) lfResponsive: number = 0;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-drawer lfStyle="#lf-component { color: red; }">
   *  <div>Drawer content</div>
   * </lf-drawer>
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * Indicates if the drawer is open.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-drawer lfValue={true}>
   *  <div>Drawer content</div>
   * </lf-drawer>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfValue: boolean = false;
  //#endregion

  //#region Internal variables
  #adapter: LfDrawerAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_DRAWER_BLOCKS;
  #i = LF_DRAWER_IDS;
  #p = LF_DRAWER_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #previouslyFocusedElement: HTMLElement | null = null;
  #resizeHandler: () => Promise<void>;
  #resizeTimer: number;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-drawer-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfDrawerEventPayload>;
  //#endregion

  //#region Listeners
  @Listen("keydown")
  listenKeydown(e: KeyboardEvent) {
    if (this.#adapter) {
      this.#adapter.handlers.keyboard(e);
    }
  }
  //#endregion

  //#region Watchers
  @Watch("lfDisplay")
  onLfDisplayChange(newVal: LfDrawerDisplay, oldVal: LfDrawerDisplay) {
    if (!this.#framework || !this.#adapter) {
      return;
    }

    this.#adapter.controller.actions.handleBackdropChange(oldVal, newVal);
  }
  @Watch("lfResponsive")
  onLfResponsiveChange() {
    if (!this.#framework || !this.#adapter) {
      return;
    }

    if (this.lfResponsive > 0) {
      this.#adapter.controller.actions.applyResponsiveMode();
      if (!this.#resizeHandler) {
        this.#resizeHandler = async () => {
          if (this.#resizeTimer) {
            clearTimeout(this.#resizeTimer);
          }
          this.#resizeTimer = window.setTimeout(() => {
            this.#adapter.controller.actions.applyResponsiveMode();
            this.#resizeTimer = null;
          }, 200);
        };
        window.addEventListener("resize", this.#resizeHandler);
      }
    } else {
      if (this.#resizeHandler) {
        window.removeEventListener("resize", this.#resizeHandler);
        this.#resizeHandler = null;
      }
    }
  }
  //#endregion

  //#region Public methods
  /**
   * Closes the drawer component.
   * Uses requestAnimationFrame to ensure smooth animation and state update.
   * Dispatches a 'close' custom event when the drawer is closed.
   * @returns Promise that resolves when the drawer closing animation is scheduled
   */
  @Method()
  async close(): Promise<void> {
    this.#adapter.controller.actions.close();
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
   * @returns {Promise<LfDrawerPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfDrawerPropsInterface> {
    const entries = LF_DRAWER_PROPS.map(
      (
        prop,
      ): [
        keyof LfDrawerPropsInterface,
        LfDrawerPropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Returns the current open state of the drawer.
   * @returns A promise that resolves to a boolean indicating if the drawer is open (true) or closed (false)
   */
  @Method()
  async isOpened(): Promise<boolean> {
    return this.#adapter.controller.computed.isOpen();
  }
  /**
   * Opens the drawer.
   */
  @Method()
  async open(): Promise<void> {
    this.#adapter.controller.actions.open();
  }
  /**
   * This method is used to trigger a new render of the component.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }
  /**
   * Toggles the drawer state between opened and closed.
   * If the drawer is currently opened, it will be closed.
   * If the drawer is currently closed, it will be opened.
   * @returns A promise that resolves when the toggle operation is complete
   */
  @Method()
  async toggle(): Promise<void> {
    this.#adapter.controller.actions.toggle();
  }
  /**
   * Initiates the unmount sequence, which removes the component from the DOM after a delay.
   * @param {number} ms - Number of milliseconds
   */
  @Method()
  async unmount(ms: number = 0): Promise<void> {
    setTimeout(() => {
      this.#framework.effects.backdrop.hide();
      this.#adapter.dispatcher.emit("unmount");
      this.rootElement.remove();
    }, ms);
  }
  //#endregion

  //#region Private methods
  /**
   * Creates the dispatcher for centralized event emission.
   * All component events route through this dispatcher.
   * @see Section 5.5 of 4_0_0_REFACTORING.md
   */
  #createDispatcher = () => ({
    emit: (
      eventType: LfDrawerEvent,
      detail?: Partial<LfDrawerEventPayload>,
    ) => {
      this.#framework.debug?.logs.new(
        this,
        `Event: ${eventType}`,
        "informational",
      );

      this.lfEvent.emit({
        comp: this,
        eventType,
        id: this.rootElement.id,
        originalEvent: detail?.originalEvent,
      });
    },
  });
  /**
   * Initializes the adapter with v4.0.0 architecture.
   *
   * Structure:
   * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + component state
   * - controller.computed: Derived predicates (isOpen, isResponsive, isSlide, isDock, isModal)
   * - controller.actions: Complex operations (open, close, toggle, trapFocus, focusFirstElement)
   * - elements: JSX factories + refs
   * - dispatcher: Centralized event emission
   * - handlers: Event callbacks
   *
   * @see Section 5 of 4_0_0_REFACTORING.md
   */
  #initAdapter = () => {
    // Adapter accessor - shared by all factories
    const getAdapter = () => this.#adapter;

    // Closure for previously focused element management
    const setPreviouslyFocused = (el: HTMLElement | null) => {
      this.#previouslyFocusedElement = el;
    };
    const getPreviouslyFocused = () => this.#previouslyFocusedElement;

    const adapterWithoutDispatcher = createAdapter(
      // Getters - base getters (via utility) + component-specific state reads
      {
        ...createBaseGetters({
          blocks: () => this.#b.drawer,
          compInstance: () => this,
          framework: () => this.#framework,
          ids: () => this.#i.drawer,
          parts: () => this.#p,
        }),
        previouslyFocusedElement: () => this.#previouslyFocusedElement,
      },
      // Computed - derived predicates (from dedicated file)
      prepDrawerComputed(getAdapter),
      // Actions - complex multi-step operations (from dedicated file)
      prepDrawerActions(getAdapter, setPreviouslyFocused, getPreviouslyFocused),
      // Adapter accessor
      getAdapter,
    );

    // Combine adapter parts with dispatcher
    this.#adapter = {
      ...adapterWithoutDispatcher,
      dispatcher: this.#createDispatcher(),
    };
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

    if (this.lfResponsive > 0) {
      this.#adapter.controller.actions.applyResponsiveMode();
      this.#resizeHandler = async () => {
        if (this.#resizeTimer) {
          clearTimeout(this.#resizeTimer);
        }
        this.#resizeTimer = window.setTimeout(() => {
          this.#adapter.controller.actions.applyResponsiveMode();
          this.#resizeTimer = null;
        }, 200);
      };
      window.addEventListener("resize", this.#resizeHandler);
    }
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    this.#adapter.dispatcher.emit("ready");
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
    const { setLfStyle } = this.#framework.theme;
    const { lfStyle } = this;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div
          id={this.#w}
          role="dialog"
          aria-modal={
            this.#adapter.controller.computed.isModal() ? "true" : null
          }
          ref={(el) => {
            if (el) {
              this.#adapter.elements.refs.drawer = el;
            }
          }}
        >
          <DrawerFC adapter={this.#adapter} />
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    if (this.#resizeHandler) {
      window.removeEventListener("resize", this.#resizeHandler);
    }
    this.#framework?.effects.backdrop.hide();
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}
