const fs = require("fs");
const { plsParseArgs } = require("plsargs");
const esbuild = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");
const sveltePlugin = require("esbuild-svelte");
const sveltePreprocess = require("svelte-preprocess");
const package = require("./package.json");

const args = plsParseArgs(process.argv.slice(2));

const useSvelte = args.has("svelte");
const useTailwind = args.has("tailwind");

const plugins = [
  sassPlugin({
    type: "style"
  })
];

if (useTailwind) {
  const tailwindcss = require("@tailwindcss/postcss");
  const autoprefixer = require("autoprefixer");
  const postcss = require("postcss");

  plugins.unshift({
    name: "tailwind",
    setup(build) {
      build.onLoad({ filter: /\.css$/ }, async (args) => {
        const css = fs.readFileSync(args.path, "utf8");
        const result = await postcss([tailwindcss, autoprefixer]).process(css, {
          from: args.path
        });
        // CSS'i inline style olarak inject et
        const escapedCss = result.css.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
        return {
          contents: `
            (function() {
              const style = document.createElement('style');
              style.textContent = \`${escapedCss}\`;
              document.head.appendChild(style);
            })();
          `,
          loader: "js"
        };
      });
    }
  });
}

if (useSvelte) {
  plugins.unshift(
    sveltePlugin({
      preprocess: sveltePreprocess({
        postcss: useTailwind ? {
          plugins: [require("@tailwindcss/postcss"), require("autoprefixer")]
        } : false
      }),
      compilerOptions: {
        css: "injected"
      }
    })
  );
}

const config = {
  entryPoints: [args.get("file")],
  bundle: true,
  minify: true,
  outfile: args.get("outfile"),
  platform: "browser",
  format: "iife",
  plugins
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
// @grant       GM_xmlhttpRequest
// @grant       GM_webRequest
// @grant       unsafeWindow
// @connect     *
// @version     ${package.version}
// @author      TheArmagan
// @license     GPL-3.0-only
// @description ${new Date().toISOString()}
// ==/UserScript==\n${content}`;
  fs.writeFileSync(outPath, content);
  console.log(`[${new Date().toLocaleString()}] Built ${outPath}`);
}

