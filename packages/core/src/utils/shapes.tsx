import {
  CY_ATTRIBUTES,
  LfComponentName,
  LfComponentPropsFor,
  LfDataCell,
  LfDataShapes,
  LfEvent,
  LfFrameworkAllowedKeysMap,
  LfShapePropsInterface,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

/**
 * Renders a shape or a specific Lf component depending on the provided props.
 *
 * @param props - The properties required for rendering various shapes or components.
 * @param props.framework - Contains necessary data helpers and a sanitizeProps function.
 * @param props.shape - The type of shape to render (e.g., "slot", "number", "text").
 * @param props.index - The index of the current shape or component used as part of rendering.
 * @param props.cell - Data related to the shape or component, including a value to display.
 * @param props.eventDispatcher - Callback function that dispatches or handles component events.
 * @param props.defaultCb - Optional callback invoked before event dispatching.
 * @param props.refCallback - Reference callback for the rendered element.
 *
 * @returns A JSX element corresponding to the specified shape or Lf component.
 */
export const LfShape: FunctionalComponent<LfShapePropsInterface> = ({
  framework,
  shape,
  index,
  cell,
  eventDispatcher,
  defaultCb,
  refCallback,
}) => {
  const { data, sanitizeProps } = framework;
  const { stringify } = data.cell;

  const handler = (e: LfEvent) => {
    if (defaultCb) {
      defaultCb(e);
    }
    eventDispatcher(e);
  };

  switch (shape) {
    case "badge":
      return (
        <lf-badge
          {...sanitizeProps(
            decorator("LfBadge", shape, cell, index),
            "LfBadge",
          )}
          onLf-badge-event={handler}
          ref={refCallback}
        ></lf-badge>
      );
    case "button":
      return (
        <lf-button
          {...sanitizeProps(
            decorator("LfButton", shape, cell, index),
            "LfButton",
          )}
          onLf-button-event={handler}
          ref={refCallback}
        ></lf-button>
      );
    case "canvas":
      return (
        <lf-canvas
          {...sanitizeProps(
            decorator("LfCanvas", shape, cell, index),
            "LfCanvas",
          )}
          onLf-canvas-event={handler}
          ref={refCallback}
        ></lf-canvas>
      );
    case "card":
      return (
        <lf-card
          {...sanitizeProps(decorator("LfCard", shape, cell, index), "LfCard")}
          onLf-card-event={handler}
          ref={refCallback}
        ></lf-card>
      );
    case "chart":
      return (
        <lf-chart
          {...sanitizeProps(
            decorator("LfChart", shape, cell, index),
            "LfChart",
          )}
          onLf-chart-event={handler}
          ref={refCallback}
        ></lf-chart>
      );
    case "chat":
      return (
        <lf-chat
          {...sanitizeProps(decorator("LfChat", shape, cell, index), "LfChat")}
          onLf-chat-event={handler}
          ref={refCallback}
        ></lf-chat>
      );
    case "chip":
      return (
        <lf-chip
          {...sanitizeProps(decorator("LfChip", shape, cell, index), "LfChip")}
          onLf-chip-event={handler}
          ref={refCallback}
        ></lf-chip>
      );
    case "code":
      return (
        <lf-code
          {...sanitizeProps(decorator("LfCode", shape, cell, index), "LfCode")}
          onLf-code-event={handler}
          ref={refCallback}
        ></lf-code>
      );
    case "image":
      return (
        <lf-image
          {...sanitizeProps(
            decorator("LfImage", shape, cell, index),
            "LfImage",
          )}
          onLf-image-event={handler}
          ref={refCallback}
        ></lf-image>
      );
    case "photoframe":
      return (
        <lf-photoframe
          {...sanitizeProps(
            decorator("LfPhotoframe", shape, cell, index),
            "LfPhotoframe",
          )}
          onLf-photoframe-event={handler}
          ref={refCallback}
        ></lf-photoframe>
      );
    case "progressbar":
      return (
        <lf-progressbar
          {...sanitizeProps(
            decorator("LfProgressbar", shape, cell, index),
            "LfProgressbar",
          )}
          onLf-progressbar-event={handler}
          ref={refCallback}
        ></lf-progressbar>
      );
    case "textfield":
      return (
        <lf-textfield
          {...sanitizeProps(
            decorator("LfTextfield", shape, cell, index),
            "LfTextfield",
          )}
          onLf-textfield-event={handler}
          ref={refCallback}
        ></lf-textfield>
      );
    case "toggle":
      return (
        <lf-toggle
          {...sanitizeProps(
            decorator("LfToggle", shape, cell, index),
            "LfToggle",
          )}
          onLf-toggle-event={handler}
          ref={refCallback}
        ></lf-toggle>
      );
    case "typewriter":
      return (
        <lf-typewriter
          {...sanitizeProps(
            decorator("LfTypewriter", shape, cell, index),
            "LfTypewriter",
          )}
          onLf-typewriter-event={handler}
          ref={refCallback}
        ></lf-typewriter>
      );
    case "upload":
      return (
        <lf-upload
          {...sanitizeProps(
            decorator("LfUpload", shape, cell, index),
            "LfUpload",
          )}
          onLf-upload-event={handler}
          ref={refCallback}
        ></lf-upload>
      );
  }

  switch (shape) {
    case "slot":
      return (
        <slot
          key={`${shape}${index}`}
          name={stringify(cell.value)}
          {...sanitizeProps(decorator(null, shape, cell, index))}
        ></slot>
      );
    case "number":
    case "text":
    default:
      return (
        <div
          id={`${shape}${index}`}
          key={`${shape}${index}`}
          {...sanitizeProps(decorator(null, shape, cell, index))}
        >
          {cell.value}
        </div>
      );
  }
};

export const decorator = <C extends LfComponentName, S extends LfDataShapes>(
  component: C | null,
  shape: S,
  cell: Partial<LfDataCell>,
  index: number,
): LfComponentPropsFor<C> & Partial<LfFrameworkAllowedKeysMap> => {
  const toSpread: Partial<LfFrameworkAllowedKeysMap> &
    Partial<LfDataCell> & {
      [key: `data-${string}`]: string;
    } = {};

  const clean = () => {
    const hasValue = toSpread["value"] && !toSpread["lfValue"];

    if (hasValue) {
      toSpread["lfValue"] = toSpread["value"];
    }

    delete toSpread["htmlProps"];
    delete toSpread["shape"];
    delete toSpread["value"];
  };

  if (cell.htmlProps) {
    for (const key in cell.htmlProps) {
      const k = key as keyof Partial<LfFrameworkAllowedKeysMap>;
      const prop = cell.htmlProps[k];
      if (k === "dataset") {
        for (const k in prop) {
          toSpread[`data-${k}`] = prop[k];
        }
      }
    }
  }
  for (const key in cell) {
    const k = key as keyof (Partial<LfDataCell<LfDataShapes>> & {
      htmlProps?: Record<string, any>;
    });
    const prop = cell[k];
    toSpread[k] = prop;
  }

  const id = toSpread?.["htmlProps"]?.["id"] || `${shape}${index}`;
  clean();

  return {
    "data-component": component || shape,
    "data-cy": CY_ATTRIBUTES.shape,
    "data-index": index,
    id,
    key: `${shape}${index}`,
    ...toSpread,
  };
};
