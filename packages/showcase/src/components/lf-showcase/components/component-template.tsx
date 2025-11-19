import {
  CY_ATTRIBUTES,
  LfArticleDataset,
  LfComponentPropsFor,
  LfComponentReverseTagMap,
  LfComponentTag,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h, VNode } from "@stencil/core";
import { FIXTURES_CATEGORIES, FIXTURES_DUMMY } from "../helpers/constants";
import { getAllComponentFixtures } from "../helpers/doc.fixtures";
import { LfShowcase } from "../lf-showcase";
import {
  LfShowcaseActions,
  LfShowcaseConfiguration,
  LfShowcaseData,
  LfShowcaseExample,
  LfShowcaseIds,
} from "../lf-showcase-declarations";

type LfTemplateArgs<C extends LfComponentTag> = {
  actions?: LfShowcaseActions;
  component: C;
  configuration?: LfShowcaseConfiguration;
  documentation: LfArticleDataset;
  examples?: LfShowcaseData<C>;
  ids: LfShowcaseIds;
  manager: LfFrameworkInterface;
};

const fixtureCache = new WeakMap<
  LfShowcase,
  Map<LfComponentTag, ReturnType<typeof getAllComponentFixtures>>
>();

export const ComponentTemplate: FunctionalComponent<{
  showcase: LfShowcase;
  component: LfComponentTag;
  manager: LfFrameworkInterface;
}> = ({ showcase, component, manager }) => {
  const { bemClass } = manager.theme;

  const { actions, configuration, documentation, examples } = getCachedFixtures(
    showcase,
    component,
    manager,
  );

  const args: LfTemplateArgs<typeof component> = {
    actions,
    component,
    configuration,
    documentation,
    examples,
    ids: [],
    manager,
  };

  return (
    <div class={bemClass("component-template")}>
      <lf-article
        class={bemClass("component-template", "documentation")}
        lfDataset={documentation}
      ></lf-article>
      <div class={bemClass("component-template", "grid")}>
        <div
          class={bemClass("component-template", "examples")}
          data-cy={CY_ATTRIBUTES.showcaseGridWrapper}
        >
          {actions && prepActions(args)}
          {examples && prepExamples(args)}
        </div>
      </div>
    </div>
  );
};

//#region Helpers
const getCachedFixtures = (
  showcase: LfShowcase,
  component: LfComponentTag,
  manager: LfFrameworkInterface,
) => {
  if (!fixtureCache.has(showcase)) {
    fixtureCache.set(showcase, new Map());
  }
  const managerCache = fixtureCache.get(showcase)!;

  if (!managerCache.has(component)) {
    managerCache.set(
      component,
      getAllComponentFixtures(showcase, component, manager),
    );
  }

  return managerCache.get(component)!;
};
const prepActions = <C extends LfComponentTag>(
  args: LfTemplateArgs<C>,
): VNode[] => {
  const { actions, manager } = args;
  const { bemClass } = manager.theme;

  const elements: VNode[] = [];

  if (actions) {
    Object.entries(actions).map(([key, { command, label }]) => {
      elements.push(
        <lf-button
          class={bemClass("actions", "button")}
          data-cy={CY_ATTRIBUTES.button}
          id={"action-" + key}
          lfLabel={label}
          lfStyling="floating"
          lfUiState="secondary"
          lfUiSize="large"
          onClick={command}
          part="action"
        ></lf-button>,
      );
    });
  }

  return <div class={bemClass("actions")}>{elements}</div>;
};
const prepExample = <C extends LfComponentTag>(
  component: C,
  id: string,
  example: LfShowcaseData<C>[(typeof FIXTURES_CATEGORIES)[number]][string],
  manager: LfFrameworkInterface,
  category: string,
): VNode => {
  const { bemClass, get } = manager.theme;
  const { "--lf-icon-copy": copy, "--lf-icon-copy-ok": copyOk } =
    get.current().variables;

  const { description, events, hasMinHeight, hasParent, props, slots } =
    example;
  const TagName = component;
  const p = props as LfComponentPropsFor<LfComponentReverseTagMap[C]>;
  const eventProps = events
    ? Object.fromEntries(
        Object.entries(events).map(([key, handler]) => [
          `on${key.charAt(0).toUpperCase() + key.slice(1)}`,
          handler,
        ]),
      )
    : {};
  const tag = (
    <TagName
      data-cy={CY_ATTRIBUTES.showcaseExample}
      key={`${category}-${id}`}
      id={`${category}-${id}`}
      {...(p as any)}
      {...eventProps}
    >
      {prepSlot(component, manager, slots)}
    </TagName>
  );

  return (
    <div class={bemClass("example")}>
      <div class={bemClass("example", "description")}>
        <div>{description}</div>
        <lf-button
          class={bemClass("example", "copy")}
          lfIcon={copy}
          lfStretchY={true}
          lfStyling="flat"
          onLf-button-event={(e) => {
            const { comp, eventType } = e.detail;
            if (eventType === "click") {
              navigator.clipboard.writeText(JSON.stringify(p, null, 2));
              comp.setMessage("", copyOk);
            }
          }}
          title="Copy props"
        ></lf-button>
      </div>
      <div
        class={bemClass("example", "component", {
          expanded: hasMinHeight,
        })}
      >
        {hasParent ? (
          <div class={bemClass("example", "parent")}>{tag}</div>
        ) : (
          tag
        )}
      </div>
    </div>
  );
};
const prepExamples = <C extends LfComponentTag>(
  args: LfTemplateArgs<C>,
): VNode[] => {
  const { component, configuration, examples, manager } = args;
  const { bemClass } = manager.theme;

  return Object.entries(examples).map(([key, category]) => {
    return (
      <div class={bemClass("grid")}>
        {key !== FIXTURES_DUMMY && (
          <div class={bemClass("grid", "title")}>{key}</div>
        )}
        <div
          class={bemClass("grid", "examples")}
          data-columns={
            (configuration?.columns as Record<string, number>)?.[key] || ""
          }
        >
          {Object.entries(category).map(([id, example]) =>
            prepExample(
              component,
              id,
              example as LfShowcaseExample<
                LfComponentPropsFor<LfComponentReverseTagMap[C]>
              >,
              manager,
              key,
            ),
          )}
        </div>
      </div>
    );
  });
};
const prepSlot = <C extends LfComponentTag>(
  _component: C,
  manager: LfFrameworkInterface,
  slots: string[] = [],
): VNode[] => {
  const { bemClass } = manager.theme;

  if (slots?.length) {
    return slots.map((name) => {
      if (name === "spinner") {
        return (
          <div class={bemClass("example", "spinner-slot")} slot="lf-spinner">
            <lf-spinner></lf-spinner>
          </div>
        );
      } else {
        return (
          <div class={bemClass("example", "simple-slot")} slot={name}>
            Simple slot
          </div>
        );
      }
    });
  }

  return [];
};
//#endregion
