"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CloseCircle } from "iconsax-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("[Adryx Error Boundary]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#f87171]/10 flex items-center justify-center">
            <CloseCircle size={32} color="#f87171" variant="Bold" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Something went wrong
          </h1>
          <p className="text-white/50 text-sm">
            An unexpected error occurred. Our team has been notified.
          </p>
          {error.digest && (
            <p className="text-white/25 text-xs mt-2 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl bg-[#f7931a] hover:bg-[#f7931a]/90 text-black text-sm font-semibold transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-5 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white text-sm hover:bg-white/5 transition-colors"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}
