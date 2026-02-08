import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";


function App() {
  return (
    <Router>
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

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
