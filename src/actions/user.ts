"use server";

import { cookies } from "next/headers";
import axios from "axios";
import { API_ENDPOINTS } from "@/config/api";

export type User = {
  full_name: string;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  cognito_id: string;
  company_id: number;
  phone: string;
  createdAt: string;
  updatedAt: string;
  deleted_at: null | string;
  CompanyId: number;
  Company: {
    id: number;
    name: string;
    address_line_1: string;
    address_line_2: string;
    address_city: string;
    address_state: string;
    address_zip: string;
    address_country: string;
    max_credit_amount: null | number;
    approved: boolean;
    logo_url: null | string;
    default_currency: string;
    createdAt: string;
    updatedAt: string;
    deleted_at: null | string;
  };
  roles: string;
  verified: boolean;
};

export async function getUserProfile(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  console.log("🚀 ~ getUserProfile ~ token:", token);

  if (!token) {
    return null;
  }

  try {
    // Call the external API to fetch user profile
    const response = await axios.get(API_ENDPOINTS.USER_PROFILE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      return response.data.user;
    }
  } catch (error) {
    console.log("🚀 ~ getUserProfile ~ error:", error);
    // Handle network errors or API exceptions gracefully
    console.error("Error fetching user profile:", error);
  }

  return null;
}
