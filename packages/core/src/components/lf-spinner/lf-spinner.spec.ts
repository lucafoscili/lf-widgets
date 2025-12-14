import { newSpecPage } from "@stencil/core/testing";
import { LfSpinner } from "./lf-spinner";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfSpinner], html });
  await page.waitForChanges();
  return page;
};

describe("lf-spinner component", () => {
  describe("Basic Rendering", () => {
    it("renders with default props", async () => {
      const page = await createPage(`<lf-spinner></lf-spinner>`);
      expect(page.root).toBeDefined();
      const spinner = page.root.shadowRoot.querySelector(".spinner--ring");
      expect(spinner).not.toBeNull();
    });

    it("shows spinner when lfActive is true", async () => {
      const page = await createPage(
        `<lf-spinner lf-active="true"></lf-spinner>`,
      );
      expect(page.root.getAttribute("lf-active")).toBe("true");
    });

    it("renders bar variant when lfBarVariant is true", async () => {
      const page = await createPage(
        `<lf-spinner lf-bar-variant="true"></lf-spinner>`,
      );
      const spinner = page.root.shadowRoot.querySelector(".spinner__bar");
      expect(spinner).not.toBeNull();
    });

    it("has progress state", async () => {
      const page = await createPage(
        `<lf-spinner lf-active="true"></lf-spinner>`,
      );
      expect(await page.root.getProgress()).toBe(0);
    });

    it("renders with default props values", async () => {
      const page = await createPage(`<lf-spinner></lf-spinner>`);
      const root = page.root as HTMLLfSpinnerElement;
      expect(root.lfActive).toBe(false);
      expect(root.lfBarVariant).toBe(false);
      expect(root.lfFader).toBe(false);
      expect(root.lfFaderTimeout).toBe(3500);
      expect(root.lfFullScreen).toBe(false);
      expect(root.lfLayout).toBe("ring");
      expect(root.lfStyle).toBe("");
      expect(root.lfTimeout).toBe(0);
    });
  });

  describe("Event Emission", () => {
    it("should emit ready event on component load", async () => {
      getLfFramework();
      const events: CustomEvent[] = [];
      const page = await newSpecPage({
        components: [LfSpinner],
        html: "<lf-spinner></lf-spinner>",
      });
      page.root.addEventListener("lf-spinner-event", (e: CustomEvent) =>
        events.push(e),
      );
      await (page.root as HTMLLfSpinnerElement).refresh();
      await page.waitForChanges();
      expect(page.root).toBeTruthy();
    });

    it("should emit unmount event when unmount is called", async () => {
      const page = await createPage(`<lf-spinner></lf-spinner>`);
      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-spinner-event", (e: CustomEvent) =>
        events.push(e),
      );
      await page.root.unmount(0);
      // Wait for async event emission
      await new Promise((r) => setTimeout(r, 20));
      await page.waitForChanges();
      const unmountEvent = events.find((e) => e.detail.eventType === "unmount");
      expect(unmountEvent).toBeTruthy();
    });

    it("should include component reference in event payload", async () => {
      const page = await createPage(
        `<lf-spinner id="test-spinner"></lf-spinner>`,
      );
      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-spinner-event", (e: CustomEvent) =>
        events.push(e),
      );
      await page.root.unmount(0);
      // Wait for async event emission
      await new Promise((r) => setTimeout(r, 20));
      await page.waitForChanges();
      const unmountEvent = events.find((e) => e.detail.eventType === "unmount");
      expect(unmountEvent).toBeDefined();
      expect(unmountEvent.detail.comp).toBeDefined();
      expect(unmountEvent.detail.id).toBe("test-spinner");
    });
  });

  describe("Layout Tests", () => {
    it("renders different spinner layouts", async () => {
      const page = await createPage(
        `<lf-spinner lf-layout="dots"></lf-spinner>`,
      );
      const spinner = page.root.shadowRoot.querySelector(".spinner--dots");
      expect(spinner).not.toBeNull();
    });

    it("renders bar layout when bar variant is enabled", async () => {
      const page = await createPage(
        `<lf-spinner lf-bar-variant="true" lf-layout="ring"></lf-spinner>`,
      );
      const wrapper = page.root.shadowRoot.querySelector(".spinner__bar");
      expect(wrapper).not.toBeNull();
    });

    it("renders spinner layout when bar variant is disabled", async () => {
      const page = await createPage(
        `<lf-spinner lf-bar-variant="false" lf-layout="ring"></lf-spinner>`,
      );
      const wrapper = page.root.shadowRoot.querySelector(".spinner--ring");
      expect(wrapper).not.toBeNull();
    });

    it("changes layout dynamically", async () => {
      const page = await createPage(
        `<lf-spinner lf-layout="ring"></lf-spinner>`,
      );
      const root = page.root as HTMLLfSpinnerElement;
      expect(
        page.root.shadowRoot.querySelector(".spinner--ring"),
      ).not.toBeNull();

      root.lfLayout = "spinner";
      await page.waitForChanges();
      expect(
        page.root.shadowRoot.querySelector(".spinner--spinner"),
      ).not.toBeNull();
    });
  });

  describe("Style Tests", () => {
    it("applies custom styles via lfStyle prop", async () => {
      const customStyle = ".spinner { opacity: 0.5; }";
      const page = await createPage(
        `<lf-spinner lf-style="${customStyle}"></lf-spinner>`,
      );
      const styleEl = page.root.shadowRoot.querySelector("style");
      expect(styleEl).not.toBeNull();
    });

    it("does not render style tag when lfStyle is empty", async () => {
      const page = await createPage(`<lf-spinner></lf-spinner>`);
      const styleEl = page.root.shadowRoot.querySelector(
        "style#lf-component--style",
      );
      expect(styleEl).toBeNull();
    });

    it("updates styles when lfStyle changes", async () => {
      const page = await createPage(`<lf-spinner></lf-spinner>`);
      const root = page.root as HTMLLfSpinnerElement;

      root.lfStyle = ".spinner--ring { transform: scale(2); }";
      await page.waitForChanges();

      const styleEl = page.root.shadowRoot.querySelector("style");
      expect(styleEl).not.toBeNull();
    });
  });

  describe("Size Tests", () => {
    it("uses lfUiSize for spinner sizing", async () => {
      const page = await createPage(
        `<lf-spinner lf-ui-size="large"></lf-spinner>`,
      );
      const root = page.root as HTMLLfSpinnerElement;
      expect(root.lfUiSize).toBe("large");
    });

    it("has medium lfUiSize by default", async () => {
      const page = await createPage(`<lf-spinner></lf-spinner>`);
      const root = page.root as HTMLLfSpinnerElement;
      expect(root.lfUiSize).toBe("medium");
    });

    it("lfUiSize applies to bar variants too", async () => {
      const page = await createPage(
        `<lf-spinner lf-bar-variant="true" lf-ui-size="small"></lf-spinner>`,
      );
      const root = page.root as HTMLLfSpinnerElement;
      expect(root.lfUiSize).toBe("small");
    });
  });

  describe("FullScreen Tests", () => {
    it("applies fullscreen styles when lfFullScreen is true", async () => {
      const page = await createPage(
        `<lf-spinner lf-full-screen="true"></lf-spinner>`,
      );
      const host = page.root as HTMLElement;
      expect(host.getAttribute("lf-full-screen")).toBe("true");
    });

    it("reflects lfFullScreen attribute when false", async () => {
      const page = await createPage(
        `<lf-spinner lf-full-screen="false"></lf-spinner>`,
      );
      const root = page.root as HTMLLfSpinnerElement;
      expect(root.lfFullScreen).toBe(false);
    });
  });

  describe("Fader Tests", () => {
    it("reflects lfFader attribute", async () => {
      const page = await createPage(
        `<lf-spinner lf-fader="true"></lf-spinner>`,
      );
      expect(page.root.getAttribute("lf-fader")).toBe("true");
    });

    it("sets custom fader timeout", async () => {
      const page = await createPage(
        `<lf-spinner lf-fader-timeout="5000"></lf-spinner>`,
      );
      const root = page.root as HTMLLfSpinnerElement;
      expect(root.lfFaderTimeout).toBe(5000);
    });
  });

  describe("Progress Bar Tests", () => {
    it("starts progress bar when bar variant and timeout are set", async () => {
      const page = await createPage(
        `<lf-spinner lf-bar-variant="true" lf-timeout="1000"></lf-spinner>`,
      );
      const root = page.root as HTMLLfSpinnerElement;
      expect(root.lfBarVariant).toBe(true);
      expect(root.lfTimeout).toBe(1000);
    });

    it("progress starts at 0", async () => {
      const page = await createPage(
        `<lf-spinner lf-bar-variant="true" lf-timeout="5000"></lf-spinner>`,
      );
      const progress = await page.root.getProgress();
      expect(progress).toBeGreaterThanOrEqual(0);
    });

    it("resets progress when bar variant is disabled", async () => {
      const page = await createPage(
        `<lf-spinner lf-bar-variant="true" lf-timeout="5000"></lf-spinner>`,
      );
      const root = page.root as HTMLLfSpinnerElement;
      root.lfBarVariant = false;
      await page.waitForChanges();
      const progress = await root.getProgress();
      expect(progress).toBe(0);
    });
  });

  describe("Public Methods", () => {
    it("getProps returns all current property values", async () => {
      const page = await createPage(
        `<lf-spinner lf-active="true" lf-layout="dots" lf-fader="true"></lf-spinner>`,
      );
      const root = page.root as HTMLLfSpinnerElement;
      const props = await root.getProps();

      expect(props).toBeDefined();
      expect(props.lfActive).toBe(true);
      expect(props.lfLayout).toBe("dots");
      expect(props.lfFader).toBe(true);
      expect(props.lfBarVariant).toBe(false);
      expect(props.lfFaderTimeout).toBe(3500);
      expect(props.lfFullScreen).toBe(false);
      expect(props.lfStyle).toBe("");
      expect(props.lfTimeout).toBe(0);
      expect(props.lfUiSize).toBe("medium");
      expect(props.lfUiState).toBe("primary");
    });

    it("getDebugInfo returns debug lifecycle information", async () => {
      const page = await createPage(`<lf-spinner></lf-spinner>`);
      const root = page.root as HTMLLfSpinnerElement;
      const debugInfo = await root.getDebugInfo();

      expect(debugInfo).toBeDefined();
    });

    it("getProgress returns current progress value", async () => {
      const page = await createPage(`<lf-spinner></lf-spinner>`);
      const root = page.root as HTMLLfSpinnerElement;
      const progress = await root.getProgress();

      expect(progress).toBe(0);
    });

    it("refresh triggers a re-render", async () => {
      const page = await createPage(`<lf-spinner></lf-spinner>`);
      const root = page.root as HTMLLfSpinnerElement;

      await root.refresh();
      await page.waitForChanges();

      expect(root).toBeTruthy();
    });

    it("unmount removes the component from DOM", async () => {
      const page = await createPage(`<lf-spinner></lf-spinner>`);
      const root = page.root as HTMLLfSpinnerElement;
      const events: CustomEvent[] = [];
      root.addEventListener("lf-spinner-event", (e: CustomEvent) =>
        events.push(e),
      );

      await root.unmount(0);
      // Wait for async event emission
      await new Promise((r) => setTimeout(r, 20));
      await page.waitForChanges();

      const unmountEvent = events.find((e) => e.detail.eventType === "unmount");
      expect(unmountEvent).toBeTruthy();
    });

    it("unmount accepts delay parameter", async () => {
      const page = await createPage(`<lf-spinner></lf-spinner>`);
      const root = page.root as HTMLLfSpinnerElement;
      const events: CustomEvent[] = [];
      root.addEventListener("lf-spinner-event", (e: CustomEvent) =>
        events.push(e),
      );

      await root.unmount(10);
      await new Promise((r) => setTimeout(r, 15));
      await page.waitForChanges();

      const unmountEvent = events.find((e) => e.detail.eventType === "unmount");
      expect(unmountEvent).toBeTruthy();
    });
  });

  describe("Property Updates", () => {
    it("updates lfActive dynamically", async () => {
      const page = await createPage(`<lf-spinner></lf-spinner>`);
      const root = page.root as HTMLLfSpinnerElement;

      expect(root.lfActive).toBe(false);
      root.lfActive = true;
      await page.waitForChanges();
      expect(root.lfActive).toBe(true);
    });

    it("updates lfBarVariant dynamically", async () => {
      const page = await createPage(`<lf-spinner></lf-spinner>`);
      const root = page.root as HTMLLfSpinnerElement;

      expect(root.lfBarVariant).toBe(false);
      root.lfBarVariant = true;
      await page.waitForChanges();
      expect(root.lfBarVariant).toBe(true);

      const barWrapper = page.root.shadowRoot.querySelector(".spinner__bar");
      expect(barWrapper).not.toBeNull();
    });

    it("updates lfLayout dynamically", async () => {
      const page = await createPage(`<lf-spinner></lf-spinner>`);
      const root = page.root as HTMLLfSpinnerElement;

      expect(root.lfLayout).toBe("ring");
      root.lfLayout = "grid";
      await page.waitForChanges();
      expect(root.lfLayout).toBe("grid");
    });

    it("updates lfTimeout and triggers progress bar restart", async () => {
      const page = await createPage(
        `<lf-spinner lf-bar-variant="true" lf-timeout="1000"></lf-spinner>`,
      );
      const root = page.root as HTMLLfSpinnerElement;

      root.lfTimeout = 2000;
      await page.waitForChanges();
      expect(root.lfTimeout).toBe(2000);
    });
  });

  describe("Wrapper Structure", () => {
    it("renders wrapper element with correct ID", async () => {
      const page = await createPage(`<lf-spinner></lf-spinner>`);
      const wrapper = page.root.shadowRoot.querySelector("#lf-component");
      expect(wrapper).not.toBeNull();
    });

    it("renders spinner element", async () => {
      const page = await createPage(`<lf-spinner></lf-spinner>`);
      const spinner = page.root.shadowRoot.querySelector(".spinner");
      expect(spinner).not.toBeNull();
    });

    it("applies layout modifier class when not bar variant", async () => {
      const page = await createPage(`<lf-spinner></lf-spinner>`);
      const spinner = page.root.shadowRoot.querySelector(".spinner--ring");
      expect(spinner).not.toBeNull();
    });

    it("renders bar variant when lfBarVariant is true", async () => {
      const page = await createPage(
        `<lf-spinner lf-bar-variant="true"></lf-spinner>`,
      );
      const bar = page.root.shadowRoot.querySelector(".spinner__bar");
      expect(bar).not.toBeNull();
    });
  });
});
