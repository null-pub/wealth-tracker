import { useTimeSeriesWealth } from "capabilities/projected-wealth/hooks/use-times-series-wealth";
import { AgGrid } from "shared/components/ag-grid";
import { columnConfig } from "./colum-config";

export const WealthTable = () => {
  const data = useTimeSeriesWealth();

  return (
    <AgGrid
      id="time-series-wealth"
      rowData={data}
      columnDefs={columnConfig}
      autoSizeStrategy={{ type: "fitGridWidth" }}
    />
  );
};
