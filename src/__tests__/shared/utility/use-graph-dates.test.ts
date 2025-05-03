import { Account, Mortgage } from "shared/models/store/current";
import { useGraphDates } from "shared/utility/use-graph-dates";
import { describe, expect, it } from "vitest";

describe("useGraphDates", () => {
  it("should extract and sort unique dates from accounts", () => {
    const accounts: Account[] = [
      {
        type: "account",
        data: [
          { date: "2025-01-01", value: 1000 },
          { date: "2025-06-01", value: 2000 },
        ],
        hidden: false,
      },
      {
        type: "account",
        data: [
          { date: "2025-01-01", value: 3000 },
          { date: "2025-03-15", value: 4000 },
        ],
        hidden: false,
      },
    ];

    const result = useGraphDates(accounts);

    expect(result).toHaveLength(3); // Should deduplicate dates
    expect(result[0].toISODate()).toBe("2025-01-01");
    expect(result[1].toISODate()).toBe("2025-03-15");
    expect(result[2].toISODate()).toBe("2025-06-01");
  });

  it("should handle both Account and Mortgage types", () => {
    const accounts: (Account | Mortgage)[] = [
      {
        type: "account",
        data: [{ date: "2025-01-01", value: 1000 }],
        hidden: false,
      },
      {
        type: "mortgage",
        data: [{ date: "2025-02-01", value: 2000 }],
        loan: {
          ownershipPct: 1,
          principal: 400000,
          firstPaymentDate: "2025-02-01",
          paymentsPerYear: 12,
          ratePct: 0.05,
          payment: 2148.42,
        },
      },
    ];

    const result = useGraphDates(accounts);

    expect(result).toHaveLength(2);
    expect(result[0].toISODate()).toBe("2025-01-01");
    expect(result[1].toISODate()).toBe("2025-02-01");
  });

  it("should return empty array for empty input", () => {
    const result = useGraphDates([]);
    expect(result).toHaveLength(0);
  });
});
