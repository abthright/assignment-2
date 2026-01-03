import { serve } from "@hono/node-server";
import app from "@/src/modules/index";
import { prisma } from "./utils/prisma";

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
