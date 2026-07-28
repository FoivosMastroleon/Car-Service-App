import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getMaintenanceRecords,
  createMaintenanceRecord,
  deleteMaintenanceRecord,
} from "@/api/maintenanceRecords";
import { getMaintenanceTypes } from "@/api/maintenanceTypes";
import {
  createMaintenanceRecordSchema,
  type CreateMaintenanceRecordFields,
} from "@/schemas/maintenanceRecord";
import type { MaintenanceRecord, MaintenanceType } from "@/types";
import Card from "@/components/Card";
import Modal from "@/components/Modal";

const RecordsTab = ({ vehicleId }: { vehicleId: string }) => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [types, setTypes] = useState<MaintenanceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateMaintenanceRecordFields>({
    resolver: zodResolver(createMaintenanceRecordSchema),
  });

  const load = async () => {
    setLoading(true);
    const [recordData, typeData] = await Promise.all([
      getMaintenanceRecords(vehicleId),
      getMaintenanceTypes(),
    ]);
    setRecords(recordData);
    setTypes(typeData);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [vehicleId]);

  const typeName = (id: string) => types.find((t) => t.id === id)?.name ?? "Unknown";

  const onSubmit = async (data: CreateMaintenanceRecordFields) => {
    setError(null);
    try {
      await createMaintenanceRecord(vehicleId, data);
      reset();
      setShowAddModal(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add record");
    }
  };

  const handleDelete = async (id: string) => {
    await deleteMaintenanceRecord(vehicleId, id);
    await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Maintenance Records</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          + Log Record
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500 text-sm">Loading...</p>
      ) : records.length === 0 ? (
        <Card>
          <p className="text-slate-500 text-sm">No records logged yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {records.map((record) => (
            <Card key={record.id}>
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-slate-900">{typeName(record.maintenanceType)}</h3>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="text-slate-400 hover:text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {new Date(record.performedAt).toLocaleDateString()} &middot;{" "}
                {record.mileageAtService.toLocaleString()} km
              </p>
              {record.notes && <p className="text-sm text-slate-600 mt-2">{record.notes}</p>}
              {record.receiptUrl && (
                <a
                  href={record.receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-2 text-sm text-brand-600 hover:underline"
                >
                  View receipt
                </a>
              )}
            </Card>
          ))}
        </div>
      )}

      {showAddModal && (
        <Modal title="Log Maintenance Record" onClose={() => setShowAddModal(false)}>
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
                <label className="block text-sm text-slate-600 mb-1">Date</label>
                <input
                  type="date"
                  {...register("performedAt")}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                />
                {errors.performedAt && (
                  <p className="text-red-600 text-xs mt-1">{errors.performedAt.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Mileage (km)</label>
                <input
                  type="number"
                  {...register("mileageAtService")}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                />
                {errors.mileageAtService && (
                  <p className="text-red-600 text-xs mt-1">{errors.mileageAtService.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Notes</label>
              <textarea
                {...register("notes")}
                rows={2}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Log Record"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RecordsTab;
