"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { endSession, isAdminConfigured, startSession, verifyPassword } from "@/lib/admin/auth";
import { allow } from "@/lib/payments/rate-limit";

export type LoginState = { error?: string };

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) return { error: "Admin sign-in isn't set up yet. Add ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET to the environment." };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (!allow(`admin-login:${ip}`, 6, 15 * 60_000)) return { error: "Too many attempts. Please wait 15 minutes and try again." };

  const ok = await verifyPassword(String(formData.get("password") ?? ""));
  if (!ok) return { error: "That password isn't right." };

  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}
