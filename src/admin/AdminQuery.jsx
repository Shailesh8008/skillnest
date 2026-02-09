import { useState } from "react";
import AdminNav from "./AdminNav";
import { FcVoicePresentation } from "react-icons/fc";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL

export default function AdminQuery() {
  const [queries, setQueries] = useState([]);
  const [isQueryOpen, setIsQueryOpen] = useState({ status: false, query: {} });
  const navigate = useNavigate();

  const getQueries = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/getqueries`);
      const data = await res.json();
      if (!data.ok) {
        toast.error(data.message);
        return setQueries([]);
      }
      return setQueries(data.data.reverse());
    } catch (error) {
      toast.error("Internal server error");
    }
  };

  useEffect(() => {
    getQueries();
  }, []);

  const validateLength = (value) =>
    value.length > 10 ? value.slice(0, 10) + "..." : value;

  const handleDelete = async (qid) => {
    try {
      const res = await fetch(`${backendUrl}/api/deletequery/${qid}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!data.ok) {
        return toast.error(data.message || "Cannot delete this query");
      }
      setQueries(data.data.reverse());
      return toast.success("Successfully Deleted");
    } catch (error) {
      toast.error("Internal server error");
    }
  };

  const updateStatus = async (id) => {
    try {
      const res = await fetch(`${backendUrl}/api/updatestatus/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!data.ok) {
        return toast.error(data.message);
      }
      return setQueries(data.data.reverse());
    } catch (error) {
      return toast.error("Internal server error");
    }
  };

  return (
    <div className="flex min-h-screen -mb-14 cursor-default">
      <AdminNav />
      <div
        className="flex-1 p-10 relative overflow-hidden"
        onClick={() => setIsQueryOpen({ status: false, query: {} })}
      >
        <div className="flex gap-2 mb-4 flex-wrap">
          <h1 className="text-2xl text-gray-700 font-bold">Manage Queries</h1>
          <FcVoicePresentation className="text-3xl" />
        </div>
        {isQueryOpen.status ? (
          <div
            className={`w-4xl h-full backdrop-blur-xs absolute justify-self-center`}
          >
            <div
              className="bg-white w-2xl justify-self-center p-4 rounded-lg mt-7 border border-gray-200 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-semibold">
                Username: {isQueryOpen.query.username}
              </h2>
              <p className="font-semibold">Email: {isQueryOpen.query.email}</p>
              <hr className="my-2 text-gray-400" />
              <p className="break-words">{isQueryOpen.query.query}</p>
              <hr className="my-2 text-gray-400" />
              <div className="text-end space-x-3">
                <button
                  onClick={(e) =>
                    navigate(`/admin/queryreply/${isQueryOpen.query["_id"]}`)
                  }
                  className="text-xs text-white bg-green-500 active:bg-green-600 px-3 py-2 rounded cursor-pointer font-semibold"
                >
                  Reply
                </button>
                <button
                  onClick={() => {
                    handleDelete(isQueryOpen.query["_id"]);
                    setIsQueryOpen({ status: false, query: {} });
                  }}
                  className="text-xs text-white bg-red-500 active:bg-red-600 px-3 py-2 rounded cursor-pointer font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        <table className="w-4xl justify-self-center">
          <thead className="uppercase text-xs bg-gray-100 text-gray-700 dark:text-gray-300 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3">S.No</th>
              <th className="px-6 py-3">Username</th>
              <th className="px-6 py-3">Query</th>
              <th className="px-6 py-3">Email-Id</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action-1</th>
              <th className="px-6 py-3">Action-2</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {queries.map((el, i) => (
              <tr
                key={i}
                className={`border-b border-gray-300 text-center cursor-pointer ${
                  el.status == "Unread"
                    ? "text-black font-semibold"
                    : "text-gray-500"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsQueryOpen({ status: true, query: el });
                  el.status == "Unread" && updateStatus(el["_id"]);
                }}
              >
                <td className="px-6 py-3">{i + 1}</td>
                <td className="px-6 py-3">{validateLength(el.username)}</td>
                <td className="px-6 py-3">{validateLength(el.query)}</td>
                <td className="px-6 py-3">{validateLength(el.email)}</td>
                <td className="px-6 py-3">{el.status}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/queryreply/${el["_id"]}`);
                    }}
                    className="text-xs text-white bg-green-500 active:bg-green-600 px-3 py-2 rounded cursor-pointer font-semibold"
                  >
                    Reply
                  </button>
                </td>
                <td className="px-6 py-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(el["_id"]);
                    }}
                    className="text-xs text-white bg-red-500 active:bg-red-600 px-3 py-2 rounded cursor-pointer font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
