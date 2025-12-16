import { LfChatAdapter } from "@lf-widgets/foundations";
import { Fragment, FunctionalComponent, h } from "@stencil/core";

//#region Props
export interface ChatRequestFCProps {
  adapter: LfChatAdapter;
}
//#endregion

/**
 * FC for the chat request area (attachments, input controls, commands).
 * Per Section 5.9 "Mirroring Rule" - mirrors elements.chat.tsx + elements.input.tsx request section.
 */
export const ChatRequestFC: FunctionalComponent<ChatRequestFCProps> = ({
  adapter,
}) => {
  const { controller, elements } = adapter;
  const { get } = controller;

  const blocks = get.blocks();
  const { theme } = get.framework();
  const { bemClass } = theme;

  const { attachments, clear, send, spinner, stt } = elements.jsx.chat;
  const {
    attachFile,
    attachImage,
    configuration: inputConfiguration,
    fullScreen,
    progressbar,
    textarea,
  } = elements.jsx.input;

  const { chat, commands, input, request } = blocks;

  return (
    <Fragment>
      <div class={bemClass(request._)}>
        {attachments()}
        <div class={bemClass(input._)}>
          {attachImage()}
          {attachFile()}
          {inputConfiguration()}
          {fullScreen()}
          {textarea()}
          {progressbar()}
        </div>
        <div class={bemClass(commands._)}>
          {clear()}
          {stt()}
          {send()}
        </div>
      </div>
      <div class={bemClass(chat._, chat.spinnerBar)}>{spinner()}</div>
    </Fragment>
  );
};
