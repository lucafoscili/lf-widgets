import {
  LfDataDataset,
  LfDataNode,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";

//FIXME: this type should be in foundations
export type LfBreadcrumbsRenderable =
  | LfDataNode
  | {
      isTruncation: true;
    };

//#region buildBreadcrumbPath
export const buildBreadcrumbPath = (
  manager: LfFrameworkInterface,
  dataset: LfDataDataset | undefined,
  currentNodeId?: string,
  showRoot: boolean = true,
): LfDataNode[] => {
  if (!dataset?.nodes?.length) {
    return [];
  }

  const targetId = currentNodeId ?? dataset.nodes[0]?.id;
  const resolved = manager.data.node.resolveTargets(dataset, targetId ?? null);
  const targetNode = resolved.nodes[0] ?? dataset.nodes[0];

  if (!targetNode) {
    return showRoot ? dataset.nodes.slice(0, 1) : [];
  }

  const ancestors: LfDataNode[] = [];
  let cursor: LfDataNode | null = targetNode;

  while (cursor) {
    ancestors.unshift(cursor);
    const parent = manager.data.node.getParent(dataset.nodes, cursor);
    cursor = parent ?? null;
  }

  return showRoot ? ancestors : ancestors.slice(1);
};
//#endregion

//#region truncateBreadcrumbPath
export const truncateBreadcrumbPath = (
  path: LfDataNode[],
  maxItems?: number,
): Array<LfDataNode | LfBreadcrumbsRenderable> => {
  const limit = Number(maxItems);
  if (!limit || Number.isNaN(limit) || path.length <= limit) {
    return path;
  }

  if (limit <= 1) {
    return [path[path.length - 1]];
  }

  if (limit === 2) {
    return [path[0], path[path.length - 1]];
  }

  const tail = path.slice(-(limit - 2));
  return [path[0], { isTruncation: true }, ...tail];
};
//#endregion

//#region isTruncation
export const isTruncation = (
  entry: LfDataNode | LfBreadcrumbsRenderable,
): entry is { isTruncation: true } => {
  return !!(entry as { isTruncation?: boolean }).isTruncation;
};
//#endregion
