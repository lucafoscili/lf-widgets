const fs = require("fs");
const path = require("path");

//  "clean": "node -e \"require('fs').rmSync('./dist', { recursive: true, force: true })\" && node -e \"require('fs').rmSync('.components.ts', { recursive: true, force: true })\""
const dist = path.resolve(__dirname, "../dist");
const components = path.resolve(__dirname, "../.components.ts");

// Function to clean the showcase
function clean() {
  if (fs.existsSync(dist)) {
    fs.rmSync(dist, { recursive: true, force: true });
    console.log("✅ Cleaned Showcase dist");
  }

  if (fs.existsSync(components)) {
    fs.rmSync(components, { recursive: true, force: true });
    console.log("✅ Cleaned Showcase components");
  }

  console.log("✨ Showcase successfully cleaned!");
}

clean();
