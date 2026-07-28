import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getVehicleById } from "@/api/vehicles";
import type { Vehicle } from "@/types";
import OverviewTab from "@/pages/vehicles/tabs/OverviewTab";
import RulesTab from "@/pages/vehicles/tabs/RulesTab";
import RecordsTab from "@/pages/vehicles/tabs/RecordsTab";
import ExpensesTab from "@/pages/vehicles/tabs/ExpensesTab";
import RemindersTab from "@/pages/vehicles/tabs/RemindersTab";

const TABS = ["Overview", "Rules", "Records", "Expenses", "Reminders"] as const;
type Tab = (typeof TABS)[number];

const VehicleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  useEffect(() => {
    if (id) getVehicleById(id).then(setVehicle);
  }, [id]);

  if (!vehicle || !id) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <Link to="/vehicles" className="text-sm text-brand-600 hover:underline">
        &larr; Back to vehicles
      </Link>

      <h1 className="text-2xl font-semibold text-slate-900 mt-2 mb-6">
        {vehicle.make} {vehicle.model}
      </h1>

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

      {activeTab === "Overview" && <OverviewTab vehicle={vehicle} />}
      {activeTab === "Rules" && <RulesTab vehicleId={id} />}
      {activeTab === "Records" && <RecordsTab vehicleId={id} />}
      {activeTab === "Expenses" && <ExpensesTab vehicleId={id} />}
      {activeTab === "Reminders" && <RemindersTab vehicleId={id} />}
    </div>
  );
};

export default VehicleDetailPage;
