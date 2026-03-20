"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authService } from "@/services/auth";

export const saveToken = async (token: string, role: string, remember?: boolean) => {
  const cookieStore = await cookies();
  return new Promise((resolve) => {
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      maxAge: remember ? 60 * 60 * 24 * 7 : undefined,
    });

    cookieStore.set({
      name: "role",
      value: role,
      httpOnly: true,
      maxAge: remember ? 60 * 60 * 24 * 7 : undefined,
    });

    resolve("Successfully saved");
  });
};

export const saveRefreshedToken = async (token: string, remember?: boolean) => {
  const cookieStore = await cookies();
  return new Promise((resolve) => {
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      maxAge: remember ? 60 * 60 * 24 * 7 : undefined,
    });

    resolve("Successfully saved");
  });
};

export const removeToken = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("role");

  redirect("/login");
};

export const refreshTokenServer = async (token: string) => {
  try {
    const result = await authService.refreshToken(token);
    const cookieStore = await cookies();
    
    // Update token in cookie
    cookieStore.set({
      name: "token",
      value: result.data.access_token,
      httpOnly: true,
    });

    return {
      success: true,
      token: result.data.access_token,
      user: result.data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: "Token refresh failed",
    };
  }
};
