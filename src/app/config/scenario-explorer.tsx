import Close from "@mui/icons-material/Close";
import { Box, Button, Card, CardContent, CardHeader, IconButton, MenuItem, Modal, Paper, Select, Stack, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { Cash } from "shared/components/formatters/cash";
import { Percent } from "shared/components/formatters/percent";
import { scenarioStore } from "shared/store/scenario-store";
import { getLocalDateTime } from "shared/utility/current-date";
import { formatCash } from "shared/utility/format-cash";
import { shortDate } from "shared/utility/format-date";
import { formatPercent } from "shared/utility/format-percent";
import { sortByNumbers } from "shared/utility/sort-by-number";

export const ScenarioExplorer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [year, setYear] = useState(getLocalDateTime().year);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const scenarioData = useStore(scenarioStore);
  const scenarios = scenarioData.scenarios[year];
  const scenario = scenarios?.[scenarioIndex];

  const sortedScenarios = useMemo(() => {
    return scenarios?.toSorted(sortByNumbers(["desc", (x) => x.weight], ["desc", (x) => x.totalPay]));
  }, [scenarios]);

  if (!sortedScenarios || !scenario) {
    return null;
  }

  return (
    <>
      <Card>
        <CardHeader title="Scenario Explorer" />
        <CardContent>
          <Button onClick={() => setIsOpen(true)}>Open Scenario Explorer</Button>
        </CardContent>
      </Card>
      <Modal open={isOpen}>
        <Paper sx={{ position: "absolute", top: 24, bottom: 24, right: 24, left: 24, padding: 2, overflow: "auto" }}>
          <IconButton onClick={() => setIsOpen(false)} sx={{ position: "absolute", top: 8, right: 8 }}>
            <Close />
          </IconButton>
          <Stack spacing={2}>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Typography variant="h5">Scenario Explorer</Typography>
              <DatePicker
                sx={{ width: 90, marginRight: 2 }}
                label={"year"}
                views={["year"]}
                minDate={getLocalDateTime().set({ year: scenarioData?.minYear })}
                maxDate={getLocalDateTime().set({ year: scenarioData?.maxYear })}
                defaultValue={getLocalDateTime()}
                slotProps={{
                  textField: {
                    variant: "standard",
                    label: "",
                  },
                }}
                onChange={(date) => {
                  date && setYear(date.year);
                }}
              />
              <Select variant="standard" onChange={(event) => setScenarioIndex(+event.target.value)} defaultValue={"0"}>
                {sortedScenarios.map((x, i) => (
                  <MenuItem key={i} value={i}>
                    {x.weight} {formatCash(x.totalPay)}
                  </MenuItem>
                ))}
              </Select>
            </Stack>

            <Paper elevation={5} sx={{ padding: 2 }}>
              <SimpleTreeView
                defaultExpandedItems={["_TotalPay", "totalMerit", "pay", "meritBonus", "companyBonus", "lastThreeMeritBonusFactor"]}
              >
                <TreeItem itemId="scenario" label={<span>Scenario</span>}>
                  <TreeItem itemId="weight" label={<span>Weight: {scenario.weight}</span>} />
                  <TreeItem itemId="year" label={<span>Year: {scenario.year}</span>} />
                </TreeItem>
                <TreeItem
                  itemId="_TotalPay"
                  label={
                    <Stack direction={"row"} spacing={1}>
                      <span>Total Pay: </span>
                      <Cash value={scenario.totalPay} compact={false} />
                    </Stack>
                  }
                >
                  <TreeItem
                    itemId="aprToApr"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Apr To Apr: </span>
                        <Cash value={scenario.aprToApr} compact={false} />
                      </Stack>
                    }
                  />
                  <TreeItem
                    itemId="basePay"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Base Pay: </span>
                        <Cash value={scenario.basePay} compact={false} />
                      </Stack>
                    }
                  />
                  <TreeItem
                    itemId="taxablePay"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Taxable Pay: </span>
                        <Cash value={scenario.taxablePay} compact={false} />
                      </Stack>
                    }
                  />
                  <TreeItem
                    itemId="totalPay"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Total Pay: </span>
                        <Cash value={scenario.totalPay} compact={false} />
                      </Stack>
                    }
                  />
                  <TreeItem
                    itemId="totalMerit"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Total Merit Increase: </span>
                        <Percent value={scenario.meritIncreasePct + scenario.equityIncreasePct} />
                      </Stack>
                    }
                  >
                    <TreeItem
                      itemId="meritIncreasePct"
                      label={
                        <Stack direction={"row"} spacing={1}>
                          <span>Merit Increase: </span>
                          <Percent value={scenario.meritIncreasePct} />
                        </Stack>
                      }
                    />
                    <TreeItem
                      itemId="equityIncreasePct"
                      label={
                        <Stack direction={"row"} spacing={1}>
                          <span>Equity Increase: </span>
                          <Percent value={scenario.equityIncreasePct} />
                        </Stack>
                      }
                    />
                  </TreeItem>

                  <TreeItem
                    itemId="currentPaymentIdx"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Current Payment Index: </span>
                        <span>{scenario.currentPaymentIdx}</span>
                      </Stack>
                    }
                  />
                  <TreeItem
                    itemId="remainingPayments"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Remaining Regular Payments: </span>
                        <span>{scenario.remainingRegularPayments}</span>
                      </Stack>
                    }
                  />
                  <TreeItem
                    itemId="current_payment"
                    label={
                      <Stack direction={"row"} spacing={2}>
                        <Box>Current Payment: </Box>
                        <Box>{DateTime.fromISO(scenario.payments[scenario.currentPaymentIdx].payedOn).toFormat(shortDate)}</Box>
                        <Box width={70} textAlign={"right"}>
                          {formatCash(scenario.payments[scenario.currentPaymentIdx].value)}
                        </Box>
                        <Box width={70} textAlign={"right"}>
                          {formatCash(scenario.payments[scenario.currentPaymentIdx].cumulative)}
                        </Box>
                        <Box> {scenario.payments[scenario.currentPaymentIdx].type}</Box>
                      </Stack>
                    }
                  ></TreeItem>
                  <TreeItem itemId="payments" label={"Payments Considered"}>
                    {scenario.payments.toReversed().map((x, i, arr) => (
                      <TreeItem
                        key={i}
                        itemId={`payments-${i}`}
                        label={
                          <Stack
                            sx={{
                              backgroundColor: scenario.currentPaymentIdx == arr.length - 1 - i ? "rgba(0,255,0,.15)" : undefined,
                            }}
                            direction={"row"}
                            spacing={2}
                          >
                            <Box>{arr.length - 1 - i}</Box>
                            <Box>{DateTime.fromISO(x.payedOn).toFormat(shortDate)}</Box>
                            <Box width={70} textAlign={"right"}>
                              {formatCash(x.value)}
                            </Box>
                            <Box width={70} textAlign={"right"}>
                              {formatCash(x.cumulative)}
                            </Box>
                            <Box> {x.type}</Box>
                          </Stack>
                        }
                      />
                    ))}
                  </TreeItem>
                  <TreeItem itemId="pay" label={"Pay"}>
                    {scenario.pay.toReversed().map((x, i) => (
                      <TreeItem key={i} itemId={`$pay-${i}`} label={`${DateTime.fromISO(x.date).year} ${x.value}`} />
                    ))}
                  </TreeItem>
                </TreeItem>

                <TreeItem
                  itemId="meritBonus"
                  label={
                    <Stack direction={"row"} spacing={1}>
                      <span>Merit Bonus: </span>
                      <Cash value={scenario.meritBonus} compact={false} />
                    </Stack>
                  }
                >
                  <TreeItem
                    itemId="mertiBonusPct"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Merit Bonus Percent: </span>
                        <Percent value={scenario.meritBonusPct} />
                      </Stack>
                    }
                  />
                </TreeItem>
                <TreeItem
                  itemId="companyBonus"
                  label={
                    <Stack direction={"row"} spacing={1}>
                      <span>Company Bonus:</span>
                      <Cash value={scenario.companyBonus} compact={false} />
                    </Stack>
                  }
                >
                  <TreeItem
                    itemId="companyBonusFactor.value"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Company Bonus Factor:</span>
                        <Percent value={scenario.companyBonusFactor} />
                      </Stack>
                    }
                  />
                  <TreeItem
                    itemId="companyBonusPct.value"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Company Bonus Percent:</span>
                        <Percent value={scenario.companyBonusPct} />
                      </Stack>
                    }
                  />
                  <TreeItem
                    itemId="lastThreeMeritBonusFactor"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Last Three Merit Bonus Percent:</span>
                        <Percent value={scenario.lastThreeMeritBonusFactor} />
                      </Stack>
                    }
                  >
                    {scenario.lastThreeMeritBonuses.toReversed().map((x, i) => (
                      <TreeItem key={`${i}${x}`} itemId={`lastThreeMeritBonuses${i}`} label={`${year - i} ${formatPercent(x)}`} />
                    ))}
                  </TreeItem>
                </TreeItem>
                <TreeItem
                  itemId="retirementBonus"
                  label={
                    <Stack direction={"row"} spacing={1}>
                      <span>Retirement Bonus:</span>
                      <Cash value={scenario.retirementBonus} compact={false} />
                    </Stack>
                  }
                >
                  <TreeItem
                    itemId="retirementBonusPct"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Retirement Bonus Percent:</span>
                        <Percent value={scenario.retirementBonusPct} />
                      </Stack>
                    }
                  />
                </TreeItem>
              </SimpleTreeView>
            </Paper>
          </Stack>
        </Paper>
      </Modal>
    </>
  );
};
