import { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function EditCourse({ id }: { id?: string }) {
  /* Module Interface */
  interface Lesson {
    title: string;
    videoType: "youtube" | "cloudinary";
    youtubeUrl?: string;
    videoFile?: File;
    videoUrl?: string; // For existing video URL
    _id?: string;
  }

  interface Module {
    title: string;
    lessons: Lesson[];
    _id?: string;
  }

  const [wait, setWait] = useState(false);
  const [courseDetails, setCourseDetails] = useState<any>({
    title: "",
    description: "",
    price: "",
    category: "",
    instructor: "",
  });
  const [pImage, setPImage] = useState<any>("");
  const [currentImage, setCurrentImage] = useState<string>("");
  const [modules, setModules] = useState<Module[]>([]);
  const navigate = useNavigate();

  /* Module Handlers */
  const addModule = () => {
    setModules([...modules, { title: "", lessons: [] }]);
  };

  const removeModule = (index: number) => {
    const updatedModules = [...modules];
    updatedModules.splice(index, 1);
    setModules(updatedModules);
  };

  const updateModuleTitle = (index: number, value: string) => {
    const updatedModules = [...modules];
    updatedModules[index].title = value;
    setModules(updatedModules);
  };

  const addLesson = (moduleIndex: number) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons.push({
      title: "",
      videoType: "youtube",
      youtubeUrl: "",
    });
    setModules(updatedModules);
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons.splice(lessonIndex, 1);
    setModules(updatedModules);
  };

  const updateLesson = (
    moduleIndex: number,
    lessonIndex: number,
    field: keyof Lesson,
    value: any,
  ) => {
    const updatedModules = [...modules];
    (updatedModules[moduleIndex].lessons[lessonIndex] as any)[field] = value;
    setModules(updatedModules);
  };
  const params = useParams();

  const getCourseData = async (pid: any) => {
    try {
      const res = await fetch(`${backendUrl}/api/getcourse/${pid}`);
      const data = await res.json();
      if (!data) {
        return toast.error(data.message);
      }
      const course = data.data;

      setCourseDetails({
        title: course.title || course.pname, // Handle legacy pname if needed
        description: course.description || "",
        price: course.price,
        category: course.category,
        instructor: course.instructor || "",
      });
      setCurrentImage(course.pimage);

      // Populate modules if available
      if (course.modules) {
        const mappedModules = course.modules.map((m: Module) => ({
          ...m,
          lessons: m.lessons.map((l: Lesson) => ({
            ...l,
            youtubeUrl: l.videoType === "youtube" ? l.videoUrl : "",
            videoUrl: l.videoUrl,
          })),
        }));
        setModules(mappedModules);
      }
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
    formData.append("description", courseDetails.description);
    formData.append("price", courseDetails.price);
    formData.append("category", courseDetails.category);
    formData.append("instructor", courseDetails.instructor);
    if (pImage) {
      formData.append("pimage", pImage);
    }

    // Append Modules
    const modulesData = modules.map((m) => ({
      _id: m._id, // Keep ID for existing modules to update them
      title: m.title,
      lessons: m.lessons.map((l) => ({
        _id: l._id, // Keep ID for existing lessons
        title: l.title,
        videoType: l.videoType,
        youtubeUrl: l.youtubeUrl,
        videoUrl: l.videoUrl, // Keep existing video URL if unchanged
      })),
    }));
    formData.append("modules", JSON.stringify(modulesData));

    // Append lesson video files if any new files are selected
    modules.forEach((module, mIndex) => {
      module.lessons.forEach((lesson, lIndex) => {
        if (lesson.videoType === "cloudinary" && lesson.videoFile) {
          formData.append(`video_${mIndex}_${lIndex}`, lesson.videoFile);
        }
      });
    });

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
      <div className="flex-1 p-4 md:p-10 mb-[3rem]">
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

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={courseDetails.description}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
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
                  <option value="Photography">Photography</option>
                  <option value="Music">Music</option>
                  <option value="Softwares">Softwares</option>
                  <option value="Others">Others</option>
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

              {/* Modules and Lessons Section */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-800">
                    Course Modules
                  </h2>
                  <button
                    type="button"
                    onClick={addModule}
                    className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors"
                  >
                    + Add Module
                  </button>
                </div>

                {modules.map((module, mIndex) => (
                  <div
                    key={mIndex}
                    className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <input
                        type="text"
                        placeholder={`Module ${mIndex + 1} Title`}
                        value={module.title}
                        onChange={(e) =>
                          updateModuleTitle(mIndex, e.target.value)
                        }
                        className="flex-1 mr-4 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeModule(mIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-3 pl-4 border-l-2 border-indigo-100">
                      {module.lessons.map((lesson, lIndex) => (
                        <div
                          key={lIndex}
                          className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm font-medium text-gray-600">
                              Lesson {lIndex + 1}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeLesson(mIndex, lIndex)}
                              className="text-red-400 hover:text-red-600 text-xs"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Lesson Title"
                              value={lesson.title}
                              onChange={(e) =>
                                updateLesson(
                                  mIndex,
                                  lIndex,
                                  "title",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-1 focus:ring-indigo-500"
                            />

                            <select
                              value={lesson.videoType}
                              onChange={(e) =>
                                updateLesson(
                                  mIndex,
                                  lIndex,
                                  "videoType",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:ring-1 focus:ring-indigo-500"
                            >
                              <option value="youtube">YouTube URL</option>
                              <option value="cloudinary">Upload Video</option>
                            </select>

                            <div className="md:col-span-2">
                              {lesson.videoType === "youtube" ? (
                                <input
                                  type="text"
                                  placeholder="Paste YouTube link"
                                  value={lesson.youtubeUrl || ""}
                                  onChange={(e) =>
                                    updateLesson(
                                      mIndex,
                                      lIndex,
                                      "youtubeUrl",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-1 focus:ring-indigo-500"
                                />
                              ) : (
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="file"
                                      accept="video/*"
                                      onChange={(e) =>
                                        updateLesson(
                                          mIndex,
                                          lIndex,
                                          "videoFile",
                                          e.target.files?.[0],
                                        )
                                      }
                                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                    {lesson.videoFile && (
                                      <span className="text-xs text-green-600">
                                        New Selected
                                      </span>
                                    )}
                                  </div>
                                  {lesson.videoUrl && !lesson.videoFile && (
                                    <p className="text-xs text-indigo-500 truncate">
                                      Current: {lesson.videoUrl}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addLesson(mIndex)}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                      >
                        + Add Lesson
                      </button>
                    </div>
                  </div>
                ))}
                {modules.length > 0 && (
                  <button
                    type="button"
                    onClick={addModule}
                    className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors"
                  >
                    + Add Module
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-14">
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
