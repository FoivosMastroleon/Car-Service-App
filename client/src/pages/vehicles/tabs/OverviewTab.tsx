import { useEffect, useState } from "react";
import { getMaintenanceStatus } from "@/api/maintenanceStatus";
import { getMaintenanceTypes } from "@/api/maintenanceTypes";
import type { MaintenanceStatus, MaintenanceType, Vehicle } from "@/types";
import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";

const OverviewTab = ({ vehicle }: { vehicle: Vehicle }) => {
  const [statuses, setStatuses] = useState<MaintenanceStatus[]>([]);
  const [types, setTypes] = useState<MaintenanceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMaintenanceStatus(vehicle.id), getMaintenanceTypes()]).then(
      ([statusData, typeData]) => {
        setStatuses(statusData);
        setTypes(typeData);
        setLoading(false);
      }
    );
  }, [vehicle.id]);

  const typeName = (id: string) => types.find((t) => t.id === id)?.name ?? "Unknown";

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <div className="flex items-start gap-6">
          {vehicle.photo ? (
            <img src={vehicle.photo} alt="" className="w-32 h-32 object-cover rounded-xl" />
          ) : (
            <div className="w-32 h-32 bg-slate-100 rounded-xl flex items-center justify-center text-4xl">
              🚗
            </div>
          )}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div>
              <span className="text-slate-400">Make/Model</span>
              <p className="font-medium text-slate-900">
                {vehicle.make} {vehicle.model}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Year</span>
              <p className="font-medium text-slate-900">{vehicle.year}</p>
            </div>
            <div>
              <span className="text-slate-400">License plate</span>
              <p className="font-medium text-slate-900">{vehicle.licensePlate}</p>
            </div>
            <div>
              <span className="text-slate-400">Mileage</span>
              <p className="font-medium text-slate-900">{vehicle.mileage.toLocaleString()} km</p>
            </div>
            <div>
              <span className="text-slate-400">Fuel type</span>
              <p className="font-medium text-slate-900 capitalize">{vehicle.fuelType}</p>
            </div>
            {vehicle.color && (
              <div>
                <span className="text-slate-400">Color</span>
                <p className="font-medium text-slate-900">{vehicle.color}</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Maintenance status</h2>
        {loading ? (
          <p className="text-slate-500 text-sm">Loading...</p>
        ) : statuses.length === 0 ? (
          <Card>
            <p className="text-slate-500 text-sm">No maintenance rules set up yet.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {statuses.map((status) => (
              <Card key={status.ruleId}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-slate-900">{typeName(status.maintenanceType)}</h3>
                  <StatusBadge status={status.status} />
                </div>
                <div className="text-sm text-slate-500 space-y-0.5">
                  {status.remainingKm !== undefined && (
                    <p>
                      {status.remainingKm >= 0
                        ? `${status.remainingKm.toLocaleString()} km left`
                        : `${Math.abs(status.remainingKm).toLocaleString()} km overdue`}
                    </p>
                  )}
                  {status.remainingDays !== undefined && (
                    <p>
                      {status.remainingDays >= 0
                        ? `${status.remainingDays} days left`
                        : `${Math.abs(status.remainingDays)} days overdue`}
                    </p>
                  )}
                  {!status.lastPerformedAt && <p>No history logged yet</p>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewTab;
