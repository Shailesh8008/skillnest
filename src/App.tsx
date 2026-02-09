import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Courses from "./pages/Courses";
import MyCourses from "./pages/MyCourses";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ScrollToTop from "./components/ScrollToTop";
import AdminRoute from "./admin/AdminRoute";
import AdminDash from "./admin/AdminDash";
import AdminCourse from "./admin/AdminCourse";
import AdminQuery from "./admin/AdminQuery";
import AddCourse from "./admin/AddCourse";
import EditCourse from "./admin/EditCourse";
import QueryReply from "./admin/QueryReply";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-indigo-100 selection:text-indigo-700">
        <Toaster
          toastOptions={{
            style: {
              background: "#1f2937",
              color: "#fff",
              borderRadius: "8px",
              padding: "16px",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDash />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <AdminRoute>
                  <AdminCourse />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/query"
              element={
                <AdminRoute>
                  <AdminQuery />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/addcourses"
              element={
                <AdminRoute>
                  <AddCourse />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/editcourse/:id"
              element={
                <AdminRoute>
                  <EditCourse />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/queryreply/:id"
              element={
                <AdminRoute>
                  <QueryReply />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
