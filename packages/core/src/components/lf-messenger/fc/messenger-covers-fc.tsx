import {
  LfMessengerAdapter,
  LfMessengerImageTypes,
} from "@lf-widgets/foundations";
import { Fragment, FunctionalComponent, h, VNode } from "@stencil/core";

//#region Props
export interface MessengerCoversFCProps {
  adapter: LfMessengerAdapter;
  /** The image type for these covers */
  type: LfMessengerImageTypes;
  /** Pre-rendered image VNodes */
  images: VNode[];
}
//#endregion

/**
 * FC for the messenger covers section.
 * Displays a title with add button and grid of cover images.
 */
export const MessengerCoversFC: FunctionalComponent<MessengerCoversFCProps> = ({
  adapter,
  type,
  images,
}) => {
  const { controller, elements } = adapter;
  const { get } = controller;

  const blocks = get.blocks();
  const framework = get.framework();
  const { bemClass } = framework.theme;

  const { covers } = blocks;
  const { add } = elements.jsx.customization.form[type];

  return (
    <Fragment>
      <div class={bemClass(covers._)}>
        <div class={bemClass(covers._, covers.title)}>
          <div class={bemClass(covers._, covers.label)}>{type}</div>
          {add()}
        </div>
        <div class={bemClass(covers._, covers.images)}>{images}</div>
      </div>
    </Fragment>
  );
};
