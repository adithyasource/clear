/* @refresh reload */

// importing globals
import {
  ApplicationStateContextProvider,
  GlobalContextProvider,
  SelectedDataContextProvider,
  SteamDataContextProvider,
  UIContextProvider,
} from "./Globals.jsx";

// importing code snippets and library functions
import { render } from "solid-js/web";
import App from "./App.jsx";

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
  document.getElementById("root")!,
);
