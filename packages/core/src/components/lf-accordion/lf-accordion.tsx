import {
  CY_ATTRIBUTES,
  LF_ACCORDION_BLOCKS,
  LF_ACCORDION_PARTS,
  LF_ACCORDION_PROPS,
  LF_ATTRIBUTES,
  LF_STYLE_ID,
  LF_THEME_ICONS,
  LF_WRAPPER_ID,
  LfAccordionElement,
  LfAccordionEvent,
  LfAccordionEventPayload,
  LfAccordionInterface,
  LfAccordionPropsInterface,
  LfDataDataset,
  LfDataNode,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfIconType,
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
  VNode,
} from "@stencil/core";
import { FIcon } from "../../utils/icon";
import { awaitFramework } from "../../utils/setup";
import { LfShape } from "../../utils/shapes";

/**
 * Represents an accordion-style component that displays a list of data items,
 * allowing users to expand or collapse content sections. Implements various
 * methods for managing state, retrieving component properties, handling user
 * interactions, and unmounting the component. Ripple effects may be enabled or
 * disabled via a property.
 *
 * @component
 * @tag lf-accordion
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element with expandable/collapsible sections.
 *
 * @example
 * <lf-accordion
 *   lfDataset={{
 *     nodes: [
 *       { id: "1", value: "Item 1", description: "Description 1" },
 *       { id: "2", value: "Item 2", description: "Description 2" }
 *     ]
 *   }}
 *   lfRipple={true}
 *   lfUiSize="medium"
 *   lfUiState="primary"
 *   lfStyle="#lf-component { background-color: red; }"
 * ></lf-accordion>
 *
 * @fires {CustomEvent} lf-accordion-event - Emitted for various component events
 */
@Component({
  tag: "lf-accordion",
  styleUrl: "lf-accordion.scss",
  shadow: true,
})
export class LfAccordion implements LfAccordionInterface {
  /**
   * References the root HTML element of the component (<lf-accordion>).
   */
  @Element() rootElement: LfAccordionElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() expandedNodes: Set<LfDataNode> = new Set();
  @State() selectedNodes: Set<LfDataNode> = new Set();
  //#endregion

  //#region Props
  /**
   * The data set for the LF Accordion component.
   * This property is mutable, meaning it can be changed after the component is initialized.
   *
   * @type {LfDataDataset}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-accordion
   *  lfDataset={{
   *   nodes: [
   *   { id: "1", value: "Item 1", description: "Description 1" },
   *   { id: "2", value: "Item 2", description: "Description 2" },
   *  ],
   * }}
   * ></lf-accordion>
   * ```
   */
  @Prop({ mutable: true }) lfDataset: LfDataDataset = null;
  /**
   * Indicates whether the ripple effect is enabled for the accordion component.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-accordion lfRipple={false}></lf-accordion>
   * ```
   */
  @Prop({ mutable: true }) lfRipple: boolean = true;
  /**
   * The size of the component.
   *
   * @type {LfThemeUISize}
   * @default "medium"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-accordion lfUiSize="small"></lf-accordion>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfUiSize: LfThemeUISize = "medium";
  /**
   * The color theme state for the component.
   *
   * @type {LfThemeUIState}
   * @default "primary"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-accordion lfUiState="secondary"></lf-accordion>
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-accordion lfStyle="color: red;"></lf-accordion>
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_ACCORDION_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_ACCORDION_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #headers: { [id: string]: HTMLDivElement } = {};
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-accordion-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfAccordionEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfAccordionEvent) {
    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
    });
  }
  //#endregion

  //#region Public methods
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
   * @returns {Promise<LfAccordionPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfAccordionPropsInterface> {
    const entries = LF_ACCORDION_PROPS.map(
      (
        prop,
      ): [
        keyof LfAccordionPropsInterface,
        LfAccordionPropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Returns the selected nodes.
   * @returns {Promise<LfDataNode[]>} Selected nodes.
   */
  @Method()
  async getSelectedNodes(): Promise<Set<LfDataNode>> {
    return this.selectedNodes;
  }
  /**
   * This method is used to trigger a new render of the component.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }
  /**
   * Toggles a node in the accordion, expanding or collapsing it based on its current state.
   * @param {string} id - The ID of the node to toggle.
   * @param {Event} [e] - The event that triggered the node toggle action.
   */
  @Method()
  async toggleNode(id: string, e?: Event) {
    const node = this.lfDataset.nodes.find((n) => n.id === id);
    if (!node) {
      return;
    }

    if (this.#isExpandible(node)) {
      if (this.#isExpanded(node)) {
        this.expandedNodes.delete(node);
      } else {
        this.expandedNodes.add(node);
      }
    } else if (this.#isSelected(node)) {
      this.selectedNodes.delete(node);
    } else {
      this.selectedNodes.add(node);
    }

    if (!this.#isExpandible(node)) {
      this.onLfEvent(e || new CustomEvent("click"), "click");
    }

    this.refresh();
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
  #isExpanded(node: LfDataNode) {
    return this.expandedNodes.has(node);
  }
  #isExpandible(node: LfDataNode) {
    return node.cells && Object.keys(node.cells).length > 0;
  }
  #isSelected(node: LfDataNode) {
    return this.selectedNodes.has(node);
  }
  #prepIcon(icon: LfIconType): VNode {
    const { theme } = this.#framework;

    const { node } = this.#b;

    return (
      <div class={theme.bemClass(node._, node.icon)} part={this.#p.icon}>
        <FIcon framework={this.#framework} icon={icon} />
      </div>
    );
  }
  #prepAccordion(): VNode[] {
    const { bemClass } = this.#framework.theme;

    const { lfDataset } = this;

    if (!lfDataset || !lfDataset.nodes) {
      return [];
    }

    const nodes: VNode[] = [];

    for (let i = 0; i < lfDataset.nodes.length; i++) {
      const node = lfDataset.nodes[i];
      const isExpanded = this.#isExpanded(node);
      const isExpandible = this.#isExpandible(node);
      const isSelected = this.#isSelected(node);

      nodes.push(
        <div
          class={bemClass(this.#b.node._)}
          data-cy={this.#cy.node}
          data-lf={this.#lf[this.lfUiState]}
        >
          <div
            class={bemClass(this.#b.node._, this.#b.node.header, {
              expanded: isExpandible && isExpanded,
              selected: !isExpandible && isSelected,
            })}
            data-cy={!isExpandible && this.#cy.button}
            onClick={(e) => this.toggleNode(node.id, e)}
            onPointerDown={(e) => this.onLfEvent(e, "pointerdown")}
            part={this.#p.header}
            tabindex="1"
            title={node.description}
            ref={(el) => {
              if (el) {
                this.#headers[node.id] = el;
              }
            }}
          >
            {node.icon ? this.#prepIcon(node.icon) : null}
            <span
              class={bemClass(this.#b.node._, this.#b.node.text)}
              part={this.#p.text}
            >
              {node.value}
            </span>
            {isExpandible && (
              <div
                class={bemClass(this.#b.node._, this.#b.node.expand, {
                  expanded: isExpanded,
                })}
                data-cy={this.#cy.dropdownButton}
                data-lf={this.#lf.icon}
                part={this.#p.icon}
              >
                <FIcon
                  framework={this.#framework}
                  icon={LF_THEME_ICONS.dropdown}
                />
              </div>
            )}
          </div>
          {isExpanded && (
            <div
              class={bemClass(this.#b.node._, this.#b.node.content, {
                selected: isSelected,
              })}
              data-lf={this.#lf.fadeIn}
              part={this.#p.content}
            >
              {this.#prepCell(node)}
            </div>
          )}
        </div>,
      );
    }
    return nodes;
  }
  #prepCell = (node: LfDataNode): VNode => {
    const { cells } = node;
    const key = cells && Object.keys(cells)[0];
    const cell = cells?.[key];

    return (
      <LfShape
        cell={cell}
        index={0}
        shape={cell.shape}
        eventDispatcher={async (e) => this.onLfEvent(e, "lf-event")}
        framework={this.#framework}
      ></LfShape>
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
  }
  componentDidLoad() {
    const { debug, effects, theme } = this.#framework;

    const hasThemeRipple = theme.get.current().hasEffect("ripple");
    if (this.lfRipple && hasThemeRipple) {
      Object.values(this.#headers).forEach((header) => {
        if (header) {
          effects.register.ripple(header);
        }
      });
    }

    this.onLfEvent(new CustomEvent("ready"), "ready");
    debug.info.update(this, "did-load");
  }
  componentWillRender() {
    const { info } = this.#framework.debug;

    info.update(this, "will-render");
  }
  componentDidRender() {
    const { debug } = this.#framework;

    debug.info.update(this, "did-render");
  }
  render() {
    const { bemClass, setLfStyle } = this.#framework.theme;
    const { lfStyle } = this;

    this.#headers = {};

    const { accordion } = this.#b;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div class={bemClass(accordion._)} part={this.#p.accordion}>
            {this.#prepAccordion()}
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { effects, theme } = this.#framework ?? {};

    const hasThemeRipple = theme?.get.current().hasEffect("ripple");
    if (effects && this.lfRipple && hasThemeRipple) {
      Object.values(this.#headers).forEach((header) => {
        if (header) {
          effects.unregister.ripple(header);
        }
      });
    }

    theme?.unregister(this);
  }
  //#endregion
}
