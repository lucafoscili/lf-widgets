import {
  LfChatAdapter,
  LfChatAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Creates computed values for the chat adapter.
 * All functions are pure and derive values from current state.
 *
 * @param getAdapter - Factory function returning the current adapter instance
 * @returns Computed values interface
 */
export const prepChatComputed = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterControllerComputed => ({
  /**
   * Returns true if chat history has messages
   */
  hasMessages: () => getAdapter().controller.get.history().length > 0,

  /**
   * Returns true if user can send a message (not currently streaming)
   */
  canSend: () => !getAdapter().controller.get.currentAbortStreaming(),

  /**
   * Returns true if there's content to clear (has messages or attachments)
   */
  canClear: () => {
    const { history, currentAttachments } = getAdapter().controller.get;
    return history().length > 0 || currentAttachments().length > 0;
  },

  /**
   * Returns true if component is in disabled state
   */
  isDisabled: () => {
    const status = getAdapter().controller.get.status();
    return status !== "ready";
  },

  /**
   * Returns total message count in history
   */
  messageCount: () => getAdapter().controller.get.history().length,
});
