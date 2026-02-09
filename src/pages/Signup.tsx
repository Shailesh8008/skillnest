import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AuthLayout from "../components/AuthLayout";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Signup() {
  const [wait, setWait] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    pass1: "",
    pass2: "",
  });
  const [error, setError] = useState({
    fname: false,
    lname: false,
    email: false,
    pass: false,
    pass1: false,
    pass2: false,
  });
  const [isPass, setIsPass] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setError({ ...error, [e.target.id]: false, pass: false });
  };
  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setWait(true);
    if (!form.fname || !form.email || !form.pass1 || !form.pass2) {
      setError({
        ...error,
        fname: form.fname ? false : true,
        email: form.email ? false : true,
        pass1: form.pass1 ? false : true,
        pass2: form.pass2 ? false : true,
      });
      setWait(false);
      return;
    }

    if (!isValidEmail(form.email)) {
      toast.error("Please enter a valid email");
      setWait(false);
      return;
    }

    if (form.pass1 !== form.pass2) {
      setError({ ...error, pass: true });
      setWait(false);
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/reg`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) {
        toast.error(data.message || "Some error occurred");
        setWait(false);
        return;
      }
      setForm({
        fname: "",
        lname: "",
        email: "",
        pass1: "",
        pass2: "",
      });
      window.location.href = "/";
    } catch (error) {
      setWait(false);
      console.log("error: ", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start your learning journey today."
      image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
    >
      <form className="space-y-5 select-none" onSubmit={handleForm}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="fname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
              {error.fname && <span className="text-red-600 ml-1">*</span>}
            </label>
            <input
              id="fname"
              type="text"
              value={form.fname}
              onChange={handleChange}
              placeholder="First Name"
              className={`block w-full px-4 py-3 rounded-lg border ${
                error.fname
                  ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
              } focus:outline-none focus:ring-2 transition-colors sm:text-sm`}
            />
          </div>
          <div>
            <label
              htmlFor="lname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              id="lname"
              type="text"
              value={form.lname}
              onChange={handleChange}
              placeholder="Last Name"
              className="block w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2 transition-colors sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email or Mobile number
            {error.email && <span className="text-red-600 ml-1">*</span>}
          </label>
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

        <div>
          <label
            htmlFor="pass1"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
            {error.pass1 && <span className="text-red-600 ml-1">*</span>}
            {error.pass && (
              <span className="text-red-600 ml-1 text-xs">
                (Passwords do not match)
              </span>
            )}
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              id="pass1"
              type={isPass ? "text" : "password"}
              value={form.pass1}
              onChange={handleChange}
              placeholder="Create a password"
              className={`block w-full px-4 py-3 pr-10 rounded-lg border ${
                error.pass1 || error.pass
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
                <FaEyeSlash className="h-5 w-5" aria-hidden="true" />
              ) : (
                <FaEye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="pass2"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password
            {error.pass2 && <span className="text-red-600 ml-1">*</span>}
          </label>
          <input
            id="pass2"
            type={isPass ? "text" : "password"}
            value={form.pass2}
            onChange={handleChange}
            placeholder="Confirm your password"
            className={`block w-full px-4 py-3 rounded-lg border ${
              error.pass2 || error.pass
                ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
            } focus:outline-none focus:ring-2 transition-colors sm:text-sm`}
          />
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
            {wait ? "Creating account..." : "Sign Up"}
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            state={location.state}
            className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
