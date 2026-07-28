import { useEffect, useState } from "react";
import { getReminders, dismissReminder } from "@/api/reminders";
import { getMaintenanceRules } from "@/api/maintenanceRules";
import { getMaintenanceTypes } from "@/api/maintenanceTypes";
import type { MaintenanceRule, MaintenanceType, Reminder } from "@/types";
import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";

const RemindersTab = ({ vehicleId }: { vehicleId: string }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [rules, setRules] = useState<MaintenanceRule[]>([]);
  const [types, setTypes] = useState<MaintenanceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeDismissed, setIncludeDismissed] = useState(false);

  const load = async (showDismissed: boolean) => {
    setLoading(true);
    const [reminderData, ruleData, typeData] = await Promise.all([
      getReminders(vehicleId, showDismissed),
      getMaintenanceRules(vehicleId),
      getMaintenanceTypes(),
    ]);
    setReminders(reminderData);
    setRules(ruleData);
    setTypes(typeData);
    setLoading(false);
  };

  useEffect(() => {
    load(includeDismissed);
  }, [vehicleId, includeDismissed]);

  const typeNameForRule = (ruleId: string) => {
    const rule = rules.find((r) => r.id === ruleId);
    return types.find((t) => t.id === rule?.maintenanceType)?.name ?? "Unknown";
  };

  const handleDismiss = async (id: string) => {
    await dismissReminder(vehicleId, id);
    await load(includeDismissed);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Reminders</h2>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={includeDismissed}
            onChange={(e) => setIncludeDismissed(e.target.checked)}
          />
          Show dismissed
        </label>
      </div>

      {loading ? (
        <p className="text-slate-500 text-sm">Loading...</p>
      ) : reminders.length === 0 ? (
        <Card>
          <p className="text-slate-500 text-sm">Nothing needs your attention right now.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reminders.map((reminder) => (
            <Card key={reminder.id}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-slate-900">{typeNameForRule(reminder.maintenanceRule)}</h3>
                <StatusBadge status={reminder.status} />
              </div>
              {reminder.dismissed ? (
                <p className="text-sm text-slate-400">Dismissed</p>
              ) : (
                <button
                  onClick={() => handleDismiss(reminder.id)}
                  className="text-sm text-brand-600 hover:underline"
                >
                  Dismiss
                </button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RemindersTab;
