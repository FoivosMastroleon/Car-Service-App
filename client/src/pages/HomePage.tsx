import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { getMyVehicles } from "@/api/vehicles";
import type { Vehicle } from "@/types";
import Card from "@/components/Card";

const HomePage = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyVehicles()
      .then(setVehicles)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Welcome{user ? `, ${user.username}` : ""}</h1>
      <p className="text-slate-500 mt-1">Here's a quick look at your garage.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">
        <Card className="sm:col-span-1">
          <p className="text-sm text-slate-400">Vehicles</p>
          <p className="text-3xl font-semibold text-slate-900 mt-1">{loading ? "–" : vehicles.length}</p>
        </Card>

        <Card className="sm:col-span-2 flex flex-col justify-center">
          <p className="text-slate-600 mb-3">
            Track maintenance, expenses, and reminders for every vehicle in one place.
          </p>
          <Link
            to="/vehicles"
            className="inline-block w-fit px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            Go to Vehicles
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
