import {
  LfMessengerAdapter,
  LfMessengerImageTypes,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

//#region Props
export interface MessengerFormFCProps {
  adapter: LfMessengerAdapter;
  /** The image type for this form */
  type: LfMessengerImageTypes;
}
//#endregion

/**
 * FC for the messenger create/edit form.
 * Displays form fields for creating or editing customization options.
 */
export const MessengerFormFC: FunctionalComponent<MessengerFormFCProps> = ({
  adapter,
  type,
}) => {
  const { controller, elements } = adapter;
  const { get } = controller;

  const blocks = get.blocks();
  const framework = get.framework();
  const { bemClass } = framework.theme;

  const { form } = blocks;
  const { cancel, confirm, description, id, imageUrl, title } =
    elements.jsx.customization.form[type];

  const formStatusMap = get.status.formStatus();
  const nodeId = formStatusMap[type];
  const rootChildren = get.image.byType(type);
  const node = rootChildren.find((n) => n.id === nodeId);

  return (
    <div class={bemClass(form._)}>
      <div class={bemClass(form._, form.label)}>Create {type}</div>
      {id(nodeId)}
      {title(node)}
      {description(node)}
      {imageUrl(node)}
      <div class={bemClass(form._, form.confirm)}>
        {cancel()}
        {confirm()}
      </div>
    </div>
  );
};
