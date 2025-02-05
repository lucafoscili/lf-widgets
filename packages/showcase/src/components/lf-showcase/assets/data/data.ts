import { LfArticleDataset } from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { PARAGRAPH_FACTORY } from "../../helpers/doc.paragraph";
import { LfShowcaseFixture } from "../../lf-showcase-declarations";

const FRAMEWORK_NAME = "Data";

export const getDataFixtures = (): LfShowcaseFixture => {
  //#region example map
  const CODE = new Map<string, { code: string; description: string }>([
    [
      "cell.exists",
      {
        code: `core.data.cell.exists(node); 
// Checks if a cell exists in the given node`,
        description:
          "The `cell.exists` method checks if a cell exists in the given node.",
      },
    ],
    [
      "cell.shapes.getAll",
      {
        code: `core.data.cell.shapes.getAll(dataset); 
// Retrieves all shapes from a dataset`,
        description: "This method retrieves all shapes from a dataset.",
      },
    ],
    [
      "cell.shapes.get",
      {
        code: `core.data.cell.shapes.get(cell); 
// Retrieves a shape from a cell`,
        description: "This method retrieves a shape from a cell.",
      },
    ],
    [
      "cell.stringify",
      {
        code: `core.data.cell.stringify(value); 
// Converts a cell value to string`,
        description: "This method converts a cell value to a string.",
      },
    ],
    [
      "column.find",
      {
        code: `core.data.column.find(dataset, filters); 
// Searches for columns in a dataset based on given filters`,
        description:
          "This method searches for columns in a dataset based on given filters.",
      },
    ],
    [
      "node.findNodeByCell",
      {
        code: `core.data.node.findNodeByCell(dataset, cell); 
// Finds a node by cell reference`,
        description: "This method finds a node by cell reference.",
      },
    ],
    [
      "node.exists",
      {
        code: `core.data.node.exists(dataset); 
// Checks if a node exists in the dataset`,
        description:
          "The `node.exists` method checks if a node exists in the dataset.",
      },
    ],
    [
      "node.filter",
      {
        code: `core.data.node.filter(dataset, filters); 
// Filters nodes based on given criteria`,
        description:
          "The `node.filter` method filters nodes based on given criteria.",
      },
    ],
    [
      "node.fixIds",
      {
        code: `core.data.node.fixIds(nodes); 
// Fixes/normalizes node IDs`,
        description: "The `node.fixIds` method fixes/normalizes node IDs.",
      },
    ],
    [
      "node.getDrilldownInfo",
      {
        code: `core.data.node.getDrilldownInfo(nodes); 
// Retrieves drilldown information from nodes`,
        description:
          "The `node.getDrilldownInfo` method retrieves drilldown information from nodes.",
      },
    ],
    [
      "node.getParent",
      {
        code: `core.data.node.getParent(nodes, child); 
// Gets the parent node of a given child node`,
        description:
          "The `node.getParent` method gets the parent node of a given child node.",
      },
    ],
    [
      "node.pop",
      {
        code: `core.data.node.pop(nodes, node2remove); 
// Removes a specific node from the node structure`,
        description:
          "The `node.pop` method removes a specific node from the node structure.",
      },
    ],
    [
      "node.setProperties",
      {
        code: `core.data.node.setProperties(nodes, properties); 
// Sets properties on nodes`,
        description:
          "The `node.setProperties` method sets properties on nodes.",
      },
    ],
    [
      "node.toStream",
      {
        code: `core.data.node.toStream(nodes); 
// Converts nodes structure to a stream format`,
        description:
          "The `node.toStream` method converts nodes structure to a stream format.",
      },
    ],
  ]);
  //#endregion

  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: FRAMEWORK_NAME,
        children: [
          {
            id: DOC_IDS.section,
            value: "Overview",
            children: [
              {
                children: [
                  {
                    id: DOC_IDS.content,
                    tagName: "strong",
                    value: "LfData",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      " is a class for managing data operations and structures. It provides utilities for handling cells, columns, and nodes within datasets of the library.",
                  },
                ],
                id: DOC_IDS.paragraph,
                value: "",
              },
            ],
          },
          {
            id: DOC_IDS.section,
            value: "API",
            children: Array.from(CODE.keys()).map((key) =>
              PARAGRAPH_FACTORY.api(
                key,
                CODE.get(key)?.description ?? "",
                CODE.get(key)?.code ?? "",
              ),
            ),
          },
        ],
      },
    ],
  };
  //#endregion

  return {
    documentation,
  };
};
