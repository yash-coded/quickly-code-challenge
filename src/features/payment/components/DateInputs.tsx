"use client";

import { NativeDatePicker } from "@/components/ui/native-date-picker";

interface DateInputsProps {
  invoiceDueDate: Date | undefined;
  setInvoiceDueDate: (date: Date | undefined) => void;
  paymentCycleDate: Date | undefined;
  setPaymentCycleDate: (date: Date | undefined) => void;
}

export function DateInputs({
  invoiceDueDate,
  setInvoiceDueDate,
  paymentCycleDate,
  setPaymentCycleDate,
}: DateInputsProps) {
  return (
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
  );
}
