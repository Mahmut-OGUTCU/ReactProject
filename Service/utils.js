// utils.js
// İlk harfi büyük yapma ve Türkçe karakterleri normalize etme işlevi
const formatString = (val) => {
    isEmptyorNull(val)
    val = val.trim();
    val = val
        .toLowerCase()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    return val;
};
function isValidEmail(val) {
    isEmptyorNull(val)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(val);
}

function isValidPhoneNumber(val) {
    isEmptyorNull(val)
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(val);
}

function phoneNumberFormat(val) {
    isEmptyorNull(val)
    if (typeof val !== 'string') {
        val = val.toString();
    }
    return val.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
}

function isValidTCNumber(val) {
    if (!/^\d{11}$/.test(val)) {
        return false; // 11 haneli olmalı
    }

    const digits = val.split('').map(Number);
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

function isEmptyorNull(val) {
    if (!val)
        return null
    if (val === "")
        return ""
}

module.exports = {
    isValidEmail,
    isValidPhoneNumber,
    isValidTCNumber,
    formatString,
    phoneNumberFormat
};
