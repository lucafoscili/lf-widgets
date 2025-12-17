import {
  CY_ATTRIBUTES,
  LF_AUTOCOMPLETE_BLOCKS,
  LF_AUTOCOMPLETE_PARTS,
  LF_THEME_ICONS,
  LfAutocompleteFCProps,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h, VNode } from "@stencil/core";

/**
 * LfAutocompleteFC - Functional Component for Autocomplete
 *
 * This is a stateless functional component that renders an autocomplete input
 * with dropdown suggestions. All state is managed by the parent component;
 * this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-autocomplete Web Component (thin wrapper)
 * 2. Inside other components like forms (composed usage)
 * 3. Via LfShape rendering (if autocomplete becomes a data shape)
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
export const LfAutocompleteFC: FunctionalComponent<LfAutocompleteFCProps> = ({
  autocompleteRef,
  className,
  dataset,
  dropdownId,
  dropdownRef,
  framework,
  hasCache = false,
  highlightedIndex = -1,
  id,
  isExpanded = false,
  isLoading = false,
  listProps,
  listRef,
  onListEvent,
  onTextfieldEvent,
  showEmpty = false,
  showList = false,
  spinnerProps,
  spinnerRef,
  style,
  textfieldProps,
  textfieldRef,
  uiSize = "medium",
  uiState = "primary",
  value = "",
}) => {
  const { bemClass } = framework.theme;
  const { sanitizeProps } = framework;

  const blocks = LF_AUTOCOMPLETE_BLOCKS;
  const parts = LF_AUTOCOMPLETE_PARTS;

  const { autocomplete, dropdown } = blocks;

  // Build style object with size variable if not medium (default)
  const computedStyle =
    uiSize !== "medium"
      ? { ...style, "--lf-fc-ui-size": `var(--lf-ui-size-${uiSize})` }
      : style;

  // Prepare textfield html attributes with ARIA
  const textfieldHtmlAttrs = textfieldProps?.lfHtmlAttributes || {};
  const ariaAttrs = {
    "aria-autocomplete": "list",
    "aria-controls": dropdownId,
    ...(highlightedIndex >= 0 && {
      "aria-activedescendant": `${dropdownId}-item-${highlightedIndex}`,
    }),
  };
  const htmlSanitized = sanitizeProps({ ...textfieldHtmlAttrs, ...ariaAttrs });

  // Render textfield
  const renderTextfield = (): VNode => {
    return (
      <lf-textfield
        lfUiSize={uiSize}
        lfUiState={uiState}
        {...sanitizeProps(textfieldProps || {}, "LfTextfield")}
        class={bemClass(autocomplete._, autocomplete.textfield)}
        lfHtmlAttributes={htmlSanitized}
        lfTrailingIconAction={hasCache ? LF_THEME_ICONS.dropdown : null}
        lfValue={value}
        onLf-textfield-event={onTextfieldEvent}
        part={parts.textfield}
        ref={textfieldRef}
      />
    );
  };

  // Render dropdown with spinner and list
  const renderDropdown = (): VNode => {
    return (
      <div
        class={bemClass(dropdown._)}
        data-cy={CY_ATTRIBUTES.dropdownMenu}
        data-lf="portal"
        id={dropdownId}
        part={parts.dropdown}
        ref={dropdownRef}
        role="listbox"
      >
        <lf-spinner
          lfActive={isLoading}
          lfBarVariant={true}
          lfUiSize="xsmall"
          {...sanitizeProps(spinnerProps || {}, "LfSpinner")}
          class={bemClass(dropdown._, dropdown.spinner)}
          data-cy={CY_ATTRIBUTES.spinner}
          data-lf="fade-in"
          part={parts.spinner}
          ref={spinnerRef}
        />
        {showList && (
          <lf-list
            lfEmpty={showEmpty ? "Your search returned no results." : ""}
            lfUiSize={uiSize}
            lfUiState={uiState}
            {...sanitizeProps(listProps || {}, "LfList")}
            class={bemClass(dropdown._, dropdown.list)}
            lfDataset={dataset}
            lfSelectable={true}
            lfValue={highlightedIndex}
            onLf-list-event={onListEvent}
            part={parts.list}
            ref={listRef}
          />
        )}
      </div>
    );
  };

  return (
    <div
      aria-expanded={isExpanded ? "true" : "false"}
      aria-haspopup="listbox"
      aria-owns={dropdownId}
      class={`${bemClass(autocomplete._)}${className ? ` ${className}` : ""}`}
      data-lf={uiState}
      id={id}
      part={parts.autocomplete}
      ref={autocompleteRef}
      role="combobox"
      style={computedStyle}
    >
      {renderTextfield()}
      {renderDropdown()}
    </div>
  );
};
