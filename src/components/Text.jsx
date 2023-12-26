import { language } from "../Signals";

let textLanguages = {
  "hey there! thank you so much for using clear": {
    jp: "ちょっと、そこ！いつもクリアをご利用いただき誠にありがとうございます",
    es: "¡hola! muchas gracias por usar claro",
  },
  "add some new games using the sidebar buttons": {
    jp: "サイドバーボタンを使用して新しいゲームを追加します",
    es: "agregue algunos juegos nuevos usando los botones de la barra lateral",
  },
  "create new folders and drag and drop your games into them": {
    jp: "新しいフォルダーを作成し、そこにゲームをドラッグ アンド ドロップします。",
    es: "Crea nuevas carpetas y arrastra y suelta tus juegos en ellas.",
  },
  "dont forget to check out the settings!": {
    jp: "設定を確認することを忘れないでください",
    es: "¡No olvides revisar la configuración!",
  },
  "import steam games": {
    jp: "Steam ゲームをインポートする",
    es: "importar juegos de steam",
  },
  "might not work perfectly!": {
    jp: "完全に動作しない可能性があります!",
  },
  "new game": {
    jp: "新しいゲーム",
  },
  "open settings": {
    jp: "設定を開く",
  },
  "new folder": {
    jp: "新しいフォルダ",
  },
  "open notepad": {
    jp: "メモ帳を開く",
  },
  "close app": {
    jp: "アプリを閉じる",
  },
  "close dialogs": {
    jp: "ダイアログを閉じる",
  },
  "search bar": {
    jp: "検索バー",
  },
  "hide sidebar": {
    jp: "サイドバーを隠す",
  },
  "quick open game": {
    jp: "クイックオープンゲーム",
  },
  "no game file": {
    jp: "ゲームファイルがありません",
  },
  "no games found": {
    jp: "ゲームが見つかりません",
  },
  uncategorized: {
    jp: "未分類",
  },
  "add game": {
    jp: "ゲームを追加",
  },
  "add folder": {
    jp: "フォルダーを追加",
  },
  notepad: {
    jp: "メモ帳",
  },
  settings: {
    jp: "設定",
  },
  search: {
    jp: "検索",
  },
  "new update available!": {
    jp: "新しいアップデートが利用可能になりました!",
  },
  "rounded borders": {
    jp: "丸い境界線",
  },
  "game title": {
    jp: "ゲームタイトル",
  },
  "folder title": {
    jp: "フォルダタイトル",
  },
  "quit after opening game": {
    jp: "ゲーム開始後に終了",
  },
  font: {
    jp: "フォント",
  },
  "sans serif": {
    jp: "サンセリフ",
  },
  mono: {
    jp: "単核症",
  },
  serif: {
    jp: "セリフ",
  },
  light: {
    jp: "ライト",
  },
  dark: {
    jp: "暗い",
  },
  theme: {
    jp: "テーマ",
  },
  "open library location": {
    jp: "図書館の場所を開く",
  },
  "these are all the files that the app stores on your pc. you can copy these files to the same location on another pc to get your library there":
    {
      jp: "これらはすべて、アプリが PC に保存するファイルです。これらのファイルを別の PC の同じ場所にコピーして、そこにライブラリを取得できます。",
    },
  feedback: {
    jp: "フィードバック",
  },
  "visit website": {
    jp: "ウェブサイトを訪問",
  },
  "made by": {
    jp: "作られた",
  },
  "buy me a coffee": {
    jp: "コーヒーを買ってください",
  },
  notepad: {
    jp: "メモ帳",
  },
  "write anything you want over here!": {
    jp: "ここに何でも書いてください！",
  },
  "add new game": {
    jp: "新しいゲームを追加する",
  },
  favourite: {
    jp: "お気に入り",
  },
  save: {
    jp: "保存",
  },
  "grid/cover": {
    jp: "グリッド/カバー",
  },
  hero: {
    jp: "ヒーロー",
  },
  logo: {
    jp: "ロゴ",
  },
  icon: {
    jp: "アイコン",
  },
  "name of game": {
    jp: "ゲームの名前",
  },
  "auto find assets": {
    jp: "アセットの自動検索",
  },
  "find assets": {
    jp: "資産を見つける",
  },
  "locate game": {
    jp: "ゲームを探す",
  },
  "right click to empty image selection": {
    jp: "右クリックして画像の選択を空にします",
  },
  "add new folder": {
    jp: "新しいフォルダーを追加する",
  },
  "hide in expanded view": {
    jp: "展開表示で非表示にする",
  },
  "name of folder": {
    jp: "フォルダの名前",
  },
  loading: {
    jp: "読み込み中",
  },
  play: {
    jp: "遊ぶ",
  },
  edit: {
    jp: "編集",
  },
  delete: {
    jp: "消去",
  },
  "confirm?": {
    jp: "確認する？",
  },
};

export function Text(props) {
  return language() == undefined || language() == "en"
    ? props.t
    : textLanguages[props.t][language()];
}
