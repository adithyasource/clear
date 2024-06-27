/* @refresh reload */
import { render } from "solid-js/web";

import App from "./App";
import {
  GlobalContextProvider,
  UIContextProvider,
  SelectedDataContextProvider,
  ApplicationStateContextProvider,
  DataUpdateContextProvider,
  SteamDataContextProvider
} from "./Globals";

render(
  () => (
    <GlobalContextProvider>
      <UIContextProvider>
        <SelectedDataContextProvider>
          <ApplicationStateContextProvider>
            <DataUpdateContextProvider>
              <SteamDataContextProvider>
                <App />
              </SteamDataContextProvider>
            </DataUpdateContextProvider>
          </ApplicationStateContextProvider>
        </SelectedDataContextProvider>
      </UIContextProvider>
    </GlobalContextProvider>
  ),
  document.getElementById("root")
);
