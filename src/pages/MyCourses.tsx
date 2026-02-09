import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { BookOpen, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface Course {
  _id: string;
  title: string;
  instructor: string;
  price: string;
  duration: string;
  pimage: string;
  category: string;
  rating?: number;
  students?: number;
}

interface CourseCardData {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  price: string;
  duration: string;
  image: string;
  category: string;
}

export default function MyCourses() {
  const [courses, setCourses] = useState<CourseCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch User's Enrolled Course IDs
        const myCoursesRes = await fetch(`${backendUrl}/api/mycourses`, {
          method: "GET",
          credentials: "include",
        });

        const myCoursesData = await myCoursesRes.json();
        const enrolledIds = new Set<string>();

        if (myCoursesRes.ok && myCoursesData.data?.myCourses) {
          myCoursesData.data.myCourses.forEach((id: string) =>
            enrolledIds.add(id),
          );
        }

        // 2. Fetch All Courses (to get details)
        // Note: Ideally backend should provide a populated /mycourses endpoint
        const allCoursesRes = await fetch(`${backendUrl}/api/getcourses`);
        const allCoursesData = await allCoursesRes.json();

        if (allCoursesData.ok) {
          const filteredCourses = allCoursesData.data
            .filter((course: Course) => enrolledIds.has(course._id))
            .map((course: Course) => ({
              id: course._id,
              title: course.title,
              instructor: course.instructor || "Unknown Instructor",
              rating: course.rating || (Math.random() * (5 - 4) + 4).toFixed(1),
              students: course.students,
              price: course.price,
              duration: course.duration || "0h 0m",
              image: course.pimage,
              category: course.category,
            }));

          setCourses(filteredCourses);
        }
      } catch (error) {
        console.error("Error fetching my courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-gray-500 font-medium">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Continue your learning journey.
            </p>
          </div>
        </div>

        {courses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <CourseCard
                key={course.id || index}
                {...course}
                isEnrolled={true}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No courses enrolled yet
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You haven't enrolled in any courses yet. Explore our catalog to
              find the perfect course for you.
            </p>
            <button
              onClick={() => navigate("/courses")}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-200"
            >
              Browse Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
