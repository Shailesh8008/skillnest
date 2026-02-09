import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { MdProductionQuantityLimits } from "react-icons/md";
import { LuMessageSquareWarning } from "react-icons/lu";
import { ImExit } from "react-icons/im";

export default function AdminNav() {
  return (
    <div className="bg-gray-800 text-white space-y-5 max-w-60 p-6">
      <h1 className="text-lg font-bold cursor-default">ADMIN PANEL</h1>
      <nav className="space-y-3">
        <Link to={"/admin/dashboard"} className="block hover:text-green-500">
          <MdDashboard className="inline mr-1" /> Dashboard
        </Link>
        <Link to={"/admin/products"} className="block hover:text-green-500">
          <MdProductionQuantityLimits className="inline mr-1" /> Manage Products
        </Link>
        <Link to={"/admin/query"} className="block hover:text-green-500">
          <LuMessageSquareWarning className="inline mr-1" /> Manage Queries
        </Link>
        <Link to={"/"} className="block hover:text-red-500">
          <ImExit className="inline mr-1" /> Exit Store
        </Link>
      </nav>
    </div>
  );
}
