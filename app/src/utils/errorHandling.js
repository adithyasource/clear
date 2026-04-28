import { BaseDirectory, exists, mkdir, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

const LOG_DIR = "logs";
const LOG_FILE = `${LOG_DIR}/clear.log`;
const MAX_LOG_LENGTH = 200_000;

export function getErrorMessage(error, fallback = "something went wrong") {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object") {
    try {
      return JSON.stringify(error);
    } catch {
      return fallback;
    }
  }

  return fallback;
}

export async function logError(context, error) {
  const message = getErrorMessage(error);
  const stack = error instanceof Error && error.stack ? `\n${error.stack}` : "";
  const entry = `[${new Date().toISOString()}] ${context}: ${message}${stack}\n\n`;

  console.error(`[${context}]`, error);

  try {
    if (!(await exists(LOG_DIR, { baseDir: BaseDirectory.AppData }))) {
      await mkdir(LOG_DIR, {
        baseDir: BaseDirectory.AppData,
        recursive: true,
      });
    }

    const existing = (await exists(LOG_FILE, { baseDir: BaseDirectory.AppData }))
      ? await readTextFile(LOG_FILE, { baseDir: BaseDirectory.AppData })
      : "";

    const nextContent = `${existing}${entry}`.slice(-MAX_LOG_LENGTH);

    await writeTextFile(LOG_FILE, nextContent, {
      baseDir: BaseDirectory.AppData,
    });
  } catch (loggingError) {
    console.error("[logger] failed to persist error log", loggingError);
  }
}
