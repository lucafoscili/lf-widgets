import {
  LfDataNode,
  LfRadioAdapter,
  LfRadioAdapterJsx,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { LfRadioFC } from "./lf-radio-fc";

export const prepRadio = (
  getAdapter: () => LfRadioAdapter,
): LfRadioAdapterJsx => {
  return {
    //#region Control
    control: (node: LfDataNode): VNode => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, cyAttributes, framework, parts } = controller.get;
      const { computed } = controller;
      const { blur, change, focus } = handlers;
      const { theme } = framework();
      const { bemClass } = theme;

      const isSelected = computed.isSelected(node.id);

      return (
        <div class={bemClass(blocks().control._)} part={parts().control}>
          <input
            checked={isSelected}
            class={bemClass(blocks().control._, blocks().control.input)}
            data-cy={cyAttributes().input}
            disabled={node.isDisabled}
            id={node.id}
            name="lf-radio-group"
            onBlur={(e) => blur(e, node)}
            onChange={(e) => {
              change(e, node);
            }}
            onFocus={(e) => {
              focus(e, node);
            }}
            part={parts().input}
            ref={(el) => {
              if (el) {
                elements.refs.inputs.set(node.id, el);
              }
            }}
            title={node.description}
            type="radio"
            value={node.value as string}
          />
          <div
            class={bemClass(blocks().control._, blocks().control.circle)}
            part={parts().circle}
          >
            <div
              class={bemClass(blocks().control._, blocks().control.dot)}
              part={parts().dot}
            ></div>
          </div>
        </div>
      );
    },
    //#endregion

    //#region Item
    item: (node: LfDataNode, _index: number) => {
      const { controller, elements, handlers } = getAdapter();
      const { get, computed } = controller;
      const { control } = elements.jsx;
      const { blocks, framework, parts } = get;
      const { click } = handlers;
      const { theme, data } = framework();
      const { bemClass } = theme;

      const isSelected = computed.isSelected(node.id);
      const isLeading = computed.isLeadingLabel();
      const isDisabled = node.isDisabled;
      const labelText = data.cell.stringify(node.value) || node.id;

      return (
        <div
          class={bemClass(blocks().item._, undefined, {
            leading: isLeading,
            selected: isSelected,
            disabled: isDisabled,
          })}
          data-lf="ripple"
          onClick={(e) => click(e, node)}
          onPointerDown={(e) => handlers.pointerDown(e, node)}
          part={parts().item}
          ref={(el) => {
            if (el) elements.refs.items.set(node.id, el);
          }}
        >
          {control(node)}
          <label
            class={bemClass(blocks().item._, blocks().item.label)}
            htmlFor={node.id}
            part={parts().label}
          >
            {labelText}
          </label>
        </div>
      );
    },
    //#endregion

    //#region Label
    label: (node: LfDataNode): VNode => {
      const { blocks, framework, parts } = getAdapter().controller.get;
      const { theme, data } = framework();
      const { bemClass } = theme;

      const labelText = data.cell.stringify(node.value) || node.id;

      return (
        <label
          class={bemClass(blocks().item._, blocks().item.label)}
          part={parts().label}
        >
          {labelText}
        </label>
      );
    },
    //#endregion

    //#region Radio
    radio: (nodes: LfDataNode[]) => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { get, computed } = controller;
      const { blocks, compInstance, lfAttributes, framework, parts } = get;

      return (
        <LfRadioFC
          blocks={blocks()}
          computed={computed}
          framework={framework()}
          handlers={handlers}
          lfAttributes={lfAttributes()}
          nodes={nodes}
          parts={parts()}
          refs={elements.refs}
          uiState={compInstance().lfUiState}
        />
      );
    },
    //#endregion
  };
};
