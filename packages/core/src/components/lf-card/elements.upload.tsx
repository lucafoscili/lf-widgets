import { LfCardAdapter, LfDataCell } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { LfShape } from "../../utils/shapes";

//#region Upload layout
export const prepUpload = (getAdapter: () => LfCardAdapter): VNode => {
  const { controller, dispatcher } = getAdapter();
  const { blocks, defaults, framework, parts, shapes } = controller.get;

  const defs = defaults();
  const mgr = framework();
  const { theme } = mgr;
  const { bemClass } = theme;
  const b = blocks();
  const p = parts();
  const { uploadLayout } = b;

  const { button, upload } = shapes();

  //#region Button
  const buttons: LfDataCell<"button">[] = [];
  const buttonsDef = defs.upload.button();
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
        eventDispatcher={async (e) =>
          dispatcher.emit("lf-event", { originalEvent: e })
        }
        framework={mgr}
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
        eventDispatcher={async (e) =>
          dispatcher.emit("lf-event", { originalEvent: e })
        }
        framework={mgr}
      ></LfShape>,
    );
  }
  const hasUpload = Boolean(uploads?.length);
  //#endregion

  return (
    <div class={bemClass(uploadLayout._)} part={p.uploadLayout}>
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
