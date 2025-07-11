// frontend/src/utils/validation.js
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateMinLength = (value, minLength, fieldName) => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  return null;
};

export const validateMaxLength = (value, maxLength, fieldName) => {
  if (value && value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters long`;
  }
  return null;
};

export const validateNumber = (value, fieldName) => {
  if (value && isNaN(value)) {
    return `${fieldName} must be a valid number`;
  }
  return null;
};

export const validateRange = (value, min, max, fieldName) => {
  const numValue = Number(value);
  if (numValue < min || numValue > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }
  return null;
};

export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = data[field];
    
    fieldRules.forEach(rule => {
      if (errors[field]) return; // Skip if already has error
      
      let error = null;
      
      switch (rule.type) {
        case 'required':
          error = validateRequired(value, rule.message || field);
          break;
        case 'email':
          if (value && !validateEmail(value)) {
            error = rule.message || 'Invalid email format';
          }
          break;
        case 'password':
          if (value) {
            const passwordValidation = validatePassword(value);
            if (!passwordValidation.isValid) {
              error = passwordValidation.errors.join(', ');
            }
          }
          break;
        case 'minLength':
          error = validateMinLength(value, rule.value, rule.message || field);
          break;
        case 'maxLength':
          error = validateMaxLength(value, rule.value, rule.message || field);
          break;
        case 'number':
          error = validateNumber(value, rule.message || field);
          break;
        case 'range':
          error = validateRange(value, rule.min, rule.max, rule.message || field);
          break;
        case 'custom':
          error = rule.validator(value);
          break;
      }
      
      if (error) {
        errors[field] = error;
      }
    });
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};