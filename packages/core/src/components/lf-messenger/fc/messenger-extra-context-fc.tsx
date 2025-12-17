import { IMAGE_TYPE_IDS, LfMessengerAdapter } from "@lf-widgets/foundations";
import { Fragment, FunctionalComponent, h, VNode } from "@stencil/core";
import { MessengerCoversFC } from "./messenger-covers-fc";
import { MessengerFormFC } from "./messenger-form-fc";
import { MessengerOptionsFC } from "./messenger-options-fc";

//#region Props
export interface MessengerExtraContextFCProps {
  adapter: LfMessengerAdapter;
  /** Whether the panel is collapsed */
  isCollapsed?: boolean;
  /** Whether customization view is active */
  isCustomizationView?: boolean;
}
//#endregion

/**
 * FC for the messenger extra context panel (right sidebar).
 * Contains options grid or customization view with filters and list.
 */
export const MessengerExtraContextFC: FunctionalComponent<
  MessengerExtraContextFCProps
> = ({ adapter, isCollapsed = false, isCustomizationView = false }) => {
  const { controller, elements } = adapter;
  const { get } = controller;

  const blocks = get.blocks();
  const framework = get.framework();
  const { bemClass } = framework.theme;

  const { extraContext } = blocks;
  const { customization, options } = elements.jsx;
  const { back, customize } = options;
  const { filters } = customization;

  return (
    <div
      class={bemClass(extraContext._, null, {
        collapsed: isCollapsed,
        input: isCustomizationView,
      })}
    >
      {isCustomizationView ? (
        <Fragment>
          {filters()}
          <div class={bemClass(extraContext._, extraContext.list)}>
            <MessengerListFC adapter={adapter} />
          </div>
          {back()}
        </Fragment>
      ) : (
        <Fragment>
          <div class={bemClass(extraContext._, extraContext.options)}>
            <MessengerOptionsFC adapter={adapter} />
          </div>
          {customize()}
        </Fragment>
      )}
    </div>
  );
};

//#region List FC
export interface MessengerListFCProps {
  adapter: LfMessengerAdapter;
}

/**
 * FC for the messenger customization list.
 * Shows filtered image types with covers and forms.
 */
export const MessengerListFC: FunctionalComponent<MessengerListFCProps> = ({
  adapter,
}) => {
  const { controller, elements, handlers } = adapter;
  const { get } = controller;

  const blocks = get.blocks();
  const framework = get.framework();
  const lfAttributes = get.lfAttributes();
  const { bemClass } = framework.theme;

  const { list } = blocks;
  const { byType, coverIndex, title } = get.image;
  const { edit, remove } = elements.jsx.customization.list;
  const { image } = handlers.customization;
  const formStatusMap = get.status.formStatus();
  const hoveredOption = get.status.hoveredCustomizationOption();
  const ui = (get.compInstance() as any).ui;
  const { filters } = ui;

  return (
    <Fragment>
      {IMAGE_TYPE_IDS.map((type) => {
        if (filters[type]) {
          const isFormActive = formStatusMap[type];
          const activeIndex = coverIndex(type);
          const images: VNode[] = byType(type).map((node, j) => (
            <div
              class={bemClass(list._, null, {
                selected: activeIndex === j,
              })}
              onClick={(e) => image(e, node, j)}
              onPointerEnter={() => {
                if (activeIndex !== j) {
                  controller.set.status.hoveredCustomizationOption(node);
                }
              }}
              onPointerLeave={() =>
                controller.set.status.hoveredCustomizationOption(null)
              }
            >
              <img
                alt={title(node)}
                class={bemClass(list._, list.image)}
                data-lf={lfAttributes.fadeIn}
                src={node?.cells?.lfImage?.value}
                title={title(node)}
              />
              {hoveredOption === node && (
                <div
                  class={bemClass(list._, list.actions)}
                  onClick={(e) => e.stopPropagation()}
                >
                  {edit(type, node)}
                  {remove(type, node)}
                </div>
              )}
            </div>
          ));
          return (
            <Fragment>
              {isFormActive ? (
                <MessengerFormFC adapter={adapter} type={type} />
              ) : (
                <MessengerCoversFC
                  adapter={adapter}
                  type={type}
                  images={images}
                />
              )}
            </Fragment>
          );
        }
        return null;
      })}
    </Fragment>
  );
};
//#endregion
