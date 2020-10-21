import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { StoreProvider } from "./stores/helpers/StoreContext";
import { createStore } from "./stores/helpers/CreateStore";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

const rootStore = createStore();

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#6030b1",
    },
    secondary: {
      light: "rgba(168, 168, 168, .7)",
      main: "#a8a8a8",
      dark: "rgba(180, 180, 180, 1)",
    },
  },
});

ReactDOM.render(
  <BrowserRouter>
    <StoreProvider value={rootStore}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StoreProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
