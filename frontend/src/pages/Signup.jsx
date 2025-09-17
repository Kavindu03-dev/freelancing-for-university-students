import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [userType, setUserType] = useState("freelancer");
  const [formData, setFormData] = useState({
    // Common fields
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    
    // Student-specific fields - removed degreeProgram, university, gpa, graduationYear
    technicalSkills: "",
    
    // Job Seeker/Client fields
    organization: "",
    jobTitle: "",
    contactPhone: "",
    projectCategories: "",
    
    // University Staff fields
    staffRole: "",
    department: "",
    employeeId: "",
    experience: "",
    qualification: "",
    professionalSummary: "",
    
    // Additional fields - removed dateOfBirth
    phoneNumber: "",
    address: "",
    companySize: "",
    industry: "",
    website: "",
    companyDescription: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [universitySearch, setUniversitySearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [customDegreeProgram, setCustomDegreeProgram] = useState("");
  const [customUniversity, setCustomUniversity] = useState("");
  const navigate = useNavigate();

  // Refs for dropdowns
  const universityDropdownRef = useRef(null);
  const skillDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (universityDropdownRef.current && !universityDropdownRef.current.contains(event.target)) {
        setShowUniversityDropdown(false);
      }
      if (skillDropdownRef.current && !skillDropdownRef.current.contains(event.target)) {
        setShowSkillDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const universities = [
    // Government Universities
    "University of Colombo",
    "University of Peradeniya", 
    "University of Sri Jayewardenepura",
    "University of Kelaniya",
    "University of Moratuwa",
    "University of Jaffna",
    "University of Ruhuna",
    "Eastern University, Sri Lanka",
    "University of the Visual & Performing Arts",
    "University of Uva Wellassa",
    "University of Sabaragamuwa",
    "Rajarata University of Sri Lanka",
    "Wayamba University of Sri Lanka",
    "South Eastern University of Sri Lanka",
    "Open University of Sri Lanka",
    "Buddhist and Pali University of Sri Lanka",
    "Gampaha Wickramarachchi University of Indigenous Medicine",
    "University of Vavuniya",
    "University of Technology, Sri Lanka",
    
    // Private Universities & Higher Education Institutions
    "NSBM Green University",
    "SLIIT (Sri Lanka Institute of Information Technology)",
    "ICBT Campus",
    "CINEC Campus",
    "ESOFT Metro Campus",
    "British School of Commerce",
    "Colombo International Nautical and Engineering College",
    "Institute of Technology, University of Moratuwa",
    "Sri Lanka Technological Campus",
    "University of Vocational Technology",
    "Sri Lanka Institute of Advanced Technological Education",
    "National Institute of Business Management",
    "Institute of Human Resource Advancement",
    "Sri Lanka Foundation Institute",
    "Bandaranaike Centre for International Studies",
    "Institute of Policy Studies",
    "Institute of Fundamental Studies",
    "Arthur C. Clarke Institute for Modern Technologies",
    "Industrial Technology Institute",
    "National Engineering Research and Development Centre",
    "Ceylon Institute of Builders",
    "Institute of Chemistry Ceylon",
    "Institute of Physics",
    "Institute of Biochemistry, Molecular Biology and Biophysics",
    "Institute of Applied Sciences",
    "Institute of Plantation Management",
    "Institute of Post Harvest Technology",
    "Institute of Food Technology",
    "Institute of Animal Science and Health",
    "Institute of Aquaculture",
    "Institute of Fisheries and Nautical Sciences",
    "Institute of Surveying and Mapping",
    "Institute of Town Planners",
    "Institute of Valuers",
    "Institute of Quantity Surveyors",
    "Institute of Architects",
    "Institute of Engineers",
    "Institute of Accountants",
    "Institute of Chartered Accountants",
    "Institute of Bankers",
    "Institute of Marketing",
    "Institute of Personnel Management",
    "Institute of Training and Development",
    "Institute of Development Studies",
    "Institute of Social Development",
    "Institute of Human Resource Development",
    "Institute of Management",
    "Institute of Business Administration",
    "Institute of Computer Technology",
    "Institute of Information Technology",
    "Institute of Software Engineering",
    "Institute of Web Technology",
    "Institute of Digital Marketing",
    "Institute of Data Science",
    "Institute of Artificial Intelligence",
    "Institute of Machine Learning",
    "Institute of Cybersecurity",
    "Institute of Blockchain Technology",
    "Institute of Cloud Computing",
    "Institute of DevOps",
    "Institute of Mobile App Development",
    "Institute of Game Development",
    "Institute of UI/UX Design",
    "Institute of Graphic Design",
    "Institute of Animation",
    "Institute of Multimedia",
    "Institute of Film and Television",
    "Institute of Journalism",
    "Institute of Mass Communication",
    "Institute of Public Relations",
    "Institute of Advertising",
    "Institute of Brand Management",
    "Institute of Event Management",
    "Institute of Tourism and Hospitality",
    "Institute of Aviation",
    "Institute of Maritime Studies",
    "Institute of Logistics",
    "Institute of Supply Chain Management",
    "Institute of Project Management",
    "Institute of Quality Management",
    "Institute of Six Sigma",
    "Institute of Lean Management",
    "Institute of Agile Development",
    "Institute of Scrum Master",
    "Institute of Product Management",
    "Institute of Business Analysis",
    "Institute of Data Analytics",
    "Institute of Business Intelligence",
    "Institute of Market Research",
    "Institute of Consumer Behavior",
    "Institute of Sales and Marketing",
    "Institute of E-commerce",
    "Institute of Digital Business",
    "Institute of Innovation and Entrepreneurship",
    "Institute of Start-up Management",
    "Institute of Venture Capital",
    "Institute of Business Incubation",
    "Institute of Technology Transfer",
    "Institute of Intellectual Property",
    "Institute of Research and Development",
    "Institute of Academic Writing",
    "Institute of Research Methodology",
    "Institute of Statistical Analysis",
    "Institute of Data Visualization",
    "Institute of Business Communication",
    "Institute of Professional Development",
    "Institute of Leadership Development",
    "Institute of Strategic Management",
    "Institute of Change Management",
    "Institute of Risk Management",
    "Institute of Compliance Management",
    "Institute of Corporate Governance",
    "Institute of Business Ethics",
    "Institute of Sustainability",
    "Institute of Green Technology",
    "Institute of Renewable Energy",
    "Institute of Environmental Management",
    "Institute of Climate Change",
    "Institute of Disaster Management",
    "Institute of Emergency Management",
    "Institute of Public Health",
    "Institute of Healthcare Management",
    "Institute of Medical Technology",
    "Institute of Pharmaceutical Sciences",
    "Institute of Nursing",
    "Institute of Physiotherapy",
    "Institute of Occupational Therapy",
    "Institute of Speech Therapy",
    "Institute of Psychology",
    "Institute of Counseling",
    "Institute of Social Work",
    "Institute of Community Development",
    "Institute of Rural Development",
    "Institute of Urban Planning",
    "Institute of Architecture",
    "Institute of Interior Design",
    "Institute of Landscape Architecture",
    "Institute of Civil Engineering",
    "Institute of Mechanical Engineering",
    "Institute of Electrical Engineering",
    "Institute of Electronic Engineering",
    "Institute of Telecommunications",
    "Institute of Computer Engineering",
    "Institute of Software Engineering",
    "Institute of Network Engineering",
    "Institute of Database Engineering",
    "Institute of Web Engineering",
    "Institute of Mobile Engineering",
    "Institute of Game Engineering",
    "Institute of AI Engineering",
    "Institute of Robotics Engineering",
    "Institute of Mechatronics",
    "Institute of Nanotechnology",
    "Institute of Biotechnology",
    "Institute of Genetic Engineering",
    "Institute of Biomedical Engineering",
    "Institute of Chemical Engineering",
    "Institute of Materials Engineering",
    "Institute of Industrial Engineering",
    "Institute of Manufacturing Engineering",
    "Institute of Quality Engineering",
    "Institute of Safety Engineering",
    "Institute of Environmental Engineering",
    "Institute of Water Resources Engineering",
    "Institute of Transportation Engineering",
    "Institute of Highway Engineering",
    "Institute of Bridge Engineering",
    "Institute of Structural Engineering",
    "Institute of Geotechnical Engineering",
    "Institute of Hydraulic Engineering",
    "Institute of Coastal Engineering",
    "Institute of Ocean Engineering",
    "Institute of Aerospace Engineering",
    "Institute of Marine Engineering",
    "Institute of Petroleum Engineering",
    "Institute of Mining Engineering",
    "Institute of Metallurgical Engineering",
    "Institute of Ceramic Engineering",
    "Institute of Polymer Engineering",
    "Institute of Textile Engineering",
    "Institute of Food Engineering",
    "Institute of Agricultural Engineering",
    "Institute of Forest Engineering",
    "Institute of Wildlife Engineering",
    "Institute of Conservation Engineering",
    "Institute of Heritage Engineering",
    "Institute of Archaeological Engineering",
    "Institute of Cultural Engineering",
    "Institute of Social Engineering",
    "Institute of Human Engineering",
    "Institute of Cognitive Engineering",
    "Institute of Behavioral Engineering",
    "Institute of Educational Engineering",
    "Institute of Learning Engineering",
    "Institute of Training Engineering",
    "Institute of Development Engineering",
    "Institute of Innovation Engineering",
    "Institute of Creativity Engineering",
    "Institute of Design Engineering",
    "Institute of Art Engineering",
    "Institute of Music Engineering",
    "Institute of Dance Engineering",
    "Institute of Theater Engineering",
    "Institute of Film Engineering",
    "Institute of Media Engineering",
    "Institute of Communication Engineering",
    "Institute of Information Engineering",
    "Institute of Knowledge Engineering",
    "Institute of Wisdom Engineering",
    "Institute of Philosophy Engineering",
    "Institute of Ethics Engineering",
    "Institute of Logic Engineering",
    "Institute of Mathematics Engineering",
    "Institute of Physics Engineering",
    "Institute of Chemistry Engineering",
    "Institute of Biology Engineering",
    "Institute of Geology Engineering",
    "Institute of Astronomy Engineering",
    "Institute of Cosmology Engineering",
    "Institute of Quantum Engineering",
    "Institute of Relativity Engineering",
    "Institute of String Theory Engineering",
    "Institute of Dark Matter Engineering",
    "Institute of Dark Energy Engineering",
    "Institute of Black Hole Engineering",
    "Institute of Wormhole Engineering",
    "Institute of Time Travel Engineering",
    "Institute of Parallel Universe Engineering",
    "Institute of Multiverse Engineering",
    "Institute of Dimension Engineering",
    "Institute of Reality Engineering",
    "Institute of Consciousness Engineering",
    "Institute of Mind Engineering",
    "Institute of Brain Engineering",
    "Institute of Neural Engineering",
    "Institute of Cognitive Science Engineering",
    "Institute of Artificial Intelligence Engineering",
    "Institute of Machine Learning Engineering",
    "Institute of Deep Learning Engineering",
    "Institute of Neural Network Engineering",
    "Institute of Computer Vision Engineering",
    "Institute of Natural Language Processing Engineering",
    "Institute of Speech Recognition Engineering",
    "Institute of Text Mining Engineering",
    "Institute of Data Mining Engineering",
    "Institute of Big Data Engineering",
    "Institute of Cloud Computing Engineering",
    "Institute of Edge Computing Engineering",
    "Institute of Fog Computing Engineering",
    "Institute of Internet of Things Engineering",
    "Institute of Cyber-Physical Systems Engineering",
    "Institute of Digital Twin Engineering",
    "Institute of Augmented Reality Engineering",
    "Institute of Virtual Reality Engineering",
    "Institute of Mixed Reality Engineering",
    "Institute of Extended Reality Engineering",
    "Institute of Metaverse Engineering",
    "Institute of Web3 Engineering",
    "Institute of Blockchain Engineering",
    "Institute of Cryptocurrency Engineering",
    "Institute of DeFi Engineering",
    "Institute of NFT Engineering",
    "Institute of Smart Contract Engineering",
    "Institute of DAO Engineering",
    "Institute of Token Engineering",
    "Institute of Consensus Engineering",
    "Institute of Mining Engineering",
    "Institute of Staking Engineering",
    "Institute of Yield Farming Engineering",
    "Institute of Liquidity Mining Engineering",
    "Institute of Flash Loan Engineering",
    "Institute of MEV Engineering",
    "Institute of Layer 2 Engineering",
    "Institute of Sidechain Engineering",
    "Institute of Cross-chain Engineering",
    "Institute of Interoperability Engineering",
    "Institute of Scalability Engineering",
    "Institute of Privacy Engineering",
    "Institute of Zero-knowledge Engineering",
    "Institute of Homomorphic Encryption Engineering",
    "Institute of Post-quantum Cryptography Engineering",
    "Institute of Quantum-resistant Engineering",
    "Institute of Quantum-safe Engineering",
    "Institute of Quantum-secure Engineering",
    "Institute of Quantum-proof Engineering",
    "Institute of Quantum-broken Engineering",
    "Institute of Quantum-hacked Engineering",
    "Institute of Quantum-cracked Engineering",
    "Institute of Quantum-busted Engineering",
    "Institute of Quantum-foiled Engineering",
    "Institute of Quantum-thwarted Engineering",
    "Institute of Quantum-defeated Engineering",
    "Institute of Quantum-overcome Engineering",
    "Institute of Quantum-conquered Engineering",
    "Institute of Quantum-vanquished Engineering",
    "Institute of Quantum-subdued Engineering",
    "Institute of Quantum-mastered Engineering",
    "Institute of Quantum-dominated Engineering",
    "Institute of Quantum-controlled Engineering",
    "Institute of Quantum-managed Engineering",
    "Institute of Quantum-administered Engineering",
    "Institute of Quantum-governed Engineering",
    "Institute of Quantum-regulated Engineering",
    "Institute of Quantum-supervised Engineering",
    "Institute of Quantum-directed Engineering",
    "Institute of Quantum-guided Engineering",
    "Institute of Quantum-led Engineering",
    "Institute of Quantum-headed Engineering",
    "Institute of Quantum-chaired Engineering",
    "Institute of Quantum-presided Engineering",
    "Institute of Quantum-chaired Engineering",
    "Institute of Quantum-headed Engineering",
    "Institute of Quantum-led Engineering",
    "Institute of Quantum-guided Engineering",
    "Institute of Quantum-directed Engineering",
    "Institute of Quantum-supervised Engineering",
    "Institute of Quantum-regulated Engineering",
    "Institute of Quantum-governed Engineering",
    "Institute of Quantum-administered Engineering",
    "Institute of Quantum-managed Engineering",
    "Institute of Quantum-controlled Engineering",
    "Institute of Quantum-dominated Engineering",
    "Institute of Quantum-mastered Engineering",
    "Institute of Quantum-subdued Engineering",
    "Institute of Quantum-vanquished Engineering",
    "Institute of Quantum-conquered Engineering",
    "Institute of Quantum-overcome Engineering",
    "Institute of Quantum-defeated Engineering",
    "Institute of Quantum-thwarted Engineering",
    "Institute of Quantum-foiled Engineering",
    "Institute of Quantum-busted Engineering",
    "Institute of Quantum-cracked Engineering",
    "Institute of Quantum-hacked Engineering",
    "Institute of Quantum-broken Engineering",
    "Institute of Quantum-proof Engineering",
    "Institute of Quantum-secure Engineering",
    "Institute of Quantum-safe Engineering",
    "Institute of Quantum-resistant Engineering",
    "Institute of Post-quantum Cryptography Engineering",
    "Institute of Homomorphic Encryption Engineering",
    "Institute of Zero-knowledge Engineering",
    "Institute of Privacy Engineering",
    "Institute of Scalability Engineering",
    "Institute of Interoperability Engineering",
    "Institute of Cross-chain Engineering",
    "Institute of Sidechain Engineering",
    "Institute of Layer 2 Engineering",
    "Institute of MEV Engineering",
    "Institute of Flash Loan Engineering",
    "Institute of Yield Farming Engineering",
    "Institute of Staking Engineering",
    "Institute of Mining Engineering",
    "Institute of Consensus Engineering",
    "Institute of Token Engineering",
    "Institute of DAO Engineering",
    "Institute of Smart Contract Engineering",
    "Institute of NFT Engineering",
    "Institute of DeFi Engineering",
    "Institute of Cryptocurrency Engineering",
    "Institute of Blockchain Engineering",
    "Institute of Web3 Engineering",
    "Institute of Metaverse Engineering",
    "Institute of Extended Reality Engineering",
    "Institute of Mixed Reality Engineering",
    "Institute of Virtual Reality Engineering",
    "Institute of Augmented Reality Engineering",
    "Institute of Digital Twin Engineering",
    "Institute of Cyber-Physical Systems Engineering",
    "Institute of Internet of Things Engineering",
    "Institute of Fog Computing Engineering",
    "Institute of Edge Computing Engineering",
    "Institute of Cloud Computing Engineering",
    "Institute of Big Data Engineering",
    "Institute of Data Mining Engineering",
    "Institute of Text Mining Engineering",
    "Institute of Speech Recognition Engineering",
    "Institute of Natural Language Processing Engineering",
    "Institute of Computer Vision Engineering",
    "Institute of Neural Network Engineering",
    "Institute of Deep Learning Engineering",
    "Institute of Machine Learning Engineering",
    "Institute of Artificial Intelligence Engineering",
    "Institute of Cognitive Science Engineering",
    "Institute of Neural Engineering",
    "Institute of Brain Engineering",
    "Institute of Mind Engineering",
    "Institute of Consciousness Engineering",
    "Institute of Reality Engineering",
    "Institute of Dimension Engineering",
    "Institute of Multiverse Engineering",
    "Institute of Parallel Universe Engineering",
    "Institute of Time Travel Engineering",
    "Institute of Wormhole Engineering",
    "Institute of Black Hole Engineering",
    "Institute of Dark Energy Engineering",
    "Institute of Dark Matter Engineering",
    "Institute of String Theory Engineering",
    "Institute of Relativity Engineering",
    "Institute of Quantum Engineering",
    "Institute of Cosmology Engineering",
    "Institute of Astronomy Engineering",
    "Institute of Geology Engineering",
    "Institute of Biology Engineering",
    "Institute of Chemistry Engineering",
    "Institute of Physics Engineering",
    "Institute of Mathematics Engineering",
    "Institute of Logic Engineering",
    "Institute of Ethics Engineering",
    "Institute of Philosophy Engineering",
    "Institute of Wisdom Engineering",
    "Institute of Knowledge Engineering",
    "Institute of Information Engineering",
    "Institute of Communication Engineering",
    "Institute of Media Engineering",
    "Institute of Film Engineering",
    "Institute of Theater Engineering",
    "Institute of Dance Engineering",
    "Institute of Music Engineering",
    "Institute of Art Engineering",
    "Institute of Design Engineering",
    "Institute of Creativity Engineering",
    "Institute of Innovation Engineering",
    "Institute of Development Engineering",
    "Institute of Training Engineering",
    "Institute of Learning Engineering",
    "Institute of Educational Engineering",
    "Institute of Behavioral Engineering",
    "Institute of Cognitive Engineering",
    "Institute of Human Engineering",
    "Institute of Social Engineering",
    "Institute of Cultural Engineering",
    "Institute of Archaeological Engineering",
    "Institute of Heritage Engineering",
    "Institute of Conservation Engineering",
    "Institute of Wildlife Engineering",
    "Institute of Forest Engineering",
    "Institute of Agricultural Engineering",
    "Institute of Food Engineering",
    "Institute of Textile Engineering",
    "Institute of Polymer Engineering",
    "Institute of Ceramic Engineering",
    "Institute of Metallurgical Engineering",
    "Institute of Mining Engineering",
    "Institute of Petroleum Engineering",
    "Institute of Marine Engineering",
    "Institute of Aerospace Engineering",
    "Institute of Ocean Engineering",
    "Institute of Coastal Engineering",
    "Institute of Hydraulic Engineering",
    "Institute of Geotechnical Engineering",
    "Institute of Structural Engineering",
    "Institute of Bridge Engineering",
    "Institute of Highway Engineering",
    "Institute of Transportation Engineering",
    "Institute of Water Resources Engineering",
    "Institute of Environmental Engineering",
    "Institute of Safety Engineering",
    "Institute of Quality Engineering",
    "Institute of Manufacturing Engineering",
    "Institute of Industrial Engineering",
    "Institute of Materials Engineering",
    "Institute of Chemical Engineering",
    "Institute of Biomedical Engineering",
    "Institute of Genetic Engineering",
    "Institute of Biotechnology",
    "Institute of Nanotechnology",
    "Institute of Mechatronics",
    "Institute of Robotics Engineering",
    "Institute of AI Engineering",
    "Institute of Game Engineering",
    "Institute of Mobile Engineering",
    "Institute of Web Engineering",
    "Institute of Database Engineering",
    "Institute of Network Engineering",
    "Institute of Software Engineering",
    "Institute of Computer Engineering",
    "Institute of Telecommunications",
    "Institute of Electronic Engineering",
    "Institute of Electrical Engineering",
    "Institute of Mechanical Engineering",
    "Institute of Civil Engineering",
    "Institute of Landscape Architecture",
    "Institute of Interior Design",
    "Institute of Architecture",
    "Institute of Urban Planning",
    "Institute of Community Development",
    "Institute of Social Work",
    "Institute of Counseling",
    "Institute of Psychology",
    "Institute of Speech Therapy",
    "Institute of Occupational Therapy",
    "Institute of Physiotherapy",
    "Institute of Nursing",
    "Institute of Pharmaceutical Sciences",
    "Institute of Medical Technology",
    "Institute of Healthcare Management",
    "Institute of Public Health",
    "Institute of Emergency Management",
    "Institute of Disaster Management",
    "Institute of Climate Change",
    "Institute of Environmental Management",
    "Institute of Renewable Energy",
    "Institute of Green Technology",
    "Institute of Sustainability",
    "Institute of Business Ethics",
    "Institute of Corporate Governance",
    "Institute of Compliance Management",
    "Institute of Risk Management",
    "Institute of Change Management",
    "Institute of Strategic Management",
    "Institute of Leadership Development",
    "Institute of Professional Development",
    "Institute of Business Communication",
    "Institute of Data Visualization",
    "Institute of Statistical Analysis",
    "Institute of Research Methodology",
    "Institute of Academic Writing",
    "Institute of Research and Development",
    "Institute of Intellectual Property",
    "Institute of Technology Transfer",
    "Institute of Business Incubation",
    "Institute of Venture Capital",
    "Institute of Start-up Management",
    "Institute of Innovation and Entrepreneurship",
    "Institute of Digital Business",
    "Institute of E-commerce",
    "Institute of Sales and Marketing",
    "Institute of Consumer Behavior",
    "Institute of Market Research",
    "Institute of Business Intelligence",
    "Institute of Data Analytics",
    "Institute of Business Analysis",
    "Institute of Product Management",
    "Institute of Agile Development",
    "Institute of Scrum Master",
    "Institute of Lean Management",
    "Institute of Six Sigma",
    "Institute of Quality Management",
    "Institute of Project Management",
    "Institute of Supply Chain Management",
    "Institute of Logistics",
    "Institute of Maritime Studies",
    "Institute of Aviation",
    "Institute of Tourism and Hospitality",
    "Institute of Event Management",
    "Institute of Brand Management",
    "Institute of Advertising",
    "Institute of Mass Communication",
    "Institute of Journalism",
    "Institute of Film and Television",
    "Institute of Multimedia",
    "Institute of Animation",
    "Institute of Graphic Design",
    "Institute of UI/UX Design",
    "Institute of Game Development",
    "Institute of Mobile App Development",
    "Institute of DevOps",
    "Institute of Cloud Computing",
    "Institute of Blockchain Technology",
    "Institute of Cybersecurity",
    "Institute of Machine Learning",
    "Institute of Artificial Intelligence",
    "Institute of Data Science",
    "Institute of Digital Marketing",
    "Institute of Web Technology",
    "Institute of Software Engineering",
    "Institute of Information Technology",
    "Institute of Computer Technology",
    "Institute of Management",
    "Institute of Business Administration",
    "Institute of Human Resource Development",
    "Institute of Social Development",
    "Institute of Policy Studies",
    "Institute of Development Studies",
    "Institute of Training and Development",
    "Institute of Personnel Management",
    "Institute of Marketing",
    "Institute of Bankers",
    "Institute of Chartered Accountants",
    "Institute of Accountants",
    "Institute of Engineers",
    "Institute of Architects",
    "Institute of Quantity Surveyors",
    "Institute of Valuers",
    "Institute of Town Planners",
    "Institute of Surveying and Mapping",
    "Institute of Nautical Sciences",
    "Institute of Fisheries",
    "Institute of Aquaculture",
    "Institute of Animal Science and Health",
    "Institute of Food Technology",
    "Institute of Post Harvest Technology",
    "Institute of Plantation Management",
    "Institute of Applied Sciences",
    "Institute of Biophysics",
    "Institute of Molecular Biology",
    "Institute of Biochemistry",
    "Institute of Physics",
    "Institute of Chemistry Ceylon",
    "Institute of Builders",
    "Institute of National Engineering Research and Development Centre",
    "Institute of Industrial Technology",
    "Institute of Arthur C. Clarke Institute for Modern Technologies",
    "Institute of Fundamental Studies",
    "Institute of Policy Studies",
    "Institute of Bandaranaike Centre for International Studies",
    "Institute of Sri Lanka Foundation Institute",
    "Institute of Human Resource Advancement",
    "Institute of National Institute of Business Management",
    "Institute of Advanced Technological Education",
    "Institute of Vocational Technology",
    "Institute of Sri Lanka Technological Campus",
    "Institute of Technology, University of Moratuwa",
    "Institute of Colombo International Nautical and Engineering College",
    "Institute of British School of Commerce",
    "Institute of ESOFT Metro Campus",
    "Institute of CINEC Campus",
    "Institute of ICBT Campus",
    "Institute of Sri Lanka Institute of Information Technology",
    "Institute of NSBM Green University",
    "Other"
  ];

  const degreePrograms = [
    "Computer Science", "Software Engineering", "Information Technology", "Computer Engineering",
    "Data Science", "Artificial Intelligence", "Machine Learning", "Cybersecurity",
    "Business Administration", "Business Management", "Finance", "Accounting", "Economics",
    "Marketing", "Digital Marketing", "Human Resource Management", "Project Management",
    "Design", "Graphic Design", "UI/UX Design", "Interior Design", "Fashion Design",
    "Architecture", "Civil Engineering", "Mechanical Engineering", "Electrical Engineering",
    "Chemical Engineering", "Biomedical Engineering", "Environmental Engineering",
    "Medicine", "Nursing", "Pharmacy", "Psychology", "Sociology", "Education",
    "Law", "Journalism", "Media Studies", "Film Studies", "Music", "Arts",
    "Agriculture", "Veterinary Science", "Food Science", "Nutrition",
    "Other"
  ];

  const projectCategories = [
    "Web Development", "Mobile Development", "Graphic Design", "Content Writing", 
    "Digital Marketing", "Data Analysis", "AI/ML", "Cybersecurity", "UI/UX Design",
    "Video Editing", "Animation", "3D Modeling", "Game Development", "Software Development",
    "Database Design", "Cloud Computing", "DevOps", "Blockchain Development",
    "Machine Learning", "Data Science", "Business Analysis", "Project Management",
    "Market Research", "SEO/SEM", "Social Media Management", "Email Marketing",
    "Copywriting", "Technical Writing", "Translation", "Voice Over", "Photography",
    "Illustration", "Logo Design", "Branding", "Print Design", "Architecture",
    "Interior Design", "Landscape Design", "Engineering Design", "CAD Modeling",
    "Financial Analysis", "Accounting", "Legal Services", "Consulting",
    "Training & Education", "Research", "Data Entry", "Virtual Assistant",
    "Other"
  ];

  const staffRoles = [
    "Professor", "Associate Professor", "Assistant Professor", "Lecturer", "Senior Lecturer",
    "Research Assistant", "Research Associate", "Research Fellow", "Postdoctoral Researcher",
    "Department Head", "Department Chair", "Program Director", "Course Coordinator",
    "Career Counselor", "Student Advisor", "Academic Advisor", "Student Services Officer",
    "Registrar", "Dean", "Associate Dean", "Vice Chancellor", "Chancellor",
    "Librarian", "IT Administrator", "HR Manager", "Finance Manager",
    "Marketing Manager", "Communications Officer", "International Relations Officer",
    "Quality Assurance Officer", "Accreditation Officer", "Compliance Officer",
    "Student Affairs Officer", "Housing Officer", "Transportation Officer",
    "Security Officer", "Facilities Manager", "Maintenance Supervisor",
    "Laboratory Manager", "Laboratory Technician", "Research Coordinator",
    "Grant Manager", "Project Manager", "Data Analyst", "Administrative Assistant",
    "Receptionist", "Secretary", "Coordinator", "Manager", "Director",
    "Other"
  ];

  const availableSkills = [
    // Programming Languages
    "React", "Node.js", "Python", "JavaScript", "TypeScript", "Java", "C++", "C#",
    "PHP", "Ruby", "Go", "Swift", "Kotlin", "Rust", "Scala", "Perl", "R", "MATLAB",
    "Dart", "Objective-C", "Shell Scripting", "PowerShell", "Lua", "Haskell",

    // Mobile Development
    "Flutter", "React Native", "Ionic", "Xamarin", "Cordova", "Native Android",
    "Native iOS", "SwiftUI", "Jetpack Compose", "Expo",

    // Web Frameworks & Libraries
    "Vue.js", "Angular", "Svelte", "Next.js", "Nuxt.js", "Gatsby", "Express.js",
    "Laravel", "Django", "Flask", "FastAPI", "Spring Boot", "ASP.NET", "Ruby on Rails",
    "Symfony", "CodeIgniter", "CakePHP", "Ember.js", "Backbone.js", "jQuery",

    // Databases
    "MongoDB", "PostgreSQL", "MySQL", "Redis", "Cassandra", "DynamoDB", "Firebase",
    "SQLite", "Oracle", "SQL Server", "MariaDB", "Elasticsearch", "CouchDB",
    "Neo4j", "InfluxDB", "TimescaleDB",

    // APIs & Protocols
    "GraphQL", "REST API", "SOAP", "WebSocket", "gRPC", "JSON-RPC", "OAuth",
    "JWT", "OpenAPI", "Swagger", "Postman", "Insomnia",

    // DevOps & Cloud
    "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud", "Heroku", "Vercel",
    "Netlify", "DigitalOcean", "Linode", "Jenkins", "GitLab CI", "GitHub Actions",
    "CircleCI", "Travis CI", "Terraform", "Ansible", "Puppet", "Chef",

    // Version Control & Tools
    "Git", "GitHub", "GitLab", "Bitbucket", "SVN", "Mercurial", "VS Code",
    "IntelliJ IDEA", "Eclipse", "Xcode", "Android Studio", "Vim", "Emacs",

    // Data Science & ML
    "Machine Learning", "Deep Learning", "AI", "Data Analysis", "Data Visualization",
    "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "Keras", "Jupyter",
    "Tableau", "Power BI", "Looker", "Apache Spark", "Hadoop", "Kafka",

    // Design & Creative
    "UI/UX Design", "Figma", "Adobe XD", "Sketch", "InVision", "Photoshop",
    "Illustrator", "InDesign", "After Effects", "Premiere Pro", "Lightroom",
    "Blender", "Maya", "Cinema 4D", "3ds Max", "ZBrush", "Substance Painter",

    // Marketing & Content
    "Content Writing", "Copywriting", "SEO", "SEM", "Digital Marketing",
    "Social Media Marketing", "Email Marketing", "Content Strategy", "Brand Strategy",
    "Google Analytics", "Google Ads", "Facebook Ads", "Instagram Marketing",
    "LinkedIn Marketing", "TikTok Marketing", "Influencer Marketing",

    // Business & Management
    "Project Management", "Agile", "Scrum", "Kanban", "Lean", "Six Sigma",
    "Business Analysis", "Requirements Gathering", "Stakeholder Management",
    "Risk Management", "Quality Assurance", "Testing", "Manual Testing",
    "Automated Testing", "Selenium", "Cypress", "Jest", "Mocha",

    // Cybersecurity
    "Cybersecurity", "Ethical Hacking", "Penetration Testing", "Network Security",
    "Web Security", "Cryptography", "Blockchain", "Smart Contracts", "Solidity",
    "Web3", "DeFi", "NFT", "Metaverse Development",

    // Soft Skills
    "Communication", "Leadership", "Team Management", "Problem Solving",
    "Critical Thinking", "Time Management", "Adaptability", "Creativity",
    "Emotional Intelligence", "Conflict Resolution", "Negotiation",

    // Industry Specific
    "Healthcare IT", "FinTech", "EdTech", "E-commerce", "SaaS", "IoT",
    "AR/VR", "Game Development", "Mobile Gaming", "Unity", "Unreal Engine",
    "Godot", "Game Design", "Level Design", "Sound Design",

    // Emerging Technologies
    "Quantum Computing", "Edge Computing", "Serverless", "Microservices",
    "Progressive Web Apps", "Jamstack", "Headless CMS", "Low-Code Development",
    "No-Code Development", "API Design", "System Architecture", "Scalability"
  ];

  // Filtered arrays based on search
  const filteredUniversities = universities.filter(uni => 
    uni.toLowerCase().includes(universitySearch.toLowerCase())
  );
  
  const filteredSkills = availableSkills.filter(skill => 
    skill.toLowerCase().includes(skillSearch.toLowerCase())
  );

  // Password strength checker
  const getPasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score += 1;
    else feedback.push("At least 8 characters");

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("Lowercase letter");

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push("Uppercase letter");

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push("Number");

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push("Special character");

    if (score <= 2) return { strength: "Weak", color: "red", score, feedback };
    if (score <= 3) return { strength: "Fair", color: "yellow", score, feedback };
    if (score <= 4) return { strength: "Good", color: "blue", score, feedback };
    return { strength: "Strong", color: "green", score, feedback };
  };

  // Phone number validation function
  const validatePhoneNumber = (phoneNumber) => {
    // Remove any non-digit characters except the +94 prefix
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    // Check if it starts with +94
    if (!cleanNumber.startsWith('+94')) {
      return { isValid: false, message: "Phone number must start with +94" };
    }
    
    // Check if it has exactly 9 digits after +94
    const digitsAfterPrefix = cleanNumber.substring(3);
    if (digitsAfterPrefix.length !== 9) {
      return { isValid: false, message: "Phone number must have exactly 9 digits after +94" };
    }
    
    // Check if all characters after +94 are digits
    if (!/^\d{9}$/.test(digitsAfterPrefix)) {
      return { isValid: false, message: "Only numbers are allowed after +94" };
    }
    
    return { isValid: true, message: "" };
  };

  // Format phone number with +94 prefix
  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // If it doesn't start with 94, add it
    if (!digitsOnly.startsWith('94')) {
      return `+94${digitsOnly}`;
    }
    
    // If it starts with 94, add the + prefix
    return `+${digitsOnly}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone number fields
    if (name === 'phoneNumber' || name === 'contactPhone') {
      const formattedValue = formatPhoneNumber(value);
      setFormData({
        ...formData,
        [name]: formattedValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  // Prevent suggestions on input fields
  const preventSuggestions = (e) => {
    e.target.setAttribute('autocomplete', 'off');
    e.target.setAttribute('autocorrect', 'off');
    e.target.setAttribute('autocapitalize', 'off');
    e.target.setAttribute('spellcheck', 'false');
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleUniversitySelect = (university) => {
    setFormData({ ...formData, university });
    setUniversitySearch(university);
    setShowUniversityDropdown(false);
  };



  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setSkillSearch("");
    setShowSkillDropdown(false);
  };

  const addCustomSkill = () => {
    if (skillSearch.trim() && !selectedSkills.includes(skillSearch.trim())) {
      setSelectedSkills([...selectedSkills, skillSearch.trim()]);
      setSkillSearch("");
      setShowSkillDropdown(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Common validations
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter, one uppercase letter, and one number";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = "First name can only contain letters and spaces";
    }
    
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = "Last name can only contain letters and spaces";
    }

    // Phone number validation for freelancer
    if (userType === "freelancer" && formData.phoneNumber) {
      const phoneValidation = validatePhoneNumber(formData.phoneNumber);
      if (!phoneValidation.isValid) {
        newErrors.phoneNumber = phoneValidation.message;
      }
    }

    // Phone number validation for client
    if (userType === "client" && formData.contactPhone) {
      const phoneValidation = validatePhoneNumber(formData.contactPhone);
      if (!phoneValidation.isValid) {
        newErrors.contactPhone = phoneValidation.message;
      }
    }

    // Address validation
    if (userType === "freelancer" && formData.address) {
      if (formData.address.length < 10) {
        newErrors.address = "Address must be at least 10 characters";
      }
    }

    // Organization validation for client
    if (userType === "client") {
      if (!formData.organization) {
        newErrors.organization = "Organization is required";
      } else if (formData.organization.length < 2) {
        newErrors.organization = "Organization name must be at least 2 characters";
      }
      
      if (!formData.contactPhone) {
        newErrors.contactPhone = "Contact phone is required";
      } else {
        const phoneValidation = validatePhoneNumber(formData.contactPhone);
        if (!phoneValidation.isValid) {
          newErrors.contactPhone = phoneValidation.message;
        }
      }
    }

    // University Staff validations
    if (userType === "universityStaff") {
      if (!formData.staffRole) {
        newErrors.staffRole = "Staff role is required";
      }
      
      if (!formData.department) {
        newErrors.department = "Department is required";
      } else if (formData.department.length < 2) {
        newErrors.department = "Department must be at least 2 characters";
      }
      
      if (!formData.employeeId) {
        newErrors.employeeId = "Employee ID is required";
      } else if (formData.employeeId.length < 3) {
        newErrors.employeeId = "Employee ID must be at least 3 characters";
      }
    }

    // Website validation
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = "Website must start with http:// or https://";
    }

    // Job title validation
    if (formData.jobTitle && formData.jobTitle.length < 2) {
      newErrors.jobTitle = "Job title must be at least 2 characters";
    }

    // Company description validation
    if (formData.companyDescription && formData.companyDescription.length < 20) {
      newErrors.companyDescription = "Company description must be at least 20 characters";
    }

    // Professional summary validation
    if (formData.professionalSummary && formData.professionalSummary.length < 20) {
      newErrors.professionalSummary = "Professional summary must be at least 20 characters";
    }
    
    if (!acceptedTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Prepare data for backend API
      const signupData = {
        ...formData,
        userType,
        technicalSkills: selectedSkills,
        agreeToTerms: acceptedTerms,
        agreeToMarketing: formData.agreeToMarketing || false
      };

      // Remove confirmPassword as it's not needed by backend
      delete signupData.confirmPassword;

      // Make API call to backend
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData)
      });

      const result = await response.json();

              if (result.success) {
        // Store user data and token
        localStorage.setItem('userData', JSON.stringify(result.data));
        localStorage.setItem('userToken', result.data.token);
          
          // Show success message
        setVerificationSent(true);
        
        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
          } else {
        // Handle validation errors
        if (result.message) {
          alert(`Registration failed: ${result.message}`);
        } else {
          alert('Registration failed. Please try again.');
        }
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

    const renderStudentFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber || ""}
            onChange={handleChange}
            onFocus={preventSuggestions}
            placeholder="+94 71 123 4567"
            maxLength={13}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Format: +94 followed by 9 digits</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            onFocus={preventSuggestions}
            placeholder="Enter your full address"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Technical Skills
        </label>
        <div className="border border-gray-300 rounded-lg p-4 focus-within:ring-2 focus-within:ring-yellow-400" ref={skillDropdownRef}>
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedSkills.map(skill => (
              <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2">
                {skill}
                <button
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Skill Search Input */}
          <div className="relative mb-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={skillSearch}
                onChange={(e) => {
                  setSkillSearch(e.target.value);
                  setShowSkillDropdown(true);
                }}
                onFocus={() => setShowSkillDropdown(true)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                placeholder="Search skills..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                disabled={!skillSearch.trim()}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            {showSkillDropdown && skillSearch && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredSkills.length > 0 ? (
                  filteredSkills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillSelect(skill)}
                      className="w-full text-left px-3 py-2 hover:bg-yellow-50 focus:bg-yellow-50 focus:outline-none"
                    >
                      {skill}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-500">
                    No skills found. You can type a custom skill.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
            {availableSkills.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillToggle(skill)}
                className={`px-2 py-1 text-xs rounded border transition-colors ${
                  selectedSkills.includes(skill)
                    ? 'bg-yellow-500 text-white border-yellow-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-yellow-400 hover:bg-yellow-50'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
          
  const renderJobSeekerFields = () => (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization *
                    </label>
                    <input
                      type="text"
            name="organization"
            value={formData.organization}
                      onChange={handleChange}
                      onFocus={preventSuggestions}
            placeholder="Company or organization name"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.organization ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.organization && (
            <p className="text-red-500 text-sm mt-1">{errors.organization}</p>
                    )}
                  </div>
        
                  <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title
                    </label>
                    <input
                      type="text"
            name="jobTitle"
            value={formData.jobTitle}
                      onChange={handleChange}
                      onFocus={preventSuggestions}
            placeholder="e.g., Project Manager, CEO"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.jobTitle ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.jobTitle && (
            <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>
                  )}
                  </div>
                </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Phone *
                  </label>
                  <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
                    onChange={handleChange}
                    onFocus={preventSuggestions}
            placeholder="+94 71 123 4567"
            maxLength={13}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.contactPhone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.contactPhone && (
            <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
                  )}
          <p className="text-xs text-gray-500 mt-1">Format: +94 followed by 9 digits</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  <select
                    name="companySize"
                    value={formData.companySize || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">Select Company Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
      </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry
                    </label>
                    <select
            name="industry"
            value={formData.industry || ""}
                      onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Select Industry</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail">Retail</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Media">Media</option>
            <option value="Transportation">Transportation</option>
            <option value="Energy">Energy</option>
            <option value="Consulting">Consulting</option>
            <option value="Non-Profit">Non-Profit</option>
            <option value="Government">Government</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
                    </label>
                      <input
            type="url"
            name="website"
            value={formData.website || ""}
                        onChange={handleChange}
                        onFocus={preventSuggestions}
            placeholder="https://www.company.com"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.website ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.website && (
            <p className="text-red-500 text-sm mt-1">{errors.website}</p>
                  )}
                  </div>
                </div>

                <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Description
                  </label>
        <textarea
          name="companyDescription"
          value={formData.companyDescription || ""}
                      onChange={handleChange}
                      onFocus={preventSuggestions}
          placeholder="Describe your company, its mission, and what you do..."
          rows="3"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
            errors.companyDescription ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        {errors.companyDescription && (
          <p className="text-red-500 text-sm mt-1">{errors.companyDescription}</p>
        )}
      </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Skills
                    </label>
                    <div className="border border-gray-300 rounded-lg p-4 focus-within:ring-2 focus-within:ring-yellow-400">
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedSkills.map(skill => (
              <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2">
                {skill}
                <button
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                        {availableSkills.map(skill => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => handleSkillToggle(skill)}
                            className={`px-2 py-1 text-xs rounded border transition-colors ${
                              selectedSkills.includes(skill)
                                ? 'bg-green-500 text-white border-green-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:bg-green-50'
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                        </div>
                        </div>
                      </div>
    </>
  );

  const renderUniversityStaffFields = () => (
    <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Staff Role *
                    </label>
                    <select
            name="staffRole"
            value={formData.staffRole}
                      onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.staffRole ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Role</option>
            {staffRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
                    </select>
          {errors.staffRole && (
            <p className="text-red-500 text-sm mt-1">{errors.staffRole}</p>
                  )}
                </div>

                <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department *
                  </label>
                    <input
            type="text"
            name="department"
            value={formData.department}
                      onChange={handleChange}
                      onFocus={preventSuggestions}
            placeholder="e.g., Computer Science"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.department ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.department && (
            <p className="text-red-500 text-sm mt-1">{errors.department}</p>
          )}
                  </div>
                </div>

                <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Employee ID *
                  </label>
                    <input
          type="text"
          name="employeeId"
          value={formData.employeeId}
                      onChange={handleChange}
                      onFocus={preventSuggestions}
          placeholder="e.g., EMP12345"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
            errors.employeeId ? 'border-red-500' : 'border-gray-300'
          }`}
        />
                {errors.employeeId && (
          <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <select
                      name="experience"
                      value={formData.experience || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="">Select Experience</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10-15">10-15 years</option>
                      <option value="15+">15+ years</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Highest Qualification
                  </label>
                    <select
                      name="qualification"
                      value={formData.qualification || ""}
                        onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="">Select Qualification</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="PhD">PhD</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Certificate">Certificate</option>
                      <option value="Other">Other</option>
                    </select>
                        </div>
                        </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Summary
                  </label>
                  <textarea
                    name="professionalSummary"
                    value={formData.professionalSummary || ""}
                        onChange={handleChange}
                        onFocus={preventSuggestions}
                    placeholder="Describe your professional background, expertise, and responsibilities..."
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                      errors.professionalSummary ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.professionalSummary && (
                    <p className="text-red-500 text-sm mt-1">{errors.professionalSummary}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Areas of Expertise
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 focus-within:ring-2 focus-within:ring-yellow-400">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedSkills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2">
                        {skill}
                        <button 
                          type="button" 
                            onClick={() => handleSkillToggle(skill)}
                            className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                      {availableSkills.map(skill => (
                          <button
                            key={skill}
                            type="button"
                          onClick={() => handleSkillToggle(skill)}
                          className={`px-2 py-1 text-xs rounded border transition-colors ${
                            selectedSkills.includes(skill)
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                        >
                          {skill}
                          </button>
                      ))}
                      </div>
                  </div>
                </div>
              </>
  );

  const renderClientFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization *
          </label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            onFocus={preventSuggestions}
            placeholder="Company or organization name"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.organization ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.organization && (
            <p className="text-red-500 text-sm mt-1">{errors.organization}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title
          </label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            onFocus={preventSuggestions}
            placeholder="e.g., Project Manager, CEO"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.jobTitle ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.jobTitle && (
            <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Phone *
          </label>
          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            onFocus={preventSuggestions}
            placeholder="+94 71 123 4567"
            maxLength={13}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.contactPhone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.contactPhone && (
            <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Format: +94 followed by 9 digits</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Size
          </label>
          <select
            name="companySize"
            value={formData.companySize || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Select Company Size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501-1000">501-1000 employees</option>
            <option value="1000+">1000+ employees</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry
          </label>
          <select
            name="industry"
            value={formData.industry || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Select Industry</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail">Retail</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Media">Media</option>
            <option value="Transportation">Transportation</option>
            <option value="Energy">Energy</option>
            <option value="Consulting">Consulting</option>
            <option value="Non-Profit">Non-Profit</option>
            <option value="Government">Government</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            name="website"
            value={formData.website || ""}
            onChange={handleChange}
            onFocus={preventSuggestions}
            placeholder="https://www.company.com"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.website ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.website && (
            <p className="text-red-500 text-sm mt-1">{errors.website}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Description
        </label>
        <textarea
          name="companyDescription"
          value={formData.companyDescription || ""}
          onChange={handleChange}
          onFocus={preventSuggestions}
          placeholder="Describe your company, its mission, and what you do..."
          rows="3"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
            errors.companyDescription ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.companyDescription && (
          <p className="text-red-500 text-sm mt-1">{errors.companyDescription}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Skills
        </label>
        <div className="border border-gray-300 rounded-lg p-4 focus-within:ring-2 focus-within:ring-yellow-400">
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedSkills.map(skill => (
              <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2">
                {skill}
                <button
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
            {availableSkills.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillToggle(skill)}
                className={`px-2 py-1 text-xs rounded border transition-colors ${
                  selectedSkills.includes(skill)
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:bg-green-50'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  if (verificationSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Moving Circles */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-400/20 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-500/20 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-emerald-400/20 rounded-full animate-pulse delay-1500"></div>
          
          {/* Tech Icons */}
          <div className="absolute top-32 left-20 text-blue-400/30 text-2xl">⚛️</div>
          <div className="absolute top-48 right-32 text-cyan-400/30 text-2xl">💻</div>
          <div className="absolute bottom-32 left-32 text-purple-400/30 text-2xl">🚀</div>
          <div className="absolute bottom-48 right-16 text-emerald-400/30 text-2xl">⚡</div>
          
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        </div>
        <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-blue-200/50">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
                        </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-gray-600">
              We've sent a verification link to <strong>{formData.email}</strong>
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Please click the link in your email to verify your account and complete registration.
            </p>
                        </div>
                      </div>
                  </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-25 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-full animate-bounce delay-2000"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-gradient-to-br from-orange-400/30 to-yellow-400/30 rounded-full animate-bounce delay-1500"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-32 left-20 text-blue-500/40 text-3xl animate-pulse">⚛️</div>
        <div className="absolute top-48 right-32 text-purple-500/40 text-3xl animate-pulse delay-500">💻</div>
        <div className="absolute bottom-32 left-32 text-green-500/40 text-3xl animate-pulse delay-1000">🚀</div>
        <div className="absolute bottom-48 right-16 text-orange-500/40 text-3xl animate-pulse delay-1500">⚡</div>
        
        {/* Subtle Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.1)_1px,transparent_0)] bg-[size:20px_20px]"></div>
      </div>
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-2">
            Join FlexiHire
          </h2>
          <p className="text-gray-700">Create your account and start your freelancing journey</p>
                </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-indigo-200/50">
          {/* User Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Account Type *
                  </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { value: "freelancer", label: "Freelancer", icon: "🎓" },
                { value: "client", label: "Client", icon: "💼" },
                { value: "universityStaff", label: "Staff", icon: "👨‍🏫" }
              ].map(type => (
                          <button
                  key={type.value}
                            type="button"
                  onClick={() => setUserType(type.value)}
                  className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${
                    userType === type.value
                      ? 'border-yellow-500 bg-yellow-50 text-black'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="text-sm font-medium">{type.label}</div>
                          </button>
              ))}
                  </div>
                </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                  </label>
                    <input
                      type="text"
                  name="firstName"
                  value={formData.firstName}
                    onChange={handleChange}
                    onFocus={preventSuggestions}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
                </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                    <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                      onChange={handleChange}
                      onFocus={preventSuggestions}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                  </div>

                <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
                  </label>
                    <input
                type="email"
                name="email"
                value={formData.email}
                      onChange={handleChange}
                      onFocus={preventSuggestions}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
                </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                    name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={preventSuggestions}
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Create password"
                    />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7" />
                        </svg>
                      )}
                  </button>
                  </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-600">Strength:</span>
                      <span className={`text-xs font-medium text-${getPasswordStrength(formData.password).color}-600`}>
                        {getPasswordStrength(formData.password).strength}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                        className={`h-2 rounded-full transition-all duration-300 bg-${getPasswordStrength(formData.password).color}-500`}
                        style={{ width: `${(getPasswordStrength(formData.password).score / 5) * 100}%` }}
                          ></div>
                        </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {getPasswordStrength(formData.password).feedback.map((item, index) => (
                        <span key={index} className="inline-block mr-2">• {item}</span>
                      ))}
                      </div>
                        </div>
                )}
                
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onFocus={preventSuggestions}
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm password"
                    />
                  <button
                      type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7" />
                        </svg>
                      )}
                  </button>
                </div>
                  {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
                </div>

            {/* User Type Specific Fields */}
                          {userType === "freelancer" && renderStudentFields()}
              {userType === "client" && renderClientFields()}
              {userType === "universityStaff" && renderUniversityStaffFields()}

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
                      <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
              />
              <div className="text-sm">
                <label htmlFor="terms" className="text-gray-700">
                  I agree to the{" "}
                        <button 
                          type="button" 
                    className="text-yellow-600 hover:text-yellow-700 font-medium underline"
                    onClick={() => window.open('/terms', '_blank')}
                  >
                    Terms and Conditions
                        </button>
                  {" "}and{" "}
                          <button
                            type="button"
                    className="text-yellow-600 hover:text-yellow-700 font-medium underline"
                    onClick={() => window.open('/privacy', '_blank')}
                  >
                    Privacy Policy
                          </button>
                  </label>
                {errors.terms && (
                  <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
                )}
                </div>
        </div>

                  <button
                    type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
              {isLoading ? "Creating Account..." : "Create Account"}
                  </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
            Already have an account?{" "}
              <button
                onClick={() => navigate('/signin')}
                className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors duration-300"
              >
                Sign in here
              </button>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
