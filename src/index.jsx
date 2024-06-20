/* @refresh reload */
import { render } from "solid-js/web";

import App from "./App";
import {
  GlobalContextProvider,
  UIContextProvider,
  SelectedDataContextProvider,
  ApplicationStateContextProvider,
  DataEntryContextProvider,
  DataUpdateContextProvider,
  SteamDataContextProvider
} from "./Globals";

render(
  () => (
    <GlobalContextProvider>
      <UIContextProvider>
        <SelectedDataContextProvider>
          <ApplicationStateContextProvider>
            <DataEntryContextProvider>
              <DataUpdateContextProvider>
                <SteamDataContextProvider>
                  <App />
                </SteamDataContextProvider>
              </DataUpdateContextProvider>
            </DataEntryContextProvider>
          </ApplicationStateContextProvider>
        </SelectedDataContextProvider>
      </UIContextProvider>
    </GlobalContextProvider>
  ),
  document.getElementById("root")
);
