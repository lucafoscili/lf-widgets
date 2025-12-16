import { h } from "@stencil/core";
import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfFrameworkInterface, LfImageFCProps } from "@lf-widgets/foundations";
import { LfImageFC } from "./lf-image-fc";

/**
 * Unit tests for LfImageFC (Functional Component)
 *
 * These tests verify the stateless, presentational behavior of the FC.
 * The FC receives all state via props and communicates via callbacks.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */

let framework: LfFrameworkInterface;

/**
 * Creates a test page with the LfImageFC rendered inside a wrapper div.
 * This simulates the FC being used inside a parent component's shadow DOM.
 */
const createTestPage = async (
  fcProps: Partial<Omit<LfImageFCProps, "framework">> = {},
): Promise<SpecPage> => {
  const page = await newSpecPage({
    components: [],
    template: () => (
      <div>
        <LfImageFC framework={framework} value="test.jpg" {...fcProps} />
      </div>
    ),
  });
  return page;
};

describe("LfImageFC", () => {
  beforeAll(() => {
    framework = getLfFramework();
  });

  //#region Basic Rendering
  describe("Basic Rendering", () => {
    it("renders with required framework prop", async () => {
      const page = await createTestPage({});
      expect(page.root.querySelector(".image")).toBeTruthy();
    });

    it("renders img element for URL value", async () => {
      const page = await createTestPage({
        value: "https://example.com/image.jpg",
      });

      const img = page.root.querySelector("img");
      expect(img).toBeTruthy();
      expect(img.getAttribute("src")).toBe("https://example.com/image.jpg");
    });

    it("renders img element for http value", async () => {
      const page = await createTestPage({
        value: "http://example.com/image.jpg",
      });

      const img = page.root.querySelector("img");
      expect(img).toBeTruthy();
      expect(img.getAttribute("src")).toBe("http://example.com/image.jpg");
    });

    it("renders img element for data URL value", async () => {
      const page = await createTestPage({
        value: "data:image/png;base64,abc123",
      });

      const img = page.root.querySelector("img");
      expect(img).toBeTruthy();
      expect(img.getAttribute("src")).toBe("data:image/png;base64,abc123");
    });

    it("renders img element for blob URL value", async () => {
      const page = await createTestPage({
        value: "blob:http://localhost/abc123",
      });

      const img = page.root.querySelector("img");
      expect(img).toBeTruthy();
      expect(img.getAttribute("src")).toBe("blob:http://localhost/abc123");
    });

    it("renders img element for absolute path value", async () => {
      const page = await createTestPage({
        value: "/images/test.jpg",
      });

      const img = page.root.querySelector("img");
      expect(img).toBeTruthy();
      expect(img.getAttribute("src")).toBe("/images/test.jpg");
    });

    it("renders img element for relative path value", async () => {
      const page = await createTestPage({
        value: "./images/test.jpg",
      });

      const img = page.root.querySelector("img");
      expect(img).toBeTruthy();
      expect(img.getAttribute("src")).toBe("./images/test.jpg");
    });

    it("renders icon for non-URL value when loaded", async () => {
      const page = await createTestPage({
        value: "home",
        isLoaded: true,
      });

      const iconContainer = page.root.querySelector(".image__icon");
      expect(iconContainer).toBeTruthy();
    });

    it("does not render icon for non-URL value when not loaded", async () => {
      const page = await createTestPage({
        value: "home",
        isLoaded: false,
      });

      const iconContainer = page.root.querySelector(".image__icon");
      expect(iconContainer).toBeNull();
    });

    it("renders nothing when value is empty and not loaded", async () => {
      const page = await createTestPage({
        value: "",
        isLoaded: false,
      });

      const img = page.root.querySelector("img");
      const iconContainer = page.root.querySelector(".image__icon");
      expect(img).toBeNull();
      expect(iconContainer).toBeNull();
    });
  });
  //#endregion

  //#region Error State
  describe("Error State", () => {
    it("renders error icon when error is true", async () => {
      const page = await createTestPage({
        value: "https://example.com/broken.jpg",
        error: true,
      });

      const iconContainer = page.root.querySelector(".image__icon");
      expect(iconContainer).toBeTruthy();
    });

    it("does not render img element when error is true", async () => {
      const page = await createTestPage({
        value: "https://example.com/broken.jpg",
        error: true,
      });

      const img = page.root.querySelector("img");
      expect(img).toBeNull();
    });

    it("error state takes precedence over URL value", async () => {
      const page = await createTestPage({
        value: "https://example.com/image.jpg",
        error: true,
      });

      const img = page.root.querySelector("img");
      const iconContainer = page.root.querySelector(".image__icon");
      expect(img).toBeNull();
      expect(iconContainer).toBeTruthy();
    });
  });
  //#endregion

  //#region Callback Tests
  describe("Callbacks", () => {
    it("calls onClick callback when image is clicked", async () => {
      const onClickSpy = jest.fn();
      const page = await createTestPage({
        onClick: onClickSpy,
      });

      const imageContainer = page.root.querySelector(".image");
      imageContainer.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      );

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith(expect.any(MouseEvent));
    });

    it("calls onContextMenu callback on right-click", async () => {
      const onContextMenuSpy = jest.fn();
      const page = await createTestPage({
        onContextMenu: onContextMenuSpy,
      });

      const imageContainer = page.root.querySelector(".image");
      imageContainer.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, cancelable: true }),
      );

      expect(onContextMenuSpy).toHaveBeenCalledTimes(1);
      expect(onContextMenuSpy).toHaveBeenCalledWith(expect.any(MouseEvent));
    });

    it("calls onLoad callback when image loads successfully", async () => {
      const onLoadSpy = jest.fn();
      const page = await createTestPage({
        value: "https://example.com/image.jpg",
        onLoad: onLoadSpy,
      });

      const img = page.root.querySelector("img");
      img.dispatchEvent(new Event("load"));

      expect(onLoadSpy).toHaveBeenCalledTimes(1);
      expect(onLoadSpy).toHaveBeenCalledWith(expect.any(Event));
    });

    it("calls onError callback when image fails to load", async () => {
      const onErrorSpy = jest.fn();
      const page = await createTestPage({
        value: "https://example.com/broken.jpg",
        onError: onErrorSpy,
      });

      const img = page.root.querySelector("img");
      img.dispatchEvent(new Event("error"));

      expect(onErrorSpy).toHaveBeenCalledTimes(1);
      expect(onErrorSpy).toHaveBeenCalledWith(expect.any(Event));
    });

    it("handles missing callbacks gracefully", async () => {
      const page = await createTestPage({
        value: "https://example.com/image.jpg",
      });

      const imageContainer = page.root.querySelector(".image");
      const img = page.root.querySelector("img");

      // Should not throw when callbacks are undefined
      expect(() => {
        imageContainer.dispatchEvent(
          new MouseEvent("click", { bubbles: true, cancelable: true }),
        );
        imageContainer.dispatchEvent(
          new MouseEvent("contextmenu", { bubbles: true, cancelable: true }),
        );
        img.dispatchEvent(new Event("load"));
        img.dispatchEvent(new Event("error"));
      }).not.toThrow();
    });
  });
  //#endregion

  //#region Ref Forwarding
  describe("Ref Forwarding", () => {
    it("forwards imageRef to the img element", async () => {
      let imgEl: HTMLImageElement | null = null;
      const imageRefSpy = jest.fn((el: HTMLImageElement | null) => {
        imgEl = el;
      });

      await createTestPage({
        value: "https://example.com/image.jpg",
        imageRef: imageRefSpy,
      });

      expect(imageRefSpy).toHaveBeenCalled();
      expect(imgEl).toBeInstanceOf(HTMLImageElement);
    });
  });
  //#endregion

  //#region UI State and Size
  describe("UI State and Size", () => {
    it("applies uiState as data-lf attribute", async () => {
      const page = await createTestPage({
        uiState: "success",
      });

      const imageContainer = page.root.querySelector(".image");
      expect(imageContainer.getAttribute("data-lf")).toBe("success");
    });

    it("applies default uiState as primary", async () => {
      const page = await createTestPage({});

      const imageContainer = page.root.querySelector(".image");
      expect(imageContainer.getAttribute("data-lf")).toBe("primary");
    });

    it("applies uiSize as CSS variable --lf-fc-ui-size", async () => {
      const page = await createTestPage({
        uiSize: "small",
      });

      const imageContainer = page.root.querySelector(".image") as HTMLElement;
      expect(imageContainer.style.getPropertyValue("--lf-fc-ui-size")).toBe(
        "var(--lf-ui-size-small)",
      );
    });

    it("applies large uiSize as CSS variable", async () => {
      const page = await createTestPage({
        uiSize: "large",
      });

      const imageContainer = page.root.querySelector(".image") as HTMLElement;
      expect(imageContainer.style.getPropertyValue("--lf-fc-ui-size")).toBe(
        "var(--lf-ui-size-large)",
      );
    });

    it("does not apply CSS variable for medium uiSize (default)", async () => {
      const page = await createTestPage({
        uiSize: "medium",
      });

      const imageContainer = page.root.querySelector(".image") as HTMLElement;
      expect(imageContainer.style.getPropertyValue("--lf-fc-ui-size")).toBe("");
    });

    it("applies danger uiState", async () => {
      const page = await createTestPage({
        uiState: "danger",
      });

      const imageContainer = page.root.querySelector(".image");
      expect(imageContainer.getAttribute("data-lf")).toBe("danger");
    });

    it("applies warning uiState", async () => {
      const page = await createTestPage({
        uiState: "warning",
      });

      const imageContainer = page.root.querySelector(".image");
      expect(imageContainer.getAttribute("data-lf")).toBe("warning");
    });
  });
  //#endregion

  //#region Size Properties
  describe("Size Properties", () => {
    it("applies default sizeX and sizeY (100%)", async () => {
      const page = await createTestPage({});

      const imageContainer = page.root.querySelector(".image") as HTMLElement;
      expect(imageContainer.style.getPropertyValue("--lf_image_width")).toBe(
        "100%",
      );
      expect(imageContainer.style.getPropertyValue("--lf_image_height")).toBe(
        "100%",
      );
    });

    it("applies custom sizeX", async () => {
      const page = await createTestPage({
        sizeX: "200px",
      });

      const imageContainer = page.root.querySelector(".image") as HTMLElement;
      expect(imageContainer.style.getPropertyValue("--lf_image_width")).toBe(
        "200px",
      );
    });

    it("applies custom sizeY", async () => {
      const page = await createTestPage({
        sizeY: "150px",
      });

      const imageContainer = page.root.querySelector(".image") as HTMLElement;
      expect(imageContainer.style.getPropertyValue("--lf_image_height")).toBe(
        "150px",
      );
    });

    it("applies both custom sizeX and sizeY", async () => {
      const page = await createTestPage({
        sizeX: "300px",
        sizeY: "200px",
      });

      const imageContainer = page.root.querySelector(".image") as HTMLElement;
      expect(imageContainer.style.getPropertyValue("--lf_image_width")).toBe(
        "300px",
      );
      expect(imageContainer.style.getPropertyValue("--lf_image_height")).toBe(
        "200px",
      );
    });
  });
  //#endregion

  //#region Custom Styling
  describe("Custom Styling", () => {
    it("applies custom className", async () => {
      const page = await createTestPage({
        className: "my-custom-image",
      });

      const imageContainer = page.root.querySelector(".image");
      expect(imageContainer.classList.contains("my-custom-image")).toBe(true);
    });

    it("applies custom style object", async () => {
      const page = await createTestPage({
        style: { color: "red", padding: "10px" },
      });

      const imageContainer = page.root.querySelector(".image") as HTMLElement;
      expect(imageContainer.style.color).toBe("red");
      expect(imageContainer.style.padding).toBe("10px");
    });

    it("merges custom style with size CSS variables", async () => {
      const page = await createTestPage({
        style: { color: "blue" },
        sizeX: "250px",
        sizeY: "180px",
      });

      const imageContainer = page.root.querySelector(".image") as HTMLElement;
      expect(imageContainer.style.color).toBe("blue");
      expect(imageContainer.style.getPropertyValue("--lf_image_width")).toBe(
        "250px",
      );
      expect(imageContainer.style.getPropertyValue("--lf_image_height")).toBe(
        "180px",
      );
    });

    it("merges custom style with uiSize CSS variable", async () => {
      const page = await createTestPage({
        style: { color: "green" },
        uiSize: "small",
      });

      const imageContainer = page.root.querySelector(".image") as HTMLElement;
      expect(imageContainer.style.color).toBe("green");
      expect(imageContainer.style.getPropertyValue("--lf-fc-ui-size")).toBe(
        "var(--lf-ui-size-small)",
      );
    });

    it("applies custom id", async () => {
      const page = await createTestPage({
        id: "my-image-id",
      });

      const imageContainer = page.root.querySelector(".image");
      expect(imageContainer.id).toBe("my-image-id");
    });
  });
  //#endregion

  //#region Data Attributes
  describe("Data Attributes", () => {
    it("applies data-cy attribute to img for testing", async () => {
      const page = await createTestPage({
        value: "https://example.com/image.jpg",
      });

      const img = page.root.querySelector("img");
      expect(img.getAttribute("data-cy")).toBe("image");
    });
  });
  //#endregion

  //#region Part Attributes
  describe("Part Attributes", () => {
    it("applies correct part attribute to image container", async () => {
      const page = await createTestPage({});

      const imageContainer = page.root.querySelector(".image");
      expect(imageContainer.getAttribute("part")).toBe("image");
    });

    it("applies correct part attribute to img element", async () => {
      const page = await createTestPage({
        value: "https://example.com/image.jpg",
      });

      const img = page.root.querySelector("img");
      expect(img.getAttribute("part")).toBe("img");
    });
  });
  //#endregion

  //#region Icon Property
  describe("Icon Property", () => {
    it("uses icon prop when value is non-URL and loaded", async () => {
      const page = await createTestPage({
        value: "default-icon",
        icon: "custom-icon",
        isLoaded: true,
      });

      const iconContainer = page.root.querySelector(".image__icon");
      expect(iconContainer).toBeTruthy();
    });
  });
  //#endregion

  //#region BEM Class Structure
  describe("BEM Class Structure", () => {
    it("applies correct BEM classes for image container", async () => {
      const page = await createTestPage({});

      const imageContainer = page.root.querySelector(".image");
      expect(imageContainer).toBeTruthy();
    });

    it("applies correct BEM classes for img element", async () => {
      const page = await createTestPage({
        value: "https://example.com/image.jpg",
      });

      const img = page.root.querySelector(".image__img");
      expect(img).toBeTruthy();
    });

    it("applies correct BEM classes for icon container", async () => {
      const page = await createTestPage({
        value: "home",
        isLoaded: true,
      });

      const iconContainer = page.root.querySelector(".image__icon");
      expect(iconContainer).toBeTruthy();
    });
  });
  //#endregion

  //#region Edge Cases
  describe("Edge Cases", () => {
    it("handles empty value string", async () => {
      const page = await createTestPage({
        value: "",
      });

      const imageContainer = page.root.querySelector(".image");
      expect(imageContainer).toBeTruthy();

      // Should not render img or icon when value is empty
      const img = page.root.querySelector("img");
      const iconContainer = page.root.querySelector(".image__icon");
      expect(img).toBeNull();
      expect(iconContainer).toBeNull();
    });

    it("handles undefined value (defaults to empty string)", async () => {
      const page = await newSpecPage({
        components: [],
        template: () => (
          <div>
            <LfImageFC framework={framework} />
          </div>
        ),
      });

      const imageContainer = page.root.querySelector(".image");
      expect(imageContainer).toBeTruthy();
    });

    it("handles special characters in URL", async () => {
      const page = await createTestPage({
        value: "https://example.com/image%20name.jpg?query=value&other=123",
      });

      const img = page.root.querySelector("img");
      expect(img.getAttribute("src")).toBe(
        "https://example.com/image%20name.jpg?query=value&other=123",
      );
    });

    it("handles very long URL values", async () => {
      const longUrl = "https://example.com/" + "a".repeat(1000) + ".jpg";
      const page = await createTestPage({
        value: longUrl,
      });

      const img = page.root.querySelector("img");
      expect(img.getAttribute("src")).toBe(longUrl);
    });

    it("preserves className with BEM class", async () => {
      const page = await createTestPage({
        className: "custom-class another-class",
      });

      const imageContainer = page.root.querySelector(".image");
      expect(imageContainer.classList.contains("image")).toBe(true);
      expect(imageContainer.classList.contains("custom-class")).toBe(true);
      expect(imageContainer.classList.contains("another-class")).toBe(true);
    });
  });
  //#endregion
});
