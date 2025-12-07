import {
  IDS,
  LfDataCell,
  LfDataDataset,
  LfDataShapes,
  LfShapeeditorAdapter,
  LfShapeeditorAdapterJsx,
  LfShapeeditorControlConfig,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { LfShape } from "../../utils/shapes";

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
      const { controller, elements, handlers } = getAdapter();
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

      const groupedControls =
        layout && layout.length
          ? layout.map((group) => ({
              id: group.id,
              label: group.label,
              controls: controls.filter((c) => group.controlIds.includes(c.id)),
            }))
          : [
              {
                id: "default",
                label: "Settings",
                controls,
              },
            ];

      const renderControl = (config: LfShapeeditorControlConfig): VNode =>
        createControl(config, settings[config.id], (e, id, value) =>
          controlChange(e, id, value),
        );

      const accordionDataset: LfDataDataset = {
        nodes: groupedControls.map((group) => ({
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
        <div
          class={bemClass(blocks.detailsGrid._, blocks.detailsGrid.settings)}
          ref={assignRef(details, "settings")}
        >
          <lf-accordion
            lfDataset={accordionDataset}
            lfExpanded={expandedGroups}
            onLf-accordion-event={accordionToggle}
          >
            {groupedControls.map((group) => (
              <div key={group.id} slot={group.id}>
                {group.controls.map(renderControl)}
              </div>
            ))}
          </lf-accordion>
        </div>
      );
    },
    // #endregion
  };
};

//#region Helpers
const createControl = (
  config: LfShapeeditorControlConfig,
  currentValue: unknown,
  onChange: (
    e: CustomEvent | Event,
    controlId: string,
    value: string | number | boolean,
  ) => void,
): VNode => {
  const value = currentValue ?? getDefaultValue(config);

  switch (config.type) {
    case "checkbox":
      return (
        <div key={config.id} class="control-item">
          <lf-checkbox
            lfLabel={config.label}
            lfValue={value as boolean}
            onLf-checkbox-event={(e) => {
              if (e.detail.eventType === "change") {
                onChange(e, config.id, e.detail.comp.lfValue);
              }
            }}
          ></lf-checkbox>
          {config.description && <small>{config.description}</small>}
        </div>
      );

    case "multiinput":
      return (
        <div key={config.id} class="control-item">
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
          {config.description && <small>{config.description}</small>}
        </div>
      );

    case "slider":
      return (
        <div key={config.id} class="control-item">
          <label>{config.label}</label>
          <lf-slider
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
          {config.description && <small>{config.description}</small>}
        </div>
      );

    case "toggle":
      return (
        <div key={config.id} class="control-item">
          <lf-toggle
            lfLabel={config.label}
            lfValue={value as boolean}
            onLf-toggle-event={(e) => {
              if (e.detail.eventType === "change") {
                onChange(e, config.id, e.detail.comp.lfValue);
              }
            }}
          ></lf-toggle>
          {config.description && <small>{config.description}</small>}
        </div>
      );

    case "textfield":
      return (
        <div key={config.id} class="control-item">
          <lf-textfield
            lfLabel={config.label}
            lfValue={value as string}
            onLf-textfield-event={(e) => {
              if (e.detail.eventType === "input") {
                onChange(e, config.id, e.detail.comp.lfValue);
              }
            }}
          ></lf-textfield>
          {config.description && <small>{config.description}</small>}
        </div>
      );

    case "colorpicker":
      return (
        <div key={config.id} class="control-item">
          <label>{config.label}</label>
          <input
            type="color"
            value={value as string}
            onInput={(e) => {
              onChange(e, config.id, (e.target as HTMLInputElement).value);
            }}
          />
          {config.description && <small>{config.description}</small>}
        </div>
      );

    case "select":
      return (
        <div key={config.id} class="control-item">
          <lf-select
            lfTextfieldProps={{ lfLabel: config.label }}
            lfValue={value as string}
            lfDataset={{
              nodes: config.options.map((opt) => ({
                id: opt.value,
                value: opt.label,
              })),
            }}
            onLf-select-event={(e) => {
              if (e.detail.eventType === "change") {
                onChange(e, config.id, e.detail.comp.lfValue);
              }
            }}
          ></lf-select>
          {config.description && <small>{config.description}</small>}
        </div>
      );

    case "number":
      return (
        <div key={config.id} class="control-item">
          <lf-textfield
            lfLabel={config.label}
            lfValue={String(value)}
            onLf-textfield-event={(e) => {
              if (e.detail.eventType === "input") {
                onChange(e, config.id, parseFloat(e.detail.comp.lfValue) || 0);
              }
            }}
          ></lf-textfield>
          {config.description && <small>{config.description}</small>}
        </div>
      );

    default:
      return null;
  }
};

const getDefaultValue = (
  config: LfShapeeditorControlConfig,
): string | number | boolean | null => {
  switch (config.type) {
    case "checkbox":
    case "toggle":
      return config.defaultValue;
    case "colorpicker":
    case "multiinput":
    case "select":
    case "textfield":
      return config.defaultValue;
    case "number":
    case "slider":
      return config.defaultValue;
    default:
      return null;
  }
};
//#endregion
