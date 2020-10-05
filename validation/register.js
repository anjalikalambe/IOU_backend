const validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegistrationInput(data) {
    let errors = {};

    //Convert empty fields to an empty string so we can use validator functions 
    data.username = !isEmpty(data.username) ? data.username : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : "";

    // Username checks
    if (validator.isEmpty(data.username)) {
        errors.username = 'Username field is required';
    }

    // Password checks 
    if (validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }
    if (validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = 'Confirm password field is required';
    }
    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'Password must be atleast 6 characters';
    }
    if (!validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = 'Passwords must match';
    }

    return {
        errors,
        isValid: isEmpty(errors) // checks to see if the errors objects has any errors 
    };
};