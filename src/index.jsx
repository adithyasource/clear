/* @refresh reload */

// importing globals
import {
  GlobalContextProvider,
  UIContextProvider,
  SelectedDataContextProvider,
  ApplicationStateContextProvider,
  SteamDataContextProvider,
} from "./Globals";

// importing code snippets and library functions
import { render } from "solid-js/web";
import App from "./App";

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
