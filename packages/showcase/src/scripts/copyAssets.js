const fs = require("fs");
const path = require("path");
//packages\assets\assets assetsSourcePath
const assetsSourcePath = path.resolve("../../packages/assets");
const showcaseAssetsPath = path.resolve(__dirname, "../assets");

// Subdirectories to copy
const assetFolders = ["fonts", "showcase", "svg"];

if (!fs.existsSync(showcaseAssetsPath)) {
  fs.mkdirSync(showcaseAssetsPath, { recursive: true });
}

// Function to copy assets recursively
function copyAssets() {
  assetFolders.forEach((folder) => {
    const sourceFolder = path.join(assetsSourcePath, folder);
    const targetFolder = path.join(showcaseAssetsPath, folder);

    if (!fs.existsSync(sourceFolder)) {
      console.warn(`⚠️  Source folder does not exist: ${sourceFolder}`);
      return;
    }

    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    fs.readdirSync(sourceFolder).forEach((file) => {
      const sourceFile = path.join(sourceFolder, file);
      const targetFile = path.join(targetFolder, file);

      try {
        fs.copyFileSync(sourceFile, targetFile);
        console.log(`✅ Copied ${file} to ${targetFolder}`);
      } catch (error) {
        console.error(
          `❌ Failed to copy ${file} to ${targetFolder}:`,
          error.message,
        );
      }
    });
  });

  console.log("✨ Assets successfully copied to Showcase!");
}

copyAssets();
