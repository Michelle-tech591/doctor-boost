import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { User } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      return data;
    },
  });

  const [name, setName] = useState("");
  const [hospital, setHospital] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [reg, setReg] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name ?? "");
      setHospital(profile.hospital ?? "");
      setSpecialty(profile.specialty ?? "");
      setReg(profile.registration_number ?? "");
    }
  }, [profile]);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  function toggleDark(v: boolean) {
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
  }

  async function save() {
    const { error } = await supabase.from("profiles").upsert({
      id: user.id, full_name: name, hospital, specialty, registration_number: reg,
    });
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
    qc.invalidateQueries({ queryKey: ["profile"] });
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight"><User className="h-7 w-7 text-primary" /> Profile & Settings</h1>
        <p className="mt-1 text-muted-foreground">{user.email}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-border shadow-glass">
          <CardHeader><CardTitle>Doctor information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><Label>Hospital / Practice</Label><Input value={hospital} onChange={(e) => setHospital(e.target.value)} /></div>
            <div><Label>Specialty</Label><Input value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="e.g. Cardiology" /></div>
            <div><Label>Registration number</Label><Input value={reg} onChange={(e) => setReg(e.target.value)} /></div>
            <Button onClick={save} className="w-full rounded-full">Save changes</Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border shadow-glass">
          <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Dark mode</Label>
                <p className="text-xs text-muted-foreground">Easier on the eyes during night shifts.</p>
              </div>
              <Switch checked={dark} onCheckedChange={toggleDark} />
            </div>
            <div className="flex items-center justify-between opacity-60">
              <div>
                <Label>Email notifications</Label>
                <p className="text-xs text-muted-foreground">Coming soon.</p>
              </div>
              <Switch disabled />
            </div>
            <div className="flex items-center justify-between opacity-60">
              <div>
                <Label>Multi-factor authentication</Label>
                <p className="text-xs text-muted-foreground">Coming soon.</p>
              </div>
              <Switch disabled />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
