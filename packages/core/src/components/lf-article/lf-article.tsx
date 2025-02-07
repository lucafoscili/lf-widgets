import { getLfFramework } from "@lf-widgets/framework";
import {
  CY_ATTRIBUTES,
  LF_ARTICLE_BLOCKS,
  LF_ARTICLE_PARTS,
  LF_ARTICLE_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfArticleDataset,
  LfArticleElement,
  LfArticleEvent,
  LfArticleEventPayload,
  LfArticleInterface,
  LfArticleNode,
  LfArticlePropsInterface,
  LfFrameworkInterface,
  LfDebugLifecycleInfo,
  LfThemeUISize,
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

/**
 * Represents an article-style component that displays structured content
 * with headings, paragraphs, and other HTML elements. Implements methods
 * for managing state, retrieving component properties, handling user
 * interactions, and unmounting the component.
 *
 * @component
 * @tag lf-article
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying articles with structured content.
 *
 * @example
 * <lf-article
 *  lfDataset={{
 *   nodes: [
 *    { value: "Article 1", children: [ { value: "Section 1", children: [ { value: "Paragraph 1" } ] } ] }
 *  ]
 * }}
 * ></lf-article>
 *
 * @fires {CustomEvent} lf-article-event - Emitted for various component events
 */
@Component({
  tag: "lf-article",
  styleUrl: "lf-article.scss",
  shadow: true,
})
export class LfArticle implements LfArticleInterface {
  /**
   * References the root HTML element of the component (<lf-article>).
   */
  @Element() rootElement: LfArticleElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  //#endregion

  //#region Props
  /**
   * The data set for the LF Article component.
   * This property is mutable, meaning it can be changed after the component is initialized.
   *
   * @type {LfArticleDataset}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-article lfDataset={{ nodes: [ { value: "Article 1", children: [ { value: "Section 1", children: [ { value: "Paragraph 1" } ] } ] } ] }} />
   * ```
   */
  @Prop({ mutable: true }) lfDataset: LfArticleDataset = null;
  /**
   * Empty text displayed when there is no data.
   *
   * @type {string}
   * @default "Empty data."
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-article lfEmpty="No content available" />
   * ```
   */
  @Prop({ mutable: true }) lfEmpty: string = "Empty data.";
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-article lfStyle=".article { color: blue; }" />
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * The size of the component.
   *
   * @type {LfThemeUISize}
   * @default "medium"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-article lfUiSize="large" />
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfUiSize: LfThemeUISize = "medium";
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_ARTICLE_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #p = LF_ARTICLE_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-article-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfArticleEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfArticleEvent) {
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
   * Retrieves the debug information reflecting the current state of the component.
   * @returns {Promise<LfDebugLifecycleInfo>} A promise that resolves to a LfDebugLifecycleInfo object containing debug information.
   */
  @Method()
  async getDebugInfo(): Promise<LfDebugLifecycleInfo> {
    return this.debugInfo;
  }
  /**
   * Used to retrieve component's properties and descriptions.
   * @returns {Promise<LfArticlePropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfArticlePropsInterface> {
    const entries = LF_ARTICLE_PROPS.map(
      (
        prop,
      ): [
        keyof LfArticlePropsInterface,
        LfArticlePropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Triggers a re-render of the component to reflect any state changes.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
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
  #recursive(node: LfArticleNode, depth: number) {
    switch (depth) {
      case 0:
        return this.#articleTemplate(node, depth);
      case 1:
        return this.#sectionTemplate(node, depth);
      case 2:
        return this.#paragraphTemplate(node, depth);
      default:
        return node.children?.length
          ? this.#wrapperTemplate(node, depth)
          : this.#contentTemplate(node, depth);
    }
  }
  #prepArticle(): VNode[] {
    const elements: VNode[] = [];
    const { nodes } = this.lfDataset;

    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      elements.push(this.#recursive(node, 0));
    }
    return <Fragment>{elements}</Fragment>;
  }
  #articleTemplate(node: LfArticleNode, depth: number): VNode {
    const { bemClass } = this.#framework.theme;

    const { children, cssStyle, value } = node;

    return (
      <Fragment>
        <article
          class={bemClass(this.#b.article._)}
          data-cy={this.#cy.node}
          data-depth={depth.toString()}
          part={this.#p.article}
          style={cssStyle}
        >
          {value && <h1>{value}</h1>}
          {children && node.children.map((c) => this.#recursive(c, depth + 1))}
        </article>
      </Fragment>
    );
  }
  #sectionTemplate(node: LfArticleNode, depth: number): VNode {
    const { bemClass } = this.#framework.theme;

    const { children, cssStyle, value } = node;

    return (
      <Fragment>
        <section
          class={bemClass(this.#b.section._)}
          data-cy={this.#cy.node}
          data-depth={depth.toString()}
          part={this.#p.section}
          style={cssStyle}
        >
          {value && <h2>{value}</h2>}
          {children && children.map((c) => this.#recursive(c, depth + 1))}
        </section>
      </Fragment>
    );
  }
  #wrapperTemplate(node: LfArticleNode, depth: number): VNode {
    const { bemClass } = this.#framework.theme;

    const { children, cssStyle, tagName, value } = node;

    const isList = !!children?.some((c) => c.tagName === "li");

    const ComponentTag = isList ? "ul" : tagName ? tagName : "div";
    return (
      <Fragment>
        {value && <div>{value}</div>}
        <ComponentTag
          class={bemClass(this.#b.content._)}
          data-cy={this.#cy.node}
          data-depth={depth.toString()}
          part={this.#p.content}
          style={cssStyle}
        >
          {children && children.map((c) => this.#recursive(c, depth + 1))}
        </ComponentTag>
      </Fragment>
    );
  }
  #paragraphTemplate(node: LfArticleNode, depth: number): VNode {
    const { bemClass } = this.#framework.theme;

    const { children, cssStyle, value } = node;

    return (
      <Fragment>
        <p
          class={bemClass(this.#b.paragraph._)}
          data-cy={this.#cy.node}
          data-depth={depth.toString()}
          part={this.#p.paragraph}
          style={cssStyle}
        >
          {value && <h3>{value}</h3>}
          {children && children.map((c) => this.#recursive(c, depth + 1))}
        </p>
      </Fragment>
    );
  }
  #contentTemplate(node: LfArticleNode, depth: number): VNode {
    const { data, theme } = this.#framework;
    const { decorate } = data.cell.shapes;

    const { cells, cssStyle, tagName, value } = node;
    const key = cells && Object.keys(cells)[0];
    const cell = cells?.[key];

    const { content } = this.#b;

    if (cell) {
      const shape = decorate(cell.shape, [cell], async (e) =>
        this.onLfEvent(e, "lf-event"),
      );
      return shape[0];
    } else {
      const ComponentTag = tagName ? tagName : "span";
      return (
        <ComponentTag
          class={theme.bemClass(content._, content.body, {
            [ComponentTag]: Boolean(ComponentTag),
          })}
          data-depth={depth.toString()}
          part={this.#p.content}
          style={cssStyle}
        >
          {value}
        </ComponentTag>
      );
    }
  }
  //#endregion

  //#region Lifecycle hooks
  connectedCallback() {
    if (!this.#framework) {
      this.#framework = getLfFramework();
      this.debugInfo = this.#framework.debug.info.create();
    }
    this.#framework.theme.register(this);
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
    const { theme } = this.#framework;
    const { bemClass, setLfStyle } = theme;

    const { lfDataset, lfEmpty, lfStyle } = this;

    const { emptyData } = this.#b;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          {lfDataset?.nodes?.length ? (
            this.#prepArticle()
          ) : (
            <div class={bemClass(emptyData._)} part={this.#p.emptyData}>
              <div class={bemClass(emptyData._, emptyData.text)}>{lfEmpty}</div>
            </div>
          )}
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { theme } = this.#framework;

    theme.unregister(this);
  }
  //#endregion
}
