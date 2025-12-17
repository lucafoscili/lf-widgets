import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_CODE_BLOCKS,
  LF_CODE_PARTS,
  LfCodeFCProps,
  LfFrameworkInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h, VNode } from "@stencil/core";

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
