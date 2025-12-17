import {
  LF_SELECT_BLOCKS,
  LF_SELECT_PARTS,
  LF_THEME_ICONS,
  LfDataDataset,
  LfDataNode,
  LfFrameworkInterface,
  LfListInterface,
  LfTextfieldInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfTextfieldFC } from "../lf-textfield/lf-textfield-fc";

//#region Props
/**
 * Props interface for the `LfSelectFC` functional component.
 *
 * This interface removes the `lf*` prefix convention used by Web Components
 * and uses direct prop names instead. All state is owned by the parent;
 * the FC is purely presentational.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export interface LfSelectFCProps {
  /** Assigned class for custom styling */
  className?: string;
  /** Cypress test attribute */
  cyAttribute?: string;
  /** Dataset containing the selectable options */
  dataset?: LfDataDataset;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Framework instance for theming utilities (required) */
  framework: LfFrameworkInterface;
  /** Unique identifier for the component */
  id?: string;
  /** LF attribute for state theming */
  lfAttribute?: string;
  /** Props to pass to the internal lf-list component */
  listProps?: Partial<LfListInterface>;
  /** Callback fired on list item click */
  onListEvent?: (event: CustomEvent) => void;
  /** Callback fired on textfield click */
  onTextfieldClick?: (event: MouseEvent) => void;
  /** Callback fired on textfield keydown */
  onTextfieldKeydown?: (event: KeyboardEvent) => void;
  /** Callback fired on textfield icon click */
  onTextfieldIconClick?: (event: MouseEvent) => void;
  /** Part attribute for external styling */
  part?: string;
  /** Reference callback for the list element */
  listRef?: (el: HTMLLfListElement | null) => void;
  /** Reference callback for the select container */
  selectRef?: (el: HTMLDivElement | null) => void;
  /** Currently selected index */
  selectedIndex?: number;
  /** Currently selected node */
  selectedNode?: LfDataNode | null;
  /** Custom CSS styles to apply */
  style?: { [key: string]: string };
  /** Props to pass to the internal lf-textfield component */
  textfieldProps?: Partial<LfTextfieldInterface>;
  /** Reference callback for the textfield input element */
  textfieldRef?: (el: HTMLInputElement | HTMLTextAreaElement | null) => void;
  /**
   * UI size multiplier for the component.
   * Controls font-size scaling. Required for composed usage where
   * CSS inheritance from :host doesn't work (e.g., portaled content).
   * @default "medium"
   */
  uiSize?: LfThemeUISize;
  /**
   * UI state for theming (primary, success, warning, danger, etc.).
   * Controls color scheme. Required for composed usage where
   * CSS cascade doesn't work (e.g., portaled content).
   * @default "primary"
   */
  uiState?: LfThemeUIState;
}
//#endregion

/**
 * LfSelectFC - Functional Component for Select
 *
 * This is a stateless functional component that renders a select dropdown.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-select Web Component (thin wrapper)
 * 2. Inside other components (composed usage)
 *
 * Benefits over direct WC usage in compositions:
 * - No Shadow DOM overhead (single shadow root for parent)
 * - No lifecycle hooks per instance
 * - No theme registration per instance
 * - Direct callbacks instead of CustomEvent dispatch
 * - State flows unidirectionally from parent
 *
 * State/Size Props:
 * - `uiState`: Controls color scheme via `data-lf` attribute
 * - `uiSize`: Controls sizing via CSS variable `--lf-fc-ui-size`
 * These are required for composed usage where CSS cascade doesn't work
 * (e.g., portaled content outside the DOM hierarchy).
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export const LfSelectFC: FunctionalComponent<LfSelectFCProps> = ({
  className,
  cyAttribute,
  dataset,
  disabled = false,
  framework,
  id,
  lfAttribute,
  listProps,
  listRef,
  onListEvent,
  onTextfieldClick,
  onTextfieldKeydown,
  onTextfieldIconClick,
  part,
  selectedIndex = -1,
  selectedNode,
  selectRef,
  style,
  textfieldProps,
  textfieldRef,
  uiSize = "medium",
  uiState = "primary",
}) => {
  const { bemClass } = framework.theme;
  const { sanitizeProps } = framework;

  const blocks = LF_SELECT_BLOCKS;
  const parts = LF_SELECT_PARTS;

  const { select } = blocks;

  // Build style object with size variable if not medium (default)
  const computedStyle =
    uiSize !== "medium"
      ? { ...style, "--lf-fc-ui-size": `var(--lf-ui-size-${uiSize})` }
      : style;

  // Build modifier classes
  const selectModifiers = {
    disabled,
  };

  // Prepare textfield HTML attributes
  const textfieldHtmlAttrs = textfieldProps?.lfHtmlAttributes || {};
  const sanitizedTextfieldHtmlAttrs = sanitizeProps({
    ...textfieldHtmlAttrs,
    autocomplete: "off",
    readonly: true,
    role: "combobox",
  });

  // Render the textfield element using LfTextfieldFC
  const renderTextfield = () => {
    // Map lfTextfieldProps to FC props
    const icon = textfieldProps?.lfIcon;
    const label = textfieldProps?.lfLabel;
    const styling = textfieldProps?.lfStyling || "flat";

    return (
      <LfTextfieldFC
        className={bemClass(select._, select.textfield)}
        framework={framework}
        htmlAttributes={sanitizedTextfieldHtmlAttrs}
        icon={icon}
        inputRef={textfieldRef}
        label={label}
        onClick={onTextfieldClick}
        onIconClick={onTextfieldIconClick}
        onKeyDown={onTextfieldKeydown}
        styling={styling}
        trailingIcon={false}
        trailingIconAction={LF_THEME_ICONS.dropdown}
        uiSize={uiSize}
        uiState={uiState}
        value={String(selectedNode?.value || "")}
      />
    );
  };

  // Render the list element
  const renderList = () => {
    return (
      <lf-list
        lfUiSize={uiSize}
        lfUiState={uiState}
        {...sanitizeProps(listProps, "LfList")}
        class={bemClass(select._, select.list)}
        lfDataset={dataset}
        lfSelectable={true}
        lfValue={selectedIndex !== -1 ? selectedIndex : null}
        onLf-list-event={onListEvent}
        part={parts.list}
        ref={listRef}
      />
    );
  };

  return (
    <div
      class={`${bemClass(select._, null, selectModifiers)}${className ? ` ${className}` : ""}`}
      data-cy={cyAttribute}
      data-lf={lfAttribute}
      id={id}
      part={part}
      ref={selectRef}
      style={computedStyle}
    >
      {renderTextfield()}
      {renderList()}
    </div>
  );
};
