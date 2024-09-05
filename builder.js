const fs = require("fs");
const { plsParseArgs } = require("plsargs");
const esbuild = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");
const package = require("./package.json");

const args = plsParseArgs(process.argv.slice(2));

esbuild.build({
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
}).then(() => {
  const outPath = args.get("outfile");
  let content = fs.readFileSync(outPath, "utf8");
  content = `// ==UserScript==
// @name        ${args.get("name")} 
// @namespace   ${args.get("namespace")}
// @match       ${args.get("match")}
// @grant       none
// @version     ${package.version}
// @author      TheArmagan
// @description ${new Date().toISOString()}
// ==/UserScript==\n${content}`;
  fs.writeFileSync(outPath, content);
});

