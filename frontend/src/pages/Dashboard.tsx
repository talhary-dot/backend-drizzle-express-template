import { authClient } from "../lib/auth-client";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, User, Settings } from "lucide-react";

export default function Dashboard() {
  const { data: session, isPending, error } = authClient.useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !session) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <User className="h-8 w-8 p-1 bg-gray-200 rounded-full" />
                )}
                <span className="hidden sm:block">{session.user.name}</span>
              </div>
              <Link
                to="/profile"
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                Welcome, {session.user.name}!
              </h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                You are successfully authenticated via Google.
              </p>
              <p className="mt-4 text-sm text-gray-400 font-mono">
                User ID: {session.user.id}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
