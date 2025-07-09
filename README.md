# clear

<table>
    <tbody>
        <tr>
            <td><img src="https://img.shields.io/github/downloads/adithyasource/clear/1.0.0/total.svg?style=flat-square&logo=none&label=downloads:&labelColor=666666&color=666666"></td>
            <td><a href="https://github.com/adithyasource/clear/releases/tag/1.0.0">download</a></td>
            <td><a href="https://clear.adithya.zip/" target="_blank">> product page</a></td>
        </tr>
    </tbody>
</table>

![image](https://github.com/adithyasource/clear/assets/140549783/bd4dae97-4b0b-466f-a1ff-570ae05a0eec)

## feedback

if there are any features or bug fixes you'd like to suggest, please open a new
issue in the "Issue" tab.

## getting started

in order to set up your dev environment, you need to have nodejs, npm and rust
installed\
when that is done you can run the code in development mode, by doing the
following:

- ```git clone https://github.com/adithyasource/clear```
- ```cd clear```
- ```npm install```
- ```npm run tauri dev```

to build the app, you can run `npm run tauri build`

## contributing

thank you so much for considering contributing to clear! i really appreciate it ^-^ \
expand the following sections to know more!

<details>
<summary>translations</summary>

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

</details>

<details>

<summary>code</summary>

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
    
</details>

<details>

<summary>formatting and linting</summary>

the project uses the [biome](https://biomejs.dev/) toolchain in order
to format and lint code. make sure that it is installed and set up in your
editor.\
\
install biome globally by using ```npm install -g @biomejs/biome``` and setup
up biome for
[neovim (with lspconfig)](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md#biome),
[vscode](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
or [zed](https://biomejs.dev/reference/zed/)\
\
make sure to format and lint the code before committing, either by using your
editor's features or by running  ```npm lint``` and ```npm format```

    
</details>

## api

<details>
<summary>the following routes are available</summary>

- get a game's SGDB ID using the game's Steam ID
  ```
  /?steamID=70
  ```
- get a game's SGDB ID using the game's name
  ```
  /?gameName=cyberpunk%202077
  ```
- get links to a game's grids, heroes, logos and icons using the game's SGDB ID
  ```
  /?assets=24116
  ```
- get a binary integer list for one grid, hero, logo and icon of a game using the game's SGDB ID
  ```
  /?limitedAssets=24116
  ```
- get a binary integer list for the any given image link
  ```
  /?image=https://cdn2.steamgriddb.com/thumb/12f59e05c632bd17f2409172507d6407.png
  ```
- get the current version of 'clear'
  ```
  /?version=put_any_string_here_since_it_doesnt_get_read
  ```
</details>


## acknowledgments

<table>
    <tbody>
        <tr>
            <th>tech</th>
            <td><a href="https://tauri.app" target="_blank">tauri</a></td>
            <td><a href="https://www.solidjs.com" target="_blank">solidjs</a></td>
            <td><a href="https://tailwindcss.com" target="_blank">tailwind</a></td>
        </tr>
    </tbody>
</table>

<table>
    <tbody>
        <tr>
            <th>design</th>
            <td><a href="https://basicons.xyz" target="_blank">basicons</a></td>
        </tr>
    </tbody>
</table>

<table>
    <tbody>
        <tr>
            <th>code snippets</th>
            <td><a href="https://github.com/bevacqua/fuzzysearch" target="_blank">fuzzy search</a></td>
            <td><a href="https://github.com/node-steam/vdf" target="_blank">valve vdf parser</a></td>
        </tr>
    </tbody>
</table>

<table>
    <tbody>
        <tr>
            <th>for api</th>
            <td><a href="https://pypi.org/project/Flask/" target="_blank">flask</a></td>
            <td><a href="https://www.steamgriddb.com/api/v2" target="_blank">steamgriddb</a></td>
        </tr>
    </tbody>
</table>
