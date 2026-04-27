import { ask } from "@tauri-apps/plugin-dialog";
import { relaunch } from "@tauri-apps/plugin-process";
import { check } from "@tauri-apps/plugin-updater";

export async function checkForUpdatesAndNotify() {
  const update = await check();
  console.log("trying");
  if (update) {
    console.log(`found update ${update.version} from ${update.date} with notes ${update.body}`);
  }

  const answer = await ask(
    `update to ${update.version} available!\nrelease notes:\n${update.body}\n\ndo you wanna update?`,
    {
      title: "clear: update",
      kind: "info",
    },
  );

  if (!answer) return;

  let downloaded = 0;
  let contentLength = 0;

  await update.downloadAndInstall((event) => {
    switch (event.event) {
      case "Started":
        contentLength = event.data.contentLength;
        console.log(`started downloading ${event.data.contentLength} bytes`);
        break;
      case "Progress":
        downloaded += event.data.chunkLength;
        console.log(`downloaded ${downloaded} from ${contentLength}`);
        break;
      case "Finished":
        console.log("download finished");
        break;
    }
  });

  console.log("update installed");
  await relaunch();

  console.log(answer);
}
