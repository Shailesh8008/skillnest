import React from "react";
import { Star, Clock } from "lucide-react";

interface CourseCardProps {
  title: string;
  instructor: string;
  rating: number;
  students: number;
  price: string;
  duration: string;
  image: string;
  category: string;
}

export default function CourseCard({
  title,
  instructor,
  rating,
  students,
  price,
  duration,
  image,
  category,
}: CourseCardProps) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-indigo-600">
          {category}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 text-amber-400 mb-2">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-medium text-gray-700">{rating}</span>
          <span className="text-xs text-gray-400">({students} students)</span>
        </div>

        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-4">by {instructor}</p>

        <div className="pt-4 mt-auto border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
            <div className="text-lg font-bold text-indigo-600">{price}</div>
          </div>
          <button className="w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}
