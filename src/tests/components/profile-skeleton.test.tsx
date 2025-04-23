/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfileSkeleton } from "@/components/profile-skeleton";
import "@testing-library/jest-dom/vitest";

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className }: { className: string }) => (
    <div className={className} data-testid="skeleton" />
  ),
}));

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
}));

describe("ProfileSkeleton", () => {
  it("renders skeleton UI elements", () => {
    render(<ProfileSkeleton />);

    const cards = screen.getAllByTestId("card");
    expect(cards.length).toBeGreaterThan(0);

    const cardHeaders = screen.getAllByTestId("card-header");
    expect(cardHeaders.length).toBeGreaterThan(0);

    const cardContents = screen.getAllByTestId("card-content");
    expect(cardContents.length).toBeGreaterThan(0);

    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons.length).toBeGreaterThan(10);
  });
});
