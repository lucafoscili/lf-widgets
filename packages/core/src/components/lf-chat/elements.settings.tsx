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

    //#region Context Window
    contextWindow: () => {
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
          id={LF_CHAT_IDS.options.contextWindow}
          lfHtmlAttributes={{
            min: 1024,
            type: "number",
          }}
          lfIcon={get.icon("arrowAutofitContent")}
          lfLabel="Context Window Size"
          lfValue={stringify(compInstance.lfContextWindow)}
          onLf-textfield-event={textfield}
          part={parts.contextWindow}
          ref={assignRef(settings, "contextWindow")}
        ></lf-textfield>
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

    //#region Export History
    exportHistory: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { settings } = elements.refs;
      const { button } = handlers.settings;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      return (
        <lf-button
          class={bemClass(blocks.settings._, blocks.settings.exportHistory)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.options.exportHistory}
          lfIcon={get.icon("download")}
          lfLabel="Export history"
          lfStretchX={true}
          onLf-button-event={button}
          part={parts.exportHistory}
          ref={assignRef(settings, "exportHistory")}
        ></lf-button>
      );
    },
    //#endregion

    //#region Frequency penalty
    frequencyPenalty: () => {
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
          id={LF_CHAT_IDS.options.frequencyPenalty}
          lfHtmlAttributes={{
            min: 0,
            type: "number",
          }}
          lfIcon={get.icon("codeCircle2")}
          lfLabel="Frequency Penalty"
          lfValue={stringify(compInstance.lfFrequencyPenalty)}
          onLf-textfield-event={textfield}
          part={parts.frequencyPenalty}
          ref={assignRef(settings, "frequencyPenalty")}
        ></lf-textfield>
      );
    },
    //#endregion

    //#region Import History
    importHistory: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { settings } = elements.refs;
      const { button } = handlers.settings;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      return (
        <lf-button
          class={bemClass(blocks.settings._, blocks.settings.importHistory)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.options.importHistory}
          lfIcon={get.icon("upload")}
          lfLabel="Import history"
          lfStretchX={true}
          onLf-button-event={button}
          part={parts.importHistory}
          ref={assignRef(settings, "importHistory")}
        ></lf-button>
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

    //#region Presence penalty
    presencePenalty: () => {
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
          id={LF_CHAT_IDS.options.presencePenalty}
          lfHtmlAttributes={{
            min: -2,
            type: "number",
          }}
          lfIcon={get.icon("schema")}
          lfLabel="Presence penalty"
          lfValue={stringify(compInstance.lfPresencePenalty)}
          onLf-textfield-event={textfield}
          part={parts.presencePenalty}
          ref={assignRef(settings, "presencePenalty")}
        ></lf-textfield>
      );
    },
    //#endregion

    //#region Seed
    seed: () => {
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
          id={LF_CHAT_IDS.options.seed}
          lfHtmlAttributes={{
            type: "number",
          }}
          lfIcon={get.icon("ikosaedr")}
          lfLabel="Random Seed (-1 for random)"
          lfValue={stringify(compInstance.lfSeed)}
          onLf-textfield-event={textfield}
          part={parts.seed}
          ref={assignRef(settings, "seed")}
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

    //#region Top P
    topP: () => {
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
          id={LF_CHAT_IDS.options.topP}
          lfHtmlAttributes={{
            max: 1,
            min: 0,
            step: 0.1,
            type: "number",
          }}
          lfIcon={get.icon("template")}
          lfLabel="Top P"
          lfValue={stringify(compInstance.lfTopP)}
          onLf-textfield-event={textfield}
          part={parts.topP}
          ref={assignRef(settings, "topP")}
        ></lf-textfield>
      );
    },
    //#endregion
  };
};
