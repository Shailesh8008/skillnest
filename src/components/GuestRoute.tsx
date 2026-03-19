import type React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export default function GuestRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, initialized } = useAppSelector((state) => state.user);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-24 h-24 border-8 border-t-8 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
