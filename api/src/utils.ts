export type envBindings = {
  AUTH_TOKEN: string;
  RUNNING_ENV: "development" | "production";
};

const API = "https://www.steamgriddb.com/api/v2";

type Asset = {
  thumb?: string;
  url?: string;
};

type AssetsResponse = {
  data?: Asset[];
};

export async function apiFetch<T>(path: string, token?: string): Promise<T> {
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

  return (await res.json()) as T;
}

export async function getAssets(id: string, type: "grids" | "heroes" | "logos" | "icons", token?: string) {
  const data = await apiFetch<AssetsResponse>(`/${type}/game/${encodeURIComponent(id)}`, token);
  return (data.data || []).map((item) => ({ thumb: item.thumb, url: item.url }));
}
