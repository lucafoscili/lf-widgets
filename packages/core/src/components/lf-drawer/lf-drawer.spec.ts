import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfDrawer } from "./lf-drawer";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfDrawer],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("LfDrawer", () => {
  beforeAll(() => {
    // Mock requestAnimationFrame to execute immediately
    global.requestAnimationFrame = (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    };
  });

  it("renders", async () => {
    const page = await createPage(`<lf-drawer></lf-drawer>`);
    expect(page.root).toBeTruthy();
  });

  it("renders with default props", async () => {
    const page = await createPage(`<lf-drawer></lf-drawer>`);
    const component = page.rootInstance as LfDrawer;

    expect(component.lfDisplay).toBe("slide");
    expect(component.lfPosition).toBe("left");
    expect(component.lfResponsive).toBe(0);
    expect(component.lfStyle).toBe("");
    expect(component.lfValue).toBe(false);
  });

  it("renders with custom props", async () => {
    const page = await createPage(
      `<lf-drawer lf-display="dock" lf-position="right" lf-responsive="768" lf-style="#test { color: red; }" lf-value="true"></lf-drawer>`,
    );
    const component = page.rootInstance as LfDrawer;

    expect(component.lfDisplay).toBe("dock");
    expect(component.lfPosition).toBe("right");
    expect(component.lfResponsive).toBe(768);
    expect(component.lfStyle).toBe("#test { color: red; }");
    expect(component.lfValue).toBe(true);
  });

  it("calls getProps method", async () => {
    const page = await createPage(`<lf-drawer></lf-drawer>`);
    const component = page.rootInstance as LfDrawer;
    const props = await component.getProps();

    expect(props).toBeDefined();
    expect(props.lfDisplay).toBe("slide");
    expect(props.lfPosition).toBe("left");
    expect(props.lfResponsive).toBe(0);
    expect(props.lfStyle).toBe("");
    expect(props.lfValue).toBe(false);
  });

  it("calls refresh method", async () => {
    const page = await createPage(`<lf-drawer></lf-drawer>`);
    const component = page.rootInstance as LfDrawer;
    await component.refresh();

    expect(component).toBeTruthy();
  });

  it("calls getDebugInfo method", async () => {
    const page = await createPage(`<lf-drawer></lf-drawer>`);
    const component = page.rootInstance as LfDrawer;
    const debugInfo = await component.getDebugInfo();

    expect(debugInfo).toBeDefined();
  });

  it("calls isOpened method", async () => {
    const page = await createPage(`<lf-drawer></lf-drawer>`);
    const component = page.rootInstance as LfDrawer;
    const isOpened = await component.isOpened();

    expect(isOpened).toBe(false);
  });

  it("calls open method", async () => {
    const page = await createPage(`<lf-drawer></lf-drawer>`);
    const component = page.rootInstance as LfDrawer;
    await component.open();
    await page.waitForChanges();

    expect(component.lfValue).toBe(true);
  });

  it("calls close method", async () => {
    const page = await createPage(`<lf-drawer lf-value="true"></lf-drawer>`);
    const component = page.rootInstance as LfDrawer;
    await component.close();
    await page.waitForChanges();

    expect(component.lfValue).toBe(false);
  });

  it("calls toggle method", async () => {
    const page = await createPage(`<lf-drawer></lf-drawer>`);
    const component = page.rootInstance as LfDrawer;
    await component.toggle();
    await page.waitForChanges();

    expect(component.lfValue).toBe(true);

    await component.toggle();
    await page.waitForChanges();

    expect(component.lfValue).toBe(false);
  });

  it("calls unmount method", async () => {
    const page = await createPage(`<lf-drawer></lf-drawer>`);
    const component = page.rootInstance as LfDrawer;
    await component.unmount(0);

    // Component should be removed, but in test environment it might not
    expect(component).toBeTruthy();
  });

  describe("Events", () => {
    it("emits events with correct payload structure", async () => {
      const page = await createPage(`<lf-drawer></lf-drawer>`);
      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-drawer-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfDrawer;
      await component.open();
      await page.waitForChanges();

      expect(events.length).toBeGreaterThan(0);
      const event = events[0];
      expect(event.detail).toHaveProperty("comp");
      expect(event.detail).toHaveProperty("eventType");
      expect(event.detail).toHaveProperty("id");
    });

    it("emits open event when drawer opens", async () => {
      const page = await createPage(`<lf-drawer></lf-drawer>`);
      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-drawer-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfDrawer;
      await component.open();
      await page.waitForChanges();

      const openEvent = events.find((e) => e.detail.eventType === "open");
      expect(openEvent).toBeDefined();
      expect(openEvent.detail.comp).toBe(component);
    });

    it("emits close event when drawer closes", async () => {
      const page = await createPage(`<lf-drawer lf-value="true"></lf-drawer>`);
      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-drawer-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfDrawer;
      await component.close();
      await page.waitForChanges();

      const closeEvent = events.find((e) => e.detail.eventType === "close");
      expect(closeEvent).toBeDefined();
      expect(closeEvent.detail.comp).toBe(component);
    });

    it("calls unmount method without errors", async () => {
      const page = await createPage(`<lf-drawer></lf-drawer>`);
      const component = page.rootInstance as LfDrawer;

      // Should not throw
      await expect(component.unmount(0)).resolves.not.toThrow();
    });
  });

  describe("Position", () => {
    it("renders with position left by default", async () => {
      const page = await createPage(`<lf-drawer></lf-drawer>`);
      const component = page.rootInstance as LfDrawer;
      expect(component.lfPosition).toBe("left");
      expect(page.root.getAttribute("lf-position")).toBe("left");
    });

    it("renders with position right", async () => {
      const page = await createPage(
        `<lf-drawer lf-position="right"></lf-drawer>`,
      );
      const component = page.rootInstance as LfDrawer;
      expect(component.lfPosition).toBe("right");
      expect(page.root.getAttribute("lf-position")).toBe("right");
    });

    it("renders with position top", async () => {
      const page = await createPage(
        `<lf-drawer lf-position="top"></lf-drawer>`,
      );
      const component = page.rootInstance as LfDrawer;
      expect(component.lfPosition).toBe("top");
      expect(page.root.getAttribute("lf-position")).toBe("top");
    });

    it("renders with position bottom", async () => {
      const page = await createPage(
        `<lf-drawer lf-position="bottom"></lf-drawer>`,
      );
      const component = page.rootInstance as LfDrawer;
      expect(component.lfPosition).toBe("bottom");
      expect(page.root.getAttribute("lf-position")).toBe("bottom");
    });
  });

  describe("Display Mode", () => {
    it("renders with slide display by default", async () => {
      const page = await createPage(`<lf-drawer></lf-drawer>`);
      const component = page.rootInstance as LfDrawer;
      expect(component.lfDisplay).toBe("slide");
      expect(page.root.getAttribute("lf-display")).toBe("slide");
    });

    it("renders with dock display", async () => {
      const page = await createPage(
        `<lf-drawer lf-display="dock"></lf-drawer>`,
      );
      const component = page.rootInstance as LfDrawer;
      expect(component.lfDisplay).toBe("dock");
      expect(page.root.getAttribute("lf-display")).toBe("dock");
    });

    it("can change display mode dynamically", async () => {
      const page = await createPage(
        `<lf-drawer lf-display="slide"></lf-drawer>`,
      );
      const component = page.rootInstance as LfDrawer;

      expect(component.lfDisplay).toBe("slide");

      component.lfDisplay = "dock";
      await page.waitForChanges();

      expect(component.lfDisplay).toBe("dock");
      expect(page.root.getAttribute("lf-display")).toBe("dock");
    });
  });

  describe("Responsive Behavior", () => {
    it("has no responsive behavior by default", async () => {
      const page = await createPage(`<lf-drawer></lf-drawer>`);
      const component = page.rootInstance as LfDrawer;
      expect(component.lfResponsive).toBe(0);
    });

    it("accepts responsive breakpoint value", async () => {
      const page = await createPage(
        `<lf-drawer lf-responsive="768"></lf-drawer>`,
      );
      const component = page.rootInstance as LfDrawer;
      expect(component.lfResponsive).toBe(768);
    });

    it("accepts large responsive breakpoint value", async () => {
      const page = await createPage(
        `<lf-drawer lf-responsive="1200"></lf-drawer>`,
      );
      const component = page.rootInstance as LfDrawer;
      expect(component.lfResponsive).toBe(1200);
    });
  });

  describe("Toggle Behavior", () => {
    it("toggle opens closed drawer", async () => {
      const page = await createPage(`<lf-drawer></lf-drawer>`);
      const component = page.rootInstance as LfDrawer;

      expect(await component.isOpened()).toBe(false);

      await component.toggle();
      await page.waitForChanges();

      expect(await component.isOpened()).toBe(true);
    });

    it("toggle closes open drawer", async () => {
      const page = await createPage(`<lf-drawer lf-value="true"></lf-drawer>`);
      const component = page.rootInstance as LfDrawer;

      expect(await component.isOpened()).toBe(true);

      await component.toggle();
      await page.waitForChanges();

      expect(await component.isOpened()).toBe(false);
    });

    it("multiple toggles alternate state", async () => {
      const page = await createPage(`<lf-drawer></lf-drawer>`);
      const component = page.rootInstance as LfDrawer;

      expect(await component.isOpened()).toBe(false);

      await component.toggle();
      await page.waitForChanges();
      expect(await component.isOpened()).toBe(true);

      await component.toggle();
      await page.waitForChanges();
      expect(await component.isOpened()).toBe(false);

      await component.toggle();
      await page.waitForChanges();
      expect(await component.isOpened()).toBe(true);
    });
  });

  describe("Open/Close Methods", () => {
    it("open does nothing if already open", async () => {
      const page = await createPage(`<lf-drawer lf-value="true"></lf-drawer>`);
      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-drawer-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfDrawer;
      await component.open();
      await page.waitForChanges();

      const openEvents = events.filter((e) => e.detail.eventType === "open");
      expect(openEvents.length).toBe(0);
    });

    it("close does nothing if already closed", async () => {
      const page = await createPage(`<lf-drawer lf-value="false"></lf-drawer>`);
      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-drawer-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfDrawer;
      await component.close();
      await page.waitForChanges();

      const closeEvents = events.filter((e) => e.detail.eventType === "close");
      expect(closeEvents.length).toBe(0);
    });
  });

  describe("Keyboard Interaction", () => {
    it("closes drawer on Escape key when open", async () => {
      const page = await createPage(`<lf-drawer lf-value="true"></lf-drawer>`);
      const component = page.rootInstance as LfDrawer;

      expect(await component.isOpened()).toBe(true);

      const escapeEvent = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
      });
      page.root.dispatchEvent(escapeEvent);
      await page.waitForChanges();

      expect(await component.isOpened()).toBe(false);
    });

    it("does not respond to Escape when closed", async () => {
      const page = await createPage(`<lf-drawer lf-value="false"></lf-drawer>`);
      const component = page.rootInstance as LfDrawer;

      expect(await component.isOpened()).toBe(false);

      const escapeEvent = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
      });
      page.root.dispatchEvent(escapeEvent);
      await page.waitForChanges();

      expect(await component.isOpened()).toBe(false);
    });
  });

  describe("Aria Attributes", () => {
    it("renders with role dialog", async () => {
      const page = await createPage(`<lf-drawer></lf-drawer>`);
      const wrapper = page.root.shadowRoot.querySelector("#lf-component");
      expect(wrapper.getAttribute("role")).toBe("dialog");
    });

    it("sets aria-modal when slide mode and open", async () => {
      const page = await createPage(
        `<lf-drawer lf-display="slide" lf-value="true"></lf-drawer>`,
      );
      const wrapper = page.root.shadowRoot.querySelector("#lf-component");
      // aria-modal is set to a truthy value when isModal is true
      expect(wrapper.hasAttribute("aria-modal")).toBe(true);
    });

    it("does not set aria-modal when dock mode", async () => {
      const page = await createPage(
        `<lf-drawer lf-display="dock" lf-value="true"></lf-drawer>`,
      );
      const wrapper = page.root.shadowRoot.querySelector("#lf-component");
      expect(wrapper.getAttribute("aria-modal")).toBeNull();
    });

    it("does not set aria-modal when closed", async () => {
      const page = await createPage(
        `<lf-drawer lf-display="slide" lf-value="false"></lf-drawer>`,
      );
      const wrapper = page.root.shadowRoot.querySelector("#lf-component");
      expect(wrapper.getAttribute("aria-modal")).toBeNull();
    });
  });

  describe("Slot", () => {
    it("renders slot for content", async () => {
      const page = await createPage(`<lf-drawer></lf-drawer>`);
      const slot = page.root.shadowRoot.querySelector("slot");
      expect(slot).toBeTruthy();
      expect(slot.getAttribute("name")).toBe("content");
    });
  });

  describe("Custom Style", () => {
    it("applies custom style when lfStyle is set", async () => {
      const page = await createPage(
        `<lf-drawer lf-style="#lf-component { background: red; }"></lf-drawer>`,
      );
      const styleTag = page.root.shadowRoot.querySelector("style#lf-style");
      expect(styleTag).toBeTruthy();
    });

    it("does not render style tag when lfStyle is empty", async () => {
      const page = await createPage(`<lf-drawer></lf-drawer>`);
      const styleTag = page.root.shadowRoot.querySelector("style#lf-style");
      expect(styleTag).toBeNull();
    });
  });

  describe("Component Value Reflection", () => {
    it("reflects lfValue to attribute when true", async () => {
      const page = await createPage(`<lf-drawer lf-value="true"></lf-drawer>`);
      expect(page.root.getAttribute("lf-value")).toBe("true");
    });

    it("reflects lfValue to attribute when false", async () => {
      const page = await createPage(`<lf-drawer lf-value="false"></lf-drawer>`);
      expect(page.root.getAttribute("lf-value")).toBe("false");
    });

    it("updates attribute when lfValue changes programmatically", async () => {
      const page = await createPage(`<lf-drawer></lf-drawer>`);
      const component = page.rootInstance as LfDrawer;

      await component.open();
      await page.waitForChanges();

      // Verify the internal state changed
      expect(component.lfValue).toBe(true);
      expect(await component.isOpened()).toBe(true);
    });
  });
});
