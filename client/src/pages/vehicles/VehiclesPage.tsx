import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getMyVehicles, createVehicle } from "@/api/vehicles";
import { createVehicleSchema, type CreateVehicleFields } from "@/schemas/vehicle";
import type { Vehicle } from "@/types";
import Card from "@/components/Card";
import Modal from "@/components/Modal";

const FUEL_TYPES: Vehicle["fuelType"][] = ["petrol", "diesel", "hybrid", "electric", "lpg"];

const VehiclesPage = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateVehicleFields>({
    resolver: zodResolver(createVehicleSchema),
  });

  const loadVehicles = async () => {
    setLoading(true);
    try {
      setVehicles(await getMyVehicles());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const onSubmit = async (data: CreateVehicleFields) => {
    setError(null);
    try {
      await createVehicle(data);
      reset();
      setShowAddModal(false);
      await loadVehicles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add vehicle");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Your Vehicles</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          + Add Vehicle
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : vehicles.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-slate-500">No vehicles yet. Add your first one to get started.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} onClick={() => navigate(`/vehicles/${vehicle.id}`)}>
              {vehicle.photo ? (
                <img
                  src={vehicle.photo}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-36 object-cover rounded-xl mb-4"
                />
              ) : (
                <div className="w-full h-36 bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-4xl">
                  🚗
                </div>
              )}
              <h3 className="font-semibold text-slate-900">
                {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-sm text-slate-500 mb-3">
                {vehicle.year} &middot; {vehicle.licensePlate}
              </p>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>{vehicle.mileage.toLocaleString()} km</span>
                <span className="capitalize px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs">
                  {vehicle.fuelType}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showAddModal && (
        <Modal title="Add Vehicle" onClose={() => setShowAddModal(false)}>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
              {isSubmitting ? "Adding..." : "Add Vehicle"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default VehiclesPage;
