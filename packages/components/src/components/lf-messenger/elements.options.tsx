import {
  LF_MESSENGER_IDS,
  LfMessengerAdapter,
  LfMessengerAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";

export const prepOptions = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterJsx["options"] => {
  return {
    //#region Back
    back: () => {
      const { controller, elements, handlers } = getAdapter();
      const { cyAttributes, manager } = controller.get;
      const { assignRef, theme } = manager;
      const { options } = elements.refs;
      const { button } = handlers.options;

      const icon = theme.get.icon("arrowBack");

      return (
        <lf-button
          data-cy={cyAttributes.button}
          id={LF_MESSENGER_IDS.options.back}
          lfIcon={icon}
          lfLabel="Back"
          lfStretchX={true}
          onLf-button-event={button}
          ref={assignRef(options, "back")}
        ></lf-button>
      );
    },
    //#endregion

    //#region Customization
    customize: () => {
      const { controller, elements, handlers } = getAdapter();
      const { cyAttributes, manager } = controller.get;
      const { assignRef, theme } = manager;
      const { options } = elements.refs;
      const { button } = handlers.options;

      const icon = theme.get.icon("wand");

      return (
        <lf-button
          data-cy={cyAttributes.button}
          id={LF_MESSENGER_IDS.options.customize}
          lfIcon={icon}
          lfLabel="Customize"
          lfStretchX={true}
          onLf-button-event={button}
          ref={assignRef(options, "customize")}
        ></lf-button>
      );
    },
    //#endregion
  };
};
