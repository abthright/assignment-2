import { Hono } from "hono";
import users from "@/src/modules/users/index";
import bookings from "@/src/modules/bookings/index";
import events from "@/src/modules/events/index";
import tickets from "@/src/modules/users/index";

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  return c.text("sup");
});

const routes = app
  .route("/users", users)
  .route("/bookings", bookings)
  .route("/events", events)
  .route("/tickets", tickets);

export type AppType = typeof routes;
export default routes;
