import { LfCardAdapter } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { LfCard } from "./lf-card";

//#region Upload layout
export const prepUpload = (getAdapter: () => LfCardAdapter): VNode => {
  const { blocks, compInstance, defaults, manager, parts, shapes } =
    getAdapter().controller.get;
  const { data, theme } = manager;
  const { decorate } = data.cell.shapes;
  const { bemClass } = theme;
  const { uploadLayout } = blocks;

  const { button, upload } = shapes();
  const comp = compInstance as LfCard;

  //#region Button
  const buttons = decorate(
    "button",
    button,
    async (e) => comp.onLfEvent(e, "lf-event"),
    defaults.upload.button(),
  );
  const hasButton = Boolean(buttons?.length);
  //#endregion

  //#region Upload
  const uploads = decorate("upload", upload, async (e) =>
    comp.onLfEvent(e, "lf-event"),
  );
  const hasUpload = Boolean(uploads?.length);
  //#endregion

  return (
    <div class={bemClass(uploadLayout._)} part={parts.uploadLayout}>
      {hasUpload && (
        <div class={bemClass(uploadLayout._, uploadLayout.section1)}>
          {uploads[0]}
        </div>
      )}
      {hasButton && (
        <div class={bemClass(uploadLayout._, uploadLayout.section2)}>
          {buttons[0]}
        </div>
      )}
    </div>
  );
};
//#endregion
