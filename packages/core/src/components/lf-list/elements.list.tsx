import { LfListAdapter, LfListAdapterJsx } from "@lf-widgets/foundations";
import { h } from "@stencil/core";

export const prepList = (getAdapter: () => LfListAdapter): LfListAdapterJsx => {
  return {
    //#region Delete Icon
    deleteIcon: (node) => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, lfAttributes, manager, parts } =
        controller.get;
      const { refs } = elements;
      const { deleteIcon } = handlers;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <div
          class={bemClass(blocks.deleteIcon._)}
          data-cy={cyAttributes.button}
          data-lf={lfAttributes.icon}
          onClick={(e) => deleteIcon(e, node)}
          part={parts.deleteIcon}
          ref={assignRef(refs, "deleteIcon")}
        >
          <div
            class={bemClass(blocks.deleteIcon._, blocks.deleteIcon.icon)}
            key={node.id + "_delete"}
          ></div>
        </div>
      );
    },
    //#endregion

    //#region Filter
    filter: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, lfAttributes, manager, parts } =
        controller.get;
      const { refs } = elements;
      const { filter } = handlers;
      const { lfUiSize, lfUiState } = compInstance;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      const iconSearch = theme.get.current().variables["--lf-icon-search"];

      return (
        <lf-textfield
          class={bemClass(blocks.list._, blocks.list.filter)}
          data-lf={lfAttributes[lfUiState]}
          lfIcon={iconSearch}
          lfLabel="Search..."
          lfStretchX={true}
          lfStyling="flat"
          lfUiSize={lfUiSize}
          lfUiState={lfUiState}
          onLf-textfield-event={filter}
          part={parts.filter}
          ref={assignRef(refs, "filter")}
        ></lf-textfield>
      );
    },
    //#endregion

    //#region Icon
    icon(node) {
      const { controller, elements } = getAdapter();
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { assets, assignRef } = manager;
      const { bemClass } = manager.theme;
      const { refs } = elements;

      const { style } = assets.get(`./assets/svg/${node.icon}.svg`);
      return (
        <div
          class={bemClass(blocks.node._, blocks.node.icon)}
          data-cy={cyAttributes.maskedSvg}
          part={parts.icon}
          ref={assignRef(refs, "icon")}
          style={style}
        ></div>
      );
    },
    //#endregion

    //#region Node
    node: (node, index, isSelected) => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, lfAttributes, manager, parts } =
        controller.get;
      const { jsx, refs } = elements;
      const { assignRef, data, theme } = manager;
      const { stringify } = data.cell;
      const { bemClass } = theme;

      const hasValue = String(node.value).valueOf().trim().length > 0;
      const isFocused = controller.get.focused() === index;

      return (
        <div
          aria-checked={isSelected}
          aria-selected={isSelected}
          class={bemClass(blocks.node._)}
          data-cy={cyAttributes.node}
          data-index={index.toString()}
          onBlur={(e) => handlers.node.blur(e, node, index)}
          onClick={(e) => handlers.node.click(e, node, index)}
          onFocus={(e) => handlers.node.focus(e, node, index)}
          onPointerDown={(e) => handlers.node.pointerdown(e, node, index)}
          part={parts.node}
          ref={assignRef(refs, "node")}
          role={"option"}
          tabindex={isSelected || isFocused ? "0" : "-1"}
          title={stringify(node.value) || stringify(node.description)}
        >
          <div
            data-cy={cyAttributes.rippleSurface}
            data-lf={lfAttributes.rippleSurface}
            ref={(el) => {
              if (el) {
                refs.ripples.set(node.id, el);
              }
            }}
          ></div>
          {node.icon && jsx.icon(node)}
          <span class={bemClass(blocks.node._, blocks.node.text)}>
            {hasValue && jsx.title(node)}
            {node.description && jsx.subtitle(node)}
          </span>
        </div>
      );
    },
    //#endregion

    //#region Subtitle
    subtitle: (node) => {
      const { controller, elements } = getAdapter();
      const { blocks, manager, parts } = controller.get;
      const { refs } = elements;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <div
          class={bemClass(blocks.node._, blocks.node.subtitle)}
          part={parts.subtitle}
          ref={assignRef(refs, "subtitle")}
        >
          {node.description}
        </div>
      );
    },
    //#endregion

    //#region Title
    title: (node) => {
      const { controller, elements } = getAdapter();
      const { blocks, manager, parts } = controller.get;
      const { refs } = elements;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <div
          class={bemClass(blocks.node._, blocks.node.title)}
          part={parts.title}
          ref={assignRef(refs, "title")}
        >
          {String(node.value).valueOf()}
        </div>
      );
    },
    //#endregion
  };
};
