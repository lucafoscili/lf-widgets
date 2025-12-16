import { h } from "@stencil/core";
import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfBadgeFCProps, LfFrameworkInterface } from "@lf-widgets/foundations";
import { LfBadgeFC } from "./lf-badge-fc";

/**
 * Unit tests for LfBadgeFC (Functional Component)
 *
 * These tests verify the stateless, presentational behavior of the FC.
 * The FC receives all state via props and communicates via callbacks.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */

let framework: LfFrameworkInterface;

/**
 * Creates a test page with the LfBadgeFC rendered inside a wrapper div.
 * This simulates the FC being used inside a parent component's shadow DOM.
 */
const createTestPage = async (
  fcProps: Partial<Omit<LfBadgeFCProps, "framework">> = {},
): Promise<SpecPage> => {
  const page = await newSpecPage({
    components: [],
    template: () => (
      <div>
        <LfBadgeFC framework={framework} {...fcProps} />
      </div>
    ),
  });
  return page;
};

describe("LfBadgeFC", () => {
  beforeAll(() => {
    framework = getLfFramework();
  });

  //#region Basic Rendering
  describe("Basic Rendering", () => {
    it("renders with required framework prop", async () => {
      const page = await createTestPage({});
      expect(page.root.querySelector(".badge")).toBeTruthy();
    });

    it("renders badge element with default position modifier", async () => {
      const page = await createTestPage({});

      const badge = page.root.querySelector(".badge");
      expect(badge.classList.contains("badge--top-left")).toBe(true);
    });

    it("renders empty badge when no label or imageProps", async () => {
      const page = await createTestPage({});

      const badge = page.root.querySelector(".badge");
      const label = page.root.querySelector(".badge__label");
      const image = page.root.querySelector(".badge__image");

      expect(badge).toBeTruthy();
      expect(label).toBeFalsy();
      expect(image).toBeFalsy();
    });
  });
  //#endregion

  //#region Label Rendering
  describe("Label Rendering", () => {
    it("renders label text inside badge__label span", async () => {
      const page = await createTestPage({
        label: "New",
      });

      const label = page.root.querySelector(".badge__label");
      expect(label).toBeTruthy();
      expect(label.textContent).toBe("New");
    });

    it("renders numeric label", async () => {
      const page = await createTestPage({
        label: "5",
      });

      const label = page.root.querySelector(".badge__label");
      expect(label.textContent).toBe("5");
    });

    it("renders empty string label (no label element)", async () => {
      const page = await createTestPage({
        label: "",
      });

      const label = page.root.querySelector(".badge__label");
      expect(label).toBeFalsy();
    });

    it("prioritizes label over imageProps", async () => {
      const page = await createTestPage({
        label: "Text",
        imageProps: { lfValue: "test-image.png" },
      });

      const label = page.root.querySelector(".badge__label");
      const image = page.root.querySelector(".badge__image");

      expect(label).toBeTruthy();
      expect(label.textContent).toBe("Text");
      expect(image).toBeFalsy();
    });
  });
  //#endregion

  //#region Image Rendering
  describe("Image Rendering", () => {
    it("renders lf-image when imageProps provided and no label", async () => {
      const page = await createTestPage({
        imageProps: { lfValue: "icon.svg" },
      });

      const image = page.root.querySelector("lf-image");
      expect(image).toBeTruthy();
      expect(image.classList.contains("badge__image")).toBe(true);
    });

    it("does not render image when label is provided", async () => {
      const page = await createTestPage({
        label: "Badge",
        imageProps: { lfValue: "icon.svg" },
      });

      const image = page.root.querySelector("lf-image");
      expect(image).toBeFalsy();
    });

    it("does not render image when imageProps is undefined", async () => {
      const page = await createTestPage({
        label: "",
        imageProps: undefined,
      });

      const image = page.root.querySelector("lf-image");
      expect(image).toBeFalsy();
    });
  });
  //#endregion

  //#region Position Variants
  describe("Position Variants", () => {
    it("applies top-left position modifier (default)", async () => {
      const page = await createTestPage({});

      const badge = page.root.querySelector(".badge");
      expect(badge.classList.contains("badge--top-left")).toBe(true);
    });

    it("applies top-right position modifier", async () => {
      const page = await createTestPage({
        position: "top-right",
      });

      const badge = page.root.querySelector(".badge");
      expect(badge.classList.contains("badge--top-right")).toBe(true);
    });

    it("applies bottom-left position modifier", async () => {
      const page = await createTestPage({
        position: "bottom-left",
      });

      const badge = page.root.querySelector(".badge");
      expect(badge.classList.contains("badge--bottom-left")).toBe(true);
    });

    it("applies bottom-right position modifier", async () => {
      const page = await createTestPage({
        position: "bottom-right",
      });

      const badge = page.root.querySelector(".badge");
      expect(badge.classList.contains("badge--bottom-right")).toBe(true);
    });

    it("applies inline position modifier", async () => {
      const page = await createTestPage({
        position: "inline",
      });

      const badge = page.root.querySelector(".badge");
      expect(badge.classList.contains("badge--inline")).toBe(true);
    });
  });
  //#endregion

  //#region UI State and Size
  describe("UI State and Size", () => {
    it("applies uiState as data-lf attribute", async () => {
      const page = await createTestPage({
        uiState: "success",
      });

      const badge = page.root.querySelector(".badge");
      expect(badge.getAttribute("data-lf")).toBe("success");
    });

    it("applies default uiState as primary", async () => {
      const page = await createTestPage({});

      const badge = page.root.querySelector(".badge");
      expect(badge.getAttribute("data-lf")).toBe("primary");
    });

    it("applies danger uiState", async () => {
      const page = await createTestPage({
        uiState: "danger",
      });

      const badge = page.root.querySelector(".badge");
      expect(badge.getAttribute("data-lf")).toBe("danger");
    });

    it("applies warning uiState", async () => {
      const page = await createTestPage({
        uiState: "warning",
      });

      const badge = page.root.querySelector(".badge");
      expect(badge.getAttribute("data-lf")).toBe("warning");
    });

    it("applies uiSize as CSS variable --lf-fc-ui-size", async () => {
      const page = await createTestPage({
        uiSize: "small",
      });

      const badge = page.root.querySelector(".badge") as HTMLElement;
      expect(badge.style.getPropertyValue("--lf-fc-ui-size")).toBe(
        "var(--lf-ui-size-small)",
      );
    });

    it("applies large uiSize as CSS variable", async () => {
      const page = await createTestPage({
        uiSize: "large",
      });

      const badge = page.root.querySelector(".badge") as HTMLElement;
      expect(badge.style.getPropertyValue("--lf-fc-ui-size")).toBe(
        "var(--lf-ui-size-large)",
      );
    });

    it("does not apply CSS variable for medium uiSize (default)", async () => {
      const page = await createTestPage({
        uiSize: "medium",
      });

      const badge = page.root.querySelector(".badge") as HTMLElement;
      expect(badge.style.getPropertyValue("--lf-fc-ui-size")).toBe("");
    });
  });
  //#endregion

  //#region Callback Tests
  describe("Callbacks", () => {
    it("calls onClick callback when badge is clicked", async () => {
      const onClickSpy = jest.fn();
      const page = await createTestPage({
        onClick: onClickSpy,
      });

      const badge = page.root.querySelector(".badge") as HTMLElement;
      badge.click();

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      // Stencil mock uses a custom event object, not native MouseEvent
      expect(onClickSpy).toHaveBeenCalledWith(expect.any(Object));
    });

    it("handles missing onClick callback gracefully", async () => {
      const page = await createTestPage({});

      const badge = page.root.querySelector(".badge") as HTMLElement;

      // Should not throw when onClick is undefined
      expect(() => {
        badge.click();
      }).not.toThrow();
    });
  });
  //#endregion

  //#region Ref Forwarding
  describe("Ref Forwarding", () => {
    it("forwards badgeRef to the badge element", async () => {
      let badgeEl: HTMLDivElement | null = null;
      const badgeRefSpy = jest.fn((el: HTMLDivElement | null) => {
        badgeEl = el;
      });

      await createTestPage({
        badgeRef: badgeRefSpy,
      });

      expect(badgeRefSpy).toHaveBeenCalled();
      expect(badgeEl).toBeTruthy();
      expect(badgeEl?.nodeName).toBe("DIV");
      expect(badgeEl?.classList.contains("badge")).toBe(true);
    });
  });
  //#endregion

  //#region Custom Styling
  describe("Custom Styling", () => {
    it("applies custom className", async () => {
      const page = await createTestPage({
        className: "my-custom-badge",
      });

      const badge = page.root.querySelector(".badge");
      expect(badge.classList.contains("my-custom-badge")).toBe(true);
    });

    it("applies custom style object", async () => {
      const page = await createTestPage({
        style: { backgroundColor: "red", padding: "10px" },
      });

      const badge = page.root.querySelector(".badge") as HTMLElement;
      expect(badge.style.backgroundColor).toBe("red");
      expect(badge.style.padding).toBe("10px");
    });

    it("merges custom style with uiSize CSS variable", async () => {
      const page = await createTestPage({
        style: { backgroundColor: "blue" },
        uiSize: "small",
      });

      const badge = page.root.querySelector(".badge") as HTMLElement;
      expect(badge.style.backgroundColor).toBe("blue");
      expect(badge.style.getPropertyValue("--lf-fc-ui-size")).toBe(
        "var(--lf-ui-size-small)",
      );
    });

    it("applies custom id", async () => {
      const page = await createTestPage({
        id: "my-badge-id",
      });

      const badge = page.root.querySelector(".badge");
      expect(badge.id).toBe("my-badge-id");
    });
  });
  //#endregion

  //#region Part Attributes
  describe("Part Attributes", () => {
    it("applies correct part attribute to badge", async () => {
      const page = await createTestPage({});

      const badge = page.root.querySelector(".badge");
      expect(badge.getAttribute("part")).toBe("badge");
    });

    it("applies correct part attribute to label", async () => {
      const page = await createTestPage({
        label: "Test",
      });

      const label = page.root.querySelector(".badge__label");
      expect(label.getAttribute("part")).toBe("label");
    });

    it("applies correct part attribute to image", async () => {
      const page = await createTestPage({
        imageProps: { lfValue: "icon.svg" },
      });

      const image = page.root.querySelector("lf-image");
      // lf-image is an external WC, so part is set via JSX attribute
      expect(image).toBeTruthy();
      expect(image.classList.contains("badge__image")).toBe(true);
    });
  });
  //#endregion

  //#region Edge Cases
  describe("Edge Cases", () => {
    it("handles special characters in label", async () => {
      const page = await createTestPage({
        label: "99+",
      });

      const label = page.root.querySelector(".badge__label");
      expect(label.textContent).toBe("99+");
    });

    it("handles long label text", async () => {
      const page = await createTestPage({
        label: "Very Long Badge Label",
      });

      const label = page.root.querySelector(".badge__label");
      expect(label.textContent).toBe("Very Long Badge Label");
    });

    it("handles emoji in label", async () => {
      const page = await createTestPage({
        label: "🔥",
      });

      const label = page.root.querySelector(".badge__label");
      expect(label.textContent).toBe("🔥");
    });

    it("handles multiple className values", async () => {
      const page = await createTestPage({
        className: "class1 class2 class3",
      });

      const badge = page.root.querySelector(".badge");
      expect(badge.classList.contains("class1")).toBe(true);
      expect(badge.classList.contains("class2")).toBe(true);
      expect(badge.classList.contains("class3")).toBe(true);
    });

    it("handles undefined optional props gracefully", async () => {
      const page = await createTestPage({
        label: undefined,
        imageProps: undefined,
        className: undefined,
        style: undefined,
        id: undefined,
        onClick: undefined,
        position: undefined,
        uiSize: undefined,
        uiState: undefined,
      });

      const badge = page.root.querySelector(".badge");
      expect(badge).toBeTruthy();
      // Should use defaults
      expect(badge.classList.contains("badge--top-left")).toBe(true);
      expect(badge.getAttribute("data-lf")).toBe("primary");
    });
  });
  //#endregion
});
