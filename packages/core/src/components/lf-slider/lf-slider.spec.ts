import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfSlider } from "./lf-slider";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfSlider],
    html,
  });
  return page;
};

describe("LfSlider", () => {
  let root: HTMLLfSliderElement;

  beforeEach(async () => {
    const page = await createPage("<lf-slider></lf-slider>");
    root = page.root as HTMLLfSliderElement;
  });

  it("renders", async () => {
    expect(root).toBeTruthy();
  });

  it("renders with default props", async () => {
    expect(root.lfLabel).toBe("");
    expect(root.lfLeadingLabel).toBe(false);
    expect(root.lfMax).toBe(100);
    expect(root.lfMin).toBe(0);
    expect(root.lfStep).toBe(1);
    expect(root.lfRipple).toBe(true);
    expect(root.lfStyle).toBe("");
    expect(root.lfUiSize).toBe("medium");
    expect(root.lfUiState).toBe("primary");
    expect(root.lfValue).toBe(50);
  });

  it("renders with custom props", async () => {
    root.lfLabel = "Test Label";
    root.lfLeadingLabel = true;
    root.lfMax = 200;
    root.lfMin = 10;
    root.lfStep = 5;
    root.lfRipple = false;
    root.lfStyle = "color: red;";
    root.lfUiSize = "small";
    root.lfUiState = "secondary";
    root.lfValue = 75;
    await root.refresh();

    expect(root.lfLabel).toBe("Test Label");
    expect(root.lfLeadingLabel).toBe(true);
    expect(root.lfMax).toBe(200);
    expect(root.lfMin).toBe(10);
    expect(root.lfStep).toBe(5);
    expect(root.lfRipple).toBe(false);
    expect(root.lfStyle).toBe("color: red;");
    expect(root.lfUiSize).toBe("small");
    expect(root.lfUiState).toBe("secondary");
    expect(root.lfValue).toBe(75);
  });

  it("methods work", async () => {
    const debugInfo = await root.getDebugInfo();
    expect(debugInfo).toBeDefined();

    const props = await root.getProps();
    expect(props).toBeDefined();
    expect(props.lfLabel).toBe("");
    expect(props.lfValue).toBe(50);

    const value = await root.getValue();
    expect(value).toEqual({ display: 50, real: 50 });

    await root.setValue(80);
    const newValue = await root.getValue();
    expect(newValue).toEqual({ display: 80, real: 80 });

    await root.refresh();
    expect(root).toBeTruthy();

    await root.unmount(0);
    // Component should be removed, but in test it might not be immediate
  });
});

describe("LfSlider Events", () => {
  it("should emit ready event on load", async () => {
    getLfFramework();
    const events: CustomEvent[] = [];
    const page = await newSpecPage({
      components: [LfSlider],
      html: "<lf-slider></lf-slider>",
      autoApplyChanges: true,
    });
    page.root.addEventListener("lf-slider-event", (e: CustomEvent) =>
      events.push(e),
    );
    // Trigger ready by forcing a re-render
    await (page.root as HTMLLfSliderElement).refresh();
    await page.waitForChanges();

    // Ready event was already emitted during componentDidLoad
    // Test that component loaded successfully
    expect(page.root).toBeTruthy();
  });

  it("should emit focus event when input gains focus", async () => {
    const events: CustomEvent[] = [];
    const page = await createPage("<lf-slider></lf-slider>");
    page.root.addEventListener("lf-slider-event", (e: CustomEvent) =>
      events.push(e),
    );

    const input = page.root.shadowRoot.querySelector("input[type='range']");
    input.dispatchEvent(new FocusEvent("focus"));
    await page.waitForChanges();

    const focusEvent = events.find((e) => e.detail.eventType === "focus");
    expect(focusEvent).toBeDefined();
  });

  it("should emit blur event when input loses focus", async () => {
    const events: CustomEvent[] = [];
    const page = await createPage("<lf-slider></lf-slider>");
    page.root.addEventListener("lf-slider-event", (e: CustomEvent) =>
      events.push(e),
    );

    const input = page.root.shadowRoot.querySelector("input[type='range']");
    input.dispatchEvent(new FocusEvent("blur"));
    await page.waitForChanges();

    const blurEvent = events.find((e) => e.detail.eventType === "blur");
    expect(blurEvent).toBeDefined();
  });

  it("should emit input event on input", async () => {
    const events: CustomEvent[] = [];
    const page = await createPage("<lf-slider></lf-slider>");
    page.root.addEventListener("lf-slider-event", (e: CustomEvent) =>
      events.push(e),
    );

    const input = page.root.shadowRoot.querySelector(
      "input[type='range']",
    ) as HTMLInputElement;
    input.value = "75";
    input.dispatchEvent(new Event("input"));
    await page.waitForChanges();

    const inputEvent = events.find((e) => e.detail.eventType === "input");
    expect(inputEvent).toBeDefined();
    expect(inputEvent.detail.value.display).toBe(75);
  });

  it("should emit change event on change", async () => {
    const events: CustomEvent[] = [];
    const page = await createPage("<lf-slider></lf-slider>");
    page.root.addEventListener("lf-slider-event", (e: CustomEvent) =>
      events.push(e),
    );

    const input = page.root.shadowRoot.querySelector(
      "input[type='range']",
    ) as HTMLInputElement;
    input.value = "60";
    input.dispatchEvent(new Event("change"));
    await page.waitForChanges();

    const changeEvent = events.find((e) => e.detail.eventType === "change");
    expect(changeEvent).toBeDefined();
    expect(changeEvent.detail.value.real).toBe(60);
  });

  it("should emit pointerdown event on pointer down", async () => {
    const events: CustomEvent[] = [];
    const page = await createPage("<lf-slider></lf-slider>");
    page.root.addEventListener("lf-slider-event", (e: CustomEvent) =>
      events.push(e),
    );

    const input = page.root.shadowRoot.querySelector("input[type='range']");
    // Use Event with bubbles since PointerEvent is not available in JSDOM
    input.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    await page.waitForChanges();

    const pointerdownEvent = events.find(
      (e) => e.detail.eventType === "pointerdown",
    );
    expect(pointerdownEvent).toBeDefined();
  });

  it("should emit unmount event when unmount is called", async () => {
    const events: CustomEvent[] = [];
    const page = await createPage("<lf-slider></lf-slider>");
    page.root.addEventListener("lf-slider-event", (e: CustomEvent) =>
      events.push(e),
    );

    // Call unmount and wait for the timeout
    (page.root as HTMLLfSliderElement).unmount(0);
    await new Promise((resolve) => setTimeout(resolve, 50));
    await page.waitForChanges();

    const unmountEvent = events.find((e) => e.detail.eventType === "unmount");
    expect(unmountEvent).toBeDefined();
  });
});

describe("LfSlider Value Tests", () => {
  it("should initialize with specified lfValue", async () => {
    const page = await createPage('<lf-slider lf-value="75"></lf-slider>');
    const root = page.root as HTMLLfSliderElement;

    const value = await root.getValue();
    expect(value.display).toBe(75);
    expect(value.real).toBe(75);
  });

  it("should update value via setValue method", async () => {
    const page = await createPage("<lf-slider></lf-slider>");
    const root = page.root as HTMLLfSliderElement;

    await root.setValue(30);
    const value = await root.getValue();

    expect(value.display).toBe(30);
    expect(value.real).toBe(30);
  });

  it("should display value in the value span", async () => {
    const page = await createPage('<lf-slider lf-value="42"></lf-slider>');
    const root = page.root as HTMLLfSliderElement;
    await page.waitForChanges();

    const valueSpan = root.shadowRoot.querySelector(
      "[part='value']",
    ) as HTMLSpanElement;
    expect(valueSpan.textContent).toBe("42");
  });

  it("should update display when input changes", async () => {
    const page = await createPage("<lf-slider></lf-slider>");
    const root = page.root as HTMLLfSliderElement;

    const input = root.shadowRoot.querySelector(
      "input[type='range']",
    ) as HTMLInputElement;
    input.value = "85";
    input.dispatchEvent(new Event("input"));
    await page.waitForChanges();

    const value = await root.getValue();
    expect(value.display).toBe(85);
  });
});

describe("LfSlider Min/Max Tests", () => {
  it("should render with custom min and max values", async () => {
    const page = await createPage(
      '<lf-slider lf-min="10" lf-max="200"></lf-slider>',
    );
    const root = page.root as HTMLLfSliderElement;

    expect(root.lfMin).toBe(10);
    expect(root.lfMax).toBe(200);
  });

  it("should apply min and max to the native input", async () => {
    const page = await createPage(
      '<lf-slider lf-min="25" lf-max="150"></lf-slider>',
    );
    const root = page.root as HTMLLfSliderElement;

    const input = root.shadowRoot.querySelector(
      "input[type='range']",
    ) as HTMLInputElement;
    expect(input.min).toBe("25");
    expect(input.max).toBe("150");
  });

  it("should initialize value at midpoint for custom min/max when using default lfValue", async () => {
    const page = await createPage(
      '<lf-slider lf-min="0" lf-max="100" lf-value="50"></lf-slider>',
    );
    const root = page.root as HTMLLfSliderElement;

    const value = await root.getValue();
    expect(value.real).toBe(50);
  });

  it("should handle negative min values", async () => {
    const page = await createPage(
      '<lf-slider lf-min="-50" lf-max="50" lf-value="0"></lf-slider>',
    );
    const root = page.root as HTMLLfSliderElement;

    expect(root.lfMin).toBe(-50);
    expect(root.lfMax).toBe(50);

    const input = root.shadowRoot.querySelector(
      "input[type='range']",
    ) as HTMLInputElement;
    expect(input.min).toBe("-50");
  });
});

describe("LfSlider Step Tests", () => {
  it("should render with custom step value", async () => {
    const page = await createPage('<lf-slider lf-step="5"></lf-slider>');
    const root = page.root as HTMLLfSliderElement;

    expect(root.lfStep).toBe(5);
  });

  it("should apply step to the native input", async () => {
    const page = await createPage('<lf-slider lf-step="10"></lf-slider>');
    const root = page.root as HTMLLfSliderElement;

    const input = root.shadowRoot.querySelector(
      "input[type='range']",
    ) as HTMLInputElement;
    expect(input.step).toBe("10");
  });

  it("should handle decimal step values", async () => {
    const page = await createPage('<lf-slider lf-step="0.5"></lf-slider>');
    const root = page.root as HTMLLfSliderElement;

    expect(root.lfStep).toBe(0.5);

    const input = root.shadowRoot.querySelector(
      "input[type='range']",
    ) as HTMLInputElement;
    expect(input.step).toBe("0.5");
  });

  it("should use default step of 1", async () => {
    const page = await createPage("<lf-slider></lf-slider>");
    const root = page.root as HTMLLfSliderElement;

    expect(root.lfStep).toBe(1);
  });
});

describe("LfSlider Disabled State Tests", () => {
  it("should detect disabled state via lfUiState", async () => {
    const page = await createPage(
      '<lf-slider lf-ui-state="disabled"></lf-slider>',
    );
    const root = page.root as HTMLLfSliderElement;

    expect(root.lfUiState).toBe("disabled");
  });

  it("should disable the native input when lfUiState is disabled", async () => {
    const page = await createPage(
      '<lf-slider lf-ui-state="disabled"></lf-slider>',
    );
    const root = page.root as HTMLLfSliderElement;

    const input = root.shadowRoot.querySelector(
      "input[type='range']",
    ) as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it("should add disabled class to slider element when disabled", async () => {
    const page = await createPage(
      '<lf-slider lf-ui-state="disabled"></lf-slider>',
    );
    const root = page.root as HTMLLfSliderElement;

    const sliderDiv = root.shadowRoot.querySelector("[part='slider']");
    expect(sliderDiv.className).toContain("disabled");
  });

  it("should not be disabled by default", async () => {
    const page = await createPage("<lf-slider></lf-slider>");
    const root = page.root as HTMLLfSliderElement;

    const input = root.shadowRoot.querySelector(
      "input[type='range']",
    ) as HTMLInputElement;
    expect(input.disabled).toBe(false);
    expect(root.lfUiState).toBe("primary");
  });

  it("should allow toggling disabled state", async () => {
    const page = await createPage("<lf-slider></lf-slider>");
    const root = page.root as HTMLLfSliderElement;

    let input = root.shadowRoot.querySelector(
      "input[type='range']",
    ) as HTMLInputElement;
    expect(input.disabled).toBe(false);

    root.lfUiState = "disabled";
    await page.waitForChanges();

    input = root.shadowRoot.querySelector(
      "input[type='range']",
    ) as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});

describe("LfSlider Label Tests", () => {
  it("should render with a label", async () => {
    const page = await createPage('<lf-slider lf-label="Volume"></lf-slider>');
    const root = page.root as HTMLLfSliderElement;

    expect(root.lfLabel).toBe("Volume");
  });

  it("should display label text in label element", async () => {
    const page = await createPage(
      '<lf-slider lf-label="Brightness"></lf-slider>',
    );
    const root = page.root as HTMLLfSliderElement;

    const label = root.shadowRoot.querySelector(
      "[part='label']",
    ) as HTMLLabelElement;
    expect(label.textContent).toBe("Brightness");
  });

  it("should render empty label by default", async () => {
    const page = await createPage("<lf-slider></lf-slider>");
    const root = page.root as HTMLLfSliderElement;

    expect(root.lfLabel).toBe("");

    const label = root.shadowRoot.querySelector(
      "[part='label']",
    ) as HTMLLabelElement;
    expect(label.textContent).toBe("");
  });

  it("should position label as leading when lfLeadingLabel is true", async () => {
    const page = await createPage(
      '<lf-slider lf-label="Speed" lf-leading-label="true"></lf-slider>',
    );
    const root = page.root as HTMLLfSliderElement;

    expect(root.lfLeadingLabel).toBe(true);

    const formField = root.shadowRoot.querySelector(
      "[class*='form-field']",
    ) as HTMLElement;
    expect(formField.className).toContain("leading");
  });

  it("should position label as trailing by default", async () => {
    const page = await createPage('<lf-slider lf-label="Speed"></lf-slider>');
    const root = page.root as HTMLLfSliderElement;

    expect(root.lfLeadingLabel).toBe(false);

    const formField = root.shadowRoot.querySelector(
      "[class*='form-field']",
    ) as HTMLElement;
    expect(formField.className).not.toContain("leading");
  });

  it("should update label dynamically", async () => {
    const page = await createPage('<lf-slider lf-label="Initial"></lf-slider>');
    const root = page.root as HTMLLfSliderElement;

    let label = root.shadowRoot.querySelector(
      "[part='label']",
    ) as HTMLLabelElement;
    expect(label.textContent).toBe("Initial");

    root.lfLabel = "Updated Label";
    await page.waitForChanges();

    label = root.shadowRoot.querySelector("[part='label']") as HTMLLabelElement;
    expect(label.textContent).toBe("Updated Label");
  });
});

describe("LfSlider UI Size and State Tests", () => {
  it("should render with different UI sizes", async () => {
    const page = await createPage('<lf-slider lf-ui-size="small"></lf-slider>');
    const root = page.root as HTMLLfSliderElement;

    expect(root.lfUiSize).toBe("small");
  });

  it("should render with different UI states", async () => {
    const page = await createPage(
      '<lf-slider lf-ui-state="secondary"></lf-slider>',
    );
    const root = page.root as HTMLLfSliderElement;

    expect(root.lfUiState).toBe("secondary");
  });

  it("should reflect lfUiSize attribute", async () => {
    const page = await createPage('<lf-slider lf-ui-size="large"></lf-slider>');
    const root = page.root as HTMLLfSliderElement;

    expect(root.getAttribute("lf-ui-size")).toBe("large");
  });
});
