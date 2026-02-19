import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { authApi } from "@/api/auth";
import { useAuthStore } from "@/store/auth";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Dashboard } from "@/pages/Dashboard";
import { SpeciesList } from "@/pages/SpeciesList";
import { SpeciesForm } from "@/pages/SpeciesForm";
import { UsersList } from "@/pages/UsersList";
import { RolesList } from "@/pages/RolesList";
import { Settings } from "@/pages/Settings";

function AuthLoader() {
  const storeUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const { data, isSuccess, isFetched } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.me(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isSuccess && data?.user) {
      setUser(data.user);
    }
  }, [isSuccess, data, setUser]);

  const currentUser = isSuccess && data?.user ? data.user : storeUser;

  if (!isFetched) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="species" element={<SpeciesList />} />
        <Route path="species/new" element={<SpeciesForm />} />
        <Route path="species/:id/edit" element={<SpeciesForm />} />
        <Route path="users" element={<UsersList />} />
        <Route path="roles" element={<RolesList />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return <AuthLoader />;
}
