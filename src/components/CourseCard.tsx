import { Star, Clock } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  rating: number | string;
  students: number | string;
  price: number | string;
  duration: string;
  image: string;
  category: string;
  isEnrolled?: boolean;
  onEnroll?: () => void;
}

import { useState } from "react";
import Modal from "./Modal";
import { Check } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CourseCard({
  id,
  title,
  instructor,
  rating,
  students,
  price,
  duration,
  image,
  category,
  isEnrolled = false,
  onEnroll,
}: CourseCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [wait, setWait] = useState(false);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const RazorpayID = import.meta.env.VITE_RAZORPAY_ID;

  // Helper to get numeric price safely
  const getNumericPrice = (p: string | number) => {
    if (typeof p === "number") return p;
    const cleaned = String(p).replace(/[^0-9.]/g, "");
    return cleaned ? parseFloat(cleaned) : 0;
  };

  const numericPrice = getNumericPrice(price);

  const handleCheckout = async () => {
    if (wait) return;
    setWait(true);

    if (numericPrice <= 0) {
      try {
        const res = await fetch(`${backendUrl}/api/enroll`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId: id,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setWait(false);
          return toast.error(data.message || "Enrollment failed");
        }
        setWait(false);
        setIsModalOpen(false);
        toast.success("Enrolled successfully!");
        if (onEnroll) onEnroll();
      } catch (error) {
        setWait(false);
        return toast.error("Something went wrong");
      }
      return;
    }

    try {
      const amount = numericPrice;

      const receipt = "receipt#" + Date.now();
      const res = await fetch(`${backendUrl}/api/checkout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency: "INR",
          receipt,
        }),
      });

      const data = await res.json();
      console.log(data);
      if (!data.ok) {
        setWait(false);
        if (data.message === "Error creating order") {
          return toast.error(data.message || "Checkout failed");
        }
        toast("Please login first", { icon: "ℹ️" });
        return navigate("/login");
      }
      const options = {
        key: RazorpayID,
        amount: data.data.amount,
        currency: data.data.currency,
        name: "SkillNest",
        order_id: data.data.id,
        prefill: {
          name: "",
          email: data.email,
        },
        handler: async function (res: any) {
          try {
            const response = await fetch(`${backendUrl}/api/verifypayment`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                amount,
                courseId: id,
                orderId: res.razorpay_order_id,
                paymentId: res.razorpay_payment_id,
                signature: res.razorpay_signature,
              }),
            });
            const data1 = await response.json();
            if (!response.ok) {
              setWait(false);
              return toast.error(
                data1.message || "Payment verification failed",
              );
            }
            setWait(false);
            setIsModalOpen(false);
            toast.success("Enrolled successfully!");
            if (onEnroll) onEnroll();
          } catch (error) {
            setWait(false);
            return toast.error("Something went wrong");
          }
        },
      };

      // @ts-ignore
      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.open();
    } catch (error) {
      setWait(false);
      console.log(error);
      return toast.error("Something went wrong");
    } finally {
      setWait(false);
    }
  };

  return (
    <>
      <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden">
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
              <div className="text-lg font-bold text-indigo-600">
                {numericPrice <= 0 ? "Free" : `₹ ${numericPrice}`}
              </div>
            </div>
            <button
              onClick={() => {
                if (isEnrolled) {
                  navigate(`/course/${id}`, {
                    state: {
                      courseData: {
                        id,
                        title,
                        instructor,
                        rating,
                        students,
                        price,
                        duration,
                        image,
                        category,
                      },
                    },
                  });
                } else {
                  setIsModalOpen(true);
                }
              }}
              className={`w-full font-medium py-2 rounded-lg transition-colors ${
                isEnrolled
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {isEnrolled ? "View Course" : "Enroll Now"}
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <img
              src={image}
              alt={title}
              className="w-24 h-24 object-cover rounded-lg shadow-sm"
            />
            <div>
              <div className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full mb-2">
                {category}
              </div>
              <h3 className="font-bold text-xl text-gray-900 leading-tight mb-1">
                {title}
              </h3>
              <p className="text-gray-500 text-sm">by {instructor}</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Duration</p>
                  <p className="text-gray-900 font-semibold">{duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Star className="w-5 h-5 text-amber-400 fill-current" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Rating</p>
                  <p className="text-gray-900 font-semibold">
                    {rating}{" "}
                    <span className="text-gray-400 font-normal">/ 5.0</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">What you'll get:</h4>
              <ul className="grid grid-cols-1 gap-2">
                {[
                  "Full lifetime access",
                  "Access on mobile and TV",
                  "Certificate of completion",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <Check className="w-4 h-4 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Total Price</p>
              <p className="text-2xl font-bold text-indigo-600">₹ {price}</p>
            </div>
            <button
              onClick={handleCheckout}
              disabled={wait}
              className={`bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 ${wait ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {wait ? "Processing..." : "Checkout"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
