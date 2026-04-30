import { Hono } from "hono";
import { apiFetch, getAssets } from "./utils";

const app = new Hono();

app.get("/", async (c) => {
  const query = c.req.query();
  const token = process.env.AUTH_TOKEN;

  if (!Object.keys(query).length) {
    return c.json({ name: "clear api", version: "v1" });
  }

  if (query.version !== undefined) {
    return c.json({ clearVersion: "1.0.0" });
  }

  if (query.gameName) {
    return c.json(await apiFetch(`/search/autocomplete/${encodeURIComponent(query.gameName)}`, token));
  }

  if (query.steamID) {
    return c.json(await apiFetch(`/games/steam/${encodeURIComponent(query.steamID)}`, token));
  }

  if (query.assets) {
    const id = query.assets;
    const firstOnly = query.length === "1";

    const [grids, heroes, logos, icons] = await Promise.all([
      getAssets(id, "grids", token),
      getAssets(id, "heroes", token),
      getAssets(id, "logos", token),
      getAssets(id, "icons", token),
    ]);

    return c.json({
      grids: firstOnly ? grids[0]?.thumb : grids.map((x) => x.thumb),
      heroes: firstOnly ? heroes[0]?.thumb : heroes.map((x) => x.thumb),
      logos: firstOnly ? logos[0]?.thumb : logos.map((x) => x.thumb),
      icons: firstOnly ? icons[0]?.thumb : icons.map((x) => x.thumb),
    });
  }

  return c.json({ error: "invalid query" }, 400);
});

export default app;
