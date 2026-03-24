"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginCard() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    const supabase = createSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback`;

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        setIsLoading(false);
        return;
      }
    } catch (err) {
      setIsLoading(false);
      return;
    }
  };

  const handleReturn = () => {
    router.push("/");
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white/85 p-8 shadow-xl">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
          Secure Access
        </p>
        <h1 className="text-3xl font-semibold text-[#151515]">
          Sign in with Google
        </h1>
        <p className="text-sm leading-6 text-[#6b5f57]">
          Admin access is limited to verified superadmins.
        </p>
      </div>
      <button
        type="button"
        onClick={handleLogin}
        className="mt-8 w-full rounded-full bg-[#151515] px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#f9f4ef] transition hover:bg-[#2f2f2f] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isLoading}
      >
        {isLoading ? "Redirecting..." : "Continue with Google"}
      </button>
      <button
        type="button"
        onClick={handleReturn}
        className="mt-4 w-full rounded-full border border-black/15 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
      >
        Back to landing
      </button>
    </div>
  );
}
