import { serve } from "@hono/node-server";
import api from "@/src/routes/index";
import { prisma } from "./utils/prisma";
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

app.route("/api", api);

app.get("/", (c)=>{
  return c.text("move on to /api")
})

const server = serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

const shutdown = async () => {
  try {
    server.close();
    await prisma.$disconnect();
  } catch (err) {
    console.error(err);
  }
};

// graceful shutdown
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
