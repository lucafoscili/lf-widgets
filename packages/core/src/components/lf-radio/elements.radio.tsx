import {
  LfDataNode,
  LfRadioAdapter,
  LfRadioAdapterJsx,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";

export const prepRadio = (
  getAdapter: () => LfRadioAdapter,
): LfRadioAdapterJsx => {
  return {
    //#region Control
    control: (node: LfDataNode): VNode => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, compInstance, cyAttributes, manager, parts, state, ui } =
        controller.get;
      const { blur, change, focus } = handlers;
      const { theme } = manager;
      const { bemClass } = theme;

      const isSelected = state.isSelected(node.id);
      const hasRipple = ui.hasRipple();
      const inputName = `${compInstance.rootElement.id || "lf-radio"}-group`;

      return (
        <div class={bemClass(blocks.control._)}>
          <input
            checked={isSelected}
            class={bemClass(blocks.control._, blocks.control.input)}
            data-cy={cyAttributes.input}
            disabled={node.isDisabled}
            id={node.id}
            name={inputName}
            onBlur={(e) => blur(e, node.id)}
            onChange={(e) => {
              change(e, node.id);
            }}
            onFocus={(e) => {
              focus(e, node.id);
            }}
            part={parts.input}
            ref={(el) => {
              if (el) {
                elements.refs.inputs.set(node.id, el);
              }
            }}
            title={node.description}
            type="radio"
            value={node.value}
          />
          <div
            class={bemClass(blocks.control._, blocks.control.circle)}
            part={parts.circle}
          >
            {hasRipple && (
              <div
                class={bemClass(blocks.control._, blocks.control.ripple)}
                data-cy={cyAttributes.rippleSurface}
                part={parts.ripple}
                ref={(el) => {
                  if (el) {
                    elements.refs.ripples.set(node.id, el);
                  }
                }}
              ></div>
            )}
            <div
              class={bemClass(blocks.control._, blocks.control.dot)}
              part={parts.dot}
            ></div>
          </div>
        </div>
      );
    },
    //#endregion

    //#region Item
    item: (node: LfDataNode, _index: number) => {
      const { controller, elements, handlers } = getAdapter();
      const { get } = controller;
      const { control } = elements.jsx;
      const { blocks, manager, parts, state, ui } = get;
      const { click } = handlers;
      const { theme } = manager;
      const { bemClass } = theme;

      const isSelected = state.isSelected(node.id);
      const isLeading = ui.isLeadingLabel();
      const isDisabled = node.isDisabled;
      const labelText = manager.data.cell.stringify(node.value) || node.id;

      return (
        <div
          class={bemClass(blocks.item._, undefined, {
            leading: isLeading,
            selected: isSelected,
            disabled: isDisabled,
          })}
          onClick={(e) => click(e, node.id)}
          onPointerDown={(e) => handlers.pointerDown(e, node)}
          part={parts.item}
          ref={(el) => {
            if (el) elements.refs.items.set(node.id, el);
          }}
        >
          {control(node)}
          <label
            class={bemClass(blocks.item._, blocks.item.label)}
            htmlFor={`${get.compInstance.rootElement.id || "lf-radio"}-group-${node.id}`}
          >
            {labelText}
          </label>
        </div>
      );
    },
    //#endregion

    //#region Label
    label: (node: LfDataNode): VNode => {
      const { blocks, manager, parts } = getAdapter().controller.get;
      const { theme } = manager;
      const { bemClass } = theme;

      const labelText = manager.data.cell.stringify(node.value) || node.id;

      return (
        <label
          class={bemClass(blocks.item._, blocks.item.label)}
          part={parts.label}
        >
          {labelText}
        </label>
      );
    },
    //#endregion

    //#region Radio
    radio: (nodes: LfDataNode[]) => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, lfAttributes, manager, parts, ui } =
        controller.get;
      const { item } = elements.jsx;
      const { bemClass } = manager.theme;

      const orientation = ui.orientation();
      const isHorizontal = orientation === "horizontal";

      return (
        <div
          class={bemClass(blocks._, undefined, {
            horizontal: isHorizontal,
          })}
          data-lf={lfAttributes[compInstance.lfUiState]}
          onKeyDown={handlers.keyDown}
          part={parts.radio}
        >
          {nodes.map((node, index) => item(node, index))}
        </div>
      );
    },
    //#endregion
  };
};
