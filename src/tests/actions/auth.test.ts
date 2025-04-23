import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { login, logout } from "@/actions/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_ENDPOINTS } from "@/config/api";

global.fetch = vi.fn();

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockReturnValue({
    set: vi.fn(),
    get: vi.fn(),
  }),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("Authentication Actions", () => {
  const createMockFormData = (email?: string, password?: string) => {
    const formData = new FormData();
    if (email) formData.append("email", email);
    if (password) formData.append("password", password);
    return formData;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("login", () => {
    it("returns error when email is missing", async () => {
      const formData = createMockFormData(undefined, "password123");
      const result = await login(null, formData);

      expect(result.success).toBe(false);
      expect(result.message).toContain("Email and password are required");
      expect(fetch).not.toHaveBeenCalled();
    });

    it("returns error when password is missing", async () => {
      const formData = createMockFormData("test@example.com", undefined);
      const result = await login(null, formData);

      expect(result.success).toBe(false);
      expect(result.message).toContain("Email and password are required");
      expect(fetch).not.toHaveBeenCalled();
    });

    it("sets cookie and redirects on successful login", async () => {
      const formData = createMockFormData("test@example.com", "password123");

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            token: "mock-token-value",
          }),
      } as Response);

      const cookiesMock = {
        set: vi.fn(),
      };
      vi.mocked(cookies).mockReturnValueOnce(
        cookiesMock as unknown as Promise<ReadonlyRequestCookies>
      );

      await login(null, formData);

      // Verify API call
      expect(fetch).toHaveBeenCalledWith(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
        cache: "no-store",
      });

      expect(cookies).toHaveBeenCalled();
      expect(cookiesMock.set).toHaveBeenCalledWith(
        "auth-token",
        "mock-token-value",
        {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        }
      );
    });

    it("returns error message on failed login", async () => {
      const formData = createMockFormData("test@example.com", "wrong-password");

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: false,
            message: "Invalid credentials",
          }),
      } as Response);

      const result = await login(null, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid credentials");
      expect(redirect).not.toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("clears auth cookie and redirects to login", async () => {
      const cookiesMock = {
        set: vi.fn(),
      };
      vi.mocked(cookies).mockReturnValueOnce(
        cookiesMock as unknown as Promise<ReadonlyRequestCookies>
      );

      await logout();

      expect(cookies).toHaveBeenCalled();
      expect(cookiesMock.set).toHaveBeenCalledWith("auth-token", "", {
        httpOnly: true,
        secure: false,
        expires: expect.any(Date),
        sameSite: "strict",
        path: "/",
      });

      expect(redirect).toHaveBeenCalledWith("/login");
    });
  });
});
