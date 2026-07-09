const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.argv[2];
const port = Number(process.argv[3] || 8799);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

http
  .createServer((req, res) => {
    try {
      const urlPath = decodeURIComponent(new URL(req.url, `http://127.0.0.1:${port}`).pathname);
      const relativePath = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
      const filePath = path.resolve(root, relativePath);
      const rootPath = path.resolve(root);

      if (!filePath.startsWith(rootPath) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
      }

      const stream = fs.createReadStream(filePath);
      stream.on("error", () => {
        if (!res.headersSent) res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Server error");
      });
      res.writeHead(200, { "Content-Type": mime[path.extname(filePath).toLowerCase()] || "application/octet-stream" });
      stream.pipe(res);
    } catch (error) {
      if (!res.headersSent) res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Server error");
      console.error(error);
    }
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Serving ${root} at http://127.0.0.1:${port}/`);
  });
