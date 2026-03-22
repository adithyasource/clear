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
    throw new Error("could not find that game:", err);
  }
}
