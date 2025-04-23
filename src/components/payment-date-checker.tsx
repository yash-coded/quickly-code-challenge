"use client";

import { useState } from "react";
import {
  format,
  isBefore,
  addMonths,
  setHours,
  setMinutes,
  setSeconds,
} from "date-fns";
import { NativeDatePicker } from "@/components/ui/native-date-picker";

export function PaymentDateChecker() {
  const [invoiceDueDate, setInvoiceDueDate] = useState<Date | undefined>(
    undefined
  );
  const [paymentCycleDate, setPaymentCycleDate] = useState<Date | undefined>(
    undefined
  );

  const getNextPaymentDate = () => {
    if (!invoiceDueDate || !paymentCycleDate) return null;

    // Get the payment day from the payment cycle date
    const paymentDay = paymentCycleDate.getDate();

    // Start with the invoice due date's month
    const invoiceMonth = invoiceDueDate.getMonth();
    const invoiceYear = invoiceDueDate.getFullYear();

    // Create a date with the payment day in the same month as the invoice
    // Set time to 6:00:00 AM in the user's local timezone
    let paymentDate = new Date(invoiceYear, invoiceMonth, paymentDay);
    paymentDate = setHours(paymentDate, 6);
    paymentDate = setMinutes(paymentDate, 0);
    paymentDate = setSeconds(paymentDate, 0);

    // If the payment date is before the invoice due date, move to next month
    if (isBefore(paymentDate, invoiceDueDate)) {
      paymentDate = addMonths(paymentDate, 1);
    }

    return paymentDate;
  };

  const paymentDate = getNextPaymentDate();

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="space-y-6" data-testid="payment-date-checker">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NativeDatePicker
          label="Invoice Due Date"
          date={invoiceDueDate}
          setDate={setInvoiceDueDate}
        />
        <NativeDatePicker
          label="Monthly Payment Cycle Date"
          date={paymentCycleDate}
          setDate={setPaymentCycleDate}
        />
      </div>

      {paymentDate && invoiceDueDate && paymentCycleDate && (
        <div className="rounded-md bg-blue-50 p-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-blue-800">
                Payment Date Information
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Your invoice due date is{" "}
                  <span className="font-semibold">
                    {format(invoiceDueDate, "PPP")}
                  </span>
                  .
                </p>
                <p>
                  Based on your monthly payment cycle (day{" "}
                  {paymentCycleDate.getDate()} of each month), your invoice will
                  be paid on{" "}
                  <span className="font-semibold">
                    {format(paymentDate, "PPP 'at' h:mm a")} ({userTimeZone})
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
