import { authClient } from "../../lib/auth-client";
import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminGuard() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as { role: string } | undefined;

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!session || !user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
