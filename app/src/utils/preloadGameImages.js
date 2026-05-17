import { convertFileSrc } from "@tauri-apps/api/core";
import { getImagePath } from "../data/storage/imageStroage";

const images = new Map();

function getKey(type, fileName) {
  return `${type}:${fileName}`;
}

function getEntry(type, fileName) {
  const key = getKey(type, fileName);

  if (!images.has(key)) {
    images.set(key, { src: null, img: null, loading: null });
  }

  return images.get(key);
}

function getHiddenRoot() {
  let root = document.getElementById("image-preload-root");

  if (!root) {
    root = document.createElement("div");
    root.id = "image-preload-root";
    root.setAttribute("aria-hidden", "true");
    root.style.cssText =
      "position:fixed;left:-99999px;top:-99999px;width:1px;height:1px;opacity:0;pointer-events:none;overflow:hidden;";
    document.body.append(root);
  }

  return root;
}

function waitForLoad(img) {
  if (img.complete) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
}

export async function getGameImageSource(type, fileName) {
  if (!fileName) return null;

  const entry = getEntry(type, fileName);

  if (entry.src) {
    return entry.src;
  }

  const fullPath = await getImagePath({ type, fileName });
  entry.src = convertFileSrc(fullPath);

  return entry.src;
}

export function getCachedGameImageSource(type, fileName) {
  if (!fileName) return null;
  return getEntry(type, fileName).src;
}

export async function ensurePreloadedImageElement(type, fileName, className = "") {
  if (!fileName) return null;

  const entry = getEntry(type, fileName);

  if (entry.img) {
    entry.img.className = className;
    return entry.img;
  }

  if (!entry.loading) {
    entry.loading = (async () => {
      const src = await getGameImageSource(type, fileName);
      if (!src) return null;

      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      getHiddenRoot().append(img);

      await waitForLoad(img);

      entry.img = img;
      entry.loading = null;
      return img;
    })();
  }

  const img = await entry.loading;

  if (img) {
    img.className = className;
  }

  return img;
}

export async function movePreloadedImageElement(type, fileName, target, className = "") {
  if (!fileName || !target) return null;

  const img = await ensurePreloadedImageElement(type, fileName, className);
  if (!img) return null;

  img.className = className;
  target.replaceChildren(img);
  return img;
}

export function restorePreloadedImageElement(type, fileName) {
  if (!fileName) return;

  const img = getEntry(type, fileName).img;
  if (!img) return;

  getHiddenRoot().append(img);
}

export async function preloadGameModalImages(game) {
  if (!game) return;

  await Promise.all([
    ensurePreloadedImageElement("hero", game.heroImagePath),
    ensurePreloadedImageElement("logo", game.logoImagePath),
  ]);
}
