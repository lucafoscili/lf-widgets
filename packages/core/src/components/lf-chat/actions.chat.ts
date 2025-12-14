import {
  LfChatAdapter,
  LfChatAdapterControllerActions,
} from "@lf-widgets/foundations";
import { ensureMessageId } from "./helpers.message-id";

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
   * Toggle full screen mode for the chat component
   */
  toggleFullScreen: () => {
    const adapter = getAdapter();
    const comp = adapter.controller.get.compInstance();
    // Access the component's internal fullScreen state via the component
    (comp as unknown as { fullScreen: boolean }).fullScreen = !(
      comp as unknown as { fullScreen: boolean }
    ).fullScreen;
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

    await textarea.setBlur();
    const message = await textarea.getValue();
    if (message) {
      const newMessage = ensureMessageId({
        role: "user",
        content: message,
      });
      return newMessage;
    }
    return null;
  },
});
