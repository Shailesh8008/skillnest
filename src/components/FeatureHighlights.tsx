import React from "react";
import { Award, Users, Video, Clock } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Expert Instructors",
    description:
      "Learn from industry experts who have years of experience in their respective fields.",
  },
  {
    icon: Video,
    title: "High-Quality Video",
    description:
      "Access HD video lectures that you can watch anytime, anywhere, on any device.",
  },
  {
    icon: Users,
    title: "Community Support",
    description:
      "Join our community of learners to ask questions, share knowledge, and grow together.",
  },
  {
    icon: Clock,
    title: "Lifetime Access",
    description:
      "Get lifetime access to your courses and learn at your own pace without deadlines.",
  },
];

export default function FeatureHighlights() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 transition-colors"
            >
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
