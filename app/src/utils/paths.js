import { systemPlatform } from "@/stores/applicationStore";

export function locationJoin(locationsList) {
  if (systemPlatform() === "windows") {
    return locationsList.join("\\");
  }

  return locationsList.join("/");
}

export function getExecutableFileName(location) {
  // splits both / and \ paths since a library created on windows can be
  // viewed on macos and vice versa
  if (location.toString().startsWith("steam://")) {
    const id = location.toString().split("/").pop();
    return `steamId: ${id}`;
  }

  return location.toString().split("\\").pop().split("/").pop();
}

export function getExecutableParentFolder(location) {
  if (location.toString().startsWith("steam://")) {
    throw new Error("no parent, location is a steam game");
  }

  if (systemPlatform() === "windows") {
    return location.toString().split("\\").slice(0, -1).join("\\");
  }

  return location.toString().split("/").slice(0, -1).join("/");
}
