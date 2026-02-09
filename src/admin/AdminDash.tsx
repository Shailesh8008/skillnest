import { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
import { FcComboChart } from "react-icons/fc";
import toast from "react-hot-toast";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function AdminDash() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  const getCourses = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/getcourses`);
      const data = await res.json();
      if (!data.ok) {
        toast.error(data.message);
        setLoading(false);
        return setCourses([]);
      }
      setCourses(data.data);
    } catch (error) {
      console.log("Internal server error");
    }
    setLoading(false);
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div className="flex min-h-screen -mb-14">
      <AdminNav />
      <div className="flex-1 p-10">
        <div className="flex gap-2 mb-4 flex-wrap">
          <h1 className="text-2xl text-gray-700 font-bold">Admin Dashboard</h1>
          <FcComboChart className="text-3xl" />
        </div>
        <div className="shadow-lg p-4 rounded space-y-2">
          <p className="text-gray-600 font-semibold">Total Courses</p>
          {loading ? (
            <div className="flex">
              <div className="h-6 w-6 border-4 border-t-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <p className="text-green-500 font-bold text-xl">
              {courses.length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
