/* @refresh reload */

import { render } from "solid-js/web";
import App from "./App.jsx";
import {
  ApplicationStateContextProvider,
  GlobalContextProvider,
  SelectedDataContextProvider,
  SteamDataContextProvider,
  UIContextProvider,
} from "./Globals.jsx";

render(
  () => (
    <GlobalContextProvider>
      <UIContextProvider>
        <SelectedDataContextProvider>
          <ApplicationStateContextProvider>
            <SteamDataContextProvider>
              <App />
            </SteamDataContextProvider>
          </ApplicationStateContextProvider>
        </SelectedDataContextProvider>
      </UIContextProvider>
    </GlobalContextProvider>
  ),
  document.getElementById("root"),
);
