import { Hono } from "hono";
import { prisma } from "@/src/utils/prisma";
import { CreateEventSchema } from "@/src/utils/zodSchemas";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

app
  .get("/", async (c) => {
    const data = await prisma.event.findMany();
    return c.json(data);
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const data = await prisma.event.findUnique({
      where: {
        id: Number(id),
      },
    });
    return c.json(data);
  })
  .post("/", zValidator("json", CreateEventSchema), async (c) => {
    const data = await c.req.valid("json");
    const event = await prisma.event.create({
      data: data,
    });
    console.log(`created event: ${event.name}`);
    return c.json({ message: `successfully added ${event.name}` });
  })
  .patch("/:id", zValidator("json", CreateEventSchema), async (c) => {
    const id = c.req.param("id");
    const data = await c.req.valid("json");
    const updateEvent = await prisma.event.update({
      where: {
        id: Number(id),
      },
      data: data,
    });
    console.log(`updated event: ${updateEvent.name}`);
    return c.json({ message: `successfully updated to ${updateEvent.name}` });
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    // TODO : Deleting event shouldn't be allowed if booking exist
    const deletedEvent = await prisma.event.delete({
      where: {
        id: Number(id),
      },
    });
    console.log(`deleted event: ${deletedEvent.name}`);
    return c.json({ message: `successfully deleted ${deletedEvent.name}` });
  });

export default app;
