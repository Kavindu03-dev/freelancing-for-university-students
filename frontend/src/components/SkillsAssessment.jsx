import React, { useState, useEffect } from 'react';

const SkillsAssessment = ({ currentSkills, onSkillsUpdate, onLearningPathUpdate }) => {
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [assessmentResults, setAssessmentResults] = useState({});
  const [showAssessment, setShowAssessment] = useState(false);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('all');

  const skillCategories = {
    programming: {
      name: "Programming & Development",
      icon: "💻",
      skills: ["JavaScript", "Python", "Java", "C++", "React", "Node.js", "SQL", "Git"]
    },
    design: {
      name: "Design & Creative",
      icon: "🎨",
      skills: ["UI/UX Design", "Graphic Design", "Adobe Creative Suite", "Figma", "Sketch", "Illustration"]
    },
    business: {
      name: "Business & Marketing",
      icon: "📊",
      skills: ["Digital Marketing", "SEO", "Social Media", "Analytics", "Project Management", "Sales"]
    },
    data: {
      name: "Data & Analytics",
      icon: "📈",
      skills: ["Data Analysis", "Machine Learning", "Statistics", "Excel", "Tableau", "Python Pandas"]
    },
    communication: {
      name: "Communication & Soft Skills",
      icon: "💬",
      skills: ["Public Speaking", "Writing", "Leadership", "Teamwork", "Problem Solving", "Time Management"]
    }
  };

  const assessmentQuestions = {
    javascript: [
      {
        question: "What is the difference between '==' and '===' in JavaScript?",
        options: [
          "There is no difference",
          "== checks value and type, === checks only value",
          "== checks only value, === checks value and type",
          "Both check value and type"
        ],
        correct: 2,
        explanation: "== performs type coercion while === checks both value and type without coercion."
      },
      {
        question: "What is a closure in JavaScript?",
        options: [
          "A function that has access to variables in its outer scope",
          "A way to close browser tabs",
          "A method to end loops",
          "A type of variable declaration"
        ],
        correct: 0,
        explanation: "A closure is a function that has access to variables in its outer (enclosing) scope."
      },
      {
        question: "What does 'this' keyword refer to in JavaScript?",
        options: [
          "Always refers to the global object",
          "Refers to the function it's written inside",
          "Depends on how the function is called",
          "Refers to the previous function"
        ],
        correct: 2,
        explanation: "The value of 'this' depends on how the function is called (execution context)."
      }
    ],
    python: [
      {
        question: "What is a list comprehension in Python?",
        options: [
          "A way to create lists using loops",
          "A method to sort lists",
          "A type of list data structure",
          "A way to delete list items"
        ],
        correct: 0,
        explanation: "List comprehensions provide a concise way to create lists based on existing sequences."
      },
      {
        question: "What is the difference between a list and a tuple in Python?",
        options: [
          "Lists are faster than tuples",
          "Lists are mutable, tuples are immutable",
          "Tuples can only contain numbers",
          "There is no difference"
        ],
        correct: 1,
        explanation: "Lists can be modified after creation, while tuples cannot be changed."
      }
    ],
    "ui/ux design": [
      {
        question: "What is the primary goal of user experience design?",
        options: [
          "To make designs look beautiful",
          "To create functional and enjoyable user interactions",
          "To use the latest design trends",
          "To minimize development costs"
        ],
        correct: 1,
        explanation: "UX design focuses on creating functional, accessible, and enjoyable user interactions."
      },
      {
        question: "What is a wireframe in UX design?",
        options: [
          "A final design mockup",
          "A low-fidelity visual representation of a design",
          "A color palette",
          "A type of font"
        ],
        correct: 1,
        explanation: "Wireframes are low-fidelity visual representations used to plan the structure and layout."
      }
    ]
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [assessmentComplete, setAssessmentComplete] = useState(false);

  const startAssessment = (skill) => {
    setCurrentAssessment(skill);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setAssessmentComplete(false);
    setShowAssessment(true);
  };

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < assessmentQuestions[currentAssessment].length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeAssessment();
    }
  };

  const completeAssessment = () => {
    const questions = assessmentQuestions[currentAssessment];
    let correctAnswers = 0;
    
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correct) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    const level = score >= 80 ? 'Advanced' : score >= 60 ? 'Intermediate' : 'Beginner';

    setAssessmentResults(prev => ({
      ...prev,
      [currentAssessment]: {
        score,
        level,
        correctAnswers,
        totalQuestions: questions.length,
        completedAt: new Date().toISOString()
      }
    }));

    setAssessmentComplete(true);
  };

  const getSkillLevel = (skill) => {
    const result = assessmentResults[skill];
    if (!result) return 'Not Assessed';
    return result.level;
  };

  const getSkillScore = (skill) => {
    const result = assessmentResults[skill];
    if (!result) return 0;
    return result.score;
  };

  const getSkillColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSkillBadgeColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const renderAssessment = () => {
    if (!currentAssessment || !assessmentQuestions[currentAssessment]) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">Assessment not available for this skill.</p>
        </div>
      );
    }

    const questions = assessmentQuestions[currentAssessment];
    const currentQuestion = questions[currentQuestionIndex];

    if (assessmentComplete) {
      const result = assessmentResults[currentAssessment];
      return (
        <div className="text-center py-8">
          <div className="mb-6">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
              result.score >= 80 ? 'bg-green-100' : result.score >= 60 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <span className="text-4xl">
                {result.score >= 80 ? '🎉' : result.score >= 60 ? '👍' : '📚'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete!</h3>
            <p className="text-gray-600 mb-4">
              You scored {result.score}% ({result.correctAnswers}/{result.totalQuestions} correct)
            </p>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSkillBadgeColor(result.score)}`}>
              {result.level} Level
            </span>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setShowAssessment(false)}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              Close Assessment
            </button>
            <button
              onClick={() => startAssessment(currentAssessment)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors ml-3"
            >
              Retake Assessment
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {currentAssessment.charAt(0).toUpperCase() + currentAssessment.slice(1)} Assessment
          </h3>
          <p className="text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {currentQuestion.question}
          </h4>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestionIndex, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  userAnswers[currentQuestionIndex] === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium text-gray-900">{option}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {userAnswers[currentQuestionIndex] !== undefined ? 'Answer selected' : 'Please select an answer'}
          </div>
          <button
            onClick={nextQuestion}
            disabled={userAnswers[currentQuestionIndex] === undefined}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              userAnswers[currentQuestionIndex] !== undefined
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
          </button>
        </div>
      </div>
    );
  };

  const renderSkillCard = (category, skills) => (
    <div key={category} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-2xl">{skills.icon}</span>
        <h3 className="text-lg font-semibold text-gray-900">{skills.name}</h3>
      </div>

      <div className="space-y-3">
        {skills.skills.map((skill) => {
          const score = getSkillScore(skill.toLowerCase());
          const level = getSkillLevel(skill.toLowerCase());
          
          return (
            <div key={skill} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-gray-700 font-medium">{skill}</span>
                {score > 0 && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSkillBadgeColor(score)}`}>
                    {level}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {score > 0 && (
                  <span className={`text-sm font-semibold ${getSkillColor(score)}`}>
                    {score}%
                  </span>
                )}
                <button
                  onClick={() => startAssessment(skill.toLowerCase())}
                  className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  {score > 0 ? 'Retake' : 'Assess'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderLearningPaths = () => {
    const skillGaps = Object.values(skillCategories).flatMap(category => 
      category.skills.filter(skill => getSkillScore(skill.toLowerCase()) < 60)
    );

    if (skillGaps.length === 0) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <span className="text-4xl mb-4 block">🎉</span>
          <h3 className="text-lg font-semibold text-green-900 mb-2">Great Job!</h3>
          <p className="text-green-700">You have strong skills across all categories. Keep learning and growing!</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Recommended Learning Paths</h3>
        {skillGaps.map((skill, index) => (
          <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{skill}</h4>
                <p className="text-sm text-gray-600">Current level: {getSkillLevel(skill.toLowerCase())}</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                  Find Courses
                </button>
                <button className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                  Practice Projects
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Skills Assessment & Portfolio</h2>
          <p className="text-gray-600">Assess your skills and track your learning progress</p>
        </div>
        
        {/* Category Filter */}
        <select
          value={selectedSkillCategory}
          onChange={(e) => setSelectedSkillCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {Object.entries(skillCategories).map(([key, category]) => (
            <option key={key} value={key}>{category.name}</option>
          ))}
        </select>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(skillCategories)
          .filter(([key, category]) => selectedSkillCategory === 'all' || key === selectedSkillCategory)
          .map(([key, category]) => renderSkillCard(key, category))
        }
      </div>

      {/* Learning Paths */}
      <div className="bg-gray-50 rounded-xl p-6">
        {renderLearningPaths()}
      </div>

      {/* Assessment Modal */}
      {showAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Skill Assessment</h2>
                <button
                  onClick={() => setShowAssessment(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {renderAssessment()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsAssessment;
