import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeatureHighlights from "../components/FeatureHighlights";
import CourseCard from "../components/CourseCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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

export default function HomePage() {
  const [featuredCourses, setFeaturedCourses] = useState<CourseCardData[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(
    new Set(),
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/mycourses`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.ok && data.data && data.data.myCourses) {
            setEnrolledCourses(new Set(data.data.myCourses));
          }
        }
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      }
    };

    fetchEnrolledCourses();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/getcourses`);
        const data = await response.json();
        if (!data.ok) {
          console.log(data.message);
          return;
        }
        const mappedCourses = data.data.map((course: Course) => ({
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

        // Sort by students descending and take top 4
        const topCourses = mappedCourses
          .sort(
            (a: CourseCardData, b: CourseCardData) => b.students - a.students,
          )
          .slice(0, 4);

        setFeaturedCourses(topCourses);
      } catch (error) {
        console.log("Error fetching courses", error);
      }
    };
    fetchCourses();
  }, []);
  return (
    <div className="bg-white">
      <Hero />

      <Categories />

      {/* Featured Courses Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Featured Courses
            </h2>
            <p className="text-gray-600">
              Hand-picked courses to help you get started
            </p>
          </div>
          <button className="hidden md:block text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-all">
            View All Courses
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredCourses.map((course, index) => (
            <CourseCard
              key={course.id || index}
              {...course}
              isEnrolled={enrolledCourses.has(course.id)}
            />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <button className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-all">
            View All Courses
          </button>
        </div>
      </section>

      <FeatureHighlights />

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 overflow-hidden relative">
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of students who are already learning new skills and
            transforming their careers with SkillNest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
            >
              Get Started for Free
            </button>
            <button
              onClick={() => navigate("/courses")}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
