/**
 * lf-chat Functional Components
 *
 * Per Section 5.9 "Mirroring Rule":
 * Each elements file maps to a corresponding FC that composes the JSX functions.
 * These FCs receive the adapter and render pure UI based on adapter state.
 *
 * Hierarchy:
 * - ChatMessagesFC (list container)
 *   └── ChatMessageItemFC (single message)
 *       ├── ChatMessageContentFC (article + text)
 *       └── ChatToolbarFC (actions)
 */

// Top-level FCs (used by WC render)
export { ChatConnectingFC, ChatConnectingFCProps } from "./chat-connecting-fc";
export { ChatMessagesFC, ChatMessagesFCProps } from "./chat-messages-fc";
export { ChatOfflineFC, ChatOfflineFCProps } from "./chat-offline-fc";
export { ChatRequestFC, ChatRequestFCProps } from "./chat-request-fc";
export { ChatSettingsFC, ChatSettingsFCProps } from "./chat-settings-fc";

// Sub-FCs (composed by ChatMessagesFC)
export {
  ChatMessageContentFC,
  ChatMessageContentFCProps,
} from "./chat-message-content-fc";
export {
  ChatMessageItemFC,
  ChatMessageItemFCProps,
} from "./chat-message-item-fc";
export { ChatToolbarFC, ChatToolbarFCProps } from "./chat-toolbar-fc";
