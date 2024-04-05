import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { ConfigEntry } from "./config-entry";

export const Config = () => {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Configuration</Typography>
      <ConfigEntry configName="savingsPerMonth" label="Monthly Saving Rate" />
      <ConfigEntry configName="retirementContributionPaycheck" label="Retirement Contribution Per Paycheck" />
      <Stack direction={"row"} spacing={2} width={"100%"} sx={{ "& > *": { flex: 1 } }}>
        <ConfigEntry configName="socialSecurityLimit" label="Social Security Tax Limit" />
        <ConfigEntry configName="socialSecurityTaxRate" label="Social Security Tax" variant="percent" />
      </Stack>
      <Stack direction={"row"} spacing={2} width={"100%"} sx={{ "& > *": { flex: 1 } }}>
        <ConfigEntry configName="medicareSupplementalTaxThreshold" label="Medicare Supplemental Threshold" />
        <ConfigEntry configName="medicareSupplementalTaxRate" label="Medicare Supplemental Tax" variant="percent" />
      </Stack>
    </Stack>
  );
};
