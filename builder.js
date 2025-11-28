const fs = require("fs");
const { plsParseArgs } = require("plsargs");
const esbuild = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");
const package = require("./package.json");

const args = plsParseArgs(process.argv.slice(2));

const config = {
  entryPoints: [args.get("file")],
  bundle: true,
  minify: true,
  outfile: args.get("outfile"),
  platform: "browser",
  format: "iife",
  plugins: [
    sassPlugin({
      type: "style"
    })
  ]
};

(async () => {
  if (!args.has("watch")) {
    console.log("Building...");
    esbuild.build(config).then(appendHead);
  } else {
    console.log("Watching...");
    const ctx = await esbuild.context({
      ...config,
      plugins: [
        ...config.plugins,
        {
          name: "append-head",
          setup(build) {
            build.onEnd(appendHead);
          }
        }
      ]
    });
    ctx.watch();
  }
})();

function appendHead() {
  const outPath = args.get("outfile");
  let content = fs.readFileSync(outPath, "utf8");
  content = `// ==UserScript==
// @name        ${args.get("name")} 
// @namespace   ${args.get("namespace")}
// @match       ${args.get("match")}
// @grant       GM_getValue
// @grant       GM_setValue
// @version     ${package.version}
// @author      TheArmagan
// @license     GPL-3.0-only
// @description ${new Date().toISOString()}
// ==/UserScript==\n${content}`;
  fs.writeFileSync(outPath, content);
  console.log(`[${new Date().toLocaleString()}] Built ${outPath}`);
}

