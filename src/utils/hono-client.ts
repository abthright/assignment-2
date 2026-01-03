import type { AppType } from "@/src/modules/index";
import { hc } from "hono/client";

const client = hc<AppType>("http://localhost:3000/");
