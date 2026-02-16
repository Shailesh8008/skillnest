import { useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Login() {
  const [wait, setWait] = useState(false);
  const location = useLocation();
  const [isPass, setIsPass] = useState(false);
  const [form, setForm] = useState({
    email: "",
    pass: "",
  });
  const [error, setError] = useState({ email: false, pass: false });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setWait(true);
    if (!form.email || !form.pass) {
      setError({
        email: form.email ? false : true,
        pass: form.pass ? false : true,
      });
      setWait(false);
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) {
        toast.error(data.message);
        setWait(false);
        return;
      }
      window.location.href = "/";
    } catch (error) {
      setWait(false);
      toast.error("Something went wrong");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });

    setError({
      ...error,
      [e.target.id]: false,
    });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Please enter your details to sign in."
    >
      <form className="space-y-5 select-none" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email or Mobile number
            {error.email && (
              <span className="text-red-600 ml-1">*Required</span>
            )}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              id="email"
              type="text"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`block w-full px-4 py-3 rounded-lg border ${
                error.email
                  ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
              } focus:outline-none focus:ring-2 transition-colors sm:text-sm`}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="pass"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
            {error.pass && <span className="text-red-600 ml-1">*Required</span>}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              id="pass"
              type={isPass ? "text" : "password"}
              value={form.pass}
              onChange={handleChange}
              placeholder="••••••••"
              className={`block w-full px-4 py-3 pr-10 rounded-lg border ${
                error.pass
                  ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
              } focus:outline-none focus:ring-2 transition-colors sm:text-sm`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
              onClick={() => setIsPass(!isPass)}
            >
              {isPass ? (
                <FaEye className="h-5 w-5" aria-hidden="true" />
              ) : (
                <FaEyeSlash className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={wait}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
              wait ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {wait ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            {wait ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            state={location.state}
            className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
