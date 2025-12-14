import {
  CY_ATTRIBUTES,
  LfCodeAdapter,
  LfCodeAdapterJsx,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";

/**
 * Prepares JSX factory functions for the code component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived values (formattedCode, shouldPreserveSpace)
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepCodeJsx = (
  getAdapter: () => LfCodeAdapter,
): LfCodeAdapterJsx => {
  return {
    //#region Code
    code: () => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { blocks, compInstance, framework, parts } = controller.get;
      const { formattedCode, shouldPreserveSpace } = controller.computed;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const p = parts();

      const { lfFadeIn, lfLanguage, lfShowHeader } = comp;
      const { assignRef, theme } = mgr;
      const { bemClass } = theme;
      const { refs } = elements;
      const { lfAttributes } = controller.get;
      const lf = lfAttributes();

      const preserveSpace = shouldPreserveSpace();
      const TagName = preserveSpace ? "pre" : "div";
      const code = formattedCode();

      return (
        <div
          class={bemClass(b.code._, null, { "has-header": lfShowHeader })}
          part={p.code}
        >
          {lfShowHeader && prepHeader(adapter)}
          <TagName
            class={`language-${lfLanguage} ${preserveSpace ? "" : "body"}`}
            data-lf={lfFadeIn && lf.fadeIn}
            key={code}
            part={p.prism}
            ref={assignRef(refs, "pre")}
          >
            {preserveSpace ? <code>{code}</code> : code}
          </TagName>
        </div>
      );
    },
    //#endregion
  };
};

/**
 * Prepares the header element with language title and copy button.
 */
const prepHeader = (adapter: LfCodeAdapter): VNode => {
  const { controller, elements } = adapter;
  const { blocks, compInstance, framework, lfAttributes, parts } =
    controller.get;

  const comp = compInstance();
  const mgr = framework();
  const b = blocks();
  const p = parts();
  const lf = lfAttributes();

  const {
    lfLanguage,
    lfShowCopy,
    lfStickyHeader,
    lfUiSize,
    lfUiState,
    lfValue,
  } = comp;
  const { assignRef, theme } = mgr;
  const { bemClass } = theme;
  const { refs } = elements;

  const {
    "--lf-icon-copy": copy,
    "--lf-icon-copy-ok": copyOk,
    "--lf-icon-warning": warning,
  } = theme.get.current().variables;

  return (
    <div
      class={bemClass(b.code.header._, null, {
        sticky: lfStickyHeader,
      })}
      data-lf={lf[lfUiState]}
      part={p.header}
    >
      <span
        class={bemClass(b.code.header._, b.code.header.title)}
        part={p.title}
      >
        {lfLanguage}
      </span>
      {lfShowCopy && (
        <lf-button
          class={bemClass(b.code.header._, b.code.header.copy)}
          data-cy={CY_ATTRIBUTES.button}
          lfIcon={copy}
          lfLabel="Copy"
          lfStretchY={true}
          lfStyling="flat"
          lfUiSize={lfUiSize}
          lfUiState={lfUiState}
          onLf-button-event={(e) => {
            const { comp: btnComp, eventType } = e.detail;
            switch (eventType) {
              case "click":
                try {
                  navigator.clipboard.writeText(lfValue);
                  btnComp.setMessage("Copied!", copyOk);
                } catch {
                  btnComp.setMessage("Failed...", warning);
                }
                break;
            }
          }}
          part={p.copy}
          ref={assignRef(refs, "copyButton")}
        ></lf-button>
      )}
    </div>
  );
};
