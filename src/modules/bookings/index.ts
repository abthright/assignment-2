import { Hono } from "hono";
import { prisma } from "@/src/utils/prisma";
import { CreateBookingSchema } from "@/src/utils/zodSchemas";
import { zValidator } from "@hono/zod-validator";
import { create } from "node:domain";

const app = new Hono();

app
  .get("/", async (c) => {
    const data = await prisma.booking.findMany();
    return c.json(data);
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const data = await prisma.booking.findUnique({
      where: {
        id: Number(id),
      },
    });
    return c.json(data);
  })
  .post("/", zValidator("json", CreateBookingSchema), async (c) => {
    const data = await c.req.valid("json");
    // many to many post booking
    const booking = await prisma.booking.create({
      data: {
        status: data.status,
        ownerId: data.ownerId,
        tickets: {},
      },
    });
    console.log(`created booking: ${booking.id}`);
    return c.json({ message: `successfully added ${booking.id}` });
  })
  .patch("/:id", zValidator("json", CreateBookingSchema), async (c) => {
    const id = c.req.param("id");
    const data = await c.req.valid("json");
    const updateBooking = await prisma.booking.update({
      where: {
        id: Number(id),
      },
      data: data,
    });
    console.log(`updated booking: ${updateBooking.id}`);
    return c.json({ message: `successfully updated to ${updateBooking.id}` });
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    const deletedBooking = await prisma.booking.delete({
      where: {
        id: Number(id),
      },
    });
    console.log(`deleted event: ${deletedBooking.id}`);
    return c.json({ message: `successfully deleted ${deletedBooking.id}` });
  });

export default app;
