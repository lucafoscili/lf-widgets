const fs = require("fs");
const path = require("path");

const sourceDir = path.resolve(__dirname, "../../hydrate-tmp");
const targetDir = path.resolve(__dirname, "../../../hydrate");
const packageJsonPath = path.join(targetDir, "package.json");

// Define a fallback package.json template (used only if it doesn't already exist)
const packageJsonTemplate = {
  name: "@lf-widgets/hydrate",
  version: "0.0.0",
  description: "LF Widgets - Hydrate script for SSR.",
  main: "./index.cjs.js",
  module: "./index.mjs",
  types: "./index.d.ts",
  files: ["*.js", "*.mjs", "*.d.ts"],
  dependencies: {},
  license: "Apache-2.0",
};

// Ensure the target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Preserve or create package.json
if (!fs.existsSync(packageJsonPath)) {
  console.log(
    "🆕 No package.json found in hydrate target. Creating a new one.",
  );
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJsonTemplate, null, 2),
  );
} else {
  console.log("🔄 Preserving existing package.json in hydrate target.");
}

// Copy files from sourceDir to targetDir
function copyFiles(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
      }
      copyFiles(srcPath, destPath);
    } else {
      // Skip overwriting the package.json
      if (entry.name === "package.json") continue;
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Clean target directory before syncing, but preserve package.json
const preservePackageJson = fs.existsSync(packageJsonPath)
  ? fs.readFileSync(packageJsonPath)
  : null;
if (fs.existsSync(targetDir)) {
  fs.rmSync(targetDir, { recursive: true });
  fs.mkdirSync(targetDir, { recursive: true });
}
if (preservePackageJson) {
  fs.writeFileSync(packageJsonPath, preservePackageJson);
}

// Sync the files
copyFiles(sourceDir, targetDir);
fs.rmSync(sourceDir, { recursive: true });

console.log("✅ Hydrate package synced successfully, preserving package.json!");
