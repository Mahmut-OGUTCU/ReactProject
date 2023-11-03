// utils.js

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
}

function isValidPhoneNumber(phone) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
}

function isValidTCNumber(tcNo) {
    if (!/^\d{11}$/.test(tcNo)) {
        return false; // 11 haneli olmalı
    }

    const digits = tcNo.split('').map(Number);
    const checksum = digits.reduce((sum, digit, index) => {
        if (index < 10) {
            sum += digit;
        }
        return sum;
    }, 0);

    const lastDigit = digits[10];
    const calculatedLastDigit = (checksum % 10 === 1) ? 0 : (10 - (checksum % 10));

    return lastDigit === calculatedLastDigit;
}


module.exports = { isValidEmail, isValidPhoneNumber, isValidTCNumber };
