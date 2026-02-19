import { Navigate, useLocation } from "react-router-dom";
import type { User } from "@/api/auth";
import { useAuthStore } from "@/store/auth";

export function ProtectedRoute({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser?: User | null;
}) {
  const storeUser = useAuthStore((s) => s.user);
  const user = currentUser ?? storeUser;
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
