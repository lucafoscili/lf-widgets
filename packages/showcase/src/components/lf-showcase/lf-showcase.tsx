import {
  LF_WRAPPER_ID,
  LfButtonEventPayload,
  LfCardEventPayload,
  LfComponentTag,
  LfDataDataset,
  LfDebugLifecycleInfo,
  LfEvent,
  LfFrameworkInterface,
  LfListEventPayload,
  onFrameworkReady,
} from "@lf-widgets/foundations";
import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
  VNode,
  Watch,
} from "@stencil/core";
import { ComponentTemplate } from "./components/component-template";
import { FrameworkTemplate } from "./components/framework-template";
import {
  LfShowcaseDatasets,
  LfShowcaseTitle,
  LfShowcaseViews,
} from "./lf-showcase-declarations";
import {
  LF_DOC,
  LF_SHOWCASE_COMPONENTS,
  LF_SHOWCASE_FRAMEWORK,
} from "./lf-showcase-fixtures";

/**
 * Represents a showcase component for displaying and navigating through multiple sections and items.
 *
 * @remarks
 * This component manages the internal state for different sections (e.g., Components, Framework) and
 * updates the URL based on the user's selections. It incorporates features such as scroll-to-top,
 * custom styling, and optional drawer/header elements.
 *
 * @example
 * <lf-showcase
 *   lf-drawer
 *   lf-header
 *   lf-scroll-element={someHTMLElement}
 *   lf-style="display: block;"
 *   lf-value={{ Components: 'button', Framework: 'lfdata' }}
 * ></lf-showcase>
 *
 * @public
 */
@Component({
  tag: "lf-showcase",
  styleUrl: "lf-showcase.scss",
  shadow: true,
})
export class LfShowcase {
  @Element() rootElement: HTMLLfShowcaseElement;

  //#region States
  @State() currentState: LfShowcaseViews = {
    Components: "",
    Framework: "",
  };
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() isDarkMode: boolean;
  @State() isDrawerDocked = false;
  @State() datasets: LfShowcaseDatasets = {
    Components: null,
    Framework: null,
  };
  @State() showScrollTop = false;
  //#endregion

  //#region Props
  /**
   * Enables the drawer.
   * @type {boolean}
   * @default false
   * @mutable
   */
  @Prop({ mutable: true }) lfDrawer: boolean = false;
  /**
   * Enables the header.
   * @type {boolean}
   * @default false
   * @mutable
   */
  @Prop({ mutable: true }) lfHeader: boolean = false;
  /**
   * The scroll container, functional to the ScrollToTop floating button.
   * @type {HTMLElement}
   * @default ""
   */
  @Prop({ mutable: false }) lfScrollElement: HTMLElement;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * Sets the initial value of the views.
   * @type {LfShowcaseViews}
   * @default null
   */
  @Prop({ mutable: false }) lfValue: LfShowcaseViews = null;
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #cards: { [index: string]: HTMLLfCardElement } = {};
  #content: HTMLDivElement;
  #drawer: HTMLLfDrawerElement;
  #drawerDataset: LfDataDataset;
  #drawerToggle: HTMLLfButtonElement;
  #headers: { [K in LfShowcaseTitle]: HTMLDivElement | null } = {
    Components: null,
    Framework: null,
  };
  #sections: { [K in LfShowcaseTitle]: HTMLDivElement | null } = {
    Components: null,
    Framework: null,
  };
  //#endregion

  //#region Watchers
  @Watch("currentState")
  handleCurrentStateChange(newValue: LfShowcaseViews) {
    const params = new URLSearchParams();

    if (newValue.Components) {
      params.set("Components", newValue.Components);
    }
    if (newValue.Framework) {
      params.set("Framework", newValue.Framework);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;

    window.history.replaceState({}, "", newUrl);
  }
  @Watch("lfDrawer")
  handleDrawerChange(newValue: boolean) {
    if (this.#drawer) {
      if (newValue) {
        this.#drawer.open();
      } else {
        this.#drawer.close();
      }
    }
  }
  //#endregion

  //#region Private methods
  #onFrameworkReady = async () => {
    this.#framework = await onFrameworkReady;
    this.debugInfo = this.#framework.debug.info.create();
  };
  async #handleCardClick(
    e: CustomEvent<LfCardEventPayload>,
    type: LfShowcaseTitle,
  ) {
    if (e.detail.eventType === "click") {
      this.currentState = {
        ...this.currentState,
        [type]: e.detail.id,
      };
    }
  }
  #handleScroll = () => {
    const scrollElement = this.lfScrollElement
      ? this.lfScrollElement.scrollTop
      : this.#content.scrollTop;
    this.showScrollTop = scrollElement > 300;
  };
  #handleScrollTop = async () => {
    if (this.lfScrollElement) {
      this.lfScrollElement.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      this.#content.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  async #scrollToElement(type: LfShowcaseTitle) {
    if (this.#sections[type]) {
      this.#sections[type].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
  #prepContent = (): VNode => {
    const { bemClass, get } = this.#framework.theme;

    return (
      <div
        class={bemClass("showcase", "content")}
        onScroll={!this.lfScrollElement ? this.#handleScroll : undefined}
        ref={(el) => {
          if (el) {
            this.#content = el;
          }
        }}
      >
        <lf-article
          class={bemClass("showcase", "intro")}
          lfDataset={LF_DOC}
          part="intro"
        ></lf-article>
        <div class={bemClass("showcase", "links")}>
          <lf-button
            aria-label="Open GitHub Repository"
            class={bemClass("showcase", "link")}
            lfIcon={get.icon("brandGithub")}
            lfLabel="GitHub"
            lfStyling="floating"
            onClick={() =>
              window.open("https://github.com/lucafoscili/lf-widgets", "_blank")
            }
            part="github"
            title="Open GitHub Repository"
          ></lf-button>
          <lf-button
            aria-label="Open npm Package"
            class={bemClass("showcase", "link")}
            lfIcon={get.icon("brandNpm")}
            lfLabel="npm"
            lfStyling="floating"
            onClick={() =>
              window.open("https://www.npmjs.com/package/lf-widgets", "_blank")
            }
            part="npm"
            title="Open npm Package"
          ></lf-button>
        </div>
        {this.#prepSection("Components")}
        {this.#prepSection("Framework")}
      </div>
    );
  };
  #prepCards(type: LfShowcaseTitle): VNode[] {
    const { stringify } = this.#framework.data.cell;
    const { effects, theme } = this.#framework;

    return this.datasets[type as keyof LfShowcaseDatasets].nodes.map((node) => {
      const cardDataset: LfDataDataset = {
        nodes: [
          {
            cells: {
              icon: {
                shape: "image",
                value: node.icon,
              },
              text1: {
                value: stringify(node.value),
              },
              text2: { value: "" },
              text3: { value: node.description },
            },
            id: node.id,
          },
        ],
      };

      return (
        <lf-card
          class={theme.bemClass("showcase", "card")}
          id={node.id}
          lfDataset={cardDataset}
          lfSizeX="300px"
          lfSizeY="300px"
          onLf-card-event={async (e: CustomEvent<LfCardEventPayload>) => {
            const { eventType } = e.detail;

            if (eventType === "click") {
              await this.#handleCardClick(e, type);
              this.#scrollToElement(type);
            }
          }}
          ref={(el: HTMLLfCardElement) => {
            if (el) {
              this.#cards[node.id] = el;
              effects.register.tilt(el, 15);
            }
          }}
        ></lf-card>
      );
    });
  }
  #prepDrawerToggler = (className?: string): VNode => {
    const { current, icon } = this.#framework.theme.get;

    const drawerIconOff = icon("layoutSidebar");
    const drawerIcon = current().variables["--lf-icon-clear"];
    const drawerLabel = "Toggle Side Menu";
    const drawerHandler = (e: LfEvent<LfButtonEventPayload>) => {
      const { eventType, valueAsBoolean } = e.detail;

      switch (eventType) {
        case "click":
          this.handleDrawerChange(valueAsBoolean);
          break;
      }
    };

    return (
      <lf-button
        aria-label={drawerLabel}
        class={className || ""}
        lfIcon={drawerIcon}
        lfIconOff={drawerIconOff}
        lfStyling="icon"
        lfToggable={true}
        lfValue={this.lfDrawer}
        onLf-button-event={drawerHandler}
        part="drawer-button"
        ref={(el: HTMLLfButtonElement) => {
          if (el) {
            this.#drawerToggle = el;
          }
        }}
        title={drawerLabel}
      ></lf-button>
    );
  };
  #prepThemeToggler = (className?: string): VNode => {
    const { get } = this.#framework.theme;

    const themeIcon = get.icon("moon");
    const themeLabel = this.isDarkMode
      ? "Toggle Light Mode"
      : "Toggle Dark Mode";
    const themeHandler = (e: LfEvent<LfButtonEventPayload>) => {
      const { eventType, valueAsBoolean } = e.detail;

      switch (eventType) {
        case "click":
          if (!valueAsBoolean) {
            if (process.env.NODE_ENV === "development") {
              console.log("Dark mode enabled");
            }
            this.#framework.theme.set("dark");
          } else {
            if (process.env.NODE_ENV === "development") {
              console.log("Light mode enabled");
            }
            this.#framework.theme.set("light");
          }
          break;
      }
    };

    return (
      <lf-button
        aria-label={themeLabel}
        class={className || ""}
        lfIcon={themeIcon}
        lfStyling="icon"
        lfToggable={true}
        lfValue={!this.isDarkMode}
        onLf-button-event={themeHandler}
        part="theme-button"
        title={themeLabel}
      ></lf-button>
    );
  };
  #prepDrawer = (): VNode => {
    const { bemClass, get, randomize, set } = this.#framework.theme;

    return (
      <lf-drawer
        class={bemClass("showcase", "drawer", { hidden: !this.lfDrawer })}
        lfResponsive={768}
        onLf-drawer-event={(e: { detail: { comp?: any; eventType?: any } }) => {
          const { eventType } = e.detail;

          switch (eventType) {
            case "close":
              this.lfDrawer = false;
              requestAnimationFrame(async () => {
                await this.#drawerToggle.setValue(false);
              });
              break;
            case "open":
              this.lfDrawer = true;
              requestAnimationFrame(async () => {
                await this.#drawerToggle.setValue(true);
              });
              break;
          }

          this.isDrawerDocked = Boolean(e.detail.comp.lfDisplay === "dock");
        }}
        part="drawer"
        ref={(el: HTMLLfDrawerElement) => {
          if (el) {
            this.#drawer = el;
          }
        }}
      >
        <div class={bemClass("drawer", "slot")} slot="content">
          <lf-image
            class={bemClass("drawer", "logo")}
            lfValue={get.icon("lfWebsite")}
          ></lf-image>
          <lf-tree
            class={bemClass("drawer", "tree")}
            lfAccordionLayout={true}
            lfDataset={this.#drawerDataset}
            onLf-tree-event={(e) => {
              const { eventType, node } = e.detail;

              if (eventType === "click" && node.id) {
                const isFramework =
                  this.datasets.Framework.nodes.includes(node);
                const type: LfShowcaseTitle = isFramework
                  ? "Framework"
                  : "Components";
                if (node.id !== this.currentState[type]) {
                  this.currentState = {
                    ...this.currentState,
                    [type]: node.id,
                  };
                  this.#scrollToElement(type);
                }
              }
            }}
          ></lf-tree>
          <lf-button
            class={bemClass("drawer", "close")}
            lfDataset={get.themes().asDataset}
            lfStretchX={true}
            lfStyling="raised"
            onLf-button-event={(e) => {
              const { eventType, originalEvent } = e.detail;

              switch (eventType) {
                case "click":
                  randomize();
                  break;
                case "lf-event":
                  const og = originalEvent as LfEvent<LfListEventPayload>;
                  const theme = og.detail.node.id;
                  set(theme);
                  break;
              }
            }}
          ></lf-button>
        </div>
      </lf-drawer>
    );
  };
  #prepHeader = (): VNode => {
    const { bemClass } = this.#framework.theme;

    return (
      <lf-header
        class={bemClass("showcase", "header", {
          hidden: !this.lfHeader,
        })}
        part="header"
      >
        <div class={bemClass("header")} slot="content">
          <div class={bemClass("header", "left")}>
            {this.#prepDrawerToggler(bemClass("header", "button"))}
          </div>
          <div class={bemClass("header", "right")}>
            {this.#prepThemeToggler(bemClass("header", "button"))}
          </div>
        </div>
      </lf-header>
    );
  };
  #prepSection(type: LfShowcaseTitle): VNode {
    const { bemClass } = this.#framework.theme;

    const currentValue = this.currentState[type];
    const tag = ("lf-" + currentValue.toLowerCase()) as LfComponentTag;

    return (
      <div
        class={bemClass("showcase", "section")}
        part="section"
        ref={(el) => {
          if (el) {
            this.#sections[type] = el;
          }
        }}
      >
        {this.#prepTitle(type, currentValue)}
        {!currentValue ? (
          <div class={bemClass("showcase", "cards")} part="cards">
            {this.#prepCards(type)}
          </div>
        ) : type === "Components" ? (
          <ComponentTemplate
            component={tag}
            manager={this.#framework}
            showcase={this}
          ></ComponentTemplate>
        ) : (
          <FrameworkTemplate
            framework={currentValue}
            manager={this.#framework}
            showcase={this}
          ></FrameworkTemplate>
        )}
      </div>
    );
  }
  #prepTitle = (type: LfShowcaseTitle, current: string): VNode => {
    const { bemClass, get } = this.#framework.theme;

    return (
      <div
        class={bemClass("showcase", "title")}
        part="title"
        ref={(el) => {
          if (el) {
            this.#headers[type] = el;
          }
        }}
      >
        <lf-typewriter
          class={bemClass("showcase", "typewriter")}
          lfTag="h2"
          lfValue={current || type}
          part="typewriter"
        ></lf-typewriter>
        <div
          class={bemClass("showcase", "navigation", {
            active: Boolean(current),
          })}
        >
          <lf-button
            lfIcon={get.icon("arrowBack")}
            lfLabel="Back"
            lfStretchX={true}
            lfStretchY={true}
            onClick={async () => {
              this.#scrollToElement(type);
              this.currentState = {
                ...this.currentState,
                [type]: "",
              };
            }}
            part="back"
          ></lf-button>
        </div>
      </div>
    );
  };
  //#endregion

  //#region Lifecycle hooks
  connectedCallback() {
    console.log("connectedCallback");
    if (this.lfScrollElement) {
      this.lfScrollElement.addEventListener("scroll", this.#handleScroll);
    }
  }
  async componentWillLoad() {
    await this.#onFrameworkReady();
    this.isDarkMode = this.#framework.theme.get.current().isDark;

    const icons = this.#framework.theme.get.icons();
    this.datasets.Components = LF_SHOWCASE_COMPONENTS(icons);
    this.datasets.Framework = LF_SHOWCASE_FRAMEWORK(icons);

    if (this.lfValue) {
      this.currentState = this.lfValue;
    } else {
      const searchParams = new URLSearchParams(window.location.search);

      searchParams.forEach((value, key) => {
        const keyLower = key.toLowerCase();
        const valueLower = value.toLowerCase();

        switch (keyLower) {
          case "components":
            this.currentState = {
              ...this.currentState,
              Components: valueLower,
            };
            break;
          case "framework":
            this.currentState = {
              ...this.currentState,
              Framework: valueLower,
            };
            break;
        }
      });
    }

    this.#drawerDataset = {
      nodes: [
        {
          children: [
            {
              children: this.datasets.Components.nodes,
              id: "",
              value: "Components",
              icon: icons.slideshow,
              description: "Explore the available components.",
            },
            {
              children: this.datasets.Framework.nodes,
              id: "",
              value: "Framework",
              icon: icons.ikosaedr,
              description: "Discover the available framework utilities.",
            },
          ],
          id: "",
          value: "Home",
          icon: "",
          description: "",
        },
      ],
    };
  }
  componentDidLoad() {
    if (this.lfDrawer) {
      requestAnimationFrame(async () => {
        this.#drawer.open();
      });
    }
  }
  render() {
    const { bemClass, get } = this.#framework.theme;

    return (
      <Host>
        <div id={LF_WRAPPER_ID}>
          <div
            class={bemClass("showcase", null, {
              full: this.lfDrawer && this.lfHeader,
              "has-drawer": this.lfDrawer && this.isDrawerDocked,
              "has-header": this.lfHeader,
            })}
            part="showcase"
          >
            {this.#prepHeader()}
            {this.#prepDrawer()}
            {this.#prepContent()}
          </div>
        </div>
        <lf-button
          aria-label="Scroll to top"
          class={bemClass("showcase", "scroll-to-top", {
            hidden: !this.showScrollTop,
          })}
          lfIcon={get.icon("chevronsUp")}
          lfStyling="floating"
          onClick={this.#handleScrollTop}
          part="scroll-to-top"
          title="Scroll to top"
        ></lf-button>
      </Host>
    );
  }
  disconnectedCallback() {
    const { effects } = this.#framework;

    if (this.lfScrollElement) {
      this.lfScrollElement.removeEventListener("scroll", this.#handleScroll);
    } else {
      window.removeEventListener("scroll", this.#handleScroll);
    }
    for (const key in this.#cards) {
      effects.unregister.tilt(this.#cards[key]);
    }
  }
  //#endregion
}
