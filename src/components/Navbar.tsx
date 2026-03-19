import { useState } from "react";
import { Menu, X, BookOpen, LayoutDashboard, LogOut, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Contact from "./Contact";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearUser } from "../store/userSlice";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
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
        setShowLogoutConfirm(false);
        window.location.href = "/";
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      {!pathname.includes("/admin/") ? (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xl tracking-tight text-gray-900">
                    SkillNest
                  </span>
                </Link>
                <div className="hidden md:ml-10 md:flex md:space-x-8">
                  <Link
                    to="/"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:text-gray-900 transition-colors ${
                      location.pathname === "/"
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/about"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:text-gray-900 transition-colors ${
                      location.pathname === "/about"
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    About
                  </Link>
                  <Link
                    to="/courses"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:text-gray-900 transition-colors ${
                      location.pathname === "/courses"
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    Courses
                  </Link>
                  {/* <Link
                    to="#"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:text-gray-900 transition-colors ${
                      location.pathname === "/mentors"
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    Mentors
                  </Link> */}
                  <button
                    onClick={() => setIsContactOpen(true)}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:text-gray-900 transition-colors ${
                      location.pathname === "/enterprise"
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    Contact
                  </button>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-4">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-indigo-100 hover:border-indigo-500 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <User className="w-5 h-5" />
                      </div>
                    </button>

                    {showDropdown && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowDropdown(false)}
                        ></div>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-20">
                          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {userLabel}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              navigate("/dashboard");
                              setShowDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                          >
                            <LayoutDashboard className="w-4 h-4 text-gray-400" />
                            <span>Dashboard</span>
                          </button>
                          <button
                            onClick={() => {
                              navigate("/my-courses");
                              setShowDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                          >
                            <BookOpen className="w-4 h-4 text-gray-400" />
                            <span>My Courses</span>
                          </button>
                          <div className="border-t border-gray-100">
                            <button
                              onClick={() => {
                                setShowDropdown(false);
                                setShowLogoutConfirm(true);
                              }}
                              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                            >
                              <LogOut className="w-4 h-4" />
                              Logout
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/login")}
                      className="text-gray-500 hover:text-gray-900 font-medium text-sm transition-colors"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => navigate("/signup")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
              <div className="-mr-2 flex items-center md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  <span className="sr-only">Open main menu</span>
                  {isOpen ? (
                    <X className="block h-6 w-6" />
                  ) : (
                    <Menu className="block h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div className="md:hidden border-t border-gray-100">
              <div className="pt-2 pb-3 space-y-1">
                <Link
                  to="/"
                  className="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                >
                  About
                </Link>
                <Link
                  to="/courses"
                  className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                >
                  Courses
                </Link>
                {/* <Link
                  to="#"
                  className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                >
                  Mentors
                </Link> */}
                <button
                  onClick={() => setIsContactOpen(true)}
                  className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                >
                  Contact
                </button>
              </div>
              <div className="pt-4 pb-4 border-t border-gray-100">
                {user ? (
                  <div className="px-4 space-y-3">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-800">
                          {userLabel}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => navigate("/my-courses")}
                      className="w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md flex items-center gap-2"
                    >
                      <BookOpen className="w-5 h-5" />
                      My Courses
                    </button>
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="px-4 space-y-3">
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full text-center text-gray-500 hover:text-gray-900 font-medium text-base transition-colors border border-gray-200 rounded-lg py-2"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => navigate("/signup")}
                      className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-base font-medium transition-colors shadow-sm"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          <Contact
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
          />
        </nav>
      ) : (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-16">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900">
                  SkillNest Admin Panel
                </span>
              </div>
            </div>
          </div>
        </nav>
      )}

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
    </>
  );
}
