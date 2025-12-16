import {
  LF_ATTRIBUTES,
  LF_DRAWER_SLOT,
  LfDrawerAdapter,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

//#region Props
export interface DrawerFCProps {
  adapter: LfDrawerAdapter;
}
//#endregion

/**
 * FC for the drawer content.
 * Per Section 5.9 "Mirroring Rule" - encapsulates drawer UI.
 */
export const DrawerFC: FunctionalComponent<DrawerFCProps> = ({ adapter }) => {
  const { controller, elements } = adapter;
  const { get } = controller;

  const blocks = get.blocks();
  const { theme } = get.framework();
  const { bemClass } = theme;

  const parts = get.parts();
  const { refs } = elements;

  return (
    <div class={bemClass(blocks._)} part={parts.drawer}>
      <div
        class={bemClass(blocks._, blocks.content)}
        data-lf={LF_ATTRIBUTES.fadeIn}
        part={parts.content}
        ref={(el) => {
          if (el) {
            refs.content = el;
          }
        }}
      >
        <slot name={LF_DRAWER_SLOT}></slot>
      </div>
    </div>
  );
};
