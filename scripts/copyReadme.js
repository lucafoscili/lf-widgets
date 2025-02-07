const fs = require("fs");
const path = require("path");

const rootReadmePath = path.resolve(__dirname, "../README.md");

const subRepos = [
  "../packages/assets",
  "../packages/core",
  "../packages/react-core",
  "../packages/foundations",
  "../packages/framework",
  "../packages/showcase",
  "../packages/react-showcase",
];

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

copyReadmeToSubRepos();
