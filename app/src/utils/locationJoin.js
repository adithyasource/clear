import { SYSTEM_PLATFORM } from "@/stores/applicationStore";

export function locationJoin(locationsList) {
  if (SYSTEM_PLATFORM === "windows") {
    return locationsList.join("\\");
  }

  return locationsList.join("/");
}
