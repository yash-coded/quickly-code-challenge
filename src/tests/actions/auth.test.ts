import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { login, logout } from "@/actions/auth";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_ENDPOINTS } from "@/config/api";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

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
      expect(axios.post).not.toHaveBeenCalled();
    });

    it("returns error when password is missing", async () => {
      const formData = createMockFormData("test@example.com", undefined);
      const result = await login(null, formData);

      expect(result.success).toBe(false);
      expect(result.message).toContain("Email and password are required");
      expect(axios.post).not.toHaveBeenCalled();
    });

    it("sets cookie and redirects on successful login", async () => {
      const formData = createMockFormData("test@example.com", "password123");

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: {
          success: true,
          token: "mock-token-value",
        },
      });

      const cookiesMock = {
        set: vi.fn(),
      };
      vi.mocked(cookies).mockReturnValueOnce(
        cookiesMock as unknown as Promise<ReadonlyRequestCookies>
      );

      await login(null, formData);

      // Verify API call
      expect(axios.post).toHaveBeenCalledWith(API_ENDPOINTS.LOGIN, {
        email: "test@example.com",
        password: "password123",
      });

      expect(cookies).toHaveBeenCalled();
      expect(cookiesMock.set).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "auth-token",
          value: "mock-token-value",
        })
      );

      expect(redirect).toHaveBeenCalledWith("/profile");
    });

    it("returns error message on failed login", async () => {
      const formData = createMockFormData("test@example.com", "wrong-password");

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: {
          success: false,
          message: "Invalid credentials",
        },
      });

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
      expect(cookiesMock.set).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "auth-token",
          value: "",
          expires: expect.any(Date),
        })
      );

      expect(redirect).toHaveBeenCalledWith("/login");
    });
  });
});
