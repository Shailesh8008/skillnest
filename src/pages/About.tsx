import {
  Users,
  Target,
  Heart,
  Globe,
  Award,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  const stats = [
    { label: "Students", value: "1k+", icon: Users },
    { label: "Courses", value: "10+", icon: Award },
    { label: "Instructors", value: "10+", icon: Globe },
    { label: "Satisfaction", value: "4.9/5", icon: Heart },
  ];

  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description:
        "We're dedicated to democratizing education and making high-quality learning accessible to everyone, everywhere.",
    },
    {
      icon: Heart,
      title: "Student-First",
      description:
        "Our students' success is our success. We prioritize learning outcomes and user experience in everything we do.",
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description:
        "We constantly evolve our platform with cutting-edge technology to provide the best possible learning environment.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "We believe in the power of community. Learning together leads to better understanding and faster growth.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-founder",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Michael Chen",
      role: "Head of Education",
      image:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Emily Davis",
      role: "Lead Designer",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "David Wilson",
      role: "CTO",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-indigo-50 to-white pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Our Story</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-8">
            Empowering the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Future of Learning
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We're on a mission to transform education through accessible,
            high-quality, and engaging online courses for everyone.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white -mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Team collaborating"
                className="relative rounded-2xl shadow-2xl skew-y-3 hover:skew-y-0 transition-all duration-500"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-gray-900">Our Mission</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  At SkillNest, we believe that education is the key to
                  unlocking human potential. We founded this platform with a
                  simple yet ambitious goal: to bridge the gap between ambition
                  and comprehensive learning.
                </p>
                <p>
                  Today, we're proud to support a global community of learners
                  and instructors who are passionate about sharing knowledge and
                  growing together.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      className="w-12 h-12 rounded-full border-4 border-white"
                      src={`https://i.pravatar.cc/150?img=${i + 10}`}
                      alt={`Member ${i}`}
                    />
                  ))}
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-bold text-gray-900">
                    Join our community
                  </span>
                  <span className="text-sm text-gray-500">
                    10,000+ active learners
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do at SkillNest.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet the Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate individuals behind SkillNest.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group relative">
                <div className="overflow-hidden rounded-2xl mb-4 shadow-lg aspect-[4/5] bg-gray-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-indigo-600 font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-indigo-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
            Join thousands of learners and instructors on SkillNest today.
            Transform your career with new skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-4 bg-white text-indigo-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200 flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/courses")}
              className="px-8 py-4 bg-transparent border-2 border-indigo-400 text-white rounded-xl font-bold text-lg hover:bg-indigo-800/50 transition-colors flex items-center justify-center"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
