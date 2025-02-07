const fs = require("fs");
const path = require("path");

const dist = path.resolve(__dirname, "../dist");

function clean() {
  if (fs.existsSync(dist)) {
    fs.rmSync(dist, { recursive: true, force: true });
    console.log("✅ Cleaned Showcase (react) dist");
  }

  console.log("✨ Showcase (react) successfully cleaned!");
}

clean();
