import { Card, CardContent, CardHeader } from "@mui/material";
import { Stack } from "@mui/system";
import { setProjectedWealth } from "shared/store/set-projected-wealth";
import { ConfigEntry } from "./config-entry";

export const Config = () => {
  return (
    <Card>
      <CardHeader title="Configuration" />
      <CardContent>
        <Stack spacing={2}>
          <ConfigEntry
            getStore={(x) => x.projectedWealth.savingsPerPaycheck}
            setStore={(value) => {
              setProjectedWealth("savingsPerPaycheck", value);
            }}
            label="Savings Per Paycheck"
          />
          <ConfigEntry
            getStore={(x) => x.projectedWealth.retirementContributionPaycheck}
            setStore={(value) => {
              setProjectedWealth("retirementContributionPaycheck", value);
            }}
            label="Retirement Contribution Per Paycheck"
          />
          <ConfigEntry
            getStore={(x) => x.projectedWealth.bonusWithholdingsRate}
            setStore={(value) => {
              setProjectedWealth("bonusWithholdingsRate", value);
            }}
            label="Bonus Withholdings Rate"
            variant="percent"
          />
          <Stack direction={"row"} spacing={2} width={"100%"} sx={{ "& > *": { flex: 1 } }}>
            <ConfigEntry
              getStore={(x) => x.projectedWealth.socialSecurityLimit}
              setStore={(value) => {
                setProjectedWealth("socialSecurityLimit", value);
              }}
              label="Social Security Tax Limit"
            />
            <ConfigEntry
              getStore={(x) => x.projectedWealth.socialSecurityTaxRate}
              setStore={(value) => {
                setProjectedWealth("socialSecurityTaxRate", value);
              }}
              label="Social Security Tax"
              variant="percent"
            />
          </Stack>
          <Stack direction={"row"} spacing={2} width={"100%"} sx={{ "& > *": { flex: 1 } }}>
            <ConfigEntry
              getStore={(x) => x.projectedWealth.medicareSupplementalTaxThreshold}
              setStore={(value) => {
                setProjectedWealth("medicareSupplementalTaxThreshold", value);
              }}
              label="Medicare Supplemental Threshold"
            />
            <ConfigEntry
              getStore={(x) => x.projectedWealth.medicareSupplementalTaxRate}
              setStore={(value) => {
                setProjectedWealth("medicareSupplementalTaxRate", value);
              }}
              label="Medicare Supplemental Tax"
              variant="percent"
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
