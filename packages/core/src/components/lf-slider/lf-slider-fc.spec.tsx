import { h } from "@stencil/core";
import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfFrameworkInterface, LfSliderFCProps } from "@lf-widgets/foundations";
import { LfSliderFC } from "./lf-slider-fc";

/**
 * Unit tests for LfSliderFC (Functional Component)
 *
 * These tests verify the stateless, presentational behavior of the FC.
 * The FC receives all state via props and communicates via callbacks.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */

let framework: LfFrameworkInterface;

/**
 * Creates a test page with the LfSliderFC rendered inside a wrapper div.
 * This simulates the FC being used inside a parent component's shadow DOM.
 */
const createTestPage = async (
  fcProps: Partial<Omit<LfSliderFCProps, "framework" | "value">> & {
    value?: LfSliderFCProps["value"];
  } = {},
): Promise<SpecPage> => {
  const defaultValue = { display: 50, real: 50 };

  const page = await newSpecPage({
    components: [],
    template: () => (
      <div>
        <LfSliderFC
          framework={framework}
          value={fcProps.value ?? defaultValue}
          {...fcProps}
        />
      </div>
    ),
  });
  return page;
};

describe("LfSliderFC", () => {
  beforeAll(() => {
    framework = getLfFramework();
  });

  //#region Basic Rendering
  describe("Basic Rendering", () => {
    it("renders with required framework prop", async () => {
      const page = await createTestPage({});
      expect(page.root.querySelector(".form-field")).toBeTruthy();
      expect(page.root.querySelector(".slider")).toBeTruthy();
    });

    it("renders value in {display, real} format", async () => {
      const page = await createTestPage({
        value: { display: 75, real: 75 },
      });

      const input = page.root.querySelector(
        "input[type='range']",
      ) as HTMLInputElement;
      expect(input.value).toBe("75");

      const valueSpan = page.root.querySelector(".slider__value");
      expect(valueSpan.textContent).toBe("75");
    });

    it("renders different display and real values", async () => {
      const page = await createTestPage({
        value: { display: 50, real: 0.5 },
      });

      const input = page.root.querySelector(
        "input[type='range']",
      ) as HTMLInputElement;
      expect(input.value).toBe("0.5");

      const valueSpan = page.root.querySelector(".slider__value");
      expect(valueSpan.textContent).toBe("50");
    });

    it("renders label in form-field__label", async () => {
      const page = await createTestPage({
        label: "Brightness",
      });

      const label = page.root.querySelector(".form-field__label");
      expect(label).toBeTruthy();
      expect(label.textContent).toBe("Brightness");
    });

    it("renders with min/max/step attributes", async () => {
      const page = await createTestPage({
        min: 10,
        max: 200,
        step: 5,
      });

      const input = page.root.querySelector(
        "input[type='range']",
      ) as HTMLInputElement;
      expect(input.min).toBe("10");
      expect(input.max).toBe("200");
      expect(input.step).toBe("5");
    });
  });
  //#endregion

  //#region Callback Tests
  describe("Callbacks", () => {
    it("calls onChange callback with parsed value when slider changes", async () => {
      const onChangeSpy = jest.fn();
      const page = await createTestPage({
        onChange: onChangeSpy,
      });

      const input = page.root.querySelector(
        "input[type='range']",
      ) as HTMLInputElement;
      input.value = "75";
      input.dispatchEvent(new Event("change"));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(75, expect.any(Event));
    });

    it("calls onInput callback during drag", async () => {
      const onInputSpy = jest.fn();
      const page = await createTestPage({
        onInput: onInputSpy,
      });

      const input = page.root.querySelector(
        "input[type='range']",
      ) as HTMLInputElement;
      input.value = "60";
      input.dispatchEvent(new Event("input"));

      expect(onInputSpy).toHaveBeenCalledTimes(1);
      expect(onInputSpy).toHaveBeenCalledWith(60, expect.any(Event));
    });

    it("calls onFocus callback when input gains focus", async () => {
      const onFocusSpy = jest.fn();
      const page = await createTestPage({
        onFocus: onFocusSpy,
      });

      const input = page.root.querySelector(
        "input[type='range']",
      ) as HTMLInputElement;
      input.dispatchEvent(new FocusEvent("focus"));

      expect(onFocusSpy).toHaveBeenCalledTimes(1);
      expect(onFocusSpy).toHaveBeenCalledWith(expect.any(FocusEvent));
    });

    it("calls onBlur callback when input loses focus", async () => {
      const onBlurSpy = jest.fn();
      const page = await createTestPage({
        onBlur: onBlurSpy,
      });

      const input = page.root.querySelector(
        "input[type='range']",
      ) as HTMLInputElement;
      input.dispatchEvent(new FocusEvent("blur"));

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
      expect(onBlurSpy).toHaveBeenCalledWith(expect.any(FocusEvent));
    });

    it("calls onPointerDown callback", async () => {
      const onPointerDownSpy = jest.fn();
      const page = await createTestPage({
        onPointerDown: onPointerDownSpy,
      });

      const input = page.root.querySelector(
        "input[type='range']",
      ) as HTMLInputElement;
      // Use MouseEvent as PointerEvent is not available in JSDOM
      input.dispatchEvent(
        new MouseEvent("pointerdown", { bubbles: true, cancelable: true }),
      );

      expect(onPointerDownSpy).toHaveBeenCalledTimes(1);
    });

    it("handles missing callbacks gracefully", async () => {
      const page = await createTestPage({});

      const input = page.root.querySelector(
        "input[type='range']",
      ) as HTMLInputElement;

      // Should not throw when callbacks are undefined
      expect(() => {
        input.dispatchEvent(new Event("change"));
        input.dispatchEvent(new Event("input"));
        input.dispatchEvent(new FocusEvent("focus"));
        input.dispatchEvent(new FocusEvent("blur"));
        // Use MouseEvent as PointerEvent is not available in JSDOM
        input.dispatchEvent(
          new MouseEvent("pointerdown", { bubbles: true, cancelable: true }),
        );
      }).not.toThrow();
    });
  });
  //#endregion

  //#region Ref Forwarding
  describe("Ref Forwarding", () => {
    it("forwards inputRef to the native input element", async () => {
      let inputEl: HTMLInputElement | null = null;
      const inputRefSpy = jest.fn((el: HTMLInputElement | null) => {
        inputEl = el;
      });

      await createTestPage({
        inputRef: inputRefSpy,
      });

      expect(inputRefSpy).toHaveBeenCalled();
      expect(inputEl).toBeInstanceOf(HTMLInputElement);
      expect(inputEl?.type).toBe("range");
    });

    it("forwards thumbRef to the thumb element", async () => {
      let thumbEl: HTMLElement | null = null;
      const thumbRefSpy = jest.fn((el: HTMLElement | null) => {
        thumbEl = el;
      });

      await createTestPage({
        thumbRef: thumbRefSpy,
      });

      expect(thumbRefSpy).toHaveBeenCalled();
      expect(thumbEl).toBeTruthy();
      expect(thumbEl?.classList.contains("slider__thumb")).toBe(true);
    });

    it("forwards trackRef to the track element", async () => {
      let trackEl: HTMLElement | null = null;
      const trackRefSpy = jest.fn((el: HTMLElement | null) => {
        trackEl = el;
      });

      await createTestPage({
        trackRef: trackRefSpy,
      });

      expect(trackRefSpy).toHaveBeenCalled();
      expect(trackEl).toBeTruthy();
      expect(trackEl?.classList.contains("slider__track")).toBe(true);
    });

    it("forwards thumbUnderlayRef to the thumb underlay element", async () => {
      let thumbUnderlayEl: HTMLElement | null = null;
      const thumbUnderlayRefSpy = jest.fn((el: HTMLElement | null) => {
        thumbUnderlayEl = el;
      });

      await createTestPage({
        thumbUnderlayRef: thumbUnderlayRefSpy,
      });

      expect(thumbUnderlayRefSpy).toHaveBeenCalled();
      expect(thumbUnderlayEl).toBeTruthy();
      expect(
        thumbUnderlayEl?.classList.contains("slider__thumb-underlay"),
      ).toBe(true);
    });
  });
  //#endregion

  //#region UI State and Size
  describe("UI State and Size", () => {
    it("applies uiState as data-lf attribute", async () => {
      const page = await createTestPage({
        uiState: "success",
      });

      const formField = page.root.querySelector(".form-field");
      expect(formField.getAttribute("data-lf")).toBe("success");
    });

    it("applies default uiState as primary", async () => {
      const page = await createTestPage({});

      const formField = page.root.querySelector(".form-field");
      expect(formField.getAttribute("data-lf")).toBe("primary");
    });

    it("applies uiSize as CSS variable --lf-fc-ui-size", async () => {
      const page = await createTestPage({
        uiSize: "small",
      });

      const formField = page.root.querySelector(".form-field") as HTMLElement;
      expect(formField.style.getPropertyValue("--lf-fc-ui-size")).toBe(
        "var(--lf-ui-size-small)",
      );
    });

    it("applies large uiSize as CSS variable", async () => {
      const page = await createTestPage({
        uiSize: "large",
      });

      const formField = page.root.querySelector(".form-field") as HTMLElement;
      expect(formField.style.getPropertyValue("--lf-fc-ui-size")).toBe(
        "var(--lf-ui-size-large)",
      );
    });

    it("does not apply CSS variable for medium uiSize (default)", async () => {
      const page = await createTestPage({
        uiSize: "medium",
      });

      const formField = page.root.querySelector(".form-field") as HTMLElement;
      expect(formField.style.getPropertyValue("--lf-fc-ui-size")).toBe("");
    });

    it("applies danger uiState", async () => {
      const page = await createTestPage({
        uiState: "danger",
      });

      const formField = page.root.querySelector(".form-field");
      expect(formField.getAttribute("data-lf")).toBe("danger");
    });

    it("applies warning uiState", async () => {
      const page = await createTestPage({
        uiState: "warning",
      });

      const formField = page.root.querySelector(".form-field");
      expect(formField.getAttribute("data-lf")).toBe("warning");
    });
  });
  //#endregion

  //#region Disabled State
  describe("Disabled State", () => {
    it("applies disabled state to input element", async () => {
      const page = await createTestPage({
        disabled: true,
      });

      const input = page.root.querySelector(
        "input[type='range']",
      ) as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it("applies disabled modifier class to slider", async () => {
      const page = await createTestPage({
        disabled: true,
      });

      const slider = page.root.querySelector(".slider");
      expect(slider.classList.contains("slider--disabled")).toBe(true);
    });

    it("does not apply disabled modifier when enabled", async () => {
      const page = await createTestPage({
        disabled: false,
      });

      const slider = page.root.querySelector(".slider");
      expect(slider.classList.contains("slider--disabled")).toBe(false);
    });
  });
  //#endregion

  //#region Custom Styling
  describe("Custom Styling", () => {
    it("applies custom className", async () => {
      const page = await createTestPage({
        className: "my-custom-slider",
      });

      const formField = page.root.querySelector(".form-field");
      expect(formField.classList.contains("my-custom-slider")).toBe(true);
    });

    it("applies custom style object", async () => {
      const page = await createTestPage({
        style: { color: "red", padding: "10px" },
      });

      const formField = page.root.querySelector(".form-field") as HTMLElement;
      expect(formField.style.color).toBe("red");
      expect(formField.style.padding).toBe("10px");
    });

    it("merges custom style with uiSize CSS variable", async () => {
      const page = await createTestPage({
        style: { color: "blue" },
        uiSize: "small",
      });

      const formField = page.root.querySelector(".form-field") as HTMLElement;
      expect(formField.style.color).toBe("blue");
      expect(formField.style.getPropertyValue("--lf-fc-ui-size")).toBe(
        "var(--lf-ui-size-small)",
      );
    });

    it("applies custom id", async () => {
      const page = await createTestPage({
        id: "my-slider-id",
      });

      const formField = page.root.querySelector(".form-field");
      expect(formField.id).toBe("my-slider-id");
    });
  });
  //#endregion

  //#region Leading Label Modifier
  describe("Leading Label Modifier", () => {
    it("applies leading modifier class when leadingLabel is true", async () => {
      const page = await createTestPage({
        leadingLabel: true,
        label: "Volume",
      });

      const formField = page.root.querySelector(".form-field");
      expect(formField.classList.contains("form-field--leading")).toBe(true);
    });

    it("does not apply leading modifier when leadingLabel is false", async () => {
      const page = await createTestPage({
        leadingLabel: false,
        label: "Volume",
      });

      const formField = page.root.querySelector(".form-field");
      expect(formField.classList.contains("form-field--leading")).toBe(false);
    });

    it("does not apply leading modifier by default", async () => {
      const page = await createTestPage({
        label: "Volume",
      });

      const formField = page.root.querySelector(".form-field");
      expect(formField.classList.contains("form-field--leading")).toBe(false);
    });
  });
  //#endregion

  //#region Has Value Modifier
  describe("Has Value Modifier", () => {
    it("applies has-value modifier when value is above min", async () => {
      const page = await createTestPage({
        value: { display: 50, real: 50 },
        min: 0,
      });

      const slider = page.root.querySelector(".slider");
      expect(slider.classList.contains("slider--has-value")).toBe(true);
    });

    it("does not apply has-value modifier when value equals min", async () => {
      const page = await createTestPage({
        value: { display: 0, real: 0 },
        min: 0,
      });

      const slider = page.root.querySelector(".slider");
      expect(slider.classList.contains("slider--has-value")).toBe(false);
    });

    it("applies has-value modifier with custom min", async () => {
      const page = await createTestPage({
        value: { display: 15, real: 15 },
        min: 10,
      });

      const slider = page.root.querySelector(".slider");
      expect(slider.classList.contains("slider--has-value")).toBe(true);
    });

    it("does not apply has-value modifier when display equals custom min", async () => {
      const page = await createTestPage({
        value: { display: 10, real: 10 },
        min: 10,
      });

      const slider = page.root.querySelector(".slider");
      expect(slider.classList.contains("slider--has-value")).toBe(false);
    });
  });
  //#endregion

  //#region Data Attributes
  describe("Data Attributes", () => {
    it("applies data-cy attribute to input for testing", async () => {
      const page = await createTestPage({});

      const input = page.root.querySelector("input[type='range']");
      expect(input.getAttribute("data-cy")).toBe("input");
    });
  });
  //#endregion

  //#region Part Attributes
  describe("Part Attributes", () => {
    it("applies correct part attributes for styling", async () => {
      const page = await createTestPage({
        label: "Test Label",
      });

      const formField = page.root.querySelector(".form-field");
      expect(formField.getAttribute("part")).toBe("form-field");

      const slider = page.root.querySelector(".slider");
      expect(slider.getAttribute("part")).toBe("slider");

      const nativeControl = page.root.querySelector(".slider__native-control");
      expect(nativeControl.getAttribute("part")).toBe("native-control");

      const thumb = page.root.querySelector(".slider__thumb");
      expect(thumb.getAttribute("part")).toBe("thumb");

      const value = page.root.querySelector(".slider__value");
      expect(value.getAttribute("part")).toBe("value");

      const label = page.root.querySelector(".form-field__label");
      expect(label.getAttribute("part")).toBe("label");
    });
  });
  //#endregion

  //#region Edge Cases
  describe("Edge Cases", () => {
    it("handles negative values", async () => {
      const page = await createTestPage({
        value: { display: -25, real: -25 },
        min: -100,
        max: 100,
      });

      const input = page.root.querySelector(
        "input[type='range']",
      ) as HTMLInputElement;
      expect(input.value).toBe("-25");

      const valueSpan = page.root.querySelector(".slider__value");
      expect(valueSpan.textContent).toBe("-25");
    });

    it("handles decimal values", async () => {
      const page = await createTestPage({
        value: { display: 0.75, real: 0.75 },
        min: 0,
        max: 1,
        step: 0.01,
      });

      const input = page.root.querySelector(
        "input[type='range']",
      ) as HTMLInputElement;
      expect(input.value).toBe("0.75");
    });

    it("handles empty label", async () => {
      const page = await createTestPage({
        label: "",
      });

      const label = page.root.querySelector(".form-field__label");
      expect(label).toBeTruthy();
      expect(label.textContent).toBe("");
    });

    it("handles undefined label (defaults to empty)", async () => {
      const page = await createTestPage({});

      const label = page.root.querySelector(".form-field__label");
      expect(label).toBeTruthy();
      expect(label.textContent).toBe("");
    });
  });
  //#endregion
});
