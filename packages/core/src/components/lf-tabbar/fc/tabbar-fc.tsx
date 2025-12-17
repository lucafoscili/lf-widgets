import { LfTabbarAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfTabbarFC } from "../lf-tabbar-fc";

//#region Props
export interface TabbarFCProps {
  adapter: LfTabbarAdapter;
}
//#endregion

/**
 * FC for the tabbar component wrapper.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfTabbarFC (pure presentational) with adapter state.
 */
export const TabbarFC: FunctionalComponent<TabbarFCProps> = ({ adapter }) => {
  const { controller, elements, handlers } = adapter;
  const { get, computed } = controller;

  const framework = get.framework();
  const compInstance = get.compInstance();
  const { assignRef } = framework;
  const { refs } = elements;
  const { hasNodes } = computed;

  if (!hasNodes()) {
    return null;
  }

  const { lfAriaLabel, lfDataset, lfNavigation, lfUiSize, lfUiState, value } =
    compInstance;

  return (
    <LfTabbarFC
      ariaLabel={lfAriaLabel}
      framework={framework}
      nodes={lfDataset?.nodes || []}
      navigation={lfNavigation}
      onTabClick={(e, index, node) => handlers.tab(e, "click", index, node)}
      onTabPointerDown={(e, index, node) =>
        handlers.tab(e, "pointerdown", index, node)
      }
      onNavigationClick={(direction) =>
        handlers.navigation(undefined, direction)
      }
      scrollContainerRef={assignRef(refs, "scrollContainer")}
      selectedIndex={value?.index ?? 0}
      tabRef={(el, index) => {
        if (el) {
          refs.tabs.set(index.toString(), el);
        }
      }}
      uiSize={lfUiSize}
      uiState={lfUiState}
    />
  );
};
