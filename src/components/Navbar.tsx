import React, { useState } from "react";
import { Menu, X, BookOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">
                SkillNest
              </span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:text-gray-900 transition-colors ${location.pathname === "/" ? "border-indigo-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300"}`}
              >
                Home
              </Link>
              <Link
                to="/courses"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:text-gray-900 transition-colors ${location.pathname === "/courses" ? "border-indigo-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300"}`}
              >
                Courses
              </Link>
              <Link
                to="#"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:text-gray-900 transition-colors ${location.pathname === "/mentors" ? "border-indigo-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300"}`}
              >
                Mentors
              </Link>
              <Link
                to="#"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:text-gray-900 transition-colors ${location.pathname === "/enterprise" ? "border-indigo-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300"}`}
              >
                Enterprise
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-900 font-medium text-sm transition-colors">
              Sign in
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow">
              Get Started
            </button>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="#"
              className="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Home
            </Link>
            <Link
              to="#"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Courses
            </Link>
            <Link
              to="#"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Mentors
            </Link>
            <Link
              to="#"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Enterprise
            </Link>
          </div>
          <div className="pt-4 pb-4 border-t border-gray-100">
            <div className="px-4 space-y-3">
              <button className="w-full text-center text-gray-500 hover:text-gray-900 font-medium text-base transition-colors border border-gray-200 rounded-lg py-2">
                Sign in
              </button>
              <button className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-base font-medium transition-colors shadow-sm">
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
