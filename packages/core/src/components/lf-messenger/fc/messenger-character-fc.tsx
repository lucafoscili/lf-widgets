import { LfMessengerAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

//#region Props
export interface MessengerCharacterFCProps {
  adapter: LfMessengerAdapter;
  /** Whether the panel is collapsed */
  isCollapsed?: boolean;
}
//#endregion

/**
 * FC for the messenger character panel.
 * Displays the current character's avatar, name, status, biography, and save button.
 */
export const MessengerCharacterFC: FunctionalComponent<
  MessengerCharacterFCProps
> = ({ adapter, isCollapsed = false }) => {
  const { controller, elements } = adapter;
  const { get } = controller;

  const blocks = get.blocks();
  const framework = get.framework();
  const { bemClass } = framework.theme;

  const { character } = blocks;
  const { avatar, biography, save, statusIcon } = elements.jsx.character;
  const name = get.character.name();

  return (
    <div
      class={bemClass(character._, null, {
        collapsed: isCollapsed,
      })}
    >
      <div class={bemClass(character._, character.avatar)}>
        {avatar()}
        <div class={bemClass(character._, character.nameWrapper)}>
          <div class={bemClass(character._, character.name)}>
            {statusIcon()}
            <div class={bemClass(character._, character.label)}>{name}</div>
          </div>
          {save()}
        </div>
      </div>
      <div class={bemClass(character._, character.biography)}>
        {biography()}
      </div>
    </div>
  );
};
