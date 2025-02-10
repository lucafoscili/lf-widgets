const fs = require("fs");
const path = require("path");

const dist = path.resolve(__dirname, "../dist");

function clean() {
  if (fs.existsSync(dist)) {
    fs.rmSync(dist, { recursive: true, force: true });
    console.log("✅ Cleaned Core dist");
  }

  console.log("✨ Core successfully cleaned!");
}

clean();
