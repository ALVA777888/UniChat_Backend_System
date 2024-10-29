// utils.js
function validateAlphanumeric(input) {
    const alphanumericPattern = /^[a-zA-Z0-9]*$/;
    return alphanumericPattern.test(input);
}

module.exports = { validateAlphanumeric };
