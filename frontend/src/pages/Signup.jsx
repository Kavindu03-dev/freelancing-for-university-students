import React, { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    phoneNumber: "",
    userType: "client", // client or freelancer
    skills: [],
    bio: "",
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    level: '',
    color: '',
    message: ''
  });

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const calculatePasswordStrength = (password) => {
    if (!password) {
      return {
        score: 0,
        level: '',
        color: '',
        message: ''
      };
    }

    let score = 0;
    let feedback = [];

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }

    // Length bonus
    if (password.length >= 12) {
      score += 1;
    }

    // Complexity bonus (no consecutive characters, no repeated characters)
    if (!/(.)\1{2,}/.test(password) && !/(.)(.)\1\2/.test(password)) {
      score += 1;
    }

    // Determine level and color
    let level, color, message;
    
    if (score <= 2) {
      level = 'Very Weak';
      color = 'red';
      message = 'Password is very weak';
    } else if (score <= 3) {
      level = 'Weak';
      color = 'orange';
      message = 'Password is weak';
    } else if (score <= 4) {
      level = 'Fair';
      color = 'yellow';
      message = 'Password is fair';
    } else if (score <= 5) {
      level = 'Good';
      color = 'lightgreen';
      message = 'Password is good';
    } else if (score <= 6) {
      level = 'Strong';
      color = 'green';
      message = 'Password is strong';
    } else {
      level = 'Very Strong';
      color = 'darkgreen';
      message = 'Password is very strong';
    }

    return {
      score,
      level,
      color,
      message,
      feedback: feedback.length > 0 ? feedback : []
    };
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number";
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  const validateName = (name, fieldName) => {
    if (!name) return `${fieldName} is required`;
    if (name.length < 2) return `${fieldName} must be at least 2 characters long`;
    if (!/^[a-zA-Z\s]+$/.test(name)) return `${fieldName} can only contain letters and spaces`;
    return "";
  };

  const validateSkills = (skills) => {
    if (!skills || skills.length === 0) return "Please add at least one skill";
    if (skills.length > 10) return "You can add maximum 10 skills";
    return "";
  };

  const validateBio = (bio) => {
    if (bio && bio.length > 500) return "Bio must be less than 500 characters";
    return "";
  };

  // Country-based phone validation
  const validatePhoneNumber = (phoneNumber, country) => {
    if (!phoneNumber) return "Phone number is required";
    
    // Remove all non-digit characters for validation
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Country-specific validation patterns (for remaining digits only)
    const phonePatterns = {
      "United States": /^\d{10}$/,
      "Canada": /^\d{10}$/,
      "United Kingdom": /^\d{10}$/,
      "Australia": /^\d{9}$/,
      "Germany": /^\d{10,11}$/,
      "France": /^\d{9}$/,
      "India": /^\d{10}$/,
      "China": /^\d{11}$/,
      "Japan": /^\d{9,10}$/,
      "South Korea": /^\d{9,10}$/,
      "Brazil": /^\d{10,11}$/,
      "Mexico": /^\d{10}$/,
      "Spain": /^\d{9}$/,
      "Italy": /^\d{9,10}$/,
      "Netherlands": /^\d{9}$/,
      "Sweden": /^\d{9}$/,
      "Norway": /^\d{8}$/,
      "Denmark": /^\d{8}$/,
      "Finland": /^\d{9}$/,
      "Switzerland": /^\d{9}$/,
      "Austria": /^\d{10,11}$/,
      "Belgium": /^\d{9}$/,
      "Ireland": /^\d{9}$/,
      "New Zealand": /^\d{9}$/,
      "Singapore": /^\d{8}$/,
      "Malaysia": /^\d{9,10}$/,
      "Thailand": /^\d{9}$/,
      "Vietnam": /^\d{9,10}$/,
      "Philippines": /^\d{9,10}$/,
      "Indonesia": /^\d{9,11}$/,
      "Pakistan": /^\d{10}$/,
      "Bangladesh": /^\d{10}$/,
      "Sri Lanka": /^\d{9}$/,
      "Nepal": /^\d{10}$/,
      "Myanmar": /^\d{9,10}$/,
      "Cambodia": /^\d{8,9}$/,
      "Laos": /^\d{9,10}$/,
      "Mongolia": /^\d{8}$/,
      "Kazakhstan": /^\d{10}$/,
      "Uzbekistan": /^\d{9}$/,
      "Kyrgyzstan": /^\d{9}$/,
      "Tajikistan": /^\d{9}$/,
      "Turkmenistan": /^\d{8}$/,
      "Afghanistan": /^\d{9}$/,
      "Iran": /^\d{10}$/,
      "Iraq": /^\d{10}$/,
      "Syria": /^\d{9}$/,
      "Lebanon": /^\d{8}$/,
      "Jordan": /^\d{9}$/,
      "Israel": /^\d{9}$/,
      "Palestine": /^\d{9}$/,
      "Saudi Arabia": /^\d{9}$/,
      "Yemen": /^\d{9}$/,
      "Oman": /^\d{8}$/,
      "United Arab Emirates": /^\d{9}$/,
      "Qatar": /^\d{8}$/,
      "Kuwait": /^\d{8}$/,
      "Bahrain": /^\d{8}$/,
      "Egypt": /^\d{10}$/,
      "Libya": /^\d{9}$/,
      "Tunisia": /^\d{8}$/,
      "Algeria": /^\d{9}$/,
      "Morocco": /^\d{9}$/,
      "Sudan": /^\d{9}$/,
      "South Sudan": /^\d{9}$/,
      "Ethiopia": /^\d{9}$/,
      "Eritrea": /^\d{7}$/,
      "Djibouti": /^\d{8}$/,
      "Somalia": /^\d{8}$/,
      "Kenya": /^\d{9}$/,
      "Uganda": /^\d{9}$/,
      "Tanzania": /^\d{9}$/,
      "Rwanda": /^\d{9}$/,
      "Burundi": /^\d{8}$/,
      "Democratic Republic of the Congo": /^\d{9}$/,
      "Republic of the Congo": /^\d{9}$/,
      "Central African Republic": /^\d{8}$/,
      "Chad": /^\d{8}$/,
      "Cameroon": /^\d{9}$/,
      "Nigeria": /^\d{10}$/,
      "Niger": /^\d{8}$/,
      "Mali": /^\d{8}$/,
      "Burkina Faso": /^\d{8}$/,
      "Senegal": /^\d{9}$/,
      "Gambia": /^\d{7}$/,
      "Guinea-Bissau": /^\d{7}$/,
      "Guinea": /^\d{9}$/,
      "Sierra Leone": /^\d{8}$/,
      "Liberia": /^\d{8}$/,
      "Ivory Coast": /^\d{8}$/,
      "Ghana": /^\d{9}$/,
      "Togo": /^\d{8}$/,
      "Benin": /^\d{8}$/,
      "Equatorial Guinea": /^\d{9}$/,
      "Gabon": /^\d{8}$/,
      "São Tomé and Príncipe": /^\d{7}$/,
      "Angola": /^\d{9}$/,
      "Zambia": /^\d{9}$/,
      "Zimbabwe": /^\d{9}$/,
      "Botswana": /^\d{8}$/,
      "Namibia": /^\d{9}$/,
      "South Africa": /^\d{9}$/,
      "Lesotho": /^\d{8}$/,
      "Eswatini": /^\d{8}$/,
      "Madagascar": /^\d{9}$/,
      "Mauritius": /^\d{8}$/,
      "Seychelles": /^\d{7}$/,
      "Comoros": /^\d{7}$/,
      "Mayotte": /^\d{9}$/,
      "Réunion": /^\d{9}$/,
      "Russia": /^\d{10}$/,
      "Ukraine": /^\d{9}$/,
      "Belarus": /^\d{9}$/,
      "Poland": /^\d{9}$/,
      "Czech Republic": /^\d{9}$/,
      "Slovakia": /^\d{9}$/,
      "Hungary": /^\d{9}$/,
      "Romania": /^\d{9}$/,
      "Bulgaria": /^\d{9}$/,
      "Serbia": /^\d{9}$/,
      "Croatia": /^\d{9}$/,
      "Slovenia": /^\d{8}$/,
      "Bosnia and Herzegovina": /^\d{8}$/,
      "Montenegro": /^\d{8}$/,
      "North Macedonia": /^\d{8}$/,
      "Albania": /^\d{9}$/,
      "Greece": /^\d{10}$/,
      "Cyprus": /^\d{8}$/,
      "Malta": /^\d{8}$/,
      "Estonia": /^\d{8}$/,
      "Latvia": /^\d{8}$/,
      "Lithuania": /^\d{8}$/,
      "Moldova": /^\d{8}$/,
      "Georgia": /^\d{9}$/,
      "Armenia": /^\d{8}$/,
      "Azerbaijan": /^\d{9}$/,
      "Turkey": /^\d{10}$/,
      "Other": /^\d{7,15}$/ // Generic pattern for other countries
    };

    if (!country) {
      return "Please select a country first";
    }

    const pattern = phonePatterns[country];
    if (!pattern) {
      // For countries not in the list, use generic validation
      if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        return "Phone number must be between 7 and 15 digits";
      }
      return "";
    }

    if (!pattern.test(cleanPhone)) {
      return `Please enter a valid phone number for ${country}`;
    }

    return "";
  };

  const validateCountry = (country) => {
    if (!country) return "Please select your country";
    return "";
  };

  // Helper function to get country code
  const getCountryCode = (country) => {
    const countryCodes = {
      "United States": "+1",
      "Canada": "+1",
      "United Kingdom": "+44",
      "Australia": "+61",
      "Germany": "+49",
      "France": "+33",
      "India": "+91",
      "China": "+86",
      "Japan": "+81",
      "South Korea": "+82",
      "Brazil": "+55",
      "Mexico": "+52",
      "Spain": "+34",
      "Italy": "+39",
      "Netherlands": "+31",
      "Sweden": "+46",
      "Norway": "+47",
      "Denmark": "+45",
      "Finland": "+358",
      "Switzerland": "+41",
      "Austria": "+43",
      "Belgium": "+32",
      "Ireland": "+353",
      "New Zealand": "+64",
      "Singapore": "+65",
      "Malaysia": "+60",
      "Thailand": "+66",
      "Vietnam": "+84",
      "Philippines": "+63",
      "Indonesia": "+62",
      "Pakistan": "+92",
      "Bangladesh": "+880",
      "Sri Lanka": "+94",
      "Nepal": "+977",
      "Myanmar": "+95",
      "Cambodia": "+855",
      "Laos": "+856",
      "Mongolia": "+976",
      "Kazakhstan": "+7",
      "Uzbekistan": "+998",
      "Kyrgyzstan": "+996",
      "Tajikistan": "+992",
      "Turkmenistan": "+993",
      "Afghanistan": "+93",
      "Iran": "+98",
      "Iraq": "+964",
      "Syria": "+963",
      "Lebanon": "+961",
      "Jordan": "+962",
      "Israel": "+972",
      "Palestine": "+970",
      "Saudi Arabia": "+966",
      "Yemen": "+967",
      "Oman": "+968",
      "United Arab Emirates": "+971",
      "Qatar": "+974",
      "Kuwait": "+965",
      "Bahrain": "+973",
      "Egypt": "+20",
      "Libya": "+218",
      "Tunisia": "+216",
      "Algeria": "+213",
      "Morocco": "+212",
      "Sudan": "+249",
      "South Sudan": "+211",
      "Ethiopia": "+251",
      "Eritrea": "+291",
      "Djibouti": "+253",
      "Somalia": "+252",
      "Kenya": "+254",
      "Uganda": "+256",
      "Tanzania": "+255",
      "Rwanda": "+250",
      "Burundi": "+257",
      "Democratic Republic of the Congo": "+243",
      "Republic of the Congo": "+242",
      "Central African Republic": "+236",
      "Chad": "+235",
      "Cameroon": "+237",
      "Nigeria": "+234",
      "Niger": "+227",
      "Mali": "+223",
      "Burkina Faso": "+226",
      "Senegal": "+221",
      "Gambia": "+220",
      "Guinea-Bissau": "+245",
      "Guinea": "+224",
      "Sierra Leone": "+232",
      "Liberia": "+231",
      "Ivory Coast": "+225",
      "Ghana": "+233",
      "Togo": "+228",
      "Benin": "+229",
      "Equatorial Guinea": "+240",
      "Gabon": "+241",
      "São Tomé and Príncipe": "+239",
      "Angola": "+244",
      "Zambia": "+260",
      "Zimbabwe": "+263",
      "Botswana": "+267",
      "Namibia": "+264",
      "South Africa": "+27",
      "Lesotho": "+266",
      "Eswatini": "+268",
      "Madagascar": "+261",
      "Mauritius": "+230",
      "Seychelles": "+248",
      "Comoros": "+269",
      "Mayotte": "+262",
      "Réunion": "+262",
      "Russia": "+7",
      "Ukraine": "+380",
      "Belarus": "+375",
      "Poland": "+48",
      "Czech Republic": "+420",
      "Slovakia": "+421",
      "Hungary": "+36",
      "Romania": "+40",
      "Bulgaria": "+359",
      "Serbia": "+381",
      "Croatia": "+385",
      "Slovenia": "+386",
      "Bosnia and Herzegovina": "+387",
      "Montenegro": "+382",
      "North Macedonia": "+389",
      "Albania": "+355",
      "Greece": "+30",
      "Cyprus": "+357",
      "Malta": "+356",
      "Estonia": "+372",
      "Latvia": "+371",
      "Lithuania": "+370",
      "Moldova": "+373",
      "Georgia": "+995",
      "Armenia": "+374",
      "Azerbaijan": "+994",
      "Turkey": "+90",
      "Other": "+"
    };
    return countryCodes[country] || "+";
  };

  // Helper function to get phone format for display
  const getPhoneFormat = (country) => {
    const countryCode = getCountryCode(country);
    const formats = {
      "United States": `${countryCode} (XXX) XXX-XXXX`,
      "Canada": `${countryCode} (XXX) XXX-XXXX`,
      "United Kingdom": `${countryCode} XXXX XXXXXX`,
      "Australia": `${countryCode} X XXX XXX XXX`,
      "Germany": `${countryCode} XXX XXXXXXX`,
      "France": `${countryCode} X XX XX XX XX`,
      "India": `${countryCode} XXXXX XXXXX`,
      "China": `${countryCode} XXX XXXX XXXX`,
      "Japan": `${countryCode} XX XXXX XXXX`,
      "South Korea": `${countryCode} XX XXXX XXXX`,
      "Brazil": `${countryCode} XX XXXXX XXXX`,
      "Mexico": `${countryCode} XXX XXX XXXX`,
      "Spain": `${countryCode} XXX XXX XXX`,
      "Italy": `${countryCode} XXX XXX XXXX`,
      "Netherlands": `${countryCode} X XXX XXXX`,
      "Sweden": `${countryCode} XX XXX XXXX`,
      "Norway": `${countryCode} XXX XX XXX`,
      "Denmark": `${countryCode} XX XX XX XX`,
      "Finland": `${countryCode} XX XXX XXXX`,
      "Switzerland": `${countryCode} XX XXX XXXX`,
      "Austria": `${countryCode} XXX XXX XXXX`,
      "Belgium": `${countryCode} X XXX XX XX`,
      "Ireland": `${countryCode} XX XXX XXXX`,
      "New Zealand": `${countryCode} XX XXX XXXX`,
      "Singapore": `${countryCode} XXXX XXXX`,
      "Malaysia": `${countryCode} XX XXX XXXX`,
      "Thailand": `${countryCode} X XXX XXXX`,
      "Vietnam": `${countryCode} XX XXX XXXX`,
      "Philippines": `${countryCode} XXX XXX XXXX`,
      "Indonesia": `${countryCode} XXX XXX XXXX`,
      "Pakistan": `${countryCode} XXX XXXXXXX`,
      "Bangladesh": `${countryCode} XXX XXX XXX`,
      "Sri Lanka": `${countryCode} XX XXX XXXX`,
      "Nepal": `${countryCode} XXX XXX XXXX`,
      "Myanmar": `${countryCode} XX XXX XXXX`,
      "Cambodia": `${countryCode} XX XXX XXX`,
      "Laos": `${countryCode} XX XXX XXXX`,
      "Mongolia": `${countryCode} XXXX XXXX`,
      "Kazakhstan": `${countryCode} XXX XXX XXXX`,
      "Uzbekistan": `${countryCode} XX XXX XXXX`,
      "Kyrgyzstan": `${countryCode} XXX XXX XXX`,
      "Tajikistan": `${countryCode} XXX XXX XXX`,
      "Turkmenistan": `${countryCode} XX XXX XX`,
      "Afghanistan": `${countryCode} XXX XXX XXX`,
      "Iran": `${countryCode} XXX XXX XXXX`,
      "Iraq": `${countryCode} XXX XXX XXXX`,
      "Syria": `${countryCode} XXX XXX XXX`,
      "Lebanon": `${countryCode} XX XXX XXX`,
      "Jordan": `${countryCode} XX XXX XXXX`,
      "Israel": `${countryCode} XX XXX XXXX`,
      "Palestine": `${countryCode} XX XXX XXXX`,
      "Saudi Arabia": `${countryCode} XXX XXX XXX`,
      "Yemen": `${countryCode} XXX XXX XXX`,
      "Oman": `${countryCode} XXXX XXXX`,
      "United Arab Emirates": `${countryCode} XX XXX XXXX`,
      "Qatar": `${countryCode} XXXX XXXX`,
      "Kuwait": `${countryCode} XXXX XXXX`,
      "Bahrain": `${countryCode} XXXX XXXX`,
      "Egypt": `${countryCode} XXX XXX XXXX`,
      "Libya": `${countryCode} XX XXX XXXX`,
      "Tunisia": `${countryCode} XX XXX XXX`,
      "Algeria": `${countryCode} XXX XXX XXX`,
      "Morocco": `${countryCode} XXX XXX XXX`,
      "Sudan": `${countryCode} XXX XXX XXX`,
      "South Sudan": `${countryCode} XXX XXX XXX`,
      "Ethiopia": `${countryCode} XXX XXX XXX`,
      "Eritrea": `${countryCode} XXX XXXX`,
      "Djibouti": `${countryCode} XX XXX XXX`,
      "Somalia": `${countryCode} XX XXX XXX`,
      "Kenya": `${countryCode} XXX XXX XXX`,
      "Uganda": `${countryCode} XXX XXX XXX`,
      "Tanzania": `${countryCode} XXX XXX XXX`,
      "Rwanda": `${countryCode} XXX XXX XXX`,
      "Burundi": `${countryCode} XX XXX XXX`,
      "Democratic Republic of the Congo": `${countryCode} XXX XXX XXX`,
      "Republic of the Congo": `${countryCode} XXX XXX XXX`,
      "Central African Republic": `${countryCode} XX XXX XXX`,
      "Chad": `${countryCode} XX XXX XXX`,
      "Cameroon": `${countryCode} XXX XXX XXX`,
      "Nigeria": `${countryCode} XXX XXX XXXX`,
      "Niger": `${countryCode} XX XXX XXX`,
      "Mali": `${countryCode} XX XXX XXX`,
      "Burkina Faso": `${countryCode} XX XXX XXX`,
      "Senegal": `${countryCode} XXX XXX XXX`,
      "Gambia": `${countryCode} XXX XXXX`,
      "Guinea-Bissau": `${countryCode} XXX XXXX`,
      "Guinea": `${countryCode} XXX XXX XXX`,
      "Sierra Leone": `${countryCode} XXX XXX XX`,
      "Liberia": `${countryCode} XXX XXX XX`,
      "Ivory Coast": `${countryCode} XXX XXX XX`,
      "Ghana": `${countryCode} XXX XXX XXX`,
      "Togo": `${countryCode} XX XXX XXX`,
      "Benin": `${countryCode} XX XXX XXX`,
      "Equatorial Guinea": `${countryCode} XXX XXX XXX`,
      "Gabon": `${countryCode} XX XXX XXX`,
      "São Tomé and Príncipe": `${countryCode} XXX XXXX`,
      "Angola": `${countryCode} XXX XXX XXX`,
      "Zambia": `${countryCode} XXX XXX XXX`,
      "Zimbabwe": `${countryCode} XXX XXX XXX`,
      "Botswana": `${countryCode} XX XXX XXX`,
      "Namibia": `${countryCode} XXX XXX XXX`,
      "South Africa": `${countryCode} XXX XXX XXXX`,
      "Lesotho": `${countryCode} XX XXX XXX`,
      "Eswatini": `${countryCode} XX XXX XXX`,
      "Madagascar": `${countryCode} XXX XXX XXX`,
      "Mauritius": `${countryCode} XXXX XXXX`,
      "Seychelles": `${countryCode} XXX XXXX`,
      "Comoros": `${countryCode} XXX XXXX`,
      "Mayotte": `${countryCode} XXX XXX XXX`,
      "Réunion": `${countryCode} XXX XXX XXX`,
      "Russia": `${countryCode} XXX XXX XXXX`,
      "Ukraine": `${countryCode} XX XXX XXXX`,
      "Belarus": `${countryCode} XX XXX XXXX`,
      "Poland": `${countryCode} XXX XXX XXX`,
      "Czech Republic": `${countryCode} XXX XXX XXX`,
      "Slovakia": `${countryCode} XXX XXX XXX`,
      "Hungary": `${countryCode} XX XXX XXXX`,
      "Romania": `${countryCode} XXX XXX XXX`,
      "Bulgaria": `${countryCode} XXX XXX XXX`,
      "Serbia": `${countryCode} XX XXX XXXX`,
      "Croatia": `${countryCode} XX XXX XXXX`,
      "Slovenia": `${countryCode} XX XXX XXX`,
      "Bosnia and Herzegovina": `${countryCode} XX XXX XXX`,
      "Montenegro": `${countryCode} XX XXX XXX`,
      "North Macedonia": `${countryCode} XX XXX XXX`,
      "Albania": `${countryCode} XXX XXX XXX`,
      "Greece": `${countryCode} XXX XXX XXXX`,
      "Cyprus": `${countryCode} XXXX XXXX`,
      "Malta": `${countryCode} XXXX XXXX`,
      "Estonia": `${countryCode} XXXX XXXX`,
      "Latvia": `${countryCode} XXXX XXXX`,
      "Lithuania": `${countryCode} XXXX XXXX`,
      "Moldova": `${countryCode} XXXX XXXX`,
      "Georgia": `${countryCode} XXX XXX XXX`,
      "Armenia": `${countryCode} XX XXX XXX`,
      "Azerbaijan": `${countryCode} XXX XXX XXX`,
      "Turkey": `${countryCode} XXX XXX XXXX`,
      "Other": "International format"
    };
    return formats[country] || "International format";
  };

  // Helper function to get max digits for a country
  const getMaxDigits = (country) => {
    const maxDigits = {
      "United States": 10,
      "Canada": 10,
      "United Kingdom": 10,
      "Australia": 9,
      "Germany": 11,
      "France": 9,
      "India": 10,
      "China": 11,
      "Japan": 10,
      "South Korea": 10,
      "Brazil": 11,
      "Mexico": 10,
      "Spain": 9,
      "Italy": 10,
      "Netherlands": 9,
      "Sweden": 9,
      "Norway": 8,
      "Denmark": 8,
      "Finland": 9,
      "Switzerland": 9,
      "Austria": 11,
      "Belgium": 9,
      "Ireland": 9,
      "New Zealand": 9,
      "Singapore": 8,
      "Malaysia": 10,
      "Thailand": 9,
      "Vietnam": 10,
      "Philippines": 10,
      "Indonesia": 11,
      "Pakistan": 10,
      "Bangladesh": 10,
      "Sri Lanka": 9,
      "Nepal": 10,
      "Myanmar": 10,
      "Cambodia": 9,
      "Laos": 10,
      "Mongolia": 8,
      "Kazakhstan": 10,
      "Uzbekistan": 9,
      "Kyrgyzstan": 9,
      "Tajikistan": 9,
      "Turkmenistan": 8,
      "Afghanistan": 9,
      "Iran": 10,
      "Iraq": 10,
      "Syria": 9,
      "Lebanon": 8,
      "Jordan": 9,
      "Israel": 9,
      "Palestine": 9,
      "Saudi Arabia": 9,
      "Yemen": 9,
      "Oman": 8,
      "United Arab Emirates": 9,
      "Qatar": 8,
      "Kuwait": 8,
      "Bahrain": 8,
      "Egypt": 10,
      "Libya": 9,
      "Tunisia": 8,
      "Algeria": 9,
      "Morocco": 9,
      "Sudan": 9,
      "South Sudan": 9,
      "Ethiopia": 9,
      "Eritrea": 7,
      "Djibouti": 8,
      "Somalia": 8,
      "Kenya": 9,
      "Uganda": 9,
      "Tanzania": 9,
      "Rwanda": 9,
      "Burundi": 8,
      "Democratic Republic of the Congo": 9,
      "Republic of the Congo": 9,
      "Central African Republic": 8,
      "Chad": 8,
      "Cameroon": 9,
      "Nigeria": 10,
      "Niger": 8,
      "Mali": 8,
      "Burkina Faso": 8,
      "Senegal": 9,
      "Gambia": 7,
      "Guinea-Bissau": 7,
      "Guinea": 9,
      "Sierra Leone": 8,
      "Liberia": 8,
      "Ivory Coast": 8,
      "Ghana": 9,
      "Togo": 8,
      "Benin": 8,
      "Equatorial Guinea": 9,
      "Gabon": 8,
      "São Tomé and Príncipe": 7,
      "Angola": 9,
      "Zambia": 9,
      "Zimbabwe": 9,
      "Botswana": 8,
      "Namibia": 9,
      "South Africa": 9,
      "Lesotho": 8,
      "Eswatini": 8,
      "Madagascar": 9,
      "Mauritius": 8,
      "Seychelles": 7,
      "Comoros": 7,
      "Mayotte": 9,
      "Réunion": 9,
      "Russia": 10,
      "Ukraine": 9,
      "Belarus": 9,
      "Poland": 9,
      "Czech Republic": 9,
      "Slovakia": 9,
      "Hungary": 9,
      "Romania": 9,
      "Bulgaria": 9,
      "Serbia": 9,
      "Croatia": 9,
      "Slovenia": 8,
      "Bosnia and Herzegovina": 8,
      "Montenegro": 8,
      "North Macedonia": 8,
      "Albania": 9,
      "Greece": 10,
      "Cyprus": 8,
      "Malta": 8,
      "Estonia": 8,
      "Latvia": 8,
      "Lithuania": 8,
      "Moldova": 8,
      "Georgia": 9,
      "Armenia": 8,
      "Azerbaijan": 9,
      "Turkey": 10,
      "Other": 15
    };
    return maxDigits[country] || 15;
  };

  const validateForm = () => {
    const newErrors = {};
    
    newErrors.firstName = validateName(formData.firstName, "First name");
    newErrors.lastName = validateName(formData.lastName, "Last name");
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword, formData.password);
    newErrors.country = validateCountry(formData.country);
    newErrors.phoneNumber = validatePhoneNumber(formData.phoneNumber, formData.country);
    newErrors.skills = validateSkills(formData.skills);
    newErrors.bio = validateBio(formData.bio);
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Special handling for phone number input
    if (name === 'phoneNumber') {
      // Only allow digits
      const digitsOnly = value.replace(/\D/g, '');
      
      // Get max digits for selected country
      const maxDigits = getMaxDigits(formData.country);
      
      // Limit to max digits
      const limitedDigits = digitsOnly.slice(0, maxDigits);
      
      setFormData(prev => ({
        ...prev,
        [name]: limitedDigits
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Calculate password strength when password field changes
    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError("");
    setErrors({});
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    if (!formData.agreeToTerms) {
      setError("You must agree to the terms of service");
      return;
    }
    
    setLoading(true);
    
    try {
      // Remove confirmPassword from data sent to backend
      const { confirmPassword, ...signupData } = formData;
      
      // Combine country code with phone number
      if (signupData.country && signupData.phoneNumber) {
        const countryCode = getCountryCode(signupData.country);
        signupData.phoneNumber = countryCode + signupData.phoneNumber;
      }
      
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
          localStorage.setItem('userToken', result.data.token);
          localStorage.setItem('userData', JSON.stringify(result.data));
          
          // Show success message
          alert('Registration successful! Redirecting...');
          
          // Redirect to appropriate page based on user type
          if (result.data.userType === 'client') {
            window.location.href = '/client-dashboard';
          } else {
            window.location.href = '/student/dashboard';
          }
        } else {
          setError(result.message || 'Registration failed');
        }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-2">
              FlexiHire
            </h1>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join FlexiHire</h2>
          <p className="text-gray-600">Create your account and start your journey</p>
          {localStorage.getItem('userToken') && (
            <div className="mt-4">
              <button
                onClick={() => {
                  localStorage.removeItem('userToken');
                  localStorage.removeItem('userData');
                  window.location.href = '/';
                }}
                className="text-red-600 hover:text-red-700 text-sm underline"
              >
                Logout from another session
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${step >= 1 ? 'text-yellow-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'bg-yellow-500 border-yellow-500 text-black' : 'border-gray-300'}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Account</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-yellow-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'bg-yellow-500 border-yellow-500 text-black' : 'border-gray-300'}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Profile</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-yellow-200">
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                      First name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 ${
                        errors.firstName 
                          ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                          : 'border-yellow-300 focus:ring-yellow-200 focus:border-yellow-500'
                      }`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 ${
                        errors.lastName 
                          ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                          : 'border-yellow-300 focus:ring-yellow-200 focus:border-yellow-500'
                      }`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 ${
                      errors.email 
                        ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                        : 'border-yellow-300 focus:ring-yellow-200 focus:border-yellow-500'
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Country and Phone Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 ${
                        errors.country 
                          ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                          : 'border-yellow-300 focus:ring-yellow-200 focus:border-yellow-500'
                      }`}
                    >
                      <option value="">Select your country</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="India">India</option>
                      <option value="China">China</option>
                      <option value="Japan">Japan</option>
                      <option value="South Korea">South Korea</option>
                      <option value="Brazil">Brazil</option>
                      <option value="Mexico">Mexico</option>
                      <option value="Spain">Spain</option>
                      <option value="Italy">Italy</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Sweden">Sweden</option>
                      <option value="Norway">Norway</option>
                      <option value="Denmark">Denmark</option>
                      <option value="Finland">Finland</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Austria">Austria</option>
                      <option value="Belgium">Belgium</option>
                      <option value="Ireland">Ireland</option>
                      <option value="New Zealand">New Zealand</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Thailand">Thailand</option>
                      <option value="Vietnam">Vietnam</option>
                      <option value="Philippines">Philippines</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="Sri Lanka">Sri Lanka</option>
                      <option value="Nepal">Nepal</option>
                      <option value="Myanmar">Myanmar</option>
                      <option value="Cambodia">Cambodia</option>
                      <option value="Laos">Laos</option>
                      <option value="Mongolia">Mongolia</option>
                      <option value="Kazakhstan">Kazakhstan</option>
                      <option value="Uzbekistan">Uzbekistan</option>
                      <option value="Kyrgyzstan">Kyrgyzstan</option>
                      <option value="Tajikistan">Tajikistan</option>
                      <option value="Turkmenistan">Turkmenistan</option>
                      <option value="Afghanistan">Afghanistan</option>
                      <option value="Iran">Iran</option>
                      <option value="Iraq">Iraq</option>
                      <option value="Syria">Syria</option>
                      <option value="Lebanon">Lebanon</option>
                      <option value="Jordan">Jordan</option>
                      <option value="Israel">Israel</option>
                      <option value="Palestine">Palestine</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="Yemen">Yemen</option>
                      <option value="Oman">Oman</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Qatar">Qatar</option>
                      <option value="Kuwait">Kuwait</option>
                      <option value="Bahrain">Bahrain</option>
                      <option value="Egypt">Egypt</option>
                      <option value="Libya">Libya</option>
                      <option value="Tunisia">Tunisia</option>
                      <option value="Algeria">Algeria</option>
                      <option value="Morocco">Morocco</option>
                      <option value="Sudan">Sudan</option>
                      <option value="South Sudan">South Sudan</option>
                      <option value="Ethiopia">Ethiopia</option>
                      <option value="Eritrea">Eritrea</option>
                      <option value="Djibouti">Djibouti</option>
                      <option value="Somalia">Somalia</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Tanzania">Tanzania</option>
                      <option value="Rwanda">Rwanda</option>
                      <option value="Burundi">Burundi</option>
                      <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
                      <option value="Republic of the Congo">Republic of the Congo</option>
                      <option value="Central African Republic">Central African Republic</option>
                      <option value="Chad">Chad</option>
                      <option value="Cameroon">Cameroon</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Niger">Niger</option>
                      <option value="Mali">Mali</option>
                      <option value="Burkina Faso">Burkina Faso</option>
                      <option value="Senegal">Senegal</option>
                      <option value="Gambia">Gambia</option>
                      <option value="Guinea-Bissau">Guinea-Bissau</option>
                      <option value="Guinea">Guinea</option>
                      <option value="Sierra Leone">Sierra Leone</option>
                      <option value="Liberia">Liberia</option>
                      <option value="Ivory Coast">Ivory Coast</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Togo">Togo</option>
                      <option value="Benin">Benin</option>
                      <option value="Equatorial Guinea">Equatorial Guinea</option>
                      <option value="Gabon">Gabon</option>
                      <option value="São Tomé and Príncipe">São Tomé and Príncipe</option>
                      <option value="Angola">Angola</option>
                      <option value="Zambia">Zambia</option>
                      <option value="Zimbabwe">Zimbabwe</option>
                      <option value="Botswana">Botswana</option>
                      <option value="Namibia">Namibia</option>
                      <option value="South Africa">South Africa</option>
                      <option value="Lesotho">Lesotho</option>
                      <option value="Eswatini">Eswatini</option>
                      <option value="Madagascar">Madagascar</option>
                      <option value="Mauritius">Mauritius</option>
                      <option value="Seychelles">Seychelles</option>
                      <option value="Comoros">Comoros</option>
                      <option value="Mayotte">Mayotte</option>
                      <option value="Réunion">Réunion</option>
                      <option value="Russia">Russia</option>
                      <option value="Ukraine">Ukraine</option>
                      <option value="Belarus">Belarus</option>
                      <option value="Poland">Poland</option>
                      <option value="Czech Republic">Czech Republic</option>
                      <option value="Slovakia">Slovakia</option>
                      <option value="Hungary">Hungary</option>
                      <option value="Romania">Romania</option>
                      <option value="Bulgaria">Bulgaria</option>
                      <option value="Serbia">Serbia</option>
                      <option value="Croatia">Croatia</option>
                      <option value="Slovenia">Slovenia</option>
                      <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                      <option value="Montenegro">Montenegro</option>
                      <option value="North Macedonia">North Macedonia</option>
                      <option value="Albania">Albania</option>
                      <option value="Greece">Greece</option>
                      <option value="Cyprus">Cyprus</option>
                      <option value="Malta">Malta</option>
                      <option value="Estonia">Estonia</option>
                      <option value="Latvia">Latvia</option>
                      <option value="Lithuania">Lithuania</option>
                      <option value="Moldova">Moldova</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Armenia">Armenia</option>
                      <option value="Azerbaijan">Azerbaijan</option>
                      <option value="Turkey">Turkey</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      {formData.country && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                          {getCountryCode(formData.country)}
                        </div>
                      )}
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        autoComplete="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        onKeyDown={(e) => {
                          // Allow: backspace, delete, tab, escape, enter, and navigation keys
                          if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode) ||
                              // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                              (e.keyCode === 65 && e.ctrlKey === true) ||
                              (e.keyCode === 67 && e.ctrlKey === true) ||
                              (e.keyCode === 86 && e.ctrlKey === true) ||
                              (e.keyCode === 88 && e.ctrlKey === true)) {
                            return;
                          }
                          // Allow only digits
                          if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
                            return;
                          }
                          e.preventDefault();
                        }}
                        maxLength={formData.country ? getMaxDigits(formData.country) : undefined}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 ${
                          errors.phoneNumber 
                            ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                            : 'border-yellow-300 focus:ring-yellow-200 focus:border-yellow-500'
                        } ${formData.country ? 'pl-12' : ''}`}
                        placeholder={formData.country ? `Enter ${getMaxDigits(formData.country)} digits` : "Select country first"}
                        disabled={!formData.country}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                    )}
                    {formData.country && !errors.phoneNumber && (
                      <div className="mt-1">
                        <p className="text-sm text-gray-500">
                          Format: {getPhoneFormat(formData.country)}
                        </p>
                        <div className="flex items-center mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${(formData.phoneNumber.length / getMaxDigits(formData.country)) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formData.phoneNumber.length}/{getMaxDigits(formData.country)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 ${
                        errors.password 
                          ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                          : 'border-yellow-300 focus:ring-yellow-200 focus:border-yellow-500'
                      }`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password ? (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  ) : formData.password ? (
                    <div className="mt-3 space-y-2">
                      {/* Password Strength Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Password Strength:</span>
                          <span 
                            className="text-sm font-semibold"
                            style={{ color: passwordStrength.color }}
                          >
                            {passwordStrength.level}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${(passwordStrength.score / 7) * 100}%`,
                              backgroundColor: passwordStrength.color
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600">{passwordStrength.message}</p>
                      </div>
                      
                      {/* Password Requirements */}
                      <div className="grid grid-cols-1 gap-1">
                        <div className={`flex items-center text-xs ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                          <svg className={`w-3 h-3 mr-1 ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          At least 8 characters
                        </div>
                        <div className={`flex items-center text-xs ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                          <svg className={`w-3 h-3 mr-1 ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          One lowercase letter
                        </div>
                        <div className={`flex items-center text-xs ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                          <svg className={`w-3 h-3 mr-1 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          One uppercase letter
                        </div>
                        <div className={`flex items-center text-xs ${/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                          <svg className={`w-3 h-3 mr-1 ${/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          One number
                        </div>
                        <div className={`flex items-center text-xs ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                          <svg className={`w-3 h-3 mr-1 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          One special character
                        </div>
                        <div className={`flex items-center text-xs ${formData.password.length >= 12 ? 'text-green-600' : 'text-gray-500'}`}>
                          <svg className={`w-3 h-3 mr-1 ${formData.password.length >= 12 ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          At least 12 characters (bonus)
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">Must be at least 8 characters with uppercase, lowercase, and number</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 ${
                        errors.confirmPassword 
                          ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                          : 'border-yellow-300 focus:ring-yellow-200 focus:border-yellow-500'
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black py-3 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Next Step
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    I want to join as a:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${formData.userType === 'client' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-300'}`}>
                      <input
                        type="radio"
                        name="userType"
                        value="client"
                        checked={formData.userType === 'client'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.userType === 'client' ? 'border-yellow-500' : 'border-gray-300'}`}>
                          {formData.userType === 'client' && <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-gray-900">Client</div>
                          <div className="text-sm text-gray-500">I want to hire freelancers</div>
                        </div>
                      </div>
                    </label>

                    <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${formData.userType === 'freelancer' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-300'}`}>
                      <input
                        type="radio"
                        name="userType"
                        value="freelancer"
                        checked={formData.userType === 'freelancer'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.userType === 'freelancer' ? 'border-yellow-500' : 'border-gray-300'}`}>
                          {formData.userType === 'freelancer' && <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-gray-900">Freelancer</div>
                          <div className="text-sm text-gray-500">I want to offer my services</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Skills Input */}
                <div>
                  <label htmlFor="skills" className="block text-sm font-semibold text-gray-700 mb-2">
                    Skills {formData.userType === 'freelancer' ? '(What services do you offer?)' : '(What skills are you looking for?)'}
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 border-2 border-yellow-300 rounded-xl min-h-[60px]">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="bg-yellow-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {skill}
                        <button 
                          type="button" 
                          onClick={() => {
                            const newSkills = formData.skills.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, skills: newSkills }));
                          }}
                          className="text-red-500 hover:text-red-700 font-bold text-lg leading-none"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder={formData.userType === 'freelancer' ? "Add a skill..." : "Add a skill..."}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          const newSkill = e.target.value.trim();
                          if (!formData.skills.includes(newSkill)) {
                            setFormData(prev => ({ 
                              ...prev, 
                              skills: [...prev.skills, newSkill] 
                            }));
                          }
                          e.target.value = '';
                        }
                      }}
                      className="flex-1 outline-none text-sm"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Press Enter to add each skill. Click the × to remove skills.
                  </p>
                  
                  {/* Quick Add Skills */}
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Quick add common skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.userType === 'freelancer' ? 
                        // Freelancer skills
                        ['JavaScript', 'React', 'Node.js', 'Python', 'Design', 'Writing', 'Marketing', 'Data Analysis'].map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => {
                              if (!formData.skills.includes(skill)) {
                                setFormData(prev => ({ 
                                  ...prev, 
                                  skills: [...prev.skills, skill] 
                                }));
                              }
                            }}
                            disabled={formData.skills.includes(skill)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                              formData.skills.includes(skill)
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                            }`}
                          >
                            + {skill}
                          </button>
                        ))
                        :
                        // Client skills
                        ['Web Development', 'Mobile App', 'Design', 'Content Writing', 'Marketing', 'Data Analysis', 'Consulting', 'Translation'].map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => {
                              if (!formData.skills.includes(skill)) {
                                setFormData(prev => ({ 
                                  ...prev, 
                                  skills: [...prev.skills, skill] 
                                }));
                              }
                            }}
                            disabled={formData.skills.includes(skill)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                              formData.skills.includes(skill)
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                            }`}
                          >
                            + {skill}
                          </button>
                        ))
                      }
                    </div>
                  </div>
                </div>

                {/* Bio Input */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio {formData.userType === 'freelancer' ? '(Tell clients about your experience)' : '(Tell freelancers about your project needs)'}
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="3"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300 resize-none"
                    placeholder={formData.userType === 'freelancer' ? "Describe your experience, expertise, and what services you offer..." : "Describe your project, company, or what you're looking for..."}
                    maxLength="500"
                  />
                  <p className={`mt-1 text-sm ${
                    formData.bio.length >= 450 ? 'text-orange-600' : 
                    formData.bio.length >= 500 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      required
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-yellow-300 rounded mt-1"
                    />
                    <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                      I agree to the{" "}
                      <a href="#" className="text-yellow-500 hover:text-yellow-400 font-medium">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-yellow-500 hover:text-yellow-400 font-medium">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <div className="flex items-start">
                    <input
                      id="agreeToMarketing"
                      name="agreeToMarketing"
                      type="checkbox"
                      checked={formData.agreeToMarketing}
                      onChange={handleChange}
                      className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-yellow-300 rounded mt-1"
                    />
                    <label htmlFor="agreeToMarketing" className="ml-2 block text-sm text-gray-700">
                      I agree to receive marketing communications from FlexiHire
                    </label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="text-gray-600 hover:text-gray-800 py-3 px-6 rounded-xl font-semibold transition-colors duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black py-3 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </>
            )}
          </form>

          
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/signin" className="font-semibold text-yellow-500 hover:text-yellow-400 transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
