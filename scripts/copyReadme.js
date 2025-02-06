const fs = require("fs");
const path = require("path");

// Root README path
const rootReadmePath = path.resolve(__dirname, "../README.md");

// Sub-repositories relative to the project root
const subRepos = [
  "../packages/assets",
  "../packages/components",
  "../packages/core",
  "../packages/foundations",
  "../packages/hydrate",
  "../packages/react",
  "../packages/react-ssr",
  "../packages/showcase",
  "../packages/showcase-react",
];

// Function to copy README.md
function copyReadmeToSubRepos() {
  if (!fs.existsSync(rootReadmePath)) {
    console.error("❌ Root README.md not found!");
    process.exit(1);
  }

  subRepos.forEach((subRepo) => {
    const destPath = path.resolve(__dirname, subRepo, "README.md");

    try {
      fs.copyFileSync(rootReadmePath, destPath);
      console.log(`✅ Copied README.md to ${subRepo}`);
    } catch (error) {
      console.error(
        `❌ Failed to copy README.md to ${subRepo}:`,
        error.message,
      );
    }
  });

  console.log("✨ README.md successfully propagated to all sub-repositories!");
}

// Run the script
copyReadmeToSubRepos();
