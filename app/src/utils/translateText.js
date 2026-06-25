import { libraryData } from "@/stores/libraryStore";

import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";
import hi from "./hi.json";
import ja from "./ja.json";
import ru from "./ru.json";

const locales = {
  en,
  ja,
  es,
  hi,
  ru,
  fr,
};

export function t(namespace) {
  const language = libraryData.userSettings.language;

  const translatedText = locales[language][namespace];

  if (!translatedText) {
    console.trace(`missing translation '${key}'`);
    return locales.en[key] ?? key;
  }

  return translatedText;
}
