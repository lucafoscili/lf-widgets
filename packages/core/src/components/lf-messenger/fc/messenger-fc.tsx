import { LfMessengerAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfMessengerFC } from "../lf-messenger-fc";

//#region Props
export interface MessengerFCProps {
  adapter: LfMessengerAdapter;
}
//#endregion

/**
 * FC for the messenger component wrapper.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfMessengerFC (pure presentational) with adapter state.
 *
 * The messenger is complex with multiple panels:
 * - Character panel (avatar, biography, save)
 * - Chat panel (conversation, navigation, expanders)
 * - Extra context panel (options, customization, filters)
 * - Roster view (character selection)
 */
export const MessengerFC: FunctionalComponent<MessengerFCProps> = ({
  adapter,
}) => {
  const { controller } = adapter;
  const { get } = controller;

  const framework = get.framework();
  const blocks = get.blocks();
  const parts = get.parts();

  const config = get.config();
  const { currentCharacter, ui } = config;

  return (
    <LfMessengerFC
      adapter={adapter}
      blocks={blocks}
      currentCharacterId={currentCharacter}
      framework={framework}
      parts={parts}
      ui={ui}
    />
  );
};
