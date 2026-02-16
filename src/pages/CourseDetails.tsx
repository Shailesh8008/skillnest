import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  PlayCircle,
  ChevronDown,
  ChevronUp,
  Star,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";
import VideoPlayer from "../components/HLSVideoPlayer";

export default function CourseDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [course, setCourse] = useState<any>(location.state?.courseData || null);
  const [loading, setLoading] = useState(true);

  const [expandedSection, setExpandedSection] = useState<number | null>(0);
  const [activeLesson, setActiveLesson] = useState<any>(null);

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(`course_progress_${id}`);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    if (id) {
      localStorage.setItem(
        `course_progress_${id}`,
        JSON.stringify(Array.from(completedLessons)),
      );
    }
  }, [completedLessons, id]);

  useEffect(() => {
    const checkEnrollmentAndFetchCourse = async () => {
      try {
        setLoading(true);
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        // 1. Fetch User's Enrolled Course IDs first to verify access
        const myCoursesRes = await fetch(`${backendUrl}/api/mycourses`, {
          method: "GET",
          credentials: "include",
        });

        if (!myCoursesRes.ok) {
          // If 401/403, user is likely not logged in
          if (myCoursesRes.status === 401 || myCoursesRes.status === 403) {
            toast.error("Please log in to view this course");
            navigate("/login");
            return;
          }
          throw new Error("Failed to verify enrollment");
        }

        const myCoursesData = await myCoursesRes.json();
        const enrolledIds = new Set<string>();
        if (myCoursesData.data?.myCourses) {
          myCoursesData.data.myCourses.forEach((courseId: string) =>
            enrolledIds.add(courseId),
          );
        }

        // 2. Check if current course ID is in enrolled list
        if (!id || !enrolledIds.has(id)) {
          toast.error("You are not enrolled in this course");
          navigate("/courses");
          return;
        }

        // 3. Fetch course details
        const res = await fetch(`${backendUrl}/api/getcourse/${id}`);
        const data = await res.json();

        if (data.ok && data.data) {
          setCourse(data.data);
          // Set initial active lesson if modules exist
          if (
            data.data.modules &&
            data.data.modules.length > 0 &&
            data.data.modules[0].lessons.length > 0
          ) {
            setActiveLesson(data.data.modules[0].lessons[0]);
          }
        } else {
          toast.error("Course details not found");
          navigate("/my-courses");
        }
      } catch (error) {
        console.error("Error accessing course:", error);
        toast.error("Failed to load course details");
        navigate("/courses");
      } finally {
        setLoading(false);
      }
    };

    checkEnrollmentAndFetchCourse();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!course) return null;

  const toggleLessonCompletion = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      if (!url) return "";
      if (url.includes("embed/")) return url;
      if (url.includes("watch?v="))
        return url.replace("watch?v=", "embed/").split("&")[0];
      if (url.includes("youtu.be/"))
        return url.replace("youtu.be/", "www.youtube.com/embed/");
      return url;
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-20 pb-10">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/my-courses")}
          className="flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ChevronDown className="w-4 h-4 rotate-90 mr-1" />
          Back to My Courses
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player Section */}
            <div className="bg-black rounded-2xl overflow-hidden shadow-xl aspect-video relative group">
              {activeLesson ? (
                activeLesson.videoType === "youtube" ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={getYouTubeEmbedUrl(activeLesson.videoUrl)}
                    title={activeLesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <VideoPlayer
                    videoUrl={activeLesson.videoUrl}
                    className="w-full h-full object-contain"
                  />
                )
              ) : (
                <video
                  src="/videos/error-video.mp4"
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )}
            </div>

            {/* Active Lesson Details */}
            {activeLesson && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {activeLesson.title}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {/* Lesson description could go here */}
                  </p>
                </div>
                <button
                  onClick={() => toggleLessonCompletion(activeLesson._id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all transform active:scale-95 ${
                    completedLessons.has(activeLesson._id)
                      ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                  }`}
                >
                  {completedLessons.has(activeLesson._id) ? (
                    <>
                      <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center">
                        ✓
                      </div>
                      Completed
                    </>
                  ) : (
                    "Mark as Completed"
                  )}
                </button>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full mb-3 uppercase tracking-wide">
                    {course.category}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h1>
                  <p className="text-gray-500 text-lg">
                    by{" "}
                    <span className="text-gray-900 font-medium">
                      {course.instructor}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                    <Star className="w-5 h-5 text-amber-400 fill-current" />
                    <span className="font-bold text-gray-900">
                      {course.rating}
                    </span>
                    <span className="text-xs text-gray-500">/ 5.0</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {course.students} students enrolled
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full my-6"></div>

              <div className="prose prose-indigo max-w-none text-gray-600">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  About this course
                </h3>
                <p className="leading-relaxed mb-4">
                  {course.description ||
                    `Master the comprehensive skills required to excel in ${course.category} with this in-depth course.`}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-900">Course Content</h3>
              </div>

              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto custom-scrollbar">
                {course.modules &&
                  course.modules.map((module: any, index: number) => (
                    <div key={index} className="bg-white">
                      <button
                        onClick={() =>
                          setExpandedSection(
                            expandedSection === index ? null : index,
                          )
                        }
                        className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-bold text-gray-900 text-sm text-left group-hover:text-indigo-600 transition-colors">
                            {module.title}
                          </span>
                          <span className="text-xs text-gray-400">
                            {module.lessons?.length || 0} lessons
                          </span>
                        </div>
                        {expandedSection === index ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </button>

                      {expandedSection === index && (
                        <div className="bg-gray-50/50 pb-2 border-t border-gray-50">
                          {module.lessons &&
                            module.lessons.map((lesson: any, kidx: number) => (
                              <button
                                key={kidx}
                                onClick={() => setActiveLesson(lesson)}
                                className={`w-full px-4 py-3 flex items-start gap-3 text-sm transition-all border-l-4 ${
                                  activeLesson === lesson
                                    ? "bg-indigo-50 border-indigo-600"
                                    : "border-transparent hover:bg-gray-100"
                                }`}
                              >
                                <div className="mt-0.5">
                                  <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                      completedLessons.has(lesson._id)
                                        ? "bg-green-500 border-green-500"
                                        : activeLesson === lesson
                                          ? "border-indigo-600"
                                          : "border-gray-300"
                                    }`}
                                  >
                                    {completedLessons.has(lesson._id) ? (
                                      <svg
                                        className="w-3 h-3 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    ) : (
                                      activeLesson === lesson && (
                                        <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                                      )
                                    )}
                                  </div>
                                </div>
                                <div className="flex-1 text-left">
                                  <p
                                    className={`font-medium ${activeLesson === lesson ? "text-indigo-900" : "text-gray-700"}`}
                                  >
                                    {lesson.title}
                                  </p>
                                  <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                    <PlayCircle className="w-3 h-3" />{" "}
                                    {lesson.duration || "00:00"}
                                  </span>
                                </div>
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
