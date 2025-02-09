const fs = require("fs");
const path = require("path");

const depsKeys = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
  "peerDependenciesMeta",
];

const packageJsonPath = path.resolve(__dirname, "../../package.json");
const packageJson = require(packageJsonPath);

const version = packageJson.version;

const browseDeps = (deps) => {
  for (const dep in deps) {
    const v = deps[dep];
    if (v.includes("workspace:")) {
      console.log("Found workspace dependency: " + dep);
      deps[dep] = version;
    }
  }
};

for (const key of depsKeys) {
  browseDeps(packageJson[key]);
}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");

console.log("✅ Updated package.json!");
