"use client";

import { useState } from "react";
import { DateInputs } from "./DateInputs";
import { PaymentResultDisplay } from "./PaymentResultDisplay";
import {
  calculateNextPaymentDate,
  getUserTimeZone,
} from "../utils/date-calculations";

export function PaymentDateChecker() {
  const [invoiceDueDate, setInvoiceDueDate] = useState<Date | undefined>(
    undefined
  );
  const [paymentCycleDate, setPaymentCycleDate] = useState<Date | undefined>(
    undefined
  );

  const paymentDate = calculateNextPaymentDate(
    invoiceDueDate,
    paymentCycleDate
  );

  const userTimeZone = getUserTimeZone();

  return (
    <div className="space-y-6">
      <DateInputs
        invoiceDueDate={invoiceDueDate}
        setInvoiceDueDate={setInvoiceDueDate}
        paymentCycleDate={paymentCycleDate}
        setPaymentCycleDate={setPaymentCycleDate}
      />

      <PaymentResultDisplay
        invoiceDueDate={invoiceDueDate}
        paymentCycleDate={paymentCycleDate}
        paymentDate={paymentDate}
        userTimeZone={userTimeZone}
      />
    </div>
  );
}
