const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "style");

const destDir = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "showcase",
  "src",
  "style",
);

fs.mkdir(destDir, { recursive: true }, (mkdirErr) => {
  if (mkdirErr) {
    console.error("Error creating destination directory:", mkdirErr);
    return;
  }

  if (typeof fs.cp === "function") {
    fs.cp(sourceDir, destDir, { recursive: true }, (cpErr) => {
      if (cpErr) {
        console.error("Error copying SASS files:", cpErr);
      } else {
        console.log("SASS mixins and variables copied successfully.");
      }
    });
  } else {
    // Fallback for older Node versions
    copyFolderRecursive(sourceDir, destDir, (copyErr) => {
      if (copyErr) {
        console.error("Error copying SASS files recursively:", copyErr);
      } else {
        console.log(
          "SASS mixins and variables copied successfully (recursive fallback).",
        );
      }
    });
  }
});

function copyFolderRecursive(src, dest, callback) {
  fs.readdir(src, { withFileTypes: true }, (err, entries) => {
    if (err) return callback(err);
    let pending = entries.length;
    if (!pending) return callback();
    entries.forEach((entry) => {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        fs.mkdir(destPath, { recursive: true }, (err) => {
          if (err) return callback(err);
          copyFolderRecursive(srcPath, destPath, (err) => {
            if (err) return callback(err);
            if (!--pending) callback();
          });
        });
      } else {
        fs.copyFile(srcPath, destPath, (err) => {
          if (err) return callback(err);
          if (!--pending) callback();
        });
      }
    });
  });
}
