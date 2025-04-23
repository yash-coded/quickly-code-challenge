/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import "@testing-library/jest-dom/vitest";

vi.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => (
    <span
      data-testid="mocked-image"
      className={className}
      title={alt}
      data-src={src}
    />
  ),
}));

// Mock the Avatar component
vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="avatar">{children}</div>
  ),
  AvatarImage: ({
    src,
    alt,
    className,
  }: {
    src?: string;
    alt: string;
    className?: string;
  }) => (
    <span
      data-testid="avatar-image"
      className={className}
      title={alt}
      data-src={src || ""}
    />
  ),
  AvatarFallback: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="avatar-fallback">{children}</div>
  ),
}));

// Mock the LogoutButton component
vi.mock("@/components/logout-button", () => ({
  LogoutButton: () => <button data-testid="logout-button">Logout</button>,
}));

describe("ProfileHeader", () => {
  const mockUser = {
    fullName: "John Doe",
    email: "john@example.com",
  };

  it("renders user's full name", () => {
    render(<ProfileHeader user={mockUser} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders user's email", () => {
    render(<ProfileHeader user={mockUser} />);
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("renders avatar with fallback initials", () => {
    render(<ProfileHeader user={mockUser} />);
    const avatarFallback = screen.getByTestId("avatar-fallback");
    expect(avatarFallback).toBeInTheDocument();
    expect(avatarFallback).toHaveTextContent("JD");
  });

  it("renders logout button", () => {
    render(<ProfileHeader user={mockUser} />);
    const logoutButton = screen.getByTestId("logout-button");
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton).toHaveTextContent("Logout");
  });

  it("renders the avatar component", () => {
    render(<ProfileHeader user={mockUser} />);
    expect(screen.getByTestId("avatar")).toBeInTheDocument();
  });
});
