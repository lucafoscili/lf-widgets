const fs = require("fs");
const path = require("path");
const prettier = require("prettier");

const inputFilePath = path.join(__dirname, "..", "..", "doc.json");

const outputFilePath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "showcase",
  "src",
  "components",
  "lf-showcase",
  "assets",
  "doc.ts",
);

fs.readFile(inputFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const jsonData = JSON.parse(data);
  const processedData = {};
  const components = jsonData.components;
  Object.keys(components).forEach((key) => {
    const component = components[key];
    const tag = component.tag;
    console.log("Processing " + tag + "...");

    processedData[tag] = {
      methods: [],
      props: [],
      styles: [],
    };

    component.methods.forEach((method) => {
      processedData[tag].methods.push({
        name: method.name,
        docs: method.docs,
        returns: method.returns,
        signature: method.complexType.signature,
        type: method.type,
      });
    });

    component.props.forEach((prop) => {
      processedData[tag].props.push({
        name: prop.name,
        docs: prop.docs,
        type: prop.type,
      });
    });

    component.styles.forEach((style) => {
      processedData[tag].styles.push({
        name: style.name,
        docs: style.docs,
      });
    });
  });

  fs.writeFile(
    outputFilePath,
    `import { LfShowcaseDoc } from "../lf-showcase-declarations"; export const LF_DOC : LfShowcaseDoc = ${JSON.stringify(
      processedData,
      null,
      2,
    )};`,
    "utf8",
    async (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("Documentation generated successfully.");

        fs.readFile(outputFilePath, "utf8", async (readErr, data) => {
          if (readErr) {
            console.error("Error reading file after writing:", readErr);
            return;
          }

          try {
            const formattedContent = await prettier.format(data, {
              parser: "typescript",
            });

            fs.writeFile(
              outputFilePath,
              formattedContent,
              "utf8",
              (writeErr) => {
                if (writeErr) {
                  console.error(
                    "Error re-writing file after formatting:",
                    writeErr,
                  );
                } else {
                  console.log("File formatted and saved successfully.");
                }
              },
            );
          } catch (formattingErr) {
            console.error("Error formatting file content:", formattingErr);
          }
        });
      }
    },
  );
});
