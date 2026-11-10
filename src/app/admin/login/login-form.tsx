"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  if (!configured) {
    return (
      <div className="text-sm leading-relaxed text-ink/75">
        <p className="font-semibold text-ink">Sign-in isn&apos;t set up yet.</p>
        <p className="mt-2">
          Run <code className="rounded bg-ink/5 px-1.5 py-0.5">npm run admin:hash</code>, then add the two lines it prints to the environment variables and restart.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="password" className="text-[13px] font-semibold text-ink/80">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "login-error" : undefined}
          className="mt-1.5 h-11 w-full rounded-md bg-white px-3 text-base ring-1 ring-ink/15 outline-none transition focus:ring-2 focus:ring-burgundy aria-invalid:ring-2 aria-invalid:ring-burgundy-bright"
        />
      </div>
      {state.error && (
        <p id="login-error" role="alert" className="rounded-md bg-burgundy/5 px-3 py-2 text-sm font-medium text-burgundy-bright">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="h-11 w-full rounded-md bg-burgundy text-sm font-semibold text-white transition hover:bg-burgundy-bright disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
