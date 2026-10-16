import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const port = Number(process.env.PORT || 4173);
// Serve exactly the base path recorded in the built artifact, including overrides.
const html = await readFile(path.join(root, "index.html"), "utf8");
const basePath = html.match(/<base href="([^"]+)">/)?.[1] || "/";
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const requested = decodeURIComponent(url.pathname);
    if (
      basePath !== "/" &&
      (requested === "/" || requested === basePath.slice(0, -1))
    ) {
      res.writeHead(302, { Location: basePath + url.search });
      res.end();
      return;
    }
    if (!requested.startsWith(basePath)) throw new Error("Not found");
    const relative = requested.slice(basePath.length);
    const file = path.resolve(root, relative || "index.html");
    if (!file.startsWith(root) || !(await stat(file)).isFile())
      throw new Error("Not found");
    res.writeHead(200, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
}).listen(port, "127.0.0.1", () =>
  console.log(
    `Local-only WebHub preview listening on port ${port} at ${basePath}`,
  ),
);
