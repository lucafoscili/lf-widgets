import { LfLLMChoiceMessage } from "@lf-widgets/foundations";

//#region generate
const generateMessageId = (): string =>
  typeof crypto !== "undefined" &&
  (crypto as Crypto & { randomUUID?: () => string }).randomUUID
    ? (crypto as Crypto & { randomUUID?: () => string }).randomUUID()
    : String(Date.now()) + String(Math.random()).slice(2, 8);
//#endregion

//#region ensure
export const ensureMessageId = (
  message: LfLLMChoiceMessage,
): LfLLMChoiceMessage => {
  if (!message.id) {
    message.id = generateMessageId();
  }
  return message;
};
//#endregion
