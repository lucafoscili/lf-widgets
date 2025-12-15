import {
  isLayoutControl,
  isLayoutGroup,
  LfDataDataset,
  LfShapeeditorAdapter,
  LfShapeeditorControlConfig,
  LfShapeeditorLayoutGroup,
  LfShapeeditorLayoutRenderItem,
  LfShapeeditorRenderSegment,
  LfSliderValue,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { FIcon } from "../../utils/icon";
import { LfSliderFC } from "../lf-slider/lf-slider-fc";

/**
 * Prepares the items sub-block JSX (accordion + individual control items).
 * Part of the controls sub-block within settings panel.
 */
export const prepItems = (
  getAdapter: () => LfShapeeditorAdapter,
): (() => VNode) => {
  return () => {
    const adapter = getAdapter();
    const { controller, handlers } = adapter;
    const { blocks, config, framework, parts } = controller.get;
    const { accordionToggle } = handlers.settings;

    const b = blocks();
    const p = parts();
    const mgr = framework();

    const { theme } = mgr;
    const { bemClass } = theme;

    const controls = config?.controls?.() || [];
    const expandedGroups = config?.expandedGroups?.() || [];
    const layout = config?.layout?.();
    const settings = config?.settings?.() || {};

    const hasControls = controls.length > 0;

    if (!hasControls) {
      return (
        <div
          class={bemClass(b.settings.controls.items._)}
          part={p.settings.controls.items}
        >
          <slot name="settings"></slot>
        </div>
      );
    }

    const renderControl = (controlConfig: LfShapeeditorControlConfig): VNode =>
      createControl(controlConfig, settings[controlConfig.id], adapter);

    // Helper to find a control by ID
    const findControl = (id: string) => controls.find((c) => c.id === id);

    // Process layout into renderable items (mixed groups and standalone controls)
    const layoutItems: LfShapeeditorLayoutRenderItem[] =
      layout && layout.length
        ? layout
            .map((item): LfShapeeditorLayoutRenderItem | null => {
              if (isLayoutGroup(item)) {
                // Group: collect all controls for this accordion section
                const groupControls = item.controlIds
                  .map(findControl)
                  .filter((c): c is LfShapeeditorControlConfig => !!c);
                return {
                  type: "group",
                  group: item,
                  controls: groupControls,
                };
              } else if (isLayoutControl(item)) {
                // Standalone control
                const ctrl = findControl(item.controlId);
                return ctrl ? { type: "control", control: ctrl } : null;
              }
              return null;
            })
            .filter(
              (item): item is LfShapeeditorLayoutRenderItem => item !== null,
            )
        : [
            // Fallback: wrap all controls in a default group
            {
              type: "group" as const,
              group: {
                id: "default",
                label: "Settings",
                controlIds: controls.map((c) => c.id),
              },
              controls,
            },
          ];

    // Group consecutive groups together for accordion rendering
    // This preserves layout order while keeping accordion functionality
    const segments: LfShapeeditorRenderSegment[] = [];
    let currentAccordionGroups: Array<{
      group: LfShapeeditorLayoutGroup;
      controls: LfShapeeditorControlConfig[];
    }> = [];

    for (const item of layoutItems) {
      if (item.type === "control") {
        // Flush any accumulated groups into an accordion segment
        if (currentAccordionGroups.length > 0) {
          segments.push({
            type: "accordion",
            groups: currentAccordionGroups,
          });
          currentAccordionGroups = [];
        }
        segments.push({ type: "standalone", control: item.control });
      } else {
        // Accumulate groups for accordion
        currentAccordionGroups.push({
          group: item.group,
          controls: item.controls,
        });
      }
    }
    // Flush remaining groups
    if (currentAccordionGroups.length > 0) {
      segments.push({ type: "accordion", groups: currentAccordionGroups });
    }

    return (
      <div
        class={bemClass(b.settings.controls.items._)}
        part={p.settings.controls.items}
      >
        {segments.map((segment, segmentIdx) => {
          if (segment.type === "standalone") {
            return (
              <div
                key={segment.control.id}
                class={bemClass(
                  b.settings.controls.items._,
                  b.settings.controls.items.item,
                )}
              >
                {renderControl(segment.control)}
              </div>
            );
          }

          // Accordion segment with one or more groups
          const accordionDataset: LfDataDataset = {
            nodes: segment.groups.map(({ group }) => ({
              id: group.id,
              value: group.label,
              cells: {
                lfSlot: {
                  shape: "slot",
                  value: group.id,
                },
              },
            })),
          };

          return (
            <lf-accordion
              class={bemClass(
                b.settings.controls.items._,
                b.settings.controls.items.accordion,
              )}
              key={`accordion-${segmentIdx}`}
              lfDataset={accordionDataset}
              lfExpanded={expandedGroups}
              onLf-accordion-event={accordionToggle}
            >
              {segment.groups.map(({ group, controls: groupControls }) => (
                <div key={group.id} slot={group.id}>
                  {groupControls.map(renderControl)}
                </div>
              ))}
            </lf-accordion>
          );
        })}
      </div>
    );
  };
};

//#region Helpers
/**
 * Renders an info icon that displays a tooltip on hover.
 * The tooltip is registered via the framework's tooltip service.
 */
const renderInfoIcon = (
  adapter: LfShapeeditorAdapter,
  description: string,
): VNode => {
  const { controller, elements } = adapter;
  const { blocks, framework } = controller.get;
  const { refs } = elements;

  const b = blocks();
  const mgr = framework();

  const { bemClass } = mgr.theme;

  return (
    <div
      aria-label={description}
      class={bemClass(
        b.settings.controls.items._,
        b.settings.controls.items.info,
      )}
      ref={(el) => {
        if (el) {
          refs.settings.controls.items.infoIcons.set(description, el);
        }
      }}
      tabindex="0"
    >
      <FIcon framework={mgr} icon="--lf-icon-info"></FIcon>
    </div>
  );
};

const createControl = (
  config: LfShapeeditorControlConfig,
  currentValue: unknown,
  adapter: LfShapeeditorAdapter,
): VNode => {
  const { controller, handlers } = adapter;
  const { blocks, framework, resetKey } = controller.get;
  const { controls } = handlers.settings;

  const b = blocks();
  const mgr = framework();

  const { items } = b.settings.controls;
  const { logs } = mgr.debug;
  const { bemClass } = mgr.theme;

  const value = currentValue ?? getDefaultValue(config);
  const infoIcon = config.description
    ? renderInfoIcon(adapter, config.description)
    : null;

  // Use resetKey in the key to force re-creation when controls are reset
  const controlKey = `${config.id}-${resetKey()}`;

  switch (config.type) {
    case "checkbox":
      return (
        <div key={controlKey} class={bemClass(items._, items.item)}>
          <lf-checkbox
            lfLabel={config.label}
            lfValue={value as boolean}
            onLf-checkbox-event={(e) => controls.checkbox(e, config.id)}
          ></lf-checkbox>
          {infoIcon}
        </div>
      );

    case "colorpicker":
      return (
        <div key={controlKey} class={bemClass(items._, items.item)}>
          <lf-textfield
            lfHtmlAttributes={{
              type: "color",
            }}
            lfLabel={config.label}
            lfValue={String(value)}
            onLf-textfield-event={(e) => controls.colorpicker(e, config.id)}
          ></lf-textfield>
          {infoIcon}
        </div>
      );

    case "multiinput":
      return (
        <div key={controlKey} class={bemClass(items._, items.item)}>
          <lf-multiinput
            lfTextfieldProps={{
              lfLabel: config.label,
              lfHtmlAttributes: config.placeholder
                ? { placeholder: config.placeholder }
                : undefined,
            }}
            lfValue={value as string}
            onLf-multiinput-event={(e) => controls.multiinput(e, config.id)}
          ></lf-multiinput>
          {infoIcon}
        </div>
      );

    case "number":
      return (
        <div key={controlKey} class={bemClass(items._, items.item)}>
          <lf-textfield
            lfHtmlAttributes={{
              max: config.max,
              min: config.min,
              step: config.step,
              type: "number",
            }}
            lfLabel={config.label}
            lfValue={String(value)}
            onLf-textfield-event={(e) => controls.number(e, config.id)}
          ></lf-textfield>
          {infoIcon}
        </div>
      );

    case "select":
      return (
        <div key={controlKey} class={bemClass(items._, items.item)}>
          <lf-select
            lfDataset={{
              nodes: config.options.map((opt) => ({
                id: opt.value,
                value: opt.label,
              })),
            }}
            lfTextfieldProps={{ lfLabel: config.label }}
            lfValue={value as string}
            onLf-select-event={(e) => controls.select(e, config.id)}
          ></lf-select>
          {infoIcon}
        </div>
      );

    case "slider": {
      // Create slider value object from raw number
      const numValue = value as number;
      const min = config.min ?? 0;
      const max = config.max ?? 100;
      const step = config.step ?? 1;
      const percentage = ((numValue - min) / (max - min)) * 100;
      const sliderValue: LfSliderValue = {
        display: numValue,
        real: numValue,
      };

      // FC handler - calls controlChange directly without CustomEvent
      const { controlChange } = adapter.handlers.settings;
      const handleChange = (val: number) => {
        controlChange(null, config.id, val, "change");
      };
      const handleInput = (val: number) => {
        controlChange(null, config.id, val, "input");
      };

      return (
        <div key={controlKey} class={bemClass(items._, items.item)}>
          <LfSliderFC
            framework={mgr}
            label={config.label}
            leadingLabel={true}
            min={min}
            max={max}
            step={step}
            value={sliderValue}
            onChange={handleChange}
            onInput={handleInput}
            style={{ "--lf_slider_value": `${percentage}%` }}
          />
          {config.unit && <span class="unit">{config.unit}</span>}
          {infoIcon}
        </div>
      );
    }

    case "textfield":
      return (
        <div key={controlKey} class={bemClass(items._, items.item)}>
          <lf-textfield
            lfLabel={config.label}
            lfValue={value as string}
            onLf-textfield-event={(e) => controls.textfield(e, config.id)}
          ></lf-textfield>
          {infoIcon}
        </div>
      );

    case "toggle":
      return (
        <div key={controlKey} class={bemClass(items._, items.item)}>
          <lf-toggle
            lfAriaLabel={config.label}
            lfLabel={config.label}
            lfLeadingLabel={true}
            lfValue={value as boolean}
            onLf-toggle-event={(e) => controls.toggle(e, config.id)}
          ></lf-toggle>
          {infoIcon}
        </div>
      );

    default:
      logs.new(
        adapter.controller.get.compInstance(),
        "Unsupported control type: " + (config as any).type,
        "warning",
      );
      return null;
  }
};

const getDefaultValue = (
  config: LfShapeeditorControlConfig,
): string | number | boolean | null => {
  switch (config.type) {
    // boolean
    case "checkbox":
    case "toggle":
      return config.defaultValue;
    // string
    case "colorpicker":
    case "multiinput":
    case "select":
    case "textfield":
      return config.defaultValue;
    // number
    case "number":
    case "slider":
      return config.defaultValue;
    default:
      return null;
  }
};
//#endregion
