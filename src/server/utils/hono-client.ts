import type { AppType } from "@/src/routes/index";
import { hc } from "hono/client";

const client = hc<AppType>("http://localhost:3000/");
