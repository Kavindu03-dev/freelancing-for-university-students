import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import HomePage from "./pages/HomePage";
import StudentManagementSystem from "./pages/StudentManagementSystem";
import ClientDashboard from "./pages/ClientDashboard";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import SkillsPage from "./pages/SkillsPage";
import ResourcesPage from "./pages/ResourcesPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import MessagesPage from "./pages/MessagesPage";
import OrdersPage from "./pages/OrdersPage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/join" element={<Signup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/student/dashboard" element={<StudentManagementSystem />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/service/:id" element={<ServiceDetailsPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
