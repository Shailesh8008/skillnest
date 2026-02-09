import {
  Monitor,
  PenTool,
  Layout,
  Database,
  Camera,
  Briefcase,
  Music,
  Globe,
} from "lucide-react";

const categories = [
  {
    icon: Monitor,
    name: "Development",
    count: "120+ Courses",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: PenTool,
    name: "Design",
    count: "85+ Courses",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: Layout,
    name: "Marketing",
    count: "40+ Courses",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Database,
    name: "Data Science",
    count: "55+ Courses",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Camera,
    name: "Photography",
    count: "30+ Courses",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: Briefcase,
    name: "Business",
    count: "90+ Courses",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: Music,
    name: "Music",
    count: "25+ Courses",
    color: "bg-red-100 text-red-600",
  },
  {
    icon: Globe,
    name: "Languages",
    count: "60+ Courses",
    color: "bg-teal-100 text-teal-600",
  },
];

export default function Categories() {
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
      </div>
    </section>
  );
}
