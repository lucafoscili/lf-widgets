import { h } from "@stencil/core";
import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfFrameworkInterface, LfToggleFCProps } from "@lf-widgets/foundations";
import { LfToggleFC } from "./fc";

/**
 * Unit tests for LfToggleFC (Functional Component)
 *
 * These tests verify the stateless, presentational behavior of the FC.
 * The FC receives all state via props and communicates via callbacks.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */

let framework: LfFrameworkInterface;

/**
 * Creates a test page with the LfToggleFC rendered inside a wrapper div.
 * This simulates the FC being used inside a parent component's shadow DOM.
 */
const createTestPage = async (
  fcProps: Partial<Omit<LfToggleFCProps, "framework" | "value">> & {
    value?: LfToggleFCProps["value"];
  } = {},
): Promise<SpecPage> => {
  const page = await newSpecPage({
    components: [],
    template: () => (
      <div>
        <LfToggleFC
          framework={framework}
          value={fcProps.value ?? false}
          {...fcProps}
        />
      </div>
    ),
  });
  return page;
};

describe("LfToggleFC", () => {
  beforeAll(() => {
    framework = getLfFramework();
  });

  //#region Basic Rendering
  describe("Basic Rendering", () => {
    it("renders with required framework prop", async () => {
      const page = await createTestPage({});
      expect(page.root.querySelector(".form-field")).toBeTruthy();
      expect(page.root.querySelector(".toggle")).toBeTruthy();
    });

    it("renders native checkbox input", async () => {
      const page = await createTestPage({});

      const input = page.root.querySelector(
        "input[type='checkbox']",
      ) as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input.getAttribute("role")).toBe("switch");
    });

    it("renders value as checked state when true", async () => {
      const page = await createTestPage({
        value: true,
      });

      const input = page.root.querySelector(
        "input[type='checkbox']",
      ) as HTMLInputElement;
      expect(input.checked).toBe(true);
      expect(input.value).toBe("on");
    });

    it("renders value as unchecked state when false", async () => {
      const page = await createTestPage({
        value: false,
      });

      const input = page.root.querySelector(
        "input[type='checkbox']",
      ) as HTMLInputElement;
      expect(input.checked).toBe(false);
      expect(input.value).toBe("off");
    });

    it("renders label in form-field__label", async () => {
      const page = await createTestPage({
        label: "Enable notifications",
      });

      const label = page.root.querySelector(".form-field__label");
      expect(label).toBeTruthy();
      expect(label.textContent).toBe("Enable notifications");
    });

    it("renders toggle track element", async () => {
      const page = await createTestPage({});

      const track = page.root.querySelector(".toggle__track");
      expect(track).toBeTruthy();
    });

    it("renders toggle thumb element", async () => {
      const page = await createTestPage({});

      const thumb = page.root.querySelector(".toggle__thumb");
      expect(thumb).toBeTruthy();
    });

    it("renders toggle thumb underlay element", async () => {
      const page = await createTestPage({});

      const thumbUnderlay = page.root.querySelector(".toggle__thumb-underlay");
      expect(thumbUnderlay).toBeTruthy();
    });
  });
  //#endregion

  //#region Active Modifier
  describe("Active Modifier", () => {
    it("applies active modifier class when value is true", async () => {
      const page = await createTestPage({
        value: true,
      });

      const toggle = page.root.querySelector(".toggle");
      expect(toggle.classList.contains("toggle--active")).toBe(true);
    });

    it("does not apply active modifier when value is false", async () => {
      const page = await createTestPage({
        value: false,
      });

      const toggle = page.root.querySelector(".toggle");
      expect(toggle.classList.contains("toggle--active")).toBe(false);
    });
  });
  //#endregion

  //#region Callback Tests
  describe("Callbacks", () => {
    it("calls onChange callback with toggled value when checkbox changes", async () => {
      const onChangeSpy = jest.fn();
      const page = await createTestPage({
        value: false,
        onChange: onChangeSpy,
      });

      const input = page.root.querySelector(
        "input[type='checkbox']",
      ) as HTMLInputElement;
      input.checked = true;
      input.dispatchEvent(new Event("change"));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(true, expect.any(Event));
    });

    it("calls onChange with false when unchecking", async () => {
      const onChangeSpy = jest.fn();
      const page = await createTestPage({
        value: true,
        onChange: onChangeSpy,
      });

      const input = page.root.querySelector(
        "input[type='checkbox']",
      ) as HTMLInputElement;
      input.checked = false;
      input.dispatchEvent(new Event("change"));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(false, expect.any(Event));
    });

    it("calls onFocus callback when input gains focus", async () => {
      const onFocusSpy = jest.fn();
      const page = await createTestPage({
        onFocus: onFocusSpy,
      });

      const input = page.root.querySelector(
        "input[type='checkbox']",
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
        "input[type='checkbox']",
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
        "input[type='checkbox']",
      ) as HTMLInputElement;
      // Use MouseEvent as PointerEvent is not available in JSDOM
      input.dispatchEvent(
        new MouseEvent("pointerdown", { bubbles: true, cancelable: true }),
      );

      expect(onPointerDownSpy).toHaveBeenCalledTimes(1);
    });

    it("calls onLabelClick callback when label is clicked", async () => {
      const onLabelClickSpy = jest.fn();
      const page = await createTestPage({
        label: "Test Label",
        onLabelClick: onLabelClickSpy,
      });

      const label = page.root.querySelector(
        ".form-field__label",
      ) as HTMLLabelElement;
      label.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      );

      expect(onLabelClickSpy).toHaveBeenCalledTimes(1);
    });

    it("handles missing callbacks gracefully", async () => {
      const page = await createTestPage({});

      const input = page.root.querySelector(
        "input[type='checkbox']",
      ) as HTMLInputElement;
      const label = page.root.querySelector(
        ".form-field__label",
      ) as HTMLLabelElement;

      // Should not throw when callbacks are undefined
      expect(() => {
        input.dispatchEvent(new Event("change"));
        input.dispatchEvent(new FocusEvent("focus"));
        input.dispatchEvent(new FocusEvent("blur"));
        input.dispatchEvent(
          new MouseEvent("pointerdown", { bubbles: true, cancelable: true }),
        );
        label.dispatchEvent(
          new MouseEvent("click", { bubbles: true, cancelable: true }),
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
      expect(inputEl?.type).toBe("checkbox");
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
      expect(thumbEl?.classList.contains("toggle__thumb")).toBe(true);
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
      expect(trackEl?.classList.contains("toggle__track")).toBe(true);
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
        thumbUnderlayEl?.classList.contains("toggle__thumb-underlay"),
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
        "input[type='checkbox']",
      ) as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it("applies disabled modifier class to toggle", async () => {
      const page = await createTestPage({
        disabled: true,
      });

      const toggle = page.root.querySelector(".toggle");
      expect(toggle.classList.contains("toggle--disabled")).toBe(true);
    });

    it("does not apply disabled modifier when enabled", async () => {
      const page = await createTestPage({
        disabled: false,
      });

      const toggle = page.root.querySelector(".toggle");
      expect(toggle.classList.contains("toggle--disabled")).toBe(false);
    });

    it("applies both active and disabled modifiers when appropriate", async () => {
      const page = await createTestPage({
        value: true,
        disabled: true,
      });

      const toggle = page.root.querySelector(".toggle");
      expect(toggle.classList.contains("toggle--active")).toBe(true);
      expect(toggle.classList.contains("toggle--disabled")).toBe(true);
    });
  });
  //#endregion

  //#region Custom Styling
  describe("Custom Styling", () => {
    it("applies custom className", async () => {
      const page = await createTestPage({
        className: "my-custom-toggle",
      });

      const formField = page.root.querySelector(".form-field");
      expect(formField.classList.contains("my-custom-toggle")).toBe(true);
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
        id: "my-toggle-id",
      });

      const formField = page.root.querySelector(".form-field");
      expect(formField.id).toBe("my-toggle-id");
    });
  });
  //#endregion

  //#region Leading Label Modifier
  describe("Leading Label Modifier", () => {
    it("applies leading modifier class when leadingLabel is true", async () => {
      const page = await createTestPage({
        leadingLabel: true,
        label: "Dark mode",
      });

      const formField = page.root.querySelector(".form-field");
      expect(formField.classList.contains("form-field--leading")).toBe(true);
    });

    it("does not apply leading modifier when leadingLabel is false", async () => {
      const page = await createTestPage({
        leadingLabel: false,
        label: "Dark mode",
      });

      const formField = page.root.querySelector(".form-field");
      expect(formField.classList.contains("form-field--leading")).toBe(false);
    });

    it("does not apply leading modifier by default", async () => {
      const page = await createTestPage({
        label: "Dark mode",
      });

      const formField = page.root.querySelector(".form-field");
      expect(formField.classList.contains("form-field--leading")).toBe(false);
    });
  });
  //#endregion

  //#region Accessibility
  describe("Accessibility", () => {
    it("uses ariaLabel for accessible label when provided", async () => {
      const page = await createTestPage({
        ariaLabel: "Toggle dark mode",
        label: "Dark mode",
      });

      const input = page.root.querySelector(
        "input[type='checkbox']",
      ) as HTMLInputElement;
      expect(input.getAttribute("aria-label")).toBe("Toggle dark mode");
    });

    it("falls back to label for accessible label", async () => {
      const page = await createTestPage({
        label: "Enable notifications",
      });

      const input = page.root.querySelector(
        "input[type='checkbox']",
      ) as HTMLInputElement;
      expect(input.getAttribute("aria-label")).toBe("Enable notifications");
    });

    it("falls back to id for accessible label when no label", async () => {
      const page = await createTestPage({
        id: "notifications-toggle",
      });

      const input = page.root.querySelector(
        "input[type='checkbox']",
      ) as HTMLInputElement;
      expect(input.getAttribute("aria-label")).toBe("notifications-toggle");
    });

    it('falls back to "toggle" when no ariaLabel, label, or id', async () => {
      const page = await createTestPage({});

      const input = page.root.querySelector(
        "input[type='checkbox']",
      ) as HTMLInputElement;
      expect(input.getAttribute("aria-label")).toBe("toggle");
    });

    it("trims whitespace from accessible label", async () => {
      const page = await createTestPage({
        label: "  Padded Label  ",
      });

      const input = page.root.querySelector(
        "input[type='checkbox']",
      ) as HTMLInputElement;
      expect(input.getAttribute("aria-label")).toBe("Padded Label");
    });

    it("has role='switch' on the input", async () => {
      const page = await createTestPage({});

      const input = page.root.querySelector(
        "input[type='checkbox']",
      ) as HTMLInputElement;
      expect(input.getAttribute("role")).toBe("switch");
    });
  });
  //#endregion

  //#region Data Attributes
  describe("Data Attributes", () => {
    it("applies data-cy attribute to input for testing", async () => {
      const page = await createTestPage({});

      const input = page.root.querySelector("input[type='checkbox']");
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
      expect(formField.getAttribute("part")).toBe("toggle");

      const nativeControl = page.root.querySelector(".toggle__native-control");
      expect(nativeControl.getAttribute("part")).toBe("native-control");

      const thumb = page.root.querySelector(".toggle__thumb");
      expect(thumb.getAttribute("part")).toBe("thumb");

      const track = page.root.querySelector(".toggle__track");
      expect(track.getAttribute("part")).toBe("track");

      const label = page.root.querySelector(".form-field__label");
      expect(label.getAttribute("part")).toBe("label");
    });
  });
  //#endregion

  //#region Edge Cases
  describe("Edge Cases", () => {
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

    it("handles rapid toggle changes", async () => {
      const onChangeSpy = jest.fn();
      const page = await createTestPage({
        value: false,
        onChange: onChangeSpy,
      });

      const input = page.root.querySelector(
        "input[type='checkbox']",
      ) as HTMLInputElement;

      // Simulate rapid changes
      input.checked = true;
      input.dispatchEvent(new Event("change"));
      input.checked = false;
      input.dispatchEvent(new Event("change"));
      input.checked = true;
      input.dispatchEvent(new Event("change"));

      expect(onChangeSpy).toHaveBeenCalledTimes(3);
      expect(onChangeSpy).toHaveBeenNthCalledWith(1, true, expect.any(Event));
      expect(onChangeSpy).toHaveBeenNthCalledWith(2, false, expect.any(Event));
      expect(onChangeSpy).toHaveBeenNthCalledWith(3, true, expect.any(Event));
    });
  });
  //#endregion
});
