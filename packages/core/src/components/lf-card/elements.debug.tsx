import {
  LfButtonElement,
  LfCardAdapter,
  LfCodeElement,
  LfDataCell,
  LfToggleElement,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { LfShape } from "../../utils/shapes";

export const prepDebug = (getAdapter: () => LfCardAdapter): VNode => {
  const { controller, dispatcher, elements, handlers } = getAdapter();
  const { refs } = elements;
  const { layouts } = handlers;
  const { blocks, defaults, framework, parts, shapes } = controller.get;

  const defs = defaults();
  const { debug } = defs;
  const mgr = framework();
  const { theme } = mgr;
  const { bemClass } = theme;
  const b = blocks();
  const p = parts();
  const { debugLayout } = b;

  const { button, code, toggle } = shapes();

  //#region Button
  const buttons: LfDataCell<"button">[] = [];
  const buttonsDef = debug.button();
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
        defaultCb={layouts.debug.button}
        refCallback={(r: LfButtonElement) => (refs.layouts.debug.button = r)}
      ></LfShape>,
    );
  }
  const hasButton = Boolean(buttons?.length);
  const hasMoreButtons = Boolean(buttons?.length > 1);
  //#endregion

  //#region Code
  const codes: LfDataCell<"code">[] = [];
  const codesDef = debug.code();
  for (let index = 0; index < code.length; index++) {
    codes.push(
      <LfShape
        shape={"code"}
        cell={
          codesDef[index]
            ? Object.assign(codesDef[index], code[index])
            : code[index]
        }
        index={index}
        eventDispatcher={async (e) =>
          dispatcher.emit("lf-event", { originalEvent: e })
        }
        framework={mgr}
        defaultCb={layouts.debug.code}
        refCallback={(r: LfCodeElement) => (refs.layouts.debug.code = r)}
      ></LfShape>,
    );
  }
  const hasCode = Boolean(codes?.length);
  //#endregion

  //#region Toggle
  const toggles: LfDataCell<"toggle">[] = [];
  const togglesDef = debug.toggle();
  for (let index = 0; index < toggle.length; index++) {
    toggles.push(
      <LfShape
        shape={"toggle"}
        cell={
          togglesDef[index]
            ? Object.assign(togglesDef[index], toggle[index])
            : toggle[index]
        }
        index={index}
        eventDispatcher={async (e) =>
          dispatcher.emit("lf-event", { originalEvent: e })
        }
        framework={mgr}
        defaultCb={layouts.debug.toggle}
        refCallback={(r: LfToggleElement) => (refs.layouts.debug.toggle = r)}
      ></LfShape>,
    );
  }
  const hasToggle = Boolean(toggles?.length);
  //#endregion

  return (
    <div class={bemClass(debugLayout._)} part={p.debugLayout}>
      {hasToggle && (
        <div class={bemClass(debugLayout._, debugLayout.section1)}>
          {toggles[0]}
        </div>
      )}
      {hasCode && (
        <div class={bemClass(debugLayout._, debugLayout.section2)}>
          {codes[0]}
        </div>
      )}
      {hasButton && (
        <div class={bemClass(debugLayout._, debugLayout.section3)}>
          {buttons[0]}
        </div>
      )}
      {hasMoreButtons && (
        <div class={bemClass(debugLayout._, debugLayout.section4)}>
          {buttons[1]}
        </div>
      )}
    </div>
  );
};
