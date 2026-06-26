import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Field, Select } from "../components/ui/Input";
import { useVaultwise } from "../hooks/useVaultwise";
import type { AllocationTarget } from "../types/domain";

export function Settings() {
  const { deviceId, preferences, setPreferences } = useVaultwise();
  const [renewalNotifications, setRenewalNotifications] = useState(preferences.renewalNotifications);
  const [defaultAllocation, setDefaultAllocation] = useState<AllocationTarget>(preferences.defaultAllocation);

  function save() {
    setPreferences({ renewalNotifications, defaultAllocation });
    if (renewalNotifications && "Notification" in window && Notification.permission === "default") {
      void Notification.requestPermission();
    }
  }

  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Preferences</h1>
        <p className="mt-1 text-sm text-slate-600">Device based V1 profile: {deviceId.slice(0, 8)}...</p>
      </div>
      <Card className="grid gap-5">
        <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 text-sm font-bold text-slate-700">
          Renewal notifications
          <input
            type="checkbox"
            className="h-5 w-5 accent-primary"
            checked={renewalNotifications}
            onChange={(event) => setRenewalNotifications(event.target.checked)}
          />
        </label>
        <Field label="Default allocation">
          <Select value={defaultAllocation} onChange={(event) => setDefaultAllocation(event.target.value as AllocationTarget)}>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="cash">Cash</option>
          </Select>
        </Field>
        <Button onClick={save}>Save preferences</Button>
      </Card>
    </div>
  );
}
