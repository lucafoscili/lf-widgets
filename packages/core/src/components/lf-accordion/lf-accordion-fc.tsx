import {
  CY_ATTRIBUTES,
  LF_ACCORDION_BLOCKS,
  LF_ACCORDION_PARTS,
  LF_ATTRIBUTES,
  LF_THEME_ICONS,
  LfAccordionFCProps,
  LfDataNode,
  LfIconType,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h, VNode } from "@stencil/core";
import { FIcon } from "../../utils/icon";
import { LfShape } from "../../utils/shapes";

/**
 * LfAccordionFC - Functional Component for Accordion
 *
 * This is a stateless functional component that renders an accordion.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-accordion Web Component (thin wrapper)
 * 2. Inside other components (composed usage)
 * 3. Via LfShape rendering (if accordion becomes a data shape)
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
export const LfAccordionFC: FunctionalComponent<LfAccordionFCProps> = ({
  accordionRef,
  className,
  expandedIds,
  framework,
  id,
  items,
  onLfEvent,
  onPointerDown,
  onToggle,
  refs,
  selectedIds,
  style,
  uiSize = "medium",
  uiState = "primary",
}) => {
  const { bemClass } = framework.theme;

  const blocks = LF_ACCORDION_BLOCKS;
  const parts = LF_ACCORDION_PARTS;
  const cy = CY_ATTRIBUTES;
  const lf = LF_ATTRIBUTES;

  const { accordion, node } = blocks;

  // Build style object with size variable if not medium (default)
  const computedStyle =
    uiSize !== "medium"
      ? { ...style, "--lf-fc-ui-size": `var(--lf-ui-size-${uiSize})` }
      : style;

  /**
   * Determines if a node has expandable content (cells).
   */
  const isExpandible = (n: LfDataNode): boolean => {
    return n.cells != null && Object.keys(n.cells).length > 0;
  };

  /**
   * Renders a single accordion node/item.
   */
  const renderNode = (n: LfDataNode): VNode => {
    const expanded = expandedIds?.has(n.id) ?? false;
    const expandible = isExpandible(n);
    const selected = selectedIds?.has(n.id) ?? false;

    return (
      <div
        class={bemClass(node._)}
        data-cy={cy.node}
        data-lf={lf[uiState]}
        key={n.id}
      >
        <div
          class={bemClass(node._, node.header, {
            expanded: expandible && expanded,
            selected: !expandible && selected,
          })}
          data-cy={!expandible ? cy.button : undefined}
          onClick={(e) => onToggle?.(n, e)}
          onPointerDown={(e) => onPointerDown?.(e)}
          part={parts.header}
          tabindex="1"
          title={n.description}
          ref={(el) => {
            if (el && refs?.headers) {
              refs.headers.set(n.id, el);
            }
          }}
        >
          {n.icon ? renderIcon(n.icon) : null}
          <span class={bemClass(node._, node.text)} part={parts.text}>
            {n.value}
          </span>
          {expandible && (
            <div
              class={bemClass(node._, node.expand, {
                expanded: expanded,
              })}
              data-cy={cy.dropdownButton}
              data-lf={lf.icon}
              part={parts.icon}
            >
              <FIcon framework={framework} icon={LF_THEME_ICONS.dropdown} />
            </div>
          )}
        </div>
        {expanded && (
          <div
            class={bemClass(node._, node.content, {
              selected: selected,
            })}
            data-lf={lf.fadeIn}
            part={parts.content}
          >
            {renderCell(n)}
          </div>
        )}
      </div>
    );
  };

  /**
   * Renders an icon within a node header.
   */
  const renderIcon = (icon: LfIconType): VNode => {
    return (
      <div class={bemClass(node._, node.icon)} part={parts.icon}>
        <FIcon framework={framework} icon={icon} />
      </div>
    );
  };

  /**
   * Renders the cell content for an expanded node.
   */
  const renderCell = (n: LfDataNode): VNode => {
    const { cells } = n;
    const key = cells && Object.keys(cells)[0];
    const cell = cells?.[key];

    if (!cell) {
      return null;
    }

    return (
      <LfShape
        cell={cell}
        index={0}
        shape={cell.shape}
        eventDispatcher={async (e) => onLfEvent?.(e)}
        framework={framework}
      ></LfShape>
    );
  };

  return (
    <div
      class={`${bemClass(accordion._)}${className ? ` ${className}` : ""}`}
      data-lf={uiState}
      id={id}
      part={parts.accordion}
      ref={accordionRef}
      style={computedStyle}
    >
      {items?.map((n) => renderNode(n))}
    </div>
  );
};
