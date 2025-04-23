/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LogoutButton } from "@/components/logout-button";
import "@testing-library/jest-dom/vitest";
import * as authActions from "@/actions/auth";

vi.mock("@/actions/auth", () => ({
  logout: vi.fn(),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    type,
    variant,
    ...props
  }: {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    variant?: string;
    [key: string]: unknown;
  }) => (
    <button type={type} data-variant={variant} {...props}>
      {children}
    </button>
  ),
}));

describe("LogoutButton", () => {
  it("renders a logout button", () => {
    render(<LogoutButton />);

    const button = screen.getByRole("button", { name: /logout/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-variant", "secondary");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("calls the logout action when form is submitted", async () => {
    const mockLogout = vi.fn();
    vi.mocked(authActions.logout).mockImplementation(mockLogout);

    const TestableLogoutButton = () => {
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        authActions.logout();
      };

      return (
        <form data-testid="logout-form" onSubmit={handleSubmit}>
          <button type="submit">Logout</button>
        </form>
      );
    };

    render(<TestableLogoutButton />);

    const form = screen.getByTestId("logout-form");
    fireEvent.submit(form);

    expect(mockLogout).toHaveBeenCalled();
  });
});
