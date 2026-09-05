import { motion } from "framer-motion";
import { LayoutGrid, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useCollection } from "@/context/collection-context";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Collection", icon: LayoutGrid, end: true },
  { to: "/manage", label: "Manage", icon: Plus, end: false },
];

export function Navbar() {
  const { kits } = useCollection();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <NavLink to="/" className="group flex items-center gap-3">
          <span className="relative grid size-10 place-items-center overflow-hidden rounded-xl border border-cyan-300/30 bg-cyan-400/10">
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.35),transparent_60%)]" />
            <span className="font-display text-sm font-bold tracking-[0.18em] text-cyan-200">
              MS
            </span>
          </span>
          <span>
            <span className="block font-display text-lg tracking-[0.28em] text-white">
              MS-INDEX
            </span>
            <span className="hidden text-[11px] uppercase tracking-[0.22em] text-zinc-500 sm:block">
              Mobile Suit Archive
            </span>
          </span>
        </NavLink>

        <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "relative rounded-full px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] transition-colors sm:px-4",
                    isActive ? "text-zinc-950" : "text-zinc-400 hover:text-white",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive ? (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-cyan-300"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    ) : null}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className="size-3.5" />
                      <span className="hidden sm:inline">{link.label}</span>
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-100 md:flex">
          <span className="size-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_#fbbf24]" />
          {kits.length} kits logged
        </div>
      </div>
    </header>
  );
}
