import { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function EditProduct({ id }) {
  const [wait, setWait] = useState(false);
  const [pDetails, setPDetails] = useState({
    pname: "",
    price: "",
    category: "",
    status: "",
  });
  const navigate = useNavigate();
  const params = useParams();

  const getProductData = async (pid) => {
    try {
      const res = await fetch(`${backendUrl}/api/getproduct/${pid}`);
      const data = await res.json();
      if (!data) {
        return toast.error(data.message);
      }
      return setPDetails(data.data);
    } catch (error) {
      return toast.error("Internal server error");
    }
  };

  useEffect(() => {
    console.log(id);
    getProductData(params.id || id);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (wait) return;
    setWait(true);
    try {
      const res = await fetch(`${backendUrl}/api/editproduct/${params.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pDetails),
      });
      const data = await res.json();
      if (!data.ok) {
        setWait(false);
        return toast.error(data.message);
      }
      toast.success(data.message);
      setWait(false);
      return setPDetails({ pname: "", price: "", category: "", status: "" });
    } catch (error) {
      setWait(false);
      return toast.error("Internal server error");
    }
  };

  const handleChange = (e) => {
    setPDetails({ ...pDetails, [e.target.id]: e.target.value });
  };

  return (
    <div className="flex min-h-screen -mb-14">
      <AdminNav />
      <div className="flex-1 p-10">
        <h1 className="text-2xl text-gray-700 font-bold mb-4 cursor-default">
          Edit Product 🛍️
        </h1>
        <button
          onClick={(e) => navigate("/admin/products")}
          className="bg-gray-300 active:bg-gray-400 px-4 py-1 rounded cursor-pointer mb-4"
        >
          Back
        </button>
        <div className="shadow-lg px-4 py-6 rounded max-w-3xl mx-auto">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="pname">Product Name</label>
              <input
                id="pname"
                type="text"
                value={pDetails.pname}
                onChange={handleChange}
                className="block w-full shadow-inner shadow-gray-200 mt-2 py-1.5 px-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-gray-50"
              />
            </div>
            <div>
              <label htmlFor="price">Price ₹</label>
              <input
                id="price"
                type="number"
                value={pDetails.price}
                onChange={handleChange}
                min="0"
                className="block w-full shadow-inner shadow-gray-200 mt-2 py-1.5 px-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-gray-50"
              />
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={pDetails.category}
                onChange={handleChange}
                className="block w-full shadow-inner shadow-gray-200 mt-2 py-1.5 px-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-gray-50"
              >
                <option value="" hidden>
                  --Select--
                </option>
                <option value="Cafe">Cafe</option>
                <option value="Electronics">Electronics</option>
                <option value="Toys">Toys</option>
                <option value="Mobile">Mobile</option>
                <option value="Fresh">Fresh</option>
                <option value="Home">Home</option>
                <option value="Beauty">Beauty</option>
              </select>
            </div>
            <div>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={pDetails.status}
                onChange={handleChange}
                className="block w-full shadow-inner shadow-gray-200 mt-2 py-1.5 px-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-gray-50"
              >
                <option hidden>--Select--</option>
                <option value="In Stock">In Stock</option>
                <option value="Out Of Stock">Out Of Stock</option>
              </select>
            </div>
            <label htmlFor="pimage">Product Image</label>
            <div className="w-full shadow-inner shadow-gray-200 mt-2 py-1.5 px-2 rounded border border-gray-300">
              <input
                type="file"
                id="pimage"
                accept="image/*"
                className="file:cursor-pointer file:border file:border-gray-400 file:bg-gray-200 file:px-1 file:mr-2 active:file:bg-gray-300"
              />
            </div>
            {wait ? (
              <button className="bg-red-500 rounded py-1.5 px-5 cursor-not-allowed text-gray-300 opacity-50">
                Save Changes
              </button>
            ) : (
              <button className="px-5 py-1.5 bg-red-600 rounded text-white cursor-pointer active:bg-red-700">
                Save Changes
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
