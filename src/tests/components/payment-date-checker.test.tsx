/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PaymentDateChecker } from "@/components/payment-date-checker";
import { format, addDays } from "date-fns";
import "@testing-library/jest-dom/vitest";

vi.mock("@/components/ui/native-date-picker", () => ({
  NativeDatePicker: ({
    label,
    date,
    setDate,
  }: {
    label: string;
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
  }) => (
    <div
      data-testid={`date-picker-${label.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <label>{label}</label>
      <input
        type="date"
        value={date ? format(date, "yyyy-MM-dd") : ""}
        onChange={(e) => {
          if (e.target.value) {
            setDate(new Date(e.target.value));
          } else {
            setDate(undefined);
          }
        }}
        data-testid={`input-${label.replace(/\s+/g, "-").toLowerCase()}`}
      />
    </div>
  ),
}));

describe("PaymentDateChecker", () => {
  beforeEach(() => {
    // Reset any mocks if needed
  });

  it("renders date pickers", () => {
    render(<PaymentDateChecker />);

    expect(
      screen.getByTestId("date-picker-invoice-due-date")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("date-picker-monthly-payment-cycle-date")
    ).toBeInTheDocument();
  });

  it("does not show payment info when dates are not set", () => {
    render(<PaymentDateChecker />);

    expect(
      screen.queryByText("Payment Date Information")
    ).not.toBeInTheDocument();
  });

  it("shows payment info when both dates are set", () => {
    render(<PaymentDateChecker />);

    const today = new Date();
    const invoiceInput = screen.getByTestId("input-invoice-due-date");
    fireEvent.change(invoiceInput, {
      target: { value: format(today, "yyyy-MM-dd") },
    });

    const tomorrow = addDays(today, 1);
    const paymentInput = screen.getByTestId("input-monthly-payment-cycle-date");
    fireEvent.change(paymentInput, {
      target: { value: format(tomorrow, "yyyy-MM-dd") },
    });

    expect(screen.getByText("Payment Date Information")).toBeInTheDocument();
  });

  it("calculates the next payment date correctly when payment day is after invoice due date", () => {
    render(<PaymentDateChecker />);

    const today = new Date();
    const invoiceDate = new Date(today.getFullYear(), today.getMonth(), 10);
    const invoiceInput = screen.getByTestId("input-invoice-due-date");
    fireEvent.change(invoiceInput, {
      target: { value: format(invoiceDate, "yyyy-MM-dd") },
    });

    const paymentCycleDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      15
    );
    const paymentInput = screen.getByTestId("input-monthly-payment-cycle-date");
    fireEvent.change(paymentInput, {
      target: { value: format(paymentCycleDate, "yyyy-MM-dd") },
    });

    expect(screen.getByText(/your invoice will be paid on/i)).toHaveTextContent(
      format(paymentCycleDate, "MMMM")
    );
  });

  it("calculates the next payment date correctly when payment day is before invoice due date", () => {
    render(<PaymentDateChecker />);

    const today = new Date();
    const invoiceDate = new Date(today.getFullYear(), today.getMonth(), 20);
    const invoiceInput = screen.getByTestId("input-invoice-due-date");
    fireEvent.change(invoiceInput, {
      target: { value: format(invoiceDate, "yyyy-MM-dd") },
    });

    const paymentCycleDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      15
    );
    const paymentInput = screen.getByTestId("input-monthly-payment-cycle-date");
    fireEvent.change(paymentInput, {
      target: { value: format(paymentCycleDate, "yyyy-MM-dd") },
    });

    const nextMonthPaymentDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      15
    );
    expect(screen.getByText(/your invoice will be paid on/i)).toHaveTextContent(
      format(nextMonthPaymentDate, "MMMM")
    );
  });

  it("displays the user's timezone in the payment information", () => {
    render(<PaymentDateChecker />);

    const today = new Date();
    const invoiceInput = screen.getByTestId("input-invoice-due-date");
    fireEvent.change(invoiceInput, {
      target: { value: format(today, "yyyy-MM-dd") },
    });

    const tomorrow = addDays(today, 1);
    const paymentInput = screen.getByTestId("input-monthly-payment-cycle-date");
    fireEvent.change(paymentInput, {
      target: { value: format(tomorrow, "yyyy-MM-dd") },
    });

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    expect(screen.getByText(new RegExp(userTimeZone))).toBeInTheDocument();
  });

  it("handles month-end payment cycle dates properly", () => {
    render(<PaymentDateChecker />);

    const today = new Date();
    const invoiceDate = new Date(today.getFullYear(), today.getMonth(), 15);
    const invoiceInput = screen.getByTestId("input-invoice-due-date");
    fireEvent.change(invoiceInput, {
      target: { value: format(invoiceDate, "yyyy-MM-dd") },
    });

    const paymentCycleDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      20
    );
    const paymentInput = screen.getByTestId("input-monthly-payment-cycle-date");
    fireEvent.change(paymentInput, {
      target: { value: format(paymentCycleDate, "yyyy-MM-dd") },
    });

    expect(screen.getByText("Payment Date Information")).toBeInTheDocument();

    const paymentText = screen.getByText(/your invoice will be paid on/i);
    expect(paymentText).toBeInTheDocument();

    expect(paymentText.textContent).toMatch(/\d+(st|nd|rd|th)/);
    expect(paymentText.textContent).toMatch(
      /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/
    );
  });

  it("clears payment info when dates are reset", () => {
    render(<PaymentDateChecker />);

    const today = new Date();
    const invoiceInput = screen.getByTestId("input-invoice-due-date");
    fireEvent.change(invoiceInput, {
      target: { value: format(today, "yyyy-MM-dd") },
    });

    const tomorrow = addDays(today, 1);
    const paymentInput = screen.getByTestId("input-monthly-payment-cycle-date");
    fireEvent.change(paymentInput, {
      target: { value: format(tomorrow, "yyyy-MM-dd") },
    });

    expect(screen.getByText("Payment Date Information")).toBeInTheDocument();

    fireEvent.change(invoiceInput, { target: { value: "" } });

    expect(
      screen.queryByText("Payment Date Information")
    ).not.toBeInTheDocument();
  });
});
