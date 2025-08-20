import React from 'react';
import { Link } from 'react-router-dom';

function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              About FlexiHire
            </h1>
            <p className="text-xl md:text-2xl text-yellow-100 mb-8 max-w-3xl mx-auto">
              Connecting talented freelancers with innovative projects worldwide
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/signup"
                className="bg-white text-yellow-600 px-8 py-3 rounded-full font-semibold hover:bg-yellow-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Join Now
              </Link>
              <Link
                to="/"
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-yellow-600 transition-all duration-300"
              >
                Explore Platform
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                At FlexiHire, we believe that talent knows no boundaries. Our mission is to create a global marketplace where skilled freelancers can connect with clients who need their expertise, fostering innovation and economic growth worldwide.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                We're committed to building a platform that empowers individuals to work on their own terms, while helping businesses access the best talent from around the world.
              </p>
              <div className="flex items-center space-x-4 pt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-gray-300">Global Talent Pool</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-gray-300">Secure Payments</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-gray-300">24/7 Support</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">10K+</div>
                    <div className="text-yellow-100">Active Freelancers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">5K+</div>
                    <div className="text-yellow-100">Happy Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">50K+</div>
                    <div className="text-yellow-100">Projects Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">98%</div>
                    <div className="text-yellow-100">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Photo Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The passionate individuals behind FlexiHire's success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                  alt="CEO" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Alex Johnson</h3>
                <p className="text-yellow-400 mb-3">CEO & Founder</p>
                <p className="text-gray-300 text-sm">
                  Visionary leader with 10+ years in tech entrepreneurship, passionate about connecting global talent.
                </p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                  alt="CTO" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Sarah Chen</h3>
                <p className="text-yellow-400 mb-3">CTO</p>
                <p className="text-gray-300 text-sm">
                  Tech innovator with expertise in AI and machine learning, building the future of work platforms.
                </p>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                  alt="Head of Operations" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Michael Rodriguez</h3>
                <p className="text-yellow-400 mb-3">Head of Operations</p>
                <p className="text-gray-300 text-sm">
                  Operations expert ensuring seamless experiences for freelancers and clients worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose FlexiHire?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the features that make us the preferred choice for freelancers and clients alike
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Global Talent Network</h3>
              <p className="text-gray-300">
                Access a diverse pool of skilled professionals from around the world, ensuring you find the perfect match for your project needs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Secure & Reliable</h3>
              <p className="text-gray-300">
                Built with enterprise-grade security, ensuring your data and payments are protected with the highest standards of encryption.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Fast & Efficient</h3>
              <p className="text-gray-300">
                Streamlined processes and smart matching algorithms help you find the right talent or project quickly and efficiently.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Flexible Work Options</h3>
              <p className="text-gray-300">
                Choose from full-time, part-time, or project-based work arrangements that suit your lifestyle and career goals.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Quality Assurance</h3>
              <p className="text-gray-300">
                Rigorous vetting process ensures only qualified professionals join our platform, maintaining high standards of work quality.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">24/7 Support</h3>
              <p className="text-gray-300">
                Our dedicated support team is available round the clock to help you with any questions or concerns you may have.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Story
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              FlexiHire was born from a simple idea: to make quality work accessible to everyone, everywhere.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-yellow-500">
                <h3 className="text-xl font-semibold text-white mb-3">The Beginning</h3>
                <p className="text-gray-300">
                  Founded in 2024, FlexiHire started as a small team passionate about connecting talented individuals with meaningful opportunities. We recognized the growing demand for flexible work arrangements and the abundance of untapped talent worldwide.
                </p>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-yellow-500">
                <h3 className="text-xl font-semibold text-white mb-3">Our Growth</h3>
                <p className="text-gray-300">
                  Today, we've grown into a global platform serving thousands of freelancers and clients across multiple industries. Our commitment to quality, security, and user experience has made us a trusted name in the freelancing world.
                </p>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-yellow-500">
                <h3 className="text-xl font-semibold text-white mb-3">Our Vision</h3>
                <p className="text-gray-300">
                  We envision a world where talent knows no boundaries, where anyone with skills and determination can find meaningful work, and where businesses can access the best talent regardless of geographical constraints.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Our Values</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    <span>Innovation in every aspect</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    <span>Trust and transparency</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    <span>Quality over quantity</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    <span>Community-driven growth</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    <span>Continuous improvement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Culture Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Workspace
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Where innovation meets collaboration - our modern office environment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Office Photo 1 */}
            <div className="relative group overflow-hidden rounded-xl">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80" 
                alt="Modern Office Space" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="font-semibold">Collaborative Spaces</h3>
                <p className="text-sm text-gray-200">Where ideas come to life</p>
              </div>
            </div>

            {/* Office Photo 2 */}
            <div className="relative group overflow-hidden rounded-xl">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Team Meeting" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="font-semibold">Team Collaboration</h3>
                <p className="text-sm text-gray-200">Building the future together</p>
              </div>
            </div>

            {/* Office Photo 3 */}
            <div className="relative group overflow-hidden rounded-xl">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Creative Workspace" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="font-semibold">Innovation Hub</h3>
                <p className="text-sm text-gray-200">Where creativity thrives</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto">
            Join thousands of freelancers and clients who are already experiencing the benefits of our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/signup"
              className="bg-white text-yellow-600 px-8 py-4 rounded-full font-semibold hover:bg-yellow-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Freelancing
            </Link>
            <Link
              to="/signup"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-yellow-600 transition-all duration-300"
            >
              Hire Talent
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-yellow-400 mb-4">FlexiHire</h3>
              <p className="text-gray-400">
                Connecting talent with opportunity worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-yellow-400 transition-colors">About</Link></li>
                <li><Link to="/signup" className="hover:text-yellow-400 transition-colors">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-yellow-400 transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FlexiHire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AboutPage;
