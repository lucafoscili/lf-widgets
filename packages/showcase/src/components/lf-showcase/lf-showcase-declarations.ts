import {
  LfArticleDataset,
  LfComponentProps,
  LfComponentPropsFor,
  LfComponentReverseTagMap,
  LfComponentTag,
  LfDataDataset,
  LfEvent,
} from "@lf-widgets/foundations";
import { FIXTURES_CATEGORIES } from "./helpers/constants";

//#region Data
export type LfShowcaseCategories = (typeof FIXTURES_CATEGORIES)[number];
export type LfShowcaseIds = readonly string[];
export interface LfShowcaseExample<P extends LfComponentProps> {
  description: string;
  events?: Record<string, (event: LfEvent) => void>;
  hasMinHeight?: boolean;
  hasParent?: boolean;
  props: P;
  slots?: Array<string | "spinner">;
}
export type LfShowcaseData<C extends LfComponentTag> = {
  [K in LfShowcaseCategories]?: {
    [example: string]: LfShowcaseExample<
      LfComponentPropsFor<LfComponentReverseTagMap[C]>
    >;
  };
};
export interface LfShowcaseConfiguration {
  columns?: Partial<{
    [K in LfShowcaseCategories]: number;
  }>;
}
export interface LfShowcaseDocMethod {
  docs: string;
  name: string;
  returns: { docs: string; type: string };
  signature: string;
}
export interface LfShowcaseDocProp {
  docs: string;
  name: string;
  type: string;
}
export interface LfShowcaseDocStyle {
  docs: string;
  name: string;
}
export interface LfShowcaseDoc {
  [index: string]:
    | {
        methods: LfShowcaseDocMethod[];
        props: LfShowcaseDocProp[];
        styles: LfShowcaseDocStyle[];
      }
    | Record<string, unknown>;
}
export interface LfShowcaseActions {
  [action: string]: {
    command: () => Promise<unknown>;
    label: string;
  };
}
export interface LfShowcaseFixture {
  actions?: LfShowcaseActions;
  documentation: LfArticleDataset;
}
export interface LfShowcaseComponentFixture<C extends LfComponentTag>
  extends LfShowcaseFixture {
  configuration?: LfShowcaseConfiguration;
  examples: LfShowcaseData<C>;
}
export type LfShowcaseTitle = "Components" | "Framework";
//#endregion

//#region States
export type LfShowcaseDatasets = { [K in LfShowcaseTitle]: LfDataDataset };
export type LfShowcaseViews = { [K in LfShowcaseTitle]: string };
//#endregion

//#region Props
export interface LfShowcasePropsInterface {
  lfStyle: string;
}
//#endregion
