/* @refresh reload */
import { render } from "solid-js/web";

import App from "./App";

render(
  () => (
    <>
      <head>
        <link rel="stylesheet" href="hint.min.css" />
      </head>
      <App />
    </>
  ),
  document.getElementById("root"),
);
