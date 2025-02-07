const fs = require("fs");
const path = require("path");

const subRepos = [
  "../packages/core",
  "../packages/react-core",
  "../packages/foundations",
  "../packages/framework",
  "../packages/showcase",
  "../packages/react-showcase",
];

function cleanSubRepos() {
  subRepos.forEach((subRepo) => {
    const nodeModulesPath = path.resolve(__dirname, subRepo, "node_modules");
    const distPath = path.resolve(__dirname, subRepo, "dist");

    try {
      fs.rmSync(nodeModulesPath, { recursive: true });
      console.log(`✅ Removed ${nodeModulesPath}`);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log(`🚫 ${nodeModulesPath} does not exist, skipping...`);
        return;
      } else {
        console.error(`❌ Failed to remove ${nodeModulesPath}:`, error.message);
      }
    }

    try {
      fs.rmSync(distPath, { recursive: true });
      console.log(`✅ Removed ${distPath}`);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log(`🚫 ${distPath} does not exist, skipping...`);
        return;
      } else {
        console.error(`❌ Failed to remove ${distPath}:`, error.message);
      }
    }
  });

  console.log("✨ All sub-repositories cleaned!");
}

const nodeModulesPath = path.resolve(__dirname, "../node_modules");

try {
  fs.rmSync(nodeModulesPath, { recursive: true });
  console.log(`✅ Removed ${nodeModulesPath}`);
} catch (error) {
  if (error.code === "ENOENT") {
    console.log(`🚫 ${nodeModulesPath} does not exist, skipping...`);
    return;
  } else {
    console.error(`❌ Failed to remove ${nodeModulesPath}:`, error.message);
  }
}

cleanSubRepos();
