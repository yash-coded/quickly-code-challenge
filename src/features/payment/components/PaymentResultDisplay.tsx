"use client";

import { format } from "date-fns";

interface PaymentResultDisplayProps {
  invoiceDueDate: Date | undefined;
  paymentCycleDate: Date | undefined;
  paymentDate: Date | null;
  userTimeZone: string;
}

export function PaymentResultDisplay({
  invoiceDueDate,
  paymentCycleDate,
  paymentDate,
  userTimeZone,
}: PaymentResultDisplayProps) {
  if (!paymentDate || !invoiceDueDate || !paymentCycleDate) {
    return null;
  }

  return (
    <div className="rounded-md bg-blue-50 p-4 mt-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-blue-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
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
              {paymentCycleDate.getDate()} of each month), your invoice will be
              paid on{" "}
              <span className="font-semibold">
                {format(paymentDate, "PPP 'at' h:mm a")} ({userTimeZone})
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
