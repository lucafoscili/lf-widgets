const fs = require("fs");
const path = require("path");

// Path to the source SASS style folder in the components package
const sourceDir = path.join(__dirname, "..", "style");

// Path to the destination folder in the showcase package
const destDir = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "showcase",
  "src",
  "style",
);

// Ensure the destination directory exists
fs.mkdir(destDir, { recursive: true }, (mkdirErr) => {
  if (mkdirErr) {
    console.error("Error creating destination directory:", mkdirErr);
    return;
  }

  // If Node.js supports fs.cp (v16+), use it for a simple recursive copy.
  if (typeof fs.cp === "function") {
    fs.cp(sourceDir, destDir, { recursive: true }, (cpErr) => {
      if (cpErr) {
        console.error("Error copying SASS files:", cpErr);
      } else {
        console.log(
          "SASS mixins and variables copied successfully using fs.cp.",
        );
      }
    });
  } else {
    // Fallback for older Node versions: use a recursive copy function.
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

// Fallback recursive copy function for older Node versions
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
