import {
  LfAccordionAdapter,
  LfAccordionAdapterJsx,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { AccordionFC } from "./fc/accordion-fc";

/**
 * Prepares JSX factory functions for the accordion component.
 *
 * v4.0.0 Architecture:
 * - Uses AccordionFC wrapper which composes LfAccordionFC (pure presentational)
 * - All state flows through adapter
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepAccordion = (
  getAdapter: () => LfAccordionAdapter,
): LfAccordionAdapterJsx => {
  return {
    //#region Accordion
    accordion: () => {
      const adapter = getAdapter();
      const { controller } = adapter;
      const { compInstance } = controller.get;

      const comp = compInstance();
      const { lfDataset } = comp;

      if (!lfDataset || !lfDataset.nodes) {
        return [];
      }

      return [<AccordionFC adapter={adapter} />] as VNode[];
    },
    //#endregion
  };
};
