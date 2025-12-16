import { LfChatAdapter, LfIconType } from "@lf-widgets/foundations";
import { Fragment, FunctionalComponent, h } from "@stencil/core";
import { FIcon } from "../../../utils/icon";

//#region Props
export interface ChatOfflineFCProps {
  adapter: LfChatAdapter;
}
//#endregion

/**
 * FC for the offline/error state.
 * Per Section 5.9 "Mirroring Rule" - encapsulates offline UI.
 */
export const ChatOfflineFC: FunctionalComponent<ChatOfflineFCProps> = ({
  adapter,
}) => {
  const { controller, elements } = adapter;
  const { get } = controller;

  const blocks = get.blocks();
  const framework = get.framework();
  const { theme } = framework;
  const { bemClass, get: themeGet } = theme;

  const { configuration, retry } = elements.jsx.chat;
  const icon = themeGet.icon("door");

  const { chat } = blocks;

  return (
    <Fragment>
      <div class={bemClass(chat._, chat.error)}>
        <FIcon
          framework={framework}
          icon={icon as LfIconType}
          wrapperClass={bemClass(chat._, chat.icon)}
        />
        <div class={bemClass(chat._, chat.title)}>Zzz...</div>
        <div class={bemClass(chat._, chat.text)}>
          The LLM endpoint is currently offline.
        </div>
      </div>
      {configuration()}
      {retry()}
    </Fragment>
  );
};
