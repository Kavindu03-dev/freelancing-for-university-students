import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slideshow from "../components/Slideshow";
import BackgroundSlideshow from "../components/BackgroundSlideshow";

function HomePage() {
  // Search state for hero section
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const searchRef = useRef(null);

  const navigate = useNavigate();

  // Available categories for search suggestions
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
    navigate(`/services?search=${encodeURIComponent(category)}`);
  };

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
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
      <section className="relative text-white min-h-screen flex items-start pt-20 overflow-hidden">
        <BackgroundSlideshow />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              Find the Perfect Freelancer
            </h1>
            <p className="text-2xl md:text-4xl text-gray-300 mb-16 max-w-4xl mx-auto">
              Connect with talented professionals for your projects
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-16" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="What service are you looking for?"
                  className="w-full px-8 py-5 text-xl rounded-full border-2 border-yellow-500 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:border-yellow-400 backdrop-blur-sm"
                />
                <button
                  onClick={handleSearch}
                  aria-label="Search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-full p-4 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-yellow-500 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
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
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/services" className="bg-yellow-500 hover:bg-yellow-400 text-black px-12 py-5 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Hire a Freelancer
              </Link>
              <Link to="/join" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-12 py-5 rounded-full text-xl font-bold transition-all duration-300">
                Join as Freelancer
              </Link>
            </div>
            

          </div>
        </div>
      </section>

      {/* Slideshow Section */}
      <Slideshow />



      {/* How It Works */}
      <section className="bg-gradient-to-br from-gray-100 to-gray-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">How FlexiHire Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Post Your Project</h3>
              <p className="text-gray-600 leading-relaxed">Describe what you need and set your budget. Get matched with qualified freelancers.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Choose Your Freelancer</h3>
              <p className="text-gray-600 leading-relaxed">Review proposals, portfolios, and ratings. Select the perfect match for your project.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Get It Done</h3>
              <p className="text-gray-600 leading-relaxed">Work together, track progress, and pay securely when you're satisfied.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Browse by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[ 
              { 
                name: 'Programming & Tech', 
                image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=200&h=200&fit=crop&crop=center',
                color: 'from-blue-500 to-blue-600' 
              },
              { 
                name: 'Design & Creative', 
                image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=200&fit=crop&crop=center',
                color: 'from-purple-500 to-purple-600' 
              },
              { 
                name: 'Digital Marketing', 
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop&crop=center',
                color: 'from-green-500 to-green-600' 
              },
              { 
                name: 'Writing & Translation', 
                image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&h=200&fit=crop&crop=center',
                color: 'from-yellow-500 to-yellow-600' 
              },
              { 
                name: 'Video & Animation', 
                image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&h=200&fit=crop&crop=center',
                color: 'from-red-500 to-red-600' 
              },
              { 
                name: 'Business', 
                image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=200&h=200&fit=crop&crop=center',
                color: 'from-indigo-500 to-indigo-600' 
              },
              { 
                name: 'Data Analysis', 
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop&crop=center',
                color: 'from-teal-500 to-teal-600' 
              },
              { 
                name: 'Consulting', 
                image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=200&h=200&fit=crop&crop=center',
                color: 'from-pink-500 to-pink-600' 
              },
              { 
                name: 'Mobile Development', 
                image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=200&fit=crop&crop=center',
                color: 'from-blue-400 to-blue-500' 
              },
              { 
                name: 'UI/UX Design', 
                image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=200&fit=crop&crop=center',
                color: 'from-orange-500 to-orange-600' 
              },
              { 
                name: 'Content Creation', 
                image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop&crop=center',
                color: 'from-emerald-500 to-emerald-600' 
              },
              { 
                name: 'Project Management', 
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=center',
                color: 'from-cyan-500 to-cyan-600' 
              },
              { 
                name: 'Web Development', 
                image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=200&h=200&fit=crop&crop=center',
                color: 'from-blue-600 to-blue-700' 
              },
              { 
                name: 'Graphic Design', 
                image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=200&fit=crop&crop=center',
                color: 'from-violet-500 to-violet-600' 
              },
              { 
                name: 'Content Writing', 
                image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&h=200&fit=crop&crop=center',
                color: 'from-amber-500 to-amber-600' 
              },
              { 
                name: 'Voice Over', 
                image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=200&h=200&fit=crop&crop=center',
                color: 'from-rose-500 to-rose-600' 
              },
              { 
                name: 'Translation', 
                image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&h=200&fit=crop&crop=center',
                color: 'from-sky-500 to-sky-600' 
              },
              { 
                name: 'Social Media', 
                image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&h=200&fit=crop&crop=center',
                color: 'from-fuchsia-500 to-fuchsia-600' 
              },
              { 
                name: 'SEO', 
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop&crop=center',
                color: 'from-lime-500 to-lime-600' 
              },
              { 
                name: 'E-commerce', 
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop&crop=center',
                color: 'from-orange-400 to-orange-500' 
              },
              { 
                name: 'WordPress', 
                image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=200&h=200&fit=crop&crop=center',
                color: 'from-blue-500 to-blue-600' 
              },
              { 
                name: 'Photography', 
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&crop=center',
                color: 'from-gray-500 to-gray-600' 
              },
              { 
                name: 'Audio Production', 
                image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=200&h=200&fit=crop&crop=center',
                color: 'from-purple-400 to-purple-500' 
              },
              { 
                name: 'Game Development', 
                image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=200&fit=crop&crop=center',
                color: 'from-green-400 to-green-500' 
              }
            ].map((category, index) => (
              <Link
                key={index}
                to={`/services?tab=gigs&category=${encodeURIComponent(category.name)}`}
                className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 text-center border border-gray-200 hover:border-yellow-400 transform hover:-translate-y-2 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300/50 overflow-hidden"
              >
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="font-bold text-gray-800 text-sm leading-tight group-hover:text-yellow-600 transition-colors duration-300">{category.name}</h3>
                <div className="mt-2 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300 mx-auto"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-12 text-gray-300 max-w-3xl mx-auto">Join thousands of clients and freelancers who trust FlexiHire</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/services" className="bg-yellow-400 hover:bg-yellow-300 text-black px-12 py-5 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              Start Hiring
            </Link>
            <Link to="/join" className="bg-white hover:bg-gray-100 text-black px-12 py-5 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              Become a Freelancer
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
