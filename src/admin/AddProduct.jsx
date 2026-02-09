import { useState } from "react";
import AdminNav from "./AdminNav";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function AddProduct() {
  const [wait, setWait] = useState(false);
  const [productDetails, setProductDetails] = useState({
    pname: "",
    price: "",
    category: "",
  });
  const [pImage, setPImage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (wait) return;
    setWait(true);
    const formData = new FormData();
    formData.append("pname", productDetails.pname);
    formData.append("price", productDetails.price);
    formData.append("category", productDetails.category);
    formData.append("pimage", pImage);

    try {
      const res = await fetch(`${backendUrl}/api/addproduct`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!data.ok) {
        setWait(false);
        return toast.error(data.message || "Some error occurred");
      }
      toast.success(data.message || "Product Added Successfully");
      setProductDetails({
        pname: "",
        price: "",
        category: "",
      });
    } catch (error) {
      console.log("some error occured");
    }
    setWait(false);
  };

  const handleChange = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="flex min-h-screen -mb-14">
      <AdminNav />
      <div className="flex-1 p-10">
        <h1 className="text-2xl text-gray-700 font-bold mb-4">
          Add Products 🛍️
        </h1>
        <button
          onClick={(e) => navigate("/admin/products")}
          className="bg-gray-300 active:bg-gray-400 px-4 py-1 rounded cursor-pointer mb-4"
        >
          Back
        </button>
        <div className="shadow-lg px-4 py-6 rounded max-w-3xl mx-auto">
          <form
            className="space-y-6"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
            <div>
              <label htmlFor="pname">Product Name</label>
              <input
                id="pname"
                type="text"
                value={productDetails.pname}
                onChange={handleChange}
                className="block w-full shadow-inner shadow-gray-200 mt-2 py-1.5 px-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-gray-50"
              />
            </div>
            <div>
              <label htmlFor="price">Price ₹</label>
              <input
                id="price"
                type="number"
                value={productDetails.price}
                onChange={handleChange}
                min="0"
                className="block w-full shadow-inner shadow-gray-200 mt-2 py-1.5 px-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-gray-50"
              />
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={productDetails.category}
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
            <label htmlFor="pimage">Product Image</label>
            <div className="w-full shadow-inner shadow-gray-200 mt-2 py-1.5 px-2 rounded border border-gray-300">
              <input
                type="file"
                id="pimage"
                name="pimage"
                onChange={(e) => setPImage(e.target.files[0])}
                accept="image/*"
                className="file:cursor-pointer file:border file:border-gray-400 file:bg-gray-200 file:px-1 file:mr-2 active:file:bg-gray-300"
              />
            </div>
            {wait ? (
              <button className="bg-red-500 rounded py-1.5 px-5 cursor-not-allowed text-gray-300 opacity-50">
                Add Product
              </button>
            ) : (
              <button className="px-5 py-1.5 bg-red-600 rounded text-white cursor-pointer active:bg-red-800">
                Add Product
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
