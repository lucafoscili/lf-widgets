const fs = require("fs");
const path = require("path");

const showcaseAssetsPath = path.resolve(__dirname, "../assets");
const distPath = path.resolve(__dirname, "../dist");

// Function to clean the showcase
function clean() {
  if (fs.existsSync(showcaseAssetsPath)) {
    fs.rmSync(showcaseAssetsPath, { recursive: true, force: true });
    console.log("✅ Cleaned Showcase assets");
  }

  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
    console.log("✅ Cleaned Showcase dist");
  }

  console.log("✨ Showcase successfully cleaned!");
}

clean();
