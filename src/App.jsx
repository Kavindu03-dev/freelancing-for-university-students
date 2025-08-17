import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import SignIn from "./SignIn";
import Join from "./Join";
import AdminDashboard from "./AdminDashboard";

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-green-300 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">FlexiHire</h1>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Home</a>
                <a href="#" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Services</a>
                <a href="#" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Academic Help</a>
                <a href="#" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">How it Works</a>
                <a href="#" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">About</a>
              </div>
            </div>
            
                         <div className="flex items-center space-x-4">
               <Link to="/signin" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Sign In</Link>
               <Link to="/join" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                 Join Now
               </Link>
             </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 text-white overflow-hidden">
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
              Find the Perfect Freelancer or
              <span className="block text-green-200 mt-2">Get Academic Help</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-green-100 max-w-4xl mx-auto leading-relaxed">
              Connect with talented professionals for your projects or get expert help with your academic assignments
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-white hover:bg-green-50 text-green-700 px-10 py-5 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                Hire a Freelancer
              </button>
              <button className="bg-green-400 hover:bg-green-300 text-green-900 px-10 py-5 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                Get Academic Help
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-2xl p-8 border border-green-200">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="flex-1 w-full lg:w-auto">
                <input
                  type="text"
                  placeholder="What service are you looking for?"
                  className="w-full px-6 py-4 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 text-lg transition-all duration-300"
                />
              </div>
              <div className="flex gap-4">
                <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                  Hire a Freelancer
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                  Get Academic Help
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Popular Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Web Development */}
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-green-100 hover:border-green-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Web Development</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Custom websites, e-commerce, and web applications</p>
              <p className="text-green-600 font-bold text-lg">Starting at $50</p>
            </div>

            {/* Graphic Design */}
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-green-100 hover:border-green-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Graphic Design</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Logos, branding, and visual content</p>
              <p className="text-green-600 font-bold text-lg">Starting at $30</p>
            </div>

            {/* Content Writing */}
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-green-100 hover:border-green-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Content Writing</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Blog posts, articles, and copywriting</p>
              <p className="text-green-600 font-bold text-lg">Starting at $25</p>
            </div>

            {/* Academic Help */}
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-green-100 hover:border-green-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Academic Help</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Essays, research papers, and assignments</p>
              <p className="text-green-600 font-bold text-lg">Starting at $40</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-green-100 to-emerald-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">How FlexiHire Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Post Your Project</h3>
              <p className="text-gray-600 leading-relaxed">Describe what you need and set your budget. Get matched with qualified freelancers.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Choose Your Freelancer</h3>
              <p className="text-gray-600 leading-relaxed">Review proposals, portfolios, and ratings. Select the perfect match for your project.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Get It Done</h3>
              <p className="text-gray-600 leading-relaxed">Work together, track progress, and pay securely when you're satisfied.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Browse by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              'Programming & Tech',
              'Design & Creative',
              'Digital Marketing',
              'Writing & Translation',
              'Video & Animation',
              'Business',
              'Academic Writing',
              'Research Papers',
              'Essay Writing',
              'Homework Help',
              'Data Analysis',
              'Consulting'
            ].map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center cursor-pointer border border-green-100 hover:border-green-300 transform hover:-translate-y-1">
                <h3 className="font-semibold text-gray-800">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-900 font-bold text-lg">S</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Sarah Johnson</h4>
                  <p className="text-green-200">Business Owner</p>
                </div>
              </div>
              <p className="text-green-100 leading-relaxed">"FlexiHire helped me find an amazing web developer who built my e-commerce site perfectly. Highly recommended!"</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-900 font-bold text-lg">M</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Mike Chen</h4>
                  <p className="text-green-200">Student</p>
                </div>
              </div>
              <p className="text-green-100 leading-relaxed">"The academic help service saved me during finals week. The quality of work was exceptional and delivered on time."</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-900 font-bold text-lg">E</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Emily Rodriguez</h4>
                  <p className="text-green-200">Freelancer</p>
                </div>
              </div>
              <p className="text-green-100 leading-relaxed">"As a freelancer, FlexiHire has been my go-to platform. Great clients and secure payments make it the best choice."</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 text-white py-20">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-12 text-green-100 max-w-3xl mx-auto">Join thousands of clients and freelancers who trust FlexiHire</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-white hover:bg-green-50 text-green-700 px-12 py-5 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              Start Hiring
            </button>
            <button className="bg-green-400 hover:bg-green-300 text-green-900 px-12 py-5 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              Become a Freelancer
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6">FlexiHire</h3>
              <p className="text-gray-400 leading-relaxed">Connecting talented freelancers with amazing opportunities worldwide.</p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">For Clients</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-green-300 transition-colors duration-200">How to Hire</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors duration-200">Talent Marketplace</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors duration-200">Project Catalog</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors duration-200">Hiring Guide</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">For Freelancers</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-green-300 transition-colors duration-200">How to Find Work</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors duration-200">Create a Profile</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors duration-200">Academic Services</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors duration-200">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-green-300 transition-colors duration-200">Help & Support</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors duration-200">Trust & Safety</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors duration-200">Selling on FlexiHire</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors duration-200">Buying on FlexiHire</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FlexiHire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/join" element={<Join />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
