import { Hono } from "hono";
import users from "@/src/routes/users/index";
import bookings from "@/src/routes/bookings/index";
import events from "@/src/routes/events/index";
import tickets from "@/src/routes/tickets/index";

const app = new Hono();
// .basePath("/api");

app.get("/", (c) => {
  return c.text(`
  /api
   |- /bookings
   |- /events
   |- /tickets
   |- /users  
  `);
});

const routes = app
  .route("/users", users)
  .route("/bookings", bookings)
  .route("/events", events)
  .route("/tickets", tickets);

export type AppType = typeof routes;
export default routes;
