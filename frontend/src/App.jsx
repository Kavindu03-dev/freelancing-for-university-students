import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import HomePage from "./pages/HomePage";
import StudentManagementSystem from "./pages/StudentManagementSystem";
import ClientDashboard from "./pages/ClientDashboard";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/join" element={<Signup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
                        <Route path="/student/dashboard" element={<StudentManagementSystem />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
