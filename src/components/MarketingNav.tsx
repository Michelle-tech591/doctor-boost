import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Menu } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/" as const, label: "Home" },
  { to: "/features" as const, label: "Features" },
  { to: "/pricing" as const, label: "Pricing" },
  { to: "/about" as const, label: "About" },
  { to: "/contact" as const, label: "Contact" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto mt-3 max-w-6xl px-4">
        <nav className="glass shadow-glass flex items-center justify-between rounded-full px-4 py-2.5 sm:px-6">
          <Link to="/" className="shrink-0"><Logo /></Link>
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: true }}
                activeProps={{ className: "bg-muted text-foreground" }}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link to="/auth">Login</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full">
              <Link to="/auth" search={{ mode: "signup" }}>Sign up</Link>
            </Button>
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 md:hidden"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
        {open && (
          <div className="glass shadow-glass mt-2 rounded-2xl p-3 md:hidden">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <Link key={l.to} to={l.to} className="rounded-lg px-3 py-2 text-sm hover:bg-muted" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              ))}
              <Link to="/auth" className="rounded-lg px-3 py-2 text-sm hover:bg-muted">Login</Link>
              <Link to="/auth" className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">Sign up</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
