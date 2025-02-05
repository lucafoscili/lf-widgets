import {
  IMAGE_TYPE_IDS,
  LF_MESSENGER_FILTER,
  LfMessengerAdapter,
  LfMessengerAdapterJsx,
  LfMessengerUnionChildIds,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";

export const prepCustomization = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterJsx["customization"] => {
  return {
    //#region Filters
    filters: () => {
      const { controller, elements, handlers } = getAdapter();
      const { character, manager } = controller.get;
      const { customization } = elements.refs;
      const { chip } = handlers.customization;
      const { assignRef } = manager;

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
        const { assignRef, theme } = controller.get.manager;
        const { customization } = elements.refs;
        const { button } = handlers.customization;

        const { "--lf-icon-edit": icon } = theme.get.current().variables;

        return (
          <lf-button
            lfIcon={icon}
            lfStretchX={true}
            onLf-button-event={(e) => button(e, type, "edit", node)}
            title="Edit this option."
            ref={assignRef(customization.list, "edit")}
          ></lf-button>
        );
      },
      remove: (type, node) => {
        const { controller, elements, handlers } = getAdapter();
        const { assignRef, theme } = controller.get.manager;
        const { customization } = elements.refs;
        const { button } = handlers.customization;

        const { "--lf-icon-delete": icon } = theme.get.current().variables;

        return (
          <lf-button
            lfIcon={icon}
            lfStretchX={true}
            lfUiState={"danger"}
            onLf-button-event={(e) => button(e, type, "delete", node)}
            title="Delete this option."
            ref={assignRef(customization.list, "remove")}
          ></lf-button>
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
          const { blocks, cyAttributes, manager } = controller.get;
          const { form } = elements.refs.customization;
          const { button } = handlers.customization;
          const { assignRef, theme } = manager;
          const { bemClass } = theme;

          const { "--lf-icon-add": icon } = theme.get.current().variables;

          return (
            <lf-button
              class={bemClass(blocks.covers._, blocks.covers.add)}
              data-cy={cyAttributes.button}
              lfIcon={icon}
              lfLabel="New"
              lfStretchY={true}
              lfStyling="flat"
              lfUiSize="small"
              onLf-button-event={(e) => button(e, type, "add", null)}
              ref={assignRef(form[type], "add")}
            ></lf-button>
          );
        },
        cancel: () => {
          const adapter = getAdapter();
          const { controller, elements, handlers } = adapter;
          const { blocks, cyAttributes, manager } = controller.get;
          const { form } = elements.refs.customization;
          const { button } = handlers.customization;
          const { assignRef, theme } = manager;
          const { bemClass } = theme;

          const { "--lf-icon-clear": icon } = theme.get.current().variables;

          return (
            <lf-button
              class={bemClass(blocks.form._, blocks.form.button)}
              data-cy={cyAttributes.button}
              lfIcon={icon}
              lfLabel="Cancel"
              lfStyling="flat"
              onLf-button-event={(e) => button(e, type, "cancel", null)}
              ref={assignRef(form[type], "cancel")}
            ></lf-button>
          );
        },
        confirm: () => {
          const adapter = getAdapter();
          const { controller, elements, handlers } = adapter;
          const { blocks, cyAttributes, manager } = controller.get;
          const { form } = elements.refs.customization;
          const { button } = handlers.customization;
          const { assignRef, theme } = manager;
          const { bemClass } = theme;

          const { "--lf-icon-success": icon } = theme.get.current().variables;

          return (
            <lf-button
              class={bemClass(blocks.form._, blocks.form.button)}
              data-cy={cyAttributes.button}
              lfIcon={icon}
              lfLabel="Confirm"
              lfStyling="outlined"
              onLf-button-event={(e) => button(e, type, "confirm", null)}
              ref={assignRef(form[type], "confirm")}
            ></lf-button>
          );
        },
        description: (node?) => {
          const adapter = getAdapter();
          const { controller, elements } = adapter;
          const { blocks, cyAttributes, manager } = controller.get;
          const { form } = elements.refs.customization;
          const { assignRef, theme } = manager;
          const { bemClass, get } = theme;

          return (
            <lf-textfield
              class={bemClass(blocks.form._, blocks.form.field)}
              data-cy={cyAttributes.input}
              lfStretchX={true}
              lfIcon={get.icon("id")}
              lfLabel="Description"
              lfValue={node && node.description}
              ref={assignRef(form[type], "description")}
              title="A more accurate description to give extra context to the LLM."
            ></lf-textfield>
          );
        },
        id: (id: LfMessengerUnionChildIds) => {
          const adapter = getAdapter();
          const { controller, elements } = adapter;
          const { blocks, cyAttributes, manager } = controller.get;
          const { form } = elements.refs.customization;
          const { assignRef, theme } = manager;
          const { bemClass, get } = theme;

          return (
            <lf-textfield
              class={bemClass(blocks.form._, blocks.form.field)}
              data-cy={cyAttributes.input}
              key={`id-edit-${id}`}
              lfStretchX={true}
              lfIcon={get.icon("key")}
              lfLabel="ID"
              lfValue={id}
              ref={assignRef(form[type], "id")}
              title="The cover image displayed in the selection panel."
            ></lf-textfield>
          );
        },
        imageUrl: (node?) => {
          const adapter = getAdapter();
          const { controller, elements } = adapter;
          const { blocks, cyAttributes, manager } = controller.get;
          const { form } = elements.refs.customization;
          const { assignRef, theme } = manager;
          const { bemClass, get } = theme;

          return (
            <lf-textfield
              class={bemClass(blocks.form._, blocks.form.field)}
              data-cy={cyAttributes.input}
              lfStretchX={true}
              lfIcon={get.icon("photo")}
              lfLabel="Image URL"
              lfValue={node && node.cells.lfImage.value}
              ref={assignRef(form[type], "imageUrl")}
              title="The cover image displayed in the selection panel."
            ></lf-textfield>
          );
        },
        title: (node?) => {
          const adapter = getAdapter();
          const { controller, elements } = adapter;
          const { blocks, cyAttributes, manager } = controller.get;
          const { form } = elements.refs.customization;
          const { assignRef, theme } = manager;
          const { bemClass, get } = theme;

          return (
            <lf-textfield
              class={bemClass(blocks.form._, blocks.form.field)}
              data-cy={cyAttributes.input}
              lfStretchX={true}
              lfIcon={get.icon("forms")}
              lfLabel="Title"
              lfValue={node && node.value}
              ref={assignRef(form[type], "title")}
              title="The overall theme of this option."
            ></lf-textfield>
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
