import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import About from "./pages/About";
import LoginPage from "./pages/LoginPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersDisplayPage from "./pages/OrdersDisplayPage";
import AdminDashboard from "./pages/AdminDashboard";
import Locations from "./pages/Locations";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Display screen - no navbar */}
              <Route path="/orders-display" element={<OrdersDisplayPage />} />
              {/* All other pages with navbar */}
              <Route
                path="*"
                element={
                  <>
                    <Navbar />
                    <CartDrawer />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/menu" element={<MenuPage />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/locations" element={<Locations />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </>
                }
              />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
