import { Hono } from "hono";
import { corsOrigin } from "./utils";
import v1 from "./v1";
import v2 from "./v2";

const app = new Hono();

app.use("*", async (c, next) => {
  c.header("Access-Control-Allow-Origin", corsOrigin(c.req.header("Origin")));
  c.header("Access-Control-Allow-Methods", "GET,OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (c.req.method === "OPTIONS") {
    return c.body(null, 204);
  }

  await next();
});

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
