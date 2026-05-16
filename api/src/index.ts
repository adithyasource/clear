import { Hono } from "hono";
import { cors } from "hono/cors";
import { searchHLTB } from "./hltb";
import { apiFetch, type envBindings, getAssets } from "./utils";

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

app.get("/latest-client-version", (c) => c.json({ version: "1.0.0" }));
app.get("/health", (c) => c.json({ status: "ok" }));

app.get("/games/search/:name", async (c) => {
  return c.json(await apiFetch(`/search/autocomplete/${encodeURIComponent(c.req.param("name"))}`, c.env.AUTH_TOKEN));
});

app.get("/games/steam/:id", async (c) => {
  return c.json(await apiFetch(`/games/steam/${encodeURIComponent(c.req.param("id"))}`, c.env.AUTH_TOKEN));
});

app.get("/games/assets/:id", async (c) => {
  const token = c.env.AUTH_TOKEN;

  const id = c.req.param("id");
  const toAssets = (result: PromiseSettledResult<Awaited<ReturnType<typeof getAssets>>>) =>
    result.status === "fulfilled" ? result.value : [];

  const [grids, heroes, logos, icons] = (
    await Promise.allSettled([
      getAssets(id, "grids", token),
      getAssets(id, "heroes", token),
      getAssets(id, "logos", token),
      getAssets(id, "icons", token),
    ])
  ).map(toAssets);

  return c.json({
    grids,
    heroes,
    logos,
    icons,
  });
});

app.get("/hltb/search/:name", async (c) => {
  const name = c.req.param("name");
  if (!name) {
    return c.json({ error: 'Missing query parameter "name"' }, 400);
  }

  try {
    const results = await searchHLTB(name);
    return c.json(results);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "server error" }, 500);
  }
});

app.notFound((c) => c.json({ error: "not found" }, 404));

app.onError((error, c) => {
  console.error(error);
  return c.json({ error: "server error" }, 500);
});

export default app;
