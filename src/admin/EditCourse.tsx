import { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function EditCourse({ id }: { id?: string }) {
  const [wait, setWait] = useState(false);
  const [courseDetails, setCourseDetails] = useState<any>({
    title: "",
    price: "",
    category: "",
    instructor: "",
    hours: "",
    minutes: "",
  });
  const [pImage, setPImage] = useState<any>("");
  const [currentImage, setCurrentImage] = useState<string>("");
  const navigate = useNavigate();
  const params = useParams();

  const getCourseData = async (pid: any) => {
    try {
      const res = await fetch(`${backendUrl}/api/getcourse/${pid}`);
      const data = await res.json();
      if (!data) {
        return toast.error(data.message);
      }
      const course = data.data;

      // Parse duration if it exists
      let hours = "";
      let minutes = "";
      if (course.duration) {
        const parts = course.duration.split(" ");
        if (parts.length >= 2) {
          hours = parts[0].replace("h", "");
          minutes = parts[1].replace("m", "");
        }
      }

      setCourseDetails({
        title: course.title || course.pname, // Handle legacy pname if needed
        price: course.price,
        category: course.category,
        instructor: course.instructor || "",
        hours: hours,
        minutes: minutes,
      });
      setCurrentImage(course.pimage);
    } catch (error) {
      return toast.error("Internal server error");
    }
  };

  useEffect(() => {
    getCourseData(params.id || id);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (wait) return;
    setWait(true);
    const formData = new FormData();
    formData.append("title", courseDetails.title);
    formData.append("price", courseDetails.price);
    formData.append("category", courseDetails.category);
    formData.append("instructor", courseDetails.instructor);
    formData.append(
      "duration",
      `${courseDetails.hours}h ${courseDetails.minutes}m`,
    );
    if (pImage) {
      formData.append("pimage", pImage);
    }

    try {
      const res = await fetch(`${backendUrl}/api/editcourse/${params.id}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!data.ok) {
        setWait(false);
        return toast.error(data.message);
      }
      toast.success(data.message);
      setWait(false);
      navigate("/admin/courses");
    } catch (error) {
      setWait(false);
      return toast.error("Internal server error");
    }
  };

  const handleChange = (e: any) => {
    setCourseDetails({ ...courseDetails, [e.target.id]: e.target.value });
  };

  return (
    <div className="flex min-h-screen -mb-14">
      <AdminNav />
      <div className="flex-1 p-4 md:p-10">
        <h1 className="text-2xl md:text-3xl text-gray-800 font-bold mb-6">
          Edit Course ✏️
        </h1>
        <button
          onClick={() => navigate("/admin/courses")}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg cursor-pointer mb-6 transition-colors custom-back-btn"
        >
          ← Back
        </button>
        <div className="bg-white shadow-xl px-6 py-8 rounded-xl max-w-4xl mx-auto border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course Name
                </label>
                <input
                  id="title"
                  type="text"
                  value={courseDetails.title}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    id="price"
                    type="number"
                    value={courseDetails.price}
                    onChange={handleChange}
                    min="0"
                    className="block w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={courseDetails.category}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                >
                  <option value="" hidden>
                    Select Category
                  </option>
                  <option value="Development">Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Business">Business</option>
                  <option value="Photography">Photography</option>
                  <option value="Music">Music</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="instructor"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Instructor
                </label>
                <input
                  id="instructor"
                  type="text"
                  value={courseDetails.instructor}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <div className="flex justify-between gap-4">
                  <div className="relative w-full">
                    <input
                      id="hours"
                      type="number"
                      value={courseDetails.hours}
                      onChange={handleChange}
                      min="0"
                      placeholder="00"
                      className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                    <span className="absolute right-2 top-2.5 text-gray-500 text-sm">
                      h
                    </span>
                  </div>
                  <div className="relative w-full">
                    <input
                      id="minutes"
                      type="number"
                      value={courseDetails.minutes}
                      onChange={handleChange}
                      min="0"
                      max="59"
                      placeholder="00"
                      className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                    <span className="absolute right-2 top-2.5 text-gray-500 text-sm">
                      m
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Image
                </label>

                {currentImage && !pImage && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={currentImage}
                      alt="Current"
                      className="h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                <div className="mt-1 flex items-center gap-4">
                  <label
                    htmlFor="pimage"
                    className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {pImage ? "Change Image" : "Choose New Image"}
                    <input
                      id="pimage"
                      name="pimage"
                      type="file"
                      className="sr-only"
                      onChange={(e: any) => setPImage(e.target.files?.[0])}
                      accept="image/*"
                    />
                  </label>
                  <span className="text-sm text-gray-500">
                    {pImage ? pImage.name : "No new file chosen"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              {wait ? (
                <button
                  type="button"
                  disabled
                  className="px-6 py-2.5 bg-indigo-400 text-white rounded-lg cursor-not-allowed flex items-center gap-2"
                >
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  Saving...
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform transition-all active:scale-95"
                >
                  Save Changes
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
