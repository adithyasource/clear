import { Hono } from "hono";
import { cors } from "hono/cors";
import type { envBindings } from "./utils";
import v1 from "./v1";
import v2 from "./v2";

const app = new Hono<{ Bindings: envBindings }>();

app.use(
  "*",
  cors({
    origin: (origin, c) => {
      if (c.env.RUNNING_ENV === "development") return "*";

      const allowed = ["https://tauri.localhost", "tauri://localhost"];

      return allowed.includes(origin) ? origin : "";
    },
    allowMethods: ["GET", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/", (c) => {
  return c.json({ name: "clear api", versions: ["v1", "v2"] });
});

app.route("/v2", v2);
app.route("/", v1);

app.notFound((c) => c.json({ error: "not found" }, 404));

app.onError((error, c) => {
  console.error(error);
  return c.json({ error: "server error" }, 500);
});

export default app;
