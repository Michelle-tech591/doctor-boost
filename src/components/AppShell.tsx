import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import {
  LayoutDashboard,
  Sparkles,
  Mail,
  FileText,
  Search,
  Calendar,
  LibraryBig,
  Mic,
  BarChart3,
  User,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

const items = [
  { to: "/dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { to: "/assistant" as const, label: "AI Assistant", icon: Sparkles },
  { to: "/email-generator" as const, label: "Email Generator", icon: Mail },
  { to: "/summaries" as const, label: "Summaries", icon: FileText },
  { to: "/research" as const, label: "Research", icon: Search },
  { to: "/schedule" as const, label: "Schedule", icon: Calendar },
  { to: "/templates" as const, label: "Templates", icon: LibraryBig },
  { to: "/dictation" as const, label: "Dictation", icon: Mic },
  { to: "/analytics" as const, label: "Analytics", icon: BarChart3 },
  { to: "/profile" as const, label: "Profile", icon: User },
  { to: "/admin" as const, label: "Admin", icon: ShieldCheck },
];

const mobileItems = items.slice(0, 5);

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center px-6">
          <Link to="/dashboard"><Logo /></Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {items.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-primary text-primary-foreground shadow-elegant" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={signOut}
          className="m-3 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/70 px-4 backdrop-blur-xl lg:hidden">
        <Logo />
        <button onClick={signOut} className="rounded-full p-2 text-muted-foreground hover:text-foreground" aria-label="Sign out">
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      <main className="pb-20 lg:pb-0 lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/80 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-5">
          {mobileItems.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-1 py-2 text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
