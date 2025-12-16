import { LfChatAdapter } from "@lf-widgets/foundations";
import { Fragment, FunctionalComponent, h } from "@stencil/core";

//#region Props
export interface ChatConnectingFCProps {
  adapter: LfChatAdapter;
}
//#endregion

/**
 * FC for the connecting/loading state.
 * Per Section 5.9 "Mirroring Rule" - encapsulates connecting UI.
 */
export const ChatConnectingFC: FunctionalComponent<ChatConnectingFCProps> = ({
  adapter,
}) => {
  const { controller } = adapter;
  const { get } = controller;

  const blocks = get.blocks();
  const { theme } = get.framework();
  const { bemClass } = theme;

  const { chat } = blocks;

  return (
    <Fragment>
      <div class={bemClass(chat._, chat.spinner)}>
        <lf-spinner lfActive={true} lfLayout="wave" />
      </div>
      <div class={bemClass(chat._, chat.title)}>Just a moment.</div>
      <div class={bemClass(chat._, chat.text)}>
        Contacting the LLM endpoint...
      </div>
    </Fragment>
  );
};
