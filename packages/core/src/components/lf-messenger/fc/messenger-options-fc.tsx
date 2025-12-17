import {
  COVER_ICONS,
  LF_THEME_ICONS,
  LfIconType,
  LfMessengerAdapter,
  OPTION_TYPE_IDS,
} from "@lf-widgets/foundations";
import { Fragment, FunctionalComponent, h, VNode } from "@stencil/core";
import { FIcon } from "../../../utils/icon";

//#region Props
export interface MessengerOptionsFCProps {
  adapter: LfMessengerAdapter;
}
//#endregion

/**
 * FC for the messenger options grid.
 * Displays the 2x2 grid of active customization options (avatars, locations, outfits, timeframes).
 */
export const MessengerOptionsFC: FunctionalComponent<
  MessengerOptionsFCProps
> = ({ adapter }) => {
  const { controller } = adapter;
  const { get } = controller;

  const blocks = get.blocks();
  const framework = get.framework();
  const lfAttributes = get.lfAttributes();
  const { bemClass } = framework.theme;

  const { options } = blocks;
  const { asCover } = get.image;
  const ui = (get.compInstance() as any).ui;

  const optionElements: VNode[] = OPTION_TYPE_IDS.map((opt) => {
    const { value, node, title } = asCover(opt);
    const isEnabled = ui.options[opt];
    const option = opt.slice(0, -1);
    const fallback = value as (typeof COVER_ICONS)[number];

    const icon = !node
      ? fallback
      : framework.theme.get.icon(isEnabled ? "hexagonMinus2" : "offHexagon");

    return (
      <div class={bemClass(options._, options.wrapper)}>
        {node ? (
          <Fragment>
            <img
              alt={title}
              class={bemClass(options._, options.cover)}
              data-lf={lfAttributes.fadeIn}
              src={value}
            ></img>
            <div
              class={bemClass(options._, options.blocker, {
                active: !isEnabled,
              })}
              onClick={() => {
                (ui as any).options[opt] = !isEnabled;
                get.compInstance().refresh();
              }}
            >
              <FIcon
                framework={framework}
                icon={icon as LfIconType}
                wrapperClass={bemClass(options._, options.blockerIcon)}
              />
              <div class={bemClass(options._, options.blockerLabel)}>
                {isEnabled ? "Click to disable" : "Click to enable"}
              </div>
            </div>
          </Fragment>
        ) : (
          <div
            class={bemClass(options._, options.placeholder)}
            title={`No ${option} selected.`}
          >
            <FIcon
              framework={framework}
              icon={icon as LfIconType}
              wrapperClass={bemClass(options._, options.placeholderIcon)}
            />
          </div>
        )}
        <div class={bemClass(options._, options.name)}>
          <div
            class={bemClass(options._, options.label)}
            title={`Active ${option}.`}
          >
            {option}
          </div>
          {title && (
            <FIcon
              framework={framework}
              icon={LF_THEME_ICONS.info}
              wrapperClass={bemClass(options._, options.info)}
              style={{ cursor: "help" }}
            />
          )}
        </div>
      </div>
    );
  });

  return <Fragment>{optionElements}</Fragment>;
};
