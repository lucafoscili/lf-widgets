import { LfChatAdapter, LfLLMChoiceMessage } from "@lf-widgets/foundations";
import { ensureMessageId } from "./helpers.message-id";
import { LfChat } from "./lf-chat";

//#region Set
/**
 * Sets the history of the chat component from a string or file.
 *
 * @param adapter - The chat adapter instance
 * @param comp - The chat component instance
 * @param history - The history string to parse
 * @param fromFile - Whether the history is being loaded from a file
 * @returns Promise that resolves when the history is set
 */
export const setH = async (
  adapter: LfChatAdapter,
  comp: LfChat,
  history: string,
  fromFile: boolean = false,
): Promise<void> => {
  const { controller } = adapter;
  const { get, set } = controller;
  const { debug } = get.manager;

  if (!fromFile) {
    try {
      const parsed = JSON.parse(history) as LfLLMChoiceMessage[];
      const normalized = Array.isArray(parsed)
        ? parsed.map((msg) => ensureMessageId(msg))
        : [];
      set.history(() => (comp.history = normalized));
    } catch {}
  } else {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const importedHistory: LfLLMChoiceMessage[] = JSON.parse(text);

          if (!Array.isArray(importedHistory)) {
            throw new Error("Invalid history format: expected array");
          }

          for (const msg of importedHistory) {
            if (!msg.role || !msg.content) {
              throw new Error(
                "Invalid message format: missing role or content",
              );
            }
          }

          const normalized = importedHistory.map((msg) => ensureMessageId(msg));
          set.history(() => {
            comp.history = normalized;
          });

          debug.logs.new(
            comp,
            `Successfully imported ${importedHistory.length} messages`,
            "informational",
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          debug.logs.new(
            comp,
            `Failed to import history: ${errorMessage}`,
            "error",
          );
        }
      }
    };

    input.click();
  }
};
//#endregion

//#region Export
/**
 * Exports the current chat history as a JSON file download.
 *
 * @param comp - The chat component instance
 * @returns Promise that resolves when the export is complete
 */
export const exportH = async (comp: LfChat): Promise<void> => {
  const historyJson = JSON.stringify(comp.history, null, 2);
  const blob = new Blob([historyJson], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `chat-history-${new Date().toISOString()}.json`;
  a.click();

  URL.revokeObjectURL(url);
};
//#endregion
