import {
  LF_COMPARE_BLOCKS,
  LF_COMPARE_PARTS,
  LfCompareAdapter,
  LfCompareView,
  LfDataCell,
  LfDataShapes,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { Fragment, FunctionalComponent, h } from "@stencil/core";
import { LfShape } from "../../utils/shapes";

//#region Props
/**
 * Props for the LfCompareFC functional component.
 *
 * This interface removes the `lf*` prefix convention used by Web Components
 * and uses direct prop names instead. All state is owned by the parent;
 * the FC is purely presentational.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export interface LfCompareFCProps {
  /** Adapter for accessing JSX factories and handlers */
  adapter: LfCompareAdapter;
  /** Assigned class for custom styling */
  className?: string;
  /** Reference callback for the compare container element */
  compareRef?: (el: HTMLDivElement | null) => void;
  /** Framework instance for theming utilities (required) */
  framework: LfFrameworkInterface;
  /** Whether there are shapes available to compare */
  hasShapes: boolean;
  /** Unique identifier for the component */
  id?: string;
  /** Whether the left panel is currently opened */
  isLeftPanelOpened: boolean;
  /** Whether the view is overlay mode */
  isOverlay: boolean;
  /** Whether the right panel is currently opened */
  isRightPanelOpened: boolean;
  /** Left shape data cell */
  leftShape: LfDataCell;
  /** Right shape data cell */
  rightShape: LfDataCell;
  /** Type of shape being compared */
  shape: LfDataShapes;
  /** Custom CSS styles to apply */
  style?: { [key: string]: string };
  /** Current view mode (main/split) */
  view: LfCompareView;
}
//#endregion

/**
 * LfCompareFC - Functional Component for Compare
 *
 * This is a stateless functional component that renders a comparison view.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-compare Web Component (thin wrapper)
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
export const LfCompareFC: FunctionalComponent<LfCompareFCProps> = ({
  adapter,
  className,
  compareRef,
  framework,
  hasShapes,
  id,
  isLeftPanelOpened,
  isOverlay,
  isRightPanelOpened,
  leftShape,
  rightShape,
  shape,
  style,
  view,
}) => {
  const { bemClass } = framework.theme;
  const { sanitizeProps } = framework;

  const blocks = LF_COMPARE_BLOCKS;
  const parts = LF_COMPARE_PARTS;

  const { compare, toolbar, view: viewBlock } = blocks;

  // Get adapter elements for JSX factories
  const { jsx } = adapter.elements;
  const { changeView, leftButton, leftTree, rightButton, rightTree } = jsx;

  // Get defaults from adapter
  const { left, right } = adapter.controller.get.defaults();

  // Prepare sanitized shapes
  const leftShapes = left?.[shape]?.() || [];
  const leftSanitized: LfDataCell[] = [];
  for (let index = 0; index < leftShapes.length; index++) {
    const s = leftShapes[index];
    leftSanitized.push(sanitizeProps(s));
  }

  const rightShapes = right?.[shape]?.() || [];
  const rightSanitized: LfDataCell[] = [];
  for (let index = 0; index < rightShapes.length; index++) {
    const s = rightShapes[index];
    rightSanitized.push(sanitizeProps(s));
  }

  // Get dispatcher for events
  const { dispatcher } = adapter;

  // Handler for slider input
  const handleSliderInput = (event: InputEvent) => {
    const { target } = event;
    if (target instanceof HTMLInputElement) {
      const sliderValue = parseInt(target.value);
      adapter.controller.actions.setPositionWithBounds(sliderValue);
    }
  };

  // Check hasShapes and that there's more than 1 shape to compare
  const shapes = adapter.controller.get.shapes();
  if (!hasShapes || !shapes || shapes.length <= 1) {
    return null;
  }

  return (
    <div
      class={`${bemClass(compare._)}${className ? ` ${className}` : ""}`}
      id={id}
      part={parts.compare}
      ref={compareRef}
      style={style}
    >
      <div class={bemClass(compare._, compare.grid)}>
        {/* View Section */}
        <Fragment>
          <div
            class={bemClass(viewBlock._, null, {
              [view]: true,
            })}
          >
            <div class={bemClass(viewBlock._, viewBlock.left)}>
              <LfShape
                cell={Object.assign(leftSanitized, leftShape)}
                index={0}
                shape={shape}
                eventDispatcher={async (e) =>
                  dispatcher.emit("lf-event", { originalEvent: e })
                }
                framework={framework}
              ></LfShape>
            </div>
            {isLeftPanelOpened && leftTree()}
            {isRightPanelOpened && rightTree()}
            {isOverlay && (
              <div
                class={bemClass(viewBlock._, viewBlock.slider)}
                onChange={handleSliderInput}
                onInput={handleSliderInput}
              >
                <input
                  class={bemClass(viewBlock._, viewBlock.input)}
                  min="0"
                  max="100"
                  type="range"
                  value="50"
                />
              </div>
            )}
            <div class={bemClass(viewBlock._, viewBlock.right)}>
              <LfShape
                cell={Object.assign(rightSanitized, rightShape)}
                index={1}
                shape={shape}
                eventDispatcher={async (e) =>
                  dispatcher.emit("lf-event", { originalEvent: e })
                }
                framework={framework}
              ></LfShape>
            </div>
          </div>
        </Fragment>

        {/* Toolbar Section */}
        <div class={bemClass(toolbar._)}>
          {leftButton()}
          {changeView()}
          {rightButton()}
        </div>
      </div>
    </div>
  );
};
