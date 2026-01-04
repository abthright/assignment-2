import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "./dist" }));
app.get(
  "*",
  serveStatic({
    path: "./dist/index.html",
  }),
);

export default app;
