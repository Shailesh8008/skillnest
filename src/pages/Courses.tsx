import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import CourseFilters from "../components/CourseFilters";
import { Filter } from "lucide-react";
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

export default function Courses() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState("all");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Most Popular");
  const [allCourses, setAllCourses] = useState<CourseCardData[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    const query = searchParams.get("search") || "";
    setSearchQuery(query);
  }, [searchParams]);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/mycourses`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          // Assuming data.data.myCourses is an array of course IDs
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
        setAllCourses(mappedCourses);
      } catch (error) {
        console.log("Error fetching courses", error);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return allCourses
      .filter((course: CourseCardData) => {
        // Search Filter
        if (
          searchQuery &&
          !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }

        // Category Filter
        if (
          selectedCategories.length > 0 &&
          !selectedCategories.includes(course.category)
        ) {
          return false;
        }

        // Price Filter
        if (priceFilter !== "all") {
          const numericPrice = parseFloat(
            String(course.price).replace(/[^0-9.]/g, ""),
          );
          const isFree = isNaN(numericPrice) || numericPrice === 0;
          if (priceFilter === "free" && !isFree) return false;
          if (priceFilter === "paid" && isFree) return false;
        }

        // Rating Filter
        if (minRating !== null && course.rating < minRating) {
          return false;
        }

        // Duration Filter
        if (selectedDurations.length > 0) {
          const hours = parseInt(course.duration);
          const matchesDuration = selectedDurations.some((durationRange) => {
            if (durationRange === "0-2 Hours") return hours <= 2;
            if (durationRange === "3-6 Hours") return hours >= 3 && hours <= 6;
            if (durationRange === "7-16 Hours")
              return hours >= 7 && hours <= 16;
            if (durationRange === "17+ Hours") return hours >= 17;
            return false;
          });
          if (!matchesDuration) return false;
        }

        return true;
      })
      .sort((a: CourseCardData, b: CourseCardData) => {
        switch (sortBy) {
          case "Newest":
            return 0;
          case "Highest Rated":
            return b.rating - a.rating;
          case "Price: Low to High":
            return (
              parseFloat(String(a.price).replace(/[^0-9.]/g, "")) -
              parseFloat(String(b.price).replace(/[^0-9.]/g, ""))
            );
          case "Price: High to Low":
            return (
              parseFloat(String(b.price).replace(/[^0-9.]/g, "")) -
              parseFloat(String(a.price).replace(/[^0-9.]/g, ""))
            );
          default: // Most Popular
            return b.students - a.students;
        }
      });
  }, [
    searchQuery,
    selectedCategories,
    priceFilter,
    minRating,
    selectedDurations,
    sortBy,
    allCourses,
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Calculate pagination with useMemo
  const totalPages = useMemo(() => {
    return Math.ceil(filteredCourses.length / itemsPerPage);
  }, [filteredCourses.length, itemsPerPage]);

  const currentCourses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredCourses.slice(start, end);
  }, [currentPage, filteredCourses, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCategories,
    priceFilter,
    minRating,
    selectedDurations,
    sortBy,
  ]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Get smart pagination pages
  const getPaginationPages = () => {
    const pages: (number | "dots")[] = [];

    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    pages.push(1);

    if (start > 2) {
      pages.push("dots");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("dots");
    }

    pages.push(totalPages);

    return pages;
  };

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Explore Courses
            </h1>
            <p className="text-gray-600 mt-1">
              Discover the perfect course to upgrade your skills
            </p>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium">
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Most Popular</option>
              <option>Newest</option>
              <option>Highest Rated</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-gray-500 text-sm font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option>Most Popular</option>
              <option>Newest</option>
              <option>Highest Rated</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters - Hidden on mobile, visible on lg screens */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <CourseFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                priceFilter={priceFilter}
                setPriceFilter={setPriceFilter}
                minRating={minRating}
                setMinRating={setMinRating}
                selectedDurations={selectedDurations}
                setSelectedDurations={setSelectedDurations}
              />
            </div>
          </div>

          {/* Course Grid */}
          <div className="lg:col-span-3">
            {currentCourses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCourses.map((course: CourseCardData, index: number) => (
                  <CourseCard
                    key={course.id || index}
                    {...course}
                    isEnrolled={enrolledCourses.has(course.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">
                  No courses found matching your criteria.
                </div>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategories([]);
                    setPriceFilter("all");
                    setMinRating(null);
                    setSelectedDurations([]);
                  }}
                  className="mt-4 text-indigo-600 font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination - Only show if there are courses */}
            {filteredCourses.length > itemsPerPage && (
              <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-indigo-600 text-gray-600 hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {screenWidth < 500 ? "Prev" : "Previous"}
                </button>

                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {getPaginationPages().map((page, index) =>
                    page === "dots" ? (
                      <span
                        key={`dots-${index}`}
                        className="text-gray-400 px-2"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page as number)}
                        className={`px-3 py-2 rounded-lg transition-colors font-medium ${
                          currentPage === page
                            ? "bg-indigo-600 text-white"
                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-indigo-600 text-gray-600 hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
