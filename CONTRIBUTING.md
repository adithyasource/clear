# clear contributing guide

Thank you so much for considering contributing to 'clear'! Not only will you be helping create an amazing experience for people who play video games, but also contribute to a body that is open source and dedicated to the public domain.

## if you would like to contribute to the translations:

You would need to look at the file [Text.js](https://github.com/adithyasource/clear/blob/main/src/Text.js). Here you can find the translations for each language. Some languages were originally generated using Google Translate in order to get the ball rolling. 

| Language  | Status |
| ------------- | ------------- |
| French  | ✅ Completed (by [@jer3m01](https://github.com/adithyasource/clear/pull/2))  |
| Russian  | ✅ Completed (by [@vladbrox](https://github.com/adithyasource/clear/issues/3))  |
| Japanese  | Google Translate  |
| Spanish  | Google Translate  |
| Hindi  | ✅ Completed (by [me](https://github.com/adithyasource/clear/commit/27fb8cf35fa3cbf12e3599de5067d64a83d3aed4), please feel free to improve) |


To update the file with more accurate translations you'll have to fork the repository and create a new branch with your changes after which you can create a pull request. \
\
You can also add a new language by adding a new simple 2-3 letter key to the JSON for every language. \
\
For example, to add a new language, say Hebrew (shortened to he)

```
  "import Steam games": {
    jp: "Steam ゲームをインポートする",
    .
    .
    .
    .
    fr: "Importer des jeux Steam",
    he: "Your translation goes here"
  },
```

If you would like to contribute to the translations but do not know how to do so by modifying JSON or using Git/GitHub, you can create a [new issue](https://github.com/adithyasource/clear/issues) with all the improved/new translations for all the text.

## if you would like to contribute to improving the code:

[This](https://adithyaa.notion.site/1557ca8ac05e4aee8ed35e270c58ee48?v=64af609e060c4a39ba527d8f2a1ee8e2) is a notion board with a couple of ideas and features that would be cool to have in the application. If you find something
that interests you, it'd be great if you could implement it! If you need any help, you can always open up a [new issue](https://github.com/adithyasource/clear/issues) \
\
Please make sure that you do not implement any major new features that are not on the notion board before
opening an issue discussing it. This is in order to make that that the clear's original purpose of being clean, minimalistic and simple to use stays true. \
\
You'll have to fork the repository and create a new branch with your changes after which you can create a pull request. \
\
If you find any bugs, you can always open a [new issue](https://github.com/adithyasource/clear/issues) or fix the bug yourself!

### getting started

In order to set up your dev environment, you need to have the following prerequisites installed:

- nodejs
- rust

When that is done you can begin setting up Tauri!

1. Clone the repo
   ```sh
   git clone https://github.com/adithyasource/clear
   ```
2. Enter the folder
   ```sh
   cd clear
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Run the app for development
   ```sh
   npm run tauri dev
   ```

**This is all you would need if you are contributing for development, however if you want to build your own version of the app, then you can do the following**

1. Remove the following line from "src-tauri\tauri.conf.json"
   ```
   "beforeBundleCommand": ".\\before-build.bat",
   ```
2. And then run the build command
   ```sh
   npm run tauri build
   ```

However this way of bundling is not that one that the final release versions use, which is the following.

1. Do not remove the "beforeBundleCommand" line from the previous procedure
2. Install the nightly branch of rust. This project uses rust nightly-2023-11-16
3. Download UPX and place the UPX executable, named "upx.exe" into the "UPX/" directory
4. Download NSIS Unicode ["nsis-2.50.0-Unicode.zip" from https://github.com/jimpark/unsis/releases] and extract its contents into the "NSIS-unicode/" directory.
5. Run the following command
   ```
   cargo tauri build --target x86_64-pc-windows-msvc -- -Z build-std=std,panic_abort -Z build-std-features=panic_immediate_abort
   ```

And you're done!
