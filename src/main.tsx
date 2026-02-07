import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "app/router";
import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import "shared/utility/luxon-extensions";
import "shared/web-worker/entry";
import "./index.css";

import { AllCommunityModule as AgChartsAllCommunity, ModuleRegistry as AgChartsModuleRegistry } from "ag-charts-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

AgChartsModuleRegistry.registerModules([AgChartsAllCommunity]);
ModuleRegistry.registerModules([AllCommunityModule]);

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary
      fallbackRender={(props) => {
        const error = props.error as Error;
        return (
          <>
            <div style={{ backgroundColor: "#FFF" }}>{error.message}</div>
            <div style={{ backgroundColor: "#FFF" }}>{error.stack}</div>
          </>
        );
      }}
    >
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </LocalizationProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
