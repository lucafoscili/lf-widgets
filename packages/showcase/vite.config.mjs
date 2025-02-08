import { defineConfig } from "vite";
import { resolve } from "path";

const assets = resolve(__dirname, "../assets");
const core = resolve(__dirname, "../core/dist/esm/lf-core.js");
const framework = resolve(__dirname, "../framework/dist/index.js");
const foundations = resolve(__dirname, "../foundations/dist/index.js");
const showcase = resolve(__dirname, "../showcase/dist/esm/lf-showcase.js");

export default defineConfig({
  resolve: {
    alias: {
      "@lf-widgets/assets": assets,
      "@lf-widgets/core": core,
      "@lf-widgets/foundations": foundations,
      "@lf-widgets/framework": framework,
      "@lf-widgets/showcase": showcase,
    },
  },
  publicDir: resolve(__dirname, ".."),
  root: resolve(__dirname, "src"),
  server: {
    open: true,
    port: 3333,
  },
});
