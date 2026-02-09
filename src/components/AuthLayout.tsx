import React from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  image?: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  image = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px] lg:min-h-[600px]">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-8 px-6 lg:px-12 xl:px-16">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-6">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                  SkillNest
                </span>
              </Link>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {title}
              </h2>
              <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
            </div>

            <div className="mt-4">{children}</div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block w-1/2 relative bg-gray-900">
          <img
            className="absolute inset-0 h-full w-full object-cover opacity-90"
            src={image}
            alt="Authentication background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 to-transparent flex flex-col justify-end p-10 text-white">
            <blockquote className="max-w-md mx-auto lg:mx-0">
              <p className="text-lg font-medium leading-7 mb-4 italic">
                "Education is the passport to the future, for tomorrow belongs
                to those who prepare for it today."
              </p>
              <footer className="text-indigo-200 font-medium text-sm">
                — Malcolm X
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
