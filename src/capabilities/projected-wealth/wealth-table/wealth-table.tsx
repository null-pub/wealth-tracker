import { Box } from "@mui/system";
import { AgGrid } from "shared/components/ag-grid";
import { getLocalDateTime } from "shared/utility/current-date";
import { useTimeSeriesWealth } from "../hooks/use-times-series-wealth";
import { columnConfig } from "./colum-config";

export const WealthTable = () => {
  const dataYear = getLocalDateTime().year + 1;
  const data = useTimeSeriesWealth(dataYear);

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
