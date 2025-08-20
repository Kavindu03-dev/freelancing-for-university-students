// Validation utility functions

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return "";
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters long";
  if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter";
  if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number";
  return "";
};

// Confirm password validation
export const validateConfirmPassword = (confirmPassword, password) => {
  if (!confirmPassword) return "Please confirm your password";
  if (confirmPassword !== password) return "Passwords do not match";
  return "";
};

// Name validation
export const validateName = (name, fieldName) => {
  if (!name) return `${fieldName} is required`;
  if (name.length < 2) return `${fieldName} must be at least 2 characters long`;
  if (!/^[a-zA-Z\s]+$/.test(name)) return `${fieldName} can only contain letters and spaces`;
  return "";
};

// Skills validation
export const validateSkills = (skills) => {
  if (!skills || skills.length === 0) return "Please add at least one skill";
  if (skills.length > 10) return "You can add maximum 10 skills";
  return "";
};

// Bio validation
export const validateBio = (bio) => {
  if (bio && bio.length > 500) return "Bio must be less than 500 characters";
  return "";
};

// Phone number validation
export const validatePhone = (phone) => {
  if (!phone) return "";
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) return "Please enter a valid phone number";
  return "";
};

// Country-based phone validation
export const validatePhoneByCountry = (phone, country) => {
  if (!phone) return "Phone number is required";
  
  // Remove all non-digit characters except + for validation
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Country-specific validation patterns
  const phonePatterns = {
    "United States": /^\+?1?\d{10}$/,
    "Canada": /^\+?1?\d{10}$/,
    "United Kingdom": /^\+?44\d{10}$/,
    "Australia": /^\+?61\d{9}$/,
    "Germany": /^\+?49\d{10,11}$/,
    "France": /^\+?33\d{9}$/,
    "India": /^\+?91\d{10}$/,
    "China": /^\+?86\d{11}$/,
    "Japan": /^\+?81\d{9,10}$/,
    "South Korea": /^\+?82\d{9,10}$/,
    "Brazil": /^\+?55\d{10,11}$/,
    "Mexico": /^\+?52\d{10}$/,
    "Spain": /^\+?34\d{9}$/,
    "Italy": /^\+?39\d{9,10}$/,
    "Netherlands": /^\+?31\d{9}$/,
    "Sweden": /^\+?46\d{9}$/,
    "Norway": /^\+?47\d{8}$/,
    "Denmark": /^\+?45\d{8}$/,
    "Finland": /^\+?358\d{9}$/,
    "Switzerland": /^\+?41\d{9}$/,
    "Austria": /^\+?43\d{10,11}$/,
    "Belgium": /^\+?32\d{9}$/,
    "Ireland": /^\+?353\d{9}$/,
    "New Zealand": /^\+?64\d{9}$/,
    "Singapore": /^\+?65\d{8}$/,
    "Malaysia": /^\+?60\d{9,10}$/,
    "Thailand": /^\+?66\d{9}$/,
    "Vietnam": /^\+?84\d{9,10}$/,
    "Philippines": /^\+?63\d{9,10}$/,
    "Indonesia": /^\+?62\d{9,11}$/,
    "Pakistan": /^\+?92\d{10}$/,
    "Bangladesh": /^\+?880\d{10}$/,
    "Sri Lanka": /^\+?94\d{9}$/,
    "Nepal": /^\+?977\d{10}$/,
    "Myanmar": /^\+?95\d{9,10}$/,
    "Cambodia": /^\+?855\d{8,9}$/,
    "Laos": /^\+?856\d{9,10}$/,
    "Mongolia": /^\+?976\d{8}$/,
    "Kazakhstan": /^\+?7\d{10}$/,
    "Uzbekistan": /^\+?998\d{9}$/,
    "Kyrgyzstan": /^\+?996\d{9}$/,
    "Tajikistan": /^\+?992\d{9}$/,
    "Turkmenistan": /^\+?993\d{8}$/,
    "Afghanistan": /^\+?93\d{9}$/,
    "Iran": /^\+?98\d{10}$/,
    "Iraq": /^\+?964\d{10}$/,
    "Syria": /^\+?963\d{9}$/,
    "Lebanon": /^\+?961\d{8}$/,
    "Jordan": /^\+?962\d{9}$/,
    "Israel": /^\+?972\d{9}$/,
    "Palestine": /^\+?970\d{9}$/,
    "Saudi Arabia": /^\+?966\d{9}$/,
    "Yemen": /^\+?967\d{9}$/,
    "Oman": /^\+?968\d{8}$/,
    "United Arab Emirates": /^\+?971\d{9}$/,
    "Qatar": /^\+?974\d{8}$/,
    "Kuwait": /^\+?965\d{8}$/,
    "Bahrain": /^\+?973\d{8}$/,
    "Egypt": /^\+?20\d{10}$/,
    "Libya": /^\+?218\d{9}$/,
    "Tunisia": /^\+?216\d{8}$/,
    "Algeria": /^\+?213\d{9}$/,
    "Morocco": /^\+?212\d{9}$/,
    "Sudan": /^\+?249\d{9}$/,
    "South Sudan": /^\+?211\d{9}$/,
    "Ethiopia": /^\+?251\d{9}$/,
    "Eritrea": /^\+?291\d{7}$/,
    "Djibouti": /^\+?253\d{8}$/,
    "Somalia": /^\+?252\d{8}$/,
    "Kenya": /^\+?254\d{9}$/,
    "Uganda": /^\+?256\d{9}$/,
    "Tanzania": /^\+?255\d{9}$/,
    "Rwanda": /^\+?250\d{9}$/,
    "Burundi": /^\+?257\d{8}$/,
    "Democratic Republic of the Congo": /^\+?243\d{9}$/,
    "Republic of the Congo": /^\+?242\d{9}$/,
    "Central African Republic": /^\+?236\d{8}$/,
    "Chad": /^\+?235\d{8}$/,
    "Cameroon": /^\+?237\d{9}$/,
    "Nigeria": /^\+?234\d{10}$/,
    "Niger": /^\+?227\d{8}$/,
    "Mali": /^\+?223\d{8}$/,
    "Burkina Faso": /^\+?226\d{8}$/,
    "Senegal": /^\+?221\d{9}$/,
    "Gambia": /^\+?220\d{7}$/,
    "Guinea-Bissau": /^\+?245\d{7}$/,
    "Guinea": /^\+?224\d{9}$/,
    "Sierra Leone": /^\+?232\d{8}$/,
    "Liberia": /^\+?231\d{8}$/,
    "Ivory Coast": /^\+?225\d{8}$/,
    "Ghana": /^\+?233\d{9}$/,
    "Togo": /^\+?228\d{8}$/,
    "Benin": /^\+?229\d{8}$/,
    "Equatorial Guinea": /^\+?240\d{9}$/,
    "Gabon": /^\+?241\d{8}$/,
    "São Tomé and Príncipe": /^\+?239\d{7}$/,
    "Angola": /^\+?244\d{9}$/,
    "Zambia": /^\+?260\d{9}$/,
    "Zimbabwe": /^\+?263\d{9}$/,
    "Botswana": /^\+?267\d{8}$/,
    "Namibia": /^\+?264\d{9}$/,
    "South Africa": /^\+?27\d{9}$/,
    "Lesotho": /^\+?266\d{8}$/,
    "Eswatini": /^\+?268\d{8}$/,
    "Madagascar": /^\+?261\d{9}$/,
    "Mauritius": /^\+?230\d{8}$/,
    "Seychelles": /^\+?248\d{7}$/,
    "Comoros": /^\+?269\d{7}$/,
    "Mayotte": /^\+?262\d{9}$/,
    "Réunion": /^\+?262\d{9}$/,
    "Russia": /^\+?7\d{10}$/,
    "Ukraine": /^\+?380\d{9}$/,
    "Belarus": /^\+?375\d{9}$/,
    "Poland": /^\+?48\d{9}$/,
    "Czech Republic": /^\+?420\d{9}$/,
    "Slovakia": /^\+?421\d{9}$/,
    "Hungary": /^\+?36\d{9}$/,
    "Romania": /^\+?40\d{9}$/,
    "Bulgaria": /^\+?359\d{9}$/,
    "Serbia": /^\+?381\d{9}$/,
    "Croatia": /^\+?385\d{9}$/,
    "Slovenia": /^\+?386\d{8}$/,
    "Bosnia and Herzegovina": /^\+?387\d{8}$/,
    "Montenegro": /^\+?382\d{8}$/,
    "North Macedonia": /^\+?389\d{8}$/,
    "Albania": /^\+?355\d{9}$/,
    "Greece": /^\+?30\d{10}$/,
    "Cyprus": /^\+?357\d{8}$/,
    "Malta": /^\+?356\d{8}$/,
    "Estonia": /^\+?372\d{8}$/,
    "Latvia": /^\+?371\d{8}$/,
    "Lithuania": /^\+?370\d{8}$/,
    "Moldova": /^\+?373\d{8}$/,
    "Georgia": /^\+?995\d{9}$/,
    "Armenia": /^\+?374\d{8}$/,
    "Azerbaijan": /^\+?994\d{9}$/,
    "Turkey": /^\+?90\d{10}$/,
    "Other": /^\+?\d{7,15}$/ // Generic pattern for other countries
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

// Country validation
export const validateCountry = (country) => {
  if (!country) return "Please select your country";
  return "";
};

// URL validation
export const validateUrl = (url) => {
  if (!url) return "";
  try {
    new URL(url);
    return "";
  } catch {
    return "Please enter a valid URL";
  }
};

// Required field validation
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === "") return `${fieldName} is required`;
  return "";
};

// Number validation
export const validateNumber = (value, fieldName, min = 0, max = null) => {
  if (!value) return `${fieldName} is required`;
  const num = parseFloat(value);
  if (isNaN(num)) return `${fieldName} must be a valid number`;
  if (num < min) return `${fieldName} must be at least ${min}`;
  if (max !== null && num > max) return `${fieldName} must be less than ${max}`;
  return "";
};

// Date validation
export const validateDate = (date, fieldName) => {
  if (!date) return `${fieldName} is required`;
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return `${fieldName} must be a valid date`;
  return "";
};

// File validation
export const validateFile = (file, fieldName, maxSize = 5 * 1024 * 1024, allowedTypes = []) => {
  if (!file) return `${fieldName} is required`;
  if (file.size > maxSize) return `${fieldName} must be less than ${maxSize / (1024 * 1024)}MB`;
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return `${fieldName} must be one of: ${allowedTypes.join(', ')}`;
  }
  return "";
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const rule = validationRules[field];
    const value = formData[field];
    
    if (rule.required && !value) {
      errors[field] = `${field} is required`;
    } else if (value) {
      if (rule.email) {
        errors[field] = validateEmail(value);
      } else if (rule.password) {
        errors[field] = validatePassword(value);
      } else if (rule.confirmPassword) {
        errors[field] = validateConfirmPassword(value, formData.password);
      } else if (rule.name) {
        errors[field] = validateName(value, rule.name);
      } else if (rule.minLength) {
        if (value.length < rule.minLength) {
          errors[field] = `${field} must be at least ${rule.minLength} characters long`;
        }
      } else if (rule.maxLength) {
        if (value.length > rule.maxLength) {
          errors[field] = `${field} must be less than ${rule.maxLength} characters long`;
        }
      } else if (rule.pattern) {
        if (!rule.pattern.test(value)) {
          errors[field] = rule.message || `${field} format is invalid`;
        }
      }
    }
  });
  
  return errors;
};

// Real-time validation helper
export const validateField = (value, fieldName, validationType, options = {}) => {
  switch (validationType) {
    case 'email':
      return validateEmail(value);
    case 'password':
      return validatePassword(value);
    case 'name':
      return validateName(value, options.fieldName || fieldName);
    case 'required':
      return validateRequired(value, options.fieldName || fieldName);
    case 'phone':
      return validatePhone(value);
    case 'phoneByCountry':
      return validatePhoneByCountry(value, options.country);
    case 'country':
      return validateCountry(value);
    case 'url':
      return validateUrl(value);
    case 'number':
      return validateNumber(value, options.fieldName || fieldName, options.min, options.max);
    case 'date':
      return validateDate(value, options.fieldName || fieldName);
    case 'file':
      return validateFile(value, options.fieldName || fieldName, options.maxSize, options.allowedTypes);
    default:
      return "";
  }
};
