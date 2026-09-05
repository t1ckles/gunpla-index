import type { ReactNode } from "react";
import { CollectionProvider } from "@/context/collection-context";
import { Navbar } from "./navbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <CollectionProvider>
      <div className="relative flex min-h-full flex-1 flex-col overflow-x-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.06),transparent_28%)]" />
        <div className="grid-overlay pointer-events-none absolute inset-0 opacity-40" />
        <Navbar />
        <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
        <footer className="relative z-10 border-t border-white/5 px-4 py-6 text-center text-xs uppercase tracking-[0.2em] text-zinc-600">
          MS-Index · Personal GunPla archive
        </footer>
      </div>
    </CollectionProvider>
  );
}
