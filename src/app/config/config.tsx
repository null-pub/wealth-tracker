import { Card, CardContent, CardHeader } from "@mui/material";
import { Stack } from "@mui/system";
import { ConfigEntry } from "./config-entry";

export const Config = () => {
  return (
    <Card>
      <CardHeader title="Configuration" />
      <CardContent>
        <Stack spacing={2}>
          <ConfigEntry configName="savingsPerMonth" label="Monthly Saving Rate" />
          <ConfigEntry configName="retirementContributionPaycheck" label="Retirement Contribution Per Paycheck" />
          <ConfigEntry configName="bonusWitholdingsRate" label="Bonus Witholdings Rate" variant="percent" />
          <Stack direction={"row"} spacing={2} width={"100%"} sx={{ "& > *": { flex: 1 } }}>
            <ConfigEntry configName="socialSecurityLimit" label="Social Security Tax Limit" />
            <ConfigEntry configName="socialSecurityTaxRate" label="Social Security Tax" variant="percent" />
          </Stack>
          <Stack direction={"row"} spacing={2} width={"100%"} sx={{ "& > *": { flex: 1 } }}>
            <ConfigEntry configName="medicareSupplementalTaxThreshold" label="Medicare Supplemental Threshold" />
            <ConfigEntry configName="medicareSupplementalTaxRate" label="Medicare Supplemental Tax" variant="percent" />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
