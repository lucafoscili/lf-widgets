import { LfCardAdapter } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { LfCard } from "./lf-card";

//#region Material layout
export const prepMaterial = (getAdapter: () => LfCardAdapter): VNode => {
  const {
    blocks,
    compInstance,
    cyAttributes,
    defaults,
    lfAttributes,
    manager,
    parts,
    shapes,
  } = getAdapter().controller.get;
  const { material } = defaults;
  const { data, effects, theme } = manager;
  const { decorate } = data.cell.shapes;
  const { bemClass } = theme;
  const { materialLayout, textContent } = blocks;

  const { button, image, text } = shapes();
  const comp = compInstance as LfCard;

  //#region Button
  const buttons = decorate("button", button, async (e) =>
    comp.onLfEvent(e, "lf-event"),
  );
  const hasButton = Boolean(buttons?.length);
  //#endregion

  //#region Image
  const images = decorate(
    "image",
    image,
    async (e) => comp.onLfEvent(e, "lf-event"),
    material.image(),
  );
  const hasImage = Boolean(images?.length);
  //#endregion

  //#region Text
  const texts = decorate("text", text, async (e) =>
    comp.onLfEvent(e, "lf-event"),
  );
  const hasText = Boolean(texts?.length);
  const title = (hasText && text?.[0]?.value) || null;
  const subtitle = (hasText && text?.[1]?.value) || null;
  const description = (hasText && text?.[2]?.value) || null;
  //#endregion

  return (
    <div
      class={bemClass(materialLayout._, null, {
        "has-actions": hasButton,
      })}
      data-lf={lfAttributes[comp.lfUiState]}
      part={parts.materialLayout}
    >
      {hasImage && (
        <div class={bemClass(materialLayout._, materialLayout.coverSection)}>
          {images[0]}
        </div>
      )}
      <div class={bemClass(materialLayout._, materialLayout.textSection)}>
        {title && (
          <div class={bemClass(textContent._, textContent.title)}>{title}</div>
        )}
        {subtitle && (
          <div class={bemClass(textContent._, textContent.subtitle)}>
            {subtitle}
          </div>
        )}
        {description && (
          <div class={bemClass(textContent._, textContent.description)}>
            {description}
          </div>
        )}
      </div>
      <div
        data-cy={cyAttributes.rippleSurface}
        data-lf={lfAttributes.rippleSurface}
        onPointerDown={(e) => {
          effects.ripple(e as PointerEvent, e.currentTarget as HTMLElement);
        }}
        part={lfAttributes.rippleSurface}
      ></div>
      {hasButton && (
        <div class={bemClass(materialLayout._, materialLayout.actionsSection)}>
          {...buttons}
        </div>
      )}
    </div>
  );
};
