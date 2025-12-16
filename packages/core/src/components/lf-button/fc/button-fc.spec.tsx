import { h } from "@stencil/core";
import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfFrameworkInterface, LfButtonFCProps } from "@lf-widgets/foundations";
import { ButtonFC } from "./button-fc";

/**
 * Unit tests for ButtonFC (Functional Component)
 *
 * These tests verify the stateless, presentational behavior of the FC.
 * The FC receives all state via props and communicates via callbacks.
 *
 * @see Section 5.9 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */

let framework: LfFrameworkInterface;

/**
 * Creates a test page with the ButtonFC rendered inside a wrapper div.
 * This simulates the FC being used inside a parent component's shadow DOM.
 */
const createTestPage = async (
  fcProps: Partial<Omit<LfButtonFCProps, "framework">> = {},
): Promise<SpecPage> => {
  const page = await newSpecPage({
    components: [],
    template: () => (
      <div>
        <ButtonFC framework={framework} {...fcProps} />
      </div>
    ),
  });
  return page;
};

describe("ButtonFC", () => {
  beforeAll(() => {
    framework = getLfFramework();
  });

  //#region Basic Rendering
  describe("Basic Rendering", () => {
    it("renders with required framework prop", async () => {
      const page = await createTestPage({});
      expect(page.root.querySelector("button")).toBeTruthy();
      expect(page.root.querySelector(".button")).toBeTruthy();
    });

    it("renders label text", async () => {
      const page = await createTestPage({
        label: "Click Me",
      });

      const label = page.root.querySelector(".button__label");
      expect(label).toBeTruthy();
      expect(label.textContent).toBe("Click Me");
    });

    it("renders empty label when not provided", async () => {
      const page = await createTestPage({});

      const label = page.root.querySelector(".button__label");
      expect(label).toBeTruthy();
      expect(label.textContent).toBe("");
    });

    it("renders icon when provided", async () => {
      const page = await createTestPage({
        icon: "check",
      });

      const iconWrapper = page.root.querySelector(".button__icon");
      expect(iconWrapper).toBeTruthy();
    });

    it("does not render icon wrapper when icon is not provided", async () => {
      const page = await createTestPage({});

      const iconWrapper = page.root.querySelector(".button__icon");
      expect(iconWrapper).toBeFalsy();
    });

    it("renders trailing icon when trailingIcon is true", async () => {
      const page = await createTestPage({
        icon: "arrow-right",
        label: "Next",
        trailingIcon: true,
      });

      const button = page.root.querySelector(".button");
      const children = Array.from(button.children);
      const labelIndex = children.findIndex((el) =>
        el.classList.contains("button__label"),
      );
      const iconIndex = children.findIndex((el) =>
        el.classList.contains("button__icon"),
      );

      // Icon should come after label when trailing
      expect(iconIndex).toBeGreaterThan(labelIndex);
    });

    it("renders leading icon by default", async () => {
      const page = await createTestPage({
        icon: "arrow-left",
        label: "Back",
        trailingIcon: false,
      });

      const button = page.root.querySelector(".button");
      const children = Array.from(button.children);
      const labelIndex = children.findIndex((el) =>
        el.classList.contains("button__label"),
      );
      const iconIndex = children.findIndex((el) =>
        el.classList.contains("button__icon"),
      );

      // Icon should come before label when leading
      expect(iconIndex).toBeLessThan(labelIndex);
    });

    it("applies custom id", async () => {
      const page = await createTestPage({
        id: "my-button-id",
      });

      const button = page.root.querySelector(".button");
      expect(button.id).toBe("my-button-id");
    });
  });
  //#endregion

  //#region Callback Tests
  describe("Callbacks", () => {
    it("calls onClick callback when button is clicked", async () => {
      const onClickSpy = jest.fn();
      const page = await createTestPage({
        onClick: onClickSpy,
      });

      const button = page.root.querySelector("button");
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith(expect.any(MouseEvent));
    });

    it("calls onFocus callback when button gains focus", async () => {
      const onFocusSpy = jest.fn();
      const page = await createTestPage({
        onFocus: onFocusSpy,
      });

      const button = page.root.querySelector("button");
      button.dispatchEvent(new FocusEvent("focus"));

      expect(onFocusSpy).toHaveBeenCalledTimes(1);
      expect(onFocusSpy).toHaveBeenCalledWith(expect.any(FocusEvent));
    });

    it("calls onBlur callback when button loses focus", async () => {
      const onBlurSpy = jest.fn();
      const page = await createTestPage({
        onBlur: onBlurSpy,
      });

      const button = page.root.querySelector("button");
      button.dispatchEvent(new FocusEvent("blur"));

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
      expect(onBlurSpy).toHaveBeenCalledWith(expect.any(FocusEvent));
    });

    it("calls onPointerDown callback", async () => {
      const onPointerDownSpy = jest.fn();
      const page = await createTestPage({
        onPointerDown: onPointerDownSpy,
      });

      const button = page.root.querySelector("button");
      // Use MouseEvent as PointerEvent is not available in JSDOM
      button.dispatchEvent(
        new MouseEvent("pointerdown", { bubbles: true, cancelable: true }),
      );

      expect(onPointerDownSpy).toHaveBeenCalledTimes(1);
    });

    it("handles missing callbacks gracefully", async () => {
      const page = await createTestPage({});

      const button = page.root.querySelector("button");

      // Should not throw when callbacks are undefined
      expect(() => {
        button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        button.dispatchEvent(new FocusEvent("focus"));
        button.dispatchEvent(new FocusEvent("blur"));
        button.dispatchEvent(
          new MouseEvent("pointerdown", { bubbles: true, cancelable: true }),
        );
      }).not.toThrow();
    });
  });
  //#endregion

  //#region Ref Forwarding
  describe("Ref Forwarding", () => {
    it("forwards buttonRef to the native button element", async () => {
      let buttonEl: HTMLButtonElement | null = null;
      const buttonRefSpy = jest.fn((el: HTMLButtonElement | null) => {
        buttonEl = el;
      });

      await createTestPage({
        buttonRef: buttonRefSpy,
      });

      expect(buttonRefSpy).toHaveBeenCalled();
      expect(buttonEl).toBeInstanceOf(HTMLButtonElement);
    });

    it("forwards rippleRef to the ripple container element", async () => {
      let rippleEl: HTMLElement | null = null;
      const rippleRefSpy = jest.fn((el: HTMLElement | null) => {
        rippleEl = el;
      });

      await createTestPage({
        rippleRef: rippleRefSpy,
      });

      expect(rippleRefSpy).toHaveBeenCalled();
      expect(rippleEl).toBeTruthy();
      expect(rippleEl?.classList.contains("button__ripple")).toBe(true);
    });
  });
  //#endregion

  //#region UI State and Size
  describe("UI State and Size", () => {
    it("applies uiState as data-lf attribute", async () => {
      const page = await createTestPage({
        uiState: "success",
      });

      const button = page.root.querySelector(".button");
      expect(button.getAttribute("data-lf")).toBe("success");
    });

    it("applies default uiState as primary", async () => {
      const page = await createTestPage({});

      const button = page.root.querySelector(".button");
      expect(button.getAttribute("data-lf")).toBe("primary");
    });

    it("applies uiSize as CSS variable --lf-fc-ui-size", async () => {
      const page = await createTestPage({
        uiSize: "small",
      });

      const button = page.root.querySelector(".button") as HTMLElement;
      expect(button.style.getPropertyValue("--lf-fc-ui-size")).toBe(
        "var(--lf-ui-size-small)",
      );
    });

    it("applies large uiSize as CSS variable", async () => {
      const page = await createTestPage({
        uiSize: "large",
      });

      const button = page.root.querySelector(".button") as HTMLElement;
      expect(button.style.getPropertyValue("--lf-fc-ui-size")).toBe(
        "var(--lf-ui-size-large)",
      );
    });

    it("does not apply CSS variable for medium uiSize (default)", async () => {
      const page = await createTestPage({
        uiSize: "medium",
      });

      const button = page.root.querySelector(".button") as HTMLElement;
      expect(button.style.getPropertyValue("--lf-fc-ui-size")).toBe("");
    });

    it("applies danger uiState", async () => {
      const page = await createTestPage({
        uiState: "danger",
      });

      const button = page.root.querySelector(".button");
      expect(button.getAttribute("data-lf")).toBe("danger");
    });

    it("applies warning uiState", async () => {
      const page = await createTestPage({
        uiState: "warning",
      });

      const button = page.root.querySelector(".button");
      expect(button.getAttribute("data-lf")).toBe("warning");
    });

    it("applies secondary uiState", async () => {
      const page = await createTestPage({
        uiState: "secondary",
      });

      const button = page.root.querySelector(".button");
      expect(button.getAttribute("data-lf")).toBe("secondary");
    });
  });
  //#endregion

  //#region Disabled State
  describe("Disabled State", () => {
    it("applies disabled attribute to button element", async () => {
      const page = await createTestPage({
        disabled: true,
      });

      const button = page.root.querySelector("button") as HTMLButtonElement;
      expect(button.hasAttribute("disabled")).toBe(true);
    });

    it("applies disabled modifier class to button", async () => {
      const page = await createTestPage({
        disabled: true,
      });

      const button = page.root.querySelector(".button");
      expect(button.classList.contains("button--disabled")).toBe(true);
    });

    it("does not apply disabled modifier when enabled", async () => {
      const page = await createTestPage({
        disabled: false,
      });

      const button = page.root.querySelector(".button");
      expect(button.classList.contains("button--disabled")).toBe(false);
    });
  });
  //#endregion

  //#region Button Styling Variants
  describe("Button Styling Variants", () => {
    it("applies raised styling by default", async () => {
      const page = await createTestPage({});

      const button = page.root.querySelector(".button");
      expect(button.classList.contains("button--raised")).toBe(true);
    });

    it("applies flat styling", async () => {
      const page = await createTestPage({
        styling: "flat",
      });

      const button = page.root.querySelector(".button");
      expect(button.classList.contains("button--flat")).toBe(true);
    });

    it("applies floating styling", async () => {
      const page = await createTestPage({
        styling: "floating",
      });

      const button = page.root.querySelector(".button");
      expect(button.classList.contains("button--floating")).toBe(true);
    });

    it("applies icon styling", async () => {
      const page = await createTestPage({
        styling: "icon",
        icon: "settings",
      });

      const button = page.root.querySelector(".button");
      expect(button.classList.contains("button--icon")).toBe(true);
    });

    it("does not render label element when icon styling is used", async () => {
      const page = await createTestPage({
        styling: "icon",
        icon: "settings",
        label: "Settings",
      });

      const label = page.root.querySelector(".button__label");
      expect(label).toBeFalsy();
    });

    it("applies outlined styling", async () => {
      const page = await createTestPage({
        styling: "outlined",
      });

      const button = page.root.querySelector(".button");
      expect(button.classList.contains("button--outlined")).toBe(true);
    });
  });
  //#endregion

  //#region Button Type
  describe("Button Type", () => {
    it("applies button type by default", async () => {
      const page = await createTestPage({});

      const button = page.root.querySelector("button") as HTMLButtonElement;
      expect(button.type).toBe("button");
    });

    it("applies submit type", async () => {
      const page = await createTestPage({
        type: "submit",
      });

      const button = page.root.querySelector("button") as HTMLButtonElement;
      expect(button.type).toBe("submit");
    });

    it("applies reset type", async () => {
      const page = await createTestPage({
        type: "reset",
      });

      const button = page.root.querySelector("button") as HTMLButtonElement;
      expect(button.type).toBe("reset");
    });
  });
  //#endregion

  //#region Spinner State
  describe("Spinner State", () => {
    it("renders spinner when showSpinner is true", async () => {
      const page = await createTestPage({
        showSpinner: true,
      });

      const spinner = page.root.querySelector("lf-spinner");
      expect(spinner).toBeTruthy();
      expect(spinner.getAttribute("class")).toContain("button__spinner");
    });

    it("does not render spinner by default", async () => {
      const page = await createTestPage({});

      const spinner = page.root.querySelector("lf-spinner");
      expect(spinner).toBeFalsy();
    });

    it("applies has-spinner modifier class when spinner is shown", async () => {
      const page = await createTestPage({
        showSpinner: true,
      });

      const button = page.root.querySelector(".button");
      expect(button.classList.contains("button--has-spinner")).toBe(true);
    });

    it("hides label when spinner is shown and not disabled", async () => {
      const page = await createTestPage({
        showSpinner: true,
        label: "Loading",
        disabled: false,
      });

      const label = page.root.querySelector(".button__label");
      expect(label.classList.contains("button__label--hidden")).toBe(true);
    });

    it("does not hide label when spinner is shown but disabled", async () => {
      const page = await createTestPage({
        showSpinner: true,
        label: "Loading",
        disabled: true,
      });

      const label = page.root.querySelector(".button__label");
      expect(label.classList.contains("button__label--hidden")).toBe(false);
    });
  });
  //#endregion

  //#region Custom Styling
  describe("Custom Styling", () => {
    it("applies custom className", async () => {
      const page = await createTestPage({
        className: "my-custom-button",
      });

      const button = page.root.querySelector(".button");
      expect(button.classList.contains("my-custom-button")).toBe(true);
    });

    it("applies custom style object", async () => {
      const page = await createTestPage({
        style: { color: "red", padding: "10px" },
      });

      const button = page.root.querySelector(".button") as HTMLElement;
      expect(button.style.color).toBe("red");
      expect(button.style.padding).toBe("10px");
    });

    it("merges custom style with uiSize CSS variable", async () => {
      const page = await createTestPage({
        style: { color: "blue" },
        uiSize: "small",
      });

      const button = page.root.querySelector(".button") as HTMLElement;
      expect(button.style.color).toBe("blue");
      expect(button.style.getPropertyValue("--lf-fc-ui-size")).toBe(
        "var(--lf-ui-size-small)",
      );
    });
  });
  //#endregion

  //#region No Label Modifier
  describe("No Label Modifier", () => {
    it("applies no-label modifier when label is empty string", async () => {
      const page = await createTestPage({
        label: "",
      });

      const button = page.root.querySelector(".button");
      expect(button.classList.contains("button--no-label")).toBe(true);
    });

    it("applies no-label modifier when label is whitespace only", async () => {
      const page = await createTestPage({
        label: "   ",
      });

      const button = page.root.querySelector(".button");
      expect(button.classList.contains("button--no-label")).toBe(true);
    });

    it("does not apply no-label modifier when label has text", async () => {
      const page = await createTestPage({
        label: "Click",
      });

      const button = page.root.querySelector(".button");
      expect(button.classList.contains("button--no-label")).toBe(false);
    });
  });
  //#endregion

  //#region Data Attributes
  describe("Data Attributes", () => {
    it("applies data-cy attribute to button for testing", async () => {
      const page = await createTestPage({});

      const button = page.root.querySelector("button");
      expect(button.getAttribute("data-cy")).toBe("button");
    });
  });
  //#endregion

  //#region Part Attributes
  describe("Part Attributes", () => {
    it("applies correct part attributes for styling", async () => {
      const page = await createTestPage({
        icon: "check",
        label: "Confirm",
      });

      const button = page.root.querySelector(".button");
      expect(button.getAttribute("part")).toBe("button");

      const icon = page.root.querySelector(".button__icon");
      expect(icon.getAttribute("part")).toBe("icon");

      const label = page.root.querySelector(".button__label");
      expect(label.getAttribute("part")).toBe("label");
    });

    it("renders spinner element when spinner is shown", async () => {
      const page = await createTestPage({
        showSpinner: true,
      });

      const spinner = page.root.querySelector("lf-spinner");
      expect(spinner).toBeTruthy();
      expect(spinner.classList.contains("button__spinner")).toBe(true);
    });
  });
  //#endregion

  //#region Accessibility
  describe("Accessibility", () => {
    it("has aria-label derived from label prop", async () => {
      const page = await createTestPage({
        label: "Submit Form",
      });

      const button = page.root.querySelector("button");
      expect(button.getAttribute("aria-label")).toBe("Submit Form");
    });

    it("has aria-label derived from icon when no label", async () => {
      const page = await createTestPage({
        icon: "settings",
        label: "",
      });

      const button = page.root.querySelector("button");
      expect(button.getAttribute("aria-label")).toBe("settings");
    });

    it("has aria-label derived from id when no label or icon", async () => {
      const page = await createTestPage({
        id: "my-action-button",
        label: "",
      });

      const button = page.root.querySelector("button");
      expect(button.getAttribute("aria-label")).toBe("my-action-button");
    });

    it("falls back to 'button' aria-label when no label, icon, or id", async () => {
      const page = await createTestPage({
        label: "",
      });

      const button = page.root.querySelector("button");
      expect(button.getAttribute("aria-label")).toBe("button");
    });

    it("ripple container has aria-hidden attribute", async () => {
      const page = await createTestPage({});

      const ripple = page.root.querySelector(".button__ripple");
      expect(ripple.getAttribute("aria-hidden")).toBe("true");
    });
  });
  //#endregion

  //#region Edge Cases
  describe("Edge Cases", () => {
    it("handles undefined label gracefully", async () => {
      const page = await createTestPage({
        label: undefined,
      });

      const label = page.root.querySelector(".button__label");
      expect(label).toBeTruthy();
      expect(label.textContent).toBe("");
    });

    it("handles null icon gracefully", async () => {
      const page = await createTestPage({
        icon: null as any,
      });

      const icon = page.root.querySelector(".button__icon");
      expect(icon).toBeFalsy();
    });

    it("handles multiple class names in className", async () => {
      const page = await createTestPage({
        className: "class-one class-two class-three",
      });

      const button = page.root.querySelector(".button");
      expect(button.classList.contains("class-one")).toBe(true);
      expect(button.classList.contains("class-two")).toBe(true);
      expect(button.classList.contains("class-three")).toBe(true);
    });

    it("handles all props together", async () => {
      const onClickSpy = jest.fn();
      let buttonEl: HTMLButtonElement | null = null;

      const page = await createTestPage({
        className: "custom-class",
        disabled: false,
        icon: "check",
        id: "confirm-btn",
        label: "Confirm",
        onClick: onClickSpy,
        buttonRef: (el) => {
          buttonEl = el;
        },
        style: { margin: "5px" },
        styling: "outlined",
        trailingIcon: true,
        type: "submit",
        uiSize: "large",
        uiState: "success",
      });

      const button = page.root.querySelector(".button") as HTMLElement;

      expect(button.classList.contains("custom-class")).toBe(true);
      expect(button.classList.contains("button--outlined")).toBe(true);
      expect(button.id).toBe("confirm-btn");
      expect(button.getAttribute("data-lf")).toBe("success");
      expect(button.style.getPropertyValue("--lf-fc-ui-size")).toBe(
        "var(--lf-ui-size-large)",
      );
      expect(button.style.margin).toBe("5px");
      expect(buttonEl).toBeInstanceOf(HTMLButtonElement);

      const nativeButton = button as HTMLButtonElement;
      expect(nativeButton.type).toBe("submit");
    });
  });
  //#endregion
});
