import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  calculateNextPaymentDate,
  getUserTimeZone,
} from "@/features/payment/utils/date-calculations";

describe("Date Calculation Utilities", () => {
  describe("calculateNextPaymentDate", () => {
    it("returns null when invoice due date is missing", () => {
      const result = calculateNextPaymentDate(undefined, new Date());
      expect(result).toBeNull();
    });

    it("returns null when payment cycle date is missing", () => {
      const result = calculateNextPaymentDate(new Date(), undefined);
      expect(result).toBeNull();
    });

    it("calculates payment on same month when payment day is after invoice due date", () => {
      // Set invoice due date to 10th of current month
      const today = new Date();
      const invoiceDate = new Date(today.getFullYear(), today.getMonth(), 10);

      // Set payment cycle date to 15th of current month
      const paymentCycleDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        15
      );

      const result = calculateNextPaymentDate(invoiceDate, paymentCycleDate);

      // Verify result is in same month
      expect(result).not.toBeNull();
      expect(result?.getMonth()).toBe(today.getMonth());
      expect(result?.getDate()).toBe(15);

      // Verify time is set to 6:00:00 AM
      expect(result?.getHours()).toBe(6);
      expect(result?.getMinutes()).toBe(0);
      expect(result?.getSeconds()).toBe(0);
    });

    it("calculates payment in next month when payment day is before invoice due date", () => {
      // Set invoice due date to 20th of current month
      const today = new Date();
      const invoiceDate = new Date(today.getFullYear(), today.getMonth(), 20);

      // Set payment cycle date to 15th of current month
      const paymentCycleDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        15
      );

      const result = calculateNextPaymentDate(invoiceDate, paymentCycleDate);

      // Verify result is in next month
      expect(result).not.toBeNull();
      const expectedMonth = (today.getMonth() + 1) % 12;
      expect(result?.getMonth()).toBe(expectedMonth);
      expect(result?.getDate()).toBe(15);
    });

    it("handles month end dates correctly", () => {
      // Special case: Invoice due on January 30, payment cycle on 31st
      const invoiceDate = new Date(2023, 0, 30); // January 30
      const paymentCycleDate = new Date(2023, 0, 31); // January 31

      const result = calculateNextPaymentDate(invoiceDate, paymentCycleDate);

      expect(result).not.toBeNull();
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(31);
    });

    it("handles leap years correctly", () => {
      // Invoice due on February 28 of a leap year
      const invoiceDate = new Date(2024, 1, 28); // February 28, 2024 (leap year)
      const paymentCycleDate = new Date(2024, 1, 29); // February 29

      const result = calculateNextPaymentDate(invoiceDate, paymentCycleDate);

      expect(result).not.toBeNull();
      expect(result?.getMonth()).toBe(1); // February
      expect(result?.getDate()).toBe(29);
    });
  });

  describe("getUserTimeZone", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("returns the user's timezone from DateTimeFormat", () => {
      const mockTimeZone = "America/New_York";
      vi.spyOn(Intl, "DateTimeFormat").mockImplementation(
        () =>
          ({
            resolvedOptions: () =>
              ({
                timeZone: mockTimeZone,
                locale: "en-US",
              } as unknown as Intl.ResolvedDateTimeFormatOptions),
          } as unknown as Intl.DateTimeFormat)
      );

      const result = getUserTimeZone();

      expect(result).toBe(mockTimeZone);
      expect(Intl.DateTimeFormat).toHaveBeenCalled();
    });
  });
});
