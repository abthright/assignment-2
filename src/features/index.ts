import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "./src/dist" }));
app.get(
  "*",
  serveStatic({
    path: "./src/dist/index.html",
  }),
);

export default app;
