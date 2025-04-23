/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";
import { middleware } from "@/middleware";
import type { NextRequest } from "next/server";
import { isTokenExpired } from "@/lib/token";

vi.mock("@/lib/token", () => ({
  isTokenExpired: vi.fn((token: string) => {
    try {
      const [, payloadBase64] = token.split(".");
      if (!payloadBase64) return true;

      const payloadString = Buffer.from(payloadBase64, "base64").toString(
        "utf-8"
      );
      const payload = JSON.parse(payloadString);

      if (!payload.exp) return true;
      const currentTimestamp = Math.floor(Date.now() / 1000);
      return payload.exp < currentTimestamp;
    } catch {
      return true;
    }
  }),
}));

type MockRequest = {
  nextUrl: { pathname: string };
  url: string;
  cookies: {
    get: (name: string) => { value: string } | undefined;
  };
};

const createMockRequest = (
  path: string,
  cookies: Record<string, string> = {}
): MockRequest => {
  const url = `https://example.com${path}`;
  return {
    nextUrl: {
      pathname: path,
    },
    url,
    cookies: {
      get: (name: string) => {
        if (cookies[name]) {
          return { value: cookies[name] };
        }
        return undefined;
      },
    },
  };
};

vi.mock("next/server", async () => {
  const actual = await vi.importActual("next/server");
  return {
    ...actual,
    NextResponse: {
      next: vi.fn(() => ({ type: "next" })),
      redirect: vi.fn((url) => ({
        type: "redirect",
        url,
        cookies: {
          set: vi.fn(),
        },
      })),
    },
  };
});

describe("Middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows access to non-protected routes without a token", () => {
    const req = createMockRequest("/");
    const result = middleware(req as unknown as NextRequest);
    expect(result).toEqual({ type: "next" });
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it("redirects to login if accessing protected route without a token", () => {
    const req = createMockRequest("/profile");
    middleware(req as unknown as NextRequest);
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/login" })
    );
  });

  it("redirects to login if token is expired", () => {
    const expiredTime = Math.floor(Date.now() / 1000) - 3600;
    const payload = btoa(JSON.stringify({ exp: expiredTime }));
    const expiredToken = `header.${payload}.signature`;

    vi.mocked(isTokenExpired).mockReturnValueOnce(true);

    const req = createMockRequest("/profile", { "auth-token": expiredToken });
    middleware(req as unknown as NextRequest);

    expect(isTokenExpired).toHaveBeenCalledWith(expiredToken);
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/login" })
    );
  });

  it("allows access to protected routes with a valid token", () => {
    const validTime = Math.floor(Date.now() / 1000) + 3600;
    const payload = btoa(JSON.stringify({ exp: validTime }));
    const validToken = `header.${payload}.signature`;

    vi.mocked(isTokenExpired).mockReturnValueOnce(false);

    const req = createMockRequest("/profile", { "auth-token": validToken });
    const result = middleware(req as unknown as NextRequest);

    expect(isTokenExpired).toHaveBeenCalledWith(validToken);
    expect(result).toEqual({ type: "next" });
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it("redirects to profile if accessing login with a valid token", () => {
    const validTime = Math.floor(Date.now() / 1000) + 3600;
    const payload = btoa(JSON.stringify({ exp: validTime }));
    const validToken = `header.${payload}.signature`;

    vi.mocked(isTokenExpired).mockReturnValueOnce(false);

    const req = createMockRequest("/login", { "auth-token": validToken });
    middleware(req as unknown as NextRequest);

    expect(isTokenExpired).toHaveBeenCalledWith(validToken);
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/profile" })
    );
  });

  it("clears the cookie if the token is expired", () => {
    const expiredTime = Math.floor(Date.now() / 1000) - 3600;
    const payload = btoa(JSON.stringify({ exp: expiredTime }));
    const expiredToken = `header.${payload}.signature`;

    vi.mocked(isTokenExpired).mockReturnValueOnce(true);

    const req = createMockRequest("/profile", { "auth-token": expiredToken });
    const mockResponse = {
      cookies: { set: vi.fn() },
    };

    vi.mocked(NextResponse.redirect).mockReturnValueOnce(
      mockResponse as unknown as NextResponse
    );

    middleware(req as unknown as NextRequest);

    expect(isTokenExpired).toHaveBeenCalledWith(expiredToken);

    expect(mockResponse.cookies.set).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "auth-token",
        value: "",
        expires: expect.any(Date),
      })
    );
  });
});
