import { getLfCore } from "../../index";
import {
  LF_ATTRIBUTES,
  LF_DRAWER_BLOCKS,
  LF_DRAWER_PARTS,
  LF_DRAWER_PROPS,
  LF_DRAWER_SLOT,
  LF_EFFECTS_FOCUSABLES,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfCoreInterface,
  LfDebugLifecycleInfo,
  LfDrawerDisplay,
  LfDrawerElement,
  LfDrawerEvent,
  LfDrawerEventPayload,
  LfDrawerInterface,
  LfDrawerPosition,
  LfDrawerPropsInterface,
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
  #core: LfCoreInterface;
  #b = LF_DRAWER_BLOCKS;
  #lf = LF_ATTRIBUTES;
  #p = LF_DRAWER_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #drawer: HTMLDivElement;
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
  onLfEvent(e: Event | CustomEvent, eventType: LfDrawerEvent) {
    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
    });
  }
  //#endregion

  //#region Listeners
  @Listen("keydown")
  listenKeydown(e: KeyboardEvent) {
    if (!this.lfValue) return;

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        this.close();
        break;
      case "Tab":
        this.#handleFocusTrap(e);
        break;
    }
  }
  //#endregion

  //#region Watchers
  @Watch("lfDisplay")
  onLfDisplayChange(newVal: LfDrawerDisplay, oldVal: LfDrawerDisplay) {
    this.#handleBackdropChange(oldVal, newVal);
  }
  @Watch("lfResponsive")
  onLfResponsiveChange() {
    if (this.lfResponsive > 0) {
      this.#applyResponsiveMode();
      if (!this.#resizeHandler) {
        this.#resizeHandler = async () => {
          if (this.#resizeTimer) {
            clearTimeout(this.#resizeTimer);
          }
          this.#resizeTimer = window.setTimeout(() => {
            this.#applyResponsiveMode();
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
    if (!this.lfValue) {
      return;
    }

    requestAnimationFrame(() => {
      this.lfValue = false;
      this.onLfEvent(new CustomEvent("close"), "close");
      this.#core.effects.backdrop.hide();

      if (this.#previouslyFocusedElement) {
        this.#previouslyFocusedElement.focus();
        this.#previouslyFocusedElement = null;
      }
    });
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
    return this.lfValue;
  }
  /**
   * Opens the drawer.
   */
  @Method()
  async open(): Promise<void> {
    if (this.lfValue) {
      return;
    }

    this.#previouslyFocusedElement = document.activeElement as HTMLElement;

    requestAnimationFrame(() => {
      this.lfValue = true;
      this.onLfEvent(new CustomEvent("open"), "open");

      if (this.lfDisplay === "slide") {
        this.#core.effects.backdrop.show(() => this.close());
      }

      requestAnimationFrame(() => {
        this.#focusFirstElementInDrawer();
      });
    });
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
    if (this.lfValue) {
      this.close();
    } else {
      this.open();
    }
  }
  /**
   * Initiates the unmount sequence, which removes the component from the DOM after a delay.
   * @param {number} ms - Number of milliseconds
   */
  @Method()
  async unmount(ms: number = 0): Promise<void> {
    setTimeout(() => {
      this.#core.effects.backdrop.hide();
      this.onLfEvent(new CustomEvent("unmount"), "unmount");
      this.rootElement.remove();
    }, ms);
  }
  //#endregion

  //#region Private methods
  #applyResponsiveMode() {
    if (this.lfResponsive <= 0) {
      return;
    }

    const oldVal = this.lfDisplay;
    const newVal = window.innerWidth >= this.lfResponsive ? "dock" : "slide";
    if (newVal !== oldVal) {
      this.lfDisplay = newVal;
      this.#handleBackdropChange(oldVal, newVal);
    }
  }
  #handleBackdropChange(oldVal: LfDrawerDisplay, newVal: LfDrawerDisplay) {
    if (!this.lfValue) {
      return;
    }

    if (oldVal === "slide" && newVal === "dock") {
      this.#core.effects.backdrop.hide();
    } else if (oldVal === "dock" && newVal === "slide") {
      this.#core.effects.backdrop.show(() => this.close());
    }
  }
  #focusFirstElementInDrawer() {
    if (!this.lfValue) {
      return;
    }

    if (!this.#drawer) {
      return;
    }

    const focusable = this.#drawer.querySelector<HTMLElement>(
      LF_EFFECTS_FOCUSABLES.join(","),
    );
    if (focusable) {
      focusable.focus();
    } else {
      this.#drawer.focus();
    }
  }
  #handleFocusTrap(e: KeyboardEvent) {
    if (!this.lfValue || !this.#drawer) {
      return;
    }

    const focusableElements = Array.from(
      this.#drawer.querySelectorAll<HTMLElement>(
        LF_EFFECTS_FOCUSABLES.join(","),
      ),
    ).filter(
      (el) =>
        el.offsetWidth > 0 ||
        el.offsetHeight > 0 ||
        el === document.activeElement,
    );

    if (focusableElements.length === 0) {
      e.preventDefault();
      return;
    }

    const firstElem = focusableElements[0];
    const lastElem = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElem) {
      e.preventDefault();
      lastElem.focus();
    } else if (!e.shiftKey && document.activeElement === lastElem) {
      e.preventDefault();
      firstElem.focus();
    }
  }
  //#endregion

  //#region Lifecycle hooks
  connectedCallback() {
    if (!this.#core) {
      this.#core = getLfCore();
      this.debugInfo = this.#core.debug.info.create();
    }
    this.#core.theme.register(this);

    if (this.lfResponsive > 0) {
      this.#applyResponsiveMode();
      this.#resizeHandler = async () => {
        if (this.#resizeTimer) {
          clearTimeout(this.#resizeTimer);
        }
        this.#resizeTimer = window.setTimeout(() => {
          this.#applyResponsiveMode();
          this.#resizeTimer = null;
        }, 200);
      };
      window.addEventListener("resize", this.#resizeHandler);
    }
  }
  componentDidLoad() {
    const { info } = this.#core.debug;

    this.onLfEvent(new CustomEvent("ready"), "ready");
    info.update(this, "did-load");
  }
  componentWillRender() {
    const { info } = this.#core.debug;

    info.update(this, "will-render");
  }
  componentDidRender() {
    const { info } = this.#core.debug;

    info.update(this, "did-render");
  }
  render() {
    const { bemClass, setLfStyle } = this.#core.theme;

    const { drawer } = this.#b;
    const { lfStyle } = this;
    const isModal = this.lfDisplay === "slide" && this.lfValue;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div
          aria-modal={isModal}
          id={this.#w}
          ref={(el) => {
            if (el) {
              this.#drawer = el;
            }
          }}
          role="dialog"
        >
          <div class={bemClass(drawer._)} part={this.#p.drawer}>
            <div
              class={bemClass(drawer._, drawer.content)}
              lf-data={this.#lf.fadeIn}
              part={this.#p.content}
            >
              <slot name={LF_DRAWER_SLOT}></slot>
            </div>
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { theme } = this.#core;

    if (this.#resizeHandler) {
      window.removeEventListener("resize", this.#resizeHandler);
    }
    this.#core.effects.backdrop.hide();
    theme.unregister(this);
  }
  //#endregion
}
