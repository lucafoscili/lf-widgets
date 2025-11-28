import { newSpecPage } from "@stencil/core/testing";
import { LfButton } from "./lf-button";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfButton], html });
  await page.waitForChanges();
  return page;
};

describe("lf-button component", () => {
  it("derives icon and label from dataset when set after mount", async () => {
    const page = await createPage(`<lf-button></lf-button>`);
    expect(page.root.lfIcon).toBe(null);
    expect(page.root.lfLabel).toBe("");
    page.root.lfDataset = { nodes: [{ icon: "save", value: "Save" }] } as any;
    await page.waitForChanges();
    expect(page.root.lfIcon).toBe("save");
    expect(page.root.lfLabel).toBe("Save");
  });

  it("toggles value on click when lfToggable", async () => {
    const page = await createPage(
      `<lf-button lf-styling="icon" lf-toggable="true" lf-icon="palette"></lf-button>`,
    );
    expect(await page.root.getValue()).toBe("off");
    const btn = page.root.shadowRoot.querySelector("button");
    expect(btn).not.toBeNull();
    btn!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await page.waitForChanges();
    expect(await page.root.getValue()).toBe("on");
  });

  it("does not toggle when disabled", async () => {
    const page = await createPage(
      `<lf-button lf-styling="icon" lf-toggable="true" lf-ui-state="disabled" lf-icon="palette"></lf-button>`,
    );
    expect(await page.root.getValue()).toBe("off");
    const btn = page.root.shadowRoot.querySelector("button");
    expect(btn).not.toBeNull();
    btn!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await page.waitForChanges();
    expect(await page.root.getValue()).toBe("off");
  });

  it("emits lf-button-event with eventType click and value", async () => {
    const page = await createPage(
      `<lf-button lf-styling="icon" lf-toggable="true" lf-icon="palette"></lf-button>`,
    );
    const events: any[] = [];
    page.root.addEventListener("lf-button-event", (e: CustomEvent) => {
      events.push(e.detail);
    });
    const btn = page.root.shadowRoot.querySelector("button");
    expect(btn).not.toBeNull();
    btn!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await page.waitForChanges();
    expect(events.length).toBeGreaterThan(0);
    const clickEvent = events.find((e) => e.eventType === "click");
    expect(clickEvent).toBeTruthy();
    expect(clickEvent.value).toBe("on");
    expect(clickEvent.valueAsBoolean).toBe(true);
  });

  it("setMessage temporarily overrides label and icon then restores", async () => {
    // Use real timers; make rAF immediate in test env
    const originalRAF = (global as any).requestAnimationFrame;
    (global as any).requestAnimationFrame = (cb: Function) => cb();
    const page = await createPage(
      `<lf-button lf-icon="save" lf-label="Save"></lf-button>`,
    );
    const originalIcon = page.root.lfIcon;
    const originalLabel = page.root.lfLabel;
    await page.root.setMessage("Copied", "check", 10);
    await page.waitForChanges();
    expect(page.root.lfLabel).toBe("Copied");
    expect(page.root.lfIcon).toBe("check");
    // Wait slightly longer than timeout to allow restore
    await new Promise((r) => setTimeout(r, 15));
    await page.waitForChanges();
    expect(page.root.lfLabel).toBe(originalLabel);
    expect(page.root.lfIcon).toBe(originalIcon);
    (global as any).requestAnimationFrame = originalRAF;
  });
});
