import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import HomePage from "./pages/HomePage";


import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import HowToHire from "./pages/HowToHire";
import HowToFindWork from "./pages/HowToFindWork";

import ResourcesPage from "./pages/ResourcesPage";
import ContactPage from "./pages/ContactPage";

import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import ResourceDetailPage from "./pages/ResourceDetailPage";
import MessagesPage from "./pages/MessagesPage";
import OrdersPage from "./pages/OrdersPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderCancelPage from "./pages/OrderCancelPage";
import StaffDashboard from "./pages/StaffDashboard";
import FreelancerDashboard from "./pages/StudentDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import ClientApplicationsPage from "./pages/ClientApplicationsPage";
import Footer from "./components/Footer";
import ChatbotWidget from "./components/ChatbotWidget";

// Wrapper component to conditionally render Header
function AppContent() {
  const location = useLocation();
  
  // Don't show Header and Footer on admin dashboard
  const isAdminDash = location.pathname.includes('/admin/dashboard');
  const shouldShowHeader = !isAdminDash;
  const shouldShowFooter = !isAdminDash;

  // Show chatbot only on public/home pages (exclude dashboards, messages, orders, auth)
  const hideChatbotOn = [
    '/admin', '/staff', '/freelancer', '/client',
    '/messages', '/orders', '/signin', '/join'
  ];
  const shouldShowChatbot = !hideChatbotOn.some(p => location.pathname.startsWith(p));
  
  return (
    <>
      <ScrollToTop />
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
  <Route path="/how-to-hire" element={<HowToHire />} />
  <Route path="/how-to-find-work" element={<HowToFindWork />} />

        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/success" element={<OrderSuccessPage />} />
        <Route path="/orders/cancel" element={<OrderCancelPage />} />
        <Route path="/my-applications" element={<MyApplicationsPage />} />
        <Route path="/client/applications" element={<ClientApplicationsPage />} />
        <Route path="/service/:id" element={<ServiceDetailsPage />} />
        <Route path="/resource/:id" element={<ResourceDetailPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
      {shouldShowFooter && <Footer />}
      {shouldShowChatbot && <ChatbotWidget />}
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
