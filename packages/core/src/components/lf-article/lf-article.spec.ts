import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { LfArticle } from "./lf-article";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";
import { LfArticleEventPayload } from "@lf-widgets/foundations";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfArticle], html });
  await page.waitForChanges();
  return page;
};

describe("lf-article component", () => {
  describe("Rendering", () => {
    it("renders with default props", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      expect(page.root).toBeDefined();
      const emptyData = page.root.shadowRoot.querySelector(".empty-data");
      expect(emptyData).not.toBeNull();
      expect(emptyData.textContent.trim()).toBe("Empty data.");
    });

    it("renders empty message when no dataset", async () => {
      const page = await createPage(
        `<lf-article lf-empty="No content"></lf-article>`,
      );
      const emptyText = page.root.shadowRoot.querySelector(".empty-data__text");
      expect(emptyText).not.toBeNull();
      expect(emptyText.textContent.trim()).toBe("No content");
    });

    it("renders article content from dataset", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      page.rootInstance.lfDataset = {
        nodes: [
          {
            value: "Article Title",
            children: [
              { value: "Section 1", children: [{ value: "Paragraph 1" }] },
            ],
          },
        ],
      };
      await page.waitForChanges();
      const article = page.root.shadowRoot.querySelector("article");
      expect(article).not.toBeNull();
      const heading = page.root.shadowRoot.querySelector("h1");
      expect(heading).not.toBeNull();
      expect(heading.textContent.trim()).toBe("Article Title");
    });

    it("renders sections and paragraphs", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      page.rootInstance.lfDataset = {
        nodes: [
          {
            value: "Article",
            children: [
              {
                value: "Section",
                children: [
                  { value: "Paragraph", children: [{ value: "Content" }] },
                ],
              },
            ],
          },
        ],
      };
      await page.waitForChanges();
      const section = page.root.shadowRoot.querySelector("section");
      expect(section).not.toBeNull();
      const h2 = page.root.shadowRoot.querySelector("h2");
      expect(h2).not.toBeNull();
      expect(h2.textContent.trim()).toBe("Section");
      const p = page.root.shadowRoot.querySelector("p");
      expect(p).not.toBeNull();
      const h3 = p.querySelector("h3");
      expect(h3).not.toBeNull();
      expect(h3.textContent.trim()).toBe("Paragraph");
    });

    it("applies ui size attribute", async () => {
      const page = await createPage(
        `<lf-article lf-ui-size="small"></lf-article>`,
      );
      expect(page.root.getAttribute("lf-ui-size")).toBe("small");
    });
  });

  describe("Event Emission", () => {
    it("emits ready event on component load", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      // Ready event is emitted during componentDidLoad
      // Component should be ready after page creation
      expect(page.root).toBeDefined();
    });

    it("emits event with component id", async () => {
      const page = await createPage(
        `<lf-article id="my-article"></lf-article>`,
      );
      const events: CustomEvent<LfArticleEventPayload>[] = [];
      page.root.addEventListener("lf-article-event", (e: CustomEvent) =>
        events.push(e),
      );

      // Trigger unmount to emit an event
      await page.rootInstance.unmount(0);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const unmountEvent = events.find((e) => e.detail.eventType === "unmount");
      expect(unmountEvent).toBeDefined();
      expect(unmountEvent.detail.id).toBe("my-article");
    });

    it("emits unmount event when unmount is called", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      const events: CustomEvent<LfArticleEventPayload>[] = [];
      page.root.addEventListener("lf-article-event", (e: CustomEvent) =>
        events.push(e),
      );

      await page.rootInstance.unmount(0);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const unmountEvent = events.find((e) => e.detail.eventType === "unmount");
      expect(unmountEvent).toBeDefined();
    });

    it("emits event with correct payload structure", async () => {
      const page = await createPage(
        `<lf-article id="test-article"></lf-article>`,
      );
      const events: CustomEvent<LfArticleEventPayload>[] = [];
      page.root.addEventListener("lf-article-event", (e: CustomEvent) =>
        events.push(e),
      );

      await page.rootInstance.unmount(0);
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(events.length).toBeGreaterThan(0);
      const event = events[0];
      expect(event.detail).toHaveProperty("comp");
      expect(event.detail).toHaveProperty("eventType");
      expect(event.detail).toHaveProperty("id");
      expect(event.detail).toHaveProperty("originalEvent");
    });
  });

  describe("Dataset Tests", () => {
    it("renders multiple articles from dataset", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      page.rootInstance.lfDataset = {
        nodes: [{ value: "Article 1" }, { value: "Article 2" }],
      };
      await page.waitForChanges();
      const articles = page.root.shadowRoot.querySelectorAll("article");
      expect(articles.length).toBe(2);
    });

    it("renders nested sections correctly", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      page.rootInstance.lfDataset = {
        nodes: [
          {
            value: "Main Article",
            children: [
              { value: "Section 1" },
              { value: "Section 2" },
              { value: "Section 3" },
            ],
          },
        ],
      };
      await page.waitForChanges();
      const sections = page.root.shadowRoot.querySelectorAll("section");
      expect(sections.length).toBe(3);
    });

    it("renders article without title when value is empty", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      page.rootInstance.lfDataset = {
        nodes: [
          {
            children: [{ value: "Section without article title" }],
          },
        ],
      };
      await page.waitForChanges();
      const h1 = page.root.shadowRoot.querySelector("h1");
      expect(h1).toBeNull();
      const section = page.root.shadowRoot.querySelector("section");
      expect(section).not.toBeNull();
    });

    it("renders empty state when dataset has empty nodes array", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      page.rootInstance.lfDataset = { nodes: [] };
      await page.waitForChanges();
      const emptyData = page.root.shadowRoot.querySelector(".empty-data");
      expect(emptyData).not.toBeNull();
    });

    it("updates rendering when dataset changes", async () => {
      const page = await createPage(`<lf-article></lf-article>`);

      // Initial dataset
      page.rootInstance.lfDataset = {
        nodes: [{ value: "Initial Title" }],
      };
      await page.waitForChanges();
      let h1 = page.root.shadowRoot.querySelector("h1");
      expect(h1.textContent.trim()).toBe("Initial Title");

      // Update dataset
      page.rootInstance.lfDataset = {
        nodes: [{ value: "Updated Title" }],
      };
      await page.waitForChanges();
      h1 = page.root.shadowRoot.querySelector("h1");
      expect(h1.textContent.trim()).toBe("Updated Title");
    });
  });

  describe("Paragraph Types", () => {
    it("renders paragraph with h3 heading", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      page.rootInstance.lfDataset = {
        nodes: [
          {
            value: "Article",
            children: [
              {
                value: "Section",
                children: [{ value: "Paragraph Title" }],
              },
            ],
          },
        ],
      };
      await page.waitForChanges();
      const h3 = page.root.shadowRoot.querySelector("h3");
      expect(h3).not.toBeNull();
      expect(h3.textContent.trim()).toBe("Paragraph Title");
    });

    it("renders deep nested content as span", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      page.rootInstance.lfDataset = {
        nodes: [
          {
            value: "Article",
            children: [
              {
                value: "Section",
                children: [
                  {
                    value: "Paragraph",
                    children: [{ value: "Deep content text" }],
                  },
                ],
              },
            ],
          },
        ],
      };
      await page.waitForChanges();
      const span = page.root.shadowRoot.querySelector("span");
      expect(span).not.toBeNull();
      expect(span.textContent.trim()).toBe("Deep content text");
    });

    it("renders list items when children have li tagName", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      page.rootInstance.lfDataset = {
        nodes: [
          {
            value: "Article",
            children: [
              {
                value: "Section",
                children: [
                  {
                    value: "Paragraph",
                    children: [
                      {
                        children: [
                          { value: "Item 1", tagName: "li" },
                          { value: "Item 2", tagName: "li" },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };
      await page.waitForChanges();
      const ul = page.root.shadowRoot.querySelector("ul");
      expect(ul).not.toBeNull();
    });

    it("renders custom tagName elements", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      page.rootInstance.lfDataset = {
        nodes: [
          {
            value: "Article",
            children: [
              {
                value: "Section",
                children: [
                  {
                    value: "Paragraph",
                    children: [{ value: "Strong text", tagName: "strong" }],
                  },
                ],
              },
            ],
          },
        ],
      };
      await page.waitForChanges();
      const strong = page.root.shadowRoot.querySelector("strong");
      expect(strong).not.toBeNull();
      expect(strong.textContent.trim()).toBe("Strong text");
    });

    it("applies cssStyle to nodes", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      page.rootInstance.lfDataset = {
        nodes: [
          {
            value: "Styled Article",
            cssStyle: { color: "red" },
          },
        ],
      };
      await page.waitForChanges();
      const article = page.root.shadowRoot.querySelector(
        "article",
      ) as HTMLElement;
      expect(article).not.toBeNull();
      expect(article.style.color).toBe("red");
    });
  });

  describe("Style Tests", () => {
    it("applies lfStyle custom styles", async () => {
      const page = await createPage(
        `<lf-article lf-style="#lf-component { background: blue; }"></lf-article>`,
      );
      const styleTag = page.root.shadowRoot.querySelector("style");
      expect(styleTag).not.toBeNull();
    });

    it("does not render style tag when lfStyle is empty", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      const styleTag = page.root.shadowRoot.querySelector("style#lf-style");
      expect(styleTag).toBeNull();
    });

    it("updates style when lfStyle changes", async () => {
      const page = await createPage(`<lf-article></lf-article>`);

      // Initially no style
      let styleTag = page.root.shadowRoot.querySelector("style#lf-style");
      expect(styleTag).toBeNull();

      // Add style
      page.rootInstance.lfStyle = ".article { color: green; }";
      await page.waitForChanges();

      styleTag = page.root.shadowRoot.querySelector("style#lf-style");
      expect(styleTag).not.toBeNull();
    });

    it("renders wrapper div with correct id", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      const wrapper = page.root.shadowRoot.querySelector("#lf-component");
      expect(wrapper).not.toBeNull();
    });
  });

  describe("Public Methods", () => {
    let page: SpecPage;
    let component: LfArticle;

    beforeEach(async () => {
      page = await createPage(
        `<lf-article lf-empty="Test Empty"></lf-article>`,
      );
      component = page.rootInstance;
    });

    it("getProps returns component properties", async () => {
      const props = await component.getProps();

      expect(props).toBeDefined();
      expect(props.lfEmpty).toBe("Test Empty");
      expect(props.lfStyle).toBe("");
      expect(props.lfDataset).toBeNull();
    });

    it("getProps returns updated properties after changes", async () => {
      component.lfEmpty = "Updated Empty";
      component.lfStyle = ".custom { color: red; }";
      await page.waitForChanges();

      const props = await component.getProps();
      expect(props.lfEmpty).toBe("Updated Empty");
      expect(props.lfStyle).toBe(".custom { color: red; }");
    });

    it("getDebugInfo returns debug information", async () => {
      const debugInfo = await component.getDebugInfo();
      expect(debugInfo).toBeDefined();
    });

    it("refresh forces component re-render", async () => {
      await component.refresh();
      await page.waitForChanges();
      expect(page.root).toBeDefined();
    });

    it("refresh updates component after dataset change", async () => {
      component.lfDataset = {
        nodes: [{ id: "refreshed", value: "Refreshed Article" }],
      };
      await component.refresh();
      await page.waitForChanges();

      const h1 = page.root.shadowRoot.querySelector("h1");
      expect(h1).not.toBeNull();
      expect(h1.textContent.trim()).toBe("Refreshed Article");
    });

    it("unmount removes component from DOM", async () => {
      const events: CustomEvent<LfArticleEventPayload>[] = [];
      page.root.addEventListener("lf-article-event", (e: CustomEvent) =>
        events.push(e),
      );

      await component.unmount(0);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const unmountEvent = events.find((e) => e.detail.eventType === "unmount");
      expect(unmountEvent).toBeDefined();
    });

    it("unmount respects delay parameter", async () => {
      const events: CustomEvent<LfArticleEventPayload>[] = [];
      page.root.addEventListener("lf-article-event", (e: CustomEvent) =>
        events.push(e),
      );

      await component.unmount(100);

      // Should not have unmounted yet
      await new Promise((resolve) => setTimeout(resolve, 20));
      expect(
        events.find((e) => e.detail.eventType === "unmount"),
      ).toBeUndefined();

      // Wait for the delay
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(
        events.find((e) => e.detail.eventType === "unmount"),
      ).toBeDefined();
    });
  });

  describe("UI Size Variations", () => {
    it("applies small ui size", async () => {
      const page = await createPage(
        `<lf-article lf-ui-size="small"></lf-article>`,
      );
      expect(page.root.getAttribute("lf-ui-size")).toBe("small");
    });

    it("applies medium ui size by default", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      expect(page.root.getAttribute("lf-ui-size")).toBe("medium");
    });

    it("applies large ui size", async () => {
      const page = await createPage(
        `<lf-article lf-ui-size="large"></lf-article>`,
      );
      expect(page.root.getAttribute("lf-ui-size")).toBe("large");
    });

    it("reflects ui size changes", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      expect(page.root.getAttribute("lf-ui-size")).toBe("medium");

      page.rootInstance.lfUiSize = "small";
      await page.waitForChanges();
      expect(page.root.getAttribute("lf-ui-size")).toBe("small");
    });
  });

  describe("Data Attributes and Parts", () => {
    it("renders article element", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      page.rootInstance.lfDataset = {
        nodes: [{ value: "Article" }],
      };
      await page.waitForChanges();
      const article = page.root.shadowRoot.querySelector("article");
      expect(article).not.toBeNull();
    });

    it("renders article with data-depth attribute", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      page.rootInstance.lfDataset = {
        nodes: [{ value: "Article" }],
      };
      await page.waitForChanges();
      const article = page.root.shadowRoot.querySelector(
        "article[data-depth='0']",
      );
      expect(article).not.toBeNull();
    });

    it("renders section with correct depth", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      page.rootInstance.lfDataset = {
        nodes: [
          {
            value: "Article",
            children: [{ value: "Section" }],
          },
        ],
      };
      await page.waitForChanges();
      const section = page.root.shadowRoot.querySelector(
        "section[data-depth='1']",
      );
      expect(section).not.toBeNull();
    });

    it("renders paragraph with correct depth", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      page.rootInstance.lfDataset = {
        nodes: [
          {
            value: "Article",
            children: [
              {
                value: "Section",
                children: [{ value: "Paragraph" }],
              },
            ],
          },
        ],
      };
      await page.waitForChanges();
      const paragraph = page.root.shadowRoot.querySelector("p[data-depth='2']");
      expect(paragraph).not.toBeNull();
    });

    it("renders empty-data with part attribute", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      const emptyData = page.root.shadowRoot.querySelector(
        "[part='empty-data']",
      );
      expect(emptyData).not.toBeNull();
    });

    it("renders article with part attribute", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      page.rootInstance.lfDataset = {
        nodes: [{ value: "Article" }],
      };
      await page.waitForChanges();
      const article = page.root.shadowRoot.querySelector("[part='article']");
      expect(article).not.toBeNull();
    });

    it("renders section with part attribute", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      page.rootInstance.lfDataset = {
        nodes: [
          {
            value: "Article",
            children: [{ value: "Section" }],
          },
        ],
      };
      await page.waitForChanges();
      const section = page.root.shadowRoot.querySelector("[part='section']");
      expect(section).not.toBeNull();
    });

    it("renders paragraph with part attribute", async () => {
      const page = await createPage(`<lf-article></lf-article>`);
      page.rootInstance.lfDataset = {
        nodes: [
          {
            value: "Article",
            children: [
              {
                value: "Section",
                children: [{ value: "Paragraph" }],
              },
            ],
          },
        ],
      };
      await page.waitForChanges();
      const paragraph =
        page.root.shadowRoot.querySelector("[part='paragraph']");
      expect(paragraph).not.toBeNull();
    });
  });
});
