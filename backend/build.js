import * as esbuild from "esbuild";

const settings = {
  entryPoints: ["src/index.ts"],
  minify: true,
  bundle: true,
  platform: "node",
  target: "node25",
  outfile: "dist/bundle.js",
};

await esbuild.build(settings);
