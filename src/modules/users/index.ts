import { Hono } from "hono";
import { prisma } from "@/src/utils/prisma";
import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();
const userSchema = z.object({
  name: z.string(),
});

app
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const data = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    return c.json(data);
  })
  .post("/", zValidator("json", userSchema), async (c) => {
    const body = await c.req.valid("json");
    const user = await prisma.user.create({
      data: {
        name: body.name,
      },
    });
    console.log(`created user: ${user}`);
  });

export default app;
