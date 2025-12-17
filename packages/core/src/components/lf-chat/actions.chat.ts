import {
  LfChatAdapter,
  LfChatAdapterControllerActions,
} from "@lf-widgets/foundations";
import { ensureMessageId } from "./helpers.message-id";
import { calcTokens } from "./helpers.messages";

/**
 * Creates action methods for the chat adapter.
 * Actions may perform async operations and have side effects.
 *
 * @param getAdapter - Factory function returning the current adapter instance
 * @returns Actions interface
 */
export const prepChatActions = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterControllerActions => ({
  /**
   * Toggle full screen mode for the chat component using portal.
   *
   * Uses the portal's fullscreen mode to escape transform ancestors,
   * which would otherwise break position:fixed CSS.
   */
  toggleFullScreen: () => {
    const adapter = getAdapter();
    const { get, set } = adapter.controller;
    const comp = get.compInstance();
    const framework = get.framework();
    const { portal } = framework;

    // Access component state via adapter getter
    const isFullscreen = get.fullScreen();
    const rootElement = (comp as unknown as { rootElement: HTMLElement })
      .rootElement;

    if (!isFullscreen) {
      // Enter fullscreen via portal - escapes transform ancestors
      // Using zIndex: 'auto' ensures dropdowns inside the chat will layer correctly
      portal.open(
        rootElement,
        rootElement.parentElement || document.body,
        undefined,
        0,
        "auto",
        {
          fullscreen: true,
          disableClickAway: true,
          zIndex: "auto",
        },
      );
    } else {
      // Exit fullscreen - portal returns element to original parent
      portal.close(rootElement);
    }

    // Toggle internal state via adapter setter
    set.fullScreen(!isFullscreen);
  },

  /**
   * Toggle between main chat view and settings view
   */
  toggleSettings: () => {
    const { get, set } = getAdapter().controller;
    const currentView = get.view();
    set.view(currentView === "settings" ? "main" : "settings");
  },

  /**
   * Prepare a new prompt from textarea input.
   * This is an async operation - it blurs the textarea and retrieves its value.
   * Moved from controller.get.newPrompt as it's not a pure state read.
   *
   * @returns The prepared message or null if textarea is empty
   */
  preparePrompt: async () => {
    const { textarea } = getAdapter().elements.refs.input;

    // FC: Use native element APIs
    textarea?.blur();
    const message = textarea?.value || "";
    if (message) {
      const newMessage = ensureMessageId({
        role: "user",
        content: message,
      });
      return newMessage;
    }
    return null;
  },

  /**
   * Recalculate current token count based on history.
   * Used when lfConfig changes (e.g., context window size).
   */
  recalculateTokens: async () => {
    const adapter = getAdapter();
    const { set } = adapter.controller;
    const tokens = await calcTokens(adapter);
    set.currentTokens(tokens);
  },
});
