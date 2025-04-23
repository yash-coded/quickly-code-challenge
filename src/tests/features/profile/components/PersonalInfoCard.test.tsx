/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PersonalInfoCard } from "@/features/profile/components/PersonalInfoCard";
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

describe("PersonalInfoCard", () => {
  const mockUser = {
    full_name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
  };

  it("renders personal information title and description", () => {
    render(<PersonalInfoCard user={mockUser} />);

    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Your account details")).toBeInTheDocument();
  });

  it("renders user full name correctly", () => {
    render(<PersonalInfoCard user={mockUser} />);

    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders user email correctly", () => {
    render(<PersonalInfoCard user={mockUser} />);

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
  });

  it("renders user phone number correctly", () => {
    render(<PersonalInfoCard user={mockUser} />);

    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("+1234567890")).toBeInTheDocument();
  });

  it("applies correct styling to text elements", () => {
    render(<PersonalInfoCard user={mockUser} />);

    const labels = screen.getAllByText(/(Full Name|Email|Phone)/);
    labels.forEach((label) => {
      expect(label).toHaveClass("text-sm");
      expect(label).toHaveClass("font-medium");
      expect(label).toHaveClass("text-gray-500");
    });

    const values = screen.getAllByText(
      /(John Doe|john\.doe@example\.com|\+1234567890)/
    );
    values.forEach((value) => {
      expect(value).toHaveClass("text-lg");
    });
  });
});
