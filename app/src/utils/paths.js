import { SYSTEM_PLATFORM } from "@/stores/applicationStore";

export function locationJoin(locationsList) {
  if (SYSTEM_PLATFORM === "windows") {
    return locationsList.join("\\");
  }

  return locationsList.join("/");
}

export function getExecutableFileName(location) {
  // splits both / and \ paths since a library created on windows can be
  // viewed on macos and vice versa
  return location.toString().split("\\").slice(-1).toString().split("/").slice(-1);
}

export function getExecutableParentFolder(location) {
  if (SYSTEM_PLATFORM === "windows") {
    return location.toString().split("\\").slice(0, -1).join("\\");
  }

  return location.toString().split("/").slice(0, -1).join("/");
}
