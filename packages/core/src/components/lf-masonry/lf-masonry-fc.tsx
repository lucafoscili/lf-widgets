import {
  LF_ATTRIBUTES,
  LF_MASONRY_BLOCKS,
  LF_MASONRY_PARTS,
  LfMasonryFCProps,
} from "@lf-widgets/foundations";
import { Fragment, FunctionalComponent, h, VNode } from "@stencil/core";
import { LfShape } from "../../utils/shapes";

// Re-export for external usage
export type { LfMasonryFCProps };

/**
 * LfMasonryFC - Functional Component for Masonry
 *
 * This is a stateless functional component that renders a masonry grid.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-masonry Web Component (thin wrapper)
 * 2. Inside other components that need masonry layout
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
export const LfMasonryFC: FunctionalComponent<LfMasonryFCProps> = ({
  actions = false,
  adapter,
  captureRef,
  className,
  columns,
  framework,
  id,
  masonryRef,
  onItemClick,
  onShapeEvent,
  selectable = false,
  selectedShape,
  shape,
  shapes,
  style,
  view,
}) => {
  const { bemClass } = framework.theme;

  const blocks = LF_MASONRY_BLOCKS;
  const parts = LF_MASONRY_PARTS;
  const lfAttrs = LF_ATTRIBUTES;

  const { grid, masonry } = blocks;

  const hasShapes = !!shapes?.[shape]?.length;
  const isMasonry = view === "main";

  /**
   * Divides shapes into columns for masonry layout
   */
  const divideShapesIntoColumns = (): VNode[][] => {
    const { elements } = adapter;
    const { refs } = elements;

    const shapeItems = shapes[shape] || [];

    const props = shapeItems.map(() => ({
      htmlProps: {
        dataset: { lf: lfAttrs.fadeIn, selected: "" },
      },
    }));

    if (selectedShape?.index !== undefined && props[selectedShape.index]) {
      props[selectedShape.index] = {
        htmlProps: {
          dataset: { lf: lfAttrs.fadeIn, selected: "true" },
        },
      };
    }

    const columnNodes: VNode[][] = Array.from(
      { length: columns },
      (): VNode[] => [],
    );

    for (let index = 0; index < shapeItems.length; index++) {
      const cell = shapeItems[index];
      const defaultCell = props[index];
      const refKey = `${shape}-${index}`;

      const shapeElement = (
        <LfShape
          cell={Object.assign(defaultCell, cell)}
          eventDispatcher={async (e) => {
            onShapeEvent?.(e as CustomEvent, refKey);
          }}
          framework={framework}
          index={index}
          refCallback={(r) => refs.shapes.set(refKey, r)}
          shape={shape}
        ></LfShape>
      );

      if (selectable) {
        columnNodes[index % columns].push(
          <div
            class={bemClass(grid._, grid.capture)}
            onClick={(e) => {
              e.stopPropagation();
              onItemClick?.(e, index, refKey);
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            ref={(el) => {
              if (el) {
                captureRef?.(el);
              }
            }}
          >
            {shapeElement}
          </div>,
        );
      } else {
        columnNodes[index % columns].push(shapeElement);
      }
    }

    return columnNodes;
  };

  /**
   * Renders the action buttons
   */
  const renderActions = (): VNode => {
    const { addColumn, changeView, removeColumn } = adapter.elements.jsx;

    return (
      <div class={bemClass(grid._, grid.actions)} data-lf={lfAttrs.fadeIn}>
        {isMasonry && (
          <div class={bemClass(grid._, grid.sub)}>
            {addColumn()}
            {removeColumn()}
          </div>
        )}
        {changeView()}
      </div>
    );
  };

  /**
   * Renders the grid columns with shapes
   */
  const renderView = (): VNode[] => {
    const nodes = divideShapesIntoColumns();

    return nodes.map((column, index) => (
      <div key={index} class={bemClass(grid._, grid.column)}>
        {column.map((element) => (
          <Fragment>{element}</Fragment>
        ))}
      </div>
    ));
  };

  /**
   * Renders the main masonry content
   */
  const renderMasonry = (): VNode => {
    if (!hasShapes) {
      return null;
    }

    return (
      <Fragment>
        <div
          class={bemClass(grid._, null, {
            [view]: true,
          })}
        >
          {renderView()}
        </div>
        {actions && renderActions()}
      </Fragment>
    );
  };

  return (
    <div
      class={`${bemClass(masonry._, null, { selectable })}${className ? ` ${className}` : ""}`}
      id={id}
      part={parts.masonry}
      ref={masonryRef}
      style={style}
    >
      {renderMasonry()}
    </div>
  );
};
