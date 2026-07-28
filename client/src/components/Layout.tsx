import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthProvider";

const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      {isAuthenticated && <Navbar />}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
