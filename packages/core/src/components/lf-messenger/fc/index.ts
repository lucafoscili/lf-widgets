/**
 * lf-messenger Functional Components
 *
 * Per Section 5.9 "Mirroring Rule":
 * Each elements file maps to a corresponding FC that composes the JSX functions.
 * These FCs receive the adapter and render pure UI based on adapter state.
 *
 * Hierarchy:
 * - MessengerFC (adapter wrapper)
 *   └── LfMessengerFC (pure presentational root)
 *       ├── MessengerCharacterFC (character panel)
 *       ├── MessengerChatFC (chat panel)
 *       ├── MessengerExtraContextFC (customization/options)
 *       └── MessengerRosterFC (character selection grid)
 */

// Top-level FC (adapter wrapper)
export { MessengerFC, MessengerFCProps } from "./messenger-fc";

// Panel FCs
export {
  MessengerCharacterFC,
  MessengerCharacterFCProps,
} from "./messenger-character-fc";
export { MessengerChatFC, MessengerChatFCProps } from "./messenger-chat-fc";
export {
  MessengerExtraContextFC,
  MessengerExtraContextFCProps,
} from "./messenger-extra-context-fc";
export {
  MessengerRosterFC,
  MessengerRosterFCProps,
} from "./messenger-roster-fc";

// Sub-panel FCs
export {
  MessengerCoversFC,
  MessengerCoversFCProps,
} from "./messenger-covers-fc";
export { MessengerFormFC, MessengerFormFCProps } from "./messenger-form-fc";
export { MessengerListFC, MessengerListFCProps } from "./messenger-list-fc";
export {
  MessengerOptionsFC,
  MessengerOptionsFCProps,
} from "./messenger-options-fc";
