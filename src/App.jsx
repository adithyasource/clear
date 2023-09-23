import { createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { writeTextFile, BaseDirectory, readTextFile } from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";

import "./App.css";

function App() {
  const [selectedGame, setSelectedGame] = createSignal();
  const [gameName, setGameName] = createSignal();
  const [libraryData, setLibraryData] = createSignal("asd");

  async function getData() {
    setLibraryData(
      JSON.parse(
        await readTextFile("data.json", {
          dir: BaseDirectory.Desktop,
        })
      )
    );
    console.log("data gotten");
  }

  onMount(() => {
    getData();
  });

  function openGame(gameLocation) {
    invoke("openGame", {
      gameLocation: gameLocation,
    });
  }

  async function selectGame() {
    setSelectedGame(
      await open({
        multiple: false,
        filters: [
          {
            name: "Executable",
            extensions: ["exe", "lnk"],
          },
        ],
      })
    );
    console.log(selectedGame());
  }

  async function addGame() {
    writeToLibrary = await writeTextFile(
      {
        path: "data.json",
        contents: JSON.stringify({
          games: [
            ...libraryData().games,
            { location: selectedGame(), name: gameName() },
          ],
        }),
      },
      {
        dir: BaseDirectory.Desktop,
      }
    );
    getData();
  }

  return (
    <>
      damn
      <button
        onClick={() => {
          openGame(
            "C:\\Users\\getsg\\Pictures\\Screenshots\\Screenshot (2962).png"
          );
        }}
      >
        da
      </button>
      <div id="page">
        <input
          type="text"
          name=""
          id=""
          onInput={(e) => {
            console.log(e.currentTarget.value);
            setGameName(e.currentTarget.value);
          }}
          placeholder="name of game"
        />
        <button onClick={selectGame}>select game</button>
        <button onClick={addGame}>add game</button>
      </div>
      <div>damn {JSON.stringify(libraryData())}</div>
    </>
  );
}

export default App;
