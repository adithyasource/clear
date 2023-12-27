## clear-api

[SteamGridDB](https://www.steamgriddb.com) proxy for [clear](https://clear.adithya.zip), a video game library manager.

\
Built on top of [Vercel's Flask Template](https://vercel.com/templates/python/flask-hello-world) and hosted there.
\
The following commands are available:

- Get a game's SGDB ID using the game's Steam ID
  ```
  /?steamID=70
  ```
- Get a game's SGDB ID using the game's name
  ```
  /?gameName=cyberpunk%202077
  ```
- Get links to a game's grids, heros, logos and icons using the game's SGDB ID
  ```
  /?assets=24116
  ```
**Next couple parameters are probably not useful for most applications but are used in 'clear'**

- Get a binary integer list for one grid, hero, logo and icon of a game using the game's SGDB ID
  ```
  /?limitedAssets=24116
  ```
- Get a binary integer list for the any given image link
  ```
  /?image=https://cdn2.steamgriddb.com/thumb/12f59e05c632bd17f2409172507d6407.png
  ```
- Get the current version of 'clear'
  ```
  /?version=put_any_string_here_since_it_doesnt_get_read
  ```
