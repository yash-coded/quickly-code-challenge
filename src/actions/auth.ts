"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";
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

  const response = await axios.post(API_ENDPOINTS.LOGIN, {
    email,
    password,
  });

  if (response.data.success) {
    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth-token",
      value: response.data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    redirect("/profile");
  } else {
    return {
      success: false,
      message: response.data.message || "Login failed",
    };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "auth-token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    sameSite: "strict",
    path: "/",
  });

  redirect("/login");
}
