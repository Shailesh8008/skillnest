import React, { useState, useMemo } from "react";
import CourseCard from "../components/CourseCard";
import CourseFilters from "../components/CourseFilters";
import { Filter } from "lucide-react";

// Extended mock data for the courses page
const allCourses = [
  {
    title: "Complete Web Design: from Figma to Webflow to Freelancing",
    instructor: "Vako Shvili",
    rating: 4.8,
    students: 12500,
    price: "$24.99",
    duration: "22h 30m",
    image:
      "https://images.unsplash.com/photo-1587440871875-191322ee64b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Design",
  },
  {
    title: "The Complete Python Bootcamp From Zero to Hero in Python",
    instructor: "Jose Portilla",
    rating: 4.6,
    students: 8500,
    price: "$19.99",
    duration: "18h 15m",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Development",
  },
  {
    title: "Digital Marketing Masterclass - 23 Courses in 1",
    instructor: "Phil Ebiner",
    rating: 4.5,
    students: 21000,
    price: "$29.99",
    duration: "32h 45m",
    image:
      "https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Marketing",
  },
  {
    title: "Photography Masterclass: A Complete Guide to Photography",
    instructor: "Phil Ebiner",
    rating: 4.7,
    students: 15400,
    price: "$22.99",
    duration: "21h 00m",
    image:
      "https://images.unsplash.com/photo-1554048612-387768052bf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Photography",
  },
  {
    title: "Logic Pro X Masterclass - Learn Music Production",
    instructor: "Tomas George",
    rating: 4.8,
    students: 9200,
    price: "$34.99",
    duration: "25h 10m",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Music",
  },
  {
    title: "Machine Learning A-Z: Hands-On Python & R In Data Science",
    instructor: "Kirill Eremenko",
    rating: 4.7,
    students: 18900,
    price: "$49.99",
    duration: "44h 30m",
    image:
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Data Science",
  },
  {
    title: "Complete Blender Creator: Learn 3D Modelling for Beginners",
    instructor: "GameDev.tv",
    rating: 4.9,
    students: 7600,
    price: "$19.99",
    duration: "36h 00m",
    image:
      "https://images.unsplash.com/photo-1617791160505-6f00504e3519?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Design",
  },
  {
    title: "Investment Banking and Finance: Private Equity Finance",
    instructor: "365 Careers",
    rating: 4.6,
    students: 5400,
    price: "$39.99",
    duration: "14h 45m",
    image:
      "https://images.unsplash.com/photo-1611974765270-ca12586343bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Business",
  },
];

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState("all");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Most Popular");

  const filteredCourses = useMemo(() => {
    return allCourses
      .filter((course) => {
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
          // Assuming all current mock data is paid for simplicity, but simulating logic
          // Real logic would parse the price string or have a isFree boolean
          const isFree = course.price === "Free" || course.price === "$0.00";
          if (priceFilter === "free" && !isFree) return false;
          if (priceFilter === "paid" && isFree) return false;
        }

        // Rating Filter
        if (minRating !== null && course.rating < minRating) {
          return false;
        }

        // Duration Filter
        if (selectedDurations.length > 0) {
          // This would need more complex parsing of "22h 30m" to match ranges like "17+ Hours"
          // For this mock, we'll strip the first number and make a simple guess
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
      .sort((a, b) => {
        switch (sortBy) {
          case "Newest":
            return 0; // Mock data doesn't have dates, keep original order or shuffle
          case "Highest Rated":
            return b.rating - a.rating;
          case "Price: Low to High":
            return (
              parseFloat(a.price.replace("$", "")) -
              parseFloat(b.price.replace("$", ""))
            );
          case "Price: High to Low":
            return (
              parseFloat(b.price.replace("$", "")) -
              parseFloat(a.price.replace("$", ""))
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
  ]);

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

          {/* Desktop Sort - previously inside the mobile div, now duplicated or moved? 
              The original design had the select only in the mobile div which was md:hidden.
              Wait, the original design didn't seem to have a desktop sort dropdown explicitly shown outside the mobile block.
              I should probably add one for desktop too if it's not there, or ensure the mobile one covers it.
              The original code had `gap-2 md:hidden`, so the sort was HIDDEN on desktop. 
              I should probably expose the sort on desktop too.
          */}
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
            {filteredCourses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course, index) => (
                  <CourseCard key={index} {...course} />
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
            {filteredCourses.length > 0 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:text-indigo-600 transition-colors disabled:opacity-50">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium">
                    1
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:text-indigo-600 transition-colors">
                    2
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:text-indigo-600 transition-colors">
                    3
                  </button>
                  <span className="px-4 py-2 text-gray-400">...</span>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:text-indigo-600 transition-colors">
                    8
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:text-indigo-600 transition-colors">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
