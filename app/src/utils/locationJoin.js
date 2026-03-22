export function locationJoin(locationsList) {
  if (systemPlatform() === "windows") {
    return locationsList.join("\\");
  }

  return locationsList.join("/");
}
