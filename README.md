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

if there are any features or bug fixes you'd like to suggest, please open a new [issue](https://github.com/adithyasource/clear/issues)

## getting started

<p>dev requirements for the project</p>
<table>
    <tbody>
        <tr>
            <th>app/website</th>
            <td><a href="https://nodejs.org/en" target="_blank">nodejs</a></td>
            <td><a href="https://pnpm.io/installation" target="_blank">pnpm</a></td>
            <td><a href="https://www.rust-lang.org/tools/install" target="_blank">rust</a></td>
        </tr>
        <tr>
            <th>api</th>
            <td><a href="https://docs.astral.sh/uv/getting-started/installation/" target="_blank">uv</a></td>
        </tr>
    </tbody>
</table>

when that is done you can run the code in development mode, by doing the
following:

- `git clone https://github.com/adithyasource/clear`
- `cd clear`
- `pnpm install`
- `pnpm run tauri dev`

to build the app, you can run `pnpm run tauri build`

<details>
  <summary>website</summary>
  <ul>
    <li><code>cd website</code></li>
    <li><code>pnpm install</code></li>
    <li><code>pnpm run dev</code> or <code>pnpm run build</code> <em>(to compile tailwind)</em></li>
  </ul>
</details>

<details>
  <summary>api</summary>
  <ul>
    <li><code>cd api</code></li>
    <li><code>uv sync</code></li>
    <li><code>uv run api/app.py</code></li>
  </ul>
</details>

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

<p>required editor tools</p>
<table>
    <tbody>
        <tr>
            <th>app/website</th>
            <td><a href="https://biomejs.dev/guides/getting-started/" target="_blank">biome</a></td>
        </tr>
        <tr>
            <th>api</th>
            <td><a href="https://docs.astral.sh/ruff/installation/" target="_blank">ruff</a></td>
            <td><a href="https://docs.astral.sh/ty/installation/" target="_blank">ty</a></td>
        </tr>
    </tbody>
</table>

make sure to format and lint the code before committing, either by using your editor's features or by running `pnpm lint` and `pnpm format` for app code or `ruff check` and `ruff format` for api code

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
