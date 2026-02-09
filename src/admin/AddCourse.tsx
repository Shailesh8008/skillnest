import { useState } from "react";
import AdminNav from "./AdminNav";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function AddCourse() {
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
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (wait) return;
    setWait(true);
    const formData = new FormData();
    formData.append("title", courseDetails.title);
    formData.append("price", courseDetails.price);
    formData.append("category", courseDetails.category);
    formData.append("instructor", courseDetails.instructor);
    formData.append("duration", courseDetails.hours + "h " + courseDetails.minutes + "m");
    formData.append("pimage", pImage);

    try {
      const res = await fetch(`${backendUrl}/api/addcourse`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!data.ok) {
        setWait(false);
        return toast.error(data.message || "Some error occurred");
      }
      toast.success(data.message || "Course Added Successfully");
      setCourseDetails({
        title: "",
        price: "",
        category: "",
        instructor: "",
        hours: "",
        minutes: "",
      });
    } catch (error) {
      console.log("some error occured");
    }
    setWait(false);
  };

  const handleChange = (e: any) => {
    setCourseDetails({
      ...courseDetails,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="flex min-h-screen -mb-14">
      <AdminNav />
      <div className="flex-1 p-4 md:p-10">
        <h1 className="text-2xl md:text-3xl text-gray-800 font-bold mb-6">
          Add New Course �
        </h1>
        <button
          onClick={() => navigate("/admin/courses")}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg cursor-pointer mb-6 transition-colors custom-back-btn"
        >
          ← Back
        </button>
        <div className="bg-white shadow-xl px-6 py-8 rounded-xl max-w-4xl mx-auto border border-gray-100">
          <form
            className="space-y-6"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
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
                  placeholder="e.g. Advanced Web Development"
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
                    placeholder="2999"
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
                  placeholder="e.g. John Doe"
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-1" >Duration</label>
                <div className="flex justify-between gap-4">
                  <span>
                    <input
                      id="hours"
                      type="number"
                      value={courseDetails.hours}
                      onChange={handleChange}
                      min="0"
                      placeholder="04h"
                      className="block w-full pl-4 pr-1 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </span>
                  {/* <span className="self-center font-bold text-xl">:</span> */}
                  <span>
                    <input
                      id="minutes"
                      type="number"
                      value={courseDetails.minutes}
                      onChange={handleChange}
                      min="0"
                      placeholder="30m"
                      className="block w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </span>
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="block text-sm font-medium text-gray-700 mb-1">
                  Course Image
                </p>
                <label
                  htmlFor="pimage"
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors"
                >
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="pimage"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-500 hover:text-indigo-600 "
                      >
                        <span>Upload an Image</span>
                        <input
                          id="pimage"
                          name="pimage"
                          type="file"
                          className="sr-only"
                          onChange={(e: any) => setPImage(e.target.files?.[0])}
                          accept="image/*"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 20MB
                    </p>
                    {pImage && (
                      <p className="text-sm text-green-600 font-medium mt-2">
                        Selected: {pImage.name}
                      </p>
                    )}
                  </div>
                </label>
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
                  Processing...
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform transition-all active:scale-95"
                >
                  Create Course
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
