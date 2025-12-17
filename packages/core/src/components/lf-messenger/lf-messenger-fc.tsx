import {
  LfFrameworkInterface,
  LfMessengerAdapter,
  LfMessengerBlockType,
  LfMessengerUI,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { MessengerCharacterFC } from "./fc/messenger-character-fc";
import { MessengerChatFC } from "./fc/messenger-chat-fc";
import { MessengerExtraContextFC } from "./fc/messenger-extra-context-fc";
import { MessengerRosterFC } from "./fc/messenger-roster-fc";

//#region Props
/**
 * Props interface for the pure presentational LfMessengerFC.
 */
export interface LfMessengerFCProps {
  /** The adapter instance for state access */
  adapter: LfMessengerAdapter;
  /** BEM block definitions */
  blocks: LfMessengerBlockType;
  /** Optional additional CSS class */
  className?: string;
  /** Current character ID (null shows roster) */
  currentCharacterId?: string;
  /** Framework instance for theming */
  framework: LfFrameworkInterface;
  /** Optional element ID */
  id?: string;
  /** Parts definitions for styling hooks */
  parts: {
    messenger: string;
    emptyData: string;
    roster: string;
  };
  /** Optional inline styles */
  style?: { [key: string]: string };
  /** UI state configuration */
  ui: LfMessengerUI;
}
//#endregion

/**
 * LfMessengerFC - Functional Component for Messenger
 *
 * This is a stateless functional component that renders the messenger interface.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * The messenger has two main views:
 * 1. Roster view: Character selection grid (when no character selected)
 * 2. Chat view: Three-panel layout with character, chat, and extra context
 *
 * Usage patterns:
 * 1. Inside lf-messenger Web Component (thin wrapper)
 * 2. Inside other components that need messenger UI (composed usage)
 *
 * Benefits over direct WC usage in compositions:
 * - No Shadow DOM overhead (single shadow root for parent)
 * - No lifecycle hooks per instance
 * - No theme registration per instance
 * - Direct callbacks instead of CustomEvent dispatch
 * - State flows unidirectionally from parent
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export const LfMessengerFC: FunctionalComponent<LfMessengerFCProps> = ({
  adapter,
  blocks,
  className,
  currentCharacterId,
  framework,
  id,
  parts,
  style,
  ui,
}) => {
  const { bemClass } = framework.theme;
  const hasCurrentCharacter = Boolean(currentCharacterId);
  const { isLeftCollapsed, isRightCollapsed } = ui?.panels || {};
  const isCustomizationView = ui?.customizationView || false;

  // Build the class string
  const rootClass = `${bemClass(blocks._)}${className ? ` ${className}` : ""}`;

  if (hasCurrentCharacter) {
    // Three-panel chat view
    return (
      <div class={rootClass} id={id} part={parts.messenger} style={style}>
        <MessengerCharacterFC adapter={adapter} isCollapsed={isLeftCollapsed} />
        <MessengerChatFC adapter={adapter} />
        <MessengerExtraContextFC
          adapter={adapter}
          isCollapsed={isRightCollapsed}
          isCustomizationView={isCustomizationView}
        />
      </div>
    );
  }

  // Roster view (character selection)
  return (
    <div
      class={bemClass(blocks._, blocks.roster)}
      id={id}
      part={parts.roster}
      style={style}
    >
      <MessengerRosterFC adapter={adapter} />
    </div>
  );
};
