import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Users, Activity } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: Admin,
});

function Admin() {
  const { user } = Route.useRouteContext();
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["is-admin", user.id],
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      return !!data;
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Checking permissions…</p>;

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-glass">
        <ShieldCheck className="mx-auto h-10 w-10 text-muted-foreground" />
        <h2 className="mt-3 text-xl font-semibold">Admin only</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This area is for hospital administrators. Ask your account owner to grant you the admin role.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight"><ShieldCheck className="h-7 w-7 text-primary" /> Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Manage doctors, departments and usage.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-3xl border-border shadow-glass">
          <CardHeader><CardTitle className="text-base"><Users className="mr-2 inline h-4 w-4 text-primary" /> Doctors</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">—</p><p className="text-xs text-muted-foreground">Team management ships next.</p></CardContent>
        </Card>
        <Card className="rounded-3xl border-border shadow-glass">
          <CardHeader><CardTitle className="text-base"><Activity className="mr-2 inline h-4 w-4 text-primary" /> AI Usage</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">—</p><p className="text-xs text-muted-foreground">Per-doctor breakdown soon.</p></CardContent>
        </Card>
        <Card className="rounded-3xl border-border shadow-glass">
          <CardHeader><CardTitle className="text-base">Audit Log</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">—</p><p className="text-xs text-muted-foreground">Retention configurable on Enterprise.</p></CardContent>
        </Card>
      </div>
    </div>
  );
}
