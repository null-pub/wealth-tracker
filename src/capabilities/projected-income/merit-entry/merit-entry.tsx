import { Box, Button, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useForm } from "@tanstack/react-form";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { AgGrid } from "shared/components/ag-grid";
import { MeritData, Rating, ratings, ratingsLabels } from "shared/models/store/current";
import { addProjectedIncomeMeritPct, store } from "shared/store";
import { findSameYear } from "shared/utility/find-same-year";
import { z } from "zod";
import { createMeritColumnConfig } from "./column-config";

const disabledStyle = {
  color: "grey",
};

const meritData = z.object({
  date: z.string(),
  meritIncreasePct: z.string().refine((x) => !Number.isNaN(Number(x))),
  meritBonusPct: z.string().refine((x) => !Number.isNaN(Number(x))),
  equityPct: z.string().refine((x) => !Number.isNaN(Number(x))),
  rating: z.nativeEnum(ratings),
  enabled: z.boolean(),
});
type MeritFormData = z.infer<typeof meritData>;

const MeritEntry = () => {
  const merit = useStore(store, (state) => state.projectedIncome.timeSeries.meritPct);
  const defaultDate = merit
    .map((x) => DateTime.fromISO(x.date))
    .reduce((acc, curr) => (curr > acc ? curr : acc), DateTime.fromObject({ year: 0 }))
    .plus({ year: 1 })
    .toISO();

  const form = useForm({
    defaultValues: {
      date: defaultDate,
      meritIncreasePct: "0",
      meritBonusPct: "0",
      equityPct: "0",
      enabled: true,
    } as MeritFormData,
    validators: {
      onSubmit: ({ value }) => {
        const year = DateTime.fromISO(value.date).year;
        const errors: Record<string, string> = {};
        if (findSameYear(year, merit)) {
          errors.date = "Duplicate year";
        }

        const result = meritData.safeParse(value);
        result.error?.errors.forEach((x) => {
          errors[x.path.toString()] = x.message;
        });

        return { fields: errors };
      },
    },
    onSubmit: async ({ value }) => {
      const { date, meritIncreasePct, meritBonusPct, equityPct, rating, enabled } = value;
      addProjectedIncomeMeritPct({
        date,
        meritIncreasePct: +meritIncreasePct / 100,
        meritBonusPct: +meritBonusPct / 100,
        equityPct: +equityPct / 100,
        rating,
        enabled,
      } as MeritData);
    },
  });

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <form>
        <Grid container spacing={2} flex="0 1 auto">
          <Grid size={6}>
            <form.Field name="date">
              {(field) => {
                return (
                  <DatePicker
                    sx={{
                      width: "100%",
                    }}
                    format={"yyyy"}
                    views={["year"]}
                    label={"Year"}
                    value={DateTime.fromISO(field.state.value)}
                    onChange={(value) => {
                      value && field.handleChange(value.toISO()!);
                    }}
                    slotProps={{
                      textField: {
                        helperText: field.state.meta.errors.join(", "),
                        error: field.state.meta.errors.length > 0,
                      },
                    }}
                  />
                );
              }}
            </form.Field>
          </Grid>
          <Grid size={6}>
            <form.Field name="rating">
              {(field) => {
                return (
                  <FormControl fullWidth>
                    <InputLabel id="rating-select-label">Rating</InputLabel>
                    <Select
                      labelId="rating-select-label"
                      fullWidth
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value as Rating)}
                      error={field.state.meta.errors.length > 0}
                      label="Rating"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {Object.values(ratings).map((value) => (
                        <MenuItem key={value} value={value}>
                          {ratingsLabels[value as keyof typeof ratingsLabels]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              }}
            </form.Field>
          </Grid>
          <Grid size={4}>
            <form.Field name="meritIncreasePct">
              {(field) => (
                <TextField
                  label="Merit Increase"
                  value={field.state.value}
                  placeholder="0"
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={field.state.meta.errors.length > 0}
                  helperText={field.state.meta.errors.join(", ")}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">%</InputAdornment>,
                    },
                  }}
                />
              )}
            </form.Field>
          </Grid>
          <Grid size={4}>
            <form.Field name="meritBonusPct">
              {(field) => (
                <TextField
                  label="Merit Bonus"
                  value={field.state.value}
                  placeholder="0"
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={field.state.meta.errors.length > 0}
                  helperText={field.state.meta.errors.join(", ")}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">%</InputAdornment>,
                    },
                  }}
                />
              )}
            </form.Field>
          </Grid>
          <Grid size={4}>
            <form.Field name="equityPct">
              {(field) => (
                <TextField
                  label="Equity"
                  value={field.state.value}
                  placeholder="0"
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={field.state.meta.errors.length > 0}
                  helperText={field.state.meta.errors.join(", ")}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">%</InputAdornment>,
                    },
                  }}
                />
              )}
            </form.Field>
          </Grid>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <>
                <Button
                  fullWidth
                  type="submit"
                  disabled={!canSubmit}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                >
                  {isSubmitting ? "..." : "Submit"}
                </Button>
              </>
            )}
          </form.Subscribe>
        </Grid>
      </form>

      <Box sx={{ paddingTop: 2, flex: "1 1 auto" }}>
        <AgGrid
          getRowStyle={(x) => (!x.data.enabled ? disabledStyle : undefined)}
          rowData={merit}
          columnDefs={createMeritColumnConfig()}
          id="merit-history"
          stopEditingWhenCellsLoseFocus
        />
      </Box>
    </Box>
  );
};

interface MeritLayoutProps {
  title: string;
  defaultDate: DateTime;
}

export const MeritEntryLayout = (props: MeritLayoutProps) => {
  const { title } = props;
  return (
    <Paper sx={{ padding: 2, height: "100%", width: 850, flexShrink: 0 }}>
      <Box display="flex" flexDirection="column" height="100%">
        <Box flex="0 1 auto" marginBottom={4} display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">{title} (%)</Typography>
        </Box>
        <Box flex="1 1 auto">
          <MeritEntry />
        </Box>
      </Box>
    </Paper>
  );
};
