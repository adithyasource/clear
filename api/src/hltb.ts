const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36";
const BASE_URL = "https://howlongtobeat.com";

type HLTBInitResponse = {
  token: string;
  hpKey: string;
  hpVal: string;
};

type HLTBGame = {
  game_id: number;
  game_name: string;
  comp_main: number;
  comp_plus: number;
  comp_100: number;
};

type HLTBSearchResponse = {
  data: Array<HLTBGame & Record<string, unknown>>;
};

type HLTBSearchResult = {
  count: number;
  data: HLTBGame[];
  color?: string;
  title?: string;
  pageCurrent?: number;
  pageTotal?: number;
  pageSize?: number;
};

async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `request failed: ${res.status}`);
  }

  return (await res.json()) as T;
}

export async function searchHLTB(searchTerms: string): Promise<HLTBSearchResult> {
  const { token, hpKey, hpVal } = await fetchJson<HLTBInitResponse>(`${BASE_URL}/api/find/init?t=${Date.now()}`, {
    headers: {
      "User-Agent": USER_AGENT,
      Referer: `${BASE_URL}/`,
    },
  });

  const result = await fetchJson<HLTBSearchResponse>(`${BASE_URL}/api/find`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
      Referer: `${BASE_URL}/`,
      Origin: BASE_URL,
      "x-auth-token": token,
      "x-hp-key": hpKey,
      "x-hp-val": hpVal,
    },
    body: JSON.stringify({
      searchType: "games",
      searchTerms: searchTerms.split(" "),
      searchPage: 1,
      size: 5,
      searchOptions: {
        games: {
          userId: 0,
          platform: "",
          sortCategory: "popular",
          rangeCategory: "main",
          rangeTime: { min: null, max: null },
          gameplay: { perspective: "", flow: "", genre: "", difficulty: "" },
          rangeYear: { min: "", max: "" },
          modifier: "",
        },
        users: { sortCategory: "postcount" },
        lists: { sortCategory: "follows" },
        filter: "",
        sort: 0,
        randomizer: 0,
      },
      useCache: true,
      [hpKey]: hpVal,
    }),
  });

  return <HLTBSearchResult>{
    data: result.data.map((game) => ({
      game_id: game.game_id,
      game_name: game.game_name,
      comp_main: game.comp_main,
      comp_plus: game.comp_plus,
      comp_100: game.comp_100,
    })),
  };
}
