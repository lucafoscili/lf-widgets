import { LfCardAdapter, LfDataCell } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { LfShape } from "../../utils/shapes";
import { LfCard } from "./lf-card";

//#region Upload layout
export const prepUpload = (getAdapter: () => LfCardAdapter): VNode => {
  const { blocks, compInstance, defaults, manager, parts, shapes } =
    getAdapter().controller.get;
  const { theme } = manager;
  const { bemClass } = theme;
  const { uploadLayout } = blocks;

  const { button, upload } = shapes();
  const comp = compInstance as LfCard;

  //#region Button
  const buttons: LfDataCell<"button">[] = [];
  const buttonsDef = defaults.upload.button();
  for (let index = 0; index < button.length; index++) {
    buttons.push(
      <LfShape
        shape={"button"}
        cell={
          buttonsDef[index]
            ? Object.assign(buttonsDef[index], button[index])
            : button[index]
        }
        index={index}
        eventDispatcher={async (e) => comp.onLfEvent(e, "lf-event")}
        framework={manager}
      ></LfShape>,
    );
  }
  const hasButton = Boolean(buttons?.length);
  //#endregion

  //#region Upload
  const uploads: LfDataCell<"upload">[] = [];
  for (let index = 0; index < upload.length; index++) {
    uploads.push(
      <LfShape
        shape={"upload"}
        cell={upload[index]}
        index={index}
        eventDispatcher={async (e) => comp.onLfEvent(e, "lf-event")}
        framework={manager}
      ></LfShape>,
    );
  }
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
