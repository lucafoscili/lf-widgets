import { newSpecPage } from "@stencil/core/testing";
import { LfArticle } from "./lf-article";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfArticle], html });
  await page.waitForChanges();
  return page;
};

describe("lf-article component", () => {
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
