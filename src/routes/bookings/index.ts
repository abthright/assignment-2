import { Hono } from "hono";
import { prisma } from "@/src/utils/prisma";
import { CreateBookingSchema } from "@/src/utils/zodSchemas";
import { zValidator } from "@hono/zod-validator";
import { validationGuard } from "@/src/utils/exceptions";

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
  .post(
    "/",
    zValidator("json", CreateBookingSchema, validationGuard),
    async (c) => {
      const data = await c.req.valid("json");
      // many to many post booking
      const booking = await prisma.booking.create({
        data: {
          owner: {
            connect: {
              id: data.ownerId,
            },
          },
          tickets: {
            create: data.tickets.map((t) => ({
              ticket: {
                connect: {
                  id: t.ticketId,
                },
              },
              quantity: t.quantity,
              price: 0, //TODO : dynamic price
            })),
          },
        },
        include: {
          tickets: true,
        },
      });
      console.log(`created booking: ${booking.id}`);
      return c.json({ message: `successfully added ${booking.id}` });
    },
  )
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    const cancelBooking = await prisma.booking.update({
      where: {
        id: Number(id),
      },
      data: {
        status: "CANCELLED",
      },
    });

    const cancelledTicketJoin = await prisma.bookingTicketJoin.findMany({
      where: {
        bookingId: cancelBooking.id,
      },
      select: {
        ticketId: true,
      },
    });

    //this was my first approach, gonna keep it for trophy
    const cancelledTicket = await Promise.all(
      cancelledTicketJoin.map(async (t) => {
        const data = await prisma.ticket.findUnique({
          where: {
            id: t.ticketId,
          },
        });

        return data?.name;
      }),
    );

    //new approach, i chat with gpt
    const cancelledTicketData = await prisma.ticket.findMany({
      where: {
        id: {
          in: await cancelledTicketJoin.map((t) => t.ticketId),
        },
      },
      select: {
        name: true,
      },
    });

    console.log(`cancelled booking: ${cancelBooking.id}`);
    return c.json({
      message: `successfully cancelled booking:${cancelBooking.id} for ticket: ${cancelledTicketData.map((t) => t.name).join(" & ")}`,
    });
  });

export default app;
