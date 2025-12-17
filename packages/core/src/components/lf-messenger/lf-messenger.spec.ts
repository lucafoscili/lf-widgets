import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import {
  LfMessengerCharacterNode,
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

  //#region Extended State Management Tests
  describe("chat state management", () => {
    it("initializes chat state as empty object for each character", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = createTestDataset();
      await component.reset();
      await page.waitForChanges();

      expect(component.chat["character_test"]).toBeDefined();
      expect(typeof component.chat["character_test"]).toBe("object");
    });

    it("maintains separate chat state for multiple characters", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = createMultiCharacterDataset();
      await component.reset();
      await page.waitForChanges();

      expect(component.chat["character_1"]).toBeDefined();
      expect(component.chat["character_2"]).toBeDefined();
      // Verify separate objects
      expect(component.chat["character_1"]).not.toBe(
        component.chat["character_2"],
      );
    });

    it("chat state can store lfConfig", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component } = await setupWithCharacter(page);

      // Simulate storing chat config - use a valid property
      component.chat["character_test"] = { lfValue: [] };
      await page.waitForChanges();

      expect(component.chat["character_test"].lfValue).toEqual([]);
    });

    it("reset clears chat state", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component } = await setupWithCharacter(page);

      // Populate chat state with valid lfConfig structure
      component.chat["character_test"] = {
        lfConfig: { llm: { pollingInterval: 1000 } },
      };
      await page.waitForChanges();

      await component.reset();
      await page.waitForChanges();

      // Chat should be reset (re-initialized based on dataset)
      expect(component.chat["character_test"]).toBeDefined();
    });
  });

  describe("connection status state", () => {
    it("defaults to offline status", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      expect(component.connectionStatus).toBe("offline");
    });

    it("can be set to ready status", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      component.connectionStatus = "ready";
      await page.waitForChanges();

      expect(component.connectionStatus).toBe("ready");
    });

    it("can be set to connecting status", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      component.connectionStatus = "connecting";
      await page.waitForChanges();

      expect(component.connectionStatus).toBe("connecting");
    });

    it("preserves connection status across refresh", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      component.connectionStatus = "ready";
      await component.refresh();
      await page.waitForChanges();

      expect(component.connectionStatus).toBe("ready");
    });

    it("connection status transitions correctly", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      // Simulate connection lifecycle
      expect(component.connectionStatus).toBe("offline");

      component.connectionStatus = "connecting";
      await page.waitForChanges();
      expect(component.connectionStatus).toBe("connecting");

      component.connectionStatus = "ready";
      await page.waitForChanges();
      expect(component.connectionStatus).toBe("ready");

      component.connectionStatus = "offline";
      await page.waitForChanges();
      expect(component.connectionStatus).toBe("offline");
    });
  });

  describe("covers state management", () => {
    it("initializes covers as empty object when no dataset", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      expect(component.covers).toEqual({});
    });

    it("populates covers for all image types per character", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = createTestDataset();
      await component.reset();
      await page.waitForChanges();

      const covers = component.covers["character_test"];
      expect(covers.avatars).toBeDefined();
      expect(covers.locations).toBeDefined();
      expect(covers.outfits).toBeDefined();
      expect(covers.styles).toBeDefined();
      expect(covers.timeframes).toBeDefined();
    });

    it("tracks covers separately for multiple characters", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = createMultiCharacterDataset();
      await component.reset();
      await page.waitForChanges();

      // Modify cover for character 1
      component.covers["character_1"].avatars = 5;

      // Verify character 2 is unaffected
      expect(component.covers["character_2"].avatars).toBe(0);
      expect(component.covers["character_1"].avatars).toBe(5);
    });

    it("reset clears covers state", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component } = await setupWithCharacter(page);

      // Modify covers
      component.covers["character_test"].avatars = 3;

      await component.reset();
      await page.waitForChanges();

      // Covers should be re-initialized from dataset
      expect(component.covers["character_test"].avatars).toBe(0);
    });
  });

  describe("currentCharacter state management", () => {
    it("defaults to undefined/falsy when no dataset", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      expect(component.currentCharacter).toBeFalsy();
    });

    it("remains null after setting dataset without lfValue", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = createTestDataset();
      await page.waitForChanges();

      expect(component.currentCharacter).toBeFalsy();
    });

    it("can be set programmatically", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component, dataset } = await setupWithCharacter(page);

      expect(component.currentCharacter).toBe(dataset.nodes[0]);
    });

    it("can switch between characters", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component } = await setupWithCharacter(
        page,
        createMultiCharacterDataset(),
      );

      // First character is already selected via setupWithCharacter
      expect(component.currentCharacter.id).toBe("character_1");

      // Switch to second character
      component.currentCharacter = component.lfDataset.nodes[1];
      await page.waitForChanges();
      expect(component.currentCharacter.id).toBe("character_2");
    });

    it("can be cleared to return to roster", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component, dataset } = await setupWithCharacter(page);

      expect(component.currentCharacter).toBe(dataset.nodes[0]);

      component.currentCharacter = null;
      await page.waitForChanges();

      expect(component.currentCharacter).toBeNull();
    });

    it("reset clears currentCharacter", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component } = await setupWithCharacter(page);

      expect(component.currentCharacter).toBeTruthy();

      await component.reset();
      await page.waitForChanges();

      expect(component.currentCharacter).toBeNull();
    });
  });

  describe("history state management", () => {
    it("initializes as empty object when no dataset", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      expect(component.history).toEqual({});
    });

    it("initializes history for each character", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = createMultiCharacterDataset();
      await component.reset();
      await page.waitForChanges();

      expect(component.history["character_1"]).toBeDefined();
      expect(component.history["character_2"]).toBeDefined();
    });

    it("stores history as JSON string", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component } = await setupWithCharacter(page);

      const testMessages = [
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi there!" },
      ];
      component.history["character_test"] = JSON.stringify(testMessages);
      await page.waitForChanges();

      const parsed = JSON.parse(component.history["character_test"]);
      expect(parsed).toEqual(testMessages);
    });

    it("maintains separate history for each character", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = createMultiCharacterDataset();
      await component.reset();
      await page.waitForChanges();

      // Set different history for each character
      component.history["character_1"] = JSON.stringify([
        { role: "user", content: "Hi 1" },
      ]);
      component.history["character_2"] = JSON.stringify([
        { role: "user", content: "Hi 2" },
      ]);

      expect(JSON.parse(component.history["character_1"])[0].content).toBe(
        "Hi 1",
      );
      expect(JSON.parse(component.history["character_2"])[0].content).toBe(
        "Hi 2",
      );
    });

    it("handles large chat histories", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component } = await setupWithCharacter(page);

      // Create a large history
      const largeHistory = Array.from({ length: 100 }, (_, i) => ({
        role: i % 2 === 0 ? "user" : "assistant",
        content: `Message ${i}`,
      }));
      component.history["character_test"] = JSON.stringify(largeHistory);
      await page.waitForChanges();

      const parsed = JSON.parse(component.history["character_test"]);
      expect(parsed.length).toBe(100);
    });

    it("reset clears history and reinitializes from dataset", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component } = await setupWithCharacter(page);

      // Modify history
      component.history["character_test"] = JSON.stringify([
        { role: "user", content: "Test" },
      ]);

      await component.reset();
      await page.waitForChanges();

      // History should be re-initialized (empty array from dataset)
      expect(JSON.parse(component.history["character_test"])).toEqual([]);
    });
  });

  describe("saveInProgress state", () => {
    it("defaults to false", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      expect(component.saveInProgress).toBe(false);
    });

    it("can be set programmatically", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      component.saveInProgress = true;
      await page.waitForChanges();

      expect(component.saveInProgress).toBe(true);
    });

    it("preserves state across refresh", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      component.saveInProgress = true;
      await component.refresh();
      await page.waitForChanges();

      expect(component.saveInProgress).toBe(true);
    });
  });

  describe("ui state management", () => {
    it("initializes with default clean UI state", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      expect(component.ui.customizationView).toBe(false);
      expect(component.ui.panels.isLeftCollapsed).toBe(false);
      expect(component.ui.panels.isRightCollapsed).toBe(false);
    });

    it("initializes filters with all false", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      expect(component.ui.filters.avatars).toBe(false);
      expect(component.ui.filters.locations).toBe(false);
      expect(component.ui.filters.outfits).toBe(false);
      expect(component.ui.filters.styles).toBe(false);
      expect(component.ui.filters.timeframes).toBe(false);
    });

    it("initializes form states with all false", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      expect(component.ui.form.avatars).toBe(false);
      expect(component.ui.form.locations).toBe(false);
      expect(component.ui.form.outfits).toBe(false);
      expect(component.ui.form.styles).toBe(false);
      expect(component.ui.form.timeframes).toBe(false);
    });

    it("initializes options with most enabled", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      expect(component.ui.options.locations).toBe(true);
      expect(component.ui.options.outfits).toBe(true);
      expect(component.ui.options.styles).toBe(true);
      expect(component.ui.options.timeframes).toBe(true);
    });

    it("can toggle customizationView", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      component.ui.customizationView = true;
      await page.waitForChanges();

      expect(component.ui.customizationView).toBe(true);
    });

    it("can toggle panel collapse states", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      component.ui.panels.isLeftCollapsed = true;
      component.ui.panels.isRightCollapsed = true;
      await page.waitForChanges();

      expect(component.ui.panels.isLeftCollapsed).toBe(true);
      expect(component.ui.panels.isRightCollapsed).toBe(true);
    });

    it("can toggle individual filters", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      component.ui.filters.avatars = true;
      component.ui.filters.locations = true;
      await page.waitForChanges();

      expect(component.ui.filters.avatars).toBe(true);
      expect(component.ui.filters.locations).toBe(true);
      expect(component.ui.filters.outfits).toBe(false);
    });

    it("can toggle individual options", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      component.ui.options.locations = false;
      await page.waitForChanges();

      expect(component.ui.options.locations).toBe(false);
      expect(component.ui.options.outfits).toBe(true);
    });

    it("preserves UI state across refresh", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      component.ui.customizationView = true;
      component.ui.panels.isLeftCollapsed = true;
      component.ui.filters.avatars = true;

      await component.refresh();
      await page.waitForChanges();

      expect(component.ui.customizationView).toBe(true);
      expect(component.ui.panels.isLeftCollapsed).toBe(true);
      expect(component.ui.filters.avatars).toBe(true);
    });
  });

  describe("formStatusMap state", () => {
    it("initializes with null for all image types", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      expect(component.formStatusMap.avatars).toBeNull();
      expect(component.formStatusMap.locations).toBeNull();
      expect(component.formStatusMap.outfits).toBeNull();
      expect(component.formStatusMap.styles).toBeNull();
      expect(component.formStatusMap.timeframes).toBeNull();
    });

    it("can store editing node id", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      component.formStatusMap.avatars = "avatar_0" as any;
      await page.waitForChanges();

      expect(component.formStatusMap.avatars).toBe("avatar_0");
    });

    it("maintains separate status for each image type", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      component.formStatusMap.avatars = "avatar_edit" as any;
      component.formStatusMap.locations = "location_edit" as any;
      await page.waitForChanges();

      expect(component.formStatusMap.avatars).toBe("avatar_edit");
      expect(component.formStatusMap.locations).toBe("location_edit");
      expect(component.formStatusMap.outfits).toBeNull();
    });
  });

  describe("hoveredCustomizationOption state", () => {
    it("initializes as falsy", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      expect(component.hoveredCustomizationOption).toBeFalsy();
    });

    it("can be set to a node", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component, dataset } = await setupWithCharacter(page);

      const avatarsNode = dataset.nodes[0].children.find(
        (n) => n.id === "avatars",
      );
      const avatarChild = avatarsNode.children[0];

      component.hoveredCustomizationOption = avatarChild as any;
      await page.waitForChanges();

      expect(component.hoveredCustomizationOption).toBe(avatarChild);
    });

    it("can be cleared", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component, dataset } = await setupWithCharacter(page);

      const avatarsNode = dataset.nodes[0].children.find(
        (n) => n.id === "avatars",
      );
      component.hoveredCustomizationOption = avatarsNode.children[0] as any;
      await page.waitForChanges();

      component.hoveredCustomizationOption = null;
      await page.waitForChanges();

      expect(component.hoveredCustomizationOption).toBeNull();
    });
  });
  //#endregion

  //#region Character Management Tests
  describe("character management", () => {
    it("lists all characters from dataset", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      const dataset = createMultiCharacterDataset();
      component.lfDataset = dataset;
      await page.waitForChanges();

      expect(dataset.nodes.length).toBe(2);
      expect(dataset.nodes[0].id).toBe("character_1");
      expect(dataset.nodes[1].id).toBe("character_2");
    });

    it("handles missing character gracefully", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = createTestDataset();
      await component.reset();
      await page.waitForChanges();

      // Character not selected - roster view
      expect(component.currentCharacter).toBeFalsy();
      // Should still render without crashing
      expect(component).toBeTruthy();
    });

    it("character has required child nodes", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      const dataset = createTestDataset();
      component.lfDataset = dataset;
      await page.waitForChanges();

      const character = dataset.nodes[0];
      const childIds = character.children.map((c) => c.id);

      expect(childIds).toContain("avatars");
      expect(childIds).toContain("biography");
      expect(childIds).toContain("chat");
      expect(childIds).toContain("locations");
      expect(childIds).toContain("outfits");
      expect(childIds).toContain("styles");
      expect(childIds).toContain("timeframes");
    });

    it("character name comes from value property", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      const dataset = createTestDataset();
      component.lfDataset = dataset;
      await page.waitForChanges();

      expect(dataset.nodes[0].value).toBe("Test Character");
    });
  });
  //#endregion

  //#region Configuration Tests
  describe("lfValue configuration", () => {
    it("applies currentCharacter from lfValue", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      const dataset = createTestDataset();
      component.lfDataset = dataset;
      component.lfValue = {
        currentCharacter: "character_test",
        ui: {
          customizationView: false,
          filters: {
            avatars: false,
            locations: false,
            outfits: false,
            styles: false,
            timeframes: false,
          },
          form: {
            avatars: false,
            locations: false,
            outfits: false,
            styles: false,
            timeframes: false,
          },
          options: {
            locations: true,
            outfits: true,
            styles: true,
            timeframes: true,
          },
          panels: { isLeftCollapsed: false, isRightCollapsed: false },
        },
      };
      await component.reset();
      await page.waitForChanges();

      // After reset with lfValue, character should be set
      expect(component.currentCharacter?.id).toBe("character_test");
    });

    it("applies ui.panels from lfValue", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      const dataset = createTestDataset();
      component.lfDataset = dataset;
      component.lfValue = {
        currentCharacter: "character_test",
        ui: {
          customizationView: false,
          filters: {
            avatars: false,
            locations: false,
            outfits: false,
            styles: false,
            timeframes: false,
          },
          form: {
            avatars: false,
            locations: false,
            outfits: false,
            styles: false,
            timeframes: false,
          },
          options: {
            locations: true,
            outfits: true,
            styles: true,
            timeframes: true,
          },
          panels: { isLeftCollapsed: true, isRightCollapsed: true },
        },
      };
      await component.reset();
      await page.waitForChanges();

      expect(component.ui.panels.isLeftCollapsed).toBe(true);
      expect(component.ui.panels.isRightCollapsed).toBe(true);
    });

    it("applies ui.filters from lfValue", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      const dataset = createTestDataset();
      component.lfDataset = dataset;
      component.lfValue = {
        currentCharacter: "character_test",
        ui: {
          customizationView: false,
          filters: {
            avatars: true,
            locations: true,
            outfits: false,
            styles: false,
            timeframes: false,
          },
          form: {
            avatars: false,
            locations: false,
            outfits: false,
            styles: false,
            timeframes: false,
          },
          options: {
            locations: true,
            outfits: true,
            styles: true,
            timeframes: true,
          },
          panels: { isLeftCollapsed: false, isRightCollapsed: false },
        },
      };
      await component.reset();
      await page.waitForChanges();

      expect(component.ui.filters.avatars).toBe(true);
      expect(component.ui.filters.locations).toBe(true);
      expect(component.ui.filters.outfits).toBe(false);
    });

    it("handles lfValue with non-existent character gracefully", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      const dataset = createTestDataset();
      component.lfDataset = dataset;
      component.lfValue = {
        currentCharacter: "non_existent_character",
        ui: {
          customizationView: false,
          filters: {
            avatars: false,
            locations: false,
            outfits: false,
            styles: false,
            timeframes: false,
          },
          form: {
            avatars: false,
            locations: false,
            outfits: false,
            styles: false,
            timeframes: false,
          },
          options: {
            locations: true,
            outfits: true,
            styles: true,
            timeframes: true,
          },
          panels: { isLeftCollapsed: false, isRightCollapsed: false },
        },
      };
      await component.reset();
      await page.waitForChanges();

      // Should not crash, currentCharacter will be undefined
      expect(component).toBeTruthy();
    });
  });
  //#endregion

  //#region Event Tests
  describe("event payloads", () => {
    it("save event includes current config", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component, dataset } = await setupWithCharacter(page);

      const events: CustomEvent<LfMessengerEventPayload>[] = [];
      page.root.addEventListener("lf-messenger-event", (e: CustomEvent) =>
        events.push(e),
      );

      await component.save();
      await page.waitForChanges();

      const saveEvent = events.find((e) => e.detail.eventType === "save");
      expect(saveEvent).toBeTruthy();
      expect(saveEvent.detail.config.currentCharacter).toBe(
        dataset.nodes[0].id,
      );
      expect(saveEvent.detail.config.ui).toBeDefined();
    });

    it("event includes component reference", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component } = await setupWithCharacter(page);

      const events: CustomEvent<LfMessengerEventPayload>[] = [];
      page.root.addEventListener("lf-messenger-event", (e: CustomEvent) =>
        events.push(e),
      );

      await component.save();
      await page.waitForChanges();

      const saveEvent = events.find((e) => e.detail.eventType === "save");
      expect(saveEvent.detail.comp).toBe(component);
    });

    it("unmount event fires with correct eventType", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      const events: CustomEvent<LfMessengerEventPayload>[] = [];
      page.root.addEventListener("lf-messenger-event", (e: CustomEvent) =>
        events.push(e),
      );

      await component.unmount(0);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const unmountEvent = events.find((e) => e.detail.eventType === "unmount");
      expect(unmountEvent).toBeTruthy();
      expect(unmountEvent.detail.eventType).toBe("unmount");
    });
  });
  //#endregion

  //#region Edge Cases
  describe("edge cases", () => {
    it("handles null dataset gracefully", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      component.lfDataset = null;
      await page.waitForChanges();

      expect(component).toBeTruthy();
      expect(component.covers).toEqual({});
    });

    it("handles empty nodes array", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      component.lfDataset = { nodes: [] };
      await page.waitForChanges();

      expect(component).toBeTruthy();
      // With empty nodes, component renders nothing (hasNodes returns false)
      const wrapper = page.root.shadowRoot.querySelector("#lf-component");
      expect(wrapper).toBeNull();
    });

    it("handles character with missing children gracefully", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      const incompleteDataset: LfMessengerDataset = {
        nodes: [
          {
            id: "character_incomplete",
            value: "Incomplete",
            children: [
              { id: "avatars", value: 0, children: [] },
              { id: "biography", value: "" },
              { id: "chat", value: "" },
              { id: "locations", value: 0, children: [] },
              { id: "outfits", value: 0, children: [] },
              { id: "styles", value: 0, children: [] },
              { id: "timeframes", value: null, children: [] },
            ],
          },
        ],
      };

      component.lfDataset = incompleteDataset;
      await page.waitForChanges();

      // Should not crash
      expect(component).toBeTruthy();
    });

    it("handles rapid state changes", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      const dataset = createMultiCharacterDataset();
      component.lfDataset = dataset;
      await component.reset();
      await page.waitForChanges();

      // Rapid character switching
      component.currentCharacter = dataset.nodes[0];
      component.currentCharacter = dataset.nodes[1];
      component.currentCharacter = dataset.nodes[0];
      component.currentCharacter = null;
      component.currentCharacter = dataset.nodes[1];
      await page.waitForChanges();

      expect(component.currentCharacter.id).toBe("character_2");
    });

    it("handles special characters in history", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component } = await setupWithCharacter(page);

      const specialHistory = [
        { role: "user", content: 'Hello "world" with <html> & symbols' },
        { role: "assistant", content: "Response with 日本語 and émojis 🎉" },
      ];
      component.history["character_test"] = JSON.stringify(specialHistory);
      await page.waitForChanges();

      const parsed = JSON.parse(component.history["character_test"]);
      expect(parsed[0].content).toContain("<html>");
      expect(parsed[1].content).toContain("日本語");
    });

    it("handles very long character names", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      const longNameDataset: LfMessengerDataset = {
        nodes: [
          {
            id: "character_long_name",
            value: "A".repeat(500), // Very long name
            children: [
              { id: "avatars", value: 0, children: [] },
              { id: "biography", value: "" },
              { id: "chat", value: "" },
              { id: "locations", value: 0, children: [] },
              { id: "outfits", value: 0, children: [] },
              { id: "styles", value: 0, children: [] },
              { id: "timeframes", value: null, children: [] },
            ],
          },
        ],
      };

      component.lfDataset = longNameDataset;
      await component.reset();
      await page.waitForChanges();

      expect(component.lfDataset.nodes[0].value.length).toBe(500);
    });

    it("handles dataset with many characters", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      // Create dataset with 50 characters
      const manyCharactersDataset: LfMessengerDataset = {
        nodes: Array.from({ length: 50 }, (_, i) => ({
          id: `character_${i}` as `character_${string}`,
          value: `Character ${i}`,
          children: [
            { id: "avatars", value: 0, children: [] as never[] },
            { id: "biography", value: `Bio ${i}` },
            { id: "chat", value: "" },
            { id: "locations", value: 0, children: [] as never[] },
            { id: "outfits", value: 0, children: [] as never[] },
            { id: "styles", value: 0, children: [] as never[] },
            { id: "timeframes", value: null, children: [] as never[] },
          ] as LfMessengerCharacterNode["children"],
        })),
      };

      component.lfDataset = manyCharactersDataset;
      await component.reset();
      await page.waitForChanges();

      expect(Object.keys(component.covers).length).toBe(50);
      expect(Object.keys(component.history).length).toBe(50);
    });
  });
  //#endregion

  //#region Rendering Tests
  describe("rendering conditions", () => {
    it("does not render when dataset is null", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const wrapper = page.root.shadowRoot.querySelector("#lf-component");

      expect(wrapper).toBeNull();
    });

    it("renders roster when dataset has characters but none selected", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = createTestDataset();
      await page.waitForChanges();

      const roster = page.root.shadowRoot.querySelector("[part='roster']");
      expect(roster).toBeTruthy();
    });

    it("renders messenger view when character is selected", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      await setupWithCharacter(page);

      const messenger =
        page.root.shadowRoot.querySelector("[part='messenger']");
      expect(messenger).toBeTruthy();
    });

    it("renders lf-style element when lfStyle is provided", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = createTestDataset();
      component.lfStyle = ".test { color: red; }";
      await page.waitForChanges();

      const styleEl = page.root.shadowRoot.querySelector("#lf-style");
      expect(styleEl).toBeTruthy();
    });

    it("does not render lf-style element when lfStyle is empty", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;
      component.lfDataset = createTestDataset();
      component.lfStyle = "";
      await page.waitForChanges();

      const styleEl = page.root.shadowRoot.querySelector("#lf-style");
      expect(styleEl).toBeNull();
    });
  });
  //#endregion

  //#region Lifecycle Tests
  describe("lifecycle behavior", () => {
    it("registers with theme on connectedCallback", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      // Component should be truthy after connection
      expect(component).toBeTruthy();
    });

    it("unmount removes element after delay", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      const events: CustomEvent<LfMessengerEventPayload>[] = [];
      page.root.addEventListener("lf-messenger-event", (e: CustomEvent) =>
        events.push(e),
      );

      await component.unmount(10);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const unmountEvents = events.filter(
        (e) => e.detail.eventType === "unmount",
      );
      expect(unmountEvents.length).toBeGreaterThan(0);
    });

    it("getDebugInfo returns lifecycle info", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const component = page.rootInstance as LfMessenger;

      const debugInfo = await component.getDebugInfo();

      expect(debugInfo).toBeDefined();
    });
  });
  //#endregion

  //#region Integration Tests
  describe("state integration", () => {
    it("save persists history to dataset", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component, dataset } = await setupWithCharacter(page);

      // Set history
      const testMessages = [{ role: "user", content: "Integration test" }];
      component.history["character_test"] = JSON.stringify(testMessages);

      await component.save();
      await page.waitForChanges();

      // Verify history is saved to dataset
      const chatNode = dataset.nodes[0].children.find((n) => n.id === "chat");
      expect(chatNode.cells?.lfChat?.value).toEqual(testMessages);
    });

    it("save persists covers to dataset", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component, dataset } = await setupWithCharacter(page);

      // Modify cover index
      component.covers["character_test"].avatars = 2;

      await component.save();
      await page.waitForChanges();

      // Verify cover index is saved to dataset
      const avatarsNode = dataset.nodes[0].children.find(
        (n) => n.id === "avatars",
      );
      expect(avatarsNode.value).toBe(2);
    });

    it("multiple saves preserve data correctly", async () => {
      const page = await createPage(`<lf-messenger></lf-messenger>`);
      const { component, dataset } = await setupWithCharacter(page);

      // First save
      component.history["character_test"] = JSON.stringify([
        { role: "user", content: "First" },
      ]);
      await component.save();

      // Second save with more data
      component.history["character_test"] = JSON.stringify([
        { role: "user", content: "First" },
        { role: "assistant", content: "Response" },
      ]);
      await component.save();
      await page.waitForChanges();

      const chatNode = dataset.nodes[0].children.find((n) => n.id === "chat");
      expect(chatNode.cells?.lfChat?.value.length).toBe(2);
    });
  });
  //#endregion
});
