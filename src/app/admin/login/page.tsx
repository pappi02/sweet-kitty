import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { isAdmin, isAdminConfigured } from "@/lib/admin/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="grid min-h-svh place-items-center px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Image src="/brand/my-sweet-kitty-512.png" alt="My Sweet Kitty" width={510} height={512} className="h-20 w-auto" preload />
          <h1 className="mt-4 font-display text-3xl">Admin</h1>
          <p className="mt-1 text-sm text-ink/65">Sign in to edit the site.</p>
        </div>
        <div className="mt-8 rounded-xl bg-white p-6 shadow-[0_20px_60px_-30px_rgba(51,4,18,0.35)] ring-1 ring-ink/8">
          <Suspense fallback={<div className="h-[148px]" />}>
            <Gate />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

async function Gate() {
  if (await isAdmin()) redirect("/admin");
  return <LoginForm configured={isAdminConfigured()} />;
}
