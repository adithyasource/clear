/* @refresh reload */
import { render } from "solid-js/web";

import App from "./App";
import {
  GlobalContextProvider,
  UIContextProvider,
  SelectedDataContextProvider,
  ApplicationStateContextProvider,
  SteamDataContextProvider,
} from "./Globals";

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
