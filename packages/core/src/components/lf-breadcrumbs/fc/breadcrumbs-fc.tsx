import { LfBreadcrumbsAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfBreadcrumbsFC } from "../lf-breadcrumbs-fc";

//#region Props
export interface BreadcrumbsFCProps {
  adapter: LfBreadcrumbsAdapter;
}
//#endregion

/**
 * FC for the breadcrumbs component wrapper.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfBreadcrumbsFC (pure presentational) with adapter state.
 */
export const BreadcrumbsFC: FunctionalComponent<BreadcrumbsFCProps> = ({
  adapter,
}) => {
  const { controller, elements, handlers } = adapter;
  const { get, computed } = controller;

  const framework = get.framework();
  const compInstance = get.compInstance();
  const cyAttributes = get.cyAttributes();
  const path = get.path();
  const separator = get.separator();
  const { refs } = elements;

  const { lfEmpty, lfMaxItems, lfUiSize, lfUiState } = compInstance;

  const isExpanded = computed.isExpanded();
  const isInteractive = computed.isInteractive();

  return (
    <LfBreadcrumbsFC
      cyAttributes={cyAttributes}
      empty={lfEmpty}
      framework={framework}
      isExpanded={isExpanded}
      isInteractive={isInteractive}
      maxItems={lfMaxItems}
      onItemClick={(e, node, index) => handlers.item.click(e, node, index)}
      onItemKeydown={(e, node, index) => handlers.item.keydown(e, node, index)}
      onItemPointerdown={(e, node, index) =>
        handlers.item.pointerdown(e, node, index)
      }
      onTruncationClick={(e) => handlers.truncation.click(e)}
      onTruncationKeydown={(e) => handlers.truncation.keydown(e)}
      path={path}
      refItems={refs.items}
      separator={separator}
      uiSize={lfUiSize}
      uiState={lfUiState}
    />
  );
};
