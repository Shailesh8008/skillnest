import { useEffect, useState } from "react";
import { User, Mail, Shield, BookOpen, LogOut, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearUser } from "../store/userSlice";

export default function Dashboard() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useAppDispatch();
  const { user, initialized } = useAppSelector((state) => state.user);
  const userLabel = user
    ? `${user.fname || ""} ${user.lname || ""}`.trim() || user.email
    : "";

  const handleLogout = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/logout`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.ok) {
        dispatch(clearUser());
        toast.success("Logged out successfully");
        window.location.href = "/";
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (initialized && !user) {
      navigate("/login");
    }
  }, [initialized, navigate, user]);

  if (!initialized || !user) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-indigo-600 h-32 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden shadow-md group">
                <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <User className="w-10 h-10" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 pb-8 px-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{userLabel}</h2>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Learning Stats
                  </h3>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/my-courses")}
                    className="w-full py-2 px-4 bg-white border border-gray-200 rounded-lg text-gray-600 font-medium hover:border-indigo-600 hover:text-indigo-600 transition-colors text-left flex justify-between items-center group"
                  >
                    <span>View My Courses</span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </button>
                  <button
                    onClick={() => navigate("/courses")}
                    className="w-full py-2 px-4 bg-white border border-gray-200 rounded-lg text-gray-600 font-medium hover:border-indigo-600 hover:text-indigo-600 transition-colors text-left flex justify-between items-center group"
                  >
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4" />
                      <span>Browse All Courses</span>
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </button>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Account Security
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600 py-2 border-b border-gray-200 last:border-0">
                    <span>Role</span>
                    <span className="font-medium capitalize">
                      {user.role || "Student"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 py-2 border-b border-gray-200 last:border-0">
                    <span>Member Since</span>
                    <span className="font-medium">
                      {new Date(
                        user.createdAt || Date.now(),
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full mt-4 py-2 px-4 bg-white border border-red-100 rounded-lg text-red-600 font-medium hover:bg-red-50 hover:border-red-200 transition-colors text-left flex items-center gap-2 justify-center"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 transform transition-all scale-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
