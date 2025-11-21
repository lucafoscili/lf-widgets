import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfChat } from "./lf-chat";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfChat],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("lf-chat", () => {
  it("should render", async () => {
    const page = await createPage(`<lf-chat></lf-chat>`);
    expect(page.root).toBeTruthy();
  });

  it("should have default props", async () => {
    const page = await createPage(`<lf-chat></lf-chat>`);
    const component = page.rootInstance as LfChat;

    expect(component.lfContextWindow).toBe(8192);
    expect(component.lfEmpty).toBe("Your chat history is empty!");
    expect(component.lfEndpointUrl).toBe("http://localhost:5001");
    expect(component.lfTools).toEqual([]);
    expect(component.lfFrequencyPenalty).toBe(0);
  });

  it("should set props", async () => {
    const page = await createPage(
      `<lf-chat lf-context-window="4096" lf-empty="No messages"></lf-chat>`,
    );
    const component = page.rootInstance as LfChat;

    expect(component.lfContextWindow).toBe(4096);
    expect(component.lfEmpty).toBe("No messages");
  });

  it("should get props", async () => {
    const page = await createPage(`<lf-chat></lf-chat>`);
    const component = page.rootInstance as LfChat;

    const props = await component.getProps();
    expect(props.lfContextWindow).toBe(8192);
    expect(props.lfEmpty).toBe("Your chat history is empty!");
  });

  it("should refresh", async () => {
    const page = await createPage(`<lf-chat></lf-chat>`);
    const component = page.rootInstance as LfChat;

    await component.refresh();
    expect(page.root).toBeTruthy();
  });

  it("should get debug info", async () => {
    const page = await createPage(`<lf-chat></lf-chat>`);
    const component = page.rootInstance as LfChat;

    const debugInfo = await component.getDebugInfo();
    expect(debugInfo).toBeDefined();
  });
});
