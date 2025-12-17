import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_CODE_BLOCKS,
  LF_CODE_PARTS,
  LfFrameworkInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h, VNode } from "@stencil/core";

//#region Props
/**
 * Props interface for the LfCodeFC functional component.
 *
 * This interface removes the `lf*` prefix convention used by Web Components
 * and uses direct prop names instead. All state is owned by the parent;
 * the FC is purely presentational.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export interface LfCodeFCProps {
  /** Assigned class for custom styling */
  className?: string;
  /** Reference callback for the code container element */
  codeRef?: (el: HTMLDivElement | null) => void;
  /** Whether to fade in the component on mount */
  fadeIn?: boolean;
  /** Formatted code content to display */
  formattedCode: string;
  /** Framework instance for theming utilities (required) */
  framework: LfFrameworkInterface;
  /** Unique identifier for the component */
  id?: string;
  /** Language of the code snippet */
  language?: string;
  /** Callback fired on copy button click */
  onCopy?: (e: CustomEvent) => void;
  /** Reference callback for the pre/body element */
  preRef?: (el: HTMLPreElement | HTMLDivElement | null) => void;
  /** Whether to preserve spaces (use pre tag) */
  preserveSpace?: boolean;
  /** Whether to show the copy button */
  showCopy?: boolean;
  /** Whether to show the header */
  showHeader?: boolean;
  /** Whether the header should be sticky */
  stickyHeader?: boolean;
  /** Custom CSS styles to apply (object format for Stencil JSX) */
  style?: { [key: string]: string };
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
  /** Current code value (for clipboard copy) */
  value?: string;
}
//#endregion

/**
 * LfCodeFC - Functional Component for Code
 *
 * This is a stateless functional component that renders syntax-highlighted code.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-code Web Component (thin wrapper)
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
export const LfCodeFC: FunctionalComponent<LfCodeFCProps> = ({
  className,
  codeRef,
  fadeIn = true,
  formattedCode,
  framework,
  id,
  language = "javascript",
  onCopy,
  preRef,
  preserveSpace = true,
  showCopy = true,
  showHeader = true,
  stickyHeader = true,
  style,
  uiSize = "medium",
  uiState = "primary",
  value = "",
}) => {
  const { bemClass } = framework.theme;

  const blocks = LF_CODE_BLOCKS;
  const parts = LF_CODE_PARTS;
  const lf = LF_ATTRIBUTES;

  const { code } = blocks;

  // Build style object with size variable if not medium (default)
  const computedStyle =
    uiSize !== "medium"
      ? { ...style, "--lf-fc-ui-size": `var(--lf-ui-size-${uiSize})` }
      : style;

  // Determine which tag to use based on preserveSpace
  const TagName = preserveSpace ? "pre" : "div";

  return (
    <div
      class={`${bemClass(code._, null, { "has-header": showHeader })}${className ? ` ${className}` : ""}`}
      data-lf={uiState}
      id={id}
      part={parts.code}
      ref={codeRef}
      style={computedStyle}
    >
      {showHeader && (
        <CodeHeader
          framework={framework}
          language={language}
          onCopy={onCopy}
          showCopy={showCopy}
          stickyHeader={stickyHeader}
          uiSize={uiSize}
          uiState={uiState}
          value={value}
        />
      )}
      <TagName
        class={`language-${language} ${preserveSpace ? "" : "body"}`}
        data-lf={fadeIn && lf.fadeIn}
        key={formattedCode}
        part={parts.prism}
        ref={preRef}
      >
        {preserveSpace ? <code>{formattedCode}</code> : formattedCode}
      </TagName>
    </div>
  );
};

//#region Internal Components
interface CodeHeaderProps {
  framework: LfFrameworkInterface;
  language: string;
  onCopy?: (e: CustomEvent) => void;
  showCopy: boolean;
  stickyHeader: boolean;
  uiSize: LfThemeUISize;
  uiState: LfThemeUIState;
  value: string;
}

const CodeHeader: FunctionalComponent<CodeHeaderProps> = ({
  framework,
  language,
  onCopy,
  showCopy,
  stickyHeader,
  uiSize,
  uiState,
  value,
}): VNode => {
  const { bemClass } = framework.theme;

  const blocks = LF_CODE_BLOCKS;
  const parts = LF_CODE_PARTS;

  const { code } = blocks;

  const {
    "--lf-icon-copy": copy,
    "--lf-icon-copy-ok": copyOk,
    "--lf-icon-warning": warning,
  } = framework.theme.get.current().variables;

  return (
    <div
      class={bemClass(code.header._, null, {
        sticky: stickyHeader,
      })}
      data-lf={uiState}
      part={parts.header}
    >
      <span
        class={bemClass(code.header._, code.header.title)}
        part={parts.title}
      >
        {language}
      </span>
      {showCopy && (
        <lf-button
          class={bemClass(code.header._, code.header.copy)}
          data-cy={CY_ATTRIBUTES.button}
          lfIcon={copy}
          lfLabel="Copy"
          lfStretchY={true}
          lfStyling="flat"
          lfUiSize={uiSize}
          lfUiState={uiState}
          onLf-button-event={(e) => {
            const { comp: btnComp, eventType } = e.detail;
            switch (eventType) {
              case "click":
                try {
                  navigator.clipboard.writeText(value);
                  btnComp.setMessage("Copied!", copyOk);
                  onCopy?.(e);
                } catch {
                  btnComp.setMessage("Failed...", warning);
                }
                break;
            }
          }}
          part={parts.copy}
        ></lf-button>
      )}
    </div>
  );
};
//#endregion
