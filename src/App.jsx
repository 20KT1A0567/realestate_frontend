import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./Pages/Home.jsx";
import Register from "./Pages/Register.jsx";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";
import Buy from "./Pages/Buy.jsx";
import Rent from "./Pages/Rent.jsx";
import Sell from "./Pages/Sell.jsx";
import Contact from "./Pages/Contact.jsx";
import About from "./components/About.jsx";
import Careers from "./components/Careers.jsx";
import Terms from "./components/TnC.jsx";
import PrivacyPolicy from "./components/Policy.jsx";
import FAQ from "./components/FAQ.jsx";
import { Box } from "@mui/material";
import Login from './Pages/Login.jsx';
import Details from './Pages/Details.jsx';
import Wishlist from './Pages/Wishlist.jsx';
import PropertyDetails from "./Pages/PropertyDetails.jsx";
import Payment from "./Pages/Payment.jsx";
import Admin from "./Pages/Admin.jsx";
import SuccessPage from "./Pages/SuccessPage.jsx";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUsername(user.name);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

  };

  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        <Header
          isLoggedIn={isLoggedIn}
          username={username}
          onLogout={handleLogout}
        />

        <Box sx={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/rent" element={<Rent />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/faqs" element={<FAQ />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/viewdetails" element={<Details />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/success" element={<SuccessPage></SuccessPage>} />
            <Route path="/admin" element={<Admin onLogout={handleLogout} />} />

          </Routes>
        </Box>

        <Footer />
      </Box>
    </Router>
  );
}

export default App;
