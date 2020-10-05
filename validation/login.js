const validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateLoginInputs(data) {
    let errors = {};

    // Convert empty fields to empty string to see if any field is empty and then use validator functions on it.
    data.username = !isEmpty(data.username) ? data.username : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    //Username checks
    if (validator.isEmpty(data.username)) {
        errors.username = 'Username field is required';
    }

    //Password checks
    if (validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};