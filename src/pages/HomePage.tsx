import React from "react";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeatureHighlights from "../components/FeatureHighlights";
import CourseCard from "../components/CourseCard";

// Mock data for featured courses
const featuredCourses = [
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
];

export default function HomePage() {
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
            <CourseCard key={index} {...course} />
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
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200">
              Get Started for Free
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
              Browse Courses
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
