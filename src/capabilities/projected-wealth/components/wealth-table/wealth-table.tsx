import { Box } from "@mui/system";
import { useTimeSeriesWealth } from "capabilities/projected-wealth/hooks/use-times-series-wealth";
import { AgGrid } from "shared/components/ag-grid";
import { columnConfig } from "./colum-config";

export const WealthTable = () => {
  const data = useTimeSeriesWealth();

  return (
    <Box height={"100%"} width={"100%"}>
      <AgGrid
        id="time-series-wealth"
        rowData={data}
        columnDefs={columnConfig}
        autoSizeStrategy={{ type: "fitGridWidth" }}
        onRowDataUpdated={(e) => e.api.sizeColumnsToFit()}
      />
    </Box>
  );
};
