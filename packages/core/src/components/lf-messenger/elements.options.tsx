import {
  LF_MESSENGER_IDS,
  LfMessengerAdapter,
  LfMessengerAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { ButtonFC } from "../lf-button/fc/button-fc";

export const prepOptions = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterJsx["options"] => {
  return {
    //#region Back
    back: () => {
      const { controller, elements, handlers } = getAdapter();
      const { framework } = controller.get;
      const fw = framework();
      const { assignRef, theme } = fw;
      const { options } = elements.refs;
      const { button } = handlers.options;

      const icon = theme.get.icon("arrowBack");

      return (
        <ButtonFC
          framework={fw}
          id={LF_MESSENGER_IDS.messenger.options.back}
          icon={icon}
          label="Back"
          onClick={(e) => button(e, LF_MESSENGER_IDS.messenger.options.back)}
          buttonRef={assignRef(options, "back")}
          style={{ width: "100%" }}
        />
      );
    },
    //#endregion

    //#region Customization
    customize: () => {
      const { controller, elements, handlers } = getAdapter();
      const { framework } = controller.get;
      const fw = framework();
      const { assignRef, theme } = fw;
      const { options } = elements.refs;
      const { button } = handlers.options;

      const icon = theme.get.icon("wand");

      return (
        <ButtonFC
          framework={fw}
          id={LF_MESSENGER_IDS.messenger.options.customize}
          icon={icon}
          label="Customize"
          onClick={(e) =>
            button(e, LF_MESSENGER_IDS.messenger.options.customize)
          }
          buttonRef={assignRef(options, "customize")}
          style={{ width: "100%" }}
        />
      );
    },
    //#endregion
  };
};
