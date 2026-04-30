export type envBindings = {
  AUTH_TOKEN: string;
  RUNNING_ENV: "development" | "production";
};

const API = "https://www.steamgriddb.com/api/v2";

export async function apiFetch(path: string, token?: string) {
  const res = await fetch(`${API}${path}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  if (!res.ok) {
    throw new Error(`request failed: ${res.status}`);
  }

  return res.json();
}

export async function getAssets(id: string, type: "grids" | "heroes" | "logos" | "icons", token?: string) {
  const data = await apiFetch(`/${type}/game/${encodeURIComponent(id)}`, token);
  return (data.data || [])
    .map((item: { thumb?: string; url?: string }) => {
      return { thumb: item.thumb, url: item.url };
    })
    .filter(Boolean);
}
