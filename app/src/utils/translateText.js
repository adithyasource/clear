import { libraryData } from "@/stores/libraryStore";
import { textLanguages } from "@/Text";

export function translateText(text) {
  if (!Object.prototype.hasOwnProperty.call(textLanguages, text)) {
    console.trace(`missing text translation '${text}'`);

    return "undefined";
  }

  const translatedText = textLanguages[text][libraryData.userSettings.language];

  if (libraryData.userSettings.language === "en" || translatedText === "") {
    return text;
  }

  return translatedText;
}
