import {
  LF_CHAT_IDS,
  LfChatAdapter,
  LfChatAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { ButtonFC } from "../lf-button/fc/button-fc";
import { LfTextfieldFC } from "../lf-textfield/lf-textfield-fc";
import { getEffectiveConfig } from "./helpers.config";

export const prepInput = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterJsx["input"] => {
  return {
    //#region Attach Image
    attachImage: () => {
      const { controller, elements, handlers } = getAdapter();
      const { get } = controller;
      const { input } = elements.refs;
      const { button } = handlers.chat;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { assignRef, theme } = get.framework();
      const { bemClass } = theme;

      const hasAttachments = get.currentAttachments().length > 0;
      const title = hasAttachments
        ? get
            .currentAttachments()
            .map((att) => att.name)
            .join(", ")
        : "Attach an image (ensure the model supports image inputs).";

      return (
        <ButtonFC
          className={bemClass(blocks.input._, blocks.input.attachImage)}
          framework={get.framework()}
          icon={"--lf-icon-image"}
          id={LF_CHAT_IDS.input.attachImage}
          disabled={Boolean(get.currentPrompt())}
          onClick={() => button(LF_CHAT_IDS.input.attachImage)}
          buttonRef={assignRef(input, "attachImage")}
          styling={hasAttachments ? "raised" : "flat"}
          uiState={get.currentPrompt() ? "disabled" : "primary"}
          style={{ height: "100%" }}
        />
      );
    },
    //#endregion

    //#region Attach File
    attachFile: () => {
      const { controller, elements, handlers } = getAdapter();
      const { get } = controller;
      const { input } = elements.refs;
      const { button } = handlers.chat;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { assignRef, theme } = get.framework();
      const { bemClass } = theme;

      const hasAttachments = get.currentAttachments().length > 0;
      const title = hasAttachments
        ? get
            .currentAttachments()
            .map((att) => att.name)
            .join(", ")
        : "Attach a file (ensure the model supports file inputs).";

      return (
        <ButtonFC
          className={bemClass(blocks.input._, blocks.input.attachFile)}
          framework={get.framework()}
          icon={"--lf-icon-attachment"}
          id={LF_CHAT_IDS.input.attachFile}
          disabled={Boolean(get.currentPrompt())}
          onClick={() => button(LF_CHAT_IDS.input.attachFile)}
          buttonRef={assignRef(input, "attachFile")}
          styling={hasAttachments ? "raised" : "flat"}
          uiState={get.currentPrompt() ? "disabled" : "primary"}
          style={{ height: "100%" }}
        />
      );
    },
    //#endregion

    //#region Configuration
    configuration: () => {
      const { controller, elements, handlers } = getAdapter();
      const { get } = controller;
      const { input } = elements.refs;
      const { button } = handlers.chat;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { assignRef, theme } = get.framework();
      const { bemClass } = theme;

      return (
        <ButtonFC
          className={bemClass(blocks.input._, blocks.input.configuration)}
          framework={get.framework()}
          icon="settings"
          id={LF_CHAT_IDS.input.configuration}
          onClick={() => button(LF_CHAT_IDS.input.configuration)}
          buttonRef={assignRef(input, "configuration")}
          styling="flat"
          style={{ height: "100%" }}
        />
      );
    },
    //#endregion

    //region Full Screen
    fullScreen: () => {
      const { controller, elements, handlers } = getAdapter();
      const { get } = controller;
      const { input } = elements.refs;
      const { button } = handlers.chat;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { assignRef, theme } = get.framework();
      const { bemClass } = theme;

      return (
        <ButtonFC
          className={bemClass(blocks.input._, blocks.input.fullScreen)}
          framework={get.framework()}
          icon="maximize"
          id={LF_CHAT_IDS.input.fullScreen}
          onClick={() => button(LF_CHAT_IDS.input.fullScreen)}
          buttonRef={assignRef(input, "fullScreen")}
          styling="flat"
        />
      );
    },

    //#region Progressbar
    progressbar: () => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { get } = controller;
      const { input } = elements.refs;

      const blocks = get.blocks();
      const parts = get.parts();
      const effectiveConfig = getEffectiveConfig(adapter);
      const lfContextWindow = effectiveConfig.llm.contextWindow;
      const { assignRef, theme } = get.framework();
      const { bemClass, get: themeGet } = theme;

      const { current, percentage } = get.currentTokens();
      const title = `Estimated tokens used: ${current}/${lfContextWindow}`;

      return (
        <lf-progressbar
          class={bemClass(blocks.input._, blocks.input.progressbar)}
          id={LF_CHAT_IDS.input.progressbar}
          lfCenteredLabel={true}
          lfIcon={themeGet.icon("percentage60")}
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
      const { get } = controller;
      const { input } = elements.refs;
      const { textfield } = handlers.chat;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { assignRef, theme } = get.framework();
      const { bemClass } = theme;

      return (
        <LfTextfieldFC
          className={bemClass(blocks.input._, blocks.input.textarea)}
          framework={get.framework()}
          id={LF_CHAT_IDS.input.textarea}
          label="What's on your mind?"
          styling="textarea"
          disabled={Boolean(get.currentPrompt())}
          uiState={get.currentPrompt() ? "disabled" : "primary"}
          onKeyDown={(e) => textfield(e)}
          inputRef={assignRef(input, "textarea")}
          style={{ width: "100%" }}
        />
      );
    },
    //#endregion
  };
};
