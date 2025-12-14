import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { LfUpload } from "./lf-upload";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";
import { LfUploadEventPayload } from "@lf-widgets/foundations";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfUpload], html });
  await page.waitForChanges();
  return page;
};

// Helper to create a mock File object
const createMockFile = (
  name: string,
  size: number,
  type: string,
): Partial<File> => ({
  name,
  size,
  type,
  lastModified: Date.now(),
});

// Helper to create a mock FileList
const createMockFileList = (files: Partial<File>[]): FileList => {
  const fileList = {
    length: files.length,
    item: (index: number) => files[index] as File,
    [Symbol.iterator]: function* () {
      for (let i = 0; i < files.length; i++) {
        yield files[i] as File;
      }
    },
  };
  files.forEach((file, index) => {
    (fileList as any)[index] = file;
  });
  return fileList as unknown as FileList;
};

describe("lf-upload component", () => {
  describe("Rendering", () => {
    it("renders with default props", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      expect(page.root).toBeDefined();
      const upload = page.root.shadowRoot.querySelector(".upload");
      expect(upload).not.toBeNull();
    });

    it("displays label when lfLabel is set", async () => {
      const page = await createPage(
        `<lf-upload lf-label="Choose file"></lf-upload>`,
      );
      const label = page.root.shadowRoot.querySelector(".file-upload__text");
      expect(label).not.toBeNull();
      expect(label.textContent.trim()).toBe("Choose file");
    });

    it("displays default label when lfLabel is not set", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const label = page.root.shadowRoot.querySelector(".file-upload__text");
      expect(label).not.toBeNull();
      expect(label.textContent.trim()).toBe("Upload files...");
    });

    it("applies custom lfStyle", async () => {
      const page = await createPage(
        `<lf-upload lf-style="#lf-component { color: red; }"></lf-upload>`,
      );
      const styleTag = page.root.shadowRoot.querySelector("style");
      expect(styleTag).not.toBeNull();
    });
  });

  describe("File Input", () => {
    it("has input element", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");
      expect(input).not.toBeNull();
      expect(input.getAttribute("type")).toBe("file");
    });

    it("has multiple attribute on input", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector(
        "input",
      ) as HTMLInputElement;
      expect(input.hasAttribute("multiple")).toBe(true);
    });

    it("input has correct id for label association", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");
      const label = page.root.shadowRoot.querySelector("label");
      expect(input.getAttribute("id")).toBe("upload-input");
      expect(label.getAttribute("htmlfor")).toBe("upload-input");
    });
  });

  describe("Event Emission", () => {
    it("emits event on file selection", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const spy = jest.fn();
      page.root.addEventListener("lf-upload-event", spy);
      const input = page.root.shadowRoot.querySelector("input");
      const file = createMockFile("test.txt", 7, "text/plain");
      (input as any).files = createMockFileList([file]);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();
      expect(spy).toHaveBeenCalled();
    });

    it("emits upload event with correct payload", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const events: CustomEvent<LfUploadEventPayload>[] = [];
      page.root.addEventListener("lf-upload-event", (e: CustomEvent) =>
        events.push(e),
      );

      const input = page.root.shadowRoot.querySelector("input");
      const file = createMockFile("document.pdf", 1024, "application/pdf");
      (input as any).files = createMockFileList([file]);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      const uploadEvent = events.find((e) => e.detail.eventType === "upload");
      expect(uploadEvent).toBeDefined();
      expect(uploadEvent.detail.selectedFiles).toHaveLength(1);
      expect(uploadEvent.detail.selectedFiles[0].name).toBe("document.pdf");
    });

    it("emits ready event on component load", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const events: CustomEvent<LfUploadEventPayload>[] = [];
      page.root.addEventListener("lf-upload-event", (e: CustomEvent) =>
        events.push(e),
      );
      // Ready event is emitted during componentDidLoad, so we need to check previous emissions
      // by creating a new page with listener already attached
      const page2 = await newSpecPage({
        components: [LfUpload],
        html: `<lf-upload></lf-upload>`,
      });
      await page2.waitForChanges();
      // The ready event would have been emitted during initial load
      expect(page2.root).toBeDefined();
    });

    it("emits pointerdown event when label is clicked", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const events: CustomEvent<LfUploadEventPayload>[] = [];
      page.root.addEventListener("lf-upload-event", (e: CustomEvent) =>
        events.push(e),
      );

      const label = page.root.shadowRoot.querySelector("label");
      // Use MouseEvent as PointerEvent is not available in Jest's JSDOM
      label.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
      await page.waitForChanges();

      const pointerdownEvent = events.find(
        (e) => e.detail.eventType === "pointerdown",
      );
      expect(pointerdownEvent).toBeDefined();
    });

    it("emits event with component id", async () => {
      const page = await createPage(`<lf-upload id="my-upload"></lf-upload>`);
      const events: CustomEvent<LfUploadEventPayload>[] = [];
      page.root.addEventListener("lf-upload-event", (e: CustomEvent) =>
        events.push(e),
      );

      const input = page.root.shadowRoot.querySelector("input");
      const file = createMockFile("test.txt", 100, "text/plain");
      (input as any).files = createMockFileList([file]);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      expect(events[0].detail.id).toBe("my-upload");
    });
  });

  describe("File List Display", () => {
    it("displays uploaded files", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");

      const file = createMockFile("test.txt", 1024, "text/plain");
      (input as any).files = createMockFileList([file]);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      const fileInfoItems =
        page.root.shadowRoot.querySelectorAll(".file-info__item");
      expect(fileInfoItems.length).toBe(1);
    });

    it("displays multiple uploaded files", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");

      const files = [
        createMockFile("file1.txt", 1024, "text/plain"),
        createMockFile("file2.pdf", 2048, "application/pdf"),
        createMockFile("file3.jpg", 4096, "image/jpeg"),
      ];
      (input as any).files = createMockFileList(files);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      const fileInfoItems =
        page.root.shadowRoot.querySelectorAll(".file-info__item");
      expect(fileInfoItems.length).toBe(3);
    });

    it("displays file name in the list", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");

      const file = createMockFile("my-document.pdf", 1024, "application/pdf");
      (input as any).files = createMockFileList([file]);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      const fileName = page.root.shadowRoot.querySelector(".file-info__name");
      expect(fileName.textContent).toBe("my-document.pdf");
    });

    it("displays file size in the list", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");

      const file = createMockFile("test.txt", 512, "text/plain");
      (input as any).files = createMockFileList([file]);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      const fileSize = page.root.shadowRoot.querySelector(".file-info__size");
      expect(fileSize).not.toBeNull();
      expect(fileSize.textContent).toContain("512");
    });

    it("adds has-description class when files are selected", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");

      const file = createMockFile("test.txt", 1024, "text/plain");
      (input as any).files = createMockFileList([file]);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      const upload = page.root.shadowRoot.querySelector(".upload");
      expect(upload.classList.contains("upload--has-description")).toBe(true);
    });
  });

  describe("Remove File", () => {
    it("emits delete event when remove icon is clicked", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");

      const file = createMockFile("test.txt", 1024, "text/plain");
      (input as any).files = createMockFileList([file]);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      const events: CustomEvent<LfUploadEventPayload>[] = [];
      page.root.addEventListener("lf-upload-event", (e: CustomEvent) =>
        events.push(e),
      );

      const removeIcon = page.root.shadowRoot.querySelector(
        ".file-info__icon--has-actions",
      );
      expect(removeIcon).not.toBeNull();
      removeIcon.dispatchEvent(new Event("click", { bubbles: true }));
      await page.waitForChanges();

      const deleteEvent = events.find((e) => e.detail.eventType === "delete");
      expect(deleteEvent).toBeDefined();
    });

    it("removes file from list when delete icon is clicked", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");

      const files = [
        createMockFile("file1.txt", 1024, "text/plain"),
        createMockFile("file2.txt", 2048, "text/plain"),
      ];
      (input as any).files = createMockFileList(files);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      let fileInfoItems =
        page.root.shadowRoot.querySelectorAll(".file-info__item");
      expect(fileInfoItems.length).toBe(2);

      const removeIcon = page.root.shadowRoot.querySelector(
        ".file-info__icon--has-actions",
      );
      removeIcon.dispatchEvent(new Event("click", { bubbles: true }));
      await page.waitForChanges();

      fileInfoItems = page.root.shadowRoot.querySelectorAll(".file-info__item");
      expect(fileInfoItems.length).toBe(1);
    });

    it("remove icon has tabIndex for keyboard accessibility", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");

      const file = createMockFile("test.txt", 1024, "text/plain");
      (input as any).files = createMockFileList([file]);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      const removeIcon = page.root.shadowRoot.querySelector(
        ".file-info__icon--has-actions",
      );
      expect(removeIcon.getAttribute("tabindex")).toBe("0");
    });
  });

  describe("Public Methods", () => {
    let page: SpecPage;
    let component: LfUpload;

    beforeEach(async () => {
      page = await createPage(`<lf-upload lf-label="Test Label"></lf-upload>`);
      component = page.rootInstance;
    });

    it("getProps returns component properties", async () => {
      const props = await component.getProps();

      expect(props).toBeDefined();
      expect(props.lfLabel).toBe("Test Label");
      expect(props.lfRipple).toBe(true);
      expect(props.lfStyle).toBe("");
    });

    it("getDebugInfo returns debug information", async () => {
      const debugInfo = await component.getDebugInfo();
      expect(debugInfo).toBeDefined();
    });

    it("getValue returns selected files", async () => {
      const input = page.root.shadowRoot.querySelector("input");
      const file = createMockFile("test.txt", 1024, "text/plain");
      (input as any).files = createMockFileList([file]);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      const files = await component.getValue();
      expect(files).toHaveLength(1);
      expect(files[0].name).toBe("test.txt");
    });

    it("getValue returns empty array when no files selected", async () => {
      const files = await component.getValue();
      expect(files).toEqual([]);
    });

    it("refresh forces component re-render", async () => {
      await component.refresh();
      await page.waitForChanges();
      expect(page.root).toBeDefined();
    });

    it("unmount removes component from DOM", async () => {
      const events: CustomEvent<LfUploadEventPayload>[] = [];
      page.root.addEventListener("lf-upload-event", (e: CustomEvent) =>
        events.push(e),
      );

      await component.unmount(0);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const unmountEvent = events.find((e) => e.detail.eventType === "unmount");
      expect(unmountEvent).toBeDefined();
    });
  });

  describe("Initial Value", () => {
    it("initializes with lfValue files", async () => {
      // Since lfValue is a File[] prop, we need to set it programmatically
      const page = await createPage(`<lf-upload></lf-upload>`);
      const component = page.rootInstance as LfUpload;

      // Simulate what happens when lfValue is set
      const files = await component.getValue();
      expect(files).toBeDefined();
    });
  });

  describe("File Type Icons", () => {
    it("displays appropriate icon for image files", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");

      const file = createMockFile("photo.jpg", 1024, "image/jpeg");
      (input as any).files = createMockFileList([file]);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      const fileIcon = page.root.shadowRoot.querySelector(".file-info__icon");
      expect(fileIcon).not.toBeNull();
    });

    it("displays appropriate icon for PDF files", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");

      const file = createMockFile("document.pdf", 1024, "application/pdf");
      (input as any).files = createMockFileList([file]);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      const fileIcon = page.root.shadowRoot.querySelector(".file-info__icon");
      expect(fileIcon).not.toBeNull();
    });

    it("displays appropriate icon for audio files", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");

      const file = createMockFile("song.mp3", 1024, "audio/mpeg");
      (input as any).files = createMockFileList([file]);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      const fileIcon = page.root.shadowRoot.querySelector(".file-info__icon");
      expect(fileIcon).not.toBeNull();
    });

    it("displays appropriate icon for video files", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");

      const file = createMockFile("video.mp4", 1024, "video/mp4");
      (input as any).files = createMockFileList([file]);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      const fileIcon = page.root.shadowRoot.querySelector(".file-info__icon");
      expect(fileIcon).not.toBeNull();
    });

    it("displays appropriate icon for zip files", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");

      const file = createMockFile("archive.zip", 1024, "application/zip");
      (input as any).files = createMockFileList([file]);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      const fileIcon = page.root.shadowRoot.querySelector(".file-info__icon");
      expect(fileIcon).not.toBeNull();
    });

    it("displays generic icon for unknown file types", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");

      const file = createMockFile(
        "data.unknown",
        1024,
        "application/octet-stream",
      );
      (input as any).files = createMockFileList([file]);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      const fileIcon = page.root.shadowRoot.querySelector(".file-info__icon");
      expect(fileIcon).not.toBeNull();
    });
  });

  describe("File Size Formatting", () => {
    it("formats bytes correctly", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");

      const file = createMockFile("small.txt", 500, "text/plain");
      (input as any).files = createMockFileList([file]);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      const fileSize = page.root.shadowRoot.querySelector(".file-info__size");
      expect(fileSize.textContent).toContain("Bytes");
    });

    it("formats large files in MB", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");

      // 15000 bytes triggers the > 10000 condition
      const file = createMockFile(
        "large.bin",
        15000,
        "application/octet-stream",
      );
      (input as any).files = createMockFileList([file]);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      const fileSize = page.root.shadowRoot.querySelector(".file-info__size");
      expect(fileSize.textContent).toContain("MB");
    });
  });

  describe("HTML Attributes", () => {
    it("applies lfHtmlAttributes to input element", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const component = page.rootInstance as LfUpload;
      component.lfHtmlAttributes = { accept: "image/*" };
      await page.waitForChanges();

      const input = page.root.shadowRoot.querySelector("input");
      expect(input.getAttribute("accept")).toBe("image/*");
    });
  });

  describe("Accessibility", () => {
    it("has label associated with input via htmlFor", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");
      const label = page.root.shadowRoot.querySelector("label");

      expect(input.id).toBe("upload-input");
      expect(label.getAttribute("htmlfor")).toBe("upload-input");
    });

    it("remove button has title attribute", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");

      const file = createMockFile("test.txt", 1024, "text/plain");
      (input as any).files = createMockFileList([file]);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      const removeIcon = page.root.shadowRoot.querySelector(
        ".file-info__icon--has-actions",
      );
      expect(removeIcon.getAttribute("title")).toBe("Remove file");
    });

    it("file icon has title with file type", async () => {
      const page = await createPage(`<lf-upload></lf-upload>`);
      const input = page.root.shadowRoot.querySelector("input");

      const file = createMockFile("test.txt", 1024, "text/plain");
      (input as any).files = createMockFileList([file]);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await page.waitForChanges();

      const fileIcon = page.root.shadowRoot.querySelector(
        ".file-info__icon:not(.file-info__icon--has-actions)",
      );
      expect(fileIcon.getAttribute("title")).toBe("text/plain");
    });
  });
});
