export class GameAssets {
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

export class Game {
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

export class Folder {
  name: string;
  hide: boolean;
  games: Game[];

  constructor(init: { name: string }) {
    this.name = init.name;
    this.hide = false;
    this.games = [];
  }
}

export enum FontStyle {
  "sans serif",
  serif,
  mono,
}

export enum Language {
  en,
  jp,
  es,
  hi,
  ru,
  fr,
}

export enum Theme {
  dark,
  light,
}

export class UserSettings {
  roundedBorders: boolean = true;
  showSideBar: boolean = true;
  gameTitle: boolean = true;
  folderTitle: boolean = true;
  quitAfterOpen: boolean = true;
  fontName: FontStyle = FontStyle["sans serif"];
  language: Language = Language.en;
  currentTheme: Theme = Theme.dark;
  zoomLevel = 1;

  constructor(init?: Partial<UserSettings>) {
    Object.assign(this, init);
  }
}

export class LibraryData {
  games?: Record<string, Game>;
  folders?: Record<string, Folder>;
  notepad?: string;
  foldersOrder?: string[];
  userSettings: UserSettings = new UserSettings();

  constructor(init?: Partial<LibraryData>) {
    Object.assign(this, init);
  }
}
