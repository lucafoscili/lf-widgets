import {
  LfDataCell,
  LfDataColumn,
  LfDataDataset,
  LfDataNode,
  LfDataRandomDatasetOptions,
  LfDataShapes,
} from "@lf-widgets/foundations";
import { randomCellOfAnyShape } from "./fixtures.cell";
import { randomBoolean, randomNumber, randomString } from "./fixtures.helpers";

//#region Column
export function generateRandomColumns(columnCount = 3): LfDataColumn[] {
  const columns: LfDataColumn[] = [];
  for (let i = 0; i < columnCount; i++) {
    columns.push({
      id: `col-${i}-${randomString()}`, // or just `i`
      title: `Column ${i} - ${randomString()}`,
    });
  }
  return columns;
}
//#endregion

//#region Node
export function generateRandomNode(depth = 1, branchingFactor = 2): LfDataNode {
  const cellCount = randomNumber(1, 3);
  const cells: Record<string, LfDataCell<LfDataShapes>> = {};

  for (let i = 0; i < cellCount; i++) {
    const cellKey = `cell-${i}`;
    cells[cellKey] = randomCellOfAnyShape();
  }

  const node: LfDataNode = {
    id: "",
    value: randomNumber(0, 1000),
    isDisabled: randomBoolean(),
    description: `Node: ${randomString()}`,
    icon: undefined,
    cells,
  };

  if (depth > 0) {
    const childCount = Math.floor(Math.random() * branchingFactor);
    if (childCount > 0) {
      node.children = [];
      for (let j = 0; j < childCount; j++) {
        node.children.push(generateRandomNode(depth - 1, branchingFactor));
      }
    }
  }

  return node;
}
//#endregion

//#region Nodes
export function generateRandomNodes(
  nodeCount = 5,
  maxDepth = 2,
  branchingFactor = 2,
): LfDataNode[] {
  const nodes: LfDataNode[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const node = generateRandomNode(maxDepth, branchingFactor);
    nodes.push(node);
  }
  return nodes;
}
//#endregion

//#region Dataset

export function generateRandomDataset(
  options: LfDataRandomDatasetOptions = {},
): LfDataDataset {
  const {
    columnCount = 3,
    nodeCount = 5,
    maxDepth = 2,
    branchingFactor = 2,
  } = options;

  const columns = generateRandomColumns(columnCount);
  const nodes = generateRandomNodes(nodeCount, maxDepth, branchingFactor);

  return {
    columns,
    nodes,
  };
}
//#endregion
