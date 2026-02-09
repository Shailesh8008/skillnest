import { useNavigate } from "react-router-dom";
import AdminNav from "./AdminNav";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function AdminCourse() {
  const [courses, setCourses] = useState<any[]>([]);
  const navigate = useNavigate();
  const getCourses = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/getcourses`);
      const data = await res.json();
      if (!data.ok) {
        toast.error(data.message);
        return setCourses([]);
      }
      return setCourses(data.data);
    } catch (error) {
      console.log("Internal server error");
    }
  };
  useEffect(() => {
    getCourses();
  }, []);

  const handleDelete = async (cid: any, cname: any) => {
    try {
      const res = await fetch(`${backendUrl}/api/deletecourse/${cid}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!data.ok) {
        return toast.error("Cannot delete this course!");
      }
      toast.success(`${cname} Deleted Successfully`);
      return setCourses(data.data);
    } catch (error) {
      console.log("Internal server error");
    }
  };

  return (
    <div className="flex min-h-screen -mb-14">
      <AdminNav />
      <div className="flex-1 p-4 md:p-10 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
            Manage Courses �
          </h1>
          <button
            onClick={() => navigate("/admin/addcourses")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 font-medium"
          >
            <span>+</span> Add New Course
          </button>
        </div>

        {courses.length !== 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-[3rem]">
            {courses.map((e: any) => (
              <div
                key={e["_id"]}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={e.pimage}
                    alt={e.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-indigo-600 shadow-sm">
                    {e.category}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3
                    className="text-lg font-bold text-gray-800 mb-1 line-clamp-1"
                    title={e.title}
                  >
                    {e.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">by {e.instructor}</p>
                  <div className="flex justify-between items-center mt-auto mb-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{e.price}
                    </span>
                  </div>

                  <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                    <button
                      onClick={() => navigate(`/admin/editcourse/${e["_id"]}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(e["_id"], e["title"])}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      <RiDeleteBin5Line /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-gray-100 text-center p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl">
              🔍
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No Courses Found
            </h2>
            <p className="text-gray-500 mb-6 max-w-sm">
              You haven't added any courses yet. Start by adding a new course to
              your platform.
            </p>
            <button
              onClick={() => navigate("/admin/addcourses")}
              className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline"
            >
              Add a Course Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
