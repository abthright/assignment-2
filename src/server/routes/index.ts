import { Hono } from "hono";
import users from "@/src/server/routes/users/index";
import bookings from "@/src/server/routes/bookings/index";
import events from "@/src/server/routes/events/index";
import tickets from "@/src/server/routes/tickets/index";

const app = new Hono();
// .basePath("/api");

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
