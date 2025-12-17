import {
  LF_HEADER_BLOCKS,
  LF_HEADER_PARTS,
  LF_HEADER_SLOT,
  LfHeaderFCProps,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

/**
 * LfHeaderFC - Functional Component for Header
 *
 * This is a stateless functional component that renders a header container.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-header Web Component (thin wrapper)
 * 2. Inside other components (composed usage)
 *
 * Benefits over direct WC usage in compositions:
 * - No Shadow DOM overhead (single shadow root for parent)
 * - No lifecycle hooks per instance
 * - No theme registration per instance
 * - State flows unidirectionally from parent
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export const LfHeaderFC: FunctionalComponent<LfHeaderFCProps> = ({
  className,
  framework,
  icon,
  id,
  label,
  style,
}) => {
  const { bemClass } = framework.theme;

  const blocks = LF_HEADER_BLOCKS;
  const parts = LF_HEADER_PARTS;

  const { header } = blocks;

  return (
    <header
      class={`${bemClass(header._)}${className ? ` ${className}` : ""}`}
      id={id}
      part={parts.header}
      style={style}
    >
      <section class={bemClass(header._, header.section)} part={parts.section}>
        {icon && <span class={bemClass(header._, header.icon)}>{icon}</span>}
        {label && <span class={bemClass(header._, header.label)}>{label}</span>}
        <slot name={LF_HEADER_SLOT}></slot>
      </section>
    </header>
  );
};
