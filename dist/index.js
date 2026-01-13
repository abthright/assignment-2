import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as runtime from "@prisma/client/runtime/client";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import "@hono/node-server/serve-static";
const config = {
  "previewFeatures": [],
  "clientVersion": "7.2.0",
  "engineVersion": "0c8ef2ce45c83248ab3df073180d5eda9e8be7a3",
  "activeProvider": "sqlite",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\nenum BookingStatus {\n  PENDING\n  PAID\n  CANCELLED\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "sqlite"\n}\n\nmodel User {\n  id       Int       @id @default(autoincrement())\n  name     String\n  bookings Booking[]\n}\n\nmodel Event {\n  id        Int       @id @default(autoincrement())\n  name      String\n  desc      String?\n  dateStart DateTime?\n  dateEnd   DateTime?\n  tickets   Ticket[]\n}\n\nmodel Booking {\n  id        Int                 @id @default(autoincrement())\n  createdAt DateTime            @default(now())\n  status    BookingStatus       @default(PENDING)\n  updatedAt DateTime            @default(now()) @updatedAt\n  tickets   BookingTicketJoin[]\n  owner     User                @relation(fields: [ownerId], references: [id])\n  ownerId   Int\n}\n\nmodel Ticket {\n  id           Int                 @id @default(autoincrement())\n  bookings     BookingTicketJoin[]\n  event        Event               @relation(fields: [eventId], references: [id])\n  name         String\n  desc         String?\n  type         String?\n  price        Int?\n  availability Int\n  eventId      Int\n}\n\nmodel BookingTicketJoin {\n  bookingId Int\n  ticketId  Int\n  quantity  Int\n  price     Int\n\n  booking Booking @relation(fields: [bookingId], references: [id])\n  ticket  Ticket  @relation(fields: [ticketId], references: [id])\n\n  @@id([bookingId, ticketId])\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToUser"}],"dbName":null},"Event":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"desc","kind":"scalar","type":"String"},{"name":"dateStart","kind":"scalar","type":"DateTime"},{"name":"dateEnd","kind":"scalar","type":"DateTime"},{"name":"tickets","kind":"object","type":"Ticket","relationName":"EventToTicket"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"tickets","kind":"object","type":"BookingTicketJoin","relationName":"BookingToBookingTicketJoin"},{"name":"owner","kind":"object","type":"User","relationName":"BookingToUser"},{"name":"ownerId","kind":"scalar","type":"Int"}],"dbName":null},"Ticket":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"bookings","kind":"object","type":"BookingTicketJoin","relationName":"BookingTicketJoinToTicket"},{"name":"event","kind":"object","type":"Event","relationName":"EventToTicket"},{"name":"name","kind":"scalar","type":"String"},{"name":"desc","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Int"},{"name":"availability","kind":"scalar","type":"Int"},{"name":"eventId","kind":"scalar","type":"Int"}],"dbName":null},"BookingTicketJoin":{"fields":[{"name":"bookingId","kind":"scalar","type":"Int"},{"name":"ticketId","kind":"scalar","type":"Int"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Int"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToBookingTicketJoin"},{"name":"ticket","kind":"object","type":"Ticket","relationName":"BookingTicketJoinToTicket"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("node:buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_bg.sqlite.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_bg.sqlite.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  }
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}
runtime.Extensions.getExtensionContext;
({
  DbNull: runtime.NullTypes.DbNull,
  JsonNull: runtime.NullTypes.JsonNull,
  AnyNull: runtime.NullTypes.AnyNull
});
runtime.makeStrictEnum({
  Serializable: "Serializable"
});
runtime.Extensions.defineExtension;
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
const PrismaClient = getPrismaClientClass();
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });
const bookingStatus = ["PENDING", "PAID", "CANCELLED"];
const bookingStatusEnum = z.enum(bookingStatus);
const CreateUserSchema = z.object({
  name: z.string().min(1)
});
const UpdateUserSchema = z.object({
  name: z.string().optional()
});
const CreateEventSchema = z.object({
  name: z.string().min(1),
  desc: z.string()
});
const CreateTicketSchema = z.object({
  name: z.string(),
  desc: z.string().nullable(),
  type: z.string().nullable(),
  price: z.number().positive().nullable(),
  availability: z.number().positive().default(0),
  eventId: z.number().min(1).positive()
});
const UpdateTicketSchema = z.object({
  name: z.string().optional(),
  desc: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  price: z.number().positive().nullable().optional(),
  availability: z.number().positive().default(0).optional(),
  eventId: z.number().min(1).positive().optional()
});
const bookingTicketInputSchema = z.object({
  ticketId: z.number().int().positive(),
  quantity: z.number().int().positive()
});
const CreateBookingSchema = z.object({
  status: bookingStatusEnum.default("PAID"),
  tickets: z.array(bookingTicketInputSchema).min(1),
  ownerId: z.number().positive().min(1)
});
const validationGuard = (result, c) => {
  if (!result.success) {
    return c.json(
      {
        message: "invalid input",
        errors: result.error.issues.map((issue) => issue.message)
      },
      400
    );
  }
};
const app$5 = new Hono();
app$5.get("/", async (c) => {
  const data = await prisma.user.findMany();
  return c.json(data);
}).get("/:id", async (c) => {
  const id = c.req.param("id");
  const data = await prisma.user.findUnique({
    where: {
      id: Number(id)
    }
  });
  return c.json(data);
}).post(
  "/",
  zValidator("json", CreateUserSchema, validationGuard),
  async (c) => {
    const body = await c.req.valid("json");
    const user = await prisma.user.create({
      data: {
        name: body.name
      }
    });
    console.log(`created user: ${user.name}`);
    return c.json({ message: `successfully added ${user.name}` });
  }
).patch(
  "/:id",
  zValidator("json", UpdateUserSchema, validationGuard),
  async (c) => {
    const id = c.req.param("id");
    const data = await c.req.valid("json");
    if (!data?.name) {
      return c.json({ message: `no change requested` });
    }
    const updateUser = await prisma.user.update({
      where: {
        id: Number(id)
      },
      data
    });
    console.log(`updated user: ${updateUser.name}`);
    return c.json({ message: `successfully updated to ${updateUser.name}` });
  }
).delete("/:id", async (c) => {
  const id = c.req.param("id");
  const deletedUser = await prisma.user.delete({
    where: {
      id: Number(id)
    }
  });
  console.log(`deleted user: ${deletedUser.name}`);
  return c.json({ message: `successfully deleted ${deletedUser.name}` });
});
const app$4 = new Hono();
app$4.get("/", async (c) => {
  const data = await prisma.booking.findMany();
  return c.json(data);
}).get("/:id", async (c) => {
  const id = c.req.param("id");
  const data = await prisma.booking.findUnique({
    where: {
      id: Number(id)
    }
  });
  return c.json(data);
}).post(
  "/",
  zValidator("json", CreateBookingSchema, validationGuard),
  async (c) => {
    const data = await c.req.valid("json");
    const booking = await prisma.booking.create({
      data: {
        owner: {
          connect: {
            id: data.ownerId
          }
        },
        tickets: {
          create: data.tickets.map((t) => ({
            ticket: {
              connect: {
                id: t.ticketId
              }
            },
            quantity: t.quantity,
            price: 0
            //TODO : dynamic price
          }))
        }
      },
      include: {
        tickets: true
      }
    });
    console.log(`created booking: ${booking.id}`);
    return c.json({ message: `successfully added ${booking.id}` });
  }
).delete("/:id", async (c) => {
  const id = c.req.param("id");
  const cancelBooking = await prisma.booking.update({
    where: {
      id: Number(id)
    },
    data: {
      status: "CANCELLED"
    }
  });
  const cancelledTicketJoin = await prisma.bookingTicketJoin.findMany({
    where: {
      bookingId: cancelBooking.id
    },
    select: {
      ticketId: true
    }
  });
  await Promise.all(
    cancelledTicketJoin.map(async (t) => {
      const data = await prisma.ticket.findUnique({
        where: {
          id: t.ticketId
        }
      });
      return data?.name;
    })
  );
  const cancelledTicketData = await prisma.ticket.findMany({
    where: {
      id: {
        in: await cancelledTicketJoin.map((t) => t.ticketId)
      }
    },
    select: {
      name: true
    }
  });
  console.log(`cancelled booking: ${cancelBooking.id}`);
  return c.json({
    message: `successfully cancelled booking:${cancelBooking.id} for ticket: ${cancelledTicketData.map((t) => t.name).join(" & ")}`
  });
});
const app$3 = new Hono();
app$3.get("/", async (c) => {
  const data = await prisma.event.findMany();
  return c.json(data);
}).get("/:id", async (c) => {
  const id = c.req.param("id");
  const data = await prisma.event.findUnique({
    where: {
      id: Number(id)
    }
  });
  return c.json(data);
}).post(
  "/",
  zValidator("json", CreateEventSchema, validationGuard),
  async (c) => {
    const data = await c.req.valid("json");
    const event = await prisma.event.create({
      data
    });
    console.log(`created event: ${event.name}`);
    return c.json({ message: `successfully added ${event.name}` });
  }
).patch(
  "/:id",
  zValidator("json", CreateEventSchema, validationGuard),
  async (c) => {
    const id = c.req.param("id");
    const data = await c.req.valid("json");
    const updateEvent = await prisma.event.update({
      where: {
        id: Number(id)
      },
      data
    });
    console.log(`updated event: ${updateEvent.name}`);
    return c.json({ message: `successfully updated to ${updateEvent.name}` });
  }
).delete("/:id", async (c) => {
  const id = c.req.param("id");
  const deletedEvent = await prisma.event.delete({
    where: {
      id: Number(id)
    }
  });
  console.log(`deleted event: ${deletedEvent.name}`);
  return c.json({ message: `successfully deleted ${deletedEvent.name}` });
});
const app$2 = new Hono();
app$2.get("/", async (c) => {
  const data = await prisma.ticket.findMany();
  return c.json(data);
}).get("/:id", async (c) => {
  const id = c.req.param("id");
  const data = await prisma.ticket.findUnique({
    where: {
      id: Number(id)
    }
  });
  return c.json(data);
}).post(
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
        eventId: data.eventId ? data.eventId : 0
      }
    });
    console.log(`created event: ${event.name}`);
    return c.json({ message: `successfully added ${event.name}` });
  }
).patch(
  "/:id",
  zValidator("json", UpdateTicketSchema, validationGuard),
  async (c) => {
    const id = c.req.param("id");
    const data = await c.req.valid("json");
    const updateTicket = await prisma.ticket.update({
      where: {
        id: Number(id)
      },
      data
    });
    console.log(`updated ticket: ${updateTicket.name}`);
    return c.json({
      message: `successfully updated to ${updateTicket.name}`,
      update: updateTicket
    });
  }
).delete("/:id", async (c) => {
  const id = c.req.param("id");
  const deletedTicket = await prisma.ticket.delete({
    where: {
      id: Number(id)
    }
  });
  console.log(`deleted ticket: ${deletedTicket.name}`);
  return c.json({ message: `successfully deleted ${deletedTicket.name}` });
});
const app$1 = new Hono();
app$1.get("/", (c) => {
  return c.text("sup");
});
const routes = app$1.route("/users", app$5).route("/bookings", app$4).route("/events", app$3).route("/tickets", app$2);
const app = new Hono();
app.route("/api", routes);
const server = serve(
  {
    fetch: app.fetch,
    port: 3e3
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
const shutdown = async () => {
  try {
    server.close();
    await prisma.$disconnect();
  } catch (err) {
    console.error(err);
  }
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
