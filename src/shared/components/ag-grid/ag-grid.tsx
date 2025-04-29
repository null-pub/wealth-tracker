import { AgGridReact, AgGridReactProps } from "ag-grid-react";

import { themeQuartz } from "ag-grid-community";

// to use myTheme in an application, pass it to the theme grid option
const myTheme = themeQuartz.withParams({
  backgroundColor: "#1f2836",
  browserColorScheme: "dark",
  chromeBackgroundColor: {
    ref: "foregroundColor",
    mix: 0.07,
    onto: "backgroundColor",
  },
  foregroundColor: "#FFF",
  headerFontSize: 14,
});

export const AgGrid = (props: AgGridReactProps & { id: string }) => {
  const { id, ...rest } = props;
  return (
    <div id={id} style={{ height: "100%" }}>
      <AgGridReact {...rest} theme={myTheme} suppressMovableColumns />
    </div>
  );
};
