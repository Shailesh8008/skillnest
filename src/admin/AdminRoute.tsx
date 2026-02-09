import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch(`${backendUrl}/api/checkadmin`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) return setIsAdmin(true);
        return toast(data.message || "Unauthorized", { icon: " ℹ️" });
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-24 h-24 border-8 border-t-8 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  if (isAdmin) return children;
  return (
    <div className="mt-20 items-center justify-center h-screen text-center px-4">
      <h1 className="text-5xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Access Denied</h2>
      <p className="text-gray-600 mb-8">
        You do not have the necessary permissions to access the admin dashboard.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg"
      >
        Go to Home
      </Link>
    </div>
  );
}
