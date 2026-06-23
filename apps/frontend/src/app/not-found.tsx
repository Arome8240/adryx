import Link from "next/link";
import { URLS } from "@/lib/urls";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2.5 mb-2">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#f7931a] to-[#a855f7] flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Adryx
          </span>
        </div>

        <div>
          <p className="text-8xl font-black text-white/10 leading-none">404</p>
          <h1 className="text-2xl font-bold text-white mt-2 mb-2">
            Page not found
          </h1>
          <p className="text-white/50 text-sm">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href={URLS.home}
            className="px-5 py-2.5 rounded-xl bg-[#f7931a] hover:bg-[#f7931a]/90 text-black text-sm font-semibold transition-colors"
          >
            Go home
          </Link>
          <Link
            href={URLS.dashboard}
            className="px-5 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white text-sm hover:bg-white/5 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
