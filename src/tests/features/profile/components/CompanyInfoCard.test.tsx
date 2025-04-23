/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CompanyInfoCard } from "@/features/profile/components/CompanyInfoCard";
import "@testing-library/jest-dom/vitest";

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-title">{children}</div>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-description">{children}</div>
  ),
}));

describe("CompanyInfoCard", () => {
  const mockCompany = {
    name: "Acme Inc.",
    address_line_1: "123 Main St",
    address_line_2: "Suite 100",
    address_city: "New York",
    address_state: "NY",
    address_zip: "10001",
    address_country: "USA",
    default_currency: "USD",
  };

  it("renders company name correctly", () => {
    render(<CompanyInfoCard company={mockCompany} />);
    expect(screen.getByText("Company Name")).toBeInTheDocument();
    expect(screen.getByText("Acme Inc.")).toBeInTheDocument();
  });

  it("renders address correctly including optional line 2", () => {
    render(<CompanyInfoCard company={mockCompany} />);
    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    expect(screen.getByText("Suite 100")).toBeInTheDocument();
    expect(screen.getByText("New York, NY 10001")).toBeInTheDocument();
    expect(screen.getByText("USA")).toBeInTheDocument();
  });

  it("renders default currency in uppercase", () => {
    render(<CompanyInfoCard company={mockCompany} />);
    expect(screen.getByText("Default Currency")).toBeInTheDocument();

    const currencyElement = screen.getByText("USD");
    expect(currencyElement).toBeInTheDocument();
    expect(currencyElement).toHaveClass("uppercase");
  });

  it("handles missing address line 2", () => {
    const companyWithoutLine2 = {
      ...mockCompany,
      address_line_2: undefined,
    };

    render(<CompanyInfoCard company={companyWithoutLine2} />);

    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    expect(screen.queryByText("Suite 100")).not.toBeInTheDocument();
  });
});
