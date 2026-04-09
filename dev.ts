import { watch } from "node:fs";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

const PORT = 5173;
const OUT_DIR = ".bun-dev";

// Bun build plugin: run CSS through PostCSS + Tailwind v4
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

// SSE clients for live reload
const clients = new Set<ReadableStreamDefaultController>();

function notifyReload() {
  for (const ctrl of clients) {
    try {
      ctrl.enqueue("data: reload\n\n");
    } catch {
      clients.delete(ctrl);
    }
  }
}

async function build() {
  const result = await Bun.build({
    entrypoints: ["./src/main.jsx"],
    outdir: OUT_DIR,
    plugins: [postcssPlugin],
    define: { "process.env.NODE_ENV": '"development"' },
    sourcemap: "inline",
    naming: "[name].[ext]",
  });
  if (!result.success) {
    result.logs.forEach((log) => console.error(log));
  }
}

const HTML = `<!doctype html>
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
    <link rel="stylesheet" href="/__dev/main.css" />
    <script>
      const sse = new EventSource('/__live');
      sse.onmessage = () => location.reload();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/__dev/main.js"></script>
  </body>
</html>`;

// Initial build
console.log("Building...");
await build();
console.log(`\n  Dev server running at http://localhost:${PORT}\n`);

// Watch src/ for changes (debounced)
let timer: ReturnType<typeof setTimeout> | null = null;
watch("./src", { recursive: true }, () => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(async () => {
    await build();
    notifyReload();
    console.log(`[${new Date().toLocaleTimeString()}] Rebuilt`);
  }, 80);
});

Bun.serve({
  port: PORT,
  async fetch(req) {
    const { pathname } = new URL(req.url);

    // Live reload SSE endpoint
    if (pathname === "/__live") {
      let ctrl!: ReadableStreamDefaultController;
      const stream = new ReadableStream({
        start(c) {
          ctrl = c;
          clients.add(c);
        },
        cancel() {
          clients.delete(ctrl);
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Dev-built assets (JS + CSS)
    if (pathname.startsWith("/__dev/")) {
      const file = Bun.file(`${OUT_DIR}/${pathname.slice(7)}`);
      if (await file.exists()) return new Response(file);
    }

    // Source assets (favicons, images)
    if (pathname.startsWith("/src/")) {
      const file = Bun.file("." + pathname);
      if (await file.exists()) return new Response(file);
    }

    // Public directory
    const pub = Bun.file("./public" + pathname);
    if (await pub.exists()) return new Response(pub);

    // SPA fallback
    return new Response(HTML, { headers: { "Content-Type": "text/html" } });
  },
});
