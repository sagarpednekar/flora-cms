import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { settingsApi } from "@/api/settings";
import { rolesApi } from "@/api/roles";

export function Settings() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.get(),
  });

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesApi.list(),
  });

  const [allowSignUps, setAllowSignUps] = useState(true);
  const [oneAccountPerEmail, setOneAccountPerEmail] = useState(true);
  const [defaultRoleId, setDefaultRoleId] = useState("");

  useEffect(() => {
    if (settings) {
      setAllowSignUps(settings.allowSignUps);
      setOneAccountPerEmail(settings.oneAccountPerEmail);
      setDefaultRoleId(settings.defaultRoleForNewUsers ?? "");
    }
  }, [settings]);

  const patchMutation = useMutation({
    mutationFn: (data: Parameters<typeof settingsApi.patch>[0]) =>
      settingsApi.patch(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings"] }),
  });

  if (isLoading || !settings) {
    return <div className="text-gray-600">Loading settings…</div>;
  }

  const handleSave = () => {
    patchMutation.mutate({
      allowSignUps,
      oneAccountPerEmail,
      defaultRoleForNewUsers: defaultRoleId || undefined,
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Advanced settings</h1>
      <div className="max-w-xl space-y-6 rounded-md border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Allow sign-ups</Label>
            <p className="text-sm text-gray-500">
              Let new users create an account from the register page.
            </p>
          </div>
          <Switch
            checked={allowSignUps}
            onCheckedChange={setAllowSignUps}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">One account per email</Label>
            <p className="text-sm text-gray-500">
              Enforce a single account per email address.
            </p>
          </div>
          <Switch
            checked={oneAccountPerEmail}
            onCheckedChange={setOneAccountPerEmail}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-base">Default role for new users</Label>
          <p className="text-sm text-gray-500">
            Role assigned when a new user registers.
          </p>
          <select
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={defaultRoleId}
            onChange={(e) => setDefaultRoleId(e.target.value)}
          >
            <option value="">— Select —</option>
            {roles?.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <Button
          onClick={handleSave}
          disabled={patchMutation.isPending}
        >
          {patchMutation.isPending ? "Saving…" : "Save"}
        </Button>
        {patchMutation.isSuccess && (
          <p className="text-sm text-green-600">Settings saved.</p>
        )}
        {patchMutation.isError && (
          <p className="text-sm text-red-600">
            {(patchMutation.error as Error).message}
          </p>
        )}
      </div>
    </div>
  );
}

