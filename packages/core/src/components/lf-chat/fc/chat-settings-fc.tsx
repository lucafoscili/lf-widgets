import { LfChatAdapter, LfDataDataset } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

//#region Props
export interface ChatSettingsFCProps {
  adapter: LfChatAdapter;
  /** Stable accordion dataset (created once to prevent collapse on re-render) */
  accordionDataset: LfDataDataset;
}
//#endregion

/**
 * FC for the chat settings panel.
 * Per Section 5.9 "Mirroring Rule" - mirrors elements.settings.tsx composition.
 */
export const ChatSettingsFC: FunctionalComponent<ChatSettingsFCProps> = ({
  adapter,
  accordionDataset,
}) => {
  const { controller, elements } = adapter;
  const { get } = controller;

  const blocks = get.blocks();
  const parts = get.parts();
  const { theme } = get.framework();
  const { bemClass } = theme;

  const {
    agentSettings,
    back,
    contextWindow,
    endpoint,
    exportHistory,
    frequencyPenalty,
    importHistory,
    maxTokens,
    polling,
    presencePenalty,
    system,
    seed,
    temperature,
    tools,
    topP,
  } = elements.jsx.settings;

  const { settings } = blocks;

  return (
    <div class={bemClass(settings._)} part={parts.settings}>
      <div class={bemClass(settings._, settings.header)}>
        {back()}
        {importHistory()}
        {exportHistory()}
      </div>
      <div
        class={bemClass(settings._, settings.configuration)}
        part={parts.configuration}
      >
        <lf-accordion
          class={bemClass(settings._, settings.accordion)}
          lfDataset={accordionDataset}
          lfRipple={true}
        >
          <div slot="llm" class={bemClass(settings._, settings.slotContent)}>
            {system()}
            {endpoint()}
            {temperature()}
            {maxTokens()}
            {topP()}
            {frequencyPenalty()}
            {presencePenalty()}
          </div>
          <div
            slot="advanced"
            class={bemClass(settings._, settings.slotContent)}
          >
            {contextWindow()}
            {seed()}
            {polling()}
          </div>
          <div slot="agent" class={bemClass(settings._, settings.slotContent)}>
            {agentSettings()}
          </div>
          <div slot="tools" class={bemClass(settings._, settings.slotContent)}>
            {tools()}
          </div>
        </lf-accordion>
      </div>
    </div>
  );
};
