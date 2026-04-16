import { libraryData } from "@/stores/libraryStore";
import { textLanguages } from "@/Text";

export function translateText(text) {
  if (libraryData.userSettings.language === "en") {
    return text;
  }

  if (!Object.prototype.hasOwnProperty.call(textLanguages, text)) {
    console.trace(`missing text translation '${text}'`);
    return text;
  }

  const translatedText = textLanguages[text][libraryData.userSettings.language];

  if (translatedText === "") {
    return text;
  }

  return translatedText;
}
