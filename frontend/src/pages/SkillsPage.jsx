import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SkillsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSkills, setFilteredSkills] = useState([]);

  // Skills data organized by categories
  const skillsData = {
    'Programming & Tech': [
      {
        name: 'JavaScript',
        description: 'Dynamic web programming language',
        freelancers: 1250,
        avgPrice: 45,
        popularity: 95,
        icon: '⚡'
      },
      {
        name: 'Python',
        description: 'Versatile programming for web, data science, AI',
        freelancers: 980,
        avgPrice: 50,
        popularity: 92,
        icon: '🐍'
      },
      {
        name: 'React',
        description: 'Modern frontend JavaScript library',
        freelancers: 850,
        avgPrice: 55,
        popularity: 88,
        icon: '⚛️'
      },
      {
        name: 'Node.js',
        description: 'Server-side JavaScript runtime',
        freelancers: 720,
        avgPrice: 52,
        popularity: 85,
        icon: '🟢'
      },
      {
        name: 'PHP',
        description: 'Server-side web development',
        freelancers: 1100,
        avgPrice: 40,
        popularity: 78,
        icon: '🐘'
      },
      {
        name: 'Java',
        description: 'Enterprise and mobile development',
        freelancers: 890,
        avgPrice: 60,
        popularity: 82,
        icon: '☕'
      }
    ],
    'Design & Creative': [
      {
        name: 'Adobe Photoshop',
        description: 'Professional image editing and design',
        freelancers: 2100,
        avgPrice: 35,
        popularity: 96,
        icon: '🎨'
      },
      {
        name: 'Adobe Illustrator',
        description: 'Vector graphics and logo design',
        freelancers: 1650,
        avgPrice: 40,
        popularity: 89,
        icon: '✏️'
      },
      {
        name: 'Figma',
        description: 'UI/UX design and prototyping',
        freelancers: 1200,
        avgPrice: 45,
        popularity: 91,
        icon: '🎯'
      },
      {
        name: 'Adobe After Effects',
        description: 'Motion graphics and animation',
        freelancers: 780,
        avgPrice: 65,
        popularity: 75,
        icon: '🎬'
      },
      {
        name: 'Sketch',
        description: 'Digital design toolkit',
        freelancers: 650,
        avgPrice: 50,
        popularity: 70,
        icon: '💎'
      }
    ],
    'Digital Marketing': [
      {
        name: 'Google Ads',
        description: 'Pay-per-click advertising campaigns',
        freelancers: 950,
        avgPrice: 55,
        popularity: 87,
        icon: '📊'
      },
      {
        name: 'Facebook Marketing',
        description: 'Social media advertising and management',
        freelancers: 1300,
        avgPrice: 40,
        popularity: 84,
        icon: '📱'
      },
      {
        name: 'SEO',
        description: 'Search engine optimization',
        freelancers: 1100,
        avgPrice: 45,
        popularity: 90,
        icon: '🔍'
      },
      {
        name: 'Content Marketing',
        description: 'Strategic content creation and promotion',
        freelancers: 820,
        avgPrice: 42,
        popularity: 81,
        icon: '📝'
      },
      {
        name: 'Email Marketing',
        description: 'Email campaign design and automation',
        freelancers: 690,
        avgPrice: 38,
        popularity: 76,
        icon: '📧'
      }
    ],
    'Writing & Translation': [
      {
        name: 'Content Writing',
        description: 'Blog posts, articles, and web content',
        freelancers: 1800,
        avgPrice: 25,
        popularity: 93,
        icon: '✍️'
      },
      {
        name: 'Copywriting',
        description: 'Marketing and sales copy',
        freelancers: 1200,
        avgPrice: 35,
        popularity: 86,
        icon: '💬'
      },
      {
        name: 'Technical Writing',
        description: 'Documentation and technical content',
        freelancers: 550,
        avgPrice: 48,
        popularity: 72,
        icon: '📋'
      },
      {
        name: 'Translation',
        description: 'Multi-language translation services',
        freelancers: 920,
        avgPrice: 30,
        popularity: 79,
        icon: '🌍'
      },
      {
        name: 'Proofreading',
        description: 'Grammar and style correction',
        freelancers: 680,
        avgPrice: 22,
        popularity: 74,
        icon: '🔍'
      }
    ],
    'Video & Animation': [
      {
        name: 'Video Editing',
        description: 'Professional video post-production',
        freelancers: 1100,
        avgPrice: 50,
        popularity: 88,
        icon: '🎞️'
      },
      {
        name: '2D Animation',
        description: 'Animated graphics and explainer videos',
        freelancers: 650,
        avgPrice: 65,
        popularity: 77,
        icon: '🎭'
      },
      {
        name: '3D Animation',
        description: 'Three-dimensional animation and modeling',
        freelancers: 420,
        avgPrice: 85,
        popularity: 68,
        icon: '🎲'
      },
      {
        name: 'Motion Graphics',
        description: 'Animated design elements',
        freelancers: 580,
        avgPrice: 70,
        popularity: 74,
        icon: '⚡'
      }
    ],
    'Music & Audio': [
      {
        name: 'Voice Over',
        description: 'Professional voice recording',
        freelancers: 890,
        avgPrice: 45,
        popularity: 82,
        icon: '🎤'
      },
      {
        name: 'Audio Editing',
        description: 'Sound mixing and mastering',
        freelancers: 520,
        avgPrice: 40,
        popularity: 71,
        icon: '🎧'
      },
      {
        name: 'Music Production',
        description: 'Original music composition',
        freelancers: 380,
        avgPrice: 75,
        popularity: 65,
        icon: '🎵'
      },
      {
        name: 'Podcast Production',
        description: 'Podcast editing and production',
        freelancers: 290,
        avgPrice: 55,
        popularity: 69,
        icon: '🎙️'
      }
    ]
  };

  const categories = ['All', ...Object.keys(skillsData)];

  // Flatten all skills for filtering
  const allSkills = Object.entries(skillsData).reduce((acc, [category, skills]) => {
    return [...acc, ...skills.map(skill => ({ ...skill, category }))];
  }, []);

  useEffect(() => {
    let filtered = allSkills;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(skill => skill.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(skill =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by popularity
    filtered.sort((a, b) => b.popularity - a.popularity);
    setFilteredSkills(filtered);
  }, [selectedCategory, searchQuery]);

  const getPopularityColor = (popularity) => {
    if (popularity >= 90) return 'text-green-500';
    if (popularity >= 80) return 'text-yellow-500';
    if (popularity >= 70) return 'text-orange-500';
    return 'text-red-500';
  };

  const getPopularityBg = (popularity) => {
    if (popularity >= 90) return 'bg-green-500';
    if (popularity >= 80) return 'bg-yellow-500';
    if (popularity >= 70) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Explore Skills & Expertise
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover talented freelancers with the exact skills you need for your project
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 text-lg rounded-full border-2 border-yellow-500 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:border-yellow-400 backdrop-blur-sm"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-yellow-500 text-black shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {selectedCategory === 'All' ? 'All Skills' : selectedCategory}
            </h2>
            <p className="text-gray-600">
              {filteredSkills.length} skills found
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSkills.map((skill, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{skill.icon}</div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPopularityColor(skill.popularity)}`}>
                      {skill.popularity}% Popular
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{skill.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{skill.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Available Freelancers:</span>
                      <span className="font-semibold text-gray-800">{skill.freelancers.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Avg. Price/Hour:</span>
                      <span className="font-semibold text-green-600">${skill.avgPrice}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Popularity:</span>
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                          <div 
                            className={`h-2 rounded-full ${getPopularityBg(skill.popularity)}`}
                            style={{ width: `${skill.popularity}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{skill.popularity}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <Link
                      to={`/services?skill=${encodeURIComponent(skill.name)}`}
                      className="w-full bg-yellow-500 text-black py-2 px-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300 text-center block"
                    >
                      Find Freelancers
                    </Link>
                    <Link
                      to={`/skills/${encodeURIComponent(skill.name)}`}
                      className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300 text-center block"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSkills.length === 0 && (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No skills found</h3>
              <p className="text-gray-400">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Most In-Demand Skills</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(skillsData).slice(0, 6).map(([category, skills], index) => {
              const topSkill = skills.reduce((prev, current) => 
                (prev.popularity > current.popularity) ? prev : current
              );
              
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-3">{topSkill.icon}</div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{category}</h3>
                      <p className="text-sm text-gray-500">Most popular: {topSkill.name}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {skills.slice(0, 3).map((skill, skillIndex) => (
                      <div key={skillIndex} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{skill.name}</span>
                        <span className="text-yellow-600 font-medium">${skill.avgPrice}/hr</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link
                    to={`/services?category=${encodeURIComponent(category)}`}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300 text-center block"
                  >
                    Explore {category}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Hire Top Talent?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Connect with skilled freelancers who can bring your projects to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services"
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Browse Services
            </Link>
            <Link
              to="/join"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-full font-semibold transition-all duration-300"
            >
              Join as Freelancer
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default SkillsPage;
