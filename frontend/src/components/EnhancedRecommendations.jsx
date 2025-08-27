import React, { useState, useEffect } from 'react';

const EnhancedRecommendations = ({ 
  availableOpportunities, 
  studentData, 
  profileCompleteness, 
  onApply, 
  onBookmark,
  loading = false,
  error = null,
  onRetry = null
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    minScore: 0,
    maxScore: 100,
    workType: 'All',
    location: 'All',
    budget: 'All'
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [showSkillGap, setShowSkillGap] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  useEffect(() => {
    if (availableOpportunities && studentData) {
      const recs = generateEnhancedRecommendations();
      setRecommendations(recs);
      setFilteredRecommendations(recs);
    }
  }, [availableOpportunities, studentData, profileCompleteness]);

  useEffect(() => {
    applyFilters();
  }, [selectedFilters, recommendations, sortBy]);

  const generateEnhancedRecommendations = () => {
    if (!availableOpportunities || !Array.isArray(availableOpportunities)) return [];
    
    const studentSkills = studentData?.technicalSkills ? 
      (typeof studentData.technicalSkills === 'string' ? 
        studentData.technicalSkills.split(',').map(skill => skill.trim().toLowerCase()) : 
        studentData.technicalSkills.map(skill => skill.toLowerCase())
      ) : [];
    
    const studentDegree = studentData?.degreeProgram?.toLowerCase() || '';
    const studentLocation = studentData?.locationPreference?.toLowerCase() || '';
    const studentWorkType = studentData?.preferredWorkType?.toLowerCase() || '';
    const studentBudget = studentData?.hourlyRate || 0;

    return availableOpportunities.map(opportunity => {
      let score = 0;
      let skillMatches = [];
      let skillGaps = [];
      let matchDetails = {};

      // Skills Analysis (40% weight)
      if (opportunity.requiredSkills && Array.isArray(opportunity.requiredSkills)) {
        opportunity.requiredSkills.forEach(skill => {
          const skillLower = skill.toLowerCase();
          const matchedSkill = studentSkills.find(studentSkill => 
            studentSkill.includes(skillLower) || skillLower.includes(studentSkill)
          );
          
          if (matchedSkill) {
            skillMatches.push(skill);
            score += 40 / opportunity.requiredSkills.length;
          } else {
            skillGaps.push(skill);
          }
        });
      }

      // Degree Relevance (25% weight)
      if (opportunity.degreeField && opportunity.degreeField.toLowerCase() === studentDegree) {
        score += 25;
        matchDetails.degreeMatch = 'Perfect Match';
      } else if (opportunity.degreeField && 
                 (opportunity.degreeField.toLowerCase().includes(studentDegree) || 
                  studentDegree.includes(opportunity.degreeField.toLowerCase()))) {
        score += 20;
        matchDetails.degreeMatch = 'Related Field';
      } else if (studentDegree) {
        score += 10;
        matchDetails.degreeMatch = 'Different Field';
      }

      // Location Preference (15% weight)
      if (opportunity.location && studentLocation) {
        if (opportunity.location.toLowerCase() === studentLocation) {
          score += 15;
          matchDetails.locationMatch = 'Perfect Match';
        } else if (opportunity.location.toLowerCase().includes('remote') && 
                   (studentLocation.includes('remote') || studentLocation.includes('flexible'))) {
          score += 15;
          matchDetails.locationMatch = 'Remote Match';
        } else if (opportunity.location.toLowerCase().includes(studentLocation) || 
                   studentLocation.includes(opportunity.location.toLowerCase())) {
          score += 10;
          matchDetails.locationMatch = 'Partial Match';
        }
      }

      // Work Type Preference (10% weight)
      if (opportunity.type && studentWorkType) {
        if (opportunity.type.toLowerCase() === studentWorkType) {
          score += 10;
          matchDetails.workTypeMatch = 'Perfect Match';
        } else if (opportunity.type.toLowerCase().includes(studentWorkType) || 
                   studentWorkType.includes(opportunity.type.toLowerCase())) {
          score += 7;
          matchDetails.workTypeMatch = 'Related Type';
        }
      }

      // Budget Alignment (10% weight)
      if (opportunity.budget && studentBudget) {
        const budgetPerHour = opportunity.budget / 40; // Assuming 40-hour work week
        if (Math.abs(budgetPerHour - studentBudget) <= 5) {
          score += 10;
          matchDetails.budgetMatch = 'Perfect Match';
        } else if (Math.abs(budgetPerHour - studentBudget) <= 15) {
          score += 7;
          matchDetails.budgetMatch = 'Close Match';
        } else if (budgetPerHour >= studentBudget * 0.8) {
          score += 5;
          matchDetails.budgetMatch = 'Acceptable Range';
        }
      }

      // Profile Completeness Bonus (5% weight)
      score += (profileCompleteness / 100) * 5;

      // Cap score at 100
      score = Math.min(100, Math.round(score));

      return {
        ...opportunity,
        recommendationScore: score,
        skillMatches,
        skillGaps,
        matchDetails,
        skillMatchCount: skillMatches.length,
        totalSkills: opportunity.requiredSkills ? opportunity.requiredSkills.length : 0,
        matchQuality: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor'
      };
    }).filter(opp => opp.recommendationScore > 20); // Only show relevant recommendations
  };

  const applyFilters = () => {
    let filtered = recommendations.filter(opp => 
      opp.recommendationScore >= selectedFilters.minScore &&
      opp.recommendationScore <= selectedFilters.maxScore &&
      (selectedFilters.workType === 'All' || opp.type === selectedFilters.workType) &&
      (selectedFilters.location === 'All' || opp.location === selectedFilters.location) &&
      (selectedFilters.budget === 'All' || 
       (selectedFilters.budget === 'Under $500' && opp.budget < 500) ||
       (selectedFilters.budget === '$500-$1000' && opp.budget >= 500 && opp.budget <= 1000) ||
       (selectedFilters.budget === 'Over $1000' && opp.budget > 1000))
    );

    // Sort recommendations
    switch (sortBy) {
      case 'relevance':
        filtered.sort((a, b) => b.recommendationScore - a.recommendationScore);
        break;
      case 'budget':
        filtered.sort((a, b) => b.budget - a.budget);
        break;
      case 'deadline':
        filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        break;
      case 'skillMatch':
        filtered.sort((a, b) => b.skillMatchCount - a.skillMatchCount);
        break;
      default:
        break;
    }

    setFilteredRecommendations(filtered);
  };

  const getMatchQualityColor = (quality) => {
    const colors = {
      'Excellent': 'text-green-600 bg-green-100',
      'Good': 'text-blue-600 bg-blue-100',
      'Fair': 'text-yellow-600 bg-yellow-100',
      'Poor': 'text-red-600 bg-red-100'
    };
    return colors[quality] || colors['Fair'];
  };

  const renderRecommendationCard = (opportunity) => (
    <div key={opportunity.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{opportunity.title}</h3>
          <p className="text-sm text-gray-600 mb-1">{opportunity.client}</p>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMatchQualityColor(opportunity.matchQuality)}`}>
              {opportunity.matchQuality} Match
            </span>
            <span className="text-sm text-gray-500">• {opportunity.type}</span>
            <span className="text-sm text-gray-500">• {opportunity.location}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{opportunity.recommendationScore}%</div>
          <div className="text-sm text-gray-500">Match Score</div>
        </div>
      </div>

      {/* Match Details */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Why this matches you:</h4>
        <div className="space-y-2">
          {opportunity.skillMatches.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm text-gray-600">
                {opportunity.skillMatches.length}/{opportunity.totalSkills} skills match
              </span>
            </div>
          )}
          {opportunity.matchDetails.degreeMatch && (
            <div className="flex items-center space-x-2">
              <span className="text-blue-500">🎓</span>
              <span className="text-sm text-gray-600">{opportunity.matchDetails.degreeMatch}</span>
            </div>
          )}
          {opportunity.matchDetails.locationMatch && (
            <div className="flex items-center space-x-2">
              <span className="text-purple-500">📍</span>
              <span className="text-sm text-gray-600">{opportunity.matchDetails.locationMatch}</span>
            </div>
          )}
          {opportunity.matchDetails.budgetMatch && (
            <div className="flex items-center space-x-2">
              <span className="text-green-500">💰</span>
              <span className="text-sm text-gray-600">{opportunity.matchDetails.budgetMatch}</span>
            </div>
          )}
        </div>
      </div>

      {/* Skills Analysis */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-700">Skills Analysis</h4>
          <button
            onClick={() => setShowSkillGap(true)}
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            View Details
          </button>
        </div>
        
        {/* Skills Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(opportunity.skillMatches.length / opportunity.totalSkills) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>{opportunity.skillMatches.length} matched</span>
          <span>{opportunity.skillGaps.length} to learn</span>
        </div>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-500">Budget:</span>
          <div className="font-semibold text-gray-900">${opportunity.budget}</div>
        </div>
        <div>
          <span className="text-gray-500">Deadline:</span>
          <div className="font-semibold text-gray-900">
            {new Date(opportunity.deadline).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => onApply(opportunity)}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Apply Now
        </button>
        <button
          onClick={() => onBookmark(opportunity.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            opportunity.isBookmarked
              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {opportunity.isBookmarked ? '✓' : '☆'}
        </button>
      </div>
    </div>
  );

  const renderSkillGapModal = () => {
    if (!showSkillGap) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Skills Analysis & Learning Path</h2>
              <button
                onClick={() => setShowSkillGap(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Skills */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Current Skills</h3>
                <div className="space-y-2">
                  {studentData?.technicalSkills ? 
                    (typeof studentData.technicalSkills === 'string' ? 
                      studentData.technicalSkills.split(',').map((skill, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                          <span className="text-green-500">✓</span>
                          <span className="text-sm text-gray-700">{skill.trim()}</span>
                        </div>
                      )) :
                      studentData.technicalSkills.map((skill, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                          <span className="text-green-500">✓</span>
                          <span className="text-sm text-gray-700">{skill}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No skills listed yet</p>
                    )
                  }
                </div>
              </div>

              {/* Skills to Learn */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills to Learn</h3>
                <div className="space-y-2">
                  {filteredRecommendations.length > 0 ? 
                    filteredRecommendations[0].skillGaps.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-500">📚</span>
                          <span className="text-sm text-gray-700">{skill}</span>
                        </div>
                        <button className="text-xs text-blue-600 hover:text-blue-800 transition-colors">
                          Find Courses
                        </button>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-sm">No skill gaps identified</p>
                    )
                  }
                </div>
              </div>
            </div>

            {/* Learning Recommendations */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Learning Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <span className="text-2xl mb-2 block">🎯</span>
                  <h4 className="font-medium text-blue-900 mb-1">Online Courses</h4>
                  <p className="text-xs text-blue-700">Structured learning paths</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <span className="text-2xl mb-2 block">💻</span>
                  <h4 className="font-medium text-blue-900 mb-1">Practice Projects</h4>
                  <p className="text-xs text-blue-700">Hands-on experience</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <span className="text-2xl mb-2 block">👥</span>
                  <h4 className="font-medium text-blue-900 mb-1">Mentorship</h4>
                  <p className="text-xs text-blue-700">Expert guidance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI-Powered Job Recommendations</h2>
          <p className="text-gray-600">
            {loading ? 'Loading opportunities from database...' : 'Personalized opportunities based on your skills and preferences'}
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600">Profile Completion</p>
          <p className="text-2xl font-bold text-blue-600">{profileCompleteness}%</p>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Score</label>
            <input
              type="number"
              min="0"
              max="100"
              value={selectedFilters.minScore}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, minScore: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Score</label>
            <input
              type="number"
              min="0"
              max="100"
              value={selectedFilters.maxScore}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, maxScore: parseInt(e.target.value) || 100 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Work Type</label>
            <select
              value={selectedFilters.workType}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, workType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Project">Project</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
              <option value="Part-time Job">Part-time Job</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select
              value={selectedFilters.location}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Locations</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
            <select
              value={selectedFilters.budget}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, budget: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Budgets</option>
              <option value="Under $500">Under $500</option>
              <option value="$500-$1000">$500-$1000</option>
              <option value="Over $1000">Over $1000</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevance">Relevance Score</option>
              <option value="budget">Budget (High to Low)</option>
              <option value="deadline">Deadline (Soonest)</option>
              <option value="skillMatch">Skill Match</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            {filteredRecommendations.length} of {recommendations.length} opportunities
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading opportunities...</h3>
          <p className="text-gray-600">Fetching the latest job posts from clients</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">⚠️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading opportunities</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      ) : filteredRecommendations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRecommendations.map(renderRecommendationCard)}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matching opportunities</h3>
          <p className="text-gray-600">
            Try adjusting your filters or complete your profile to get better recommendations.
          </p>
        </div>
      )}

      {/* Skill Gap Modal */}
      {renderSkillGapModal()}
    </div>
  );
};

export default EnhancedRecommendations;
