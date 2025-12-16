import { h } from "@stencil/core";
import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import {
  LfFrameworkInterface,
  LfIconType,
  LfTextfieldFCProps,
} from "@lf-widgets/foundations";
import { LfTextfieldFC } from "./lf-textfield-fc";

/**
 * Unit tests for LfTextfieldFC (Functional Component)
 *
 * These tests verify the stateless, presentational behavior of the FC.
 * The FC receives all state via props and communicates via callbacks.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */

let framework: LfFrameworkInterface;

/**
 * Creates a test page with the LfTextfieldFC rendered inside a wrapper div.
 * This simulates the FC being used inside a parent component's shadow DOM.
 */
const createTestPage = async (
  fcProps: Partial<Omit<LfTextfieldFCProps, "framework" | "value">> & {
    value?: LfTextfieldFCProps["value"];
  } = {},
): Promise<SpecPage> => {
  const defaultValue = "";

  const page = await newSpecPage({
    components: [],
    template: () => (
      <div>
        <LfTextfieldFC
          framework={framework}
          value={fcProps.value ?? defaultValue}
          {...fcProps}
        />
      </div>
    ),
  });
  return page;
};

describe("LfTextfieldFC", () => {
  beforeAll(() => {
    framework = getLfFramework();
  });

  //#region Basic Rendering
  describe("Basic Rendering", () => {
    it("renders with required framework prop", async () => {
      const page = await createTestPage({});
      expect(page.root.querySelector(".textfield")).toBeTruthy();
    });

    it("renders value in input element", async () => {
      const page = await createTestPage({
        value: "Hello World",
      });

      const input = page.root.querySelector(
        "input.textfield__input",
      ) as HTMLInputElement;
      expect(input.value).toBe("Hello World");
    });

    it("renders value in textarea element when styling is textarea", async () => {
      const page = await createTestPage({
        value: "Multiline content",
        styling: "textarea",
      });

      const textarea = page.root.querySelector(
        "textarea.textfield__input",
      ) as HTMLTextAreaElement;
      expect(textarea).toBeTruthy();
      expect(textarea.getAttribute("value")).toBe("Multiline content");
    });

    it("renders label in textfield__label", async () => {
      const page = await createTestPage({
        label: "Username",
        styling: "flat",
      });

      const label = page.root.querySelector(".textfield__label");
      expect(label).toBeTruthy();
      expect(label.textContent).toBe("Username");
    });

    it("does not render label for outlined styling", async () => {
      const page = await createTestPage({
        label: "Username",
        styling: "outlined",
      });

      const label = page.root.querySelector(".textfield__label");
      expect(label).toBeFalsy();
    });

    it("renders placeholder text in input", async () => {
      const page = await createTestPage({
        placeholder: "Enter your name",
      });

      const input = page.root.querySelector(
        "input.textfield__input",
      ) as HTMLInputElement;
      expect(input.placeholder).toBe("Enter your name");
    });

    it("renders label as placeholder for outlined styling", async () => {
      const page = await createTestPage({
        label: "Email",
        styling: "outlined",
      });

      const input = page.root.querySelector(
        "input.textfield__input",
      ) as HTMLInputElement;
      expect(input.placeholder).toBe("Email");
    });
  });
  //#endregion

  //#region Input vs Textarea
  describe("Input vs Textarea", () => {
    it("renders input element by default", async () => {
      const page = await createTestPage({});

      const input = page.root.querySelector("input.textfield__input");
      const textarea = page.root.querySelector("textarea.textfield__input");
      expect(input).toBeTruthy();
      expect(textarea).toBeFalsy();
    });

    it("renders input element for flat styling", async () => {
      const page = await createTestPage({
        styling: "flat",
      });

      const input = page.root.querySelector("input.textfield__input");
      const textarea = page.root.querySelector("textarea.textfield__input");
      expect(input).toBeTruthy();
      expect(textarea).toBeFalsy();
    });

    it("renders input element for outlined styling", async () => {
      const page = await createTestPage({
        styling: "outlined",
      });

      const input = page.root.querySelector("input.textfield__input");
      const textarea = page.root.querySelector("textarea.textfield__input");
      expect(input).toBeTruthy();
      expect(textarea).toBeFalsy();
    });

    it("renders textarea element for textarea styling", async () => {
      const page = await createTestPage({
        styling: "textarea",
      });

      const input = page.root.querySelector("input.textfield__input");
      const textarea = page.root.querySelector("textarea.textfield__input");
      expect(input).toBeFalsy();
      expect(textarea).toBeTruthy();
    });

    it("wraps textarea in resizer span", async () => {
      const page = await createTestPage({
        styling: "textarea",
      });

      const resizer = page.root.querySelector(".textfield__resizer");
      expect(resizer).toBeTruthy();
      expect(resizer.querySelector("textarea")).toBeTruthy();
    });
  });
  //#endregion

  //#region Callback Tests
  describe("Callbacks", () => {
    it("calls onChange callback when input value changes", async () => {
      const onChangeSpy = jest.fn();
      const page = await createTestPage({
        onChange: onChangeSpy,
      });

      const input = page.root.querySelector(
        "input.textfield__input",
      ) as HTMLInputElement;
      input.value = "new value";
      input.dispatchEvent(new Event("change"));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith("new value", expect.any(Event));
    });

    it("calls onInput callback during typing", async () => {
      const onInputSpy = jest.fn();
      const page = await createTestPage({
        onInput: onInputSpy,
      });

      const input = page.root.querySelector(
        "input.textfield__input",
      ) as HTMLInputElement;
      input.value = "typing";
      input.dispatchEvent(new Event("input"));

      expect(onInputSpy).toHaveBeenCalledTimes(1);
      expect(onInputSpy).toHaveBeenCalledWith("typing", expect.any(Event));
    });

    it("calls onFocus callback when input gains focus", async () => {
      const onFocusSpy = jest.fn();
      const page = await createTestPage({
        onFocus: onFocusSpy,
      });

      const input = page.root.querySelector(
        "input.textfield__input",
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
        "input.textfield__input",
      ) as HTMLInputElement;
      input.dispatchEvent(new FocusEvent("blur"));

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
      expect(onBlurSpy).toHaveBeenCalledWith(expect.any(FocusEvent));
    });

    it("calls onKeyDown callback when key is pressed", async () => {
      const onKeyDownSpy = jest.fn();
      const page = await createTestPage({
        onKeyDown: onKeyDownSpy,
      });

      const input = page.root.querySelector(
        "input.textfield__input",
      ) as HTMLInputElement;
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

      expect(onKeyDownSpy).toHaveBeenCalledTimes(1);
      expect(onKeyDownSpy).toHaveBeenCalledWith(expect.any(KeyboardEvent));
    });

    it("calls onClick callback when input is clicked", async () => {
      const onClickSpy = jest.fn();
      const page = await createTestPage({
        onClick: onClickSpy,
      });

      const input = page.root.querySelector(
        "input.textfield__input",
      ) as HTMLInputElement;
      input.dispatchEvent(new MouseEvent("click"));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith(expect.any(MouseEvent));
    });

    it("calls callbacks for textarea element", async () => {
      const onChangeSpy = jest.fn();
      const onInputSpy = jest.fn();
      const page = await createTestPage({
        styling: "textarea",
        onChange: onChangeSpy,
        onInput: onInputSpy,
      });

      const textarea = page.root.querySelector(
        "textarea.textfield__input",
      ) as HTMLTextAreaElement;
      textarea.value = "textarea value";
      textarea.dispatchEvent(new Event("change"));
      textarea.dispatchEvent(new Event("input"));

      expect(onChangeSpy).toHaveBeenCalledWith(
        "textarea value",
        expect.any(Event),
      );
      expect(onInputSpy).toHaveBeenCalledWith(
        "textarea value",
        expect.any(Event),
      );
    });

    it("handles missing callbacks gracefully", async () => {
      const page = await createTestPage({});

      const input = page.root.querySelector(
        "input.textfield__input",
      ) as HTMLInputElement;

      // Should not throw when callbacks are undefined
      expect(() => {
        input.dispatchEvent(new Event("change"));
        input.dispatchEvent(new Event("input"));
        input.dispatchEvent(new FocusEvent("focus"));
        input.dispatchEvent(new FocusEvent("blur"));
        input.dispatchEvent(new KeyboardEvent("keydown"));
        input.dispatchEvent(new MouseEvent("click"));
      }).not.toThrow();
    });
  });
  //#endregion

  //#region Ref Forwarding
  describe("Ref Forwarding", () => {
    it("forwards inputRef to the native input element", async () => {
      let inputEl: HTMLInputElement | HTMLTextAreaElement | null = null;
      const inputRefSpy = jest.fn(
        (el: HTMLInputElement | HTMLTextAreaElement | null) => {
          inputEl = el;
        },
      );

      await createTestPage({
        inputRef: inputRefSpy,
      });

      expect(inputRefSpy).toHaveBeenCalled();
      expect(inputEl).toBeInstanceOf(HTMLInputElement);
    });

    it("forwards inputRef to the textarea element when styling is textarea", async () => {
      let textareaEl: HTMLInputElement | HTMLTextAreaElement | null = null;
      const inputRefSpy = jest.fn(
        (el: HTMLInputElement | HTMLTextAreaElement | null) => {
          textareaEl = el;
        },
      );

      await createTestPage({
        styling: "textarea",
        inputRef: inputRefSpy,
      });

      expect(inputRefSpy).toHaveBeenCalled();
      expect(textareaEl).toBeTruthy();
      expect((textareaEl as Element).tagName.toLowerCase()).toBe("textarea");
    });
  });
  //#endregion

  //#region UI State and Size
  describe("UI State and Size", () => {
    it("applies uiState as data-lf attribute", async () => {
      const page = await createTestPage({
        uiState: "success",
      });

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.getAttribute("data-lf")).toBe("success");
    });

    it("applies default uiState as primary", async () => {
      const page = await createTestPage({});

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.getAttribute("data-lf")).toBe("primary");
    });

    it("applies uiSize as CSS variable --lf-fc-ui-size", async () => {
      const page = await createTestPage({
        uiSize: "small",
      });

      const textfield = page.root.querySelector(".textfield") as HTMLElement;
      expect(textfield.style.getPropertyValue("--lf-fc-ui-size")).toBe(
        "var(--lf-ui-size-small)",
      );
    });

    it("applies large uiSize as CSS variable", async () => {
      const page = await createTestPage({
        uiSize: "large",
      });

      const textfield = page.root.querySelector(".textfield") as HTMLElement;
      expect(textfield.style.getPropertyValue("--lf-fc-ui-size")).toBe(
        "var(--lf-ui-size-large)",
      );
    });

    it("does not apply CSS variable for medium uiSize (default)", async () => {
      const page = await createTestPage({
        uiSize: "medium",
      });

      const textfield = page.root.querySelector(".textfield") as HTMLElement;
      expect(textfield.style.getPropertyValue("--lf-fc-ui-size")).toBe("");
    });

    it("applies danger uiState", async () => {
      const page = await createTestPage({
        uiState: "danger",
      });

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.getAttribute("data-lf")).toBe("danger");
    });

    it("applies warning uiState", async () => {
      const page = await createTestPage({
        uiState: "warning",
      });

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.getAttribute("data-lf")).toBe("warning");
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
        "input.textfield__input",
      ) as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it("applies disabled modifier class to textfield", async () => {
      const page = await createTestPage({
        disabled: true,
      });

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.classList.contains("textfield--disabled")).toBe(true);
    });

    it("does not apply disabled modifier when enabled", async () => {
      const page = await createTestPage({
        disabled: false,
      });

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.classList.contains("textfield--disabled")).toBe(false);
    });

    it("applies disabled modifier to textfield container for textarea", async () => {
      const page = await createTestPage({
        styling: "textarea",
        disabled: true,
      });

      // Verify container has disabled modifier (textarea styling)
      const textfield = page.root.querySelector(".textfield");
      expect(textfield.classList.contains("textfield--disabled")).toBe(true);
    });
  });
  //#endregion

  //#region Custom Styling
  describe("Custom Styling", () => {
    it("applies custom className", async () => {
      const page = await createTestPage({
        className: "my-custom-textfield",
      });

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.classList.contains("my-custom-textfield")).toBe(true);
    });

    it("applies custom style object", async () => {
      const page = await createTestPage({
        style: { color: "red", padding: "10px" },
      });

      const textfield = page.root.querySelector(".textfield") as HTMLElement;
      expect(textfield.style.color).toBe("red");
      expect(textfield.style.padding).toBe("10px");
    });

    it("merges custom style with uiSize CSS variable", async () => {
      const page = await createTestPage({
        style: { color: "blue" },
        uiSize: "small",
      });

      const textfield = page.root.querySelector(".textfield") as HTMLElement;
      expect(textfield.style.color).toBe("blue");
      expect(textfield.style.getPropertyValue("--lf-fc-ui-size")).toBe(
        "var(--lf-ui-size-small)",
      );
    });

    it("applies custom id", async () => {
      const page = await createTestPage({
        id: "my-textfield-id",
      });

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.id).toBe("my-textfield-id");
    });
  });
  //#endregion

  //#region Styling Variants
  describe("Styling Variants", () => {
    it("applies flat styling modifier", async () => {
      const page = await createTestPage({
        styling: "flat",
      });

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.classList.contains("textfield--flat")).toBe(true);
    });

    it("applies outlined styling modifier", async () => {
      const page = await createTestPage({
        styling: "outlined",
      });

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.classList.contains("textfield--outlined")).toBe(true);
    });

    it("applies textarea styling modifier", async () => {
      const page = await createTestPage({
        styling: "textarea",
      });

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.classList.contains("textfield--textarea")).toBe(true);
    });

    it("renders underline for flat styling", async () => {
      const page = await createTestPage({
        styling: "flat",
      });

      const underline = page.root.querySelector(".textfield__underline");
      expect(underline).toBeTruthy();
    });

    it("does not render underline for outlined styling", async () => {
      const page = await createTestPage({
        styling: "outlined",
      });

      const underline = page.root.querySelector(".textfield__underline");
      expect(underline).toBeFalsy();
    });

    it("does not render underline for textarea styling", async () => {
      const page = await createTestPage({
        styling: "textarea",
      });

      const underline = page.root.querySelector(".textfield__underline");
      expect(underline).toBeFalsy();
    });
  });
  //#endregion

  //#region Status Modifiers
  describe("Status Modifiers", () => {
    it("applies filled modifier when status includes filled", async () => {
      const page = await createTestPage({
        status: new Set(["filled"]),
      });

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.classList.contains("textfield--filled")).toBe(true);
    });

    it("applies focused modifier when status includes focused", async () => {
      const page = await createTestPage({
        status: new Set(["focused"]),
      });

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.classList.contains("textfield--focused")).toBe(true);
    });

    it("applies multiple status modifiers", async () => {
      const page = await createTestPage({
        status: new Set(["filled", "focused"]),
      });

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.classList.contains("textfield--filled")).toBe(true);
      expect(textfield.classList.contains("textfield--focused")).toBe(true);
    });

    it("defaults to empty status set", async () => {
      const page = await createTestPage({});

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.classList.contains("textfield--filled")).toBe(false);
      expect(textfield.classList.contains("textfield--focused")).toBe(false);
    });
  });
  //#endregion

  //#region Icon Rendering
  describe("Icon Rendering", () => {
    it("renders icon when icon prop is provided", async () => {
      const page = await createTestPage({
        icon: "search",
      });

      const iconWrapper = page.root.querySelector(".textfield__icon");
      expect(iconWrapper).toBeTruthy();
    });

    it("applies has-icon modifier when icon is present", async () => {
      const page = await createTestPage({
        icon: "search",
      });

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.classList.contains("textfield--has-icon")).toBe(true);
    });

    it("does not render icon when icon prop is null", async () => {
      const page = await createTestPage({
        icon: null,
      });

      const iconWrapper = page.root.querySelector(".textfield__icon");
      expect(iconWrapper).toBeFalsy();
    });

    it("applies trailing modifier to icon when trailingIcon is true", async () => {
      const page = await createTestPage({
        icon: "search",
        trailingIcon: true,
      });

      const iconWrapper = page.root.querySelector(".textfield__icon");
      expect(iconWrapper.classList.contains("textfield__icon--trailing")).toBe(
        true,
      );
    });

    it("applies trailing-icon modifier to textfield when trailingIcon is true", async () => {
      const page = await createTestPage({
        icon: "search",
        trailingIcon: true,
      });

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.classList.contains("textfield--trailing-icon")).toBe(
        true,
      );
    });

    it("calls onIconClick with regular type when icon is clicked", async () => {
      const onIconClickSpy = jest.fn();
      const page = await createTestPage({
        icon: "search",
        onIconClick: onIconClickSpy,
      });

      const iconWrapper = page.root.querySelector(
        ".textfield__icon",
      ) as HTMLElement;
      iconWrapper.click();

      expect(onIconClickSpy).toHaveBeenCalledTimes(1);
      expect(onIconClickSpy).toHaveBeenCalledWith(expect.anything(), "regular");
    });
  });
  //#endregion

  //#region Action Icon
  describe("Action Icon", () => {
    it("renders action icon when trailingIconAction is provided", async () => {
      const page = await createTestPage({
        trailingIconAction: "--lf-icon-clear",
      });

      const actionIcon = page.root.querySelector(".textfield__icon-action");
      expect(actionIcon).toBeTruthy();
    });

    it("does not render action icon when trailingIconAction is not provided", async () => {
      const page = await createTestPage({});

      const actionIcon = page.root.querySelector(".textfield__icon-action");
      expect(actionIcon).toBeFalsy();
    });

    it("applies trailing modifier to action icon", async () => {
      const page = await createTestPage({
        trailingIconAction: "--lf-icon-clear",
      });

      const actionIcon = page.root.querySelector(".textfield__icon-action");
      expect(
        actionIcon.classList.contains("textfield__icon-action--trailing"),
      ).toBe(true);
    });

    it("calls onIconClick with action type when action icon is clicked", async () => {
      const onIconClickSpy = jest.fn();
      const page = await createTestPage({
        trailingIconAction: "--lf-icon-clear",
        onIconClick: onIconClickSpy,
      });

      const actionIcon = page.root.querySelector(
        ".textfield__icon-action",
      ) as HTMLElement;
      actionIcon.click();

      expect(onIconClickSpy).toHaveBeenCalledTimes(1);
      expect(onIconClickSpy).toHaveBeenCalledWith(expect.anything(), "action");
    });
  });
  //#endregion

  //#region Helper Text
  describe("Helper Text", () => {
    it("renders helper text when helper.value is provided", async () => {
      const page = await createTestPage({
        helper: { value: "Enter a valid email" },
      });

      const helperText = page.root.querySelector(".textfield__helper-text");
      expect(helperText).toBeTruthy();
      expect(helperText.textContent).toBe("Enter a valid email");
    });

    it("does not render helper text when helper.value is empty", async () => {
      const page = await createTestPage({
        helper: { value: "" },
      });

      const helperLine = page.root.querySelector(".textfield__helper-line");
      expect(helperLine).toBeFalsy();
    });

    it("does not render helper text when helper is undefined", async () => {
      const page = await createTestPage({});

      const helperLine = page.root.querySelector(".textfield__helper-line");
      expect(helperLine).toBeFalsy();
    });

    it("shows helper text when focused and showWhenFocused is true", async () => {
      const page = await createTestPage({
        helper: { value: "Focus hint", showWhenFocused: true },
        status: new Set(["focused"]),
      });

      const helperText = page.root.querySelector(".textfield__helper-text");
      expect(
        helperText.classList.contains("textfield__helper-text--active"),
      ).toBe(true);
    });

    it("hides helper text when not focused and showWhenFocused is true", async () => {
      const page = await createTestPage({
        helper: { value: "Focus hint", showWhenFocused: true },
        status: new Set([]),
      });

      const helperText = page.root.querySelector(".textfield__helper-text");
      expect(
        helperText.classList.contains("textfield__helper-text--active"),
      ).toBe(false);
    });

    it("always shows helper text when showWhenFocused is false", async () => {
      const page = await createTestPage({
        helper: { value: "Always visible", showWhenFocused: false },
        status: new Set([]),
      });

      const helperText = page.root.querySelector(".textfield__helper-text");
      expect(
        helperText.classList.contains("textfield__helper-text--active"),
      ).toBe(true);
    });
  });
  //#endregion

  //#region Character Counter
  describe("Character Counter", () => {
    it("renders counter when maxLength is provided", async () => {
      const page = await createTestPage({
        maxLength: 100,
        value: "Hello",
        helper: { value: "Help text" },
      });

      const counter = page.root.querySelector(".textfield__counter");
      expect(counter).toBeTruthy();
      expect(counter.textContent).toBe("5 / 100");
    });

    it("does not render counter when maxLength is not provided", async () => {
      const page = await createTestPage({
        helper: { value: "Help text" },
      });

      const counter = page.root.querySelector(".textfield__counter");
      expect(counter).toBeFalsy();
    });

    it("updates counter with current value length", async () => {
      const page = await createTestPage({
        maxLength: 50,
        value: "Test string",
        helper: { value: "Help text" },
      });

      const counter = page.root.querySelector(".textfield__counter");
      expect(counter.textContent).toBe("11 / 50");
    });

    it("shows 0 length for empty value", async () => {
      const page = await createTestPage({
        maxLength: 100,
        value: "",
        helper: { value: "Help text" },
      });

      const counter = page.root.querySelector(".textfield__counter");
      expect(counter.textContent).toBe("0 / 100");
    });

    it("does not render counter for textarea styling", async () => {
      const page = await createTestPage({
        styling: "textarea",
        maxLength: 100,
        helper: { value: "Help text" },
      });

      const counter = page.root.querySelector(".textfield__counter");
      expect(counter).toBeFalsy();
    });
  });
  //#endregion

  //#region JSON Formatting (Textarea)
  describe("JSON Formatting (Textarea)", () => {
    it("applies error class to textarea when formatting error exists and displayBorderOnError is true", async () => {
      const page = await createTestPage({
        styling: "textarea",
        formatJSON: { displayBorderOnError: true, displayErrorAsTitle: false },
        formattingError: "Invalid JSON",
      });

      const textarea = page.root.querySelector("textarea.textfield__input");
      expect(textarea.classList.contains("textfield__input--error")).toBe(true);
    });

    it("does not apply error class when displayBorderOnError is false", async () => {
      const page = await createTestPage({
        styling: "textarea",
        formatJSON: { displayBorderOnError: false, displayErrorAsTitle: false },
        formattingError: "Invalid JSON",
      });

      const textarea = page.root.querySelector("textarea.textfield__input");
      expect(textarea.classList.contains("textfield__input--error")).toBe(
        false,
      );
    });

    it("sets title attribute with error when displayErrorAsTitle is true", async () => {
      const page = await createTestPage({
        styling: "textarea",
        formatJSON: { displayBorderOnError: false, displayErrorAsTitle: true },
        formattingError: "Unexpected token",
      });

      const textarea = page.root.querySelector(
        "textarea.textfield__input",
      ) as HTMLTextAreaElement;
      expect(textarea.title).toBe("Unexpected token");
    });

    it("does not set title attribute when displayErrorAsTitle is false", async () => {
      const page = await createTestPage({
        styling: "textarea",
        formatJSON: { displayBorderOnError: false, displayErrorAsTitle: false },
        formattingError: "Unexpected token",
      });

      const textarea = page.root.querySelector(
        "textarea.textfield__input",
      ) as HTMLTextAreaElement;
      expect(textarea.title).toBe("");
    });

    it("does not apply error styling when formatJSON is null", async () => {
      const page = await createTestPage({
        styling: "textarea",
        formatJSON: null,
        formattingError: "Some error",
      });

      const textarea = page.root.querySelector("textarea.textfield__input");
      expect(textarea.classList.contains("textfield__input--error")).toBe(
        false,
      );
    });
  });
  //#endregion

  //#region Label Rendering
  describe("Label Rendering", () => {
    it("applies has-label modifier when label is present", async () => {
      const page = await createTestPage({
        label: "Username",
      });

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.classList.contains("textfield--has-label")).toBe(true);
    });

    it("does not apply has-label modifier when label is empty", async () => {
      const page = await createTestPage({
        label: "",
      });

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.classList.contains("textfield--has-label")).toBe(false);
    });

    it("does not apply has-label modifier when label is undefined", async () => {
      const page = await createTestPage({});

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.classList.contains("textfield--has-label")).toBe(false);
    });
  });
  //#endregion

  //#region Data Attributes
  describe("Data Attributes", () => {
    it("applies data-cy attribute to input for testing", async () => {
      const page = await createTestPage({});

      const input = page.root.querySelector("input.textfield__input");
      expect(input.getAttribute("data-cy")).toBe("input");
    });

    it("applies data-cy attribute to textarea for testing", async () => {
      const page = await createTestPage({
        styling: "textarea",
      });

      const textarea = page.root.querySelector("textarea.textfield__input");
      expect(textarea.getAttribute("data-cy")).toBe("input");
    });
  });
  //#endregion

  //#region Part Attributes
  describe("Part Attributes", () => {
    it("applies correct part attributes for styling", async () => {
      const page = await createTestPage({
        label: "Test Label",
        maxLength: 100,
        helper: { value: "Help text" },
        styling: "flat",
      });

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.getAttribute("part")).toBe("textfield");

      const input = page.root.querySelector(".textfield__input");
      expect(input.getAttribute("part")).toBe("input");

      const label = page.root.querySelector(".textfield__label");
      expect(label.getAttribute("part")).toBe("label");

      const counter = page.root.querySelector(".textfield__counter");
      expect(counter.getAttribute("part")).toBe("counter");
    });

    it("applies part attribute to textarea", async () => {
      const page = await createTestPage({
        styling: "textarea",
      });

      const textarea = page.root.querySelector("textarea.textfield__input");
      expect(textarea.getAttribute("part")).toBe("input");
    });
  });
  //#endregion

  //#region Edge Cases
  describe("Edge Cases", () => {
    it("handles empty value", async () => {
      const page = await createTestPage({
        value: "",
      });

      const input = page.root.querySelector(
        "input.textfield__input",
      ) as HTMLInputElement;
      expect(input.value).toBe("");
    });

    it("handles special characters in value", async () => {
      const page = await createTestPage({
        value: "<script>alert('xss')</script>",
      });

      const input = page.root.querySelector(
        "input.textfield__input",
      ) as HTMLInputElement;
      expect(input.value).toBe("<script>alert('xss')</script>");
    });

    it("handles unicode characters in value", async () => {
      const page = await createTestPage({
        value: "こんにちは 🎉",
      });

      const input = page.root.querySelector(
        "input.textfield__input",
      ) as HTMLInputElement;
      expect(input.value).toBe("こんにちは 🎉");
    });

    it("handles long text value", async () => {
      const longText = "a".repeat(1000);
      const page = await createTestPage({
        value: longText,
      });

      const input = page.root.querySelector(
        "input.textfield__input",
      ) as HTMLInputElement;
      expect(input.value).toBe(longText);
    });

    it("handles both icon and action icon together", async () => {
      const page = await createTestPage({
        icon: "search",
        trailingIconAction: "--lf-icon-clear",
      });

      const icon = page.root.querySelector(".textfield__icon");
      const actionIcon = page.root.querySelector(".textfield__icon-action");
      expect(icon).toBeTruthy();
      expect(actionIcon).toBeTruthy();
    });

    it("handles all styling modifiers together", async () => {
      const page = await createTestPage({
        disabled: true,
        icon: "user" as LfIconType,
        label: "Full Name",
        status: new Set(["filled", "focused"]),
        trailingIcon: true,
      });

      const textfield = page.root.querySelector(".textfield");
      expect(textfield.classList.contains("textfield--disabled")).toBe(true);
      expect(textfield.classList.contains("textfield--has-icon")).toBe(true);
      expect(textfield.classList.contains("textfield--has-label")).toBe(true);
      expect(textfield.classList.contains("textfield--filled")).toBe(true);
      expect(textfield.classList.contains("textfield--focused")).toBe(true);
      expect(textfield.classList.contains("textfield--trailing-icon")).toBe(
        true,
      );
    });
  });
  //#endregion
});
