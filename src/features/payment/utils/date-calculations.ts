import {
  isBefore,
  addMonths,
  setHours,
  setMinutes,
  setSeconds,
} from "date-fns";

/**
 * Calculates the next payment date based on invoice due date and payment cycle date
 * @param invoiceDueDate The due date of the invoice
 * @param paymentCycleDate The monthly payment cycle date
 * @returns The calculated next payment date or null if inputs are missing
 */
export function calculateNextPaymentDate(
  invoiceDueDate: Date | undefined,
  paymentCycleDate: Date | undefined
): Date | null {
  if (!invoiceDueDate || !paymentCycleDate) return null;

  // Get the payment day from the payment cycle date
  const paymentDay = paymentCycleDate.getDate();

  // Start with the invoice due date's month
  const invoiceMonth = invoiceDueDate.getMonth();
  const invoiceYear = invoiceDueDate.getFullYear();

  // Create a date with the payment day in the same month as the invoice
  // Assume that we pay at 6:00:00 AM in the user's local timezone
  let paymentDate = new Date(invoiceYear, invoiceMonth, paymentDay);
  paymentDate = setHours(paymentDate, 6);
  paymentDate = setMinutes(paymentDate, 0);
  paymentDate = setSeconds(paymentDate, 0);

  // If the payment date is before the invoice due date, move to next month
  if (isBefore(paymentDate, invoiceDueDate)) {
    paymentDate = addMonths(paymentDate, 1);
  }

  return paymentDate;
}

/**
 * Gets the user's timezone name for display
 * @returns The user's timezone name
 */
export function getUserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
