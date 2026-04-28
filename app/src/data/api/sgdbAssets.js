import { getErrorMessage } from "@/utils/errorHandling";
import { translateText } from "@/utils/translateText";

export async function gameSearchResults(searchQuery) {
  try {
    const response = await fetch(`${import.meta.env.VITE_CLEAR_API_URL}/?gameName=${searchQuery}`);
    const searchResults = await response.json();

    if (searchResults.data.length === 0) {
      throw new Error("empty results");
    }

    if (!searchResults.success) {
      throw new Error("search unsuccessful");
    }

    return searchResults.data;
  } catch (err) {
    throw new Error(`could not find that game: ${getErrorMessage(err)}`, { cause: err });
  }
}

export async function gameAssetResults(gameId, length = 50) {
  try {
    const response = await fetch(`${import.meta.env.VITE_CLEAR_API_URL}/?assets=${gameId}&length=${length}`);

    const images = await response.json();

    // filtering only falsy values and then getting their keys
    const missing = Object.entries(images)
      .filter(([_, v]) => v.length === 0)
      .map(([k]) => k);

    if (missing.length === 4) {
      throw new Error(translateText("couldn't find any assets :("));
    }

    return {
      images,
      warning: missing.length > 0 ? `${translateText("couldn't find")}: ${missing.join(", ")} for ${gameId}` : null,
    };
  } catch (err) {
    throw new Error(`failed to download any assets: ${getErrorMessage(err)}`, { cause: err });
  }
}

export async function steamGameSearchResults(steamId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_CLEAR_API_URL}/?steamID=${steamId}`);
    const searchResults = await response.json();

    if (searchResults.data.length === 0) {
      throw new Error("empty results");
    }

    if (!searchResults.success) {
      throw new Error("search unsuccessful");
    }

    return searchResults;
  } catch (err) {
    throw new Error(`could not find that game: ${getErrorMessage(err)}`, { cause: err });
  }
}
