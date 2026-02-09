import { useNavigate } from "react-router-dom";
import AdminNav from "./AdminNav";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function AdminProduct() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const getProducts = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/getproducts`);
      const data = await res.json();
      if (!data.ok) {
        toast.error(data.message);
        return setProducts([]);
      }
      return setProducts(data.data);
    } catch (error) {
      console.log("Internal server error");
    }
  };
  useEffect(() => {
    getProducts();
  }, []);

  const handleDelete = async (pid, pname) => {
    try {
      const res = await fetch(`${backendUrl}/api/deleteproduct/${pid}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!data.ok) {
        return toast.error("Cannot delete this product!");
      }
      toast.success(`${pname} Deleted Successfully`);
      return setProducts(data.data);
    } catch (error) {
      console.log("Internal server error");
    }
  };

  return (
    <div className="flex min-h-screen -mb-14">
      <AdminNav />
      <div className="flex-1 p-10">
        <h1 className="text-2xl text-gray-700 font-bold mb-4">
          Manage Products 🛒
        </h1>
        <button
          onClick={(e) => navigate("/admin/addproducts")}
          className="bg-green-600 text-white px-2 py-1 rounded cursor-pointer active:bg-green-700"
        >
          Add Products
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-5">
          {products.length != 0 ? (
            products.map((e) => {
              return (
                <div
                  key={e["_id"]}
                  className="shadow rounded-xl hover:shadow-lg border border-gray-100 p-4"
                >
                  <img
                    src={e.pimage}
                    alt={e.pimage}
                    className="w-full h-50 object-contain justify-self-center rounded-md border border-gray-300"
                  />
                  <div className="p-2 space-y-1">
                    <p className="text-xl font-semibold text-gray-700">
                      {e.pname}
                    </p>
                    <p className="font-semibold text-sm text-gray-600">
                      Category: {e.category}
                    </p>
                    <p className="font-bold text-green-600">₹ {e.price}</p>
                    <p
                      className={`font-semibold ${
                        e.status === "In Stock"
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      {e.status}
                    </p>
                  </div>
                  <div className="flex justify-between text-lg">
                    <FaEdit
                      className="text-blue-700 cursor-pointer"
                      onClick={() => navigate(`/admin/editproduct/${e["_id"]}`)}
                    />
                    <RiDeleteBin5Line
                      onClick={() => handleDelete(e["_id"], e["pname"])}
                      className="text-red-600 cursor-pointer"
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <h2 className="text-red-600">No Products Found !</h2>
          )}
        </div>
      </div>
    </div>
  );
}
