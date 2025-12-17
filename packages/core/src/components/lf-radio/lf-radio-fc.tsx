import {
  LfDataNode,
  LfFrameworkInterface,
  LfRadioAdapterControllerComputed,
  LfRadioAdapterHandlers,
  LfRadioAdapterRefs,
  LfThemeUIState,
  LF_RADIO_BLOCKS,
  LF_RADIO_PARTS,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h, VNode } from "@stencil/core";

//#region Props
/**
 * Props interface for the pure presentational LfRadioFC.
 *
 * This component is stateless and receives all data via props.
 * It renders pure JSX without any adapter access.
 */
export interface LfRadioFCProps {
  /** Block class names for BEM styling */
  blocks: typeof LF_RADIO_BLOCKS;
  /** Computed predicates from adapter */
  computed: LfRadioAdapterControllerComputed;
  /** Framework instance for theming utilities */
  framework: LfFrameworkInterface;
  /** Event handlers from adapter */
  handlers: LfRadioAdapterHandlers;
  /** LF attributes for state theming */
  lfAttributes: Record<string, string>;
  /** Data nodes representing radio options */
  nodes: LfDataNode[];
  /** Part names for shadow parts */
  parts: typeof LF_RADIO_PARTS;
  /** Refs object for element references */
  refs: LfRadioAdapterRefs;
  /** UI state for theming */
  uiState: LfThemeUIState;
}
//#endregion

/**
 * LfRadioFC - Pure Presentational Functional Component for Radio
 *
 * This is a stateless functional component that renders a radio group.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-radio Web Component (thin wrapper via RadioFC adapter wrapper)
 * 2. Inside other components (composed usage)
 *
 * Benefits over direct WC usage in compositions:
 * - No Shadow DOM overhead (single shadow root for parent)
 * - No lifecycle hooks per instance
 * - No theme registration per instance
 * - Direct callbacks instead of CustomEvent dispatch
 * - State flows unidirectionally from parent
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export const LfRadioFC: FunctionalComponent<LfRadioFCProps> = ({
  blocks,
  computed,
  framework,
  handlers,
  lfAttributes,
  nodes,
  parts,
  refs,
  uiState,
}) => {
  const { bemClass } = framework.theme;
  const { data } = framework;

  const isHorizontal = computed.isHorizontal();

  return (
    <div
      class={bemClass(blocks._, undefined, {
        horizontal: isHorizontal,
      })}
      data-lf={lfAttributes[uiState]}
      onKeyDown={handlers.keyDown}
      part={parts.radio}
    >
      {nodes.map((node, index) => (
        <RadioItem
          bemClass={bemClass}
          blocks={blocks}
          computed={computed}
          data={data}
          handlers={handlers}
          index={index}
          node={node}
          parts={parts}
          refs={refs}
        />
      ))}
    </div>
  );
};

//#region RadioItem
interface RadioItemProps {
  bemClass: LfFrameworkInterface["theme"]["bemClass"];
  blocks: typeof LF_RADIO_BLOCKS;
  computed: LfRadioAdapterControllerComputed;
  data: LfFrameworkInterface["data"];
  handlers: LfRadioAdapterHandlers;
  index: number;
  node: LfDataNode;
  parts: typeof LF_RADIO_PARTS;
  refs: LfRadioAdapterRefs;
}

const RadioItem: FunctionalComponent<RadioItemProps> = ({
  bemClass,
  blocks,
  computed,
  data,
  handlers,
  node,
  parts,
  refs,
}): VNode => {
  const isSelected = computed.isSelected(node.id);
  const isLeading = computed.isLeadingLabel();
  const isDisabled = node.isDisabled;
  const labelText = data.cell.stringify(node.value) || node.id;

  return (
    <div
      class={bemClass(blocks.item._, undefined, {
        leading: isLeading,
        selected: isSelected,
        disabled: isDisabled,
      })}
      data-lf="ripple"
      onClick={(e) => handlers.click(e, node)}
      onPointerDown={(e) => handlers.pointerDown(e, node)}
      part={parts.item}
      ref={(el) => {
        if (el) refs.items.set(node.id, el);
      }}
    >
      <RadioControl
        bemClass={bemClass}
        blocks={blocks}
        handlers={handlers}
        isSelected={isSelected}
        node={node}
        parts={parts}
        refs={refs}
      />
      <label
        class={bemClass(blocks.item._, blocks.item.label)}
        htmlFor={node.id}
        part={parts.label}
      >
        {labelText}
      </label>
    </div>
  );
};
//#endregion

//#region RadioControl
interface RadioControlProps {
  bemClass: LfFrameworkInterface["theme"]["bemClass"];
  blocks: typeof LF_RADIO_BLOCKS;
  handlers: LfRadioAdapterHandlers;
  isSelected: boolean;
  node: LfDataNode;
  parts: typeof LF_RADIO_PARTS;
  refs: LfRadioAdapterRefs;
}

const RadioControl: FunctionalComponent<RadioControlProps> = ({
  bemClass,
  blocks,
  handlers,
  isSelected,
  node,
  parts,
  refs,
}): VNode => {
  return (
    <div class={bemClass(blocks.control._)} part={parts.control}>
      <input
        checked={isSelected}
        class={bemClass(blocks.control._, blocks.control.input)}
        disabled={node.isDisabled}
        id={node.id}
        name="lf-radio-group"
        onBlur={(e) => handlers.blur(e, node)}
        onChange={(e) => handlers.change(e, node)}
        onFocus={(e) => handlers.focus(e, node)}
        part={parts.input}
        ref={(el) => {
          if (el) refs.inputs.set(node.id, el);
        }}
        title={node.description}
        type="radio"
        value={node.value as string}
      />
      <div
        class={bemClass(blocks.control._, blocks.control.circle)}
        part={parts.circle}
      >
        <div
          class={bemClass(blocks.control._, blocks.control.dot)}
          part={parts.dot}
        ></div>
      </div>
    </div>
  );
};
//#endregion
