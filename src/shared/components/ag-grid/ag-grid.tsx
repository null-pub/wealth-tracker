import { AgGridReact, AgGridReactProps } from "ag-grid-react";

export const AgGrid = (props: AgGridReactProps & { id: string }) => {
  const { id, ...rest } = props;
  return (
    <div id={id} className="ag-theme-quartz-dark" style={{ height: "100%" }}>
      <AgGridReact {...rest} />
    </div>
  );
};
