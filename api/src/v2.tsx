import { Hono } from "hono";
import { apiFetch, getAssets } from "./utils";

const app = new Hono();

app.get("/version", (c) => c.json({ version: "1.0.0" }));
app.get("/health", (c) => c.json({ status: "ok" }));

app.get("/games/search/:name", async (c) => {
  return c.json(
    await apiFetch(`/search/autocomplete/${encodeURIComponent(c.req.param("name"))}`, process.env.AUTH_TOKEN),
  );
});

app.get("/games/steam/:id", async (c) => {
  return c.json(await apiFetch(`/games/steam/${encodeURIComponent(c.req.param("id"))}`, process.env.AUTH_TOKEN));
});

app.get("/games/:id/grids", async (c) => {
  return c.json(await getAssets(c.req.param("id"), "grids", process.env.AUTH_TOKEN));
});

app.get("/games/:id/heroes", async (c) => {
  return c.json(await getAssets(c.req.param("id"), "heroes", process.env.AUTH_TOKEN));
});

app.get("/games/:id/logos", async (c) => {
  return c.json(await getAssets(c.req.param("id"), "logos", process.env.AUTH_TOKEN));
});

app.get("/games/:id/icons", async (c) => {
  return c.json(await getAssets(c.req.param("id"), "icons", process.env.AUTH_TOKEN));
});

app.get("/image", async (c) => {
  const url = c.req.query("url");

  if (!url) {
    return c.json({ error: "missing url" }, 400);
  }

  const res = await fetch(url);

  if (!res.ok || !res.body) {
    return c.json({ error: "image fetch failed" }, 502);
  }

  return new Response(res.body, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "application/octet-stream",
      "Cache-Control": "public, max-age=3600",
    },
  });
});

export default app;
