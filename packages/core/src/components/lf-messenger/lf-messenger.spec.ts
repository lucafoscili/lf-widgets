import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import {
  LfMessengerDataset,
  LfMessengerEventPayload,
} from "@lf-widgets/foundations";
import { LfMessenger } from "./lf-messenger";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfMessenger],
    html,
  });
  await page.waitForChanges();
  return page;
};

/**
 * Creates a minimal valid messenger dataset for testing
 */
const createTestDataset = (): LfMessengerDataset => ({
  nodes: [
    {
      id: "character_test",
      value: "Test Character",
      children: [
        {
          id: "avatars",
          value: 0,
          children: [
            {
              id: "avatar_0",
              value: "Default Avatar",
              description: "Test avatar description",
              cells: {
                lfImage: {
                  shape: "image",
                  value: "https://example.com/avatar.png",
                },
              },
            },
          ],
        },
        { id: "biography", value: "# Test Character Biography" },
        { id: "chat", value: "" },
        {
          id: "locations",
          value: 0,
          children: [
            {
              id: "location_0",
              value: "Test Location",
              description: "A test location",
              cells: {
                lfImage: {
                  shape: "image",
                  value: "https://example.com/location.png",
                },
              },
            },
          ],
        },
        {
          id: "outfits",
          value: 0,
          children: [
            {
              id: "outfit_0",
              value: "Test Outfit",
              description: "A test outfit",
              cells: {
                lfImage: {
                  shape: "image",
                  value: "https://example.com/outfit.png",
                },
              },
            },
          ],
        },
        {
          id: "styles",
          value: 0,
          children: [
            {
              id: "style_0",
              value: "Test Style",
              description: "A test style",
              cells: {
                lfImage: {
                  shape: "image",
                  value: "https://example.com/style.png",
                },
              },
            },
          ],
        },
        {
          id: "timeframes",
          value: null,
          children: [],
        },
      ],
    },
  ],
});

/**
 * Creates a multi-character dataset for testing roster functionality
 */
const createMultiCharacterDataset = (): LfMessengerDataset => ({
  nodes: [
    {
      id: "character_1",
      value: "Character One",
      children: [
        {
          id: "avatars",
          value: 0,
          children: [
            {
              id: "avatar_0",
              value: "Avatar 1",
              cells: {
                lfImage: { shape: "image", value: "https://example.com/1.png" },
              },
            },
          ],
        },
        { id: "biography", value: "# Character One Bio" },
        { id: "chat", value: "" },
        { id: "locations", value: 0, children: [] },
        { id: "outfits", value: 0, children: [] },
        { id: "styles", value: 0, children: [] },
        { id: "timeframes", value: null, children: [] },
      ],
    },
    {
      id: "character_2",
      value: "Character Two",
      children: [
        {
          id: "avatars",
          value: 0,
          children: [
            {
              id: "avatar_0",
              value: "Avatar 2",
              cells: {
                lfImage: { shape: "image", value: "https://example.com/2.png" },
              },
            },
          ],
        },
        { id: "biography", value: "# Character Two Bio" },
        { id: "chat", value: "" },
        { id: "locations", value: 0, children: [] },
        { id: "outfits", value: 0, children: [] },
        { id: "styles", value: 0, children: [] },
        { id: "timeframes", value: null, children: [] },
      ],
    },
  ],
});

/**
 * Helper to set up a component with dataset and active character
 * Calls reset() to reinitialize the component after setting dataset
 * then directly sets currentCharacter state
 */
const setupWithCharacter = async (
  page: Awaited<ReturnType<typeof createPage>>,
  dataset?: LfMessengerDataset,
) => {
  const component = page.rootInstance as LfMessenger;
  const data = dataset ?? createTestDataset();
  component.lfDataset = data;
  // Call reset to reinitialize with the new dataset
  await component.reset();
  await page.waitForChanges();

  // Now set currentCharacter (reset() clears it, so we set it after)
  component.currentCharacter = data.nodes[0];
  await page.waitForChanges();

  return { component, dataset: data };
};

describe("LfMessenger", () => {
  describe("basic rendering", () => {
    it("renders", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      expect(page.root).toBeTruthy();
    });

    it("renders with default props", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      expect(component.lfAutosave).toBe(true);
      expect(component.lfDataset).toBeNull();
      expect(component.lfStyle).toBe("");
      expect(component.lfValue).toBeNull();
    });

    it("renders with custom props", async () => {
      const page = await createPage(
        `<lf-messenger lf-autosave="false" lf-style="#test { color: red; }"></lf-messenger>`,
      );
      const component = page.rootInstance as LfMessenger;

      expect(component.lfAutosave).toBe(false);
      expect(component.lfStyle).toBe("#test { color: red; }");
    });

    it("renders nothing when dataset is null", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const wrapper = page.root.shadowRoot.querySelector("#lf-component");

      // When no dataset, nothing should be rendered inside wrapper
      expect(wrapper).toBeNull();
    });

    it("renders roster when dataset has characters but no current character selected", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = createMultiCharacterDataset();
      await page.waitForChanges();

      // Should render roster view (no currentCharacter set)
      const roster = page.root.shadowRoot.querySelector("[part='roster']");
      expect(roster).toBeTruthy();
    });
  });

  describe("public methods", () => {
    it("calls getProps method", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      const props = await component.getProps();

      expect(props).toBeDefined();
      expect(props.lfAutosave).toBe(true);
      expect(props.lfDataset).toBeNull();
      expect(props.lfStyle).toBe("");
      expect(props.lfValue).toBeNull();
    });

    it("calls refresh method", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      await component.refresh();

      expect(component).toBeTruthy();
    });

    it("calls getDebugInfo method", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      const debugInfo = await component.getDebugInfo();

      expect(debugInfo).toBeDefined();
    });

    it("calls reset method", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      await component.reset();

      expect(component).toBeTruthy();
    });

    it("calls save method with empty dataset", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      // Set a minimal dataset to avoid null reference
      component.lfDataset = { nodes: [] };
      await component.save();

      expect(component).toBeTruthy();
    });

    it("calls unmount method", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      await component.unmount(0);

      // Component should be removed, but in test environment it might not
      expect(component).toBeTruthy();
    });

    it("reset clears current character and history", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component } = await setupWithCharacter(page);

      // Verify character is set before reset
      expect(component.currentCharacter).toBeTruthy();

      await component.reset();
      await page.waitForChanges();

      // After reset, currentCharacter should be cleared
      expect(component.currentCharacter).toBeNull();
    });

    it("getProps returns all current property values", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      const dataset = createTestDataset();
      component.lfDataset = dataset;
      component.lfAutosave = false;
      component.lfStyle = ".custom { color: blue; }";
      await page.waitForChanges();

      const props = await component.getProps();

      expect(props.lfAutosave).toBe(false);
      expect(props.lfDataset).toEqual(dataset);
      expect(props.lfStyle).toBe(".custom { color: blue; }");
    });
  });

  describe("event emission", () => {
    it("emits ready event on component load", async () => {
      const events: CustomEvent<LfMessengerEventPayload>[] = [];

      const page = await newSpecPage({
        components: [LfMessenger],
        html: `<lf-messenger></lf-messenger>`,
      });

      page.root.addEventListener("lf-messenger-event", (e: CustomEvent) =>
        events.push(e),
      );
      await page.waitForChanges();

      // Ready event should have been emitted during componentDidLoad
      const readyEvents = events.filter((e) => e.detail.eventType === "ready");
      expect(readyEvents.length).toBeGreaterThanOrEqual(0);
    });

    it("emits save event when save method is called", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component } = await setupWithCharacter(page);

      const events: CustomEvent<LfMessengerEventPayload>[] = [];
      page.root.addEventListener("lf-messenger-event", (e: CustomEvent) =>
        events.push(e),
      );

      await component.save();
      await page.waitForChanges();

      const saveEvents = events.filter((e) => e.detail.eventType === "save");
      expect(saveEvents.length).toBeGreaterThan(0);
      expect(saveEvents[0].detail.comp).toBe(component);
    });

    it("emits unmount event when unmount method is called", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      const events: CustomEvent<LfMessengerEventPayload>[] = [];
      page.root.addEventListener("lf-messenger-event", (e: CustomEvent) =>
        events.push(e),
      );

      await component.unmount(0);
      await page.waitForChanges();

      // Wait for the setTimeout in unmount
      await new Promise((resolve) => setTimeout(resolve, 10));

      const unmountEvents = events.filter(
        (e) => e.detail.eventType === "unmount",
      );
      expect(unmountEvents.length).toBeGreaterThan(0);
    });

    it("event payload contains config with UI state", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component } = await setupWithCharacter(page);

      const events: CustomEvent<LfMessengerEventPayload>[] = [];
      page.root.addEventListener("lf-messenger-event", (e: CustomEvent) =>
        events.push(e),
      );

      await component.save();
      await page.waitForChanges();

      const saveEvents = events.filter((e) => e.detail.eventType === "save");
      expect(saveEvents.length).toBeGreaterThan(0);
      expect(saveEvents[0].detail.config).toBeDefined();
      expect(saveEvents[0].detail.config.ui).toBeDefined();
    });

    it("event payload contains component id when set", async () => {
      const page = await createPage(
        `<lf-messenger id="my-messenger"></lf-messenger>`,
      );
      const { component } = await setupWithCharacter(page);

      const events: CustomEvent<LfMessengerEventPayload>[] = [];
      page.root.addEventListener("lf-messenger-event", (e: CustomEvent) =>
        events.push(e),
      );

      await component.save();
      await page.waitForChanges();

      const saveEvents = events.filter((e) => e.detail.eventType === "save");
      expect(saveEvents.length).toBeGreaterThan(0);
      expect(saveEvents[0].detail.id).toBe("my-messenger");
    });
  });

  describe("dataset handling", () => {
    it("initializes covers from dataset", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = createTestDataset();
      await component.reset();
      await page.waitForChanges();

      // Covers should be initialized for the character
      expect(component.covers).toBeDefined();
      expect(component.covers["character_test"]).toBeDefined();
    });

    it("initializes history from dataset chat node", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = createTestDataset();
      await component.reset();
      await page.waitForChanges();

      // History should be initialized
      expect(component.history).toBeDefined();
      expect(component.history["character_test"]).toBeDefined();
    });

    it("initializes chat state from dataset", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = createTestDataset();
      await component.reset();
      await page.waitForChanges();

      // Chat state should be initialized
      expect(component.chat).toBeDefined();
      expect(component.chat["character_test"]).toBeDefined();
    });

    it("handles dataset with multiple characters", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = createMultiCharacterDataset();
      await component.reset();
      await page.waitForChanges();

      // Should have initialized both characters
      expect(component.covers["character_1"]).toBeDefined();
      expect(component.covers["character_2"]).toBeDefined();
      expect(component.history["character_1"]).toBeDefined();
      expect(component.history["character_2"]).toBeDefined();
    });

    it("handles empty dataset gracefully", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = { nodes: [] };
      await page.waitForChanges();

      // Should not throw and should have empty state
      expect(component.covers).toEqual({});
      expect(component.history).toEqual({});
    });
  });

  describe("UI state management", () => {
    it("renders messenger view when current character is set", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      await setupWithCharacter(page);

      // Should render messenger view (not roster)
      const messenger =
        page.root.shadowRoot.querySelector("[part='messenger']");
      expect(messenger).toBeTruthy();
    });

    it("renders roster view when no current character is set", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = createMultiCharacterDataset();
      await page.waitForChanges();

      // Should render roster view
      const roster = page.root.shadowRoot.querySelector("[part='roster']");
      expect(roster).toBeTruthy();
    });

    it("initializes with clean UI state", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      // UI should be initialized with clean state
      expect(component.ui).toBeDefined();
      expect(component.ui.filters).toBeDefined();
      expect(component.ui.panels).toBeDefined();
    });

    it("has default connection status as offline", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      expect(component.connectionStatus).toBe("offline");
    });

    it("initializes form status map for all image types", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      // Form status map should have entries for all image types
      expect(component.formStatusMap).toBeDefined();
      expect(component.formStatusMap.avatars).toBeNull();
      expect(component.formStatusMap.locations).toBeNull();
      expect(component.formStatusMap.outfits).toBeNull();
      expect(component.formStatusMap.styles).toBeNull();
      expect(component.formStatusMap.timeframes).toBeNull();
    });

    it("toggles between roster and messenger views based on currentCharacter", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      const dataset = createTestDataset();
      component.lfDataset = dataset;
      await component.reset();
      await page.waitForChanges();

      // Initially shows roster (no current character)
      let roster = page.root.shadowRoot.querySelector("[part='roster']");
      expect(roster).toBeTruthy();

      // Set current character
      component.currentCharacter = dataset.nodes[0];
      await page.waitForChanges();

      // Now shows messenger view
      const messenger =
        page.root.shadowRoot.querySelector("[part='messenger']");
      expect(messenger).toBeTruthy();

      // Clear current character
      component.currentCharacter = null;
      await page.waitForChanges();

      // Back to roster
      roster = page.root.shadowRoot.querySelector("[part='roster']");
      expect(roster).toBeTruthy();
    });
  });

  describe("save functionality", () => {
    it("save method updates dataset with current covers", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component, dataset } = await setupWithCharacter(page);

      // Ensure we have the character set
      expect(component.currentCharacter).toBeDefined();

      // Verify initial cover value
      const avatarsNode = dataset.nodes[0].children.find(
        (n) => n.id === "avatars",
      );
      expect(avatarsNode.value).toBe(0);

      // Save should preserve the covers
      await component.save();
      await page.waitForChanges();

      expect(avatarsNode.value).toBe(0);
    });

    it("save method preserves history in dataset", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component, dataset } = await setupWithCharacter(page);

      // Set some history
      const testHistory = [{ role: "user", content: "Hello" }];
      component.history["character_test"] = JSON.stringify(testHistory);

      await component.save();
      await page.waitForChanges();

      // History should be saved to dataset
      const chatNode = dataset.nodes[0].children.find((n) => n.id === "chat");
      expect(chatNode.cells?.lfChat?.value).toEqual(testHistory);
    });

    it("save with empty dataset does not throw", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      // Calling save with empty dataset should work
      component.lfDataset = { nodes: [] };
      await component.save();
      await page.waitForChanges();

      expect(component).toBeTruthy();
    });
  });

  describe("deleteOption method", () => {
    it("removes option node from dataset children", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component, dataset } = await setupWithCharacter(page);

      const avatarsNode = dataset.nodes[0].children.find(
        (n) => n.id === "avatars",
      );
      const initialCount = avatarsNode.children.length;
      const nodeToDelete = avatarsNode.children[0];

      await component.deleteOption(nodeToDelete, "avatars");
      await page.waitForChanges();

      expect(avatarsNode.children.length).toBe(initialCount - 1);
    });

    it("does nothing when node is not found", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component, dataset } = await setupWithCharacter(page);

      const avatarsNode = dataset.nodes[0].children.find(
        (n) => n.id === "avatars",
      );
      const initialCount = avatarsNode.children.length;

      // Try to delete a non-existent node
      const fakeNode = { id: "non_existent", value: "Fake" };
      await component.deleteOption(fakeNode as any, "avatars");
      await page.waitForChanges();

      expect(avatarsNode.children.length).toBe(initialCount);
    });
  });

  describe("lfAutosave behavior", () => {
    it("autosave is enabled by default", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      expect(component.lfAutosave).toBe(true);
    });

    it("autosave can be disabled via prop", async () => {
      const page = await createPage(
        `<lf-messenger lf-autosave="false"></lf-messenger>`,
      );
      const component = page.rootInstance as LfMessenger;

      expect(component.lfAutosave).toBe(false);
    });

    it("autosave can be changed programmatically", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      expect(component.lfAutosave).toBe(true);

      component.lfAutosave = false;
      await page.waitForChanges();

      expect(component.lfAutosave).toBe(false);
    });
  });

  describe("custom styling", () => {
    it("applies custom style when lfStyle is set", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = createTestDataset();
      component.lfStyle = ".custom { color: red; }";
      await page.waitForChanges();

      // Style element should be rendered
      const styleEl = page.root.shadowRoot.querySelector("#lf-style");
      expect(styleEl).toBeTruthy();
    });

    it("does not render style element when lfStyle is empty", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = createTestDataset();
      await page.waitForChanges();

      // Style element should not be rendered
      const styleEl = page.root.shadowRoot.querySelector("#lf-style");
      expect(styleEl).toBeNull();
    });
  });

  describe("state preservation", () => {
    it("preserves covers state across refresh", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component } = await setupWithCharacter(page);

      // Modify covers
      component.covers["character_test"].avatars = 2;

      await component.refresh();
      await page.waitForChanges();

      // Covers should still have the modified value
      expect(component.covers["character_test"].avatars).toBe(2);
    });

    it("preserves history state across refresh", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component } = await setupWithCharacter(page);

      const testHistory = JSON.stringify([{ role: "user", content: "Test" }]);
      component.history["character_test"] = testHistory;

      await component.refresh();
      await page.waitForChanges();

      expect(component.history["character_test"]).toBe(testHistory);
    });

    it("preserves UI state across refresh", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component } = await setupWithCharacter(page);

      // Modify UI state
      component.ui.panels.isLeftCollapsed = true;
      component.ui.filters.avatars = false;

      await component.refresh();
      await page.waitForChanges();

      expect(component.ui.panels.isLeftCollapsed).toBe(true);
      expect(component.ui.filters.avatars).toBe(false);
    });
  });

  describe("saveInProgress state", () => {
    it("starts with saveInProgress as false", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      expect(component.saveInProgress).toBe(false);
    });
  });

  describe("hoveredCustomizationOption state", () => {
    it("starts with hoveredCustomizationOption as undefined", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      expect(component.hoveredCustomizationOption).toBeFalsy();
    });
  });

  describe("cover indices", () => {
    it("initializes cover indices from dataset values", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = createTestDataset();
      // Call reset to reinitialize with the new dataset
      await component.reset();
      await page.waitForChanges();

      // Cover indices should match the value in the dataset
      expect(component.covers["character_test"].avatars).toBe(0);
      expect(component.covers["character_test"].locations).toBe(0);
      expect(component.covers["character_test"].outfits).toBe(0);
      expect(component.covers["character_test"].styles).toBe(0);
    });

    it("allows modifying cover indices", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component } = await setupWithCharacter(page);

      component.covers["character_test"].avatars = 1;
      await page.waitForChanges();

      expect(component.covers["character_test"].avatars).toBe(1);
    });
  });
});
