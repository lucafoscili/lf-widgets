import {
  LF_CHAT_IDS,
  LfChatAdapter,
  LfChatAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";

export const prepSettings = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterJsx["settings"] => {
  return {
    //#region Back
    back: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { settings } = elements.refs;
      const { button } = handlers.settings;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      const icon = get.current().variables["--lf-icon-previous"];

      return (
        <lf-button
          class={bemClass(blocks.settings._, blocks.settings.back)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.options.back}
          lfIcon={icon}
          lfLabel="Back"
          lfStretchX={true}
          onLf-button-event={button}
          part={parts.back}
          ref={assignRef(settings, "back")}
        ></lf-button>
      );
    },
    //#endregion

    //#region Endpoint
    endpoint: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, cyAttributes, manager, parts } =
        controller.get;
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      return (
        <lf-textfield
          class={bemClass(blocks.settings._, blocks.settings.textfield)}
          data-cy={cyAttributes.input}
          id={LF_CHAT_IDS.options.endpointUrl}
          lfIcon={get.icon("network")}
          lfLabel="Endpoint URL"
          lfValue={compInstance.lfEndpointUrl}
          onLf-textfield-event={textfield}
          part={parts.endpointUrl}
          ref={assignRef(settings, "endpoint")}
        ></lf-textfield>
      );
    },
    //#endregion

    //#region Max tokens
    maxTokens: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, cyAttributes, manager, parts } =
        controller.get;
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, data, theme } = manager;
      const { stringify } = data.cell;
      const { bemClass, get } = theme;

      return (
        <lf-textfield
          class={bemClass(blocks.settings._, blocks.settings.textfield)}
          data-cy={cyAttributes.input}
          id={LF_CHAT_IDS.options.maxTokens}
          lfHtmlAttributes={{
            min: 10,
            type: "number",
          }}
          lfIcon={get.icon("numbers")}
          lfLabel="Max tokens count"
          lfValue={stringify(compInstance.lfMaxTokens)}
          onLf-textfield-event={textfield}
          part={parts.maxTokens}
          ref={assignRef(settings, "maxTokens")}
        ></lf-textfield>
      );
    },
    //#endregion

    //#region Polling
    polling: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, cyAttributes, manager, parts } =
        controller.get;
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, data, theme } = manager;
      const { stringify } = data.cell;
      const { bemClass, get } = theme;

      return (
        <lf-textfield
          class={bemClass(blocks.settings._, blocks.settings.textfield)}
          data-cy={cyAttributes.input}
          id={LF_CHAT_IDS.options.polling}
          lfHtmlAttributes={{
            min: 10,
            type: "number",
          }}
          lfIcon={get.icon("hourglassLow")}
          lfLabel="Polling interval"
          lfValue={stringify(compInstance.lfPollingInterval)}
          onLf-textfield-event={textfield}
          part={parts.polling}
          ref={assignRef(settings, "polling")}
        ></lf-textfield>
      );
    },
    //#endregion

    //#region System
    system: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, cyAttributes, manager, parts } =
        controller.get;
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <lf-textfield
          class={bemClass(blocks.settings._, blocks.settings.textarea)}
          data-cy={cyAttributes.input}
          id={LF_CHAT_IDS.options.system}
          lfLabel="System prompt"
          lfStyling="textarea"
          lfValue={compInstance.lfSystem}
          onLf-textfield-event={textfield}
          part={parts.system}
          ref={assignRef(settings, "system")}
          title="The system prompt is used to generate the first response in the conversation."
        ></lf-textfield>
      );
    },
    //#endregion

    //#region Temperature
    temperature: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, cyAttributes, manager, parts } =
        controller.get;
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, data, theme } = manager;
      const { stringify } = data.cell;
      const { bemClass, get } = theme;

      return (
        <lf-textfield
          class={bemClass(blocks.settings._, blocks.settings.textfield)}
          data-cy={cyAttributes.input}
          id={LF_CHAT_IDS.options.temperature}
          lfHtmlAttributes={{
            max: 1,
            min: 0.1,
            type: "number",
          }}
          lfIcon={get.icon("temperature")}
          lfLabel="Temperature"
          lfValue={stringify(compInstance.lfTemperature)}
          onLf-textfield-event={textfield}
          part={parts.temperature}
          ref={assignRef(settings, "temperature")}
        ></lf-textfield>
      );
    },
    //#endregion
  };
};
