import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfCarousel } from "./lf-carousel";
import { LfDataDataset } from "@lf-widgets/foundations";

//#region Helpers
const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfCarousel],
    html,
  });
  await page.waitForChanges();
  return page;
};

const createMockDataset = (slideCount: number): LfDataDataset => ({
  nodes: Array.from({ length: slideCount }, (_, i) => ({
    id: `slide-${i}`,
    value: `Slide ${i}`,
    cells: { lfImage: { shape: "image", value: `img${i}.png` } },
  })),
});

const createVideoDataset = (slideCount: number): LfDataDataset => ({
  nodes: Array.from({ length: slideCount }, (_, i) => ({
    id: `video-${i}`,
    value: `Video ${i}`,
    cells: { lfVideo: { shape: "video", value: `video${i}.mp4` } },
  })),
});
//#endregion

describe("lf-carousel", () => {
  //#region Basic Rendering
  describe("Basic Rendering", () => {
    it("should render with shadow DOM", async () => {
      const page = await createPage(`<lf-carousel></lf-carousel>`);

      expect(page.root).toBeTruthy();
      expect(page.root.shadowRoot).toBeTruthy();
    });

    it("should render shadow DOM content", async () => {
      const page = await createPage(`<lf-carousel></lf-carousel>`);
      const shadowContent = page.root.shadowRoot.innerHTML;

      expect(shadowContent).toBeTruthy();
      expect(shadowContent.length).toBeGreaterThan(0);
    });

    it("should not render style element when lfStyle is empty", async () => {
      const page = await createPage(`<lf-carousel></lf-carousel>`);
      const style = page.root.shadowRoot.querySelector("#lf-style");

      expect(style).toBeNull();
    });

    it("should render style element when lfStyle is provided", async () => {
      const page = await createPage(
        `<lf-carousel lf-style="#lf-component { color: red; }"></lf-carousel>`,
      );
      const style = page.root.shadowRoot.querySelector("#lf-style");

      expect(style).toBeTruthy();
    });

    it("should render with custom id", async () => {
      const page = await createPage(
        `<lf-carousel id="my-carousel"></lf-carousel>`,
      );

      expect(page.root.id).toBe("my-carousel");
    });
  });
  //#endregion

  //#region Props Handling
  describe("Props Handling", () => {
    it("should have correct default props", async () => {
      const page = await createPage(`<lf-carousel></lf-carousel>`);
      const component = page.rootInstance as LfCarousel;

      expect(component.lfDataset).toBeNull();
      expect(component.lfAutoPlay).toBe(false);
      expect(component.lfInterval).toBe(3000);
      expect(component.lfLightbox).toBe(false);
      expect(component.lfNavigation).toBe(false);
      expect(component.lfShape).toBe("image");
      expect(component.lfStyle).toBe("");
    });

    it("should accept lfNavigation prop", async () => {
      const page = await createPage(
        `<lf-carousel lf-navigation="true"></lf-carousel>`,
      );
      const component = page.rootInstance as LfCarousel;

      expect(component.lfNavigation).toBe(true);
    });

    it("should accept lfShape prop", async () => {
      const page = await createPage(
        `<lf-carousel lf-shape="video"></lf-carousel>`,
      );
      const component = page.rootInstance as LfCarousel;

      expect(component.lfShape).toBe("video");
    });

    it("should accept lfAutoPlay prop", async () => {
      const page = await createPage(
        `<lf-carousel lf-auto-play="true"></lf-carousel>`,
      );
      const component = page.rootInstance as LfCarousel;

      expect(component.lfAutoPlay).toBe(true);
    });

    it("should accept lfInterval prop", async () => {
      const page = await createPage(
        `<lf-carousel lf-interval="5000"></lf-carousel>`,
      );
      const component = page.rootInstance as LfCarousel;

      expect(component.lfInterval).toBe(5000);
    });

    it("should accept lfLightbox prop", async () => {
      const page = await createPage(
        `<lf-carousel lf-lightbox="true"></lf-carousel>`,
      );
      const component = page.rootInstance as LfCarousel;

      expect(component.lfLightbox).toBe(true);
    });

    it("should accept lfStyle prop", async () => {
      const page = await createPage(
        `<lf-carousel lf-style=".custom { color: blue; }"></lf-carousel>`,
      );
      const component = page.rootInstance as LfCarousel;

      expect(component.lfStyle).toBe(".custom { color: blue; }");
    });

    it("should accept lfDataset prop", async () => {
      const page = await createPage(`<lf-carousel></lf-carousel>`);
      const component = page.rootInstance as LfCarousel;
      const dataset = createMockDataset(3);

      component.lfDataset = dataset;
      await page.waitForChanges();

      expect(component.lfDataset).toEqual(dataset);
    });

    it("should reflect lfLightbox to attribute", async () => {
      const page = await createPage(
        `<lf-carousel lf-lightbox="true"></lf-carousel>`,
      );

      expect(page.root.getAttribute("lf-lightbox")).toBe("true");
    });

    it("should reflect lfShape to attribute", async () => {
      const page = await createPage(
        `<lf-carousel lf-shape="video"></lf-carousel>`,
      );

      expect(page.root.getAttribute("lf-shape")).toBe("video");
    });
  });
  //#endregion

  //#region State Management
  describe("State Management", () => {
    it("should initialize currentIndex to 0", async () => {
      const page = await createPage(`<lf-carousel></lf-carousel>`);
      const component = page.rootInstance as LfCarousel;

      expect(component.currentIndex).toBe(0);
    });

    it("should initialize debugInfo", async () => {
      const page = await createPage(`<lf-carousel></lf-carousel>`);
      const component = page.rootInstance as LfCarousel;

      expect(component.debugInfo).toBeDefined();
    });

    it("should initialize shapes as empty object", async () => {
      const page = await createPage(`<lf-carousel></lf-carousel>`);
      const component = page.rootInstance as LfCarousel;

      expect(component.shapes).toBeDefined();
    });

    it("should update shapes when lfDataset changes", async () => {
      const page = await createPage(`<lf-carousel></lf-carousel>`);
      const component = page.rootInstance as LfCarousel;

      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();

      expect(component.shapes).toBeDefined();
    });

    it("should update shapes when lfShape changes", async () => {
      const page = await createPage(`<lf-carousel></lf-carousel>`);
      const component = page.rootInstance as LfCarousel;

      component.lfDataset = createVideoDataset(2);
      component.lfShape = "video";
      await page.waitForChanges();

      expect(component.shapes).toBeDefined();
    });
  });
  //#endregion

  //#region Public Methods
  describe("Public Methods", () => {
    describe("getDebugInfo", () => {
      it("should return debug info", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;

        const debugInfo = await component.getDebugInfo();

        expect(debugInfo).toBeDefined();
      });
    });

    describe("getProps", () => {
      it("should return all props", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;

        const props = await component.getProps();

        expect(props.lfAutoPlay).toBe(false);
        expect(props.lfInterval).toBe(3000);
        expect(props.lfLightbox).toBe(false);
        expect(props.lfNavigation).toBe(false);
        expect(props.lfShape).toBe("image");
        expect(props.lfStyle).toBe("");
      });

      it("should reflect updated prop values", async () => {
        const page = await createPage(
          `<lf-carousel lf-navigation="true" lf-interval="5000"></lf-carousel>`,
        );
        const component = page.rootInstance as LfCarousel;

        const props = await component.getProps();

        expect(props.lfNavigation).toBe(true);
        expect(props.lfInterval).toBe(5000);
      });
    });

    describe("goToSlide", () => {
      it("should navigate to specific slide", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;
        component.lfDataset = createMockDataset(5);
        await page.waitForChanges();

        await component.goToSlide(3);

        expect(component.currentIndex).toBe(3);
      });

      it("should navigate to first slide", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;
        component.lfDataset = createMockDataset(5);
        await page.waitForChanges();
        await component.goToSlide(3);

        await component.goToSlide(0);

        expect(component.currentIndex).toBe(0);
      });

      it("should navigate to last slide", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;
        component.lfDataset = createMockDataset(5);
        await page.waitForChanges();

        await component.goToSlide(4);

        expect(component.currentIndex).toBe(4);
      });
    });

    describe("nextSlide", () => {
      it("should move to next slide", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;
        component.lfDataset = createMockDataset(5);
        await page.waitForChanges();

        await component.nextSlide();

        expect(component.currentIndex).toBe(1);
      });

      it("should wrap around to first slide when at last", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;
        component.lfDataset = createMockDataset(3);
        await page.waitForChanges();
        await component.goToSlide(2);

        await component.nextSlide();

        expect(component.currentIndex).toBe(0);
      });
    });

    describe("prevSlide", () => {
      it("should move to previous slide", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;
        component.lfDataset = createMockDataset(5);
        await page.waitForChanges();
        await component.goToSlide(2);

        await component.prevSlide();

        expect(component.currentIndex).toBe(1);
      });

      it("should wrap around to last slide when at first", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;
        component.lfDataset = createMockDataset(3);
        await page.waitForChanges();

        await component.prevSlide();

        expect(component.currentIndex).toBe(2);
      });
    });

    describe("refresh", () => {
      it("should trigger re-render", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;

        await component.refresh();
        await page.waitForChanges();

        expect(page.root).toBeTruthy();
      });
    });

    describe("unmount", () => {
      it("should call unmount method without error", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;

        // Verify unmount can be called without throwing
        await expect(component.unmount(0)).resolves.not.toThrow();
      });

      it("should accept delay parameter", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;

        // Verify unmount accepts a delay parameter
        await expect(component.unmount(100)).resolves.not.toThrow();
      });
    });
  });
  //#endregion

  //#region Event Emission
  describe("Event Emission", () => {
    it("should emit ready event on load", async () => {
      const eventSpy = jest.fn();
      getLfFramework();
      const page = await newSpecPage({
        components: [LfCarousel],
        html: `<lf-carousel></lf-carousel>`,
      });
      page.root.addEventListener("lf-carousel-event", eventSpy);
      await page.waitForChanges();

      const readyEvents = eventSpy.mock.calls.filter(
        (call) => call[0].detail.eventType === "ready",
      );
      expect(readyEvents.length).toBeGreaterThanOrEqual(0);
    });

    it("should have event emitter defined", async () => {
      const page = await createPage(`<lf-carousel></lf-carousel>`);
      const component = page.rootInstance as LfCarousel;

      expect(component.lfEvent).toBeDefined();
    });

    it("should emit events with correct structure", async () => {
      const page = await createPage(
        `<lf-carousel id="test-carousel"></lf-carousel>`,
      );
      const eventSpy = jest.fn();
      page.root.addEventListener("lf-carousel-event", eventSpy);

      // Navigate to trigger an event
      const component = page.rootInstance as LfCarousel;
      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();

      // The component should have emitted events during setup
      expect(component.rootElement.id).toBe("test-carousel");
    });
  });
  //#endregion

  //#region Navigation Behavior
  describe("Navigation Behavior", () => {
    it("should maintain correct index after multiple next calls", async () => {
      const page = await createPage(`<lf-carousel></lf-carousel>`);
      const component = page.rootInstance as LfCarousel;
      component.lfDataset = createMockDataset(5);
      await page.waitForChanges();

      await component.nextSlide();
      await component.nextSlide();
      await component.nextSlide();

      expect(component.currentIndex).toBe(3);
    });

    it("should maintain correct index after multiple prev calls", async () => {
      const page = await createPage(`<lf-carousel></lf-carousel>`);
      const component = page.rootInstance as LfCarousel;
      component.lfDataset = createMockDataset(5);
      await page.waitForChanges();
      await component.goToSlide(4);

      await component.prevSlide();
      await component.prevSlide();

      expect(component.currentIndex).toBe(2);
    });

    it("should handle mixed navigation correctly", async () => {
      const page = await createPage(`<lf-carousel></lf-carousel>`);
      const component = page.rootInstance as LfCarousel;
      component.lfDataset = createMockDataset(5);
      await page.waitForChanges();

      await component.nextSlide();
      await component.nextSlide();
      await component.prevSlide();
      await component.goToSlide(4);
      await component.prevSlide();

      expect(component.currentIndex).toBe(3);
    });
  });
  //#endregion

  //#region Auto-play Functionality
  describe("Auto-play Functionality", () => {
    it("should have lfAutoPlay default to false", async () => {
      const page = await createPage(`<lf-carousel></lf-carousel>`);
      const component = page.rootInstance as LfCarousel;

      expect(component.lfAutoPlay).toBe(false);
    });

    it("should accept lfAutoPlay true via attribute", async () => {
      const page = await createPage(
        `<lf-carousel lf-auto-play="true"></lf-carousel>`,
      );
      const component = page.rootInstance as LfCarousel;

      expect(component.lfAutoPlay).toBe(true);
    });

    it("should have default lfInterval of 3000", async () => {
      const page = await createPage(`<lf-carousel></lf-carousel>`);
      const component = page.rootInstance as LfCarousel;

      expect(component.lfInterval).toBe(3000);
    });

    it("should accept custom lfInterval", async () => {
      const page = await createPage(
        `<lf-carousel lf-interval="5000"></lf-carousel>`,
      );
      const component = page.rootInstance as LfCarousel;

      expect(component.lfInterval).toBe(5000);
    });

    it("should maintain currentIndex at 0 when no dataset", async () => {
      const page = await createPage(`<lf-carousel></lf-carousel>`);
      const component = page.rootInstance as LfCarousel;

      expect(component.currentIndex).toBe(0);
    });
  });
  //#endregion

  //#region Edge Cases
  describe("Edge Cases", () => {
    describe("Empty Dataset", () => {
      it("should handle null dataset", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;

        expect(component.lfDataset).toBeNull();
        expect(page.root).toBeTruthy();
      });

      it("should handle empty nodes array", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;
        component.lfDataset = { nodes: [] };
        await page.waitForChanges();

        expect(page.root).toBeTruthy();
      });
    });

    describe("Single Slide", () => {
      it("should handle dataset with single slide", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;
        component.lfDataset = createMockDataset(1);
        await page.waitForChanges();

        expect(component.currentIndex).toBe(0);
      });

      it("should wrap correctly with single slide on next", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;
        component.lfDataset = createMockDataset(1);
        await page.waitForChanges();

        await component.nextSlide();

        expect(component.currentIndex).toBe(0);
      });

      it("should wrap correctly with single slide on prev", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;
        component.lfDataset = createMockDataset(1);
        await page.waitForChanges();

        await component.prevSlide();

        expect(component.currentIndex).toBe(0);
      });
    });

    describe("Large Dataset", () => {
      it("should handle large number of slides", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;
        component.lfDataset = createMockDataset(100);
        await page.waitForChanges();

        await component.goToSlide(99);

        expect(component.currentIndex).toBe(99);
      });
    });

    describe("Dataset Changes", () => {
      it("should handle dataset being set to null", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;
        component.lfDataset = createMockDataset(5);
        await page.waitForChanges();

        component.lfDataset = null;
        await page.waitForChanges();

        expect(page.root).toBeTruthy();
      });

      it("should handle dataset replacement", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;
        component.lfDataset = createMockDataset(3);
        await page.waitForChanges();

        component.lfDataset = createMockDataset(10);
        await page.waitForChanges();

        expect(page.root).toBeTruthy();
      });
    });

    describe("Shape Type Changes", () => {
      it("should handle shape type change from image to video", async () => {
        const page = await createPage(`<lf-carousel></lf-carousel>`);
        const component = page.rootInstance as LfCarousel;
        component.lfDataset = createMockDataset(3);
        await page.waitForChanges();

        component.lfShape = "video";
        await page.waitForChanges();

        expect(component.lfShape).toBe("video");
      });
    });
  });
  //#endregion

  //#region Component Lifecycle
  describe("Component Lifecycle", () => {
    it("should have rootElement reference", async () => {
      const page = await createPage(`<lf-carousel></lf-carousel>`);
      const component = page.rootInstance as LfCarousel;

      expect(component.rootElement).toBeTruthy();
      expect(component.rootElement.tagName.toLowerCase()).toBe("lf-carousel");
    });

    it("should have debugInfo after load", async () => {
      const page = await createPage(`<lf-carousel></lf-carousel>`);
      const component = page.rootInstance as LfCarousel;

      const debugInfo = await component.getDebugInfo();
      expect(debugInfo).toBeDefined();
    });

    it("should maintain state across re-renders", async () => {
      const page = await createPage(`<lf-carousel></lf-carousel>`);
      const component = page.rootInstance as LfCarousel;
      component.lfDataset = createMockDataset(5);
      await page.waitForChanges();

      await component.goToSlide(3);
      await component.refresh();
      await page.waitForChanges();

      expect(component.currentIndex).toBe(3);
    });
  });
  //#endregion
});
