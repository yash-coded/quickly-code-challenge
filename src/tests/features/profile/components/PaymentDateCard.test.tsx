/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PaymentDateCard } from "@/features/profile/components/PaymentDateCard";
import "@testing-library/jest-dom/vitest";

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-title">{children}</div>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-description">{children}</div>
  ),
}));

vi.mock("@/features/payment", () => ({
  PaymentDateChecker: () => (
    <div data-testid="payment-date-checker">PaymentDateChecker mock</div>
  ),
}));

describe("PaymentDateCard", () => {
  it("renders the card title and description", () => {
    render(<PaymentDateCard />);

    expect(screen.getByText("Payment Date Checker")).toBeInTheDocument();
    expect(
      screen.getByText("Check when your invoice will be paid")
    ).toBeInTheDocument();
  });

  it("renders the PaymentDateChecker component", () => {
    render(<PaymentDateCard />);

    const paymentChecker = screen.getByTestId("payment-date-checker");
    expect(paymentChecker).toBeInTheDocument();
    expect(paymentChecker).toHaveTextContent("PaymentDateChecker mock");
  });

  it("renders with proper card structure", () => {
    render(<PaymentDateCard />);

    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByTestId("card-header")).toBeInTheDocument();
    expect(screen.getByTestId("card-content")).toBeInTheDocument();
  });
});
