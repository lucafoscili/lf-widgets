import {
  LF_MESSENGER_MENU,
  LfMessengerAdapter,
  LfMessengerAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { statusIconOptions } from "./helpers.utils";

export const prepCharacter = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterJsx["character"] => {
  return {
    //#region Avatar
    avatar: () => {
      const { controller, elements } = getAdapter();
      const { blocks, cyAttributes, image, lfAttributes, framework } =
        controller.get;
      const { character } = elements.refs;
      const { asCover } = image;
      const fw = framework();
      const { assignRef, theme } = fw;
      const { bemClass } = theme;

      const { title, value } = asCover("avatars");

      return (
        <img
          alt={title || ""}
          class={bemClass(blocks().character._, blocks().character.image)}
          data-cy={cyAttributes().image}
          data-lf={lfAttributes().fadeIn}
          ref={assignRef(character, "avatar")}
          src={value}
          title={title || ""}
        />
      );
    },
    //#endregion

    //#region Biography
    biography: () => {
      const { controller, elements } = getAdapter();
      const { character } = elements.refs;
      const { biography } = controller.get.character;
      const fw = controller.get.framework();
      const { assignRef } = fw;

      return (
        <lf-code
          lfLanguage="markdown"
          lfShowHeader={false}
          lfValue={biography()}
          ref={assignRef(character, "biography")}
        ></lf-code>
      );
    },
    //#endregion

    //#region Save
    save: () => {
      const { controller, elements, handlers } = getAdapter();
      const { cyAttributes, framework, status, blocks } = controller.get;
      const { character } = elements.refs;
      const { button } = handlers.character;
      const { inProgress } = status.save;
      const fw = framework();
      const { assignRef, theme } = fw;
      const { bemClass } = theme;

      const isSaving = inProgress();

      return (
        <lf-button
          class={bemClass(blocks().character._, blocks().character.saveButton)}
          data-cy={cyAttributes().button}
          lfDataset={LF_MESSENGER_MENU(fw.theme)}
          lfLabel={"Save"}
          lfShowSpinner={isSaving}
          lfStretchY={true}
          lfStyling="flat"
          onLf-button-event={button}
          ref={assignRef(character, "save")}
          title="Update the dataset with current settings."
        ></lf-button>
      );
    },
    //#endregion

    //#region Status icon
    statusIcon: () => {
      const { controller, elements } = getAdapter();
      const { blocks, framework, status } = controller.get;
      const { character } = elements.refs;
      const { connection } = status;
      const fw = framework();
      const { assignRef, theme } = fw;
      const { bemClass } = theme;

      const { color, title } = statusIconOptions(connection());

      return (
        <div
          class={bemClass(blocks().character._, blocks().character.status, {
            offline: color === "danger",
            online: color === "success",
          })}
          ref={assignRef(character, "statusIcon")}
          title={title}
        ></div>
      );
    },
    //#endregion
  };
};
