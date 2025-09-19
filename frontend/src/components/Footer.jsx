import React from "react";
import { Link } from 'react-router-dom';
import Logo from "../assets/Logo.png";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img 
              src={Logo} 
              alt="Logo" 
              className="h-12 w-auto mb-6"
            />
            <p className="text-gray-400 leading-relaxed">Connecting talented freelancers with amazing opportunities worldwide.</p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">For Clients</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/how-to-hire" className="hover:text-yellow-400 transition-colors duration-200">How to Hire</Link></li>
              <li><Link to="/services?tab=gigs" className="hover:text-yellow-400 transition-colors duration-200">Buying on FlexiHire</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">For Freelancers</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/how-to-find-work" className="hover:text-yellow-400 transition-colors duration-200">How to Find Work</Link></li>
              <li><Link to="/join" className="hover:text-yellow-400 transition-colors duration-200">Create a Profile</Link></li>
              <li><Link to="/services?tab=posts" className="hover:text-yellow-400 transition-colors duration-200">Selling on FlexiHire</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/contact" className="hover:text-yellow-400 transition-colors duration-200">Help & Support</Link></li>
              <li><Link to="/about" className="hover:text-yellow-400 transition-colors duration-200">Trust & Safety</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
