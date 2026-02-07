import "./App.css"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import ScrollToTop from "./ScrollToTop"
import Navbar from "./components/Navbar"
import Services from "./pages/Services"
import About from "./pages/About"
import WhyUs from "./pages/WhyUs"
import Blog from "./pages/Blog"
import ContactUs from "./pages/ContactUs"
import Home from "./pages/Home"
import Footer from "./components/Footer"
import Terms from "./pages/Terms"
import Privacy from "./pages/Privacy"
import DiscountPopup from "./components/DiscountPopup"
import RecentSearches from "./components/RecentSearches"
import UIProvider from "./store/UIContext"
import ListingsPage from "./pages/ListingsPage"
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import ListingDetailsDynamic from "./pages/ListingDetailsDynamic"
import AdminRoutes from "./routes/AdminRoutes"
import { AdminAuthProvider } from "./store/AdminAuthContext"


function ConditionalAdminUI({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      {!isAdmin && <DiscountPopup />}

      {children}

      {!isAdmin && <FloatingWhatsApp />}
      {!isAdmin && <RecentSearches />}
      {!isAdmin && <Footer />}
    </>
  );
}


function App() {
  return (
    <>
      <BrowserRouter>
          <AdminAuthProvider>
        <UIProvider>
          <ScrollToTop />
          <ConditionalAdminUI>
          <Routes>
            <Route path="/admin/*" element={<AdminRoutes />} />

            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/why-us" element={<WhyUs />} />
            <Route path="/blogs/category/:categorySlug" element={<Blog />} />
            <Route path="/blogs/:slug" element={<Blog />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            
<Route path="/venues/:categorySlug" element={<ListingsPage />} />
<Route path="/:serviceSlug-in/:placeSlug" element={<ListingsPage />} />
<Route path="/:serviceSlug-in/:localitySlug/:id" element={<ListingDetailsDynamic />} />
          </Routes>
          </ConditionalAdminUI>
        </UIProvider>
        </AdminAuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App