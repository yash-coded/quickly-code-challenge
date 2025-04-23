import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getUserProfile } from "@/actions/user";

// Mock the API_ENDPOINTS
vi.mock("@/config/api", () => ({
  API_ENDPOINTS: {
    USER_PROFILE: "https://api-dev.quicklyinc.com/auth/user",
    LOGIN: "https://api-dev.quicklyinc.com/auth/login",
  },
}));

const cookiesMock = {
  get: vi.fn((name: string) => {
    if (name === "auth-token") {
      return { value: "mocked-token" };
    }
    return null;
  }),
};

vi.mock("next/headers", () => {
  return {
    cookies: () => ({
      get: (name: string) => cookiesMock.get(name),
    }),
  };
});

global.fetch = vi.fn();

const mockUserData = {
  id: 1,
  full_name: "John Doe",
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  cognito_id: "mock-cognito-id",
  company_id: 1,
  phone: "+1234567890",
  createdAt: "2023-01-01T00:00:00.000Z",
  updatedAt: "2023-01-01T00:00:00.000Z",
  deleted_at: null,
  CompanyId: 1,
  Company: {
    id: 1,
    name: "Acme Inc.",
    address_line_1: "123 Main St",
    address_line_2: "Suite 100",
    address_city: "New York",
    address_state: "NY",
    address_zip: "10001",
    address_country: "USA",
    max_credit_amount: null,
    approved: true,
    logo_url: null,
    default_currency: "USD",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    deleted_at: null,
  },
  roles: "user",
  verified: true,
};

describe("User Actions", () => {
  beforeEach(() => {
    cookiesMock.get.mockImplementation((name: string) => {
      if (name === "auth-token") {
        return { value: "mocked-token" };
      }
      return null;
    });

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          user: mockUserData,
        }),
    } as Response);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("getUserProfile returns user data on successful API response", async () => {
    const user = await getUserProfile();

    expect(fetch).toHaveBeenCalledWith(
      "https://api-dev.quicklyinc.com/auth/user",
      {
        headers: {
          Authorization: "Bearer mocked-token",
        },
        cache: "no-store",
      }
    );

    expect(user).not.toBeUndefined();
    expect(user?.full_name).toBe("John Doe");
    expect(user?.Company.name).toBe("Acme Inc.");
  });

  it("getUserProfile returns undefined when no auth token is available", async () => {
    cookiesMock.get.mockReturnValue(null);

    const user = await getUserProfile();

    expect(fetch).not.toHaveBeenCalled();
    expect(user).toBeUndefined();
  });

  it("getUserProfile returns undefined on API failure", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      statusText: "Not Found",
    } as Response);

    const user = await getUserProfile();

    expect(fetch).toHaveBeenCalled();
    expect(user).toBeUndefined();
  });

  it("getUserProfile handles network errors gracefully", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

    const user = await getUserProfile();

    expect(fetch).toHaveBeenCalled();
    expect(user).toBeUndefined();
  });
});
