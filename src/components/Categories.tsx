import {
  Monitor,
  PenTool,
  Layout,
  Database,
  Camera,
  Briefcase,
  Music,
  Globe,
  HelpCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

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

interface CategoryStyle {
  icon: any;
  color: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  Development: {
    icon: Monitor,
    color: "bg-blue-100 text-blue-600",
  },
  Design: {
    icon: PenTool,
    color: "bg-pink-100 text-pink-600",
  },
  Marketing: {
    icon: Layout,
    color: "bg-purple-100 text-purple-600",
  },
  "Data Science": {
    icon: Database,
    color: "bg-green-100 text-green-600",
  },
  Photography: {
    icon: Camera,
    color: "bg-yellow-100 text-yellow-600",
  },
  Business: {
    icon: Briefcase,
    color: "bg-indigo-100 text-indigo-600",
  },
  Music: {
    icon: Music,
    color: "bg-red-100 text-red-600",
  },
  Languages: {
    icon: Globe,
    color: "bg-teal-100 text-teal-600",
  },
};

const DEFAULT_STYLE = {
  icon: HelpCircle,
  color: "bg-gray-100 text-gray-600",
};

export default function Categories({ courses }: { courses: CourseCardData[] }) {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const categoryCounts: Record<string, number> = {};

    courses.forEach((course) => {
      const cat = course.category;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const formattedCategories = Object.entries(categoryCounts).map(
      ([name, count]) => {
        const style = CATEGORY_STYLES[name] || DEFAULT_STYLE;
        return {
          name,
          count: `${count}+ Courses`,
          icon: style.icon,
          color: style.color,
        };
      },
    );

    setCategories(formattedCategories);
  }, [courses]);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Top Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of courses and find the perfect skill to
            master next.
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${category.color} group-hover:scale-110 transition-transform`}
                >
                  <category.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-400">{category.count}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            Loading categories...
          </div>
        )}
      </div>
    </section>
  );
}
