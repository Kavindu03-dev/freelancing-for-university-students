import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Slideshow from "../components/Slideshow";

import Footer from "../components/Footer";

function HomePage() {
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const searchRef = useRef(null);

  // Available categories
  const categories = [
    'Programming & Tech',
    'Design & Creative',
    'Digital Marketing',
    'Writing & Translation',
    'Video & Animation',
    'Business',
    'Data Analysis',
    'Consulting',
    'Mobile Development',
    'UI/UX Design',
    'Content Creation',
    'Project Management',
    'Web Development',
    'Graphic Design',
    'Content Writing',
    'Voice Over',
    'Translation',
    'Social Media',
    'SEO',
    'E-commerce',
    'WordPress',
    'Photography',
    'Audio Production',
    'Game Development'
  ];

  // Filter categories based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories([]);
      setShowSuggestions(false);
    } else {
      const filtered = categories.filter(category =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
      setShowSuggestions(filtered.length > 0);
    }
  }, [searchQuery]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSearchQuery(category);
    setShowSuggestions(false);
    // Here you can add navigation logic to search results page
    console.log('Selected category:', category);
  };

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Here you can add navigation logic to search results page
      console.log('Searching for:', searchQuery);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Header is now rendered globally in App.jsx */}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-black via-gray-900 to-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Find the Perfect Freelancer
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Connect with talented professionals for your projects
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-5 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                Hire a Freelancer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Slideshow Section */}
      <Slideshow />

      {/* Search Section */}
      <section className="bg-white py-16 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl shadow-2xl p-8 border border-yellow-300">
                          <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="w-full relative" ref={searchRef}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="What service are you looking for?"
                    className="w-full px-6 py-4 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 text-lg transition-all duration-300"
                  />
                  
                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-yellow-300 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                      {filteredCategories.map((category, index) => (
                        <div
                          key={index}
                          onClick={() => handleCategorySelect(category)}
                          className="px-6 py-3 hover:bg-yellow-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-yellow-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="text-gray-800 font-medium">{category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            
            {/* Popular Categories Quick Access */}
            <div className="mt-6 pt-6 border-t border-yellow-200">
              <p className="text-gray-600 text-sm mb-3">Popular categories:</p>
              <div className="flex flex-wrap gap-2">
                {['Web Development', 'Graphic Design', 'Content Writing', 'Digital Marketing', 'Mobile Development'].map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleCategorySelect(category)}
                    className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium transition-colors duration-200"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Popular Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the most in-demand services from talented freelancers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Web Development */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 hover:border-yellow-400 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Web Development</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Custom websites and web applications</p>
              <p className="text-yellow-600 font-bold text-lg">Starting at $50</p>
            </div>

            {/* Graphic Design */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 hover:border-yellow-400 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Graphic Design</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Logos, branding, and visual content</p>
              <p className="text-yellow-600 font-bold text-lg">Starting at $30</p>
            </div>

            {/* Content Writing */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 hover:border-yellow-400 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Content Writing</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Blog posts, articles, and copywriting</p>
              <p className="text-yellow-600 font-bold text-lg">Starting at $25</p>
            </div>

            {/* Mobile Development */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 hover:border-yellow-400 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Mobile Development</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">iOS and Android apps with modern UI/UX</p>
              <p className="text-yellow-600 font-bold text-lg">Starting at $75</p>
            </div>

            {/* Digital Marketing */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 hover:border-yellow-400 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Digital Marketing</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">SEO, social media, and PPC campaigns</p>
              <p className="text-yellow-600 font-bold text-lg">Starting at $40</p>
            </div>

            {/* Video & Animation */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 hover:border-yellow-400 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Video & Animation</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Promotional videos, animations, and editing</p>
              <p className="text-yellow-600 font-bold text-lg">Starting at $60</p>
            </div>

            {/* Data Analysis */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 hover:border-yellow-400 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Data Analysis</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Business intelligence and data visualization</p>
              <p className="text-yellow-600 font-bold text-lg">Starting at $55</p>
            </div>

            {/* UI/UX Design */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 hover:border-yellow-400 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">UI/UX Design</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">User interface and experience design</p>
              <p className="text-yellow-600 font-bold text-lg">Starting at $45</p>
            </div>

            {/* Translation */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 hover:border-yellow-400 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Translation</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Professional translation and localization</p>
              <p className="text-yellow-600 font-bold text-lg">Starting at $20</p>
            </div>

            {/* Voice Over */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 hover:border-yellow-400 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Voice Over</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Professional voice recording and narration</p>
              <p className="text-yellow-600 font-bold text-lg">Starting at $35</p>
            </div>
          </div>
        </div>
      </section>

      {/* All Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">All Service Categories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive range of freelance services
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'Programming & Tech',
              'Design & Creative',
              'Digital Marketing',
              'Writing & Translation',
              'Video & Animation',
              'Business',
              'Data Analysis',
              'Consulting',
              'Mobile Development',
              'UI/UX Design',
              'Content Creation',
              'Project Management',
              'Web Development',
              'Graphic Design',
              'Content Writing',
              'Voice Over',
              'Translation',
              'Social Media',
              'SEO',
              'E-commerce',
              'WordPress',
              'Photography',
              'Audio Production',
              'Game Development'
            ].map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center cursor-pointer border border-gray-200 hover:border-yellow-400 transform hover:-translate-y-1">
                <h3 className="font-semibold text-gray-800">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-black font-bold text-lg">S</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Sarah Johnson</h4>
                  <p className="text-yellow-600">Business Owner</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">"FlexiHire helped me find an amazing web developer who built my e-commerce site perfectly. Highly recommended!"</p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-black font-bold text-lg">M</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Mike Chen</h4>
                  <p className="text-yellow-600">Student</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">"The freelancing platform helped me find amazing talent for my project. The quality of work was exceptional and delivered on time."</p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-black font-bold text-lg">E</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Emily Rodriguez</h4>
                  <p className="text-yellow-600">Freelancer</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">"As a freelancer, FlexiHire has been my go-to platform. Great clients and secure payments make it the best choice."</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-gray-300 max-w-3xl mx-auto">Join thousands of clients and freelancers who trust FlexiHire</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Start Hiring
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-full font-semibold transition-all duration-300">
              Become a Freelancer
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HomePage;
