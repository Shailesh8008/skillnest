import React from "react";
import { Search, ChevronDown } from "lucide-react";

interface CourseFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  priceFilter: string;
  setPriceFilter: (price: string) => void;
  minRating: number | null;
  setMinRating: (rating: number | null) => void;
  selectedDurations: string[];
  setSelectedDurations: (durations: string[]) => void;
}

export default function CourseFilters({
  searchQuery,
  setSearchQuery,
  selectedCategories,
  setSelectedCategories,
  priceFilter,
  setPriceFilter,
  minRating,
  setMinRating,
  selectedDurations,
  setSelectedDurations,
}: CourseFiltersProps) {
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const toggleDuration = (duration: string) => {
    if (selectedDurations.includes(duration)) {
      setSelectedDurations(selectedDurations.filter((d) => d !== duration));
    } else {
      setSelectedDurations([...selectedDurations, duration]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
          Categories
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </h3>
        <div className="space-y-3">
          {[
            "Development",
            "Design",
            "Marketing",
            "Business",
            "Photography",
            "Music",
            "Data Science",
          ].map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
              />
              <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Price */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Price</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="price"
              checked={priceFilter === "all"}
              onChange={() => setPriceFilter("all")}
              className="w-4 h-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-gray-600 group-hover:text-gray-900">
              All Prices
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="price"
              checked={priceFilter === "free"}
              onChange={() => setPriceFilter("free")}
              className="w-4 h-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-gray-600 group-hover:text-gray-900">
              Free
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="price"
              checked={priceFilter === "paid"}
              onChange={() => setPriceFilter("paid")}
              className="w-4 h-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-gray-600 group-hover:text-gray-900">
              Paid
            </span>
          </label>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Rating</h3>
        <div className="space-y-3">
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="rating"
                checked={minRating === rating}
                onChange={() => setMinRating(rating)}
                className="w-4 h-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-gray-600 group-hover:text-gray-900 flex items-center gap-1">
                {rating} <span className="text-amber-400">★</span> & up
              </span>
            </label>
          ))}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="rating"
              checked={minRating === null}
              onChange={() => setMinRating(null)}
              className="w-4 h-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-gray-600 group-hover:text-gray-900">
              Any Rating
            </span>
          </label>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Duration */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Duration</h3>
        <div className="space-y-3">
          {["0-2 Hours", "3-6 Hours", "7-16 Hours", "17+ Hours"].map(
            (duration) => (
              <label
                key={duration}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedDurations.includes(duration)}
                  onChange={() => toggleDuration(duration)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-600 group-hover:text-gray-900">
                  {duration}
                </span>
              </label>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
