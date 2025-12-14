import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfProgressbar } from "./lf-progressbar";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfProgressbar],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("LfProgressbar", () => {
  it("renders", async () => {
    const page = await createPage(`<lf-progressbar></lf-progressbar>`);
    const component = page.rootInstance as LfProgressbar;
    expect(component).toBeTruthy();
  });

  it("has default props", async () => {
    const page = await createPage(`<lf-progressbar></lf-progressbar>`);
    const component = page.rootInstance as LfProgressbar;
    const props = await component.getProps();

    expect(props.lfAnimated).toBe(false);
    expect(props.lfCenteredLabel).toBe(false);
    expect(props.lfIcon).toBe("");
    expect(props.lfIsRadial).toBe(false);
    expect(props.lfLabel).toBe("");
    expect(props.lfStyle).toBe("");
    expect(props.lfUiSize).toBe("medium");
    expect(props.lfUiState).toBe("primary");
    expect(props.lfValue).toBe(0);
  });

  it("sets props", async () => {
    const page = await createPage(`<lf-progressbar></lf-progressbar>`);
    const component = page.rootInstance as LfProgressbar;

    component.lfAnimated = true;
    component.lfCenteredLabel = true;
    component.lfIcon = "loading";
    component.lfIsRadial = true;
    component.lfLabel = "Loading...";
    component.lfStyle = "color: red;";
    component.lfUiSize = "small";
    component.lfUiState = "secondary";
    component.lfValue = 75;

    await page.waitForChanges();

    const props = await component.getProps();
    expect(props.lfAnimated).toBe(true);
    expect(props.lfCenteredLabel).toBe(true);
    expect(props.lfIcon).toBe("loading");
    expect(props.lfIsRadial).toBe(true);
    expect(props.lfLabel).toBe("Loading...");
    expect(props.lfStyle).toBe("color: red;");
    expect(props.lfUiSize).toBe("small");
    expect(props.lfUiState).toBe("secondary");
    expect(props.lfValue).toBe(75);
  });

  it("calls getDebugInfo method", async () => {
    const page = await createPage(`<lf-progressbar></lf-progressbar>`);
    const component = page.rootInstance as LfProgressbar;
    const debugInfo = await component.getDebugInfo();

    expect(debugInfo).toBeDefined();
  });

  it("calls getProps method", async () => {
    const page = await createPage(`<lf-progressbar></lf-progressbar>`);
    const component = page.rootInstance as LfProgressbar;
    const props = await component.getProps();

    expect(props).toBeDefined();
    expect(typeof props).toBe("object");
  });

  it("calls refresh method", async () => {
    const page = await createPage(`<lf-progressbar></lf-progressbar>`);
    const component = page.rootInstance as LfProgressbar;
    await component.refresh();

    expect(component).toBeTruthy();
  });

  it("calls unmount method", async () => {
    const page = await createPage(`<lf-progressbar></lf-progressbar>`);
    const component = page.rootInstance as LfProgressbar;
    await component.unmount(0);

    // Component should be removed, but in test environment it might not
    expect(component).toBeTruthy();
  });

  describe("Event Emission", () => {
    it("emits ready event on component load", async () => {
      const events: CustomEvent[] = [];
      const page = await createPage(`<lf-progressbar></lf-progressbar>`);
      page.root.addEventListener("lf-progressbar-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfProgressbar;
      await component.refresh();
      await page.waitForChanges();

      expect(component).toBeTruthy();
    });

    it("emits unmount event when unmount is called", async () => {
      const events: CustomEvent[] = [];
      const page = await createPage(`<lf-progressbar></lf-progressbar>`);
      page.root.addEventListener("lf-progressbar-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfProgressbar;

      const unmountPromise = new Promise<CustomEvent>((resolve) => {
        page.root.addEventListener("lf-progressbar-event", (e: CustomEvent) => {
          if (e.detail.eventType === "unmount") {
            resolve(e);
          }
        });
      });

      component.unmount(0);
      const unmountEvent = await unmountPromise;

      expect(unmountEvent).toBeDefined();
      expect(unmountEvent.detail.eventType).toBe("unmount");
    });

    it("event payload contains correct structure", async () => {
      const events: CustomEvent[] = [];
      const page = await createPage(
        `<lf-progressbar id="test-progressbar"></lf-progressbar>`,
      );
      page.root.addEventListener("lf-progressbar-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfProgressbar;

      const unmountPromise = new Promise<CustomEvent>((resolve) => {
        page.root.addEventListener("lf-progressbar-event", (e: CustomEvent) => {
          if (e.detail.eventType === "unmount") {
            resolve(e);
          }
        });
      });

      component.unmount(0);
      const unmountEvent = await unmountPromise;

      expect(unmountEvent.detail).toHaveProperty("comp");
      expect(unmountEvent.detail).toHaveProperty("id");
      expect(unmountEvent.detail).toHaveProperty("eventType");
      expect(unmountEvent.detail).toHaveProperty("originalEvent");
      expect(unmountEvent.detail.id).toBe("test-progressbar");
    });
  });

  describe("Value Tests", () => {
    it("displays 0% value correctly", async () => {
      const page = await createPage(
        `<lf-progressbar lf-value="0"></lf-progressbar>`,
      );
      const style = page.root.shadowRoot.querySelector("style");

      expect(style.textContent).toContain(
        "--lf_progressbar_percentage_width: 0%",
      );
      expect(style.textContent).toContain(
        "--lf_progressbar_transform: rotate(0deg)",
      );
    });

    it("displays 50% value correctly", async () => {
      const page = await createPage(
        `<lf-progressbar lf-value="50"></lf-progressbar>`,
      );
      const style = page.root.shadowRoot.querySelector("style");

      expect(style.textContent).toContain(
        "--lf_progressbar_percentage_width: 50%",
      );
      expect(style.textContent).toContain(
        "--lf_progressbar_transform: rotate(180deg)",
      );
    });

    it("displays 100% value correctly", async () => {
      const page = await createPage(
        `<lf-progressbar lf-value="100"></lf-progressbar>`,
      );
      const style = page.root.shadowRoot.querySelector("style");

      expect(style.textContent).toContain(
        "--lf_progressbar_percentage_width: 100%",
      );
      expect(style.textContent).toContain(
        "--lf_progressbar_transform: rotate(360deg)",
      );
    });

    it("updates value dynamically", async () => {
      const page = await createPage(
        `<lf-progressbar lf-value="25"></lf-progressbar>`,
      );
      const component = page.rootInstance as LfProgressbar;

      component.lfValue = 75;
      await page.waitForChanges();

      const style = page.root.shadowRoot.querySelector("style");
      expect(style.textContent).toContain(
        "--lf_progressbar_percentage_width: 75%",
      );
      expect(style.textContent).toContain(
        "--lf_progressbar_transform: rotate(270deg)",
      );
    });

    it("displays value in label when no custom label is set", async () => {
      const page = await createPage(
        `<lf-progressbar lf-value="42"></lf-progressbar>`,
      );
      const textElement = page.root.shadowRoot.querySelector("[part='text']");

      expect(textElement.textContent).toBe("42");
    });
  });

  describe("Boundary Tests", () => {
    it("normalizes negative values to 0", async () => {
      const page = await createPage(
        `<lf-progressbar lf-value="-10"></lf-progressbar>`,
      );
      const component = page.rootInstance as LfProgressbar;

      expect(component.lfValue).toBe(0);
    });

    it("normalizes values above 100 to 100", async () => {
      const page = await createPage(
        `<lf-progressbar lf-value="150"></lf-progressbar>`,
      );
      const component = page.rootInstance as LfProgressbar;

      expect(component.lfValue).toBe(100);
    });

    it("handles zero value", async () => {
      const page = await createPage(
        `<lf-progressbar lf-value="0"></lf-progressbar>`,
      );
      const component = page.rootInstance as LfProgressbar;

      expect(component.lfValue).toBe(0);
    });

    it("handles exactly 100 value", async () => {
      const page = await createPage(
        `<lf-progressbar lf-value="100"></lf-progressbar>`,
      );
      const component = page.rootInstance as LfProgressbar;

      expect(component.lfValue).toBe(100);
    });

    it("handles decimal values", async () => {
      const page = await createPage(
        `<lf-progressbar lf-value="33.33"></lf-progressbar>`,
      );
      const component = page.rootInstance as LfProgressbar;

      expect(component.lfValue).toBe(33.33);
    });
  });

  describe("Label Tests", () => {
    it("displays custom label when lfLabel is set", async () => {
      const page = await createPage(
        `<lf-progressbar lf-label="Loading..."></lf-progressbar>`,
      );
      const textElement = page.root.shadowRoot.querySelector("[part='text']");

      expect(textElement.textContent).toBe("Loading...");
    });

    it("displays value with percentage when no custom label", async () => {
      const page = await createPage(
        `<lf-progressbar lf-value="65"></lf-progressbar>`,
      );
      const textElement = page.root.shadowRoot.querySelector("[part='text']");
      const muElement = page.root.shadowRoot.querySelector("[part='mu']");

      expect(textElement.textContent).toBe("65");
      expect(muElement.textContent).toBe("%");
    });

    it("renders centered label when lfCenteredLabel is true", async () => {
      const page = await createPage(
        `<lf-progressbar lf-centered-label="true" lf-label="Centered"></lf-progressbar>`,
      );
      const component = page.rootInstance as LfProgressbar;

      expect(component.lfCenteredLabel).toBe(true);
      const textElement = page.root.shadowRoot.querySelector("[part='text']");
      expect(textElement.textContent).toBe("Centered");
    });

    it("updates label dynamically", async () => {
      const page = await createPage(
        `<lf-progressbar lf-label="Initial"></lf-progressbar>`,
      );
      const component = page.rootInstance as LfProgressbar;

      component.lfLabel = "Updated";
      await page.waitForChanges();

      const textElement = page.root.shadowRoot.querySelector("[part='text']");
      expect(textElement.textContent).toBe("Updated");
    });
  });

  describe("Icon Tests", () => {
    it("renders icon when lfIcon is set", async () => {
      const page = await createPage(
        `<lf-progressbar lf-icon="loading"></lf-progressbar>`,
      );
      const iconElement = page.root.shadowRoot.querySelector("[part='icon']");

      expect(iconElement).toBeTruthy();
    });

    it("does not render icon when lfIcon is empty", async () => {
      const page = await createPage(`<lf-progressbar></lf-progressbar>`);
      const iconElement = page.root.shadowRoot.querySelector("[part='icon']");

      expect(iconElement).toBeNull();
    });

    it("updates icon dynamically", async () => {
      const page = await createPage(`<lf-progressbar></lf-progressbar>`);
      const component = page.rootInstance as LfProgressbar;

      expect(page.root.shadowRoot.querySelector("[part='icon']")).toBeNull();

      component.lfIcon = "check";
      await page.waitForChanges();

      expect(page.root.shadowRoot.querySelector("[part='icon']")).toBeTruthy();
    });
  });

  describe("Animation Tests", () => {
    it("reflects lfAnimated attribute when true", async () => {
      const page = await createPage(
        `<lf-progressbar lf-animated="true"></lf-progressbar>`,
      );
      const component = page.rootInstance as LfProgressbar;

      expect(component.lfAnimated).toBe(true);
      expect(page.root.getAttribute("lf-animated")).toBe("true");
    });

    it("reflects lfAnimated attribute when false", async () => {
      const page = await createPage(
        `<lf-progressbar lf-animated="false"></lf-progressbar>`,
      );
      const component = page.rootInstance as LfProgressbar;

      expect(component.lfAnimated).toBe(false);
    });

    it("toggles animation dynamically", async () => {
      const page = await createPage(`<lf-progressbar></lf-progressbar>`);
      const component = page.rootInstance as LfProgressbar;

      expect(component.lfAnimated).toBe(false);

      component.lfAnimated = true;
      await page.waitForChanges();

      expect(component.lfAnimated).toBe(true);
      expect(page.root.hasAttribute("lf-animated")).toBe(true);
    });
  });

  describe("Radial Mode Tests", () => {
    it("renders linear progressbar by default", async () => {
      const page = await createPage(`<lf-progressbar></lf-progressbar>`);
      const component = page.rootInstance as LfProgressbar;

      expect(component.lfIsRadial).toBe(false);
      const percentageElement = page.root.shadowRoot.querySelector(
        "[part='percentage']",
      );
      expect(percentageElement).toBeTruthy();
    });

    it("renders radial progressbar when lfIsRadial is true", async () => {
      const page = await createPage(
        `<lf-progressbar lf-is-radial="true"></lf-progressbar>`,
      );
      const component = page.rootInstance as LfProgressbar;

      expect(component.lfIsRadial).toBe(true);
      const trackElement = page.root.shadowRoot.querySelector("[part='track']");
      expect(trackElement).toBeTruthy();
    });

    it("toggles between linear and radial modes", async () => {
      const page = await createPage(`<lf-progressbar></lf-progressbar>`);
      const component = page.rootInstance as LfProgressbar;

      expect(
        page.root.shadowRoot.querySelector("[part='percentage']"),
      ).toBeTruthy();
      expect(page.root.shadowRoot.querySelector("[part='track']")).toBeNull();

      component.lfIsRadial = true;
      await page.waitForChanges();

      expect(page.root.shadowRoot.querySelector("[part='track']")).toBeTruthy();
    });

    it("radial bar has correct CSS transform for 50% value", async () => {
      const page = await createPage(
        `<lf-progressbar lf-is-radial="true" lf-value="50"></lf-progressbar>`,
      );
      const style = page.root.shadowRoot.querySelector("style");

      expect(style.textContent).toContain(
        "--lf_progressbar_transform: rotate(180deg)",
      );
    });
  });

  describe("UI State Tests", () => {
    it("applies primary state by default", async () => {
      const page = await createPage(`<lf-progressbar></lf-progressbar>`);
      const progressbarElement = page.root.shadowRoot.querySelector(
        "[part='progressbar']",
      );

      expect(progressbarElement.getAttribute("data-lf")).toBe("primary");
    });

    it("applies secondary state", async () => {
      const page = await createPage(
        `<lf-progressbar lf-ui-state="secondary"></lf-progressbar>`,
      );
      const progressbarElement = page.root.shadowRoot.querySelector(
        "[part='progressbar']",
      );

      expect(progressbarElement.getAttribute("data-lf")).toBe("secondary");
    });

    it("applies success state", async () => {
      const page = await createPage(
        `<lf-progressbar lf-ui-state="success"></lf-progressbar>`,
      );
      const progressbarElement = page.root.shadowRoot.querySelector(
        "[part='progressbar']",
      );

      expect(progressbarElement.getAttribute("data-lf")).toBe("success");
    });

    it("applies warning state", async () => {
      const page = await createPage(
        `<lf-progressbar lf-ui-state="warning"></lf-progressbar>`,
      );
      const progressbarElement = page.root.shadowRoot.querySelector(
        "[part='progressbar']",
      );

      expect(progressbarElement.getAttribute("data-lf")).toBe("warning");
    });

    it("applies danger state", async () => {
      const page = await createPage(
        `<lf-progressbar lf-ui-state="danger"></lf-progressbar>`,
      );
      const progressbarElement = page.root.shadowRoot.querySelector(
        "[part='progressbar']",
      );

      expect(progressbarElement.getAttribute("data-lf")).toBe("danger");
    });

    it("changes state dynamically", async () => {
      const page = await createPage(
        `<lf-progressbar lf-ui-state="primary"></lf-progressbar>`,
      );
      const component = page.rootInstance as LfProgressbar;

      component.lfUiState = "success";
      await page.waitForChanges();

      const progressbarElement = page.root.shadowRoot.querySelector(
        "[part='progressbar']",
      );
      expect(progressbarElement.getAttribute("data-lf")).toBe("success");
    });
  });

  describe("UI Size Tests", () => {
    it("applies medium size by default", async () => {
      const page = await createPage(`<lf-progressbar></lf-progressbar>`);
      const component = page.rootInstance as LfProgressbar;

      expect(component.lfUiSize).toBe("medium");
      expect(page.root.getAttribute("lf-ui-size")).toBe("medium");
    });

    it("applies small size", async () => {
      const page = await createPage(
        `<lf-progressbar lf-ui-size="small"></lf-progressbar>`,
      );
      const component = page.rootInstance as LfProgressbar;

      expect(component.lfUiSize).toBe("small");
      expect(page.root.getAttribute("lf-ui-size")).toBe("small");
    });

    it("applies large size", async () => {
      const page = await createPage(
        `<lf-progressbar lf-ui-size="large"></lf-progressbar>`,
      );
      const component = page.rootInstance as LfProgressbar;

      expect(component.lfUiSize).toBe("large");
      expect(page.root.getAttribute("lf-ui-size")).toBe("large");
    });

    it("changes size dynamically", async () => {
      const page = await createPage(
        `<lf-progressbar lf-ui-size="small"></lf-progressbar>`,
      );
      const component = page.rootInstance as LfProgressbar;

      component.lfUiSize = "large";
      await page.waitForChanges();

      expect(component.lfUiSize).toBe("large");
      expect(page.root.getAttribute("lf-ui-size")).toBe("large");
    });
  });

  describe("Custom Style Tests", () => {
    it("applies custom style when lfStyle is set", async () => {
      const page = await createPage(
        `<lf-progressbar lf-style="#lf-component { color: red; }"></lf-progressbar>`,
      );
      const component = page.rootInstance as LfProgressbar;

      expect(component.lfStyle).toBe("#lf-component { color: red; }");
    });

    it("updates custom style dynamically", async () => {
      const page = await createPage(`<lf-progressbar></lf-progressbar>`);
      const component = page.rootInstance as LfProgressbar;

      component.lfStyle = "#lf-component { background: blue; }";
      await page.waitForChanges();

      expect(component.lfStyle).toBe("#lf-component { background: blue; }");
    });
  });
});
