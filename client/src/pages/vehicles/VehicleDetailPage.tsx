import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getVehicleById, updateVehicle, deleteVehicle } from "@/api/vehicles";
import { createVehicleSchema, type CreateVehicleFields } from "@/schemas/vehicle";
import type { Vehicle } from "@/types";
import Modal from "@/components/Modal";
import OverviewTab from "@/pages/vehicles/tabs/OverviewTab";
import RulesTab from "@/pages/vehicles/tabs/RulesTab";
import RecordsTab from "@/pages/vehicles/tabs/RecordsTab";
import ExpensesTab from "@/pages/vehicles/tabs/ExpensesTab";
import RemindersTab from "@/pages/vehicles/tabs/RemindersTab";

const TABS = ["Overview", "Rules", "Records", "Expenses", "Reminders"] as const;
type Tab = (typeof TABS)[number];
const FUEL_TYPES: Vehicle["fuelType"][] = ["petrol", "diesel", "hybrid", "electric", "lpg"];

const VehicleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateVehicleFields>({
    resolver: zodResolver(createVehicleSchema),
  });

  useEffect(() => {
    if (id) getVehicleById(id).then(setVehicle);
  }, [id]);

  const openEditModal = () => {
    if (!vehicle) return;
    reset({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
      vin: vehicle.vin,
      mileage: vehicle.mileage,
      color: vehicle.color,
      fuelType: vehicle.fuelType,
    });
    setShowEditModal(true);
  };

  const onEditSubmit = async (data: CreateVehicleFields) => {
    if (!id) return;
    setError(null);
    try {
      const updated = await updateVehicle(id, data);
      setVehicle(updated);
      setShowEditModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update vehicle");
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Delete this vehicle and all of its data? This cannot be undone.")) return;
    await deleteVehicle(id);
    navigate("/vehicles");
  };

  if (!vehicle || !id) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <Link to="/vehicles" className="text-sm text-brand-600 hover:underline">
        &larr; Back to vehicles
      </Link>

      <div className="flex items-center justify-between mt-2 mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          {vehicle.make} {vehicle.model}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={openEditModal}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && <OverviewTab vehicle={vehicle} onVehicleChange={setVehicle} />}
      {activeTab === "Rules" && <RulesTab vehicleId={id} />}
      {activeTab === "Records" && <RecordsTab vehicleId={id} />}
      {activeTab === "Expenses" && <ExpensesTab vehicleId={id} />}
      {activeTab === "Reminders" && <RemindersTab vehicleId={id} />}

      {showEditModal && (
        <Modal title="Edit Vehicle" onClose={() => setShowEditModal(false)}>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit(onEditSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Make</label>
                <input
                  {...register("make")}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                />
                {errors.make && <p className="text-red-600 text-xs mt-1">{errors.make.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Model</label>
                <input
                  {...register("model")}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                />
                {errors.model && <p className="text-red-600 text-xs mt-1">{errors.model.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Year</label>
                <input
                  type="number"
                  {...register("year")}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                />
                {errors.year && <p className="text-red-600 text-xs mt-1">{errors.year.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Fuel type</label>
                <select
                  {...register("fuelType")}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                >
                  {FUEL_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">License plate</label>
              <input
                {...register("licensePlate")}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
              />
              {errors.licensePlate && (
                <p className="text-red-600 text-xs mt-1">{errors.licensePlate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Mileage (km)</label>
              <input
                type="number"
                {...register("mileage")}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default VehicleDetailPage;
