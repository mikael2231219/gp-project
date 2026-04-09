import { rm, cp } from "node:fs/promises";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

const OUT_DIR = "dist";

// Clean dist/
await rm(OUT_DIR, { recursive: true, force: true });

// PostCSS plugin for Tailwind v4
const postcssPlugin = {
  name: "postcss-tailwind",
  setup(build: any) {
    build.onLoad({ filter: /\.css$/ }, async (args: { path: string }) => {
      const input = await Bun.file(args.path).text();
      const result = await postcss([tailwindcss(), autoprefixer()]).process(
        input,
        { from: args.path }
      );
      return { contents: result.css, loader: "css" };
    });
  },
};

console.log("Building for production...");

const result = await Bun.build({
  entrypoints: ["./src/main.jsx"],
  outdir: OUT_DIR,
  plugins: [postcssPlugin],
  minify: true,
  define: { "process.env.NODE_ENV": '"production"' },
  naming: "[name]-[hash].[ext]",
});

if (!result.success) {
  result.logs.forEach((log) => console.error(log));
  process.exit(1);
}

// Resolve output file names for HTML injection
const jsOut = result.outputs.find((o) => o.path.endsWith(".js"));
const cssOut = result.outputs.find((o) => o.path.endsWith(".css"));
const jsFile = jsOut?.path.split("/").pop() ?? "main.js";
const cssFile = cssOut?.path.split("/").pop() ?? "main.css";

// Copy public/ and src/assets/
try {
  await cp("./public", OUT_DIR, { recursive: true });
} catch {}
try {
  await cp("./src/assets", `${OUT_DIR}/src/assets`, { recursive: true });
} catch {}

// Generate index.html with hashed asset references
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/src/assets/favicons/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/src/assets/favicons/favicon.svg" />
    <link rel="shortcut icon" href="/src/assets/favicons/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/src/assets/favicons/apple-touch-icon.png" />
    <link rel="manifest" href="/src/assets/favicons/site.webmanifest" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Truth Initiative</title>
    <link rel="stylesheet" href="/${cssFile}" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/${jsFile}"></script>
  </body>
</html>`;

await Bun.write(`${OUT_DIR}/index.html`, html);

console.log(`\nBuilt to ${OUT_DIR}/`);
result.outputs.forEach((o) => {
  const name = o.path.split("/").pop();
  const kb = (o.size / 1024).toFixed(1);
  console.log(`  ${name} (${kb} kB)`);
});
