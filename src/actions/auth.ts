"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_ENDPOINTS } from "@/config/api";

type LoginResult = {
  success: boolean;
  message: string;
};

export async function login(
  prevState: LoginResult | null,
  formData: FormData
): Promise<LoginResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required",
    };
  }

  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await response.json();

    if (data.success) {
      const cookieStore = await cookies();
      cookieStore.set("auth-token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return {
        success: true,
        message: "Login successful",
      };
    } else {
      return {
        success: false,
        message: data.message || "Login failed",
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? `Authentication failed: ${error.message}`
          : "An unexpected error occurred during login. Please try again.",
    };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    sameSite: "strict",
    path: "/",
  });

  redirect("/login");
}
