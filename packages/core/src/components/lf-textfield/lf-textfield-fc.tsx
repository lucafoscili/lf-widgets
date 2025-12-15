import {
  CY_ATTRIBUTES,
  LF_TEXTFIELD_BLOCKS,
  LF_TEXTFIELD_PARTS,
  LfIconType,
  LfTextfieldFCProps,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { FIcon } from "../../utils/icon";

/**
 * LfTextfieldFC - Functional Component for Textfield
 *
 * This is a stateless functional component that renders a textfield (input or textarea).
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-textfield Web Component (thin wrapper)
 * 2. Inside other components like shapeeditor (composed usage)
 * 3. Via LfShape rendering (if textfield becomes a data shape)
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
export const LfTextfieldFC: FunctionalComponent<LfTextfieldFCProps> = ({
  className,
  disabled = false,
  formatJSON,
  formattingError,
  framework,
  helper,
  htmlAttributes,
  icon,
  id,
  inputRef,
  label,
  maxLength,
  onBlur,
  onChange,
  onClick,
  onFocus,
  onIconClick,
  onInput,
  onKeyDown,
  placeholder,
  status = new Set(),
  style,
  styling = "flat",
  trailingIcon = false,
  trailingIconAction,
  uiSize = "medium",
  uiState = "primary",
  value,
}) => {
  const { bemClass, get } = framework.theme;

  const blocks = LF_TEXTFIELD_BLOCKS;
  const parts = LF_TEXTFIELD_PARTS;

  const { textfield } = blocks;

  // Determine styling modifiers
  const isTextarea = styling === "textarea";
  const isOutlined = styling === "outlined" || isTextarea;
  const isFilled = status.has("filled");
  const isFocused = status.has("focused");
  const hasIcon = Boolean(icon);
  const hasLabel = Boolean(label);

  // Build style object with size variable if not medium (default)
  const computedStyle =
    uiSize !== "medium"
      ? { ...style, "--lf-fc-ui-size": `var(--lf-ui-size-${uiSize})` }
      : style;

  // Build modifier classes for textfield container
  const textfieldModifiers = {
    [styling]: true,
    filled: isFilled,
    focused: isFocused,
    disabled,
    "has-icon": hasIcon,
    "has-label": hasLabel,
    "trailing-icon": trailingIcon,
  };

  // Render the icon element
  const renderIcon = () => {
    if (!icon) return null;

    return (
      <FIcon
        framework={framework}
        icon={icon}
        wrapperClass={bemClass(textfield._, textfield.icon, {
          trailing: trailingIcon,
        })}
        onClick={(e: MouseEvent) => onIconClick?.(e, "regular")}
        style={{ tabIndex: 0, cursor: "pointer" }}
      />
    );
  };

  // Render the action icon element
  const renderActionIcon = () => {
    if (!trailingIconAction) return null;

    const { variables } = get.current();
    const iconName = variables[trailingIconAction] as string;

    return (
      <FIcon
        framework={framework}
        icon={iconName as LfIconType}
        wrapperClass={bemClass(textfield._, textfield.iconAction, {
          trailing: true,
        })}
        onClick={(e: MouseEvent) => onIconClick?.(e, "action")}
        style={{ tabIndex: 0, cursor: "pointer" }}
      />
    );
  };

  // Render the label element
  const renderLabel = () => {
    if (isOutlined || !label) return null;

    return (
      <label
        class={bemClass(textfield._, textfield.label)}
        htmlFor="input"
        part={parts.label}
      >
        {label}
      </label>
    );
  };

  // Render the underline element
  const renderUnderline = () => {
    if (isOutlined) return null;

    return <span class={bemClass(textfield._, textfield.underline)}></span>;
  };

  // Render the counter element
  const renderCounter = () => {
    if (!maxLength) return null;

    return (
      <div
        class={bemClass(textfield._, textfield.counter)}
        part={parts.counter}
      >
        {`${(value || "").length} / ${maxLength}`}
      </div>
    );
  };

  // Render the helper element
  const renderHelper = () => {
    if (!helper?.value) return null;

    const shouldShow =
      (helper.showWhenFocused && isFocused) || !helper.showWhenFocused;

    return (
      <div class={bemClass(textfield._, textfield.helperLine)}>
        <div
          class={bemClass(textfield._, textfield.helperText, {
            active: shouldShow,
          })}
        >
          {helper.value}
        </div>
        {!isTextarea && renderCounter()}
      </div>
    );
  };

  // Render the input element
  const renderInput = () => {
    const { sanitizeProps } = framework;

    return (
      <input
        {...sanitizeProps(htmlAttributes)}
        class={bemClass(textfield._, textfield.input)}
        data-cy={CY_ATTRIBUTES.input}
        disabled={disabled}
        onBlur={(e) => onBlur?.(e)}
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          onChange?.(target.value, e);
        }}
        onClick={(e) => onClick?.(e)}
        onFocus={(e) => onFocus?.(e)}
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          onInput?.(target.value, e);
        }}
        onKeyDown={(e) => onKeyDown?.(e)}
        part={parts.input}
        placeholder={(isOutlined && label) || placeholder || ""}
        ref={inputRef}
        value={value}
      />
    );
  };

  // Render the textarea element
  const renderTextarea = () => {
    const { sanitizeProps } = framework;

    const { displayBorderOnError, displayErrorAsTitle } = formatJSON || {};
    const hasError = Boolean(formattingError);
    const shouldFormat = formatJSON !== null && formatJSON !== undefined;

    return (
      <span class={bemClass(textfield._, textfield.resizer)}>
        <textarea
          {...sanitizeProps(htmlAttributes)}
          class={bemClass(textfield._, textfield.input, {
            error: shouldFormat && hasError && displayBorderOnError,
          })}
          data-cy={CY_ATTRIBUTES.input}
          id="input"
          onBlur={(e) => onBlur?.(e)}
          onChange={(e) => {
            const target = e.target as HTMLTextAreaElement;
            onChange?.(target.value, e);
          }}
          onClick={(e) => onClick?.(e)}
          onFocus={(e) => onFocus?.(e)}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            onInput?.(target.value, e);
          }}
          onKeyDown={(e) => onKeyDown?.(e)}
          part={parts.input}
          placeholder={(isOutlined && label) || placeholder || ""}
          ref={inputRef}
          title={
            shouldFormat && hasError && displayErrorAsTitle
              ? formattingError
              : ""
          }
          value={value}
        />
      </span>
    );
  };

  return (
    <div
      class={`${bemClass(textfield._, null, textfieldModifiers)}${className ? ` ${className}` : ""}`}
      data-lf={uiState}
      id={id}
      part={parts.textfield}
      style={computedStyle}
    >
      {renderIcon()}
      {isTextarea ? renderTextarea() : renderInput()}
      {renderLabel()}
      {renderActionIcon()}
      {renderUnderline()}
      {renderHelper()}
    </div>
  );
};
