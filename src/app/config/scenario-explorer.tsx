import Close from "@mui/icons-material/Close";
import { Box, Button, IconButton, MenuItem, Modal, Paper, Select, Stack, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem2 } from "@mui/x-tree-view/TreeItem2";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useState } from "react";
import { Cash } from "shared/components/formatters/cash";
import { Percent } from "shared/components/formatters/percent";
import { scenarioStore } from "shared/store/scenario-store";
import { getLocalDateTime } from "shared/utility/current-date";
import { formatCash } from "shared/utility/format-cash";
import { shortDate } from "shared/utility/format-date";
import { formatPercent } from "shared/utility/format-percent";

export const ScenarioExplorer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [year, setYear] = useState(getLocalDateTime().year);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const scenarioData = useStore(scenarioStore);
  const scenarios = scenarioData.scenarios[year];
  const scenario = scenarios?.[scenarioIndex];
  if (!scenario) {
    return null;
  }
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Scenario Explorer</Button>
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
                onYearChange={(year) => {
                  setYear(year.year);
                }}
              />
              <Select variant="standard" onChange={(event) => setScenarioIndex(+event.target.value)} defaultValue={"0"}>
                {scenarios?.map((x, i) => (
                  <MenuItem key={i} value={i}>
                    {x.weight} {formatCash(x.totalPay)}
                  </MenuItem>
                ))}
              </Select>
            </Stack>

            <Paper elevation={5} sx={{ padding: 2 }}>
              <SimpleTreeView
                defaultExpandedItems={[
                  "_TotalPay",
                  "totalMerit",
                  "pay",
                  "meritBonus",
                  "companyBonus",
                  "lastThreeMeritBonusFactor",
                ]}
              >
                <TreeItem2 itemId="scenario" label={<span>Scenario</span>}>
                  <TreeItem2 itemId="weight" label={<span>Weight: {scenario.weight}</span>} />
                  <TreeItem2 itemId="year" label={<span>Year: {scenario.year}</span>} />
                </TreeItem2>
                <TreeItem2
                  itemId="_TotalPay"
                  label={
                    <Stack direction={"row"} spacing={1}>
                      <span>Total Pay: </span>
                      <Cash value={scenario.totalPay} compact={false} />
                    </Stack>
                  }
                >
                  <TreeItem2
                    itemId="aprToApr"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Apr To Apr: </span>
                        <Cash value={scenario.aprToApr} compact={false} />
                      </Stack>
                    }
                  />
                  <TreeItem2
                    itemId="basePay"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Base Pay: </span>
                        <Cash value={scenario.basePay} compact={false} />
                      </Stack>
                    }
                  />
                  <TreeItem2
                    itemId="taxablePay"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Taxable Pay: </span>
                        <Cash value={scenario.taxablePay} compact={false} />
                      </Stack>
                    }
                  />
                  <TreeItem2
                    itemId="totalPay"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Total Pay: </span>
                        <Cash value={scenario.totalPay} compact={false} />
                      </Stack>
                    }
                  />
                  <TreeItem2
                    itemId="totalMerit"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Total Merit Increase: </span>
                        <Percent value={scenario.meritIncreasePct + scenario.equityIncreasePct} />
                      </Stack>
                    }
                  >
                    <TreeItem2
                      itemId="meritIncreasePct"
                      label={
                        <Stack direction={"row"} spacing={1}>
                          <span>Merit Increase: </span>
                          <Percent value={scenario.meritIncreasePct} />
                        </Stack>
                      }
                    />
                    <TreeItem2
                      itemId="equityIncreasePct"
                      label={
                        <Stack direction={"row"} spacing={1}>
                          <span>Equity Increase: </span>
                          <Percent value={scenario.equityIncreasePct} />
                        </Stack>
                      }
                    />
                  </TreeItem2>

                  <TreeItem2
                    itemId="currentPaymentIdx"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Current Payment Index: </span>
                        <span>{scenario.currentPaymentIdx}</span>
                      </Stack>
                    }
                  />
                  <TreeItem2
                    itemId="remainingPayments"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Remaining Regular Payments: </span>
                        <span>{scenario.remainingRegularPayments}</span>
                      </Stack>
                    }
                  />
                  <TreeItem2
                    itemId="current_payment"
                    label={
                      <Stack direction={"row"} spacing={2}>
                        <Box>Current Payment: </Box>
                        <Box>
                          {DateTime.fromISO(scenario.payments[scenario.currentPaymentIdx].payedOn).toFormat(shortDate)}
                        </Box>
                        <Box width={70} textAlign={"right"}>
                          {formatCash(scenario.payments[scenario.currentPaymentIdx].value)}
                        </Box>
                        <Box width={70} textAlign={"right"}>
                          {formatCash(scenario.payments[scenario.currentPaymentIdx].cumulative)}
                        </Box>
                        <Box> {scenario.payments[scenario.currentPaymentIdx].type}</Box>
                      </Stack>
                    }
                  ></TreeItem2>
                  <TreeItem2 itemId="payments" label={"Payments Considered"}>
                    {scenario.payments.toReversed().map((x, i, arr) => (
                      <TreeItem2
                        key={i}
                        itemId={`payments-${i}`}
                        label={
                          <Stack
                            sx={{
                              backgroundColor:
                                scenario.currentPaymentIdx == arr.length - 1 - i ? "rgba(0,255,0,.15)" : undefined,
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
                  </TreeItem2>
                  <TreeItem2 itemId="pay" label={"Pay"}>
                    {scenario.pay.toReversed().map((x, i) => (
                      <TreeItem2 key={i} itemId={`$pay-${i}`} label={`${DateTime.fromISO(x.date).year} ${x.value}`} />
                    ))}
                  </TreeItem2>
                </TreeItem2>

                <TreeItem2
                  itemId="meritBonus"
                  label={
                    <Stack direction={"row"} spacing={1}>
                      <span>Merit Bonus: </span>
                      <Cash value={scenario.meritBonus} compact={false} />
                    </Stack>
                  }
                >
                  <TreeItem2
                    itemId="mertiBonusPct"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Merit Bonus Percent: </span>
                        <Percent value={scenario.meritBonusPct} />
                      </Stack>
                    }
                  />
                </TreeItem2>
                <TreeItem2
                  itemId="companyBonus"
                  label={
                    <Stack direction={"row"} spacing={1}>
                      <span>Company Bonus:</span>
                      <Cash value={scenario.companyBonus} compact={false} />
                    </Stack>
                  }
                >
                  <TreeItem2
                    itemId="companyBonusFactor.value"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Company Bonus Factor:</span>
                        <Percent value={scenario.companyBonusFactor} />
                      </Stack>
                    }
                  />
                  <TreeItem2
                    itemId="companyBonusPct.value"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Company Bonus Percent:</span>
                        <Percent value={scenario.companyBonusPct} />
                      </Stack>
                    }
                  />
                  <TreeItem2
                    itemId="lastThreeMeritBonusFactor"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Last Three Merit Bonus Percent:</span>
                        <Percent value={scenario.lastThreeMeritBonusFactor} />
                      </Stack>
                    }
                  >
                    {scenario.lastThreeMeritBonuses.toReversed().map((x, i) => (
                      <TreeItem2
                        key={`${i}${x}`}
                        itemId={`lastThreeMeritBonuses${i}`}
                        label={`${year - i} ${formatPercent(x)}`}
                      />
                    ))}
                  </TreeItem2>
                </TreeItem2>
                <TreeItem2
                  itemId="retirementBonus"
                  label={
                    <Stack direction={"row"} spacing={1}>
                      <span>Retirement Bonus:</span>
                      <Cash value={scenario.retirementBonus} compact={false} />
                    </Stack>
                  }
                >
                  <TreeItem2
                    itemId="retirementBonusPct"
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <span>Retirement Bonus Percent:</span>
                        <Percent value={scenario.retirementBonusPct} />
                      </Stack>
                    }
                  />
                </TreeItem2>
              </SimpleTreeView>
            </Paper>
          </Stack>
        </Paper>
      </Modal>
    </>
  );
};
