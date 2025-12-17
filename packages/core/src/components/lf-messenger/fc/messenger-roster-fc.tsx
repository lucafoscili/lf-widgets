import { LfMessengerAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h, VNode } from "@stencil/core";

//#region Props
export interface MessengerRosterFCProps {
  adapter: LfMessengerAdapter;
}
//#endregion

/**
 * FC for the messenger roster view (character selection grid).
 * Displays all available characters for selection when no character is active.
 */
export const MessengerRosterFC: FunctionalComponent<MessengerRosterFCProps> = ({
  adapter,
}) => {
  const { controller } = adapter;
  const { get, set } = controller;

  const blocks = get.blocks();
  const framework = get.framework();
  const { bemClass } = framework.theme;

  const { roster_sub: roster } = blocks;

  const avatars: VNode[] = [];
  const characters = get.character.list();

  characters.forEach((c) => {
    const image = get.image.asCover("avatars", c);
    avatars.push(
      <div
        class={bemClass(roster._, roster.portrait)}
        onClick={() => {
          set.character.current(c);
        }}
      >
        <img
          class={bemClass(roster._, roster.image)}
          src={image.value}
          title={image.title || ""}
        />
        <div class={bemClass(roster._, roster.name)}>
          <div class={bemClass(roster._, roster.label)}>
            {get.character.name(c)}
          </div>
        </div>
      </div>,
    );
  });

  return avatars?.length ? (
    <div class={bemClass(roster._)}>{avatars}</div>
  ) : (
    <div class={bemClass(roster._, roster.emptyData)}>
      There are no characters in your roster!
    </div>
  );
};
