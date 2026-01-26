import { useEffect, useState } from "react";
import { adminClient } from "../../lib/admin-client";
import { Users, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminClient
      .getStats()
      .then((data) => setStats(data.data)) // Assuming successResponse wrapper: { success: true, data: { ... } }
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Users
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.totalUsers}
            </p>
          </div>
        </div>

        {/* Add more stats cards here */}
      </div>
    </div>
  );
}
