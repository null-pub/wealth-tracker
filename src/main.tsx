import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { App } from "app/app.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import "./index.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary
      fallbackRender={(props) => {
        return (
          <>
            <div style={{ backgroundColor: "#FFF" }}>{props.error.message}</div>
            <div style={{ backgroundColor: "#FFF" }}>{props.error.stackTrace}</div>
          </>
        );
      }}
    >
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </LocalizationProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
