import { DateTime } from "luxon";
import { beforeEach, describe, expect, test } from "vitest";
import { TimeSeriesKeys } from "../../../shared/models/store/current";
import { addProjectedIncome } from "../../../shared/store/add-projected-income";
import { removeProjectedIncome } from "../../../shared/store/remove-projected-income";
import { store } from "../../../shared/store/store";
import { updateProjectedIncome } from "../../../shared/store/update-projected-income";

describe("Projected Income Operations", () => {
  beforeEach(() => {
    localStorage.clear();
    store.setState(() => ({
      version: 5,
      wealth: {},
      projectedIncome: {
        timeSeries: {
          paycheck: [],
          meritBonusPct: [],
          companyBonusPct: [],
          meritIncreasePct: [],
          equityPct: [],
          meritBonus: [],
          companyBonus: [],
          retirementBonus: [],
        },
      },
      projectedWealth: {
        savingsPerMonth: 0,
        retirementContributionPaycheck: 0,
        bonusWithholdingsRate: 0,
        socialSecurityLimit: 0,
        socialSecurityTaxRate: 0,
        medicareSupplementalTaxThreshold: 0,
        medicareSupplementalTaxRate: 0,
      },
    }));
  });

  test("should add projected income", () => {
    const date = DateTime.fromISO("2025-01-01");
    const value = 5000;
    const timeSeries: TimeSeriesKeys = "paycheck";

    addProjectedIncome(date, timeSeries, value);

    const state = store.state;
    expect(state.projectedIncome.timeSeries[timeSeries]).toHaveLength(1);
    expect(state.projectedIncome.timeSeries[timeSeries][0].value).toBe(value);
    expect(state.projectedIncome.timeSeries[timeSeries][0].date).toBe(date.toString());
  });

  test("should remove projected income", () => {
    const date = DateTime.fromISO("2025-01-01").toString();
    const value = 5000;
    const timeSeries: TimeSeriesKeys = "paycheck";
    const entry = { date, value };

    // Add entry first
    store.setState((prev) => ({
      ...prev,
      projectedIncome: {
        ...prev.projectedIncome,
        timeSeries: {
          ...prev.projectedIncome.timeSeries,
          [timeSeries]: [entry],
        },
      },
    }));

    removeProjectedIncome(timeSeries, entry);

    const state = store.state;
    expect(state.projectedIncome.timeSeries[timeSeries]).toHaveLength(0);
  });

  test("should update projected income", () => {
    const date = DateTime.fromISO("2025-01-01").toString();
    const initialValue = 5000;
    const newValue = 6000;
    const timeSeries: TimeSeriesKeys = "paycheck";
    const entry = { date, value: initialValue };

    // Add entry first
    store.setState((prev) => ({
      ...prev,
      projectedIncome: {
        ...prev.projectedIncome,
        timeSeries: {
          ...prev.projectedIncome.timeSeries,
          [timeSeries]: [entry],
        },
      },
    }));

    updateProjectedIncome(timeSeries, entry, newValue);

    const state = store.state;
    expect(state.projectedIncome.timeSeries[timeSeries][0].value).toBe(newValue);
  });

  test("should sort entries by date when adding new entry", () => {
    const timeSeries: TimeSeriesKeys = "paycheck";
    const entries = [
      { date: DateTime.fromISO("2025-02-01"), value: 5000 },
      { date: DateTime.fromISO("2025-01-01"), value: 4000 },
      { date: DateTime.fromISO("2025-03-01"), value: 6000 },
    ];

    // Add entries in unsorted order
    entries.forEach((entry) => {
      addProjectedIncome(entry.date, timeSeries, entry.value);
    });

    const state = store.state;
    const storedEntries = state.projectedIncome.timeSeries[timeSeries];
    expect(storedEntries).toHaveLength(3);
    expect(DateTime.fromISO(storedEntries[0].date).toMillis()).toBeLessThan(DateTime.fromISO(storedEntries[1].date).toMillis());
    expect(DateTime.fromISO(storedEntries[1].date).toMillis()).toBeLessThan(DateTime.fromISO(storedEntries[2].date).toMillis());
  });
});
