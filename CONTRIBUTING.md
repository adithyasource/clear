# clear contributing guide

thank you so much for considering contributing to 'clear'! not only will you be
helping create an amazing experience for people who play video games, but also
contribute to a body that is open source and dedicated to the public domain.

## if you would like to contribute to the translations:

you would need to look at the file
[Text.js](https://github.com/adithyasource/clear/blob/main/src/Text.js). here
you can find the translations for each language. some languages were originally
generated using google translate in order to get the ball rolling.

| language | status                                                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| french   | ✅ completed (by [@jer3m01](https://github.com/adithyasource/clear/pull/2))                                                                 |
| russian  | ✅ completed (by [@vladbrox](https://github.com/adithyasource/clear/issues/3))                                                              |
| japanese | google translate                                                                                                                            |
| spanish  | google translate                                                                                                                            |
| hindi    | ✅ completed (by [me](https://github.com/adithyasource/clear/commit/27fb8cf35fa3cbf12e3599de5067d64a83d3aed4), please feel free to improve) |

to update the file with more accurate translations you'll have to fork the
repository and create a new branch with your changes after which you can create
a pull request.\
\
you can add a new language by adding a new simple 2-3 letter key to the JSON for
every language.\
\
for example, to add a new language, say hebrew (shortened to he), change all
text snippets like this

```
"import Steam games": {
  jp: "Steam ゲームをインポートする",
  .
  .
  .
  he: "Your translation goes here"
},
```

if you would like to contribute to the translations but do not know how to do so
by modifying JSON or using Git/GitHub, you can create a
[new issue](https://github.com/adithyasource/clear/issues) with all the
improved/new translations for all the text.

## if you would like to contribute to improving the code:

a bunch of ideas and features that i'm working on / will work on are mentioned
in
[this github projects kanban board](https://github.com/users/adithyasource/projects/3/views/9).
if you find something that interests you, it'd be great if you could implement
it! if you need any assistance, you can always open up a
[new issue](https://github.com/adithyasource/clear/issues)\
\
please make sure that you do not implement any major new features that are not
on the kanban board before opening an issue discussing it. this is in order to
make that that the clear's original purpose of being clean, minimalistic and
simple to use stays true.\
\
you'll have to fork the repository and create a new branch with your changes
after which you can create a pull request.\
\
if you find any bugs, you can always open a
[new issue](https://github.com/adithyasource/clear/issues) or fix the bug
yourself!

### getting started

in order to set up your dev environment, you need to have nodejs, npm and rust
installed\
\
when that is done you can run the code in development mode, by doing the
following:

```sh
git clone https://github.com/adithyasource/clear
cd clear
npm install
npm run tauri dev
```

to build the app, you can run `npm run tauri build`

### formatting and linting style

the project uses the [biome](https://biomejs.dev/) toolchain in order
to format and lint code. make sure that it is installed and set up in your
editor.\
\
install biome globally by using ```npm install -g @biomejs/biome``` and setup
up biome for
[neovim (with lspconfig)](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md#biome),
[vscode](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
or [zed](https://biomejs.dev/reference/zed/)
