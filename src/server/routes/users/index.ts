import { Hono } from "hono";
import { prisma } from "@/src/server/utils/prisma";
import * as z from "zod";
import { zValidator } from "@hono/zod-validator";
import {
  CreateUserSchema,
  UpdateUserSchema,
} from "@/src/server/utils/zodSchemas";
import { validationGuard } from "@/src/server/utils/exceptions";

const app = new Hono();

app
  .get("/", async (c) => {
    const data = await prisma.user.findMany();
    return c.json(data);
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const data = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    return c.json(data);
  })
  .post(
    "/",
    zValidator("json", CreateUserSchema, validationGuard),
    async (c) => {
      const body = await c.req.valid("json");
      const user = await prisma.user.create({
        data: {
          name: body.name,
        },
      });
      console.log(`created user: ${user.name}`);
      return c.json({ message: `successfully added ${user.name}` });
    },
  )
  .patch(
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
          id: Number(id),
        },
        data: data,
      });
      console.log(`updated user: ${updateUser.name}`);
      return c.json({ message: `successfully updated to ${updateUser.name}` });
    },
  )
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    const deletedUser = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
    console.log(`deleted user: ${deletedUser.name}`);
    return c.json({ message: `successfully deleted ${deletedUser.name}` });
  });

export default app;
