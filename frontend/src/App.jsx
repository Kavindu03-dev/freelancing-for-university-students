import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import HomePage from "./pages/HomePage";


import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import SkillsPage from "./pages/SkillsPage";
import ResourcesPage from "./pages/ResourcesPage";
import ContactPage from "./pages/ContactPage";

import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import ResourceDetailPage from "./pages/ResourceDetailPage";
import MessagesPage from "./pages/MessagesPage";
import OrdersPage from "./pages/OrdersPage";
import StaffDashboard from "./pages/StaffDashboard";
import FreelancerDashboard from "./pages/StudentDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import Footer from "./components/Footer";

// Wrapper component to conditionally render Header
function AppContent() {
  const location = useLocation();
  
  // Don't show Header and Footer on admin dashboard
  const shouldShowHeader = !location.pathname.includes('/admin/dashboard');
  const shouldShowFooter = !location.pathname.includes('/admin/dashboard');
  
  return (
    <>
      {shouldShowHeader && <Header />}
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/join" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />
        <Route path="/client/dashboard" element={<ClientDashboard />} />


        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/service/:id" element={<ServiceDetailsPage />} />
        <Route path="/resource/:id" element={<ResourceDetailPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
      {shouldShowFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
