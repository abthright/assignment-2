import { Hono } from "hono";
import { prisma } from "@/src/server/utils/prisma";
import * as z from "zod";
import { zValidator } from "@hono/zod-validator";
import {
  CreateTicketSchema,
  UpdateTicketSchema,
} from "@/src/server/utils/zodSchemas";
import { validationGuard } from "@/src/server/utils/exceptions";

const app = new Hono();

app
  .get("/", async (c) => {
    const data = await prisma.ticket.findMany();
    return c.json(data);
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const data = await prisma.ticket.findUnique({
      where: {
        id: Number(id),
      },
    });
    return c.json(data);
  })
  .post(
    "/",
    zValidator("json", CreateTicketSchema, validationGuard),
    async (c) => {
      const data = await c.req.valid("json");
      const event = await prisma.ticket.create({
        data: {
          name: data.name,
          desc: data.desc ? data.desc : "",
          type: data.type ? data.type : "",
          price: data.price ? data.price : 0,
          availability: data.availability ? data.availability : 0,
          eventId: data.eventId ? data.eventId : 0,
        },
      });
      console.log(`created event: ${event.name}`);
      return c.json({ message: `successfully added ${event.name}` });
    },
  )
  .patch(
    "/:id",
    zValidator("json", UpdateTicketSchema, validationGuard),
    async (c) => {
      const id = c.req.param("id");
      const data = await c.req.valid("json");
      const updateTicket = await prisma.ticket.update({
        where: {
          id: Number(id),
        },
        data: data,
      });
      console.log(`updated ticket: ${updateTicket.name}`);
      return c.json({
        message: `successfully updated to ${updateTicket.name}`,
        update: updateTicket,
      });
    },
  )
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    const deletedTicket = await prisma.ticket.delete({
      where: {
        id: Number(id),
      },
    });
    console.log(`deleted ticket: ${deletedTicket.name}`);
    return c.json({ message: `successfully deleted ${deletedTicket.name}` });
  });

export default app;
