import { libraryData } from "@/stores/libraryStore";

import en from "../locales/en.json";
import es from "../locales/es.json";
import fr from "../locales/fr.json";
import hi from "../locales/hi.json";
import ja from "../locales/ja.json";
import ru from "../locales/ru.json";

const locales = {
  en,
  ja,
  es,
  hi,
  ru,
  fr,
};

export function translateText(namespace) {
  const language = libraryData.userSettings.language;

  const translatedText = locales[language][namespace];

  if (!translatedText) {
    console.trace(`missing translation '${namespace}'`);
    return locales.en[namespace] ?? namespace;
  }

  return translatedText;
}
