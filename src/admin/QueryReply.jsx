import { useEffect, useState } from "react";
import { FcVoicePresentation } from "react-icons/fc";
import { useNavigate, useParams } from "react-router-dom";
import AdminNav from "./AdminNav";
import toast from "react-hot-toast";
const backendUrl = import.meta.env.VITE_BACKEND_URL

export default function QueryReply() {
  const [formData, setFormData] = useState({
    to: "",
    sub: "",
    reply: "",
  });
  const [wait, setWait] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const getQueryDetails = async (id) => {
    try {
      const res = await fetch(`${backendUrl}/api/getquerydetails/${id}`);
      const data = await res.json();
      if (!data.ok) {
        return toast.error(data.message);
      }
      return setFormData({ ...formData, to: data.data.email });
    } catch (error) {
      toast.error("Internal server error");
    }
  };

  useEffect(() => {
    getQueryDetails(params.id);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (wait) return;
    try {
      setWait(true);
      const res = await fetch(`${backendUrl}/api/queryreply/${params.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.ok) {
        setWait(false);
        return toast.error(data.message);
      }
      toast.success(data.message);
      return navigate("/admin/query");
    } catch (error) {
      setWait(false);
      return toast.error("Internal server error");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  return (
    <div className="flex min-h-screen -mb-14">
      <AdminNav />
      <div className="flex-1 p-10">
        <div className="flex gap-2 mb-4 flex-wrap">
          <h1 className="text-2xl text-gray-700 font-bold">Reply Query</h1>
          <FcVoicePresentation className="text-3xl" />
        </div>
        <button
          onClick={(e) => navigate("/admin/query")}
          className="bg-gray-300 active:bg-gray-400 px-4 py-1 rounded cursor-pointer mb-4"
        >
          Back
        </button>
        <div className="shadow-lg px-4 py-6 rounded max-w-3xl mx-auto">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <p>To</p>
              <div className="block w-full shadow-inner shadow-gray-200 mt-2 py-1.5 px-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-gray-50">
                {formData.to}
              </div>
            </div>
            <div>
              <p>From</p>
              <div className="block w-full shadow-inner shadow-gray-200 mt-2 py-1.5 px-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-gray-50">
                shailesh10thd1@gmail.com
              </div>
            </div>
            <div>
              <label htmlFor="sub">Subject</label>
              <input
                id="sub"
                type="text"
                value={formData.sub}
                onChange={handleChange}
                className="block w-full shadow-inner shadow-gray-200 mt-2 py-1.5 px-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-gray-50"
              />
            </div>
            <div>
              <label htmlFor="reply">Reply</label>
              <textarea
                id="reply"
                value={formData.reply}
                onChange={handleChange}
                placeholder="Enter your message"
                className="w-full shadow-inner shadow-gray-200 mt-2 py-1.5 px-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-gray-50"
                rows="3"
              ></textarea>
            </div>

            {wait ? (
              <button className="px-5 py-1.5 bg-blue-600 opacity-50 rounded text-gray-300 cursor-not-allowed">
                Send
              </button>
            ) : (
              <button className="px-5 py-1.5 bg-blue-600 rounded text-white cursor-pointer active:bg-blue-800">
                Send
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
