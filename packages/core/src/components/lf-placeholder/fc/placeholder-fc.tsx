import {
  LF_ATTRIBUTES,
  LfComponentRootElement,
  LfComponentTag,
  LfEvent,
  LfPlaceholderAdapter,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h, VNode } from "@stencil/core";
import { FIcon } from "../../../utils/icon";

//#region Props
export interface PlaceholderFCProps {
  adapter: LfPlaceholderAdapter;
}
//#endregion

/**
 * FC for the placeholder component.
 * Per Section 5.9 "Mirroring Rule" - encapsulates placeholder UI.
 */
export const PlaceholderFC: FunctionalComponent<PlaceholderFCProps> = ({
  adapter,
}) => {
  const { controller, elements, handlers } = adapter;
  const { get, computed } = controller;
  const { refs } = elements;

  const b = get.blocks();
  const p = get.parts();
  const lf = get.lfAttributes();
  const { lfIcon, lfProps, lfValue } = get.compInstance();
  const mgr = get.framework();
  const { bemClass } = mgr.theme;

  let content: VNode = null;
  if (computed.shouldRender()) {
    const name = lfValue.toLowerCase().replace("lf", "");
    const Tag = ("lf-" + name) as LfComponentTag<typeof lfValue>;
    content = (
      <Tag
        {...(mgr.sanitizeProps(lfProps, lfValue) as any)}
        onLf-event={(e: LfEvent) => handlers.component(e)}
        data-lf={LF_ATTRIBUTES.fadeIn}
        ref={
          mgr.assignRef(refs, "component") as (
            el: LfComponentRootElement,
          ) => void
        }
      />
    );
  } else if (lfIcon) {
    content = (
      <div
        class={bemClass(b.placeholder._, b.placeholder.icon)}
        data-lf={lf.fadeIn}
        part={p.icon}
      >
        <FIcon framework={mgr} icon={lfIcon} />
      </div>
    );
  }

  return (
    <div
      class={bemClass(b.placeholder._)}
      part={p.placeholder}
      ref={mgr.assignRef(refs, "placeholder")}
    >
      {content}
    </div>
  );
};
