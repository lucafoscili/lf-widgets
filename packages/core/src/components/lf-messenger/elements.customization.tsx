import {
  IMAGE_TYPE_IDS,
  LF_MESSENGER_FILTER,
  LfMessengerAdapter,
  LfMessengerAdapterJsx,
  LfMessengerUnionChildIds,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { ButtonFC } from "../lf-button/fc/button-fc";
import { LfTextfieldFC } from "../lf-textfield/lf-textfield-fc";

export const prepCustomization = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterJsx["customization"] => {
  return {
    //#region Filters
    filters: () => {
      const { controller, elements, handlers } = getAdapter();
      const { character, framework } = controller.get;
      const { customization } = elements.refs;
      const { chip } = handlers.customization;
      const fw = framework();
      const { assignRef } = fw;

      return (
        <lf-chip
          key={"filter_" + character.name()}
          lfDataset={LF_MESSENGER_FILTER}
          lfStyling="filter"
          onLf-chip-event={chip}
          ref={assignRef(customization, "filters")}
        ></lf-chip>
      );
    },
    //#endregion

    //#region Form
    form: prepForms(getAdapter),
    //#endregion

    //#region List
    list: {
      edit: (type, node) => {
        const { controller, elements, handlers } = getAdapter();
        const fw = controller.get.framework();
        const { assignRef, theme } = fw;
        const { customization } = elements.refs;
        const { button } = handlers.customization;

        const { "--lf-icon-edit": icon } = theme.get.current().variables;

        return (
          <ButtonFC
            framework={fw}
            icon={icon}
            onClick={(e) => button(e, type, "edit", node)}
            buttonRef={assignRef(customization.list, "edit")}
            style={{ width: "100%" }}
          />
        );
      },
      remove: (type, node) => {
        const { controller, elements, handlers } = getAdapter();
        const fw = controller.get.framework();
        const { assignRef, theme } = fw;
        const { customization } = elements.refs;
        const { button } = handlers.customization;

        const { "--lf-icon-delete": icon } = theme.get.current().variables;

        return (
          <ButtonFC
            framework={fw}
            icon={icon}
            uiState={"danger"}
            onClick={(e) => button(e, type, "delete", node)}
            buttonRef={assignRef(customization.list, "remove")}
            style={{ width: "100%" }}
          />
        );
      },
    },
  };
  //#endregion
};

//#region Helpers
const prepForms = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterJsx["customization"]["form"] => {
  const formElements = IMAGE_TYPE_IDS.reduce(
    (acc, type) => {
      acc[type] = {
        add: () => {
          const adapter = getAdapter();
          const { controller, elements, handlers } = adapter;
          const { blocks, cyAttributes, framework } = controller.get;
          const { form } = elements.refs.customization;
          const { button } = handlers.customization;
          const fw = framework();
          const { assignRef, theme } = fw;
          const { bemClass } = theme;

          const { "--lf-icon-add": icon } = theme.get.current().variables;

          return (
            <ButtonFC
              className={bemClass(blocks().covers._, blocks().covers.add)}
              framework={fw}
              icon={icon}
              label="New"
              styling="flat"
              uiSize="small"
              onClick={(e) => button(e, type, "add", null)}
              buttonRef={assignRef(form[type], "add")}
              style={{ height: "100%" }}
            />
          );
        },
        cancel: () => {
          const adapter = getAdapter();
          const { controller, elements, handlers } = adapter;
          const { blocks, cyAttributes, framework } = controller.get;
          const { form } = elements.refs.customization;
          const { button } = handlers.customization;
          const fw = framework();
          const { assignRef, theme } = fw;
          const { bemClass } = theme;

          const { "--lf-icon-clear": icon } = theme.get.current().variables;

          return (
            <ButtonFC
              className={bemClass(blocks().form._, blocks().form.button)}
              framework={fw}
              icon={icon}
              label="Cancel"
              styling="flat"
              onClick={(e) => button(e, type, "cancel", null)}
              buttonRef={assignRef(form[type], "cancel")}
            />
          );
        },
        confirm: () => {
          const adapter = getAdapter();
          const { controller, elements, handlers } = adapter;
          const { blocks, cyAttributes, framework } = controller.get;
          const { form } = elements.refs.customization;
          const { button } = handlers.customization;
          const fw = framework();
          const { assignRef, theme } = fw;
          const { bemClass } = theme;

          const { "--lf-icon-success": icon } = theme.get.current().variables;

          return (
            <ButtonFC
              className={bemClass(blocks().form._, blocks().form.button)}
              framework={fw}
              icon={icon}
              label="Confirm"
              styling="outlined"
              onClick={(e) => button(e, type, "confirm", null)}
              buttonRef={assignRef(form[type], "confirm")}
            />
          );
        },
        description: (node?) => {
          const adapter = getAdapter();
          const { controller, elements } = adapter;
          const { blocks, cyAttributes, framework } = controller.get;
          const { form } = elements.refs.customization;
          const fw = framework();
          const { assignRef, theme } = fw;
          const { bemClass, get } = theme;

          return (
            <LfTextfieldFC
              className={bemClass(blocks().form._, blocks().form.field)}
              framework={fw}
              icon={get.icon("id")}
              label="Description"
              value={node && node.description}
              inputRef={assignRef(form[type], "description")}
              style={{ width: "100%" }}
            />
          );
        },
        id: (id: LfMessengerUnionChildIds) => {
          const adapter = getAdapter();
          const { controller, elements } = adapter;
          const { blocks, cyAttributes, framework } = controller.get;
          const { form } = elements.refs.customization;
          const fw = framework();
          const { assignRef, theme } = fw;
          const { bemClass, get } = theme;

          return (
            <LfTextfieldFC
              className={bemClass(blocks().form._, blocks().form.field)}
              framework={fw}
              id={`id-edit-${id}`}
              icon={get.icon("key")}
              label="ID"
              value={id}
              inputRef={assignRef(form[type], "id")}
              style={{ width: "100%" }}
            />
          );
        },
        imageUrl: (node?) => {
          const adapter = getAdapter();
          const { controller, elements } = adapter;
          const { blocks, cyAttributes, framework } = controller.get;
          const { form } = elements.refs.customization;
          const fw = framework();
          const { assignRef, theme } = fw;
          const { bemClass, get } = theme;

          return (
            <LfTextfieldFC
              className={bemClass(blocks().form._, blocks().form.field)}
              framework={fw}
              icon={get.icon("photo")}
              label="Image URL"
              value={node && node.cells.lfImage.value}
              inputRef={assignRef(form[type], "imageUrl")}
              style={{ width: "100%" }}
            />
          );
        },
        title: (node?) => {
          const adapter = getAdapter();
          const { controller, elements } = adapter;
          const { blocks, cyAttributes, framework } = controller.get;
          const { form } = elements.refs.customization;
          const fw = framework();
          const { assignRef, theme } = fw;
          const { bemClass, get } = theme;

          return (
            <LfTextfieldFC
              className={bemClass(blocks().form._, blocks().form.field)}
              framework={fw}
              icon={get.icon("forms")}
              label="Title"
              value={node && node.value}
              inputRef={assignRef(form[type], "title")}
              style={{ width: "100%" }}
            />
          );
        },
      };
      return acc;
    },
    {} as LfMessengerAdapterJsx["customization"]["form"],
  );

  return formElements;
};

//#endregion
