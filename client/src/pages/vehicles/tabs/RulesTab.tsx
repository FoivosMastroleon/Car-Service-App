import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getMaintenanceRules, createMaintenanceRule, deleteMaintenanceRule } from "@/api/maintenanceRules";
import { getMaintenanceTypes } from "@/api/maintenanceTypes";
import {
  createMaintenanceRuleSchema,
  type CreateMaintenanceRuleFields,
} from "@/schemas/maintenanceRule";
import type { MaintenanceRule, MaintenanceType } from "@/types";
import Card from "@/components/Card";
import Modal from "@/components/Modal";

const RulesTab = ({ vehicleId }: { vehicleId: string }) => {
  const [rules, setRules] = useState<MaintenanceRule[]>([]);
  const [types, setTypes] = useState<MaintenanceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateMaintenanceRuleFields>({
    resolver: zodResolver(createMaintenanceRuleSchema),
  });

  const load = async () => {
    setLoading(true);
    const [ruleData, typeData] = await Promise.all([
      getMaintenanceRules(vehicleId),
      getMaintenanceTypes(),
    ]);
    setRules(ruleData);
    setTypes(typeData);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [vehicleId]);

  const typeName = (id: string) => types.find((t) => t.id === id)?.name ?? "Unknown";

  const onSubmit = async (data: CreateMaintenanceRuleFields) => {
    setError(null);
    try {
      await createMaintenanceRule(vehicleId, {
        maintenanceType: data.maintenanceType,
        intervalKm: data.intervalKm ? Number(data.intervalKm) : undefined,
        intervalMonths: data.intervalMonths ? Number(data.intervalMonths) : undefined,
      });
      reset();
      setShowAddModal(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add rule");
    }
  };

  const handleDelete = async (id: string) => {
    await deleteMaintenanceRule(vehicleId, id);
    await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Maintenance Rules</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          + Add Rule
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500 text-sm">Loading...</p>
      ) : rules.length === 0 ? (
        <Card>
          <p className="text-slate-500 text-sm">No rules yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rules.map((rule) => (
            <Card key={rule.id}>
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-slate-900">{typeName(rule.maintenanceType)}</h3>
                <button
                  onClick={() => handleDelete(rule.id)}
                  className="text-slate-400 hover:text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
              <div className="text-sm text-slate-500 mt-1 space-y-0.5">
                {rule.intervalKm && <p>Every {rule.intervalKm.toLocaleString()} km</p>}
                {rule.intervalMonths && <p>Every {rule.intervalMonths} months</p>}
              </div>
            </Card>
          ))}
        </div>
      )}

      {showAddModal && (
        <Modal title="Add Maintenance Rule" onClose={() => setShowAddModal(false)}>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Maintenance type</label>
              <select
                {...register("maintenanceType")}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
              >
                <option value="">Select a type</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.maintenanceType && (
                <p className="text-red-600 text-xs mt-1">{errors.maintenanceType.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Interval (km)</label>
                <input
                  type="number"
                  {...register("intervalKm")}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Interval (months)</label>
                <input
                  type="number"
                  {...register("intervalMonths")}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
            {errors.intervalKm && <p className="text-red-600 text-xs">{errors.intervalKm.message}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Rule"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RulesTab;
