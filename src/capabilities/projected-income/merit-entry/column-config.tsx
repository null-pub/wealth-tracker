import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Button, Checkbox, Stack, Tooltip } from "@mui/material";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { DateTime } from "luxon";
import { Percent } from "shared/components/formatters/percent";
import { MeritData, Rating, ratings, ratingsLabels } from "shared/models/store/current";
import { removeProjectedIncomeMerit, updateProjectedIncomeMerit } from "shared/store";

export const createMeritColumnConfig = (): ColDef<MeritData>[] =>
  [
    {
      colId: "enabled",
      cellStyle: { display: "inline-flex", padding: "0px" },
      sortable: false,
      filter: false,
      width: 50,
      cellRenderer: (params: ICellRendererParams<MeritData>) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Delete">
            <Checkbox
              checked={params.data?.enabled}
              disableRipple
              onClick={() => {
                params.data && updateProjectedIncomeMerit(params.data, { ...params.data, enabled: !params.data.enabled });
              }}
            />
          </Tooltip>
        </Stack>
      ),
    },
    {
      headerName: "Year",
      colId: "date",
      sort: "desc",
      width: 85,
      valueFormatter: (params) => {
        if (!params.data?.date) {
          return "";
        }
        const date = DateTime.fromISO(params.data?.date);
        return date.toFormat("yyyy");
      },
      valueGetter: (params) => params.data?.date,
      cellEditor: "agNumberCellEditor",
      editable: true,
      valueSetter: (params) => {
        const date = DateTime.fromISO(params.data.date).set({ year: params.newValue });

        if (date.isValid) {
          updateProjectedIncomeMerit(params.data, {
            ...params.data,
            date: date.toISO()!,
          });
          return true;
        }
        return false;
      },
    },
    {
      width: 150,
      headerName: "Merit Increase",
      valueGetter: (params) => (params.data?.meritIncreasePct ?? 0) * 100,
      cellRenderer: (params: ICellRendererParams) => <Percent value={params.value / 100} />,
      type: "numericColumn",
      editable: true,
      cellEditor: "agNumberCellEditor",
      valueSetter: (params) => {
        updateProjectedIncomeMerit(params.data, {
          ...params.data,
          meritIncreasePct: params.newValue / 100,
        });
        return true;
      },
    },
    {
      width: 135,
      headerName: "Merit Bonus",
      valueGetter: (params) => (params.data?.meritBonusPct ?? 0) * 100,
      cellRenderer: (params: ICellRendererParams) => <Percent value={params.value / 100} />,
      type: "numericColumn",
      editable: true,
      cellEditor: "agNumberCellEditor",
      valueSetter: (params) => {
        updateProjectedIncomeMerit(params.data, {
          ...params.data,
          meritBonusPct: params.newValue / 100,
        });
        return true;
      },
    },

    {
      width: 100,
      headerName: "Equity",
      valueGetter: (params) => (params.data?.equityPct ?? 0) * 100,
      cellRenderer: (params: ICellRendererParams) => <Percent value={params.value / 100} />,
      type: "numericColumn",
      editable: true,
      cellEditor: "agNumberCellEditor",
      valueSetter: (params) => {
        updateProjectedIncomeMerit(params.data, {
          ...params.data,
          equityPct: params.newValue / 100,
        });
        return true;
      },
    },
    {
      width: 225,
      headerName: "Rating",
      valueGetter: (params) => (params.data?.rating ? ratingsLabels[params.data?.rating] : "None"),
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["None", ...Object.values(ratings).map((x) => ratingsLabels[x])],
      },
      editable: true,
      valueSetter: (params) => {
        const rating = Object.entries(ratingsLabels).find(([, label]) => {
          return params.newValue === label;
        })?.[0] as Rating;
        if (rating) {
          updateProjectedIncomeMerit(params.data, {
            ...params.data,
            rating,
          });
          return true;
        }
        return false;
      },
    },

    {
      colId: "actions",
      flex: 1,
      cellStyle: { display: "inline-flex", padding: "0px" },
      sortable: false,
      filter: false,
      cellRenderer: (params: ICellRendererParams<MeritData>) => (
        <Button
          onClick={() => {
            params.data && removeProjectedIncomeMerit(params.data);
          }}
          size="small"
          color="error"
        >
          <DeleteForeverIcon />
        </Button>
      ),
    },
  ] satisfies ColDef<MeritData>[];
