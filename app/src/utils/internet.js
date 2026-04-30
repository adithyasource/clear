export async function checkIfConnectedToInternet() {
  try {
    await fetch("https://www.gstatic.com/generate_204", {
      method: "GET",
      cache: "no-cache",
      mode: "no-cors", // key
    });

    return true;
  } catch {
    throw new Error("not connected to the internet :(");
  }
}

export async function checkIfConnectedToServer() {
  try {
    const res = await fetch(`${import.meta.env.VITE_CLEAR_API_URL}/v2/health`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error(`server responded with ${res.status}`);
    }

    return true;
  } catch {
    throw new Error("not connected to the server :(");
  }
}
