import {
  IDS,
  isLayoutControl,
  isLayoutGroup,
  LfDataCell,
  LfDataDataset,
  LfDataShapes,
  LfShapeeditorAdapter,
  LfShapeeditorAdapterJsx,
  LfShapeeditorControlConfig,
  LfShapeeditorLayoutGroup,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { FIcon } from "../../utils/icon";
import { LfShape } from "../../utils/shapes";
import { LfShapeeditor } from "./lf-shapeeditor";

export const prepDetails = (
  getAdapter: () => LfShapeeditorAdapter,
): LfShapeeditorAdapterJsx["details"] => {
  return {
    // #region Shape
    shape: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, history, lfAttribute, manager } =
        controller.get;
      const { details } = elements.refs;
      const { shape } = handlers.details;
      const { currentSnapshot } = history;
      const { lfShape } = compInstance;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      const snapshot = currentSnapshot();
      if (!snapshot) {
        return;
      }

      // Use the original cell from the snapshot (contains full props like lfDataset, lfSeries, etc.)
      // Fall back to a minimal cell with just value for backwards compatibility
      const originalCell = snapshot.shape?.shape;
      const cell = (
        originalCell
          ? { ...originalCell, shape: lfShape }
          : {
              shape: lfShape,
              value: snapshot.value,
              lfValue: snapshot.value,
            }
      ) as LfDataCell<LfDataShapes>;

      return (
        <div
          class={bemClass(blocks.detailsGrid._, blocks.detailsGrid.shape)}
          data-lf={lfAttribute.fadeIn}
          id={IDS.details.shape}
          ref={assignRef(details, "shape")}
        >
          <LfShape
            cell={cell}
            eventDispatcher={async (e) => shape(e)}
            framework={manager}
            index={snapshot.shape?.index ?? 0}
            shape={lfShape}
          />
        </div>
      );
    },
    // #endregion

    // #region Clear history
    clearHistory: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, history, manager } = controller.get;
      const { details } = elements.refs;
      const { button } = handlers.details;
      const { current } = history;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      const icon = get.icon("stackPop");
      const hasHistory = !!(current()?.length > 1);
      const isDisabled = !hasHistory;

      return (
        <lf-button
          class={bemClass(
            blocks.detailsGrid._,
            blocks.detailsGrid.clearHistory,
          )}
          data-cy={cyAttributes.button}
          id={IDS.details.clearHistory}
          lfIcon={icon}
          lfLabel="Clear history"
          lfStretchX={true}
          lfStyling="flat"
          lfUiState={isDisabled ? "disabled" : "danger"}
          onLf-button-event={button}
          ref={assignRef(details, "clearHistory")}
        ></lf-button>
      );
    },
    // #endregion

    // #region Delete shape
    deleteShape: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, manager } = controller.get;
      const { details } = elements.refs;
      const { button } = handlers.details;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      const { "--lf-icon-clear": icon } = get.current().variables;

      return (
        <lf-button
          class={bemClass(blocks.detailsGrid._, blocks.detailsGrid.delete)}
          data-cy={cyAttributes.button}
          id={IDS.details.deleteShape}
          lfIcon={icon}
          lfLabel="Delete"
          lfStretchX={true}
          lfUiState="danger"
          onLf-button-event={button}
          ref={assignRef(details, "deleteShape")}
        ></lf-button>
      );
    },
    // #endregion

    // #region Redo
    redo: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, history, manager } = controller.get;
      const { current, index } = history;
      const { details } = elements.refs;
      const { button } = handlers.details;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      const { "--lf-icon-next": icon } = get.current().variables;

      const currentHistory = current();
      const hasHistory = !!currentHistory?.length;
      const isDisabled = !(hasHistory && index() < currentHistory.length - 1);

      return (
        <lf-button
          class={bemClass(blocks.detailsGrid._, blocks.detailsGrid.redo)}
          data-cy={cyAttributes.button}
          id={IDS.details.redo}
          lfIcon={icon}
          lfLabel="Redo"
          lfStretchX={true}
          lfStyling="flat"
          lfUiState={isDisabled ? "disabled" : "primary"}
          onLf-button-event={button}
          ref={assignRef(details, "redo")}
        ></lf-button>
      );
    },
    // #endregion

    // #region Save
    save: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, history, manager } = controller.get;
      const { current } = history;
      const { details } = elements.refs;
      const { button } = handlers.details;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      const { "--lf-icon-success": icon } = get.current().variables;

      const hasHistory = !!(current()?.length > 1);
      const isDisabled = !hasHistory;

      return (
        <lf-button
          class={bemClass(
            blocks.detailsGrid._,
            blocks.detailsGrid.commitChanges,
          )}
          data-cy={cyAttributes.button}
          id={IDS.details.save}
          lfIcon={icon}
          lfLabel="Save snapshot"
          lfStretchX={true}
          lfUiState={isDisabled ? "disabled" : "success"}
          onLf-button-event={button}
          ref={assignRef(details, "save")}
        ></lf-button>
      );
    },
    // #endregion

    // #region Spinner
    spinner: () => {
      const { controller, elements } = getAdapter();
      const { blocks, manager, spinnerStatus } = controller.get;
      const { details } = elements.refs;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <lf-spinner
          class={bemClass(blocks.detailsGrid._, blocks.detailsGrid.spinner)}
          id={IDS.details.spinner}
          lfActive={spinnerStatus()}
          lfDimensions="16px"
          lfFader={true}
          lfFaderTimeout={125}
          lfLayout={14}
          ref={assignRef(details, "save")}
        ></lf-spinner>
      );
    },
    // #endregion

    // #region Tree
    tree: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, cyAttributes, manager } = controller.get;
      const { details } = elements.refs;
      const { tree } = handlers.details;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <lf-tree
          class={bemClass(blocks.detailsGrid._, blocks.detailsGrid.tree)}
          data-cy={cyAttributes.input}
          id={IDS.details.tree}
          lfAccordionLayout={true}
          lfDataset={compInstance.lfValue}
          lfFilter={false}
          lfSelectable={true}
          lfUiSize="small"
          onLf-tree-event={tree}
          ref={assignRef(details, "tree")}
        ></lf-tree>
      );
    },
    // #endregion

    // #region Undo
    undo: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, history, manager } = controller.get;
      const { current, index } = history;
      const { details } = elements.refs;
      const { button } = handlers.details;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      const { "--lf-icon-previous": icon } = get.current().variables;

      const hasHistory = !!current()?.length;
      const isDisabled = !(hasHistory && index() > 0);

      return (
        <lf-button
          class={bemClass(blocks.detailsGrid._, blocks.detailsGrid.undo)}
          data-cy={cyAttributes.button}
          id={IDS.details.undo}
          lfIcon={icon}
          lfLabel="Undo"
          lfStretchX={true}
          lfStyling="flat"
          lfUiState={isDisabled ? "disabled" : "primary"}
          onLf-button-event={button}
          ref={assignRef(details, "undo")}
        ></lf-button>
      );
    },
    // #endregion

    // #region Settings
    settings: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, config, manager } = controller.get;
      const { details } = elements.refs;
      const { accordionToggle, controlChange } = handlers.details;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      const controls = config?.controls?.() || [];
      const expandedGroups = config?.expandedGroups?.() || [];
      const layout = config?.layout?.();
      const settings = config?.settings?.() || {};

      const hasControls = controls.length > 0;

      if (!hasControls) {
        return (
          <div
            class={bemClass(blocks.detailsGrid._, blocks.detailsGrid.settings)}
            ref={assignRef(details, "settings")}
          >
            <slot name="settings"></slot>
          </div>
        );
      }

      const renderControl = (config: LfShapeeditorControlConfig): VNode =>
        createControl(
          config,
          settings[config.id],
          (e, id, value) => controlChange(e, id, value),
          adapter,
        );

      // Helper to find a control by ID
      const findControl = (id: string) => controls.find((c) => c.id === id);

      // Process layout into renderable items (mixed groups and standalone controls)
      type LayoutRenderItem =
        | { type: "group"; group: LfShapeeditorLayoutGroup; controls: LfShapeeditorControlConfig[] }
        | { type: "control"; control: LfShapeeditorControlConfig };

      const layoutItems: LayoutRenderItem[] =
        layout && layout.length
          ? layout
              .map((item): LayoutRenderItem | null => {
                if (isLayoutGroup(item)) {
                  // Group: collect all controls for this accordion section
                  const groupControls = item.controlIds
                    .map(findControl)
                    .filter((c): c is LfShapeeditorControlConfig => !!c);
                  return { type: "group", group: item, controls: groupControls };
                } else if (isLayoutControl(item)) {
                  // Standalone control
                  const ctrl = findControl(item.controlId);
                  return ctrl ? { type: "control", control: ctrl } : null;
                }
                return null;
              })
              .filter((item): item is LayoutRenderItem => item !== null)
          : [
              // Fallback: wrap all controls in a default group
              {
                type: "group" as const,
                group: { id: "default", label: "Settings", controlIds: controls.map((c) => c.id) },
                controls,
              },
            ];

      // Group consecutive groups together for accordion rendering
      // This preserves layout order while keeping accordion functionality
      type RenderSegment =
        | { type: "standalone"; control: LfShapeeditorControlConfig }
        | { type: "accordion"; groups: Array<{ group: LfShapeeditorLayoutGroup; controls: LfShapeeditorControlConfig[] }> };

      const segments: RenderSegment[] = [];
      let currentAccordionGroups: Array<{ group: LfShapeeditorLayoutGroup; controls: LfShapeeditorControlConfig[] }> = [];

      for (const item of layoutItems) {
        if (item.type === "control") {
          // Flush any accumulated groups into an accordion segment
          if (currentAccordionGroups.length > 0) {
            segments.push({ type: "accordion", groups: currentAccordionGroups });
            currentAccordionGroups = [];
          }
          segments.push({ type: "standalone", control: item.control });
        } else {
          // Accumulate groups for accordion
          currentAccordionGroups.push({ group: item.group, controls: item.controls });
        }
      }
      // Flush remaining groups
      if (currentAccordionGroups.length > 0) {
        segments.push({ type: "accordion", groups: currentAccordionGroups });
      }

      return (
        <div
          class={bemClass(blocks.detailsGrid._, blocks.detailsGrid.settings)}
          ref={assignRef(details, "settings")}
        >
          {segments.map((segment, segmentIdx) => {
            if (segment.type === "standalone") {
              return (
                <div
                  key={segment.control.id}
                  class={bemClass(
                    blocks.detailsGrid._,
                    blocks.detailsGrid.standaloneControl,
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
    },
    // #endregion
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
  const { blocks, manager } = controller.get;
  const { refs } = elements;
  const { bemClass } = manager.theme;

  return (
    <div
      aria-label={description}
      class={bemClass(blocks.detailsGrid._, blocks.detailsGrid.infoIcon)}
      ref={(el) => {
        if (el) {
          refs.details.infoIcons.set(description, el);
        }
      }}
      tabindex="0"
    >
      <FIcon framework={manager} icon="--lf-icon-info"></FIcon>
    </div>
  );
};

const createControl = (
  config: LfShapeeditorControlConfig,
  currentValue: unknown,
  onChange: (
    e: CustomEvent | Event,
    controlId: string,
    value: string | number | boolean,
  ) => void,
  adapter: LfShapeeditorAdapter,
): VNode => {
  const { controller } = adapter;
  const { blocks, compInstance, manager } = controller.get;
  const { detailsGrid } = blocks;
  const { logs } = manager.debug;
  const { bemClass } = manager.theme;

  const value = currentValue ?? getDefaultValue(config);
  const comp = compInstance as LfShapeeditor;
  const infoIcon = config.description
    ? renderInfoIcon(adapter, config.description)
    : null;

  switch (config.type) {
    case "checkbox":
      return (
        <div
          key={config.id}
          class={bemClass(detailsGrid._, detailsGrid.controlItem)}
        >
          <lf-checkbox
            lfLabel={config.label}
            lfValue={value as boolean}
            onLf-checkbox-event={(e) => {
              if (e.detail.eventType === "change") {
                onChange(e, config.id, e.detail.comp.lfValue);
              }
            }}
          ></lf-checkbox>
          {infoIcon}
        </div>
      );

    case "colorpicker":
      return (
        <div
          key={config.id}
          class={bemClass(detailsGrid._, detailsGrid.controlItem)}
        >
          <lf-textfield
            lfHtmlAttributes={{
              type: "color",
            }}
            lfLabel={config.label}
            lfValue={String(value)}
            onLf-textfield-event={(e) => {
              if (e.detail.eventType === "input") {
                onChange(e, config.id, parseFloat(e.detail.comp.lfValue) || 0);
              }
            }}
          ></lf-textfield>
          {infoIcon}
        </div>
      );

    case "multiinput":
      return (
        <div
          key={config.id}
          class={bemClass(detailsGrid._, detailsGrid.controlItem)}
        >
          <lf-multiinput
            lfTextfieldProps={{
              lfLabel: config.label,
              lfHtmlAttributes: config.placeholder
                ? { placeholder: config.placeholder }
                : undefined,
            }}
            lfValue={value as string}
            onLf-multiinput-event={(e) => {
              if (e.detail.eventType === "change") {
                onChange(e, config.id, e.detail.comp.lfValue);
              }
            }}
          ></lf-multiinput>
          {infoIcon}
        </div>
      );

    case "number":
      return (
        <div
          key={config.id}
          class={bemClass(detailsGrid._, detailsGrid.controlItem)}
        >
          <lf-textfield
            lfHtmlAttributes={{
              max: config.max,
              min: config.min,
              step: config.step,
              type: "number",
            }}
            lfLabel={config.label}
            lfValue={String(value)}
            onLf-textfield-event={(e) => {
              if (e.detail.eventType === "input") {
                onChange(e, config.id, parseFloat(e.detail.comp.lfValue) || 0);
              }
            }}
          ></lf-textfield>
          {infoIcon}
        </div>
      );

    case "select":
      return (
        <div
          key={config.id}
          class={bemClass(detailsGrid._, detailsGrid.controlItem)}
        >
          <lf-select
            lfDataset={{
              nodes: config.options.map((opt) => ({
                id: opt.value,
                value: opt.label,
              })),
            }}
            lfTextfieldProps={{ lfLabel: config.label }}
            lfValue={value as string}
            onLf-select-event={(e) => {
              if (e.detail.eventType === "change") {
                onChange(e, config.id, e.detail.comp.lfValue);
              }
            }}
          ></lf-select>
          {infoIcon}
        </div>
      );

    case "slider":
      return (
        <div
          key={config.id}
          class={bemClass(detailsGrid._, detailsGrid.controlItem)}
        >
          <lf-slider
            lfLabel={config.label}
            lfLeadingLabel={true}
            lfMin={config.min}
            lfMax={config.max}
            lfStep={config.step}
            lfValue={value as number}
            onLf-slider-event={(e) => {
              if (e.detail.eventType === "input") {
                onChange(e, config.id, e.detail.comp.lfValue);
              }
            }}
          ></lf-slider>
          {config.unit && <span class="unit">{config.unit}</span>}
        </div>
      );

    case "textfield":
      return (
        <div
          key={config.id}
          class={bemClass(detailsGrid._, detailsGrid.controlItem)}
        >
          <lf-textfield
            lfLabel={config.label}
            lfValue={value as string}
            onLf-textfield-event={(e) => {
              if (e.detail.eventType === "input") {
                onChange(e, config.id, e.detail.comp.lfValue);
              }
            }}
          ></lf-textfield>
          {infoIcon}
        </div>
      );

    case "toggle":
      return (
        <div
          key={config.id}
          class={bemClass(detailsGrid._, detailsGrid.controlItem)}
        >
          <lf-toggle
            lfAriaLabel={config.label}
            lfLabel={config.label}
            lfLeadingLabel={true}
            lfValue={value as boolean}
            onLf-toggle-event={(e) => {
              if (e.detail.eventType === "change") {
                onChange(e, config.id, e.detail.comp.lfValue);
              }
            }}
          ></lf-toggle>
          {infoIcon}
        </div>
      );

    default:
      logs.new(
        comp,
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
