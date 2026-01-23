class GameAssets {
  hero?: string;
  grid?: string;
  logo?: string;
  icon?: string;

  // so that i can assign new GameAssets({ logo: "location.png" })
  // and not have to mention everything else
  constructor(init: Partial<GameAssets>) {
    Object.assign(this, init);
  }
}

class Game {
  name: string;
  location?: string;
  isFavourite: boolean;
  assets: GameAssets;

  constructor(init: { name: string; assets: GameAssets; location?: string }) {
    this.name = init.name;
    this.isFavourite = false;
    this.assets = init.assets;
    this.location = init.location;
  }
}

class Folder {
  name: string;
  hide: boolean;
  games: Game[];

  constructor(init: { name: string }) {
    this.name = init.name;
    this.hide = false;
    this.games = [];
  }
}

enum FontStyle {
  "sans serif",
  serif,
  mono,
}

enum Language {
  en,
  jp,
  es,
  hi,
  ru,
  fr,
}

enum Theme {
  dark,
  light,
}

class UserSettings {
  roundedBorders: boolean;
  showSideBar: boolean;
  gameTitle: boolean;
  folderTitle: boolean;
  quitAfterOpen: boolean;
  fontName: FontStyle;
  language: Language;
  currentTheme: Theme;
  zoomLevel: number;
}

export { Game, Folder };
