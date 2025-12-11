import {
  LF_CHAT_IDS,
  LfChatAdapter,
  LfChatAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { getEffectiveConfig } from "./helpers.config";

export const prepInput = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterJsx["input"] => {
  return {
    //#region Attach Image
    attachImage: () => {
      const { controller, elements, handlers } = getAdapter();
      const {
        blocks,
        currentAttachments,
        currentPrompt,
        cyAttributes,
        manager,
        parts,
      } = controller.get;
      const { input } = elements.refs;
      const { button } = handlers.chat;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      const hasAttachments = currentAttachments().length > 0;
      const title = hasAttachments
        ? currentAttachments()
            .map((att) => att.name)
            .join(", ")
        : "Attach an image (ensure the model supports image inputs).";

      return (
        <lf-button
          class={bemClass(blocks.input._, blocks.input.attachImage)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.input.attachImage}
          lfIcon={"--lf-icon-image"}
          lfStretchY={true}
          lfStyling={hasAttachments ? "raised" : "flat"}
          lfUiState={currentPrompt() ? "disabled" : "primary"}
          onLf-button-event={button}
          part={parts.attachImage}
          ref={assignRef(input, "attachImage")}
          title={title}
        ></lf-button>
      );
    },
    //#endregion

    //#region Attach File
    attachFile: () => {
      const { controller, elements, handlers } = getAdapter();
      const {
        blocks,
        currentAttachments,
        currentPrompt,
        cyAttributes,
        manager,
        parts,
      } = controller.get;
      const { input } = elements.refs;
      const { button } = handlers.chat;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      const hasAttachments = currentAttachments().length > 0;
      const title = hasAttachments
        ? currentAttachments()
            .map((att) => att.name)
            .join(", ")
        : "Attach a file (ensure the model supports file inputs).";

      return (
        <lf-button
          class={bemClass(blocks.input._, blocks.input.attachFile)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.input.attachFile}
          lfIcon={"--lf-icon-attachment"}
          lfStretchY={true}
          lfStyling={hasAttachments ? "raised" : "flat"}
          lfUiState={currentPrompt() ? "disabled" : "primary"}
          onLf-button-event={button}
          part={parts.attachFile}
          ref={assignRef(input, "attachFile")}
          title={title}
        ></lf-button>
      );
    },
    //#endregion

    //#region Configuration
    configuration: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { input } = elements.refs;
      const { button } = handlers.chat;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <lf-button
          class={bemClass(blocks.input._, blocks.input.configuration)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.input.configuration}
          lfIcon="settings"
          lfStretchY={true}
          lfStyling="flat"
          onLf-button-event={button}
          part={parts.configuration}
          ref={assignRef(input, "configuration")}
          title="Open chat settings"
        ></lf-button>
      );
    },
    //#endregion

    //region Full Screen
    fullScreen: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { input } = elements.refs;
      const { button } = handlers.chat;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <lf-button
          class={bemClass(blocks.input._, blocks.input.fullScreen)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.input.fullScreen}
          lfIcon={"maximize"}
          lfStyling="flat"
          onLf-button-event={button}
          part={parts.fullScreen}
          ref={assignRef(input, "fullScreen")}
          title="Toggle full screen mode"
        ></lf-button>
      );
    },

    //#region Progressbar
    progressbar: () => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { input } = elements.refs;
      const { blocks, currentTokens, manager, parts } = controller.get;
      const effectiveConfig = getEffectiveConfig(adapter);
      const lfContextWindow = effectiveConfig.llm.contextWindow;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      const { current, percentage } = currentTokens();
      const title = `Estimated tokens used: ${current}/${lfContextWindow}`;

      return (
        <lf-progressbar
          class={bemClass(blocks.input._, blocks.input.progressbar)}
          id={LF_CHAT_IDS.input.progressbar}
          lfCenteredLabel={true}
          lfIcon={get.icon("percentage60")}
          lfLabel="Context window"
          lfUiSize="xsmall"
          lfValue={percentage}
          part={parts.progressbar}
          ref={assignRef(input, "progressbar")}
          title={title}
        ></lf-progressbar>
      );
    },
    //#endregion

    //#region Textarea
    textarea: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, currentPrompt, cyAttributes, manager, parts } =
        controller.get;
      const { input } = elements.refs;
      const { textfield } = handlers.chat;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <lf-textfield
          class={bemClass(blocks.input._, blocks.input.textarea)}
          data-cy={cyAttributes.input}
          id={LF_CHAT_IDS.input.textarea}
          lfStretchX={true}
          lfLabel="What's on your mind?"
          lfStyling="textarea"
          lfUiState={currentPrompt() ? "disabled" : "primary"}
          onLf-textfield-event={textfield}
          part={parts.prompt}
          ref={assignRef(input, "textarea")}
        ></lf-textfield>
      );
    },
    //#endregion
  };
};
