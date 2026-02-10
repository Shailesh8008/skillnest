import { Search, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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

export default function Hero({ courses }: { courses: CourseCardData[] }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="relative bg-gradient-to-b from-indigo-50 via-white to-white pt-20 pb-16 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Unlock your creative potential</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Master New Skills <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Shape Your Future
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
              Discover expert-led short courses and workshops designed to help
              you stay ahead in a rapidly evolving world. Join a community of
              lifelong learners today.
            </p>

            <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100 flex items-center max-w-lg">
              <div className="pl-4 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="What do you want to learn?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  navigate(`/courses?search=${searchQuery}`)
                }
                className="w-full px-4 py-3 outline-none text-gray-700 placeholder:text-gray-400"
              />
              <button
                onClick={() => navigate(`/courses?search=${searchQuery}`)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                Explore
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-8 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>{courses.length}+ Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Expert Mentors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Lifetime Access</span>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Students learning together"
                className="w-full h-auto"
              />

              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce-slow">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <span className="font-bold text-xl">98%</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Success Rate</p>
                  <p className="text-xs text-gray-500">From our graduates</p>
                </div>
              </div>
            </div>

            {/* Background decorative blob */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-indigo-200 to-purple-200 rounded-full blur-3xl opacity-30"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
